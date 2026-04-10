---
layout: layouts/post.njk
status: public
author: Carlos
title: Android Tips
date: 2023-09-02T00:55:00-04:00
categories:
  - TIL
tags:
  - android
  - linux
---

## ADB Commands

```bash
adb shell cmd package list packages          # list all packages
adb backup -f TARGET.ab -noapk PACKAGE_NAME  # backup a package
```

## Emulator Hardware Acceleration

Check if your system supports hardware acceleration (output > 0 means yes):

```bash
sudo apt-get install cpu-checker -y && egrep -c '(vmx|svm)' /proc/cpuinfo
```

Install KVM acceleration:

```bash
sudo apt-get install qemu-kvm libvirt-daemon-system libvirt-clients bridge-utils -y
```

Source: [Android developer docs](https://developer.android.com/studio/run/emulator-acceleration#vm-linux)
