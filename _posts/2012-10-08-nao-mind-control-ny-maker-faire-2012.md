---
layout: layouts/post.njk
status: public
title: Nao Mind Control at New York Maker Faire 2012
author: Carlos
id: 1438
wordpress_url: http://carlitoscontraptions.com/?p=1438
date: 2012-10-08T22:10:30-04:00
date_gmt: 2012-10-09T02:10:30-04:00
categories:
- Robotics
tags:
- Nao
- Maker Faire
- Neurosky
- Mindwave
- Mind Control
---
{% include "archive-banner.njk" %}

{% fig "/img/blog/nao-mind-control-ny-maker-faire-2012/IMG_2028.jpg", "Super intense focus to control Nao 1337" %}

Nao 1337 and I assisted to the New York "World" Maker Faire 2012. This time, I put together a Nao behavior that communicates with the [Neurosky MindWave Sensor](http://neurosky.com/Products/MindWave.aspx) and allows the user to control the humanoid robot with their thoughts. Unfortunately, I did not get to make a video of the performance (too busy presenting Nao) but you can see many pictures further below. It was awesome to see children really focus in the hope to make the robot react! Their focusing techniques and their reactions were priceless.

{% fig "/img/blog/nao-mind-control-ny-maker-faire-2012/NaoMindControl_screenshot.png", "Nao Mind Control Behaviour Screenshot" %}

The Nao Mind Control behaviour uses the [Puzzlebox](http://brainstorms.puzzlebox.info/) Synapse interface running on a computer on the same local network as Nao. The Synapse program talks to the MindWave sensor using a wireless serial USB dongle and serves the brainwave information it receives on a TCP socket. Then, Nao can connect to the socket and receive the brainwaves information that he can use to trigger actions. Out of the raw brainwave data (that is difficult to interpret and use), the sensor also provides concentration and meditation levels. In the behavior presented at Maker Faire, only the concentration level was used to trigger animations on the robot. This means that a user concentrating up to a certain level could trigger animation on the robot while it remains seated. If the concentration level is higher and maintained for some time, then the robot would stand up and do more actions.

I use the Puzzelbox interface because it runs on Linux but unfortunately, it cannot serve the blink strength (since it is computed using a proprietary algorithm). As soon as I get the proprietary Neurosky interface working under Linux, I'll be able to give Nao more complex controls with my mind.

{% gallery 4, "/img/blog/nao-mind-control-ny-maker-faire-2012/IMG_2025.jpg", "/img/blog/nao-mind-control-ny-maker-faire-2012/IMG_2020.jpg", "/img/blog/nao-mind-control-ny-maker-faire-2012/IMG_2018.jpg", "/img/blog/nao-mind-control-ny-maker-faire-2012/IMG_2017.jpg", "/img/blog/nao-mind-control-ny-maker-faire-2012/IMG_2012.jpg", "/img/blog/nao-mind-control-ny-maker-faire-2012/IMG_20120930_181255.jpg", "/img/blog/nao-mind-control-ny-maker-faire-2012/IMG_20120930_172315.jpg", "/img/blog/nao-mind-control-ny-maker-faire-2012/IMG_20120930_171938.jpg", "/img/blog/nao-mind-control-ny-maker-faire-2012/IMG_20120930_171718.jpg", "/img/blog/nao-mind-control-ny-maker-faire-2012/IMG_20120930_171457.jpg", "/img/blog/nao-mind-control-ny-maker-faire-2012/IMG_20120930_171302.jpg", "/img/blog/nao-mind-control-ny-maker-faire-2012/IMG_20120930_171000.jpg", "/img/blog/nao-mind-control-ny-maker-faire-2012/IMG_20120930_163819.jpg", "/img/blog/nao-mind-control-ny-maker-faire-2012/IMG_20120930_160752.jpg", "/img/blog/nao-mind-control-ny-maker-faire-2012/IMG_20120930_140035.jpg", "/img/blog/nao-mind-control-ny-maker-faire-2012/IMG_20120930_134507.jpg", "/img/blog/nao-mind-control-ny-maker-faire-2012/IMG_20120930_134155.jpg", "/img/blog/nao-mind-control-ny-maker-faire-2012/IMG_20120930_134146.jpg", "/img/blog/nao-mind-control-ny-maker-faire-2012/IMG_20120930_133639.jpg", "/img/blog/nao-mind-control-ny-maker-faire-2012/IMG_20120930_125737.jpg", "/img/blog/nao-mind-control-ny-maker-faire-2012/IMG_20120930_125715.jpg", "/img/blog/nao-mind-control-ny-maker-faire-2012/IMG_2009.jpg", "/img/blog/nao-mind-control-ny-maker-faire-2012/IMG_2007.jpg", "/img/blog/nao-mind-control-ny-maker-faire-2012/IMG_2006.jpg", "/img/blog/nao-mind-control-ny-maker-faire-2012/IMG_2005.jpg", "/img/blog/nao-mind-control-ny-maker-faire-2012/IMG_2004.jpg", "/img/blog/nao-mind-control-ny-maker-faire-2012/IMG_2002.jpg", "/img/blog/nao-mind-control-ny-maker-faire-2012/IMG_2001.jpg", "/img/blog/nao-mind-control-ny-maker-faire-2012/IMG_1999.jpg", "/img/blog/nao-mind-control-ny-maker-faire-2012/IMG_1998.jpg", "/img/blog/nao-mind-control-ny-maker-faire-2012/IMG_1997.jpg", "/img/blog/nao-mind-control-ny-maker-faire-2012/IMG_1970.jpg", "/img/blog/nao-mind-control-ny-maker-faire-2012/IMG_1969.jpg", "/img/blog/nao-mind-control-ny-maker-faire-2012/IMG_1965.jpg", "/img/blog/nao-mind-control-ny-maker-faire-2012/IMG_1964.jpg", "/img/blog/nao-mind-control-ny-maker-faire-2012/IMG_1961.jpg", "/img/blog/nao-mind-control-ny-maker-faire-2012/IMG_1960.jpg", "/img/blog/nao-mind-control-ny-maker-faire-2012/IMG_1958.jpg", "/img/blog/nao-mind-control-ny-maker-faire-2012/IMG_1956.jpg", "/img/blog/nao-mind-control-ny-maker-faire-2012/IMG_1955.jpg", "/img/blog/nao-mind-control-ny-maker-faire-2012/IMG_1954.jpg", "/img/blog/nao-mind-control-ny-maker-faire-2012/IMG_1953.jpg", "/img/blog/nao-mind-control-ny-maker-faire-2012/IMG_1952.jpg", "/img/blog/nao-mind-control-ny-maker-faire-2012/IMG_1951.jpg", "/img/blog/nao-mind-control-ny-maker-faire-2012/IMG_1948.jpg" %}
