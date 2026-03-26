---
layout: layouts/post.njk
status: public
title: udev Rules for Predictable Device Names
date: 2021-05-19T14:53:00-04:00
categories:
  - TIL
tags:
  - linux
---

udev rules let you run actions when a device is connected. A common use case is creating a symlink with a predictable name for a device that would otherwise show up as `/dev/ttyACM0`.

First, find device info (serial number, vendor ID, etc.):

```bash
udevadm info -a -p $(udevadm info -q path -n /dev/ttyACM0)
```

Create a rule file like `99-my_rule.rules`:

```
# uart 3 - fadecandy
ATTRS{idVendor}=="1d50", ATTRS{idProduct}=="607a", MODE:="0666", SYMLINK+="fadecandy"
```

Place it in `/etc/udev/rules.d/`, then reload and trigger:

```bash
sudo udevadm control --reload
sudo udevadm trigger --action=add
```

Source: [reactivated.net](http://reactivated.net/writing_udev_rules.html)
