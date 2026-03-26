---
layout: layouts/post.njk
status: public
title: La Cucaracha
author: Carlos
id: 10
date: 2006-10-12T23:43:00-04:00
date_gmt: 2006-10-13T06:43:00-04:00
categories:
  - My Projects
tags: []
---

{% include "archive-banner.njk" %}

\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-

_Update:_ La Cucaracha has got lots of attention lately (mainly thanks to Alan Parekh from [HackedGadgets](http://www2.blogger.com/http//www.hackaday.com/)). I found some of its cousins built by 7 year olds. See them at [ArtBots Robots](http://www.pubgin.com/2006/11/03/artbots-robots-art-bots-made-from-computer-mice/).

\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-

This is a small and very simple robot that requires no electronics. It is inspired on [La Coccinelle](http://beetlerobot.solarbotics.net/index1.htm). They both work according to the same principle, but their bodies and wheels are different. Also mine uses rechargeable batteries so I don't need to buy new ones after just a few hours of usage.

## Materials:

- 2 big plastic bottle caps (much like the [PC Thermometer](http://carlitoscontraptions.com/2006/09/bottle-cap-pc-thermometer/))
- 2 Wire ties
- 1 screw
- 2 DC Motors
- 2 toy wheels
- 1 switch (a small one so it fits on the bottle cap)
- Some cables
- 1 Cable holder
- 1 Rechargeable battery pack w/ charger
- 1 3.5 mm audio jack (male and female)
- 2 paper clips (regular size)
- 2 [SPDT Switches](http://www.rapidonline.com/netalogue/zoomed/Large/78240001.jpg) (commonly found in printers)

## Main Idea

{% fig "cucaracha side.jpg", "" %}

The idea is to construct a robot that can move around and that will backup and change the direction of the motion when it hits an obstacle.

## Putting it together

1.  Cut two diametrically opposite holes on the side of the caps so the motors fit in there. Choose one of the caps as your base cap (the one that goes on the bottom).
2.  Pierce two small holes on the top of the base cap in order to tie the motors to the cap using the small cable ties.
3.  Cut two more holes spaced by about 1.5 cm so the switches fit in tightly (seeing the pictures help visualizing this).
4.  Drill a hole in the center of both caps with the same diameter as your screw.
5.  Install the switch and the female audio jack on the top bottle cap.
    {% fig "cucaracha back.jpg", "" %}
    {% fig "cucaracha close.jpg", "" %}
6.  Connect everything together as shown in the circuit diagram. I used the audio jack to make the charger connection. The charger is simply a 3V power adapter connected in series with a diode in the + terminal.
    {% fig "cuca circuit.jpg", "" %}
    {% fig "cucaracha charging.jpg", "" %}
    {% fig "cucaracha charger.0.jpg", "" %}
7.  Solder the paper clips to the SPDT blades and add a little solder blob on each paper clip end so they look more like antennas.
8.  Test to see if the circuit works properly. When the robot is switched on,  
    both spindles should spin so it goes forward. If an antenna is pushed, the spindle on the opposite side (left spindle if right antenna) should spin backwards.
9.  Fasten the motors to the base cap using the cable ties and secure the other cap on top of it using the screw. Also secure the cable holder using the same screw on top of the top cap, this serves as a battery holder.
    {% fig "plastic clip.jpg", "" %}
10. Insert the toy wheels on each motor spindle. You can also add a piece of plastic for stability under the base cap.

{% fig "cucaracha bottom.jpg", "" %}

It's done! Now you have a small robot that will go around your house bumping on whatever is on its path.

{% fig "cucaracha front.jpg", "" %}
