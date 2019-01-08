---
layout: post
status: darft
published: true
title: Volume Limiter
author: Carlos
id: 39
date: '2007-12-24 00:39:00 -0500'
date_gmt: '2007-12-24 07:39:00 -0500'
categories:
- My Projects
tags: []
---
What to do when a young child listens to very loud music on his headphones?

1.  Educate him: by explaining that he must reduce the time he is exposed to loud sounds depending on how loud they are, and how an over exposure to loud sounds could lead to permanent hearing loss. This is the best approach.
2.  Build a headphones volume limiter (i.e. the geeky solution).

I decided to build a volume reducer when my girlfriend told me she bought an inexpensive mp3 player (with no software volume limiter) for her little cousins, and that she learned he always sets the volume as loud as possible when listening to music (which worries his parents).

I had the idea of building a device that would interface with the headphones to the mp3 player (or any other audio device) and that would reduce the volume so it would become impossible to set it too loud.

I see basically two ways of doing this:

1.  To build a device that would clip (easiest) or reduce (trickier) the headphone's signal as soon ans it goes beyond a preset amplitude. I think this can be done with a couple of transistors and would be a good solution.
2.  To build a device that always decreases the volume by reducing the headphone's signal amplitude. This can be easily done with resistors but would waste energy and the volume reduction would vary depending on the headphones impedance.

Since I am a bit short on time (it must be done for Christmas) and since I think educating the child would be a much better solution to this problem, I went with the second design choice: inserting a resistor in series with the headphones in order to decrease the signal amplitude by creating a simple [voltage divide](http://en.wikipedia.org/wiki/Voltage_divider)[r](http://en.wikipedia.org/wiki/Voltage_divider).

## Materials

{% include fig.html img="materials.jpg" caption="" id=page.id %}  
This little project requires very few materials:

*   A couple of resistors. Their value depends on the headphone's impedance.
*   An old lipstick for the casing
*   A piece of perf board. Not really required but helps to make it more robust (it's going to be used by a child, so it must be sturdy)
*   A jack plug and a jack socket.
*   A piece of wire.

## Construction

{% include fig.html img="ss850185.jpg" caption="" id=page.id %}

Simply solder the jack socket to the perf board (which should be cut to fit inside the gutted lipstick ) and put a resistor in series for each channel (left and right). Then connect the jack plug to the resistors and to ground by using the wire.

{% include fig.html img="ss850182.jpg" caption="" id=page.id %}

I drilled a hole on one end of the lipstick so the jack socket would fit tightly and stick out from it. The wire with the jack plug goes out of a hole on the other end of the lipstick.

{% include fig.html img="ss850181.jpg" caption="" id=page.id %}

At first, I chose to use a 10 Ohms resistor for each channel since I figured that the headphone impedance would be around 16 Ohms at DC. Later, I found out that 10 Ohms wasn't enough , so I added another 10 Ohms resistor in series on each channel, making the total resistance per channel 20 Ohms.

This means that with 16 Ohms headphones, the resulting volume would be 16/(16+20) = 44% of the original volume.

I know this volume reduction technique is very wasteful in terms of power and not very elegant, but it works fine and makes the very loud sounds just a bit more tolerable.

Finally, I used some isolating tape to make the construction a bit more resilient to children.

{% include fig.html img="ss850189.jpg" caption="" id=page.id %}