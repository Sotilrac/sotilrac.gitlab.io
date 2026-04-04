---
layout: layouts/post.njk
status: public
author: Carlos
title: Useful ADB Commands
date: 2023-09-02T00:55:00-04:00
categories:
  - TIL
tags:
  - android
---

A couple of handy ADB commands:

```bash
adb shell cmd package list packages          # list all packages
adb backup -f TARGET.ab -noapk PACKAGE_NAME  # backup a package
```
