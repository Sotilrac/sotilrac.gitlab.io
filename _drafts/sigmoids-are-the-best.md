---
layout: layouts/post.njk
author: Carlos
title: Sigmoids are the best
categories:
  -
tags:
  -
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

<figure class="post-fig" style="--fig-width: 76em">
<svg viewBox="0 0 360 230" role="img" aria-label="A step function jumping instantly from low to high at the threshold" style="width:720px;max-width:100%;height:auto;background:#fff;border-radius:6px">
  <line x1="55" y1="30" x2="55" y2="180" stroke="#999" />
  <line x1="55" y1="180" x2="330" y2="180" stroke="#999" />
  <line x1="50" y1="180" x2="55" y2="180" stroke="#999" />
  <line x1="50" y1="30" x2="55" y2="30" stroke="#999" />
  <text x="46" y="184" fill="#666" font-size="11" font-family="sans-serif" text-anchor="end">0</text>
  <text x="46" y="34" fill="#666" font-size="11" font-family="sans-serif" text-anchor="end">1</text>
  <line x1="192.5" y1="180" x2="192.5" y2="185" stroke="#999" />
  <text x="192.5" y="199" fill="#666" font-size="11" font-family="sans-serif" text-anchor="middle">threshold</text>
  <polyline points="55,180 192.5,180 192.5,30 330,30" fill="none" stroke="#2b6cb0" stroke-width="3" />
  <line x1="192.5" y1="180" x2="192.5" y2="30" stroke="#e53e3e" stroke-width="3" stroke-dasharray="5 4" />
  <text x="202" y="100" fill="#e53e3e" font-size="12" font-family="sans-serif">infinite slope</text>
  <text x="192.5" y="217" fill="#444" font-size="12" font-family="sans-serif" text-anchor="middle">input</text>
  <text x="16" y="105" fill="#444" font-size="12" font-family="sans-serif" text-anchor="middle" transform="rotate(-90 16 105)">output</text>
</svg>
<figcaption>An instant jump, with an infinite slope.</figcaption>
</figure>

So what's so bad about it? Nothing, syntactically; it's perfectly legal and a legitimate thing to write. But in robotics, or in any program whose outputs have physical consequences (motion, sound, heating and cooling, lights), that sharp discontinuity requires for something impossible: an infinite amount of energy.

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

<figure class="post-fig" style="--fig-width: 76em">
<div class="sig-widget" id="sigDemo">
  <svg class="sig-plot" viewBox="0 0 360 240" role="img" aria-label="Interactive sigmoid plot"></svg>
  <div class="sig-controls">
    <label><span class="sig-name">threshold x<sub>0</sub></span><input type="range" min="-4" max="4" step="0.1" value="0" data-k="x0"><span class="sig-val" data-v="x0">0.0</span></label>
    <label><span class="sig-name">weight k</span><input type="range" min="0.3" max="15" step="0.1" value="2" data-k="k"><span class="sig-val" data-v="k">2.0</span></label>
    <label><span class="sig-name">initial y<sub>0</sub></span><input type="range" min="0" max="1" step="0.01" value="0" data-k="y0"><span class="sig-val" data-v="y0">0.00</span></label>
    <label><span class="sig-name">final y<sub>1</sub></span><input type="range" min="0" max="1" step="0.01" value="1" data-k="y1"><span class="sig-val" data-v="y1">1.00</span></label>
  </div>
</div>
<figcaption>The same transition the <code>if</code> wanted, now with a slope you can afford.</figcaption>
</figure>

<style>
.sig-widget { display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; justify-content: center; }
.sig-plot { background: #fff; border-radius: 6px; width: 680px; max-width: 100%; height: auto; }
.sig-controls { display: flex; flex-direction: column; gap: 0.5rem; font-family: sans-serif; font-size: 0.85rem; width: 260px; max-width: 100%; }
.sig-controls label { display: grid; grid-template-columns: 6.5rem 1fr 2.75rem; align-items: center; gap: 0.5rem; }
.sig-controls input[type="range"] { width: 100%; min-width: 0; margin: 0; }
.sig-controls .sig-val { text-align: right; font-variant-numeric: tabular-nums; }
</style>

<script>
(function () {
  var root = document.getElementById("sigDemo");
  if (!root) return;
  var svg = root.querySelector(".sig-plot");
  var p = { x0: 0, k: 2, y0: 0, y1: 1 };
  var L = 55, R = 345, T = 20, B = 190, XMIN = -6, XMAX = 6;
  function sx(x) { return L + (x - XMIN) / (XMAX - XMIN) * (R - L); }
  function sy(y) { return B - y * (B - T); }
  function f(x) { return p.y0 + (p.y1 - p.y0) / (1 + Math.exp(-p.k * (x - p.x0))); }
  function line(x1, y1, x2, y2, c) {
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + c + '"/>';
  }
  function text(x, y, t, anchor, c) {
    return '<text x="' + x + '" y="' + y + '" fill="' + c + '" font-size="11" font-family="sans-serif" text-anchor="' + anchor + '">' + t + '</text>';
  }
  function draw() {
    var s = "";
    s += line(L, T, L, B, "#999");
    s += line(L, B, R, B, "#999");
    var xticks = [-6, -3, 0, 3, 6];
    for (var i = 0; i < xticks.length; i++) {
      var xt = sx(xticks[i]).toFixed(1);
      s += line(xt, B, xt, B + 5, "#999");
      s += text(xt, B + 18, xticks[i], "middle", "#666");
    }
    var yticks = [0, 0.5, 1];
    for (var j = 0; j < yticks.length; j++) {
      var yt = sy(yticks[j]).toFixed(1);
      s += line(L - 5, yt, L, yt, "#999");
      s += text(L - 9, (sy(yticks[j]) + 4).toFixed(1), yticks[j], "end", "#666");
    }
    var midY = ((T + B) / 2).toFixed(1);
    s += text(((L + R) / 2).toFixed(1), B + 34, "input  x", "middle", "#444");
    s += '<text x="16" y="' + midY + '" fill="#444" font-size="11" font-family="sans-serif" text-anchor="middle" transform="rotate(-90 16 ' + midY + ')">output  f(x)</text>';
    var thx = sx(p.x0).toFixed(1);
    s += line(thx, T, thx, B, "#e2e8f0").replace("/>", ' stroke-dasharray="4 3"/>');
    s += text(thx, T - 4, "x₀", "middle", "#a0aec0");
    var pts = "";
    for (var k = 0; k <= 120; k++) {
      var x = XMIN + (XMAX - XMIN) * k / 120;
      pts += sx(x).toFixed(1) + "," + sy(f(x)).toFixed(1) + " ";
    }
    s += '<polyline points="' + pts.trim() + '" fill="none" stroke="#2b6cb0" stroke-width="3"/>';
    svg.innerHTML = s;
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
    gate = sigmoid(value, x0=0.5, y0=1.0, y1=0.0, k=8.0)
    return 2 * value * gate
```

Below the threshold the gate sits near 1 and you get the original `2 * value`; above it the gate slides to 0 and the output bleeds away, and `k` decides how abrupt that shoulder is.

There's a second, subtler win here. With a hard threshold, an input that hovers right at the boundary is a disaster: a little sensor noise nudges it back and forth across the line, and the output flaps between the two branches on every reading. That's the chatter you hear as a buzzing relay or feel as a dithering motor, and the usual remedy is to bolt on hysteresis or a deadband to keep the comparison from twitching. The sigmoid never has the problem in the first place, because it's continuous: an input sitting on the threshold maps to a value halfway between the two ends, and a small wiggle in the input produces only a small wiggle in the output. There's no line to cross, so there's nothing to flap.

Swap the threshold `if` for a sigmoid and the hardware stops fighting your code: the motor eases into its setpoint, the battery keeps its charge, and the energy bill stays finite. Sigmoids, as the title promised, are the best.
