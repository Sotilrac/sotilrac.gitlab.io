---
layout: layouts/post.njk
author: Carlos
title: Sigmoids are the Best!
categories:
  - Robotics
tags:
  - robotics
  - python
  - control
---

There's a distinction in programming robots that doesn't show up in most other kinds of code, and it's one I learned early on, back when I first started writing software that actuates in the physical world. It surfaces in the most ordinary place imaginable: a use of `if` that, once you see the problem, becomes preposterous, the threshold check. It looks something like this:

```python
def command(value):
    my_threshold = 0.5
    if value < my_threshold:
        return 2 * value
    else:
        return 0
```

## Infinite Energy

<!-- prettier-ignore -->
{% plot "An instant jump, with an infinite slope." %}
{
  "fn": "x < 0 ? 0 : 1",
  "samples": 600,
  "x": { "min": -6, "max": 6, "label": "input x" },
  "y": { "min": -0.15, "max": 1.15, "label": "output" },
  "markers": [{ "x": 0, "label": "infinite slope", "color": "--crimson", "dash": true }]
}
{% endplot %}

So what's so bad about it? Nothing, syntactically; it's perfectly legal and a legitimate thing to write. But in robotics, or in any program whose outputs have physical consequences (motion, sound, heating and cooling, lights), that sharp discontinuity requires something impossible: an infinite amount of energy.

Nothing at the macro scale of nature transitions instantaneously between two discrete states. Command a motor to spin at 1000 RPM and then ask it for 0, and it will slow down gradually no matter how much torque you throw at it; gradually might mean 30 milliseconds, but 30 milliseconds is still not zero.

In the best case, the physical system softens your commanded step all on its own, through its own step response. But if your code assumes the discontinuity actually happened the way you wrote it, you end up with clashing commands, stuttering motors, and the occasional shorted battery.

## Smooth Operator

This is where sigmoids earn their keep. A sigmoid gives you a simple, computationally cheap way to smooth that transition, so the commanded signal already respects the physics before the hardware ever has to.

$$
f(x) = y_0 + (y_1 - y_0)\,\frac{1}{1 + e^{-k\,(x - x_0)}}
$$

The shape has four knobs, and between them they cover every case I've ever needed:

- **Threshold, $x_0$:** the value of $x$ where the curve sits halfway between its ends, the spot where the old `if` used to switch.
- **Initial value, $y_0$:** where the output starts, far below the threshold.
- **Final value, $y_1$:** where the output settles, far above it.
- **Weight, $k$:** how sharp the transition is. A small $k$ gives a lazy ramp, a large $k$ tightens it toward a wall, and $k \to \infty$ hands you back the original step. The sigmoid is the `if` with a dial for how much energy you're willing to spend.

Drag the sliders and watch what each one does to the curve:

<!-- prettier-ignore -->
{% plot "The same transition with a realizable slope." %}
{
  "fn": "y0 + (y1 - y0) / (1 + exp(-k*(x - x0)))",
  "x": { "min": -6, "max": 6, "label": "input x" },
  "y": { "min": -0.05, "max": 1.05, "label": "output f(x)" },
  "markers": [{ "x": "x0", "label": "x₀" }],
  "sliders": [
    { "var": "x0", "label": "threshold x₀", "min": -4, "max": 4, "step": 0.1, "value": 0 },
    { "var": "k", "label": "weight k", "min": 0.3, "max": 15, "step": 0.1, "value": 2 },
    { "var": "y0", "label": "initial y₀", "min": 0, "max": 1, "step": 0.01, "value": 0 },
    { "var": "y1", "label": "final y₁", "min": 0, "max": 1, "step": 0.01, "value": 1 }
  ]
}
{% endplot %}

The whole thing is a single expression in any language you like. In Python:

```python
import math


def sigmoid(x, x0=0.0, y0=0.0, y1=1.0, k=1.0):
    """Blend smoothly from y0 to y1 around the threshold x0."""
    return y0 + (y1 - y0) / (1.0 + math.exp(-k * (x - x0)))
```

And the same in C++:

```cpp
#include <cmath>

double sigmoid(double x, double x0 = 0.0, double y0 = 0.0,
               double y1 = 1.0, double k = 1.0) {
  return y0 + (y1 - y0) / (1.0 + std::exp(-k * (x - x0)));
}
```

Going back to the `command` we started with, the sigmoid becomes a gate that fades the output off around the threshold instead of dropping it off a cliff:

```python
def command(value):
    gate = sigmoid(value, x0=0.5, y0=1.0, y1=0.0, k=8.0)
    return 2 * value * gate
```

Below the threshold the gate sits near 1 and you get the original `2 * value`; above it the gate slides to 0 and the output bleeds away, and `k` decides how abrupt that shoulder is.

There's a second, subtler win here. With a hard threshold, an input that hovers right at the boundary is a disaster: a little sensor noise nudges it back and forth across the line, and the output flaps between the two branches on every reading. That's the chatter you hear as a buzzing relay or feel as a dithering motor, and the usual remedy is to bolt on hysteresis or a deadband to keep the comparison from twitching. The sigmoid never has the problem in the first place, because it's continuous: an input sitting on the threshold maps to a value halfway between the two ends, and a small wiggle in the input produces only a small wiggle in the output. There's no line to cross, so there's nothing to flap.

Swap the threshold `if` for a sigmoid and the hardware stops fighting your code: the motor eases into its setpoint instead of slamming into it, and the energy bill stays finite. Sigmoids, as the title promised, are the best.
