---
layout: post
status: draft
title: Nao Mind Control at New York Maker Faire 2012
author: Carlos
id: 1438
wordpress_url: http://carlitoscontraptions.com/?p=1438
date: '2012-10-08 22:10:30 -0400'
date_gmt: '2012-10-09 02:10:30 -0400'
categories:
- My Projects
- Robotics
tags:
- Nao
- Maker Faire
- Neurosky
- Mindwave
- Mind Control
---
\[caption id="attachment_1492" align="aligncenter" width="300"\][![Super intense focus to control Nao 1337](http://carlitoscontraptions.com/wp-content/uploads/2012/10/IMG_2028-300x225.jpg "Super intense focus to control Nao 1337")](http://carlitoscontraptions.com/wp-content/uploads/2012/10/IMG_2028.jpg) Super intense focus to control Nao 1337\[/caption\]

Nao 1337 and I assisted to the New York "World" Maker Faire 2012. This time, I put together a Nao behavior that communicates with the [Neurosky MindWave Sensor](http://neurosky.com/Products/MindWave.aspx) and allows the user to control the humanoid robot with their thoughts. Unfortunately, I did not get to make a video of the performance (too busy presenting Nao) but you can see many pictures further below. It was awesome to see children really focus in the hope to make the robot react! Their focusing techniques and their reactions were priceless.

\[caption id="attachment_1514" align="aligncenter" width="300"\][![Nao Mind Control Behaviour Screenshot](http://carlitoscontraptions.com/wp-content/uploads/2012/10/NaoMindControl_screenshot-300x300.png "Nao Mind Control Behaviour Screenshot")](http://carlitoscontraptions.com/wp-content/uploads/2012/10/NaoMindControl_screenshot.png) Nao Mind Control Behaviour Screenshot\[/caption\]

The Nao Mind Control behaviour uses the [Puzzlebox](http://brainstorms.puzzlebox.info/) Synapse interface running on a computer on the same local network as Nao. The Synapse program talks to the MindWave sensor using a wireless serial USB dongle and serves the brainwave information it receives on a TCP socket. Then, Nao can connect to the socket and receive the brainwaves information that he can use to trigger actions. Out of the raw brainwave data (that is difficult to interpret and use), the sensor also provides concentration and meditation levels. In the behavior presented at Maker Faire, only the concentration level was used to trigger animations on the robot. This means that a user concentrating up to a certain level could trigger animation on the robot while it remains seated. If the concentration level is higher and maintained for some time, then the robot would stand up and do more actions.

I use the Puzzelbox interface because it runs on Linux but unfortunately, it cannot serve the blink strength (since it is computed using a proprietary algorithm). As soon as I get the proprietary Neurosky interface working under Linux, I'll be able to give Nao more complex controls with my mind.

\[gallery link="file" order="DESC" columns="3" orderby="post_date"\]
