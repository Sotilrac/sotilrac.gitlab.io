---
author: Carlos
title: Bench
categories:
  - Tools
tags:
  - javascript
  - web-components
  - electronics
---

Two decades ago, when I was a teenager soldering my way through hobby projects, I kept Alan Parekh's [LED resistor calculator](http://www.alan-parekh.com/led_resistor_calculator.html) bookmarked. It's a simple computation but i dind't want to get it wrong. I didn;t realize how lucky I was back then to be able o access this simple tool without a login, popups, cookies, analytics, adds. You typed in the supply voltage, the LED's forward voltage, the desired current, and out came a resistor value. I used it a hundred times. Thanks Alan!

The site is still up, frozen in amber behing the obligatory http-only warning.

Today's options are sadder. Search "LED resistor calculator" and you get a dozen near-identical SEO farms, each loading three megabytes of JavaScript to do one division. Most are wrapped in cookie banners, demand your email for the E96 series, or try to upsell you a course. The ones that aren't are usually broken on mobile, or display ads where the answer should be, or require an account to "save" your calculation that you'll never look at again. The whole genre rotted.

So I built the EE Calculator.

<ee-calculator></ee-calculator>

<script src="/js/ee-calculator.js"></script>

## What's inside

**Resistor color code.** Click the bands to change colors, or type a value and the EE Calculator shows the band pattern. Toggle between 4, 5, and 6-band resistors. Tolerance and temperature coefficient included.

**Standard resistor finder.** Enter a target value and a tolerance series (E6 through E96), get the nearest standard values with percent error. Saves the "is 14.3kΩ a standard?" lookup.

**Voltage divider.** Works both ways. Plug in V_in, R1, R2 and read V_out. Or give it V_in and a target V_out, and it searches the E-series for the closest standard pair.

**LED resistor.** The original Parekh use case, extended for series chains. Pick supply voltage, forward voltage per LED, count, target current. You get the resistor (exact and nearest standard), power dissipation, and a suggested wattage rating with 50% derating.

**Ohm's law.** Fill in any two of V, I, R, P and the other two appear. SI prefixes work everywhere: `4.7k`, `10m`, `2.2µ`, `1M`. The four-quadrant power wheel without the pie chart.

**RC cutoff.** Any two of R, C, f_c, and you get the third plus the time constant. Same math for low-pass and high-pass; both topologies sit side by side so you can see which one you're building.

**555 timer.** Astable and monostable, both directions. Give it R1, R2, and C for the frequency and duty, or hand it a target frequency and duty and it picks E24 components.

**Series/parallel reducer.** Comma-separated values, toggle resistor or capacitor, toggle series or parallel. Useful for hitting non-standard values by combining standard ones.

**AWG wire gauge.** A full table of gauges with diameter, cross-section, resistance per meter and foot, and ampacity (chassis and NEC power). Enter a target current to highlight gauges that handle it. Enter a length to see total resistance for every gauge.

**PCB trace width.** IPC-2221A formula. Current, copper weight, temperature rise above ambient, internal versus external, out comes the minimum trace width in both mm and mil. The conservative number you should add margin to.

## Features

- Bidirectional solves on every tool that supports them
- SI prefix input parsing: `4.7k`, `100m`, `2.2u` or `2.2µ`, `1M`, `100n`, `1p`
- E-series everywhere: E6 (20%), E12 (10%), E24 (5%), E48 (2%), E96 (1%)
- Visual resistor with clickable bands
- Schematics drawn from a shared circuit-builder so symbols stay consistent across tools
- Zero dependencies, runs entirely in the browser, works offline
- One file, embeddable anywhere

## Embed it

The EE Calculator is a single-file Web Component with no dependencies. Drop it in any HTML page:

```html
<script src="https://asmat.ca/js/ee-calculator.js"></script>
<ee-calculator></ee-calculator>
```

Shadow DOM keeps the styles isolated so it won't fight your site's CSS.

## How it's built

One file of plain JavaScript:

- **Web Component** with Shadow DOM for style isolation
- **Per-tool pure functions** so the math is independent of the DOM and easy to verify
- **E-series tables** baked in as constants (E6, E12, E24, E48, E96), with a generic `nearestStandard` that snaps any target to the closest preferred value
- **SI prefix parser** that handles `4.7k`, `2.2µ`, `100n`, `1M`, with or without a unit suffix
- **Circuit builder** that composes IEC-style schematics from primitives (wire, resistor, capacitor, LED, ground, terminal) on a 20-pixel grid

No framework, no build step, no dependencies to break, no service worker that won't unregister. It should work as long as browsers do.
