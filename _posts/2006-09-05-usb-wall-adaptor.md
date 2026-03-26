---
layout: layouts/post.njk
status: public
title: USB Wall Adaptor
author: Carlos
id: 5
date: 2006-09-05T17:02:00-04:00
date_gmt: 2006-09-06T00:02:00-04:00
categories:
  - My Projects
tags: []
---

{% include "archive-banner.njk" %}

This is a very simple wall adaptor that allows to power USB devices without the need of a computer (e.g. for recharging).

I built this adaptor very quickly since I needed to charge my Sony Clié SJ30 (that I got at the same time and from the same person as the [Palm IIIc](http://carlitoscontraptions.com/2006/08/overhauling-palm-iiic/)) in my bedroom (far from my computer) since I use it as an alarm clock (among other things).

## Materials:

- A USB female connector I found in a computer in the garbage.
- A 5V power adaptor for a cell phone (also found in the garbage).
- A bottle of soap.

{% fig "/img/blog/usb-wall-adaptor/usb-plug.jpg", "USB Plug" %}

Cut the cell phone connector and solder a new connector (compatible with the USB connector that you have) or simply solder the adaptors wires directly to the USB ports. Since I have two USBs, I soldered two connectors.

{% fig "/img/blog/usb-wall-adaptor/usb-and-cable.jpg", "" %}

In the end, the +5V wire (usually red) should be connected to Pin 1 and the ground wire (usually black) should be connected to Pin 4 of the USB connector (see the details for the [USB standards](http://en.wikipedia.org/wiki/Universal_Serial_Bus)).

Build a case using a bottle of soap (or any other source of cheap plastic) in order to make the device a bit more robust and aesthetically pleasant. I made sure to do a loose knot in the cable to impede the small connections from breaking if an excessive tension is applied to it.

{% fig "/img/blog/usb-wall-adaptor/usb-wall-adapter.jpg", "" %}

This is a very cheap (actually free if you're lucky) wall adaptor for USB devices.

I'm planning to improve this device by adding an LED that will tell whether it's plugged or not and by making a nicer and smaller case for it.</p>
