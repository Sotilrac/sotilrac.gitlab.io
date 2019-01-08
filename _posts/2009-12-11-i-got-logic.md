---
layout: post
status: darft
published: true
title: Enough with the guesswork, I got Logic
author: Carlos
id: 91
wordpress_url: http://carlitoscontraptions.com/?p=455
date: '2009-12-11 02:30:45 -0500'
date_gmt: '2009-12-11 06:30:45 -0500'
categories:
- Tools
tags:
- Electronics
---
I just got a shiny new [Logic](http://www.saleae.com/logic/ "The Logic"), a tiny 8-channel, 24 MHz logic analyzer from [Saleae LLC](http://www.saleae.com/home/ "Saleae"), and it is beautiful. I've been wanting to get a logic analyzer for quite some time and this little guy is definitely worth the 150 bucks it costs.

{% include fig.html img="Logic.jpg" caption="Logic Unboxing" id=page.id %}

## Logic Analyzer?

**(skip this if you already know what a logic analyzer is and do not want to be bored to death)**

A logic analyzer is a measurement instrument that allows you to record the logic level (e.g. high or low) of a digital signal throughout time. This means that if you are working with a micro-controller and want to know what is actually happening at the pins, you can use a logic analyzer to record the signals of interest and display them on a time-line on a computer screen. This is very convenient considering that debugging microcontrollers often implies guessing or using lame techniques such as slowing down the execution time and lighting up LEDs in order to see what the program is doing.

In short, a logic analyzer allows you to view digital signals and plot them with respect to time.

## Casing

{% include fig.html img="IMG_2566.JPG" caption="The Logic, by Saleae" id=page.id %}

The Logic has a nice square anodized aluminum body which makes it very sturdy and looks awesome. It is very small (~ 4.5 cm on the side and ~ 0.7 cm high) and features some male headers on the front side and a mini USB port type B on the back. For some reason, I really like the four tiny hex screws that hold together the two aluminum plates that make the body.

## Accessories

{% include fig.html img="Logic2.jpg" caption="Wires & Hooks" id=page.id %}

The Logic comes in a nice Logic Case, usually intended for some other electronics such as external hard drives I suppose, that can accommodate itself  and its USB cable, its set of wires and the E-Z-hook clips.

What I enjoy the most is that the wires are robust and kink-proof, and they are terminated in female headers, which makes them very easy to use in breadboards and on male pins in general. Also, the hooks are removable and they can connect to harder-to-access pins in a secure way. The wire colour coding follows the resistor colour coding (i.e. Channel 0 is black, channel 1 is brown, etc) and this might be a bit confusing at the beginning since the Ground wire is grey instead of being the usual black.

Finally, the carrying case is a very nice feature since it allows you to have the Logic and all the related items in one single place. The case is a bit too big, but I the extra space could be used to store some extra accessories, such as headers gender-changers (for plugging into female headers) or wire extensions with special ports (e.g. DB-9, RJ-45). I also enjoy the fact that all the components come in their own little zipper-bag that allows you to store the unit in a nice pristine condition (it may not seem like it, but I like to preserve things in their original state, unless they come from the garbage in which case I mod them and unscrupulously use their pieces).

## Hardware

I did not want to take the Logic apart in order to see its guts (so far) so I do not have too many details about the hardware other than what is listed in [Saleae's website](http://www.saleae.com/logic/features/ "Logic features"): (1)the inputs are protected to you don't fry anything, (2) it can sample at 24 MHz,  and (3) it is able to store up to 500 M samples.

## Software

The software can be [downloaded for free](http://www.saleae.com/downloads/ "Saleae software") (and used in demo mode) looks really nice but unfortunately, the current stable version works only under the Redmond OS and it does not play very well with Wine in Linux or in my XP virtual machine. I would have really liked to test its _Protocol Analyzers_, a function that automatically sets the names of the signals and decodes the information accordingly to the protocol being analyzed (e.g. I2C, RS232, SPI, 1-Wire).

Anyways, there is an upcoming cross-platform version of the software that looks very promising and is currently under private beta at the moment. Of course, I could not resist the urge to join the beta testing and I can say that the new software is working very nicely (so far, I have not tested it extensively yet) under my 64-bit Kubuntu setup.

Needless to say, as soon as the software goes public, I will post a more thorough review, so keep posted.

## Conclusion

The [Logic](http://www.saleae.com/logic/ "The Logic") is a very nice piece of equipment for any hobbyist or professional (provided you do not require to read signals faster than 24 MHz, which is rare specially while debugging). It is built to last fits very nicely in a hacker's toolbox (or even pocket). I would recommend the Logic to anyone needing a sturdy and easy-to-use Logic analyzer, and I will be using it in my upcoming projects.