---
layout: layouts/post.njk
status: public
published: true
title: I am the luckiest Engineer ever
author: Carlos
id: 88
date: 2009-11-18T13:14:22-05:00
categories:
  - General
  - FPGA
tags:
  - Electronics
---

{% include "archive-banner.njk" %}

A few weeks ago, I received a very pleasant message: [Altium](http://altium.com/ "Altium"), an FPGA development board manufacturer and IDE developer, contacted me asking If I wanted to try the (excessively cool) brand new development board (the [NanoBoard 3000](http://nb3000.altium.com/intro.html "NanoBoard 3000")) for free. Of course, I immediately (and quite emphatically) said _YES_.

{% fig "/img/blog/i-am-the-luckiest-engineer-ever/img_2254.jpg", "The Altium NanoBoard 3000" %}

Now that I got it, I'm dying to have some spear time in order to try out their awesome board with their quite intriguing IDE.

## About the Hardware

The NanoBoard 3000 is a beautiful piece of equipment. It boasts lots of cool peripherals and is built and packed as a luxury electronics product. It is a very good looking piece of equipment while remaining perfectly functional, it beats by far all the other development boards I am familiar with (i.e. the Altera DE2 board and the Lattice Mico32 development board) while remaining much cheaper (around 50% of their price).

{% fig "/img/blog/i-am-the-luckiest-engineer-ever/nanoboard.jpg", "NanoBoard 3000 Unboxing" %}

## Features

Here is a selection of the [NanoBoard's features](http://wiki.altium.com/display/ADOH/NanoBoard+3000+Series "NanoBoard 3000 Wiki Page") from [Altium's Wiki](http://wiki.altium.com "Altium's Wiki") I find most prominent:

- A Xilinx Spartan-3AN device (XC3S1400AN-4FGG676C)

{% fig "/img/blog/i-am-the-luckiest-engineer-ever/img_2251.jpg", "Nanoboard 3000 Front" %}

- 4 Serial SPI Flash memory devices
- Programmable clock 6 to 200 MHz, accessible by Altium Designer or by an FPGA design
- SPI Real-Time Clock with 3V battery backup
- Adjustable voltage regulators set to generate 1.2V, 1.8V, 2.5V and 3.3V power
- 256K x 32-bit common-bus SRAM (1MB)
- 16M x 32-bit common-bus SDRAM (64MB)
- 8M x 16-bit common-bus 3.0V Page Mode Flash memory (16MB)
- Dual 256K x 16-bit independent SRAM (512KB each)
- 256K x 16-bit independent SRAM (512KB)
- 8 RGB LEDS
- 5 generic push-button switches
- 4-channel 8-bit ADC, SPI-compatible
- 4-channel 8-bit DAC, SPI-compatible
- 4x isolated IM Relay channels
- 4x PWM power drivers
- Screw terminal headers for ADC/DAC/Relay/PWM interfaces
- SD (Secure Digital) card readers:
  - One for use by the Host Controller FPGA
  - One for use by the User FPGA
- SVGA interface (24-bit, 80MHz)

{% fig "/img/blog/i-am-the-luckiest-engineer-ever/img_2252.jpg", "NanoBoard 3000 Back" %}

- 10/100 Fast Ethernet interface
- USB 2.0 High-Speed interface
- RS-232 Serial Port DB9M
- RS-485 Serial Port 'RJ45'
- 240 x 320 TFT LCD with touch screen
- 8-way DIP-switch
- Stereo 2W audio power amplifier with 3.5mm test input jack and DC volume control
- 24-bit Stereo Audio CODEC with I2S-compatible interface
- Stereo audio jacks (3.5mm):
  - Line In / Line Out
  - Headphones
- Speakers on a separate (attached) board
- MIDI interface
- Diagnostics interface PCI Express (PCIe) edge connector for connection of automated test equipment (ATE)
- 1.8" ATA/IDE connector providing access to user LED and generic switch I/O
- Remote Control and IR interface.

I should post some further details and perhaps even a simple test project soon (as soon as I get [Altium Designer](http://www.altium.com/altiumsite/products/altium-designer/en/altium-designer_home.cfm "Altium Designer") and Xilinx ISE installed and running)
