#!/usr/bin/env python3
"""Stabilize a video, track an object, crop to follow it, export an animated GIF.

    ./trackgif.py in.mp4
    ./trackgif.py in.mp4 -o out.gif --fps 15 --width 640 --smooth 25
    ./trackgif.py in.mp4 --opencl --trf transforms.trf

Pipeline: stabilize -> ROI selection on frame 1 -> CSRT tracking -> fixed-size
crop centered on the smoothed track -> palettegen/paletteuse GIF.

Stabilization has three settings. The default is the two-pass
vidstabdetect/vidstabtransform pair, which solves one smooth camera path over
the whole clip. `--opencl` swaps in deshake_opencl, a single GPU pass that
matches feature points between neighbouring frames: on 5 seconds of 3840x2160
it ran in 7.8s against 30s for the two vidstab passes, but because it never
sees the whole clip it takes out jitter and leaves slow drift. `--no-stabilize`
tracks the source directly.

`--trf` caches the vidstabdetect pass. Detection reads only the source, so a
second run with a different crop or GIF size can skip it and go straight to the
transform.

OpenCL is deliberately not used for tracking. CSRT searches a window of a few
hundred pixels, so the per-frame upload costs more than the kernels save: 42 fps
on the CPU against 22 through cv2.UMat, measured on these 4K frames.

Requires: ffmpeg built with --enable-libvidstab, and with --enable-opencl for
--opencl. pip install opencv-contrib-python numpy
"""

import argparse
import os
import shutil
import subprocess
import sys
import tempfile

import cv2
import numpy as np

from roipick import pick_roi, snap_to_aspect


def parse_args():
    p = argparse.ArgumentParser(
        formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    p.add_argument("input", help="source video")
    p.add_argument("-o", "--output", help="output gif (default: <input>.gif)")
    p.add_argument("--fps", type=float, default=10.0, help="gif frame rate")
    p.add_argument("--width", type=int, default=480,
                   help="gif width in px, height follows the aspect ratio")
    p.add_argument("--smooth", type=int, default=15,
                   help="moving-average window over tracked centers, in frames")
    p.add_argument("--deadzone", type=float, default=0.0,
                   help="px of drift to ignore before the crop window moves")
    p.add_argument("--box", help="skip the picker, give ROI as x,y,w,h")
    p.add_argument("--aspect", choices=["source", "free"], default="source",
                   help="crop window shape; the picker's 'a' key toggles it")
    p.add_argument("--shakiness", type=int, default=5,
                   help="vidstabdetect shakiness, 1 to 10")
    p.add_argument("--stab-smoothing", type=int, default=30,
                   help="vidstabtransform smoothing, in frames")
    p.add_argument("--trf", help="vidstabdetect transforms file to reuse or write; "
                                 "an existing one skips the detect pass")
    p.add_argument("--opencl", action="store_true",
                   help="stabilize with deshake_opencl on the GPU, one pass")
    p.add_argument("--no-stabilize", action="store_true",
                   help="track the source directly")
    p.add_argument("--tracker", choices=["csrt", "kcf"], default="csrt")
    p.add_argument("--keep", action="store_true",
                   help="keep intermediate files instead of deleting them")
    return p.parse_args()


def run(cmd):
    proc = subprocess.run(cmd)
    if proc.returncode != 0:
        sys.exit(f"command failed: {' '.join(cmd)}")


def stabilize(src, workdir, shakiness, smoothing, trf_path):
    trf = trf_path or os.path.join(workdir, "transforms.trf")
    dst = os.path.join(workdir, "stabilized.mkv")
    if trf_path and os.path.isfile(trf_path) and os.path.getsize(trf_path) > 0:
        print(f"reusing transforms from {trf}, skipping detect")
    else:
        run(["ffmpeg", "-y", "-v", "warning", "-stats", "-i", src,
             "-vf", f"vidstabdetect=shakiness={shakiness}:accuracy=15:result={trf}",
             "-f", "null", "-"])
    run(["ffmpeg", "-y", "-v", "warning", "-stats", "-i", src,
         "-vf", f"vidstabtransform=input={trf}:smoothing={smoothing}:optzoom=1",
         "-an", "-c:v", "ffv1", dst])
    return dst


def stabilize_opencl(src, workdir):
    """One GPU pass. hwupload/hwdownload bracket it because the rest of the
    graph, and OpenCV after it, want frames back in system memory."""
    dst = os.path.join(workdir, "stabilized.mkv")
    run(["ffmpeg", "-y", "-v", "warning", "-stats",
         "-init_hw_device", "opencl=ocl", "-filter_hw_device", "ocl", "-i", src,
         "-vf", "format=yuv420p,hwupload,deshake_opencl,hwdownload,format=yuv420p",
         "-an", "-c:v", "ffv1", dst])
    return dst


def make_tracker(kind):
    return cv2.TrackerCSRT_create() if kind == "csrt" else cv2.TrackerKCF_create()


def smooth_series(values, window):
    if window <= 1:
        return values
    kernel = np.ones(window) / window
    padded = np.pad(values, (window // 2, window // 2), mode="edge")
    return np.convolve(padded, kernel, mode="valid")[:len(values)]


def main():
    args = parse_args()
    out_gif = args.output or os.path.splitext(args.input)[0] + ".gif"
    if not os.path.isfile(args.input):
        sys.exit(f"no such file: {args.input}")

    workdir = tempfile.mkdtemp(prefix="trackgif-")
    try:
        if args.no_stabilize:
            source = args.input
        elif args.opencl:
            source = stabilize_opencl(args.input, workdir)
        else:
            source = stabilize(args.input, workdir, args.shakiness,
                               args.stab_smoothing, args.trf)

        cap = cv2.VideoCapture(source)
        if not cap.isOpened():
            sys.exit(f"cannot open {source}")
        fw = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        fh = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        src_fps = cap.get(cv2.CAP_PROP_FPS) or 30.0

        ok, first = cap.read()
        if not ok:
            sys.exit("empty video")

        aspect_lock = args.aspect == "source"
        if args.box:
            drawn = tuple(float(v) for v in args.box.split(","))
        else:
            drawn, aspect_lock = pick_roi(first, aspect_lock)
            if drawn is None:
                sys.exit("no ROI selected")

        cw, ch, cx0, cy0 = snap_to_aspect(drawn, fw, fh, aspect_lock)
        shape = "source aspect" if aspect_lock else "free aspect"
        print(f"crop window {cw}x{ch} from {fw}x{fh} ({shape})")

        tracker = make_tracker(args.tracker)
        tracker.init(first, tuple(int(v) for v in drawn))

        centers = [(cx0, cy0)]
        lost = 0
        while True:
            ok, frame = cap.read()
            if not ok:
                break
            found, b = tracker.update(frame)
            if found:
                centers.append((b[0] + b[2] / 2, b[1] + b[3] / 2))
            else:
                lost += 1
                centers.append(centers[-1])
        cap.release()
        if lost:
            print(f"tracker lost the subject on {lost} of {len(centers)} frames, "
                  "held last position")

        cx = smooth_series(np.array([c[0] for c in centers]), args.smooth)
        cy = smooth_series(np.array([c[1] for c in centers]), args.smooth)
        xs = np.clip(cx - cw / 2, 0, fw - cw)
        ys = np.clip(cy - ch / 2, 0, fh - ch)

        if args.deadzone > 0:
            for i in range(1, len(xs)):
                if abs(xs[i] - xs[i - 1]) < args.deadzone:
                    xs[i] = xs[i - 1]
                if abs(ys[i] - ys[i - 1]) < args.deadzone:
                    ys[i] = ys[i - 1]
        xs = xs.round().astype(int)
        ys = ys.round().astype(int)

        gif_filter = (
            f"fps={args.fps},scale={args.width}:-1:flags=lanczos,"
            "split[a][b];[a]palettegen=stats_mode=diff[p];"
            "[b][p]paletteuse=dither=bayer:bayer_scale=3"
        )
        ffmpeg = subprocess.Popen(
            ["ffmpeg", "-y", "-v", "warning", "-stats",
             "-f", "rawvideo", "-pix_fmt", "bgr24",
             "-s", f"{cw}x{ch}", "-r", f"{src_fps}", "-i", "-",
             "-filter_complex", gif_filter, "-loop", "0", out_gif],
            stdin=subprocess.PIPE)

        cap = cv2.VideoCapture(source)
        for i in range(len(xs)):
            ok, frame = cap.read()
            if not ok:
                break
            x, y = xs[i], ys[i]
            ffmpeg.stdin.write(frame[y:y + ch, x:x + cw].tobytes())
        cap.release()
        ffmpeg.stdin.close()
        if ffmpeg.wait() != 0:
            sys.exit("gif encoding failed")

        size_mb = os.path.getsize(out_gif) / 1e6
        print(f"wrote {out_gif} ({size_mb:.1f} MB)")
    finally:
        if args.keep:
            print(f"intermediates in {workdir}")
        else:
            shutil.rmtree(workdir, ignore_errors=True)


if __name__ == "__main__":
    main()
