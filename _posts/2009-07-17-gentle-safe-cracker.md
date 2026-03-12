---
layout: layouts/post.njk
status: public
published: true
title: Gentle Safe Cracker
author: Carlos
id: 79
wordpress_url: http://carlitoscontraptions.com/?p=277
date: 2009-07-17T15:30:44-04:00
date_gmt: 2009-07-17T19:30:44-04:00
categories:
- My Projects
- Robotics
tags:
- Cracking
- Mechanics
---
## The problem:

{% fig "/img/blog/gentle-safe-cracker/img_1437.jpg", "Mysterious Safe Box" %}

I found a little safe box in the garbage some time ago and I would really like to open it. The box features some dents and scratches that show some people tried to open it in the past but did not succeed. Also, when shaken, it produces some interesting noises that indicate it is not empty and may contain a valuable treasure some cool junk.

## The Plan:

Of course, there are many ways of achieving this (e.g. cutting holes into its walls, removing the hinges, hiring a locksmith) but I do not want to break the safe, nor do I want to hire anyone to do it in my place. Inspired by so many movies, the first thing I tried was to listen to the (nonexistent) clicking of the dial as it turns: it did not work at all.

Very quickly, I decided that the appropriate way of doing it (given my set of skills) was to have a machine do it in my place. So, I decided to build a little manipulator that will test all possible combinations of the safe until it opens up.

Since this requires precise positioning, I thought a servo motor would be the best choice of actuator (and also because I have some other project ideas involving servos).

## The Materials:

*   [Pololu Micro Serial Servo Controller](http://www.robotshop.ca/pololu-micro-serial-servo-controller.html "Pololu servo controller")
*   [Hitec HS-425BB Servo Motor](http://www.robotshop.ca/Hitec-HS-425BB-Servo-Motor.html "Hitec HS-425BB Servo Motor")
*   Male and female headers
*   Power adaptor (4 to 6 VDC)
*   Wire
*   Heat shrink tubing
*   [USB to Serial cable](http://www.ftdichip.com/Products/EvaluationKits/TTL-232R.htm)
*   2 gears and a spindle (one four times larger than the other, I got mine from an old photocopier)
*   A project box (in my case, an old computer power supply case)
*   A bottle cap and an old heat sink
*   Steel wire (e.g. from an old coat hanger)
*   Magnets (the stronger the better)
*   Various screws

## Essential Tools

*   Screwdrivers
*   Rotary tool (Dremel)
*   File

## The How and the Why:

{% fig "/img/blog/gentle-safe-cracker/img_1388.jpg", "Electronic Parts" %}

I chose the Pololu servo controller since it is easy to interface by either using a computer or a simple microcontroller. Also, I already own a USB-to-serial cable (that I normally use to program the [Arduino](http://carlitoscontraptions.com/category/arduino/ "Arduino")) that I can use to send commands to the controller.

The choice of the servo motor was based in getting the maximum torque at a reasonable price.

In order to control the servo motor, I devised a simple [python module](http://files.carlitoscontraptions.com/programming/Pololu/lib_pololu.txt "lib_pololu.py") as seen in [my previous post](http://carlitoscontraptions.com/2009/07/pololu-python-library/ "Pololu Library").

Since, usually, servo motors have a motion range slightly greater than 180 deg, I decided to use gears to be able to produce a motion range large enough to operate the safe (at least two full turns).

{% fig "/img/blog/gentle-safe-cracker/safe_cracker.jpg", "Mechanical Parts" %}

I used an old heat sink and cut it with the Dremel in order to produce a bracket for the servo and a mounting hole for the secondary (smallest) gear axle.

I attached the larger gear to the servo directly using the brackets and screws that came bundled with [the motor](http://www.robotshop.ca/Hitec-HS-425BB-Servo-Motor.html "Hitec HS-425BB Servo Motor"). Also, in order to hold the shaft in place, I used [e-style retaining rings](http://www.mcmaster.com/#retaining-rings/=2saqww "e-style retaining ring") and spacers (other dummy gears and shoulder washers) in order to match the grooves already present in the shaft. Of course, I got all these handy mechanical parts from an old photocopier I found in the garbage.

{% fig "/img/blog/gentle-safe-cracker/img_1366.jpg", "Dial coupling attached to the small gear" %}

In order to couple the small gear to the safe dial, I used a bottle cap which fitted perfectly over it. The cap has some child proofing which provided a firm grip for the dial.

{% fig "/img/blog/gentle-safe-cracker/img_1386.jpg", "The Project Box" %}

Once the assembly was done, I mounted it into an old power supply box. Although the box required some drilling and cutting, it was very easy to adapt. I would recommend using this type of boxes for other projects since they are sturdy and easy to machine.

{% fig "/img/blog/gentle-safe-cracker/safe_cracker1.jpg", "Electronic Assembly" %}

So to include the electronic parts into the box, I used a small plastic capsule (that must come from the time when my young brother liked those little toys they sell in a dispensing machine). In the capsule, I placed the Pololu servo controller, the USB to serial cable and the servo motor cable, and the power supply cable.

I needed to adapt the USB to serial cable in order to match the pin-out on the controller. For this, I used a male and a female header, and some wire. I connected the GND and the V+ pins to their respective counterparts, and the TX pin to the Serial-in pin.

In order to supply the appropriate power, I used an old cellphone charger and I replaced its original connector with a female header. As always, it is good practice to isolate the electrical connections with some heat-shrink tubing.

## The (disappointing) outcome

{% fig "/img/blog/gentle-safe-cracker/safe_cracker2.jpg", "Very gentle safe cracker " %}

Once everything was done, I fixed the new little machine to the safe and got ready to get it trying codes. I used a coat hanger and some rare earth magnets in order to hold the cracker firmly in place.

To my great disappointment, I realized that the gears I used provoked a (much expected) torque reduction. This meant that the system is not strong enough for turning the dial to a set position reliably. No matter how much lubricant I used, the dial was too stiff for the little robot.

This represents a (temporary) victory for the safe, but the war is far from being over.

## Epilogue

I decided to publish these results in spite of my failure since too often we read reports of success (notably in science) and often forget that we can learn from failures as well. Never do we read about scientists proving their original hypothesis wrong, but very often, documenting those mistakes could prevent others from doing the same.

Finally, for those wondering how I was planning to pull on the safe lids so it opens, it is remarkably simple: since the safe does not have any handle to latch it closed, I merely need to hang it from its handle and try the codes until it opens and the bottom part goes down.

{% fig "/img/blog/gentle-safe-cracker/img_1391.jpg", "The safe hanging unaware of its fate" %}

Finally (this time for real), I cannot say too much about my next plans on attacking the safe, but be sure that they involve a stepper motor.

## Acknowledgements:

{% fig "www.rob", "RobotShop.com" %}

I would like to thank the great people at [RobotShop](http://www.robotshop.com/ "RobotShop") for providing the [Pololu Micro Serial Servo Controller](http://www.robotshop.ca/pololu-micro-serial-servo-controller.html "Pololu servo controller") and the [Hitec HS-425BB Servo Motor](http://www.robotshop.ca/Hitec-HS-425BB-Servo-Motor.html "Hitec HS-425BB Servo Motor"). As I mentioned [before](http://carlitoscontraptions.com/2009/06/robotshop-carlitos-contraptions/ "RobotShop + Carlitos' Contraptions"), they will be sponsoring a set of projects here at [Carlitos' Contraptions](http://carlitoscontraptions.com/ "Carlitos' Contraptions") in the foreseeable future.

They were also kind enough to quickly ship a [replacement gear set](http://www.robotshop.ca/hitec-hs-422-425-gear-set.html "Hitec HS-422/425 Replacement Resin Gears") when I ruined the original one on the servo motor by hand forcing it to turn (I know, I sound brilliant).