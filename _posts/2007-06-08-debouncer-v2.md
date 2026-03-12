---
layout: layouts/post.njk
status: draft
published: true
title: Debouncer v2
author: Carlos
id: 30
date: 2007-06-08T23:56:00-04:00
date_gmt: 2007-06-09T06:56:00-04:00
categories:
- My Projects
- FPGA
tags: []
---
I wrote a quick debouncer code in VHDL that I thought people could enjoy and may be useful for FPGA projects. For more info on debouncers see [this post](http://carlitoscontraptions.com/2007/03/switch-debouncer/ "Switch debouncer").

As shown in the block diagram below, it takes as inputs a switch signal (SW_IN) and a clock signal (CLK) and outputs a signal SIG.

{% fig "CC_Debouncer.png", "" %}

When SW_IN goes high, the module outputs a once-clock-cycle wide pulse on the next clock rising edge. Then it waits for 8388607 clock cycles (~ 0.17 s when clocked @ 50MHz). This is illustrated in the state transition diagram below.

{% fig "CC_Debouncer+std.png", "" %}

You can download the code [here](http://carlos.asmat.googlepages.com/CC_Debouncer.vhd).