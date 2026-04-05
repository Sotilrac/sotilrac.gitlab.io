---
layout: layouts/post.njk
status: public
published: true
title: Arduino-controlled RGB LED Mood Cube
author: Carlos
id: 795
wordpress_url: http://carlitoscontraptions.com/?p=795
date: 2011-01-17T01:16:40-05:00
date_gmt: 2011-01-17T05:16:40-05:00
categories:
  - Projects
tags:
  - Carlitos' Project
  - Arduino
  - Rainbowduino
  - RGB
  - LED
---

{% include "archive-banner.njk" %}

As the first Carlitos' Project, I put together a 4x4x4 RGB LED Mood Cube. This cube is composed of 64 RGB LEDs that can generate any colour you can imagine.

{% fig "/img/blog/rgb-led-mood-cube/led-mood-cube-kit.jpg", "RGB LED Mood Cube" %}

The main idea is to display colourful patterns and nice animations in this 3D LED matrix. In order to do so, the LEDs are controlled by a [Rainbowduino](http://www.robotshop.com/ProductInfo.aspx?pc=RB-See-76), the lovechild of an Arduino and an LED driver. The Rainbowduino can power up to 192 LEDs which is exactly the number required for this project (4x4x4x3 = 192).

See the instructional video below if you want to put together a cube of your own. Be prepared to watch me do a lot of soldering at 10x speed.

{% youtube "_-zgh6amwbM#" %}

In order to access the full instructions and documentation for this project please visit the {% wayback "https://web.archive.org/web/20110117074705/http://www.robotshop.com:80/gorobotics/articles/microcontrollers/carlitos-project-rgb-led-mood-cube", "RGB LED Mood Cube project page" %} I put together over at GoRobotics.net.

{% fig "/img/blog/rgb-led-mood-cube/led-mood-cube.jpg", "RGB LED Mood Cube Kit" %}

If you want to make your own cube and are prepared to solder a lot, you might want to have a look at the {% wayback "https://web.archive.org/web/20110119012217/http://www.robotshop.com:80/ProductInfo.aspx?pc=RB-Rbo-87", "full RGB LED Mood Cube Kit" %} we put together at RobotShop.
