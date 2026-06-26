---
layout: layouts/post.njk
author: Carlos
title: Sigmoids are the best
categories:
  -
tags:
  -
---

Programming robots taught me to distrust a line of code most programmers never think twice about: the threshold check. It looks like this:

```python

my_threshold = 0.5

if value < my_threshold:
  return 2*value
else:
  return 0
```

## Infinite Energy

<!-- Insert image of sharp step -->

What's wrong with it? The syntax is legal and the logic is sound. But in any system with physical consequences, motion, sound, heating and cooling, lights, the sharp jump from one branch to the other implies something impossible: infinite energy.

Nothing at human scale changes state instantly. Command a motor to drop from 1000 RPM to a dead stop, and it coasts down no matter how much torque you throw at it. The coast might last only 30ms, but 30ms is not zero.

In the best case, the hardware softens your step through its own response. If the rest of your code assumes the jump happened on command, you get clashing setpoints, stuttering motors, and the occasional shorted battery.

## Smooth Operator

A sigmoid fixes this. It smooths the transition for a handful of arithmetic operations, cheap enough to run in any control loop.

<!-- Insert sigmoid formula. Params should be threshold, initial and final value, weight -->

<!-- explain the parameters -->

<!-- Add an interactive visualization of the sigmoid that can be adjusted -->

<!-- insert python implementation -->

<!-- insert cpp implementation -->
