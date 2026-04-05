---
layout: layouts/post.njk
status: public
published: true
title: ATmega168 Parallel Programmer
author: Carlos
id: 45
wordpress_url: http://carlitoscontraptions.com/?p=50
date: 2008-05-02T00:26:00-04:00
date_gmt: 2008-05-02T07:26:00-04:00
categories:
  - Tools
tags:
  - ATmega
---

{% include "archive-banner.njk" %}

{% fig "/img/blog/atmega168-parallel-programmer/ss851490.jpg", "" %}

I own a few Rev. C [Bare Bones Boards](http://moderndevice.com/) witch came with ATmega168 chips burned with the old Arduino bootloader (NG). I wanted to upgrade them to the newer (Diecimilia) bootloader so I built a parallel programmer following the instructions in the [Arduino website](http://www.arduino.cc/en/Hacking/ParallelProgrammer) and using parts I found in the garbage (as usual).

## Materials

- Two 470 Ohms resistors
- One 220 Ohms resistor
- Some wire
- A female header at least 3x2
- A ferrite core (not required but looks cool)
- Some heat shrink (it could be replaced by some electrical tape)
- A male parallel port connector (DB-25)

## Programmer Schematics

(this is a [vectorized version](/img/blog/atmega168-parallel-programmer/parallelprogrammer.svg "Parallel Programmer") of the original schematics on the Arduino site)

{% fig "/img/blog/atmega168-parallel-programmer/schematics.png", "" %}

{% fig "/img/blog/atmega168-parallel-programmer/parallelprogrammer.svg", "" %}

## Construction

I got a DB-25 connector from an extension parallel port of a PC I found in the garbage. First, I removed the original cable that came with it and I soldered the programmer's resistors to the back of the DB-25 and connected them to new wires. Then, I covered the resistors and cable connections with a piece of heat shrink tubing.

{% fig "/img/blog/atmega168-parallel-programmer/ss851498.jpg", "" %}

The new wires where terminated in a 4x2 female header (even though there are only 5 wires). The wires and female headers come from an old computer (they connected the power buttons and the case LEDs to the motherboard). I cut the header to size from a larger header (form the same old computer) and I used an extra row to mark it with a white pin cap so I could easily remember where the #1 pin is located.

{% fig "/img/blog/atmega168-parallel-programmer/ss851496-mod.jpg", "" %}

Finally, I added a ferrite core and twisted the cables in order to reduce noise and cross-talk. I don't think this is really required but it looks nice.

{% fig "/img/blog/atmega168-parallel-programmer/ss851494.jpg", "" %}
