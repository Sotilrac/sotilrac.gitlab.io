---
layout: layouts/post.njk
status: public
title: Android Emulator Hardware Acceleration
date: 2022-09-27T21:00:00-04:00
categories:
  - TIL
tags:
  - android
  - linux
---

Check if your system supports hardware acceleration (output > 0 means yes):

```bash
sudo apt-get install cpu-checker -y && egrep -c '(vmx|svm)' /proc/cpuinfo
```

Install KVM acceleration:

```bash
sudo apt-get install qemu-kvm libvirt-daemon-system libvirt-clients bridge-utils -y
```

Source: [Android developer docs](https://developer.android.com/studio/run/emulator-acceleration#vm-linux)
