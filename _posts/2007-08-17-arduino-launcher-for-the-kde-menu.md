---
layout: layouts/post.njk
status: draft
published: true
title: Arduino Launcher for the KDE menu
author: Carlos
id: 35
date: 2007-08-17T13:17:00-04:00
date_gmt: 2007-08-17T20:17:00-04:00
categories:
- Software
- Arduino
tags: []
---
The Arduino software is good and works very well under Linux. Nevertheless, it doesn't create a menu item when installed and it can be tricky to create one for those who are not very used to Linux (like me).

In order to add a KDE menu launcher for the Arduino software, open the KDE Menu Editor, create a new item and put  

> cd /opt/arduino-0007/; ./arduino

in the Command field. Also, make sure that Run in terminal is checked and replace /opt/arduino-0007/ by your own installation path.

{% fig "Arduino+Launcher.png", "" %}

I'm sure there are thousands of other ways of doing this (including many than only require a few commands in the terminal) but at least this ways is pretty simple and and can be done without knowing that much about Linux.