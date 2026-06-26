---
layout: layouts/post.njk
author: Carlos
title: Sigmoids are the best
categories:
  -
tags:
  -
---

There's an important distinction when programming robotics systems that may not apply to other types of programs. This is an insight I learned early on when working on systems that actuate in the physical world. In robotics, there's a use of `if` that is quite preposterous: checking thresholds.

```python

my_threshold = 0.5

if value < my_threshold:
  return 2*value
else:
  return 0
```

## Infinite Energy

<!-- Insert image of sharp step -->

What is so bad about it? you may ask. It's perfectly legal syntax and a legitimate use case. In robotics, however, or in any application that deals with real world physical consequences, such as motion, sound, heating and cooling, and lights, this sharp discontinuity implies something impossible: an infinite amount of energy.

Nothing in the macro scale of nature can transition instantaneously between two discrete states. For instance, commanding a motor to spin at 1000 RPM and then 0 RPM will cause the motor to slow down gradually, no matter how strong the motor torque you apply. Gradually may mean 30ms but it is still not instantaneous.

So, in the best case the physical system itself will soften the commanded step with its own step response. However, if your code expects the discontinuity to be honored, you may have clashing commands, stuttering motors, or shorted batteries.

## Smooth Operator

This is where sigmoids come in. They provide a simple way of smoothing a transition in a computationally inexpensive way.

<!-- Insert sigmoid formula. Params should be threshold, initial and final value, weight -->

<!-- explain the parameters -->

<!-- Add an interactive visualization of the sigmoid that can be adjusted -->

<!-- insert python implementation -->

<!-- insert cpp implementation -->
