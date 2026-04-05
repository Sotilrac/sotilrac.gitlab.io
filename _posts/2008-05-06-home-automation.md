---
layout: layouts/post.njk
status: public
published: true
title: Home Automation
author: Carlos
id: 46
date: 2008-05-06T22:17:00-04:00
date_gmt: 2008-05-07T05:17:00-04:00
categories:
  - Projects
tags:
  - FPGA
---

{% include "archive-banner.njk" %}

Here is some information about a home automation system my team and I did some time ago. This was done for the Embedded Systems class and require two {% wayback "https://web.archive.org/web/20090529223417/http://www.altera.com:80/literature/univ/univ.pdf", "Altera UP1" %} FPGA boards, two computers and two {% wayback "https://web.archive.org/web/20070107074314/http://www.ftdichip.com:80/Products/EvaluationKits/TTL-232R.htm", "USB-to-TTL" %} wires.

{% fig "/img/blog/home-automation/system-diagram.png", "" %}

- The nice picture above was done by Frank (see below) -

Although at the beginning of the project we were really motivated to do a robust and optimal design that could set an example on how to do home automation and that could be shared with everybody, the project quickly degenerated and the general design approach became: "We don't care of how inelegant, inefficient or completely surrealist the system is as long as it works". The main reason for this radical change was the implacable deadline that got closer and closer, and the usual lack of time Electrical Engineering students suffer from.

The system consists of a PC that takes high level decisions for the control of lighting, heating and power consumption in general for a house. This decisions are serially sent to an FPGA board that take some lower level decisions (such as debouncing switches, counting time, etc) and controls trough a very large number of IO pins (~90) the actual house hardware.

{% fig "/img/blog/home-automation/system.png", "" %}

Since this is a small project, we do not have the actual house or its hardware, so we resorted to simulate it using a second FPGA board and another computer. The second computer controls the house status (temperature in each room, level of room light, motion in the rooms, status of the TV, etc) and offers an inteface so the user can turn on lights, move in a room, set the desired room temperature, turn on the microwave oven, etc. All this information is serially sent to the second FPGA board which then adjusts its pins status to mimic the house hardware.

{% fig "/img/blog/home-automation/simulator.png", "" %}
-The GUI and the Java program were done by Yev and Ritvik -

All the coding was done in Java and VHDL and since it is not very well organized or useful to anybody else, I won't be posting it. Nevertheless, the documents describing this project are very nicely done (all modesty aside) and give a clear description of what we did. Here you have: the [SRS](/img/blog/home-automation/srs.pdf), the [SDD](/img/blog/home-automation/sdd.pdf), and the [STC](/img/blog/home-automation/stc.pdf) (not the final version). Please keep in mind that this documents are not published under the CC license, they have full copyright.

{% fig "/img/blog/home-automation/ss851269.jpg", "" %}

Above you can see my friend Frank, he's the leader of the group (transformed from the norm by the nuclear goop).

{% fig "/img/blog/home-automation/ss851270.jpg", "" %}

Just so you know, the project went well and allowed us to learn a lot. We even ended up having a very good mark, so everybody should be (and is) happy.

If you are wondering what did I do in the project (I'm sure you are): I did the serial communication protocol in Java.
