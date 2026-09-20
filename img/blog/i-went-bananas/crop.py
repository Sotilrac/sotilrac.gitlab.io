#!/usr/bin/env python3
"""Render a following crop from a track file. All the framing decisions live here.

    ./crop.py track.json -o out.gif
    ./crop.py track.json -o out.gif --smooth 61       # let the framing follow
    ./crop.py track.json -o out.gif --colors 256 --dither bayer:bayer_scale=5 --lossy 0
    ./crop.py track.json -o out.mp4                   # video ignores the gif options

Defaults hold the framing where you drew the box and compress hard: 64 colours,
no dither, gifsicle --lossy=30, which is about a quarter of the file a stock
palettegen/paletteuse pass produces. Raise --smooth if the subject wanders out
of the window; the tool says by how much when it does.

Reads what track.py measured and decides size, smoothing and format, so every
re-render is seconds rather than another tracking pass.

The crop path is not the subject's path. A tracker's box centre is noisy, much
noisier than the camera on handheld footage, so following it directly is what
makes a "tracked" clip look worse than a stabilized one. Instead the subject
path is split into the camera's motion, which is measured from hundreds of
points and so is trustworthy per frame, and the subject's motion relative to it,
which is noisy and only needs to describe slow reframing:

    window[i] = camera[i] + smooth(subject[i] - camera[i])

Smoothing only the second term keeps the reframing from chasing tracker noise
while the window still cancels shake exactly. `--smooth 0` drops the second term
to a constant, which is plain stabilization with a fixed frame.

Measured on the ZOTAC clip, as mean per-frame global motion left in the rendered
output, all at native pixel scale:

    raw source                    [1.90 3.62] px    p95 [5.56 9.64]
    two-pass vidstab              [1.01 2.03] px    p95 [2.71 6.61]
    crop.py --smooth 61           [0.95 1.56] px    p95 [2.46 2.87]
    crop.py --smooth 0            [1.11 1.89] px    p95 [3.00 4.29]
    crop.py --no-stabilize        [1.96 4.14] px    p95 [5.75 12.89]

So following the raw track is indistinguishable from not stabilizing at all,
and the compensated window beats the warp it replaces, without re-encoding a
single 4K frame. What it cannot do is roll: a crop only translates. On this clip
roll was 0.017 deg/frame, worth 0.17 px at a crop corner against 4 px of
translation, so it did not matter. On footage that twists, use trackgif.py.

It also cannot correct slow camera movement, because it cannot tell real
movement from the drift its own camera path accumulates. --shake sets where that
line falls.

Gif size, measured on 120 frames of that clip against the un-quantized frames:

    256 colours, bayer_scale=3      100%   34.0 dB   SSIM 0.936
    256 colours, none, -O3           84%   34.9 dB   SSIM 0.982
     64 colours, none, -O3           48%   31.2 dB   SSIM 0.951
     64 colours, none, --lossy=30    27%   30.4 dB   SSIM 0.880
     32 colours, --lossy=80          18%   27.8 dB   SSIM 0.821

bayer_scale=3 is the worst row on both axes at once, which is why it is no
longer the default: its noise defeats LZW and both metrics punish it. Dropping
to 64 colours halves the file and still scores better than it did.

None of this closes the gap to video. The same frames as h264 or vp9 at the same
size and rate are 0.4 MB against 6.0 MB for the smallest gif here, so a looping
<video> is a better answer than any gif setting when the page allows one.

The window moves through ffmpeg's sendcmd, so frames never leave ffmpeg: no raw
video through a pipe and no lossless intermediate.

Requires: numpy, and ffmpeg. Tracking data comes from track.py.
"""

import argparse
import json
import os
import shutil
import subprocess
import sys
import tempfile

import numpy as np

from roipick import snap_to_aspect


def parse_args():
    p = argparse.ArgumentParser(
        formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    p.add_argument("track", help="track file from track.py")
    p.add_argument("-o", "--output", help="output .gif or video "
                                          "(default: <track>.gif)")
    p.add_argument("--source", help="override the video path recorded in the track")
    p.add_argument("--size", help="crop window WxH (default: from the tracked box)")
    p.add_argument("--aspect", choices=["source", "free"],
                   help="override the crop shape recorded in the track")
    p.add_argument("--smooth", type=int, default=0,
                   help="frames of moving average over the subject track, "
                        "setting how fast the framing may drift; 0 holds the "
                        "framing where you drew the box")
    p.add_argument("--shake", type=int, default=61,
                   help="frames below which camera motion counts as shake and "
                        "gets cancelled. Raising it corrects slower movement but "
                        "lets more of the camera path's accumulated drift in")
    p.add_argument("--deadzone", type=float, default=0.0,
                   help="px of drift to ignore before the window moves")
    p.add_argument("--no-stabilize", action="store_true",
                   help="follow the raw tracked path, camera shake included")
    p.add_argument("--fps", type=float, default=10.0, help="gif frame rate")
    p.add_argument("--colors", type=int, default=64,
                   help="gif palette size; 256 for gradients that band")
    p.add_argument("--dither", default="none",
                   help="gif dither. 'none' is smallest and scores best; use "
                        "bayer:bayer_scale=5 if flat areas band. bayer_scale=3 "
                        "is both bigger and worse, so never that")
    p.add_argument("--lossy", type=int, default=30,
                   help="gifsicle lossy level; 0 is off, 80 is roughly a quarter "
                        "of the file for visible mush")
    p.add_argument("--no-optimize", action="store_true",
                   help="skip the lossless gifsicle -O3 pass")
    p.add_argument("--width", type=int,
                   help="output width in px (default: 480 for gif, native otherwise)")
    p.add_argument("--keep", action="store_true",
                   help="keep the sendcmd script instead of deleting it")
    return p.parse_args()


def smooth(values, window):
    """Moving average along axis 0, edge-padded so the ends do not drift in."""
    if window <= 1:
        return values
    kernel = np.ones(window) / window
    out = np.empty_like(values)
    for i in range(values.shape[1]):
        padded = np.pad(values[:, i], (window // 2, window // 2), mode="edge")
        out[:, i] = np.convolve(padded, kernel, mode="valid")[:len(values)]
    return out


def crop_path(pos, cam, window, stabilize, shake=61):
    """Where to put the crop window on each frame.

    Two separate jobs. Framing comes from the subject track, smoothed over
    `window` frames, or held at the opening framing when `window` is 0. Shake
    correction comes from the camera path, high-passed over `shake` frames.

    The camera path is only trusted above that cutoff because it is a cumulative
    sum of per-frame estimates, so its bias integrates: on the ZOTAC clip it
    drifted 235 px over 1060 frames, against a true subject movement of almost
    none. Feeding it in whole put the window a quarter of a frame off by the end.
    Above the cutoff it is excellent, which is the half worth having.
    """
    if window == 0:
        framing = np.tile(smooth(pos, shake)[0], (len(pos), 1))
    else:
        framing = smooth(pos, window)
    if not stabilize:
        return framing
    return framing + (cam - smooth(cam, shake))


def apply_deadzone(values, threshold):
    held = values.copy()
    for i in range(1, len(held)):
        for axis in (0, 1):
            if abs(held[i, axis] - held[i - 1, axis]) < threshold:
                held[i, axis] = held[i - 1, axis]
    return held


def write_commands(path, xs, ys, times):
    """One sendcmd entry per change, fired just before the frame it belongs to.

    sendcmd applies a command to the first frame whose timestamp has reached it,
    so each entry goes at the midpoint of the gap behind its frame. Firing at the
    frame's own timestamp puts it one frame late whenever floating point rounds
    the wrong way.
    """
    lines, last = [], None
    for i, (x, y) in enumerate(zip(xs, ys)):
        if (x, y) == last:
            continue
        when = 0.0 if i == 0 else (times[i - 1] + times[i]) / 2
        lines.append(f"{when:.6f} crop x {x}, crop y {y};\n")
        last = (x, y)
    with open(path, "w") as fh:
        fh.writelines(lines)
    return len(lines)


def _quote(path):
    """Escape a path for use inside an ffmpeg filter argument."""
    return path.replace("\\", "\\\\").replace("'", r"\'")


def shrink(path, *, optimize=True, lossy=0):
    """Re-pack the gif with gifsicle, in place.

    -O3 is lossless and worth about 5%: it is inter-frame optimization ffmpeg's
    muxer does not do. --lossy perturbs pixels towards ones that compress, which
    is where the real savings are and the only step here that costs quality.
    """
    if not (optimize or lossy) or not shutil.which("gifsicle"):
        if lossy:
            print("  ! --lossy needs gifsicle on PATH; skipping")
        return
    before = os.path.getsize(path)
    cmd = ["gifsicle", "-O3"]
    if lossy:
        cmd.append(f"--lossy={lossy}")
    tmp = path + ".tmp"
    proc = subprocess.run(cmd + [path, "-o", tmp], capture_output=True)
    if proc.returncode != 0 or not os.path.exists(tmp):
        print(f"  ! gifsicle failed, keeping the unoptimized gif")
        return
    os.replace(tmp, path)
    after = os.path.getsize(path)
    note = f"-O3 --lossy={lossy}" if lossy else "-O3"
    print(f"  gifsicle {note}: {before / 1e6:.1f} -> {after / 1e6:.1f} MB "
          f"({100 * after / before:.0f}%)")


def main():
    args = parse_args()
    with open(args.track) as fh:
        track = json.load(fh)

    source = args.source or track["source"]
    if not os.path.isfile(source):
        sys.exit(f"source video not found: {source}\n"
                 "pass --source if it moved")

    out = args.output or os.path.splitext(args.track)[0] + ".gif"
    is_gif = out.lower().endswith(".gif")
    width = args.width if args.width is not None else (480 if is_gif else 0)

    fw, fh, fps = track["width"], track["height"], track["fps"]
    pos = np.array([row[:2] for row in track["subject"]], dtype=float)
    cam = np.array(track["camera"], dtype=float)

    lock = track["aspect_lock"] if args.aspect is None else args.aspect == "source"
    if args.size:
        cw, ch = (int(v) for v in args.size.lower().split("x"))
    else:
        cw, ch, _, _ = snap_to_aspect(track["box"], fw, fh, lock)
    if cw > fw or ch > fh:
        sys.exit(f"crop {cw}x{ch} is larger than the source {fw}x{fh}")

    stabilize = not args.no_stabilize
    if track["camera_source"] == "none" and stabilize:
        print("  ! this track has no camera motion; falling back to --no-stabilize")
        stabilize = False

    path = crop_path(pos, cam, args.smooth, stabilize, args.shake)
    if args.deadzone > 0:
        path = apply_deadzone(path, args.deadzone)

    raw_x, raw_y = path[:, 0] - cw / 2, path[:, 1] - ch / 2
    xs = np.clip(raw_x, 0, fw - cw)
    ys = np.clip(raw_y, 0, fh - ch)
    clamped = int(np.sum((raw_x != xs) | (raw_y != ys)))

    # Predicted, not measured: this is what the output should look like if the
    # camera path is right, and it is computed from that same path, so it cannot
    # catch a wrong one. Measure the rendered file to check it.
    held = np.stack([xs + cw / 2, ys + ch / 2], axis=1)
    bg = np.std(np.diff(cam - held, axis=0), axis=0)
    subject = np.std(np.diff(pos - held, axis=0), axis=0)
    print(f"crop {cw}x{ch} from {fw}x{fh}, {len(pos)} frames, "
          f"{'stabilized' if stabilize else 'raw follow'}, smooth {args.smooth}")
    print(f"  predicted residual per frame: background {bg.round(2)} px, "
          f"tracker noise {subject.round(1)} px")
    off = pos - held
    worst = float(np.max(np.abs(off) / np.array([cw, ch])))
    print(f"  subject wanders {off[:, 0].min():+.0f}..{off[:, 0].max():+.0f} px across "
          f"and {off[:, 1].min():+.0f}..{off[:, 1].max():+.0f} px down from the "
          f"window centre ({worst:.0%} of the window)")
    if worst > 0.15:
        print("    raise --smooth to let the framing follow it"
              if args.smooth == 0 else
              "    lower --smooth to follow it more closely, or use a larger --size")
    if clamped:
        pct = 100 * clamped / len(pos)
        print(f"  ! window hit the frame edge on {clamped} frames ({pct:.0f}%); "
              "shake leaks back in there, so use a smaller --size")
    if track["lost"]:
        print(f"  ! tracker had lost the subject on {track['lost']} frames")

    times = track.get("pts")
    if times is None or len(times) < len(pos):
        print("  ! this track has no frame timestamps; falling back to the "
              "container's nominal rate, which is wrong on variable-rate phone "
              "video. Re-run track.py to fix it.")
        times = [i / fps for i in range(len(pos))]

    workdir = tempfile.mkdtemp(prefix="crop-")
    cmds = os.path.join(workdir, "cmds.txt")
    try:
        n = write_commands(cmds, xs.round().astype(int), ys.round().astype(int), times)
        chain = [f"sendcmd=f='{_quote(cmds)}'",
                 f"crop={cw}:{ch}:{int(xs[0])}:{int(ys[0])}"]
        if is_gif:
            chain.append(f"fps={args.fps}")
        if width:
            chain.append(f"scale={width}:-2:flags=lanczos")
        graph = ",".join(chain)
        if is_gif:
            graph += (f",split[a][b];"
                      f"[a]palettegen=max_colors={args.colors}:stats_mode=diff[p];"
                      f"[b][p]paletteuse=dither={args.dither}:diff_mode=rectangle")
            codec = ["-loop", "0"]
        else:
            codec = ["-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p"]

        print(f"  {n} window moves; encoding")
        proc = subprocess.run(["ffmpeg", "-y", "-v", "warning", "-stats",
                               "-i", source, "-filter_complex", graph,
                               "-an", *codec, out])
        if proc.returncode != 0:
            sys.exit("ffmpeg failed")
        if is_gif:
            shrink(out, optimize=not args.no_optimize, lossy=args.lossy)
        print(f"wrote {out} ({os.path.getsize(out) / 1e6:.1f} MB)")
    finally:
        if args.keep:
            print(f"sendcmd script in {cmds}")
        else:
            subprocess.run(["rm", "-rf", workdir])


if __name__ == "__main__":
    main()
