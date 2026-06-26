---
layout: layouts/post.njk
author: Carlos
title: Sigmoids are the best
categories:
  -
tags:
  -
---

There's an inportant disctinction when programing robotics systems that may not apply to other types of programs. This is an insight I learned early on when working on systems that actuate in the physical wold. In robotics, there's a use of `if` that is quite preposterous: checking thresholds.

```python

my_threshold = 0.5

if value < my_threshold:
  return 2*value
else:
  return 0
```

## Infinite Energy

<!-- Insert  image of sharp step-->

What is so bad about it? you may ask. It's perfectly legal syntax and a legitimate use case. In robotics, however, or in any aplications that deals with real world physical consequences, such as motion, sound, heating and cooling, and lights, this sharp discontinuity implies something impossible: an infinite ammount of energy.

Nothing in the macro scale of nature can transitions instantaneously between two descrete states. For inatance, comanding a motor to spin at 1000 RPM and then 0 RPM will cause the motor to slow down gradually, no mather how strong the motor torque you apply. Gradually may mean 30ms but it is still not instantaneous.

So, in the best case the physical system itself will soften the commanded step wit its own step response. However, if your code expects the discontinuity ot inserted, you may have clashing commands, stuttering motors, or shorted batteries.

## Smooth Operator

This is where sigmoids come in. They provide a simple way of smothing a transition in an computatinally inexpensive way.

<!-- INsert signmoid formula . params should be trheshold, initial and final value, weight-->

<!-- explain the parameters -->

<!-- Add an interactive visuaization of the sigmoid that can be adjusted -->

<!-- insert python imlementation -->

<!-- insert cpp imlementation -->
