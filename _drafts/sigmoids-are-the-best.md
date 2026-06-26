---
layout: layouts/post.njk
author: Carlos
title: Sigmoids are the best
categories:
  -
tags:
  -
---

There's a distinction in programming robots that doesn't show up in most other kinds of code, and it's one I learned early on, back when I first started writing software that actuates in the physical world. It surfaces in the most ordinary place imaginable: a use of `if` that, once you see the problem, becomes quietly preposterous, the threshold check. It looks something like this:

```python
def command(value):
    my_threshold = 0.5
    if value < my_threshold:
        return 2 * value
    else:
        return 0
```

## Infinite Energy

<figure class="post-fig">
<svg viewBox="0 0 340 200" role="img" aria-label="A step function jumping instantly from low to high at the threshold" style="max-width:420px;width:100%;height:auto;background:#fff;border-radius:6px">
  <line x1="40" y1="40" x2="40" y2="180" stroke="#bbb" stroke-width="1" />
  <line x1="40" y1="180" x2="320" y2="180" stroke="#bbb" stroke-width="1" />
  <polyline points="40,170 180,170 180,40 320,40" fill="none" stroke="#2b6cb0" stroke-width="3" />
  <line x1="180" y1="170" x2="180" y2="40" stroke="#e53e3e" stroke-width="3" stroke-dasharray="5 4" />
  <text x="190" y="100" fill="#e53e3e" font-size="13" font-family="sans-serif">infinite slope</text>
  <text x="150" y="196" fill="#888" font-size="12" font-family="sans-serif">threshold</text>
</svg>
<figcaption>What the <code>if</code> quietly asks for: an instant jump, which is an infinite slope, which is an infinite amount of energy.</figcaption>
</figure>

So what's so bad about it? Nothing, syntactically; it's perfectly legal and a legitimate thing to write. But in robotics, or in any program whose outputs have physical consequences (motion, sound, heating and cooling, lights), that sharp discontinuity quietly asks for something impossible: an infinite amount of energy.

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
- **Weight, $k$:** how sharp the transition is. A small $k$ gives a lazy ramp, a large $k$ tightens it toward a wall, and $k \to \infty$ hands you back the original step. In other words, the sigmoid is just the `if` with a dial for how much energy you're willing to spend.

Drag the sliders and watch what each one does to the curve:

<figure class="post-fig">
<div class="sig-widget" id="sigDemo">
  <svg class="sig-plot" viewBox="0 0 340 210" role="img" aria-label="Interactive sigmoid plot"></svg>
  <div class="sig-controls">
    <label>threshold x<sub>0</sub> <input type="range" min="-4" max="4" step="0.1" value="0" data-k="x0"><span data-v="x0">0.0</span></label>
    <label>weight k <input type="range" min="0.3" max="15" step="0.1" value="2" data-k="k"><span data-v="k">2.0</span></label>
    <label>initial y<sub>0</sub> <input type="range" min="0" max="1" step="0.01" value="0" data-k="y0"><span data-v="y0">0.00</span></label>
    <label>final y<sub>1</sub> <input type="range" min="0" max="1" step="0.01" value="1" data-k="y1"><span data-v="y1">1.00</span></label>
  </div>
</div>
<figcaption>The same transition the <code>if</code> wanted, now with a slope you can afford.</figcaption>
</figure>

<style>
.sig-widget { display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; justify-content: center; }
.sig-plot { background: #fff; border-radius: 6px; width: 340px; max-width: 100%; height: auto; }
.sig-controls { display: flex; flex-direction: column; gap: 0.4rem; font-family: sans-serif; font-size: 0.85rem; min-width: 220px; }
.sig-controls label { display: grid; grid-template-columns: 5.5rem 1fr 2.5rem; align-items: center; gap: 0.4rem; }
.sig-controls span { text-align: right; font-variant-numeric: tabular-nums; }
</style>

<script>
(function () {
  var root = document.getElementById("sigDemo");
  if (!root) return;
  var svg = root.querySelector(".sig-plot");
  var p = { x0: 0, k: 2, y0: 0, y1: 1 };
  var L = 40, R = 320, T = 20, B = 180, XMIN = -6, XMAX = 6;
  function sx(x) { return L + (x - XMIN) / (XMAX - XMIN) * (R - L); }
  function sy(y) { return B - y * (B - T); }
  function f(x) { return p.y0 + (p.y1 - p.y0) / (1 + Math.exp(-p.k * (x - p.x0))); }
  function draw() {
    var pts = "";
    for (var i = 0; i <= 120; i++) {
      var x = XMIN + (XMAX - XMIN) * i / 120;
      pts += sx(x).toFixed(1) + "," + sy(f(x)).toFixed(1) + " ";
    }
    var thx = sx(p.x0).toFixed(1);
    svg.innerHTML =
      '<line x1="' + L + '" y1="' + T + '" x2="' + L + '" y2="' + B + '" stroke="#bbb"/>' +
      '<line x1="' + L + '" y1="' + B + '" x2="' + R + '" y2="' + B + '" stroke="#bbb"/>' +
      '<line x1="' + thx + '" y1="' + T + '" x2="' + thx + '" y2="' + B + '" stroke="#e2e8f0" stroke-dasharray="4 3"/>' +
      '<polyline points="' + pts.trim() + '" fill="none" stroke="#2b6cb0" stroke-width="3"/>';
  }
  root.querySelectorAll("input[type=range]").forEach(function (inp) {
    inp.addEventListener("input", function () {
      var key = inp.getAttribute("data-k");
      p[key] = parseFloat(inp.value);
      var out = root.querySelector('[data-v="' + key + '"]');
      out.textContent = (key === "y0" || key === "y1") ? p[key].toFixed(2) : p[key].toFixed(1);
      draw();
    });
  });
  draw();
})();
</script>

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
    gate = sigmoid(value, x0=0.5, y0=1.0, y1=0.0, k=20.0)
    return 2 * value * gate
```

Below the threshold the gate sits near 1 and you get the original `2 * value`; above it the gate slides to 0 and the output bleeds away, and `k` decides how abrupt that shoulder is.

Swap the threshold `if` for a sigmoid and the hardware stops fighting your code: the motor eases into its setpoint, the battery keeps its charge, and the energy bill stays finite. Sigmoids, as the title promised, are the best.
