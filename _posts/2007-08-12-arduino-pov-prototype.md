---
layout: post
status: darft
published: true
title: Arduino POV Prototype
author: Carlos
id: 34
date: '2007-08-12 21:03:00 -0400'
date_gmt: '2007-08-13 04:03:00 -0400'
categories:
- My Projects
- Arduino
tags: []
---
This is my first attempt to create a [persistence of vision](http://en.wikipedia.org/wiki/Persistence_of_vision) (POV) display using the Arduino. The ultimate goal is to mount it on my bike wheel and have it display nice things while I ride. But, for now, it consist of an array of 6 LEDs mounted on a turning rig I made from scrap material.

## Materials for the rig:

*   2 old cell phone batteries (found in the garbage) that serve as a counterweight
*   A piece of metal (from an old photocopier) that constitutes the turning blade
*   A fan motor from some sort of broken power supply I found in the [UdeM](http://www.umontreal.ca/) garbage
*   A piece of plastic that makes the base (also from the photocopier)
*   A plastic poster edge (the things used to hold paper posters) that I found in the garbage (it is used to cover the sharp edges of the blade).
*   A heavy metal block that stabilizes the contraption (since it tends to oscillate a bit when it's turning)
*   A cable with a switch from an IKEA lamp I found in the garbage
*   Lots of cable ties

## Materials for the POV circuit:

*   A small breadboard (it came with an electronics magazine)
*   6 red high power LEDs
*   6 1 k Ohms resistors
*   A 9V battery w/ battery older

I think the pictures are pretty self explanatory.

{% include fig.html img="Turning+rig.JPG" caption="" id=page.id %}

The LEDs are directly connected to the pins 2 to 7 of the Arduino and their current is limited by the resistors.  
The entire circuit is powered by the 9V battery.

So far I have done some simple patterns for the display and I'll upload the code soon (it still needs some polish)

{% include fig.html img="pattern+1.JPG" caption="" id=page.id %}

I expect to add more LEDs to the design as soon as I get the patterns and the overall code working fine.