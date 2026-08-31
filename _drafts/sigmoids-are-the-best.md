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

A sigmoid gives you a simple, computationally cheap way to smooth that transition, so the commanded signal already respects the physics before the hardware ever has to.

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

## Other S-Curves

The logistic is the one I reach for first, but it isn't the only S you can bolt in, and it has one annoyance: it never quite arrives. The output only reaches $y_0$ and $y_1$ at $\pm\infty$, so at any finite distance from the threshold there's a sliver of the other value left over. Usually that sliver is far below the resolution of whatever you're driving and nobody cares, but if you need the output to be exactly zero at a known input, you want a curve with a finite window.

Smoothstep is the classic. It's a cubic on a window of width $w$ centered on the threshold, clamped flat outside it:

$$
t = \mathrm{clamp}\!\left(\frac{x - x_0}{w} + \frac{1}{2},\, 0,\, 1\right), \qquad f(x) = y_0 + (y_1 - y_0)\,t^2\,(3 - 2t)
$$

Its derivative is proportional to $t(1-t)$, which is zero at both $t = 0$ and $t = 1$: the curve leaves its starting value and settles into its final one with no corner at either end, and it does it over a window you pick rather than over the whole number line. If you also need the second derivative to vanish, say the output is a position and you want the acceleration to start and end at rest, the quintic version, $t^3(6t^2 - 15t + 10)$, buys you that at the cost of a steeper middle.

<!-- prettier-ignore -->
{% plot "Smoothstep: flat on both sides of a window you choose." %}
{
  "fn": "x <= x0 - w/2 ? 0 : x >= x0 + w/2 ? 1 : 3*pow((x - x0 + w/2)/w, 2) - 2*pow((x - x0 + w/2)/w, 3)",
  "samples": 600,
  "x": { "min": -6, "max": 6, "label": "input x" },
  "y": { "min": -0.05, "max": 1.05, "label": "output f(x)" },
  "markers": [{ "x": "x0", "label": "x₀" }],
  "sliders": [
    { "var": "x0", "label": "threshold x₀", "min": -4, "max": 4, "step": 0.1, "value": 0 },
    { "var": "w", "label": "width w", "min": 0.5, "max": 10, "step": 0.1, "value": 4 }
  ]
}
{% endplot %}

Either shape fits in a single expression in any language you like. In Python:

```python
import math


def sigmoid(x, x0=0.0, y0=0.0, y1=1.0, k=1.0):
    """Blend smoothly from y0 to y1 around the threshold x0."""
    return y0 + (y1 - y0) / (1.0 + math.exp(-k * (x - x0)))


def smoothstep(x, x0=0.0, w=1.0, y0=0.0, y1=1.0):
    """Same blend, over a window of width w, flat outside it."""
    t = min(max((x - x0) / w + 0.5, 0.0), 1.0)
    return y0 + (y1 - y0) * t * t * (3.0 - 2.0 * t)
```

And the same in C++:

```cpp
#include <algorithm>
#include <cmath>

double sigmoid(double x, double x0 = 0.0, double y0 = 0.0,
               double y1 = 1.0, double k = 1.0) {
  return y0 + (y1 - y0) / (1.0 + std::exp(-k * (x - x0)));
}

double smoothstep(double x, double x0 = 0.0, double w = 1.0,
                  double y0 = 0.0, double y1 = 1.0) {
  double t = std::clamp((x - x0) / w + 0.5, 0.0, 1.0);
  return y0 + (y1 - y0) * t * t * (3.0 - 2.0 * t);
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

## The Sign on the Bike Path

There's a radar speed sign on the path I ride most weekends: it flashes YOUR SPEED, the number in km/h, and a face, green and smiling if you're under the limit, yellow and frowning if you're over. At 15 it's cheerful and at 30 it's disappointed, both of which are useful. Ride at exactly the limit, though, and the sign comes apart: the face strobes between green and yellow several times a second, and what was supposed to be feedback turns into a novelty light show. I have, for research purposes, held that speed for an embarrassing length of time.

{% fig "/img/blog/sigmoids-are-the-best/speed_sign.png", "The genre, if not my particular offender." %}

That's the `if` from the top of this post wired to an LED panel. The radar estimate carries a few tenths of a km/h of noise, the comparison against the limit is a hard threshold, and every update lands on whichever side the noise picked.

Both of the sign's outputs are continuous quantities pretending to be binary: the color is a point on a line from green to yellow, and the mouth is an arc that can bend either way. One sigmoid drives both.

```python
LIMIT = 20.0  # km/h


def face(speed):
    s = sigmoid(speed, x0=LIMIT, k=1.2)  # 0 well under the limit, 1 well over
    red, green = s, 1.0                  # (0,1,0) green fading to (1,1,0) yellow
    mouth = 1.0 - 2.0 * s                # +1 smiling, 0 flat, -1 frowning
    return (red, green, 0.0), mouth
```

At exactly the limit you get a lime face with a flat mouth, which is an honest picture of riding at exactly the limit, and a tenth of a km/h of noise moves the mouth by a hair instead of flipping the entire panel. The weight $k$ decides how wide the ambiguous band is: at $k = 1.2$ the face is unambiguously green below about 18 km/h and unambiguously yellow above about 22, and everything in between is a mix. That's a design decision the hard threshold never let anyone make.

If the panel really is two fixed bitmaps with nothing available in between, the sigmoid still earns its keep. Take the speeds where it crosses 0.1 and 0.9, 18.2 and 21.8 km/h, and use those as the two edges of a hysteresis band: the face turns yellow at 21.8 and doesn't go green again until you drop below 18.2. Same curve, quantized at the last step instead of the first.

Swap the threshold `if` for a sigmoid and the hardware stops fighting your code: the motor eases into its setpoint instead of slamming into it, and the energy bill stays finite. Sigmoids, as the title promised, are the best.
