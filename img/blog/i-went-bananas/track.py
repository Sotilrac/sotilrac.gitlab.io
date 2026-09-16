#!/usr/bin/env python3
"""Measure where the subject goes and where the camera goes. Decide nothing else.

    ./track.py in.mp4 -o track.json
    ./track.py in.mp4 --box 1300,940,1140,550 --padding 6
    ./track.py in.mp4 --camera trf --trf transforms.trf

Writes one JSON file with, per frame, the subject's box and how far the image
content has shifted since frame 0. Framing, size, smoothing and output format
are crop.py's business, so re-rendering costs nothing after this pass.

Why the camera path is here at all: a crop cannot stabilize on its own. Place
the window at the subject's smoothed position and the shake stays in both the
subject and the background, because the tracked position is the sum of the two.
Subtract the camera path before smoothing and add it back when placing the
window, and it cancels in both. crop.py does that with these numbers.

The camera path comes from tracking features across the whole frame, which is
what a stabilizer already does internally. `--camera lk` (the default) finds
corners and follows them with Lucas-Kanade, on downscaled grey, in the same
decode pass as the subject, at about 240 fps. `--camera trf` instead reads the
motion field vidstabdetect leaves in its .trf file, which stores a few hundred
local motion vectors per frame: worth using when you have already paid for that
pass. On the ZOTAC clip the two agreed to within 5% (travel [263 327] px against
[249 321], shake [1.9 4.1] against [1.8 4.0]), which is the only reason to trust
either of them.

Both estimate translation only. Camera roll needs a warp, which means
trackgif.py and vidstabtransform.

Requires: pip install opencv-contrib-python numpy
"""

import argparse
import json
import os
import re
import sys
import time

import cv2
import numpy as np

from roipick import pick_roi, snap_to_aspect

LM = re.compile(r"\(LM (-?\d+) (-?\d+) ")
FRAME = re.compile(r"^Frame (\d+) \(List (\d+) \[(.*)\]\)\s*$")


def parse_args():
    p = argparse.ArgumentParser(
        formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    p.add_argument("input", help="source video")
    p.add_argument("-o", "--output", help="track file (default: <input>.track.json)")
    p.add_argument("--box", help="skip the picker, give ROI as x,y,w,h")
    p.add_argument("--aspect", choices=["source", "free"], default="source",
                   help="crop shape to record; the picker's 'a' key toggles it")
    p.add_argument("--tracker", choices=["csrt", "kcf"], default="csrt")
    p.add_argument("--padding", type=float, default=3.0,
                   help="CSRT search window, as a multiple of the target. "
                        "Widening it is a trap: at 6.0 on this footage the "
                        "tracker's centre noise went from 26 to 87 px/frame "
                        "and it ran 5x slower, because a bigger window is more "
                        "room to latch onto the wrong thing")
    p.add_argument("--camera", choices=["lk", "trf", "none"], default="lk",
                   help="how to measure camera motion")
    p.add_argument("--trf", help="vidstabdetect .trf file, for --camera trf")
    p.add_argument("--camera-scale", type=float, default=0.25,
                   help="downscale factor for Lucas-Kanade; smaller is faster")
    p.add_argument("--max-frames", type=int, help="stop after this many frames")
    return p.parse_args()


def camera_from_trf(path, frames):
    """Median local motion per frame, from vidstabdetect's own measurements.

    Each line is `Frame N (List K [(LM dx dy x y size contrast match),...])`,
    where dx,dy is how that patch of image moved since the previous frame. The
    median over a few hundred patches is a robust global estimate; the outliers
    it discards are the moving subject.
    """
    shifts = [(0.0, 0.0)]
    with open(path) as fh:
        for line in fh:
            m = FRAME.match(line)
            if not m:
                continue
            motions = LM.findall(m.group(3))
            if not motions:
                continue
            d = np.array(motions, dtype=float)
            shifts.append((float(np.median(d[:, 0])), float(np.median(d[:, 1]))))
    if len(shifts) < frames:
        print(f"  ! {path} covers {len(shifts)} frames, video has {frames}; "
              "padding with zeros", flush=True)
        shifts += [(0.0, 0.0)] * (frames - len(shifts))
    return np.cumsum(np.array(shifts[:frames]), axis=0)


def lk_shift(prev, cur, scale):
    """One frame of camera motion: corners in `prev`, followed into `cur`."""
    pts = cv2.goodFeaturesToTrack(prev, maxCorners=400, qualityLevel=0.01,
                                  minDistance=8, blockSize=7)
    if pts is None or len(pts) < 8:
        return 0.0, 0.0
    nxt, status, _ = cv2.calcOpticalFlowPyrLK(prev, cur, pts, None,
                                              winSize=(21, 21), maxLevel=3)
    good = status.ravel() == 1
    if good.sum() < 8:
        return 0.0, 0.0
    d = (nxt[good] - pts[good]).reshape(-1, 2)
    return float(np.median(d[:, 0])) / scale, float(np.median(d[:, 1])) / scale


def make_tracker(kind, padding):
    if kind == "kcf":
        return cv2.TrackerKCF_create()
    params = cv2.TrackerCSRT_Params()
    params.padding = padding
    return cv2.TrackerCSRT_create(params)


def main():
    args = parse_args()
    if not os.path.isfile(args.input):
        sys.exit(f"no such file: {args.input}")
    out_path = args.output or os.path.splitext(args.input)[0] + ".track.json"
    if args.camera == "trf" and not args.trf:
        sys.exit("--camera trf needs --trf pointing at a vidstabdetect file")

    cap = cv2.VideoCapture(args.input)
    if not cap.isOpened():
        sys.exit(f"cannot open {args.input}")
    fw = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    fh = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0

    ok, first = cap.read()
    if not ok:
        sys.exit("empty video")

    aspect_lock = args.aspect == "source"
    if args.box:
        box = tuple(float(v) for v in args.box.split(","))
    else:
        box, aspect_lock = pick_roi(first, aspect_lock)
        if box is None:
            sys.exit("no ROI selected")
    cw, ch, _, _ = snap_to_aspect(box, fw, fh, aspect_lock)
    print(f"source {fw}x{fh} @ {fps:.3f} fps, crop would be {cw}x{ch}")

    tracker = make_tracker(args.tracker, args.padding)
    tracker.init(first, tuple(int(v) for v in box))

    use_lk = args.camera == "lk"
    scale = args.camera_scale

    def grey(frame):
        small = cv2.resize(frame, None, fx=scale, fy=scale)
        return cv2.cvtColor(small, cv2.COLOR_BGR2GRAY)

    prev = grey(first) if use_lk else None
    subject = [[box[0] + box[2] / 2, box[1] + box[3] / 2, box[2], box[3], 1]]
    steps = [(0.0, 0.0)]
    # Real presentation timestamps, not frame_index / fps. This phone writes a
    # container whose avg_frame_rate (36.508) disagrees with its actual 30.19 ms
    # frame spacing (33.12 fps), and driving ffmpeg's sendcmd off the nominal
    # rate put the crop window 10% out by the end of the clip.
    pts = [cap.get(cv2.CAP_PROP_POS_MSEC) / 1000.0]
    lost = 0
    started = time.perf_counter()

    while args.max_frames is None or len(subject) < args.max_frames:
        ok, frame = cap.read()
        if not ok:
            break
        pts.append(cap.get(cv2.CAP_PROP_POS_MSEC) / 1000.0)
        found, b = tracker.update(frame)
        if found:
            subject.append([b[0] + b[2] / 2, b[1] + b[3] / 2, b[2], b[3], 1])
        else:
            lost += 1
            subject.append(subject[-1][:4] + [0])
        if use_lk:
            cur = grey(frame)
            steps.append(lk_shift(prev, cur, scale))
            prev = cur
        if len(subject) % 100 == 0:
            rate = len(subject) / (time.perf_counter() - started)
            print(f"  {len(subject)} frames, {rate:.1f} fps", flush=True)
    cap.release()

    frames = len(subject)
    if args.camera == "trf":
        camera = camera_from_trf(args.trf, frames)
    elif use_lk:
        camera = np.cumsum(np.array(steps), axis=0)
    else:
        camera = np.zeros((frames, 2))

    elapsed = time.perf_counter() - started
    shake = np.std(np.diff(camera, axis=0), axis=0) if frames > 1 else np.zeros(2)
    travel = camera.max(axis=0) - camera.min(axis=0)
    spacing = np.diff(pts)
    measured_fps = 1.0 / np.median(spacing) if len(spacing) else fps
    print(f"{frames} frames in {elapsed:.1f}s ({frames / elapsed:.1f} fps), "
          f"{lost} lost")
    if abs(measured_fps - fps) > 0.01:
        print(f"  ! container says {fps:.3f} fps, frame timestamps say "
              f"{measured_fps:.3f}; using the timestamps")
    print(f"camera ({args.camera}): shake {shake.round(1)} px/frame, "
          f"travel {travel.round(0)} px")
    if lost:
        print(f"  ! tracker lost the subject on {lost} frames; those hold the "
              "last known position and are marked found=0")

    payload = {
        "source": os.path.abspath(args.input),
        "width": fw, "height": fh, "fps": fps, "frames": frames,
        "measured_fps": round(float(measured_fps), 4),
        "pts": [round(float(t), 6) for t in pts],
        "box": [round(v, 2) for v in box],
        "aspect_lock": aspect_lock,
        "tracker": args.tracker, "padding": args.padding,
        "camera_source": args.camera,
        "lost": lost,
        "subject": [[round(v, 2) for v in row[:4]] + [row[4]] for row in subject],
        "camera": [[round(float(x), 3), round(float(y), 3)] for x, y in camera],
    }
    with open(out_path, "w") as fh:
        json.dump(payload, fh)
    print(f"wrote {out_path} ({os.path.getsize(out_path) / 1e3:.0f} kB)")


if __name__ == "__main__":
    main()
