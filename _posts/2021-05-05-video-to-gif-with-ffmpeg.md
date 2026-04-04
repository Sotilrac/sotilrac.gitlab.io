---
layout: layouts/post.njk
status: public
author: Carlos
title: Convert Video to GIF with ffmpeg
date: 2021-05-05T22:35:00-04:00
categories:
  - TIL
tags:
  - linux
  - ffmpeg
---

A good-looking GIF with an optimized 256-colour palette:

```bash
ffmpeg -i input.mp4 -ss 4.0 -t 54.0 -filter_complex \
  "[0:v] fps=6,scale=w=480:h=-1,split [a][b]; \
   [a] palettegen=stats_mode=single [p]; \
   [b][p] paletteuse=new=1" output.gif
```

- `-ss` seeks to the start time
- `-t` sets the duration

For a smaller (but uglier) output, skip the palette optimization:

```bash
ffmpeg -i input.mp4 -ss 4.0 -t 54.0 -filter_complex \
  "[0:v] fps=6,scale=w=480:h=-1" output.gif
```

Source: [engineering.giphy.com](https://engineering.giphy.com/how-to-make-gifs-with-ffmpeg/)
