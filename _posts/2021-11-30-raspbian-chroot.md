---
layout: layouts/post.njk
status: public
author: Carlos
title: Run Raspbian in a chroot
date: 2021-11-30T15:33:00-05:00
categories:
  - TIL
tags:
  - linux
  - raspberry-pi
---

You can run a Raspberry Pi's Raspbian from a `chroot` on a regular Linux machine. This lets you install packages, configure services, and test programs directly on the Pi's filesystem from the convenience of your workstation, then pop the SD card into the real device and have everything ready to go.

To achieve this, mount the Pi's SD card, then:

```bash
sudo apt install qemu-user proot -y
sudo proot -q qemu-arm -S /mnt/path/to/raspbian/
```

This uses QEMU to emulate ARM, so you can install packages and configure the system without booting the Pi.
