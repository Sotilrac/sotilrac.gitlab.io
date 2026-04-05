---
layout: layouts/post.njk
status: public
published: true
title: Hands On the iModela Mini CNC Mill
author: Carlos
id: 1157
wordpress_url: http://carlitoscontraptions.com/?p=1157
date: 2012-05-31T19:01:05-04:00
date_gmt: 2012-05-31T23:01:05-04:00
categories:
  - Projects
tags:
  - iModela
  - Roland
  - Deadmau5
  - CNC
---

{% include "archive-banner.njk" %}

I was very lucky to get my hands on an [iModela mini CNC Router](http://www.rolanddga.com/products/milling/imodela/) from [Roland](http://www.rolanddga.com/). I tested the unit for a few months now and I am terribly late for making a post about it but I believe it is better to share the information late rather than not sharing it at all.

This is a very small USB milling machine aimed at hobbyists. It uses Tamiya motors and gears and feels very sturdy and well made. I was happy to see that it can be completely disassembled and that Roland lists a full list of replacements parts you can use to service it. After some experimentation I found the precision to be quite impressive at 0.01 mm.

Unfortunately the software works only on Windows and it has very few features.

I filmed the unboxing but unfortunately the video got corrupted so I re-shot another video showing all the parts as you can see below.

{% youtube "sEzx4lhZsSo" %}

Very quickly, my brother and I drew a simple shape and were cutting in no time. You can see the cutting process below and download the [Deadmau5 model at Thingverse](http://www.thingiverse.com/thing:16391).

{% fig "/img/blog/imodela-mini-cnc-mill/deadmau5-imodela-cutout.jpg", "Deadmau5 iModela cutout" %}

Cutting this shape took roughly an hour and the end-result is very precise. The picture above might not show this but it is important to note we cut this on a scrap piece of plastic. See the machine in action in the video below.

{% youtube "74NGqpqrkRc" %}

## Quick impressions

- The machine is very slow. This is understandable because of its small size, but it can take forever (>4 hours) to make a simple model.
- The software is terrible and Windows-only on top of that. Fortunately, it seems it can be used with Linux CNC drivers but I have not tested that yet. In the meantime, you will be happy to learn it is possible to paste from Inkscape into the software in order to mill more complex paths.
- The router motor gets very hot and although the machine seems to be able to run like this for a while, I use an external fan on it in order to cool it down.
- The precision and accuracy are truly impressive.
