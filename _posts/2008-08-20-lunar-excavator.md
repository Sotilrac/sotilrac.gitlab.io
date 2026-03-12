---
layout: layouts/post.njk
status: draft
published: true
title: Lunar Excavator
author: Carlos
id: 54
date: 2008-08-20T19:46:00-04:00
date_gmt: 2008-08-21T02:46:00-04:00
categories:
- My Projects
tags:
- Electronics
- Mechanics
- Metal
- Robot
---
I was lucky enough to help my friend Stephen and his team to build a [lunar excavator](http://lunarex.mcgill.ca/) to participate in the [Regolith Excavation Challenge](http://regolith.csewi.org/), sponsored by NASA.

We put lots of efforts and many hours to get the robot done in time and we managed to get it running before it had to be shipped to California (from McGill University in Montreal).

{% fig "ss852231.jpg", "" %}

Unfortunately, despite the awesomeness of the lunar excavator and the fact that it was going to completely own the challenge, the UPS shipment went wrong and the robot could not get to the competition on time. Now the fight with UPS has begun to get a full reimbursement (~2000$) and the robot back.

UPS incompetence aside, I worked on putting all the electronics system together in the _electrical box_. This meant, I had to build two boards: one for the power management (transforming the provided 24V into a 12 and 5V in order to power the many devices and turning the latter ON and OFF), and one for the logic (interfacing the main computer with the various motor controllers and sensors).

{% fig "ss852227.jpg", "" %}

This task was done using perfboards and lots of solder since we did not have enough time to consider designing and fabricating proper PCBs with nice places for all the components.

Note the nice (and very classy) wood finish of the electrical box interior as shown in the picture.

I will not give away any details about the excavator since it will compete next year, provided there is another Regolith Challenge.