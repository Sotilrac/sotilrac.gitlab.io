---
layout: layouts/post.njk
status: public
author: Carlos
title: "Download YouTube Videos"
date: 2026-04-06T23:35:05-04:00
categories:
  - TIL
tags:
  - linux
  - python
  - video
---

`yt-dlp` is an open-source CLI tool that grabs the DASH streams from YouTube directly and muxes them into an MP4.

## Setup

Create a virtual environment and install:

```bash
python3 -m venv ~/yt-dlp-env
source ~/yt-dlp-env/bin/activate
pip install yt-dlp
```

## Download a video

```bash
yt-dlp -f "bestvideo+bestaudio" --merge-output-format mp4 "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```

This downloads the highest quality video and audio tracks separately, then merges them into a single MP4. It requires `ffmpeg` on your PATH for the merge step (`sudo apt install ffmpeg`).

## List available formats

```bash
yt-dlp -F "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```

This prints a table of every available stream (resolution, codec, bitrate, file size). Pick a specific one with `-f FORMAT_CODE` if you don't want the largest file.

## How it works

YouTube serves video using DASH (Dynamic Adaptive Streaming over HTTP). Instead of a single file, the video is split into separate audio and video tracks at multiple quality levels. `yt-dlp` parses the player page to extract the DASH manifest, downloads the best tracks, and calls `ffmpeg` to combine them.
