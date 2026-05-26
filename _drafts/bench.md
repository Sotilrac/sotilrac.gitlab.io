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

Two decades ago, when I was a teenager soldering my way through hobby projects, I kept Alan Parekh's [LED resistor calculator](http://www.alan-parekh.com/led_resistor_calculator.html) bookmarked. It's a simple computation but i dind't want to get it wrong. Little did I know how lucky I was to be able o access this simple tool without a login, popups, cookies, analytics, or adds. I typed in the supply voltage, the LED's forward voltage, the desired current, and out came a resistor value. I used it a hundred times. Thanks Alan! The site is still up, frozen in amber behing the obligatory http-only warning.

Today's options are sadder. Sarching for "LED resistor calculator" and you get a dozen near-identical SEO farms wrapped in cookie banners, demand your email for the E96 series, or try to upsell you a course.

I wanted to give back and suplement Alan's calculator with other computations that I do on daly basis. I hope professionals and hobbyists can find this useful. So I built the EE Calculator below.

{% calc "ee" %}

## What's inside

Each section below explains what the corresponding tool does and the math it runs.

### Standard resistor finder

Type a target value, pick a tolerance series (E6 through E96), and the tool returns the nearest standard values with the percent error.

E-series values are spaced geometrically. Series $E_N$ has $N$ values per decade at

$$V_n = 10^{n/N}, \quad n = 0, 1, \dots, N-1$$

The spacing is chosen so the tolerance bands of adjacent values just touch. For a series with tolerance $T$ percent, you need roughly $N \approx \frac{1}{\log_{10}(1 + 2T/100)}$ values per decade. That's why E12 (10%) needs 12 values per decade and E96 (1%) needs 96. Any value between two standards falls inside one of their tolerance bands, so there's no manufacturing reason to offer it.

### Resistor color code

Click the bands to change colors, or type a value and the calculator shows the band pattern. Toggle between 4, 5, and 6-band resistors.

For a 4-band resistor:

$$R = (d_1 \cdot 10 + d_2) \cdot M, \quad \pm T\%$$

For 5-band and 6-band, three significant digits:

$$R = (d_1 \cdot 100 + d_2 \cdot 10 + d_3) \cdot M, \quad \pm T\%$$

The digit bands $d_i$ use black=0 through white=9. The multiplier band $M$ is also colored: black=1, brown=10, red=100, and so on up to white=10⁹ (plus gold=0.1, silver=0.01 for fractional values). The tolerance band uses gold=5%, brown=1%, blue=0.25%, etc. The optional 6th band gives the temperature coefficient in ppm/°C.

### Series/parallel reducer

Comma-separated values in, equivalent value out. Resistors:

$$R_\text{series} = R_1 + R_2 + \dots + R_n, \qquad \frac{1}{R_\text{parallel}} = \frac{1}{R_1} + \frac{1}{R_2} + \dots + \frac{1}{R_n}$$

Capacitors are the dual:

$$\frac{1}{C_\text{series}} = \frac{1}{C_1} + \frac{1}{C_2} + \dots + \frac{1}{C_n}, \qquad C_\text{parallel} = C_1 + C_2 + \dots + C_n$$

When you can't buy a non-standard value, two close E-series parts in series or parallel often land within 1% of your target. The diagram in this section grows to 8 components and stops; the math handles however many you type.

### Ohm's law

Fill any two of V, I, R, P and the other two appear. SI prefixes work everywhere (`4.7k`, `10m`, `2.2µ`, `1M`).

The four pairwise relationships:

$$V = I \cdot R, \qquad P = V \cdot I = \frac{V^2}{R} = I^2 \cdot R$$

That's the "power wheel" the back of every textbook has, minus the pie chart.

### Voltage divider

Forward: plug in V_in, R₁, R₂, get V_out. Reverse: plug in V_in and a target V_out, get the closest E-series pair for R₁ and R₂.

$$V_\text{out} = V_\text{in} \cdot \frac{R_2}{R_1 + R_2}$$

The formula assumes the load draws zero current (infinite input impedance). For real loads, keep R₂ at least ten times smaller than the load impedance to keep the divider error under ~10%. The current through the divider is $I = V_\text{in} / (R_1 + R_2)$; the power burnt by both resistors together is $V_\text{in} \cdot I$.

### LED current-limiting resistor

The original Parekh use case, extended for chains of LEDs in series.

$$V_R = V_\text{supply} - N \cdot V_f, \qquad R = \frac{V_R}{I_f}$$

$N$ is the number of LEDs in series, $V_f$ is the forward voltage per LED, and $I_f$ is the target current. The voltage left over after the LED chain drops across the resistor.

Power dissipated in R:

$$P_R = I_f^2 \cdot R = V_R \cdot I_f$$

The tool picks a wattage rating with 50% derating, so a resistor that needs to dissipate 0.12 W gets a 1/4 W suggestion. Cheap, cool, and they last forever.

### Sine amplitudes

For a pure sine wave, the four common amplitude representations are all related to the peak:

$$V_\text{pp} = 2 V_p, \qquad V_\text{rms} = \frac{V_p}{\sqrt{2}} \approx 0.707 \, V_p, \qquad V_\text{avg} = \frac{2 V_p}{\pi} \approx 0.637 \, V_p$$

$V_\text{avg}$ here is the full-wave rectified mean. Square waves and triangle waves use different factors; the calculator notes the assumption.

### Frequency, period, ω

$$T = \frac{1}{f}, \qquad \omega = 2 \pi f$$

The angular frequency $\omega$ shows up everywhere reactance, phase, or complex impedance does.

### dBm, power, V_rms

Decibels are ratios on a log scale. For absolute power referenced to 1 mW:

$$\text{dBm} = 10 \log_{10}\!\left(\frac{P}{1 \text{ mW}}\right), \qquad P = 10^{\text{dBm}/10} \text{ mW}$$

Combined with a load impedance, voltage falls out:

$$V_\text{rms} = \sqrt{P \cdot Z}$$

At 50 Ω, +10 dBm = 10 mW = 707 mV_rms = 1 V_peak. At 600 Ω, the same +10 dBm gives 2.45 V_rms. RF, audio, and instrumentation people argue about which Z is "natural" depending on what's plugged into the spectrum analyzer.

### RC cutoff

Any two of R, C, f_c, and you get the third plus the time constant. Same math for low-pass and high-pass; both topologies sit side by side so you can see which one you're building.

$$f_c = \frac{1}{2 \pi R C}, \qquad \tau = R C$$

At the -3 dB cutoff frequency, $|H(f_c)| = 1/\sqrt{2}$ ≈ 0.707 and the phase shift is ±45° (lagging for low-pass, leading for high-pass). The transfer functions:

$$H_\text{LP}(j\omega) = \frac{1}{1 + j \omega R C}, \qquad H_\text{HP}(j\omega) = \frac{j \omega R C}{1 + j \omega R C}$$

### 555 timer

Astable and monostable, both directions. Give it R₁, R₂, and C for the frequency and duty, or hand it a target frequency and duty and it picks E24 components.

**Astable** (free-running oscillator). The classic "make this LED blink" circuit, but the same topology is what powers simple tone generators, clock sources for small digital projects, and PWM for dimming or motor speed control. Anywhere you want a square-ish wave at a fixed (or knob-tunable) rate without writing firmware.

{% fig "/img/blog/bench/555-astable.svg", "555 astable application circuit" %}

$$t_\text{high} = \ln 2 \cdot (R_1 + R_2) \cdot C \approx 0.693 (R_1 + R_2) C$$

$$t_\text{low} = \ln 2 \cdot R_2 \cdot C \approx 0.693 \, R_2 C$$

$$f = \frac{1}{t_\text{high} + t_\text{low}} = \frac{1.44}{(R_1 + 2 R_2) \cdot C}, \qquad D = \frac{R_1 + R_2}{R_1 + 2 R_2}$$

The 0.693 is $\ln 2$. The capacitor charges through $R_1 + R_2$ from $\frac{1}{3} V_\text{cc}$ to $\frac{2}{3} V_\text{cc}$, then discharges through $R_2$ alone from $\frac{2}{3} V_\text{cc}$ back to $\frac{1}{3} V_\text{cc}$. Each phase takes $\ln 2 \cdot \tau$ because of the exponential charge/discharge. Duty is always above 50% in the classic topology because the high phase uses both resistors and the low phase uses only $R_2$. Symmetric duty needs a diode trick.

**Monostable** (one-shot pulse). One pulse of a defined width every time the trigger fires. Useful for debouncing a noisy pushbutton, generating a turn-on delay, stretching a short input pulse into something a slower part can latch, or driving a relay that should stay on for exactly _N_ seconds after you press a button.

{% fig "/img/blog/bench/555-monostable.svg", "555 monostable application circuit" %}

$$t = \ln 3 \cdot R \cdot C \approx 1.1 R C$$

Pin 2 (TRIG) is held high until you pull it momentarily below $\frac{1}{3} V_\text{cc}$. The capacitor then charges through $R$ from 0 V; when it reaches $\frac{2}{3} V_\text{cc}$ the output goes low again. The charge from 0 to $\frac{2}{3} V_\text{cc}$ on an exponential takes $\ln 3 \cdot \tau$.

For both modes the math assumes pin 4 (RESET) is tied to V_cc and pin 5 (CTRL) has a small bypass cap (typically 10 nF) to ground for noise rejection. See the [Wikipedia article on the 555](https://en.wikipedia.org/wiki/555_timer_IC) for the internal block diagram and a deeper history. (Schematics above are public-domain SVGs sourced from Wikimedia Commons: [astable](https://commons.wikimedia.org/wiki/File:555_Astable_Diagram.svg), [monostable](https://commons.wikimedia.org/wiki/File:555_Monostable.svg).)

### AWG wire gauge

A full table of gauges with diameter, cross-section, resistance per length, and ampacity. Enter a target current to highlight gauges that handle it. Enter a length to see total resistance per gauge.

Diameter:

$$d_\text{mm} = 0.127 \cdot 92^{(36 - n)/39}$$

Each gauge step is a factor of $92^{1/39} \approx 1.123$ in diameter, so cross-sectional area scales by $1.123^2 \approx 1.26$. Three gauges = halving the area. Six gauges = quartering it.

Cross-section: $A = \pi (d/2)^2$. In circular mils: $\text{cmil} = (d_\text{mil})^2$.

Copper resistance per meter at 20 °C, with $\rho_\text{Cu} = 1.724 \times 10^{-8}$ Ω·m:

$$\frac{R}{\ell} = \frac{\rho_\text{Cu}}{A}$$

Ampacity is the steady-state current a conductor can carry before its insulation overheats. It's a heat-dissipation limit, not a "the wire will vaporize" limit — exceed it and the insulation cooks, the surrounding parts get hot, and over time the wire fails. Ampacity depends on the wire's gauge, insulation type, ambient temperature, and how easily heat can escape (a single wire in open air sheds heat much better than the same wire bundled with eleven others inside a conduit).

Two rules of thumb the calculator uses:

- **Chassis wiring** (short runs in air, point-to-point inside an enclosure): about 92 cmil per amp. 22 AWG ≈ 7 A.
- **Power transmission** (long runs in conduit, derated for heat): NEC 310.16, around 700 cmil per amp. 22 AWG ≈ 0.9 A.

### PCB trace width

IPC-2221A formula. Inputs: current, copper weight, temperature rise above ambient, and whether the trace is internal or external. Output: minimum trace width in mm and mil.

The empirical relation:

$$I = k \cdot \Delta T^{0.44} \cdot A^{0.725}$$

$A$ is the cross-section in mil², $\Delta T$ is the allowable temperature rise above ambient in °C, and $k$ is 0.048 for external traces or 0.024 for internal. Solving for $A$ given a target current:

$$A = \left( \frac{I}{k \cdot \Delta T^{0.44}} \right)^{1/0.725}$$

Then width = $A$ / thickness, where 1 oz copper ≈ 1.378 mil thick.

IPC-2221A is the conservative legacy standard. The newer IPC-2152 allows narrower traces for the same current with a richer model, but it's paywalled. Add margin for vias, bends, and ambient heat regardless of which standard you use.

## Other features

A few UI niceties not covered by the math:

- **Live compute**. Results update as you type.
- **SI prefix parsing** on every numeric input: `4.7k`, `100m`, `2.2µ` (or `2.2u`), `1M`, `100n`, `1p`, with an optional unit suffix that's quietly ignored.
- **Copy button** on every result row so a value flows into the next tool without retyping.
- **Clear (×) button** on every text input so you can wipe a field with a click.
- **Themed number spinners** that replace the browser's default up/down arrows.
- **Inline schematics** rendered by a shared circuit builder so symbols stay consistent across tools.

## Embed it

The EE Calculator is a single-file Web Component with no dependencies. Drop it in any HTML page:

```html
<script src="https://asmat.ca/js/ee-calculator.js"></script>
<ee-calculator></ee-calculator>
```

Shadow DOM keeps the styles isolated so it won't fight your site's CSS.

## How it's built

One file of plain JavaScript, plus a tiny build step:

- **Web Component** with Shadow DOM for style isolation
- **Per-tool pure functions** so the math is independent of the DOM and easy to verify
- **E-series tables** baked in as constants (E6, E12, E24, E48, E96), with a generic `nearestStandard` that snaps any target to the closest preferred value
- **SI prefix parser** that handles `4.7k`, `2.2µ`, `100n`, `1M`, with or without a unit suffix
- **Circuit builder** that composes IEC-style schematics from primitives (wire, resistor, capacitor, LED, ground, terminal) on a 20-pixel grid, pulling symbol bodies from inline `<symbol>` defs

The sources live in `src/ee-calculator/` (CSS, JS, and four SVG symbol files). A small Node script bundles them into a single `js/ee-calculator.js` at build time. No framework, no dependencies to break, no service worker that won't unregister. It should work as long as browsers do.
