---
layout: layouts/post.njk
status: public
published: true
title: Arduino POV Prototype - Part 2
author: Carlos
id: 36
date: 2007-08-18T21:15:00-04:00
date_gmt: 2007-08-19T04:15:00-04:00
categories:
  - My Projects
  - Arduino
tags: []
---

{% include "archive-banner.njk" %}

I polished up the code for my [Arduino POV display](http://carlitoscontraptions.blogspot.com/2007/08/arduino-pov-prototype.html) and I think it is now ready to be shown to the world!

The source code for the POV display can be downloaded [here](http://carlos.asmat.googlepages.com/POV_0_01.pde).

The parameters in the code can be changed in order to display other images besides of the default arrows.

## Data

The displayed image is stored in the data string. Each drawing is divided in frames (i.e. one frame for each letter of a word) and each frame is divided in columns. The image to be displayed must be encoded into 1s (ON) and 0s (OFF) and each value must be stored in the data string in the order illustrated below.

{% fig "/img/blog/arduino-pov-prototype-part-2/format.png", "" %}

The duration of each column (i.e. how much time they stay ON), the spacing between frames and the spacing between images are set respectively by the integers timer1, timer2 and timer3. Keep in mind that their values depend on the rotation speed.

Finally, the number of frames and their length is set respectively by frame_num and frame_len.

## Arrow (>):

- timer1: 3
- timer2: 15
- timer3: 0
- data: {1,0,0,0,0,1, 1,1,0,0,1,1, 0,1,1,1,1,0, 0,0,1,1,0,0}
- frame_len: 4
- frame_num: 1

{% fig "/img/blog/arduino-pov-prototype-part-2/arrow.jpg", "" %}

## "Alan":

- timer1: 3
- timer2: 15
- timer3: 13
- data: {1,1,1,1,1,1, 1,0,0,1,0,0, 1,0,0,1,0,0, 1,1,1,1,1,1, 1,1,1,1,1,1, 0,0,0,0,0,1, 0,0,0,0,0,1, 0,0,0,0,0,1, 1,1,1,1,1,1, 1,0,0,1,0,0, 1,0,0,1,0,0, 1,1,1,1,1,1, 1,1,1,1,1,1, 0,1,1,0,0,0, 0,0,0,1,1,0, 1,1,1,1,1,1}
- frame_len: 4
- frame_num: 4

{% fig "/img/blog/arduino-pov-prototype-part-2/alan.jpg", "" %}

## Sinewave (or flower):

- timer1: 3
- timer2: 3
- timer3: 0
- data: {0,0,1,0,0,0, 0,1,0,0,0,0, 1,0,0,0,0,0, 1,0,0,0,0,0, 0,1,0,0,0,0, 0,0,1,0,0,0, 0,0,0,1,0,0, 0,0,0,0,1,0, 0,0,0,0,0,1, 0,0,0,0,0,1, 0,0,0,0,1,0, 0,0,0,1,0,0}
- frame_len: 12
- frame_num: 1

{% fig "/img/blog/arduino-pov-prototype-part-2/sine.jpg", "" %}

## E = MC²:

- timer1: 2
- timer2: 10
- timer3: 22
- data: {1,1,1,1,1,1, 1,0,0,1,0,1, 1,0,0,1,0,1, 1,0,0,1,0,1, 1,0,0,1,0,1, 0,0,0,1,0,1, 0,0,0,1,0,1, 0,0,0,1,0,1, 0,0,0,1,0,1, 0,0,0,1,0,1, 1,1,1,1,1,1, 0,1,0,0,0,0, 0,0,1,0,0,0, 0,1,0,0,0,0, 1,1,1,1,1,1, 0,1,1,1,1,0, 1,0,0,0,0,1, 1,0,0,0,0,1, 1,0,0,0,0,1, 0,1,0,0,1,0, 0,1,0,0,1,0, 1,0,0,1,1,0, 1,0,1,0,1,0, 0,1,0,0,1,0, 0,0,0,0,0,0}
- frame_len: 5
- frame_num: 5

{% fig "/img/blog/arduino-pov-prototype-part-2/e_mc2.jpg", "" %}
