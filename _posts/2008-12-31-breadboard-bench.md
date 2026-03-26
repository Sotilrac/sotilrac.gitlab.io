---
layout: layouts/post.njk
status: public
published: true
title: Breadboard Bench
author: Carlos
id: 66
wordpress_url: http://carlitoscontraptions.com/?p=66
date: 2008-12-31T14:48:00-05:00
date_gmt: 2008-12-31T21:48:00-05:00
categories:
  - Tools
  - My Projects
tags:
  - Electronics
  - Trash
---

{% include "archive-banner.njk" %}

I found a nice breadboard in McGill's garbage a while ago and decided to convert it into an electronics bench. My main goal was to have a powerful power supply with regulated outputs combined with a breadboard and some useful connectors so I can build circuit prototypes easily. Also, I needed a new bench power supply since [mine](http://carlitoscontraptions.com/2006/11/bench-power-supply/ "Bench Power Supply") was lost in the [Lunar Excavator](http://carlitoscontraptions.com/2008/08/lunar-excavator/ "Lunar Excavator") shipment.

{% fig "/img/blog/breadboard-bench/img_1043.jpg", "" %}

## Materials

- A nice breadboard found in the garbage
- A computer power supply
- An ATX motherboard power connector
- Two LEDs with resistors for current limiting
- A switch
- Some cables

## Putting it Together

I wanted to build a modular system so I can replace the pieces easily, especially the power supply (since it comes from an old computer and may not work for very long).

I connected a switch and two LEDs (actually, my switch comes with an integrated light so I used only one LED) to the PS ON, 5V SB, and PWR OK pins so I can have an indicator of the power supply (PS) being plugged-in (D1) and another for the PS being turned ON (D2). The diagram below illustrates the connections.

{% fig "/img/blog/breadboard-bench/atx_diagram.png", "" %}

{% fig "/img/blog/breadboard-bench/img_1045.jpg", "" %}

I also connected the 12, 5, 3.3, 0, -5, and -12 V lines to the bottom-left banana connectors in order to have easy access to the power lines. Now, I can connect any ATX power supply to the box and it will work, which makes replacing a defective power supply very easy.

{% fig "/img/blog/breadboard-bench/img_1048.jpg", "" %}

After making the electrical connections, the switch and LED(s) have to be mounted to the box by drilling appropriate holes.

This was a fairly easy build, with the only difficult part being to find the appropriate materials in the garbage.

I may add a USB hub or some USB connectors as well in order to have more ways of connecting things to the box.
