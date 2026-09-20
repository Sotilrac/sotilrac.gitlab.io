#!/usr/bin/env bash
# Encode a web clip for the {% clip %} shortcode: MP4, WebM and a poster frame.
#
#   _tools/make-clip.sh master.mp4 img/blog/my-post/thing
#
# Writes <base>.mp4, <base>.webm and <base>.jpg. Both encodes are silent: `-an`
# drops any audio track, which matters beyond etiquette, because an audio track
# is what puts the browser on its "autoplay with sound" path, and that one is
# blocked until the visitor has interacted with the site.
set -euo pipefail

if [ $# -lt 2 ]; then
  sed -n '2,8p' "$0" >&2
  exit 1
fi

src=$1
base=$2
width=${WIDTH:-960}
fps=${FPS:-30}
crf_mp4=${CRF_MP4:-30}
crf_webm=${CRF_WEBM:-44}

mkdir -p "$(dirname "$base")"

# `fps` caps rather than sets: -r would duplicate frames on slower footage.
scale="fps=fps='min(source_fps,$fps)',scale=$width:-2:flags=lanczos"

ffmpeg -y -v warning -stats -i "$src" -vf "$scale" \
  -c:v libx264 -crf "$crf_mp4" -preset slow -pix_fmt yuv420p \
  -movflags +faststart -an "$base.mp4"

ffmpeg -y -v warning -stats -i "$src" -vf "$scale" \
  -c:v libvpx-vp9 -crf "$crf_webm" -b:v 0 -row-mt 1 -an "$base.webm"

# The poster is what a visitor sees when autoplay is refused (iOS Low Power
# Mode, Firefox set to block all media), so it comes from a frame with the
# subject already in it rather than from a black first frame.
ffmpeg -y -v warning -i "$src" -vf "$scale,select=eq(n\,${POSTER_FRAME:-0})" \
  -frames:v 1 -update 1 -q:v 4 "$base.jpg"

for f in "$base.mp4" "$base.webm" "$base.jpg"; do
  printf '%-52s %8s\n' "$f" "$(du -h "$f" | cut -f1)"
done
