---
layout: layouts/post.njk
status: public
published: true
title: Pololu Python Library
author: Carlos
id: 79
wordpress_url: http://carlitoscontraptions.com/?p=222
date: 2009-07-16T00:54:29-04:00
date_gmt: 2009-07-16T04:54:29-04:00
categories:
  - My Projects
  - Software
  - Robotics
tags:
  - Software
---

{% include "archive-banner.njk" %}

{% fig "/img/blog/pololu-python-library/IMG_1409.JPG", "Pololu Micro Serial Servo Controller" %}

I started writing a library for controlling the Pololu motor controllers with a computer through a serial port.

I'm writing this in Python so the code can be cross-platform but I would be very glad to have some feedback about running it on other OSs than Linux. Actually, any feedback would be very welcome.

As of now it can interface with the [Pololu Micro Serial Servo Controller](http://www.pololu.com/catalog/product/207/resources "Pololu servo controller") that I got from {% wayback "https://web.archive.org/web/20090202203321/http://www.robotshop.ca:80/pololu-micro-serial-servo-controller.html", "RobotShop" %}. I am planning to use this code in my upcoming project RobotShop is sponsoring. I will supplement this library as I get newer hardware to work with.

I know there is already a {% wayback "https://web.archive.org/web/20090228211923/http://dmt195.wordpress.com:80/2009/01/19/python-to-interface-with-the-pololu-8-channel-servo-controller/", "python interface" %} for it but I really wanted to have an object oriented way of managing motors (i.e. they can be instantiated and controlled more easily).

You can download the library here: [lib_pololu.py](/img/blog/pololu-python-library/lib_pololu.py).

In order to properly use this library you will require:

1.  [Python](http://www.python.org/download/ "Python")
2.  [Pyserial](http://sourceforge.net/projects/pyserial/files/)

If you use a civilized OS you may be able to get all this by typing this in a command prompt:

```bash
sudo apt-get install idle python-serial
```

Here is a sample script that will use the library in order to control a servo: [servo_example.py](/img/blog/pololu-python-library/servo_example.py).

\[gist id=3746513 h=200\]

Note for Redmond OS (aka Window$) users: you will need the [Win32 Python extension](http://python.net/crew/mhammond/win32/Downloads.html "Win32 Extensions for Python") for pyserial to work.
