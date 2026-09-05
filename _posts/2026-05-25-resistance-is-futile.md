---
layout: layouts/post.njk
author: Carlos
title: Resistance is Futile
figWidth: 24em
categories:
  - Tools
tags:
  - javascript
  - web-components
  - electronics
date: 2026-05-25T12:00:00-04:00
---

Two decades ago, when I was a teenager soldering my way through hobby projects, I kept Alan Parekh's [LED resistor calculator](http://www.alan-parekh.com/led_resistor_calculator.html) bookmarked. It's a simple computation but I didn't want to get it wrong. Little did I know how lucky I was to access a simple tool without a login, popups, cookies, analytics, or ads. I typed in the supply voltage, the LED's forward voltage, the desired current, and out came a resistor value. I used it a hundred times. Thanks Alan! The site is still up, frozen in amber behind the now obligatory HTTP-only warning.

I wanted to give back and couldn't resist the temptation to supplement Alan's calculator with the other computations I run on a daily basis.

{% calc "ee" %}

## Embed It

The EE Calculator is a single-file Web Component with no dependencies. Drop it in any HTML page:

```html
<script src="https://asmat.ca/js/ee-calculator.js"></script>
<ee-calculator></ee-calculator>
```

Shadow DOM keeps the styles isolated so it won't fight your site's CSS.

## The Math

### Standard Resistor Finder

When you go to buy a resistor, not every value is available. If the math says you need 43.5 Ω, no manufacturer makes that. You pick the closest available value instead. In the calculator, type a target value, pick a tolerance series (E6 through E96), and it returns the nearest standard values with the percent error.

{% fig "/img/blog/resistance-is-futile/but_why.gif" %}

But why? As always, math. E-series values are spaced geometrically. Series $E_N$ has $N$ values per decade at

$$V_n = 10^{n/N}, \quad n = 0, 1, \dots, N-1$$

The spacing is chosen so the tolerance bands of adjacent values just touch. For a series with tolerance $T$ percent, you need roughly $N \approx \frac{1}{\log_{10}(1 + 2T/100)}$ values per decade. That's why E12 (10%) needs 12 values per decade and E96 (1%) needs 96. Any value between two standards falls inside one of their tolerance bands, so there's no manufacturing reason to offer it.

### Resistor Colour Code

The coloured bands date to the 1920s, when resistors were tiny ceramic cylinders too small to fit a printed value on. The Radio Manufacturers Association picked a fixed digit-to-colour map so the value could be read from any angle, in any orientation, even after the part had been kicked around a workbench for years. [IEC 60062](https://webstore.iec.ch/en/publication/25395) made the scheme official and it survives to this day.

Resistors come with 4, 5, or 6 bands. The original four were enough to encode the value: two significant digits, a multiplier, and a tolerance, which covered the looser 5–20% series (E6, E12, E24). Five bands added precision by carrying a third significant digit, needed once the tighter E48/E96/E192 series put values close enough together that the second digit alone wouldn't separate them. Six bands added a temperature-coefficient (ppm/°C) band, because resistance drifts with heat.

In the calculator you can select the number of bands the resistor has, then either click the bands to set their colours or type the desired value.

#### 4-Band Resistor

$$R = (d_1 \cdot 10 + d_2) \cdot M, \quad \pm T\%$$

#### 5-Band and 6-Band

$$R = (d_1 \cdot 100 + d_2 \cdot 10 + d_3) \cdot M, \quad \pm T\%$$

The digit bands $d_i$ use black=0 through white=9. The multiplier band $M$ is also coloured: black=1, brown=10, red=100, and so on up to white=10⁹ (plus gold=0.1, silver=0.01 for fractional values). The tolerance band uses gold=5%, brown=1%, blue=0.25%, etc. The optional 6th band gives the temperature coefficient in ppm/°C.

#### Surface-Mount Resistors

Surface-mount resistors are too small for stripes, so they carry printed codes instead. The common three-digit code is two significant figures followed by a power-of-ten multiplier: `472` is $47 \times 10^2 = 4.7 \, \text{kΩ}$. Four-digit codes (used on E48/E96 precision parts) add a third significant figure: `4701` is $470 \times 10^1 = 4.7 \, \text{kΩ}$. An `R` stands in for a decimal point when the value is below 10 Ω, so `4R7` is $4.7 \, \text{Ω}$. The tiniest 0402 and 0201 packages, where even three digits won't fit, use the [EIA-96 code](https://en.wikipedia.org/wiki/EIA-96): two digits plus a letter that indexes into an E96 lookup table.

### Series/Parallel Reducer

The calculator can compute the equivalent series or parallel resistance, or the equivalent series or parallel capacitance. Type comma-separated values, and out comes the equivalent.

#### Resistors

$$R_\text{series} = R_1 + R_2 + \dots + R_n, \qquad \frac{1}{R_\text{parallel}} = \frac{1}{R_1} + \frac{1}{R_2} + \dots + \frac{1}{R_n}$$

#### Capacitors

$$\frac{1}{C_\text{series}} = \frac{1}{C_1} + \frac{1}{C_2} + \dots + \frac{1}{C_n}, \qquad C_\text{parallel} = C_1 + C_2 + \dots + C_n$$

### Ohm's Law

The calculator wouldn't be complete without the classic Ohm's law. Fill any two of V, I, R, P and the other two appear.

$$V = I \cdot R$$

$$P = V \cdot I = \frac{V^2}{R} = I^2 \cdot R$$

### Voltage Divider

Sooner or later you'll need a voltage that's different from your supply. A voltage divider is the simplest way to get one. The calculator works both forward (give it the two resistors, get the output voltage) and reverse (give it the target voltage, get the closest E-series pair).

$$V_\text{out} = V_\text{in} \cdot \frac{R_2}{R_1 + R_2}$$

The formula assumes the load draws zero current (infinite input impedance). For real loads, keep $R_2$ at least ten times smaller than the load impedance to keep the divider error under ~10%. The current through the divider is $I = V_\text{in} / (R_1 + R_2)$; the power burnt by both resistors together is $V_\text{in} \cdot I$.

### LED Current-Limiting Resistor

{% fig "/img/blog/resistance-is-futile/patrick_stewart_borg.gif" %}

Light-emitting diodes are, well, diodes. Past their forward voltage they want to conduct unlimited current, which in practice means burning out. Instead of wiring them straight to a supply, you add a series resistor. The resistor sets the current, which sets the brightness. Every LED has a preferred forward voltage and forward current listed on its datasheet (or you can find them experimentally, ramping the current slowly using a bench supply or a multimeter's diode-test mode).

$$V_R = V_\text{supply} - N \cdot V_f, \qquad R = \frac{V_R}{I_f}$$

$N$ is the number of LEDs in series, $V_f$ is the forward voltage per LED, and $I_f$ is the target current. The voltage left over after the LED chain is what the resistor drops.

#### Power Dissipated in R

$$P_R = I_f^2 \cdot R = V_R \cdot I_f$$

The tool picks a wattage rating with 50% derating, so a resistor that needs to dissipate 0.12 W gets a 1/4 W suggestion.

### Sine Amplitudes

AC signals are often modelled as pure sine waves. Amplitude can be quoted four ways: peak ($V_p$), peak-to-peak ($V_{pp}$, max minus min), root-mean-square ($V_{rms}$, the equivalent DC voltage for the same power), or full-wave rectified average ($V_{avg}$, the mean of the wave's absolute value). All four are tied to the peak:

$$V_\text{pp} = 2 V_p, \qquad V_\text{rms} = \frac{V_p}{\sqrt{2}} \approx 0.707 \, V_p, \qquad V_\text{avg} = \frac{2 V_p}{\pi} \approx 0.637 \, V_p$$

Square waves and triangle waves use different factors; the calculator notes the assumption.

### Frequency, Period, ω

$$T = \frac{1}{f}, \qquad \omega = 2 \pi f$$

The angular frequency $\omega$ shows up everywhere reactance, phase, or complex impedance does.

### dBm, Power, V_rms

{% fig "/img/blog/resistance-is-futile/up_to_eleven.gif" %}

Decibels show up everywhere a signal passes through a chain of stages that multiply or divide its power. An amplifier triples the power, a cable loses 30%, an attenuator drops it to a tenth. Tracking all of that as multiplications gets ugly fast. On a log scale, multiplications become additions: +5 dB amp, −1.5 dB cable, −10 dB attenuator. dBm anchors the log scale to 1 mW, so the units stay absolute (a dBm number maps to a power) instead of being just a ratio. For absolute power referenced to 1 mW:

$$\text{dBm} = 10 \log_{10}\!\left(\frac{P}{1 \text{ mW}}\right), \qquad P = 10^{\text{dBm}/10} \text{ mW}$$

Combined with a load impedance, voltage falls out:

$$V_\text{rms} = \sqrt{P \cdot Z}$$

Worked example at 50 Ω:

$$+10 \, \text{dBm} = 10 \, \text{mW} \implies V_\text{rms} = 707 \, \text{mV}, \quad V_p \approx 1 \, \text{V}$$

At 600 Ω the same +10 dBm gives $V_\text{rms} \approx 2.45 \, \text{V}$.

### LC Resonance

An inductor and a capacitor wired together form a tank, an LC resonator that sloshes energy back and forth between the coil's magnetic field and the cap's electric field. At the resonant frequency $f_0$, the two reactances cancel and the tank looks pure-resistive from the outside.

That cancellation is the trick behind powering a load through a small coil. A bare coil is mostly an inductor, which an AC source sees as a large reactive impedance: most of the source's energy reflects back instead of crossing into the magnetic field, and the rest heats the wire instead of reaching the load. Add a series capacitor sized so $X_C = X_L$ at the operating frequency and the reactances cancel; what remains in the loop is the ohmic loss of the wire, so the source pushes real current, the coil's field builds up, and a second coil tuned to the same frequency on the receiver side picks up enough flux to feed its load.

The Calculator comes in since both sides must have the same $f_0$. Feed it any two of $f$, $L$, $C$, plus an optional series resistance for the quality factor, other quantities follow.

{% fig "/img/blog/resistance-is-futile/lc-tanks.svg", "Series and parallel LC tank topologies." %}

_LC schematics adapted from [First Harmonic / Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Series_LC_Circuit.svg), [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/)._

$$f_0 = \frac{1}{2 \pi \sqrt{L C}}, \qquad X_L = \omega_0 L, \qquad X_C = \frac{1}{\omega_0 C}, \qquad Z_0 = \sqrt{\frac{L}{C}}$$

There are two ways to wire the tank. A series LC turns the cancellation into a short at $f_0$, which is what you want when driving from a voltage source: the loop impedance collapses to the parasitic resistance and current flows freely. A parallel LC turns the same cancellation into an open at $f_0$, which is what you want when driving from a current source or isolating one frequency from a wideband node. Either way, $Z_0 = \sqrt{L/C}$ is the tank's characteristic impedance: the value you match the source to for maximum power transfer, and the number a matching network has to land on.

The losses in real components add up to an equivalent series resistance $R$: the coil's DC resistance plus AC skin and proximity effects, the capacitor's ESR, and, in a wireless-power link, the impedance reflected back from whatever the receiver-side coil is feeding. That $R$ sets the tank's quality factor and bandwidth around $f_0$:

$$Q = \frac{\omega_0 L}{R} = \frac{1}{R}\sqrt{\frac{L}{C}}, \qquad \Delta f_{-3\text{dB}} = \frac{f_0}{Q}$$

High Q means low loss and narrow bandwidth, the central trade-off of every wireless-power link: a high-Q coil moves a larger fraction of the source's energy to the load, but a stray finger or a one-percent component shift detunes it right out of band; a low-Q coil tolerates sloppy alignment and component drift, at the cost of burning more of the source's energy as heat in the windings.

Hobbyists encounter LC resonance in ISM radio carriers (433 MHz, 915 MHz, 2.4 GHz), RFID and NFC tags (125 kHz LF, 13.56 MHz HF), and wireless power, where Qi and the newer Qi2 (the standard behind Apple's MagSafe) own the consumer market on inductive coupling at 87 to 205 kHz. The other band that turns up in hobbyist and research wireless-power work is 6.78 MHz, a globally harmonized ISM frequency with no Part 18 in-band power cap, which is why it keeps showing up in experimental resonant links. The calculator's preset buttons jump straight to 125 kHz, 200 kHz, 6.78 MHz, and 13.56 MHz.

### RC Cutoff

RC filters appear everywhere you need to bandwidth-limit a signal: antialiasing in front of an ADC, blocking DC out of an AC-coupled audio stage, smoothing PWM into something approaching a steady voltage, debouncing a logic edge, rolling off high-frequency noise on a sensor line. They're the simplest filter you can build, and they're often "good enough".

Give the calculator any two of R, C, $f_c$ and it returns the third plus the time constant. The math is the same for low-pass and high-pass; only the topology differs, so both schematics sit side by side.

$$f_c = \frac{1}{2 \pi R C}, \qquad \tau = R C$$

At the -3 dB cutoff frequency, $|H(f_c)| = 1/\sqrt{2} \approx 0.707$ and the phase shift is $\pm 45°$ (lagging for low-pass, leading for high-pass). The transfer functions:

$$H_\text{LP}(j\omega) = \frac{1}{1 + j \omega R C}, \qquad H_\text{HP}(j\omega) = \frac{j \omega R C}{1 + j \omega R C}$$

### 555 Timer

The 555 is one of the most-produced ICs ever made, still in production fifty years after its design because it solves a common problem cheaply and without any firmware. When you need a clock signal, a delay, or a one-shot pulse on a board that doesn't have a microcontroller, the 555 (or its CMOS sibling, the 7555) is the first part to reach for. The calculator handles both modes, both directions: give it $R_1$, $R_2$, and $C$ and it returns frequency and duty; give it a target frequency and duty and it picks E24 components.

{% fig "/img/blog/resistance-is-futile/kitt_scanner_light.gif" %}

#### Astable (free-running oscillator)

This is the circuit every EE in training yearns to make, the mythical "make this LED blink" project. The same topology also powers simple tone generators, clock sources for small digital projects, and PWM for dimming or motor speed control. Anywhere you want a squarish wave at a fixed (or knob-tunable) rate without writing firmware.

{% fig "/img/blog/resistance-is-futile/555-astable.svg", "555 astable application circuit" %}

$$t_\text{high} = \ln 2 \cdot (R_1 + R_2) \cdot C \approx 0.693 (R_1 + R_2) C$$

$$t_\text{low} = \ln 2 \cdot R_2 \cdot C \approx 0.693 \, R_2 C$$

$$f = \frac{1}{t_\text{high} + t_\text{low}} = \frac{1.44}{(R_1 + 2 R_2) \cdot C}, \qquad D = \frac{R_1 + R_2}{R_1 + 2 R_2}$$

The capacitor charges through $R_1 + R_2$ from $\frac{1}{3} V_\text{cc}$ to $\frac{2}{3} V_\text{cc}$, then discharges through $R_2$ alone from $\frac{2}{3} V_\text{cc}$ back to $\frac{1}{3} V_\text{cc}$. Each phase takes $\ln 2 \cdot \tau$ because of the exponential charge/discharge. Duty is always above 50% in the classic topology because the high phase uses both resistors and the low phase uses only $R_2$. Symmetric duty needs a diode trick.

#### Monostable (one-shot pulse)

One pulse of a defined width every time the trigger fires. Useful for debouncing a noisy push button, generating a turn-on delay, stretching a short input pulse into something a slower part can latch, or driving a relay that should stay on for exactly _N_ seconds after you press a button.

{% fig "/img/blog/resistance-is-futile/555-monostable.svg", "555 monostable application circuit" %}

$$t = \ln 3 \cdot R \cdot C \approx 1.1 R C$$

Pin 2 (TRIG) is held high until you pull it momentarily below $\frac{1}{3} V_\text{cc}$. The capacitor then charges through $R$ from 0 V; when it reaches $\frac{2}{3} V_\text{cc}$ the output goes low again. The charge from 0 to $\frac{2}{3} V_\text{cc}$ on an exponential takes $\ln 3 \cdot \tau$.

For both modes the math assumes pin 4 (RESET) is tied to $V_\text{cc}$ and pin 5 (CTRL) has a small bypass cap (typically 10 nF) to ground for noise rejection. See the [Wikipedia article on the 555](https://en.wikipedia.org/wiki/555_timer_IC) for the internal block diagram and a deeper history. (Schematics above are public-domain SVGs sourced from Wikimedia Commons: [astable](https://commons.wikimedia.org/wiki/File:555_Astable_Diagram.svg), [monostable](https://commons.wikimedia.org/wiki/File:555_Monostable.svg).)

### AWG

American Wire Gauge, standardized in 1857 at Brown & Sharpe Manufacturing in Providence, Rhode Island. The counterintuitive bigger-number-means-thinner-wire convention comes from the wire-drawing process: a freshly cast rod was pulled through successively smaller dies, and the "gauge" was originally the number of draw operations the wire had been through. More draws yield a thinner wire.

Wire gauge matters whenever current matters. Pick too thin and the wire overheats or drops noticeable voltage along its length. Pick too thick and it's expensive, stiff, and a pain to route. Hobby jumpers are 22-24 AWG, chassis power wiring 14-18, battery interconnects on RC cars or e-bikes 8-12.

The calculator shows a full table of gauges with diameter, cross-section, resistance per length, and ampacity. Enter a target current to highlight gauges that handle it. Enter a length to see the total resistance per gauge.

#### Diameter

$$d_\text{mm} = 0.127 \cdot 92^{(36 - n)/39}$$

Each gauge step is a factor of $92^{1/39} \approx 1.123$ in diameter, so cross-sectional area scales by $1.123^2 \approx 1.26$. Three gauges = halving the area. Six gauges = quartering it.

Cross-section: $A = \pi (d/2)^2$. In circular mils: $\text{cmil} = (d_\text{mil})^2$.

Copper resistance per meter at 20 °C, with $\rho_\text{Cu} = 1.724 \times 10^{-8}$ Ω·m:

$$\frac{R}{\ell} = \frac{\rho_\text{Cu}}{A}$$

Ampacity is the steady-state current a conductor can carry before its insulation overheats. It's a heat-dissipation limit, not a "the wire will vaporize" limit. Exceed it and the insulation cooks, the surrounding parts get hot, and over time the wire fails. Ampacity depends on the wire's gauge, insulation type, ambient temperature, and how easily heat can escape (a single wire in open air sheds heat much better than the same wire bundled with eleven others inside a conduit).

Two rules the calculator uses:

- **Chassis wiring** (short runs in air, point-to-point inside an enclosure): about 92 cmil per amp. 22 AWG ≈ 7 A.
- **Power transmission** (long runs in conduit, derated for heat): NEC 310.16 (the US National Electrical Code), around 700 cmil per amp. 22 AWG ≈ 0.9 A.

### PCB Trace Width

Every trace on a PCB has resistance. For signal lines that doesn't matter. For power rails it does: a trace carrying 3 A through 100 milliohms drops 0.3 V and dumps 0.9 W into the board as heat. Sizing the trace keeps the temperature rise within what the laminate and surrounding parts can tolerate.

The calculator uses the IPC-2221A formula. Inputs: current, copper weight, temperature rise above ambient, and whether the trace is internal or external. Output: minimum trace width in mm and mil.

The empirical relation:

$$I = k \cdot \Delta T^{0.44} \cdot A^{0.725}$$

$A$ is the cross-section in mil², $\Delta T$ is the allowable temperature rise above ambient in °C, and $k$ is 0.048 for external traces or 0.024 for internal. Solving for $A$ given a target current:

$$A = \left( \frac{I}{k \cdot \Delta T^{0.44}} \right)^{1/0.725}$$

Then $\text{width} = \dfrac{A}{\text{thickness}}$, where 1 oz copper is about 1.378 mil thick.

IPC-2221A is the conservative legacy standard. The newer IPC-2152 allows narrower traces for the same current with a richer model, but it's paywalled. Add margin for vias, bends, and ambient heat regardless of which standard you use.

### Controlled Impedance & Differential Pairs

Trace width keeps a power rail cool; once a signal gets fast enough, a different property of the trace matters: its characteristic impedance. A 100 MHz clock with sub-nanosecond edges treats your copper as a transmission line, and any mismatch between the trace impedance and the driver or receiver bounces energy back as reflections, ringing, and overshoot. USB, HDMI, Ethernet, PCIe, and DDR all specify a differential impedance the board must hit, usually within ten percent, so this stopped being an RF-only concern a long time ago.

A trace's impedance is set by its geometry and the laminate around it: the width $W$, the height $H$ to the nearest reference plane, the copper thickness $T$, and the dielectric constant $\varepsilon_r$ of the substrate. The calculator handles the two common structures, microstrip (a trace on an outer layer with one ground plane beneath it) and symmetric stripline (a trace buried between two planes), using the IPC-2141A closed-form approximations:

$$Z_0^{\text{micro}} = \frac{87}{\sqrt{\varepsilon_r + 1.41}} \ln\!\left( \frac{5.98\,H}{0.8\,W + T} \right) \qquad Z_0^{\text{strip}} = \frac{60}{\sqrt{\varepsilon_r}} \ln\!\left( \frac{4\,B}{0.67\pi\,(0.8\,W + T)} \right)$$

where $B$ is the plane-to-plane separation for stripline. A differential pair is two such traces routed side by side, and bringing them closer couples them: each trace's field interacts with its neighbour, which lowers the differential impedance below the $2 Z_0$ you would get from two isolated traces. The coupling falls off exponentially with the edge-to-edge spacing $S$:

$$Z_{\text{diff}} = 2\,Z_0\left(1 - k\,e^{-c\,S/H}\right)$$

with $k = 0.48,\ c = 0.96$ for microstrip and $k = 0.347,\ c = 2.9$ for stripline. Wide spacing drives the exponential to zero and $Z_{\text{diff}}$ toward $2 Z_0$; tight spacing pulls it down, which is the knob you turn to land on 90 or 100 Ω.

The same geometry sets how fast the signal travels, which is what makes length matching possible. A signal moves at $c/\sqrt{\varepsilon_{\text{eff}}}$, where the effective permittivity is the bulk $\varepsilon_r$ for fully buried stripline but lower for microstrip, since part of its field rides through the air above the board:

$$t_{pd} = \frac{\sqrt{\varepsilon_{\text{eff}}}}{c}, \qquad \varepsilon_{\text{eff}}^{\text{micro}} \approx 0.475\,\varepsilon_r + 0.67$$

On FR-4 that works out to roughly 140 ps per inch for microstrip and 180 for stripline. The two halves of a differential pair must arrive together, so the calculator inverts this: give it a skew budget in picoseconds, and it returns the maximum length mismatch in millimetres before that budget is blown, which is the number the serpentine length-tuning on a real layout is chasing.

These are closed-form fits, accurate to five or ten percent, and they ignore copper thickness in the coupling term, solder mask, glass-weave, and surface roughness. That's plenty to size a stackup and sanity-check a layout, but for a tight target you confirm the final numbers against your fab's field-solver stackup tool.

## Other Features

A few UI niceties not covered by the math:

- **Live compute**. Results update as you type.
- **SI prefix parsing** on every numeric input: `4.7k`, `100m`, `2.2µ` (or `2.2u`), `1M`, `100n`, `1p`, with an optional unit suffix that gets ignored.
- **Copy button** on every result to bring it into the next tool without retyping.
- **Inline schematics** rendered dynamically.

## How It's Built

The sources live in [`src/ee-calculator/`](https://gitlab.com/sotilrac/sotilrac.gitlab.io/-/tree/master/src/ee-calculator) (CSS, JS, and four SVG symbol files). A small Node script bundles them into a single `js/ee-calculator.js` at build time. No framework or dependencies to break. Nothing in it can go stale, so it should keep working for as long as the browser does.
