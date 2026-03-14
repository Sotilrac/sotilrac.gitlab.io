---
layout: layouts/post.njk
status: public
published: true
title: Speech-Controlled Arduino Robot
author: Carlos
id: 888
wordpress_url: http://carlitoscontraptions.com/?p=888
date: 2011-03-13T16:14:47-04:00
date_gmt: 2011-03-13T20:14:47-04:00
categories:
- Arduino
tags:
- Carlitos' Project
- Arduino
- Nao
- Xbee
---
{% include "archive-banner.njk" %}

For the second [Carlitos' Project](http://carlitoscontraptions.com/tag/carlitos-project/), I wanted to do something a bit more "useful" than pretty lights. So I decided that a speech controlled Arduino robot should be interesting enough as a project.

{% fig "carlitoscontraptions.com", "Speech-Controlled Arduino Robot" %}

For this project, I used the DFRobotShop Rover (a mobile Arduino kit), the VRbot speech recognition module by Veear, two XBee modules, an Arduino Uno, two XBee shields and some other components. See the video below to learn how to do your own.

{% youtube "cKY9tpxtkvE" %}

In order to get more information about the project, the required tools, materials and code, please visit the [Speech-Controlled Arduino Robot project page](http://www.robotshop.com/gorobotics/articles/microcontrollers/carlitos-projects-speech-controlled-arduino-robot) at GoRobotics.net. The code is also available over there.

If you are interested in making your own, have a look at the [kit we put together with RobotShop](http://www.robotshop.com/ProductInfo.aspx?pc=RB-Rbo-89).

## So what about Nao?

I have been terribly Nao-centric for a while and this is not going to change today. While programming the robot, it can become very frustrating to say the commands over and over again. For this reason and also in order to produce a perfectly repeatable input, I programmed Nao 1337 to say the commands for me (yes, I am lazy, I know). See the video below to see how Nao performed.


{% youtube "z53sp8LmMx8" %}
