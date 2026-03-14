---
layout: layouts/post.njk
status: public
published: true
title: The Battery Problem
author: Carlos
id: 40
date: 2007-12-26T21:20:00-05:00
date_gmt: 2007-12-27T04:20:00-05:00
categories:
- My Projects
tags: []
---
{% include "archive-banner.njk" %}

{% fig "ss850292.jpg", "" %}

Many devices require batteries but do not absolutely require to be absolutely portable. Since batteries are expensive and don't last for very long, 
it could be a would idea to add a wall power adapter connector to such devices. This would allow you to use the electricity from the mains to power a usually battery powered device.

I did precisely that to my new Air Hog helicopter I got for Christmas (I now, I'm a bit old for toys, but although I did not ask for it, I'm got I got it ). This small helicopter is lots of fun, but batteries (at least the rechargeable alkaline I use) last for about two flights (the helicopter must be charges by the remote in order to be able to fly for about 20 minutes).

Adding a power adapter connection to some device doesn't require many materials. You only need: a power adapter (duh), its corresponding connector, and some wire.

Once you have all materials, simply locate the ground and V+ nodes on the circuit (usually the black and red wires respectively) and solder the connector to them. Then make a nice hole on the device to make it stick out if necessary and you're ready to go.

{% fig "ss850276.jpg", "" %}

{% fig "ss850281.jpg", "" %}

{% fig "ss850282.jpg", "" %}

Make sure your power adapter matches the voltage of the device and always verify all voltages with a voltmeter. If you exceed the expected voltage levels for the device you can be pretty sure to fry it.

{% fig "ss850298.jpg", "" %}

(note the cool paper counterweight on the helicopter's nose)
