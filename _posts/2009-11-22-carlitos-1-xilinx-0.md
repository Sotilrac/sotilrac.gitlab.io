---
layout: layouts/post.njk
status: public
published: true
title: Carlitos 1, Xilinx 0
author: Carlos
id: 89
date: 2009-11-22T04:02:31-05:00
categories:
- General
- Software
- FPGA
tags:
- Software
- Electronics
---
{% fig "Fpga_xilinx_spartan.jpg", "Xilinx Spartan" %}

I spent countless hours trying to install the free version of the Xilinx software on may windoze Virtual machine and I have finally succeed.

I must say that although I have never used Xilinx ISE Webpack, I already hate it. It come in a huge installation archive (2.7 GB) and an equally huge update archive (2.4 GB). The option to use the "slim" installer (88 MB) is worthless since there is no ways of saving the required files for an eventual reinstallation (which was needed twice in my case).

Anyway, after installing/uninstalling/installing many times I finally got it to work. And this very lengthy and painful process reminded me why the Open Source world is so much more convenient. Installing a full linux distribution with tons of extra programs takes half the required storage and a third of the time. Too bad FPGA programming tools are ruled by the chip manufacturers.

All this painful process was required in order to get my new [NanoBoard 3000](http://carlitoscontraptions.com/2009/11/i-am-the-luckiest-engineer-ever/ "NanoBoard 3000") running. Hopefully I wont have to use Xilinx ISE anytime soon. Altium Designer was much easier to install and requires less storage.