---
layout: post
status: darft
published: true
title: Pololu Python Library
author: Carlos
id: 79
wordpress_url: http://carlitoscontraptions.com/?p=222
date: '2009-07-16 00:54:29 -0400'
date_gmt: '2009-07-16 04:54:29 -0400'
categories:
- My Projects
- Software
- Robotics
tags:
- Software
---
[![Pololu Micro Serial Servo Controller](http://carlitoscontraptions.com/wp-content/uploads/2009/07/IMG_1409-300x240.jpg "Pololu Micro Serial Servo Controller")](http://carlitoscontraptions.com/wp-content/uploads/2009/07/IMG_1409.JPG)

I started writing a library for controlling the Pololu motor controllers with a computer trough a serial port.

I'm writing this in Python so the code can be cross-platform but I would be very glad to have some feedback about running it on other OSs than Linux. Actually, any feedback would be very welcome.

As of now it can interface with the [Pololu Micro Serial Servo Controller](http://www.pololu.com/catalog/product/207/resources "Pololu servo controller") that I got form [RobotShop](http://www.robotshop.ca/pololu-micro-serial-servo-controller.html "Pololu servo controller").Â  I am planning to use this code in my upcoming project RobotShop is sponsoring. I will supplement this library as I get newer hardware to work with.

I know there is already a [python interface](http://dmt195.wordpress.com/2009/01/19/python-to-interface-with-the-pololu-8-channel-servo-controller/) for it but I really wanted to have an object oriented way of managing motors (i.e. they can be instantiated and controlled more easily).

You can download the library here: [lib_pololu.py](http://files.carlitoscontraptions.com/programming/Pololu/lib_pololu.txt "lib_pololu.py") (you will need to change the extension of the file to .py instead of txt).

In order to properly use this library you will require:

1.  [Python](http://www.python.org/download/ "Python")
2.  [Pyserial](http://sourceforge.net/projects/pyserial/files/)

If you use a civilized OS you may be able to get all this by typing this in a command prompt:

{% highlight bash %}
sudo apt-get install idle python-serial
{% endhighlight %}

Here is a sample script that will use the library in order to control a servo: [servo_example.py](http://files.carlitoscontraptions.com/programming/Pololu/servo_example.txt) (you will need to change the extension of the file to .py instead of txt).

\[gist id=3746513 h=200\]

Note for Redmond OS (aka Window$) users: you will need the [Win32 Python extension](http://python.net/crew/mhammond/win32/Downloads.html "Win32 Extensions for Python") for pyserial to work.
