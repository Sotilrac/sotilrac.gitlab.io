---
layout: layouts/post.njk
status: draft
published: true
title: Inverted Pendulum
author: Carlos
id: 50
wordpress_url: http://carlitoscontraptions.com/?p=55
date: 2008-06-20T07:32:00-04:00
date_gmt: 2008-06-20T14:32:00-04:00
categories:
- My Projects
tags:
- Software
- Robot
---
{% fig "cart.png", "" %}

My friend David and I implemented an inverted pendulum controller for the [Quanser cart](http://www.quanser.com/english/html/products/fs_product_challenge.asp?lang_code=english&pcat_code=exp-lin&prod_code=L2-invpen&tmpl=1) in the Control and Robotics Lab. The controller was implemented using Simulink and Matlab, which makes the tasks much simpler than dealing with microcontrollers and C.

We implemented many kinds of controllers, but the best turned out to be the full state feedback controller where we get to control the position and velocity of both the cart and the rod. The controller block diagram is shown below.

{% fig "Full+State+Feedback+Diagram.png", "" %}  

Below you can find the slides for a presentation giving a quick overview of this subject and a video demonstration featuring David as the presenter.

[slideshare https://www.slideshare.net/Carlito/inverted-pendulum]
