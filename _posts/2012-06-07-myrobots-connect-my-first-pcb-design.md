---
layout: layouts/post.njk
status: public
published: true
title: MyRobots Connect, My First PCB Design
author: Carlos
id: 1177
wordpress_url: http://carlitoscontraptions.com/?p=1177
date: 2012-06-07T09:04:53-04:00
date_gmt: 2012-06-07T13:04:53-04:00
categories:
  - My Projects
tags:
  - OSHW
---

{% include "archive-banner.njk" %}

In the last year, I created my first full hardware design, including its custom firmware, for RobotShop. Of course, the design is open source so you can reuse it however you like. The end-result is the [MyRobots Connect](http://www.robotshop.com/ProductInfo.aspx?pc=RB-Myr-01), a Serial-to-Ethernet gateway.

{% fig "/img/blog/myrobots-connect-my-first-pcb-design/MyRobots-Connect-Eagle.jpg", "MyRobots-Connect - Eagle" %}

I used the amazing [Eagle](http://www.cadsoftusa.com/) and you can find the design files in the [MyRobots Github page](https://github.com/myrobots/MyRobots.com/tree/master/Hardware%20Design). If you want to know more about how this device works, see its [wiki page](http://www.myrobots.com/wiki/MyRobots_Connect). But in short, it translates serial messages received via XBee into HTTP GETs to [MyRobots API](http://www.myrobots.com/wiki/API).

See below some PCB pr0n.

{% gallery 3, "/img/blog/myrobots-connect-my-first-pcb-design/IMG_0912.jpg", "/img/blog/myrobots-connect-my-first-pcb-design/IMG_0911.jpg", "/img/blog/myrobots-connect-my-first-pcb-design/IMG_0910.jpg", "/img/blog/myrobots-connect-my-first-pcb-design/IMG_0908.jpg", "/img/blog/myrobots-connect-my-first-pcb-design/IMG_0906.jpg", "/img/blog/myrobots-connect-my-first-pcb-design/IMG_0902.jpg", "/img/blog/myrobots-connect-my-first-pcb-design/IMG_0901.jpg", "/img/blog/myrobots-connect-my-first-pcb-design/IMG_0844.jpg", "/img/blog/myrobots-connect-my-first-pcb-design/IMG_0843.jpg" %}
