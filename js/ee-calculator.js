// ============================================================
// EE Calculator: tools for the next generation of EEs
// A browser-based calculator suite for hobbyist electrical
// engineers: resistor color code, E-series, voltage divider,
// LED resistor, Ohm's law, RC cutoff, 555 timer, series/
// parallel reducer, AWG, PCB trace width.
// Zero dependencies. Single file. Works forever.
// Author: Carlos Asmat, https://asmat.ca
// ============================================================

// ----------------------------------------------------------------
// Section 1: Constants
// ----------------------------------------------------------------

// Resistor band color codes (IEC 60062).
// Each entry: { name, hex, digit, multiplier, tolerance, ppm }
const BAND_COLORS = [
  {
    name: "black",
    hex: "#1a1a1a",
    digit: 0,
    multiplier: 1,
    tolerance: null,
    ppm: 250,
  },
  {
    name: "brown",
    hex: "#8f5902",
    digit: 1,
    multiplier: 10,
    tolerance: 1,
    ppm: 100,
  },
  {
    name: "red",
    hex: "#cc0000",
    digit: 2,
    multiplier: 100,
    tolerance: 2,
    ppm: 50,
  },
  {
    name: "orange",
    hex: "#f57900",
    digit: 3,
    multiplier: 1e3,
    tolerance: null,
    ppm: 15,
  },
  {
    name: "yellow",
    hex: "#edd400",
    digit: 4,
    multiplier: 1e4,
    tolerance: null,
    ppm: 25,
  },
  {
    name: "green",
    hex: "#4e9a06",
    digit: 5,
    multiplier: 1e5,
    tolerance: 0.5,
    ppm: null,
  },
  {
    name: "blue",
    hex: "#3465a4",
    digit: 6,
    multiplier: 1e6,
    tolerance: 0.25,
    ppm: 10,
  },
  {
    name: "violet",
    hex: "#75507b",
    digit: 7,
    multiplier: 1e7,
    tolerance: 0.1,
    ppm: 5,
  },
  {
    name: "grey",
    hex: "#888a85",
    digit: 8,
    multiplier: 1e8,
    tolerance: 0.05,
    ppm: null,
  },
  {
    name: "white",
    hex: "#eeeeec",
    digit: 9,
    multiplier: 1e9,
    tolerance: null,
    ppm: null,
  },
  {
    name: "gold",
    hex: "#c4a000",
    digit: null,
    multiplier: 0.1,
    tolerance: 5,
    ppm: null,
  },
  {
    name: "silver",
    hex: "#c0c0c0",
    digit: null,
    multiplier: 0.01,
    tolerance: 10,
    ppm: null,
  },
];

// E-series of standard preferred values (IEC 60063).
const E_SERIES = {
  E6: [1.0, 1.5, 2.2, 3.3, 4.7, 6.8],
  E12: [1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2],
  E24: [
    1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0, 3.3, 3.6, 3.9,
    4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1,
  ],
  E48: [
    1.0, 1.05, 1.1, 1.15, 1.21, 1.27, 1.33, 1.4, 1.47, 1.54, 1.62, 1.69, 1.78,
    1.87, 1.96, 2.05, 2.15, 2.26, 2.37, 2.49, 2.61, 2.74, 2.87, 3.01, 3.16,
    3.32, 3.48, 3.65, 3.83, 4.02, 4.22, 4.42, 4.64, 4.87, 5.11, 5.36, 5.62, 5.9,
    6.19, 6.49, 6.81, 7.15, 7.5, 7.87, 8.25, 8.66, 9.09, 9.53,
  ],
  E96: [
    1.0, 1.02, 1.05, 1.07, 1.1, 1.13, 1.15, 1.18, 1.21, 1.24, 1.27, 1.3, 1.33,
    1.37, 1.4, 1.43, 1.47, 1.5, 1.54, 1.58, 1.62, 1.65, 1.69, 1.74, 1.78, 1.82,
    1.87, 1.91, 1.96, 2.0, 2.05, 2.1, 2.15, 2.21, 2.26, 2.32, 2.37, 2.43, 2.49,
    2.55, 2.61, 2.67, 2.74, 2.8, 2.87, 2.94, 3.01, 3.09, 3.16, 3.24, 3.32, 3.4,
    3.48, 3.57, 3.65, 3.74, 3.83, 3.92, 4.02, 4.12, 4.22, 4.32, 4.42, 4.53,
    4.64, 4.75, 4.87, 4.99, 5.11, 5.23, 5.36, 5.49, 5.62, 5.76, 5.9, 6.04, 6.19,
    6.34, 6.49, 6.65, 6.81, 6.98, 7.15, 7.32, 7.5, 7.68, 7.87, 8.06, 8.25, 8.45,
    8.66, 8.87, 9.09, 9.31, 9.53, 9.76,
  ],
};

// Nominal tolerance percent for each preferred-value series.
const E_SERIES_TOL = {
  E6: 20,
  E12: 10,
  E24: 5,
  E48: 2,
  E96: 1,
};

// AWG ampacity, simple version.
// Power transmission (NEC 310.16, 60°C insulation, copper, in conduit).
// Chassis (700 cmil/A rule).
// circular mils = (d_mils)^2
const AWG_AMPS_CHASSIS = {}; // computed from cmil
const AWG_AMPS_POWER = {
  // selected, conservative
  "0000": 195,
  "000": 165,
  "00": 145,
  0: 125,
  1: 110,
  2: 95,
  3: 85,
  4: 70,
  5: 65,
  6: 55,
  7: 47,
  8: 40,
  9: 35,
  10: 30,
  11: 27,
  12: 25,
  13: 22,
  14: 20,
  15: 17,
  16: 15,
  17: 13,
  18: 10,
  19: 8,
  20: 6,
  21: 5,
  22: 3,
  23: 2.4,
  24: 2,
  25: 1.7,
  26: 1.3,
  27: 1.1,
  28: 0.9,
  29: 0.7,
  30: 0.55,
  32: 0.35,
  34: 0.22,
  36: 0.14,
  38: 0.09,
  40: 0.06,
};

// IEC SI prefixes for parseSI / formatSI.
const SI_PREFIXES = [
  { sym: "T", exp: 12 },
  { sym: "G", exp: 9 },
  { sym: "M", exp: 6 },
  { sym: "k", exp: 3 },
  { sym: "", exp: 0 },
  { sym: "m", exp: -3 },
  { sym: "µ", exp: -6, alt: ["u"] },
  { sym: "n", exp: -9 },
  { sym: "p", exp: -12 },
  { sym: "f", exp: -15 },
];

// Inline SVGs. Authored to be light enough to ship inline.

const RESISTOR_SVG = `
<svg viewBox="0 0 320 70" xmlns="http://www.w3.org/2000/svg" class="resistor-svg" aria-label="Resistor">
  <defs>
    <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f0d6a8"/>
      <stop offset="0.5" stop-color="#e5c386"/>
      <stop offset="1" stop-color="#c8a368"/>
    </linearGradient>
    <linearGradient id="wireGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#dadada"/>
      <stop offset="0.5" stop-color="#9a9a9a"/>
      <stop offset="1" stop-color="#5a5a5a"/>
    </linearGradient>
  </defs>
  <line x1="0" y1="35" x2="50" y2="35" stroke="url(#wireGrad)" stroke-width="4" stroke-linecap="round"/>
  <line x1="270" y1="35" x2="320" y2="35" stroke="url(#wireGrad)" stroke-width="4" stroke-linecap="round"/>
  <path d="M50,35 C50,16 65,10 85,10 L235,10 C255,10 270,16 270,35 C270,54 255,60 235,60 L85,60 C65,60 50,54 50,35 Z"
        fill="url(#bodyGrad)" stroke="#8b6a3a" stroke-width="1.2"/>
  <g class="bands"></g>
  <path d="M60,18 C70,13 90,12 100,14" fill="none" stroke="#fff5e0" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
</svg>`;

// 8-pin DIP for the 555. Labels on pins.
const IC_555_SVG = `
<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg" class="ic555-svg" aria-label="555 timer 8-pin DIP">
  <g>
    <!-- Pins -->
    <g fill="#bdbdbd" stroke="#5a5a5a" stroke-width="0.6">
      <rect x="20" y="10" width="10" height="14"/>
      <rect x="20" y="42" width="10" height="14"/>
      <rect x="20" y="74" width="10" height="14"/>
      <rect x="20" y="106" width="10" height="14"/>
      <rect x="170" y="10" width="10" height="14"/>
      <rect x="170" y="42" width="10" height="14"/>
      <rect x="170" y="74" width="10" height="14"/>
      <rect x="170" y="106" width="10" height="14"/>
    </g>
    <!-- Body -->
    <rect x="30" y="5" width="140" height="120" rx="3" fill="#222" stroke="#000" stroke-width="1.2"/>
    <!-- Notch -->
    <path d="M85,5 A15,8 0 0,0 115,5 Z" fill="#111"/>
    <!-- Pin labels -->
    <g font-family="ui-monospace, monospace" font-size="10" fill="#ddd">
      <text x="38" y="22">GND</text>
      <text x="38" y="54">TRIG</text>
      <text x="38" y="86">OUT</text>
      <text x="38" y="118">RST</text>
      <text x="162" y="22" text-anchor="end">VCC</text>
      <text x="162" y="54" text-anchor="end">DIS</text>
      <text x="162" y="86" text-anchor="end">THR</text>
      <text x="162" y="118" text-anchor="end">CTL</text>
      <text x="100" y="75" text-anchor="middle" font-size="14" fill="#f5e09c">NE555</text>
    </g>
  </g>
</svg>`;

// ----------------------------------------------------------------
// Section 1b: Circuit schematic builder
// ----------------------------------------------------------------
// Small composable SVG circuit-drawing helper. All coordinates are in grid
// units; one grid unit = 20 px. Components span between two grid points and
// draw their leads automatically. Reused by voltage divider, LED resistor,
// RC cutoff, and any future schematic.

const CIRCUIT = {
  STROKE: "#2c2418",
  ACCENT: "#cc5500",
  BG: "#fffcf2",
  SW: 1.6,
  FONT: 'ui-monospace, "Courier New", monospace',
  GRID: 20,
};

class Circuit {
  constructor(cols, rows) {
    this.W = cols * CIRCUIT.GRID;
    this.H = rows * CIRCUIT.GRID;
    this.parts = [];
  }
  _p(x) {
    return x * CIRCUIT.GRID;
  }
  _push(s) {
    this.parts.push(s);
    return this;
  }
  // Wire: polyline through any number of grid points: wire(x1,y1,x2,y2,x3,y3,...).
  wire(...pts) {
    if (pts.length < 4 || pts.length % 2) return this;
    let d = `M ${this._p(pts[0])} ${this._p(pts[1])}`;
    for (let i = 2; i < pts.length; i += 2) {
      d += ` L ${this._p(pts[i])} ${this._p(pts[i + 1])}`;
    }
    return this._push(
      `<path d="${d}" fill="none" stroke="${CIRCUIT.STROKE}" stroke-width="${CIRCUIT.SW}" stroke-linecap="round" stroke-linejoin="round"/>`,
    );
  }
  junction(x, y) {
    return this._push(
      `<circle cx="${this._p(x)}" cy="${this._p(y)}" r="3" fill="${CIRCUIT.STROKE}"/>`,
    );
  }
  // Resistor between (x1,y1) and (x2,y2). Horizontal or vertical only.
  resistor(x1, y1, x2, y2, label) {
    const px1 = this._p(x1),
      py1 = this._p(y1),
      px2 = this._p(x2),
      py2 = this._p(y2);
    const cx = (px1 + px2) / 2,
      cy = (py1 + py2) / 2;
    const horiz = Math.abs(px2 - px1) > Math.abs(py2 - py1);
    const length = horiz ? Math.abs(px2 - px1) : Math.abs(py2 - py1);
    const w = 14;
    const bodyLen = Math.min(length * 0.62, 38);
    const stubLen = (length - bodyLen) / 2;
    if (horiz) {
      const sign = Math.sign(px2 - px1);
      this._push(
        `<line x1="${px1}" y1="${py1}" x2="${px1 + stubLen * sign}" y2="${py1}" stroke="${CIRCUIT.STROKE}" stroke-width="${CIRCUIT.SW}" stroke-linecap="round"/>`,
      );
      this._push(
        `<line x1="${px2 - stubLen * sign}" y1="${py2}" x2="${px2}" y2="${py2}" stroke="${CIRCUIT.STROKE}" stroke-width="${CIRCUIT.SW}" stroke-linecap="round"/>`,
      );
      this._push(
        `<rect x="${cx - bodyLen / 2}" y="${cy - w / 2}" width="${bodyLen}" height="${w}" fill="${CIRCUIT.BG}" stroke="${CIRCUIT.STROKE}" stroke-width="${CIRCUIT.SW}"/>`,
      );
      if (label)
        this._push(
          `<text x="${cx}" y="${cy - w / 2 - 6}" text-anchor="middle" font-family="${CIRCUIT.FONT}" font-size="12" fill="${CIRCUIT.STROKE}">${label}</text>`,
        );
    } else {
      const sign = Math.sign(py2 - py1);
      this._push(
        `<line x1="${px1}" y1="${py1}" x2="${px1}" y2="${py1 + stubLen * sign}" stroke="${CIRCUIT.STROKE}" stroke-width="${CIRCUIT.SW}" stroke-linecap="round"/>`,
      );
      this._push(
        `<line x1="${px2}" y1="${py2 - stubLen * sign}" x2="${px2}" y2="${py2}" stroke="${CIRCUIT.STROKE}" stroke-width="${CIRCUIT.SW}" stroke-linecap="round"/>`,
      );
      this._push(
        `<rect x="${cx - w / 2}" y="${cy - bodyLen / 2}" width="${w}" height="${bodyLen}" fill="${CIRCUIT.BG}" stroke="${CIRCUIT.STROKE}" stroke-width="${CIRCUIT.SW}"/>`,
      );
      if (label)
        this._push(
          `<text x="${cx + w / 2 + 6}" y="${cy + 4}" font-family="${CIRCUIT.FONT}" font-size="12" fill="${CIRCUIT.STROKE}">${label}</text>`,
        );
    }
    return this;
  }
  // Capacitor (non-polarized): two short parallel plates with leads.
  capacitor(x1, y1, x2, y2, label) {
    const px1 = this._p(x1),
      py1 = this._p(y1),
      px2 = this._p(x2),
      py2 = this._p(y2);
    const cx = (px1 + px2) / 2,
      cy = (py1 + py2) / 2;
    const horiz = Math.abs(px2 - px1) > Math.abs(py2 - py1);
    const gap = 6,
      plate = 18;
    if (horiz) {
      this._push(
        `<line x1="${px1}" y1="${py1}" x2="${cx - gap / 2}" y2="${cy}" stroke="${CIRCUIT.STROKE}" stroke-width="${CIRCUIT.SW}" stroke-linecap="round"/>`,
      );
      this._push(
        `<line x1="${cx + gap / 2}" y1="${cy}" x2="${px2}" y2="${py2}" stroke="${CIRCUIT.STROKE}" stroke-width="${CIRCUIT.SW}" stroke-linecap="round"/>`,
      );
      this._push(
        `<line x1="${cx - gap / 2}" y1="${cy - plate / 2}" x2="${cx - gap / 2}" y2="${cy + plate / 2}" stroke="${CIRCUIT.STROKE}" stroke-width="${CIRCUIT.SW + 0.6}" stroke-linecap="round"/>`,
      );
      this._push(
        `<line x1="${cx + gap / 2}" y1="${cy - plate / 2}" x2="${cx + gap / 2}" y2="${cy + plate / 2}" stroke="${CIRCUIT.STROKE}" stroke-width="${CIRCUIT.SW + 0.6}" stroke-linecap="round"/>`,
      );
      if (label)
        this._push(
          `<text x="${cx}" y="${cy - plate / 2 - 6}" text-anchor="middle" font-family="${CIRCUIT.FONT}" font-size="12" fill="${CIRCUIT.STROKE}">${label}</text>`,
        );
    } else {
      this._push(
        `<line x1="${px1}" y1="${py1}" x2="${cx}" y2="${cy - gap / 2}" stroke="${CIRCUIT.STROKE}" stroke-width="${CIRCUIT.SW}" stroke-linecap="round"/>`,
      );
      this._push(
        `<line x1="${cx}" y1="${cy + gap / 2}" x2="${px2}" y2="${py2}" stroke="${CIRCUIT.STROKE}" stroke-width="${CIRCUIT.SW}" stroke-linecap="round"/>`,
      );
      this._push(
        `<line x1="${cx - plate / 2}" y1="${cy - gap / 2}" x2="${cx + plate / 2}" y2="${cy - gap / 2}" stroke="${CIRCUIT.STROKE}" stroke-width="${CIRCUIT.SW + 0.6}" stroke-linecap="round"/>`,
      );
      this._push(
        `<line x1="${cx - plate / 2}" y1="${cy + gap / 2}" x2="${cx + plate / 2}" y2="${cy + gap / 2}" stroke="${CIRCUIT.STROKE}" stroke-width="${CIRCUIT.SW + 0.6}" stroke-linecap="round"/>`,
      );
      if (label)
        this._push(
          `<text x="${cx + plate / 2 + 6}" y="${cy + 4}" font-family="${CIRCUIT.FONT}" font-size="12" fill="${CIRCUIT.STROKE}">${label}</text>`,
        );
    }
    return this;
  }
  // LED: triangle pointing in current direction, cathode bar, two emission arrows.
  // Horizontal only. (x1,y1) is anode side, (x2,y2) is cathode side.
  led(x1, y1, x2, y2) {
    const px1 = this._p(x1),
      py1 = this._p(y1),
      px2 = this._p(x2),
      py2 = this._p(y2);
    const cx = (px1 + px2) / 2,
      cy = (py1 + py2) / 2;
    const dir = Math.sign(px2 - px1);
    const tri = 14;
    const ax = cx - (tri / 2) * dir;
    const bx = cx + (tri / 2) * dir;
    this._push(
      `<line x1="${px1}" y1="${py1}" x2="${ax}" y2="${cy}" stroke="${CIRCUIT.STROKE}" stroke-width="${CIRCUIT.SW}" stroke-linecap="round"/>`,
    );
    this._push(
      `<path d="M ${ax} ${cy - tri / 2} L ${ax} ${cy + tri / 2} L ${bx} ${cy} Z" fill="${CIRCUIT.BG}" stroke="${CIRCUIT.STROKE}" stroke-width="${CIRCUIT.SW}" stroke-linejoin="round"/>`,
    );
    this._push(
      `<line x1="${bx}" y1="${cy - tri / 2}" x2="${bx}" y2="${cy + tri / 2}" stroke="${CIRCUIT.STROKE}" stroke-width="${CIRCUIT.SW + 0.4}" stroke-linecap="round"/>`,
    );
    this._push(
      `<line x1="${bx}" y1="${cy}" x2="${px2}" y2="${py2}" stroke="${CIRCUIT.STROKE}" stroke-width="${CIRCUIT.SW}" stroke-linecap="round"/>`,
    );
    // Two emission arrows pointing up-right from the lens.
    const a1x = cx + (tri / 2) * dir + 1,
      a1y = cy - tri / 2 - 1;
    this._push(
      `<path d="M ${a1x} ${a1y} L ${a1x + 8 * dir} ${a1y - 8} M ${a1x + 5 * dir} ${a1y - 8} L ${a1x + 8 * dir} ${a1y - 8} L ${a1x + 8 * dir} ${a1y - 5}" fill="none" stroke="${CIRCUIT.STROKE}" stroke-width="1" stroke-linecap="round"/>`,
    );
    this._push(
      `<path d="M ${a1x - 3} ${a1y + 3} L ${a1x + 5 * dir} ${a1y - 5} M ${a1x + 2 * dir} ${a1y - 5} L ${a1x + 5 * dir} ${a1y - 5} L ${a1x + 5 * dir} ${a1y - 2}" fill="none" stroke="${CIRCUIT.STROKE}" stroke-width="1" stroke-linecap="round"/>`,
    );
    return this;
  }
  // Ground symbol pointing downward from (x,y).
  ground(x, y) {
    const px = this._p(x),
      py = this._p(y);
    this._push(
      `<line x1="${px}" y1="${py}" x2="${px}" y2="${py + 6}" stroke="${CIRCUIT.STROKE}" stroke-width="${CIRCUIT.SW}" stroke-linecap="round"/>`,
    );
    this._push(
      `<line x1="${px - 12}" y1="${py + 6}" x2="${px + 12}" y2="${py + 6}" stroke="${CIRCUIT.STROKE}" stroke-width="${CIRCUIT.SW + 0.6}" stroke-linecap="round"/>`,
    );
    this._push(
      `<line x1="${px - 8}" y1="${py + 10}" x2="${px + 8}" y2="${py + 10}" stroke="${CIRCUIT.STROKE}" stroke-width="${CIRCUIT.SW}" stroke-linecap="round"/>`,
    );
    this._push(
      `<line x1="${px - 4}" y1="${py + 14}" x2="${px + 4}" y2="${py + 14}" stroke="${CIRCUIT.STROKE}" stroke-width="${CIRCUIT.SW}" stroke-linecap="round"/>`,
    );
    return this;
  }
  // Labeled terminal (input/output node).
  terminal(x, y, label, side = "left") {
    const px = this._p(x),
      py = this._p(y);
    this._push(
      `<circle cx="${px}" cy="${py}" r="3.5" fill="${CIRCUIT.BG}" stroke="${CIRCUIT.STROKE}" stroke-width="${CIRCUIT.SW}"/>`,
    );
    let lx, ly, anchor;
    if (side === "left") {
      lx = px - 9;
      ly = py + 4;
      anchor = "end";
    } else if (side === "right") {
      lx = px + 9;
      ly = py + 4;
      anchor = "start";
    } else if (side === "above") {
      lx = px;
      ly = py - 9;
      anchor = "middle";
    } else {
      lx = px;
      ly = py + 16;
      anchor = "middle";
    }
    this._push(
      `<text x="${lx}" y="${ly}" text-anchor="${anchor}" font-family="${CIRCUIT.FONT}" font-size="13" fill="${CIRCUIT.STROKE}" font-weight="600">${label}</text>`,
    );
    return this;
  }
  text(x, y, content, opts = {}) {
    const { anchor = "start", size = 11, accent = false } = opts;
    const color = accent ? CIRCUIT.ACCENT : CIRCUIT.STROKE;
    this._push(
      `<text x="${this._p(x)}" y="${this._p(y)}" text-anchor="${anchor}" font-family="${CIRCUIT.FONT}" font-size="${size}" fill="${color}">${content}</text>`,
    );
    return this;
  }
  render() {
    return `<svg viewBox="0 0 ${this.W} ${this.H}" xmlns="http://www.w3.org/2000/svg" class="circuit-svg">${this.parts.join("")}</svg>`;
  }
}

// ----------------------------------------------------------------
// Section 2: Shared utilities
// ----------------------------------------------------------------

// Parse a number with optional SI prefix and optional unit suffix.
// Accepts "4.7k", "100m", "2.2u", "1M", "100µ", "1.5kΩ", "10nF", "5".
function parseSI(input) {
  if (input == null) return NaN;
  const s = String(input).trim();
  if (s === "") return NaN;
  const match = s.match(
    /^([-+]?\d*\.?\d+(?:[eE][-+]?\d+)?)\s*([a-zA-Zµ])?[a-zA-ZΩ°/]*$/,
  );
  if (!match) return NaN;
  const num = parseFloat(match[1]);
  if (isNaN(num)) return NaN;
  const prefix = match[2];
  if (!prefix) return num;
  for (const p of SI_PREFIXES) {
    if (prefix === p.sym || (p.alt && p.alt.includes(prefix))) {
      return num * Math.pow(10, p.exp);
    }
  }
  return num;
}

// Format a number into a value with the nearest SI prefix.
function formatSI(value, unit = "", precision = 3) {
  if (value == null || !isFinite(value)) return "—";
  if (value === 0) return "0 " + unit;
  const abs = Math.abs(value);
  let chosen = SI_PREFIXES.find((p) => p.exp === 0);
  for (const p of SI_PREFIXES) {
    const scaled = abs / Math.pow(10, p.exp);
    if (scaled >= 1 && scaled < 1000) {
      chosen = p;
      break;
    }
  }
  const scaled = value / Math.pow(10, chosen.exp);
  let str = scaled.toPrecision(precision);
  // Trim trailing zeros from decimal portion.
  if (str.includes(".") && !str.includes("e")) {
    str = str.replace(/\.?0+$/, "");
  }
  return `${str} ${chosen.sym}${unit}`.trim();
}

// E-series helpers.
function eSeriesValues(series, fromDecade = 0, toDecade = 6) {
  const base = E_SERIES[series];
  if (!base) return [];
  const out = [];
  for (let d = fromDecade; d <= toDecade; d++) {
    const mult = Math.pow(10, d);
    for (const b of base) out.push(b * mult);
  }
  return out;
}

function nearestStandard(target, series, k = 3) {
  if (!isFinite(target) || target <= 0) return [];
  const values = eSeriesValues(series, -1, 9);
  const ranked = values
    .map((v) => ({ value: v, error: (v - target) / target }))
    .sort((a, b) => Math.abs(a.error) - Math.abs(b.error));
  return ranked.slice(0, k);
}

// Round to N significant digits, returning a JS number.
function sigfig(value, digits = 4) {
  if (value === 0 || !isFinite(value)) return value;
  const mag = Math.pow(
    10,
    digits - Math.floor(Math.log10(Math.abs(value))) - 1,
  );
  return Math.round(value * mag) / mag;
}

// Choose a wattage rating that comfortably holds the dissipation.
function pickWattage(p) {
  const ratings = [0.0625, 0.125, 0.25, 0.5, 1, 2, 5, 10, 25];
  for (const r of ratings) {
    if (p < r * 0.5) return r; // 50% derating
  }
  return ratings[ratings.length - 1];
}

function formatWattage(w) {
  if (w >= 1) return `${w} W`;
  if (w === 0.5) return "1/2 W";
  if (w === 0.25) return "1/4 W";
  if (w === 0.125) return "1/8 W";
  if (w === 0.0625) return "1/16 W";
  return `${w} W`;
}

// Render the <option> tags for an E-series picker, labelled with tolerance.
function eSeriesOptions(selected) {
  return Object.keys(E_SERIES)
    .map((k) => {
      const tol = E_SERIES_TOL[k];
      const label = tol != null ? `${k} (±${tol}%)` : k;
      return `<option value="${k}" ${k === selected ? "selected" : ""}>${label}</option>`;
    })
    .join("");
}

// ----------------------------------------------------------------
// Section 3: Tool engines
// ----------------------------------------------------------------

// ---- Resistor color code ----

function bandsToValue(digits, multiplierBand, toleranceBand, ppmBand) {
  const digitValid = (b) => b != null && BAND_COLORS[b]?.digit != null;
  if (!digits.every(digitValid)) return { value: null };
  const sigDigits = digits.map((b) => BAND_COLORS[b].digit);
  const sigStr = sigDigits.join("");
  const sig = parseInt(sigStr, 10);
  const mult = BAND_COLORS[multiplierBand]?.multiplier;
  if (mult == null) return { value: null };
  const value = sig * mult;
  const tol =
    toleranceBand != null ? BAND_COLORS[toleranceBand]?.tolerance : null;
  const ppm = ppmBand != null ? BAND_COLORS[ppmBand]?.ppm : null;
  return { value, tolerance: tol, ppm };
}

// Find the band pattern that represents a given value, for a chosen band count.
// Returns { digits: [...], multiplier, ok } where digits/multiplier are indices into BAND_COLORS.
function valueToBands(target, sigCount = 2) {
  if (!isFinite(target) || target < 0) return { ok: false };
  if (target === 0) {
    return { ok: true, digits: Array(sigCount).fill(0), multiplier: 0 };
  }
  // Normalize: get N significant digits and a multiplier exponent.
  const exp = Math.floor(Math.log10(target)) - (sigCount - 1);
  const mantissa = Math.round(target / Math.pow(10, exp));
  const mantissaStr = String(mantissa).padStart(sigCount, "0");
  if (mantissaStr.length > sigCount) {
    // Rounding bumped to one more digit; shift exponent.
    return valueToBands(target / 10, sigCount);
  }
  const digits = mantissaStr.split("").map((d) => parseInt(d, 10));
  // multiplier index is the BAND_COLORS index whose multiplier == 10^exp
  let multIdx = -1;
  for (let i = 0; i < BAND_COLORS.length; i++) {
    if (BAND_COLORS[i].multiplier === Math.pow(10, exp)) {
      multIdx = i;
      break;
    }
  }
  if (multIdx < 0) return { ok: false };
  return { ok: true, digits, multiplier: multIdx };
}

// ---- Voltage divider ----

function vdivForward(vin, r1, r2) {
  if (!(r1 + r2 > 0)) return null;
  const vout = (vin * r2) / (r1 + r2);
  const iDiv = vin / (r1 + r2);
  return { vout, iDiv };
}

function vdivReverse(vin, vout, series = "E96", r1Min = 100, r1Max = 1e6) {
  if (vin <= 0 || vout < 0 || vout > vin) return null;
  const ratio = vout / vin; // = R2/(R1+R2)
  if (ratio === 0) return { ratio, r1: r1Min, r2: 0, vout, error: 0 };
  if (ratio === 1) return { ratio, r1: 0, r2: r1Min, vout, error: 0 };
  // Search E-series for the best (r1, r2) pair within range.
  const values = eSeriesValues(series, -1, 9).filter(
    (v) => v >= r1Min && v <= r1Max,
  );
  let best = null;
  for (const r1 of values) {
    // Ideal r2 = r1 * ratio / (1 - ratio)
    const r2Ideal = (r1 * ratio) / (1 - ratio);
    // Find closest standard r2.
    const r2Choices = nearestStandard(r2Ideal, series, 2);
    for (const c of r2Choices) {
      const r2 = c.value;
      const v = (vin * r2) / (r1 + r2);
      const err = Math.abs(v - vout) / vout;
      if (!best || err < best.error) {
        best = { r1, r2, ratio: r2 / (r1 + r2), vout: v, error: err };
      }
    }
  }
  return best;
}

// ---- LED resistor ----

function ledResistor(vSupply, vfPerLed, nLeds, ifMa, series = "E24") {
  const iA = ifMa / 1000;
  const vDrop = vSupply - vfPerLed * nLeds;
  if (vDrop <= 0) {
    return { ok: false, reason: "supply too low for this LED chain" };
  }
  const rExact = vDrop / iA;
  const std = nearestStandard(rExact, series, 1)[0];
  const rChosen = std.value;
  const iActual = vDrop / rChosen;
  const pR = iActual * iActual * rChosen;
  const watt = pickWattage(pR);
  return {
    ok: true,
    vDrop,
    rExact,
    rStandard: rChosen,
    stdError: std.error,
    iActualMa: iActual * 1000,
    pR,
    wattage: watt,
  };
}

// ---- Ohm's law / power ----

function solveOhms(known) {
  // known: { v?, i?, r?, p? }
  let { v, i, r, p } = known;
  const have = ["v", "i", "r", "p"].filter(
    (k) => known[k] != null && isFinite(known[k]),
  );
  if (have.length < 2) return { ok: false, reason: "need two values" };
  // Resolve from any pair.
  if (v != null && i != null) {
    r = v / i;
    p = v * i;
  } else if (v != null && r != null) {
    i = v / r;
    p = (v * v) / r;
  } else if (v != null && p != null) {
    i = p / v;
    r = (v * v) / p;
  } else if (i != null && r != null) {
    v = i * r;
    p = i * i * r;
  } else if (i != null && p != null) {
    v = p / i;
    r = p / (i * i);
  } else if (r != null && p != null) {
    v = Math.sqrt(p * r);
    i = Math.sqrt(p / r);
  }
  return { ok: true, v, i, r, p };
}

// ---- RC cutoff ----

function rcSolve(r, c, fc) {
  // f_c = 1 / (2 pi R C)
  const have = [r, c, fc].filter((x) => x != null && isFinite(x)).length;
  if (have < 2) return { ok: false };
  if (r == null) r = 1 / (2 * Math.PI * c * fc);
  else if (c == null) c = 1 / (2 * Math.PI * r * fc);
  else if (fc == null) fc = 1 / (2 * Math.PI * r * c);
  const tau = r * c;
  return { ok: true, r, c, fc, tau };
}

// ---- 555 timer ----

// Astable: f = 1.44 / ((R1 + 2*R2) * C); duty = (R1+R2)/(R1+2*R2)
function timer555Astable(r1, r2, c) {
  const period = ((r1 + 2 * r2) * c) / 1.44;
  const f = 1 / period;
  const tHigh = 0.693 * (r1 + r2) * c;
  const tLow = 0.693 * r2 * c;
  const duty = tHigh / (tHigh + tLow);
  return { f, period, tHigh, tLow, duty };
}

// Astable reverse: given f and duty, suggest R1/R2/C.
function timer555AstableReverse(f, duty, cTarget, series = "E24") {
  // duty = (R1+R2)/(R1+2*R2); solve for R1/R2 ratio.
  // Let k = R1/R2. duty = (k+1)/(k+2)  =>  k = (2*duty - 1) / (1 - duty)
  if (duty <= 0.5 || duty >= 1)
    return { ok: false, reason: "duty must be > 50% and < 100%" };
  const k = (2 * duty - 1) / (1 - duty);
  // f = 1.44 / ((R1 + 2*R2) * C) = 1.44 / ((k+2)*R2*C)  => R2 = 1.44 / ((k+2)*C*f)
  const cChoices = [cTarget];
  const out = [];
  for (const C of cChoices) {
    const R2 = 1.44 / ((k + 2) * C * f);
    const R1 = k * R2;
    const r1Std = nearestStandard(R1, series, 1)[0]?.value;
    const r2Std = nearestStandard(R2, series, 1)[0]?.value;
    if (r1Std && r2Std) {
      const verify = timer555Astable(r1Std, r2Std, C);
      out.push({ C, R1, R2, r1Std, r2Std, verify });
    }
  }
  return { ok: true, suggestions: out };
}

// Monostable: t = 1.1 * R * C
function timer555Mono(r, c) {
  return { t: 1.1 * r * c };
}

function timer555MonoReverse(t, cTarget, series = "E24") {
  const R = t / (1.1 * cTarget);
  const rStd = nearestStandard(R, series, 1)[0]?.value;
  const verifyT = rStd ? 1.1 * rStd * cTarget : null;
  return { R, rStd, C: cTarget, verifyT };
}

// ---- Series/parallel reducer ----

function reduceNetwork(values, topology, kind) {
  if (!values.length) return null;
  if (topology === "series") {
    if (kind === "resistor") return values.reduce((s, v) => s + v, 0);
    if (kind === "capacitor") return 1 / values.reduce((s, v) => s + 1 / v, 0);
  } else {
    if (kind === "resistor") return 1 / values.reduce((s, v) => s + 1 / v, 0);
    if (kind === "capacitor") return values.reduce((s, v) => s + v, 0);
  }
  return null;
}

// ---- AWG ----

function awgDiameter(n) {
  if (n === "0000") return 0.127 * Math.pow(92, (36 - -3) / 39);
  if (n === "000") return 0.127 * Math.pow(92, (36 - -2) / 39);
  if (n === "00") return 0.127 * Math.pow(92, (36 - -1) / 39);
  return 0.127 * Math.pow(92, (36 - Number(n)) / 39);
}

function awgInfo(gauge) {
  const d_mm = awgDiameter(gauge);
  const area_mm2 = Math.PI * Math.pow(d_mm / 2, 2);
  // Resistivity of copper at 20°C: 1.724e-8 Ω·m = 17.24 Ω·mm²·m⁻¹·µm... use Ω/m.
  const ohmsPerM = 1.724e-8 / (area_mm2 * 1e-6);
  // 1 mil = 0.0254 mm. Circular mil = (diameter in mils)^2.
  const d_mil = d_mm / 0.0254;
  const cmil = d_mil * d_mil;
  // Chassis wiring (in air, short runs): rule of thumb ~92 cmil/A.
  // Power transmission (in conduit, long runs): roughly 700 cmil/A as fallback,
  // or the NEC table value where we have one.
  const chassisA = cmil / 92;
  const powerA = AWG_AMPS_POWER[String(gauge)] ?? cmil / 700;
  return {
    d_mm,
    area_mm2,
    ohmsPerM,
    ohmsPerFt: ohmsPerM * 0.3048,
    cmil,
    chassisA,
    powerA,
  };
}

function awgForCurrent(current, mode = "chassis") {
  // Walk gauges from largest (0000) to smallest until ampacity < current.
  const gauges = [
    "0000",
    "000",
    "00",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
    "32",
    "34",
    "36",
    "38",
    "40",
  ];
  let lastOk = null;
  for (const g of gauges) {
    const info = awgInfo(g);
    const cap = mode === "chassis" ? info.chassisA : info.powerA;
    if (cap == null) continue;
    if (cap >= current) lastOk = g;
    else if (lastOk) return lastOk;
  }
  return lastOk;
}

// ---- PCB trace width (IPC-2221A) ----

function traceWidth(current, ozCopper, deltaT, layer = "external") {
  const k = layer === "external" ? 0.048 : 0.024;
  // I = k * ΔT^0.44 * A^0.725  =>  A = (I / (k * ΔT^0.44))^(1/0.725)
  const A_mil2 = Math.pow(current / (k * Math.pow(deltaT, 0.44)), 1 / 0.725);
  // Thickness in mils: 1oz = 1.378 mil, 2oz = 2.756, etc.
  const thickness_mil = 1.378 * ozCopper;
  const width_mil = A_mil2 / thickness_mil;
  const width_mm = width_mil * 0.0254;
  return { width_mil, width_mm, area_mil2: A_mil2, thickness_mil };
}

// ----------------------------------------------------------------
// Section 4: Styles
// ----------------------------------------------------------------

const STYLE = `
:host {
  display: block;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif;
  font-size: 14px;
  color: #2c2418;

  --bg: #f5efe3;
  --surface: #ece4d4;
  --surface2: #e2d8c1;
  --border: #c8b894;
  --border-strong: #a88a5e;
  --text: #2c2418;
  --text-dim: #7a6a4a;
  --accent: #cc5500;
  --accent-soft: #f5d8b8;
  --ok: #4e9a06;
  --warn: #cc0000;
  --info: #3465a4;
  --mono: "Hack", ui-monospace, Menlo, Consolas, monospace;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

.calc {
  background: var(--bg);
  background-image:
    radial-gradient(circle at 1px 1px, rgba(168, 138, 94, 0.12) 1px, transparent 1.5px);
  background-size: 12px 12px;
  border: 1px solid var(--border-strong);
  border-radius: 8px;
  padding: 1em;
  max-width: 56em;
  box-shadow: 0 0.3em 0.5em rgba(80, 60, 30, 0.18);
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
  margin-bottom: 1.25em;
  border-bottom: 2px solid var(--border-strong);
  overflow-x: auto;
}
.tab {
  font-family: inherit;
  font-size: 0.9em;
  padding: 0.55em 1.1em;
  background: transparent;
  border: 0;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  color: var(--text-dim);
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.1s, border-color 0.1s;
  font-weight: 500;
}
.tab:hover { color: var(--text); }
.tab.active {
  color: var(--accent);
  border-bottom-color: var(--accent);
  font-weight: 600;
}

.tab-group { display: none; }
.tab-group.active { display: block; }

.tool {
  padding: 1em 0;
  border-bottom: 1px dashed var(--border);
}
.tool:last-child { border-bottom: 0; }
.tool:first-child { padding-top: 0.25em; }

.tool-title {
  font-size: 1.05em;
  font-weight: 600;
  margin-bottom: 0.2em;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 0.4em;
}
.tool-title::before {
  content: "";
  display: inline-block;
  width: 0.5em;
  height: 0.5em;
  background: var(--accent);
  border-radius: 1px;
  transform: rotate(45deg);
}
.tool-sub {
  font-size: 0.85em;
  color: var(--text-dim);
  margin-bottom: 0.85em;
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75em;
  align-items: flex-end;
  margin-bottom: 0.75em;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 0.2em;
  min-width: 6em;
}
.field-grow { flex: 1; }
.tab-group[data-tab="circuits"] .field { min-width: 5em; max-width: 9em; }
.tab-group[data-tab="circuits"] .field-grow { max-width: none; }
label {
  font-size: 0.75em;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
input[type="text"], input[type="number"], select {
  font-family: var(--mono);
  font-size: 1em;
  padding: 0.4em 0.6em;
  background: #fffcf2;
  border: 1px solid var(--border);
  border-radius: 4px;
  color: var(--text);
  outline: none;
  width: 100%;
}
input:focus, select:focus { border-color: var(--accent); }

.btn {
  font-family: inherit;
  font-size: 0.85em;
  padding: 0.4em 0.9em;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 4px;
  color: var(--text);
  cursor: pointer;
}
.btn:hover { background: var(--surface2); }
.btn.primary {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
  font-weight: 600;
}
.btn.primary:hover { opacity: 0.9; }

.seg {
  display: inline-flex;
  border: 1px solid var(--border);
  border-radius: 4px;
  overflow: hidden;
}
.seg .btn {
  border: 0;
  border-radius: 0;
  background: var(--surface);
  font-size: 0.8em;
}
.seg .btn + .btn { border-left: 1px solid var(--border); }
.seg .btn.active {
  background: var(--accent);
  color: #fff;
  font-weight: 600;
}

.result {
  background: #fffcf2;
  border: 1px dashed var(--border-strong);
  border-radius: 4px;
  padding: 0.7em 0.85em;
  font-family: var(--mono);
  font-size: 1em;
  margin-top: 0.5em;
}
.result-row { display: flex; justify-content: space-between; gap: 0.75em; padding: 0.1em 0; }
.result-label { color: var(--text-dim); font-size: 0.85em; }
.result-value { color: var(--text); font-weight: 600; }
.result-value.accent { color: var(--accent); }
.result-value.ok { color: var(--ok); }
.result-value.warn { color: var(--warn); }

.note {
  font-size: 0.8em;
  color: var(--text-dim);
  margin-top: 0.5em;
  font-style: italic;
}

/* Resistor / color code */
.resistor-display {
  display: flex;
  align-items: center;
  gap: 1em;
  margin: 0.75em 0 0.5em;
  flex-wrap: wrap;
  justify-content: center;
}
.resistor-wrap { flex: 1 1 18em; min-width: 14em; max-width: 24em; }
.resistor-svg { width: 100%; height: auto; display: block; }
.bands rect { cursor: pointer; transition: opacity 0.1s; }
.bands rect:hover { opacity: 0.85; }
.resistor-eq {
  font-family: var(--mono);
  font-size: 2.2em;
  color: var(--text-dim);
  font-weight: 300;
}
.resistor-readout {
  font-family: var(--mono);
  display: flex;
  flex-direction: column;
  gap: 0.15em;
}
.readout-line {
  display: flex;
  align-items: baseline;
  gap: 0.4em;
}
.readout-value {
  font-size: 1.9em;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: -0.01em;
}
.readout-value.warn { color: var(--warn); }
.readout-tol {
  font-size: 1.1em;
  color: var(--text);
  font-weight: 500;
}
.readout-ppm {
  font-size: 0.85em;
  color: var(--text-dim);
}

.band-pickers {
  display: flex;
  gap: 0.5em;
  flex-wrap: wrap;
  justify-content: center;
  margin: 0.5em 0;
}
.band-picker { display: flex; flex-direction: column; align-items: center; gap: 0.2em; }
.band-picker label { font-size: 0.7em; }
.band-picker select {
  font-size: 0.85em;
  padding: 0.25em 0.4em;
  width: 6em;
}

.swatch-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 2px;
  max-width: 14em;
}
.swatch {
  height: 1.6em;
  border-radius: 2px;
  cursor: pointer;
  position: relative;
  border: 2px solid transparent;
}
.swatch.selected { border-color: var(--text); }
.swatch::after {
  content: attr(data-digit);
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7em;
  font-weight: bold;
  color: rgba(255,255,255,0.7);
  text-shadow: 0 0 2px rgba(0,0,0,0.5);
}

/* Schematics drawn by the Circuit builder */
.schematic {
  display: flex;
  justify-content: center;
  margin: 0.5em 0 0.85em;
  padding: 0.5em;
  background: #fffcf2;
  border: 1px dashed var(--border);
  border-radius: 4px;
  overflow-x: auto;
}
.circuit-svg {
  display: block;
  max-width: 100%;
  height: auto;
  width: 28em;
}
.schematic-pair {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75em;
  margin: 0.5em 0 0.85em;
}
.schematic-pair figure {
  flex: 1 1 18em;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fffcf2;
  border: 1px dashed var(--border);
  border-radius: 4px;
  padding: 0.5em;
  margin: 0;
}
.schematic-pair figcaption {
  font-size: 0.75em;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 0.25em;
}
.schematic-pair .circuit-svg { width: 100%; max-width: 24em; }

/* IC 555 */
.ic555-svg { width: 9em; height: auto; display: block; margin: 0.5em auto; }

/* Standard finder results */
.std-list { display: flex; flex-direction: column; gap: 0.15em; }
.std-row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.5em;
  align-items: center;
  padding: 0.15em 0;
  font-family: var(--mono);
}
.std-rank { color: var(--text-dim); font-size: 0.85em; }
.std-value { color: var(--accent); font-weight: 600; }
.std-error { color: var(--text-dim); font-size: 0.85em; }
.std-error.zero { color: var(--ok); }

/* AWG table */
.table-wrap { overflow-x: auto; margin: 0.5em 0; }
.awg-table {
  border-collapse: collapse;
  font-family: var(--mono);
  font-size: 0.85em;
  width: 100%;
  min-width: 38em;
}
.awg-table th, .awg-table td {
  padding: 0.3em 0.5em;
  text-align: right;
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
}
.awg-table th:first-child, .awg-table td:first-child {
  text-align: left;
  font-weight: 600;
}
.awg-table thead th {
  background: var(--surface);
  border-bottom: 2px solid var(--border-strong);
  color: var(--text-dim);
  position: sticky;
  top: 0;
  font-weight: 600;
}
.awg-table tbody tr:hover { background: rgba(204, 85, 0, 0.06); }
.awg-table tbody tr.passes {
  background: rgba(78, 154, 6, 0.12);
}
.awg-table tbody tr.passes:hover {
  background: rgba(78, 154, 6, 0.2);
}

.calc-footer {
  text-align: right;
  font-size: 0.72em;
  color: var(--text-dim);
  margin-top: 0.75em;
  opacity: 0.75;
}
.calc-footer a { color: var(--text-dim); text-decoration: none; }
.calc-footer a:hover { color: var(--accent); }

@media (max-width: 40em) {
  .calc { padding: 0.75em; font-size: 12px; }
  .row { gap: 0.5em; }
  .field { min-width: 5em; }
  .band-picker select { width: 5em; }
}
`;

// ----------------------------------------------------------------
// Section 5: Custom element
// ----------------------------------------------------------------

const TABS = [
  {
    id: "resistors",
    label: "Resistors",
    tools: ["estd", "color", "net"],
  },
  {
    id: "circuits",
    label: "Basic circuits",
    tools: ["ohms", "vdiv", "led"],
  },
  {
    id: "timing",
    label: "Filters & timing",
    tools: ["rc", "t555"],
  },
  {
    id: "wiring",
    label: "Wiring",
    tools: ["awg"],
  },
  {
    id: "pcb",
    label: "PCB trace",
    tools: ["trace"],
  },
];

class EECalculator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.state = {
      activeTab: "resistors",
      // Color code state
      bandMode: 4,
      bands: [1, 0, 2, 10], // brown black red gold (1kΩ 5%) - default
      // E-series state
      eSeriesSeries: "E96",
      // Vdiv
      vdivSeries: "E96",
      vdivDir: "fwd",
      // LED
      ledSeries: "E24",
      // 555
      t555Mode: "astable",
      t555Dir: "fwd",
      // Net
      netKind: "resistor",
      netTopo: "parallel",
      // AWG
      awgHighlight: "",
      awgLength: "",
      awgLengthUnit: "m",
      // Trace
    };
  }

  connectedCallback() {
    this._build();
    this._render();
  }

  _build() {
    const root = this.shadowRoot;
    const style = document.createElement("style");
    style.textContent = STYLE;
    root.appendChild(style);

    const wrap = document.createElement("div");
    wrap.className = "calc";

    // Tabs
    const tabs = document.createElement("div");
    tabs.className = "tabs";
    for (const t of TABS) {
      const b = document.createElement("button");
      b.className = "tab";
      b.dataset.tab = t.id;
      b.textContent = t.label;
      b.addEventListener("click", () => {
        this.state.activeTab = t.id;
        this._render();
      });
      tabs.appendChild(b);
    }
    wrap.appendChild(tabs);

    // Tab groups: each holds multiple stacked tool sections.
    const groups = document.createElement("div");
    groups.className = "tab-groups";
    for (const t of TABS) {
      const group = document.createElement("div");
      group.className = "tab-group";
      group.dataset.tab = t.id;
      for (const toolId of t.tools) {
        const sec = document.createElement("section");
        sec.className = "tool";
        sec.dataset.tool = toolId;
        group.appendChild(sec);
      }
      groups.appendChild(group);
    }
    wrap.appendChild(groups);

    // Footer
    const foot = document.createElement("div");
    foot.className = "calc-footer";
    foot.innerHTML = `<a href="https://asmat.ca">EE Calculator by Carlos Asmat</a>`;
    wrap.appendChild(foot);

    root.appendChild(wrap);
    this._wrap = wrap;
  }

  _render() {
    const active = this.state.activeTab;
    this._wrap
      .querySelectorAll(".tab")
      .forEach((tab) =>
        tab.classList.toggle("active", tab.dataset.tab === active),
      );
    this._wrap
      .querySelectorAll(".tab-group")
      .forEach((g) => g.classList.toggle("active", g.dataset.tab === active));
    // Render every tool that lives in the active tab. Each tool's render is
    // idempotent: it skips work if the section already has rendered content,
    // unless _renderTool(id) is called explicitly to force a refresh.
    const tab = TABS.find((t) => t.id === active);
    if (!tab) return;
    for (const toolId of tab.tools) {
      const sec = this._wrap.querySelector(`[data-tool="${toolId}"]`);
      if (sec && sec.childElementCount === 0) {
        this[`_render_${toolId}`]?.();
      }
    }
  }

  // Force a refresh of a single tool's section. Use when that tool's own
  // mode/direction state changed and only its own DOM should rebuild.
  _renderTool(toolId) {
    const sec = this._wrap.querySelector(`[data-tool="${toolId}"]`);
    if (sec) sec.innerHTML = "";
    this[`_render_${toolId}`]?.();
  }

  // ============================================================
  // Tool: Color code
  // ============================================================
  _render_color() {
    const el = this._wrap.querySelector('[data-tool="color"]');
    const { bandMode, bands } = this.state;

    el.innerHTML = `
      <div class="tool-title">Resistor color code</div>
      <div class="tool-sub">Click a band, pick a color. Or type a value and get the band pattern.</div>

      <div class="row">
        <div class="seg" data-band-mode>
          <button class="btn ${bandMode === 4 ? "active" : ""}" data-mode="4">4 band</button>
          <button class="btn ${bandMode === 5 ? "active" : ""}" data-mode="5">5 band</button>
          <button class="btn ${bandMode === 6 ? "active" : ""}" data-mode="6">6 band</button>
        </div>
      </div>

      <div class="resistor-display">
        <div class="resistor-wrap">${RESISTOR_SVG}</div>
        <div class="resistor-eq">=</div>
        <div class="resistor-readout" data-readout></div>
      </div>

      <div class="band-pickers" data-pickers></div>

      <div class="row" style="margin-top:0.85em">
        <div class="field field-grow">
          <label>Or enter a value</label>
          <input type="text" data-value-input placeholder="e.g. 4.7k, 220, 1M">
        </div>
        <button class="btn primary" data-value-go>Show bands</button>
      </div>
    `;

    // Resize SVG bands.
    const svg = el.querySelector(".resistor-svg");
    const bandsG = svg.querySelector(".bands");
    // Render band rects: place them across the body (x=70..250).
    const x0 = 70,
      x1 = 250;
    const usable = x1 - x0;
    const slot = usable / (bandMode + 1);
    bandsG.innerHTML = "";
    for (let i = 0; i < bandMode; i++) {
      const x = x0 + slot * (i + 0.5) - 6;
      const colorIdx = bands[i] ?? 0;
      const color = BAND_COLORS[colorIdx]?.hex || "#888";
      const r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      r.setAttribute("x", x);
      r.setAttribute("y", 11);
      r.setAttribute("width", 12);
      r.setAttribute("height", 48);
      r.setAttribute("fill", color);
      r.setAttribute("data-band", i);
      r.addEventListener("click", () => this._pickBandForIndex(i));
      bandsG.appendChild(r);
    }

    // Band pickers.
    const pickers = el.querySelector("[data-pickers]");
    const labels = this._bandLabels(bandMode);
    pickers.innerHTML = "";
    for (let i = 0; i < bandMode; i++) {
      const opts = this._bandOptionsFor(bandMode, i)
        .map((idx) => {
          const c = BAND_COLORS[idx];
          return `<option value="${idx}" ${bands[i] === idx ? "selected" : ""}>${c.name}</option>`;
        })
        .join("");
      const div = document.createElement("div");
      div.className = "band-picker";
      div.innerHTML = `<label>${labels[i]}</label><select data-band-select="${i}">${opts}</select>`;
      pickers.appendChild(div);
    }
    el.querySelectorAll("[data-band-select]").forEach((sel) => {
      sel.addEventListener("change", () => {
        const i = parseInt(sel.dataset.bandSelect);
        this.state.bands[i] = parseInt(sel.value);
        this._renderTool("color");
      });
    });

    // Mode toggle.
    el.querySelectorAll("[data-band-mode] [data-mode]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const m = parseInt(btn.dataset.mode);
        this.state.bandMode = m;
        // Resize bands array sensibly.
        const cur = this.state.bands;
        if (m === 4)
          this.state.bands = [
            cur[0] ?? 1,
            cur[1] ?? 0,
            cur[2] ?? 2,
            cur[3] ?? 10,
          ];
        else if (m === 5)
          this.state.bands = [
            cur[0] ?? 1,
            cur[1] ?? 0,
            cur[2] ?? 0,
            cur[3] ?? 2,
            cur[4] ?? 1,
          ];
        else if (m === 6)
          this.state.bands = [
            cur[0] ?? 1,
            cur[1] ?? 0,
            cur[2] ?? 0,
            cur[3] ?? 2,
            cur[4] ?? 1,
            cur[5] ?? 1,
          ];
        this._renderTool("color");
      });
    });

    // Value → bands.
    el.querySelector("[data-value-go]").addEventListener("click", () => {
      const input = el.querySelector("[data-value-input]");
      const v = parseSI(input.value);
      if (!isFinite(v) || v <= 0) return;
      const sc = bandMode === 4 ? 2 : 3;
      const res = valueToBands(v, sc);
      if (!res.ok) return;
      // Map digit indices into BAND_COLORS indices (digit → first color matching).
      const digitToIdx = (d) => BAND_COLORS.findIndex((c) => c.digit === d);
      const newBands = res.digits.map(digitToIdx);
      newBands.push(res.multiplier);
      if (bandMode === 4) newBands.push(this.state.bands[3] ?? 10);
      if (bandMode === 5) newBands.push(this.state.bands[4] ?? 1);
      if (bandMode === 6) {
        newBands.push(this.state.bands[4] ?? 1);
        newBands.push(this.state.bands[5] ?? 1);
      }
      this.state.bands = newBands;
      this._renderTool("color");
    });
    el.querySelector("[data-value-input]").addEventListener("keydown", (e) => {
      if (e.key === "Enter") el.querySelector("[data-value-go]").click();
    });

    // Render result.
    let digitBands, multBand, tolBand, ppmBand;
    if (bandMode === 4) {
      digitBands = bands.slice(0, 2);
      multBand = bands[2];
      tolBand = bands[3];
    } else if (bandMode === 5) {
      digitBands = bands.slice(0, 3);
      multBand = bands[3];
      tolBand = bands[4];
    } else {
      digitBands = bands.slice(0, 3);
      multBand = bands[3];
      tolBand = bands[4];
      ppmBand = bands[5];
    }
    const r = bandsToValue(digitBands, multBand, tolBand, ppmBand);
    const readout = el.querySelector("[data-readout]");
    if (r.value == null) {
      readout.innerHTML = `<span class="readout-value warn">invalid</span>`;
    } else {
      const tol = r.tolerance != null ? `±${r.tolerance}%` : "";
      const ppmLine =
        bandMode === 6 && r.ppm != null
          ? `<div class="readout-ppm">${r.ppm} ppm/°C</div>`
          : "";
      readout.innerHTML = `
        <div class="readout-line">
          <span class="readout-value">${formatSI(r.value, "Ω")}</span>
          ${tol ? `<span class="readout-tol">${tol}</span>` : ""}
        </div>
        ${ppmLine}
      `;
    }
  }

  _bandLabels(mode) {
    if (mode === 4) return ["digit 1", "digit 2", "mult", "tol"];
    if (mode === 5) return ["digit 1", "digit 2", "digit 3", "mult", "tol"];
    return ["digit 1", "digit 2", "digit 3", "mult", "tol", "ppm"];
  }

  _bandOptionsFor(mode, i) {
    const sigCount = mode === 4 ? 2 : 3;
    if (i < sigCount) {
      // significant digit bands: 0..9
      return BAND_COLORS.map((c, idx) => (c.digit != null ? idx : null)).filter(
        (x) => x != null,
      );
    }
    if (i === sigCount) {
      // multiplier band: all with a multiplier
      return BAND_COLORS.map((c, idx) =>
        c.multiplier != null ? idx : null,
      ).filter((x) => x != null);
    }
    if (i === sigCount + 1) {
      // tolerance band
      return BAND_COLORS.map((c, idx) =>
        c.tolerance != null ? idx : null,
      ).filter((x) => x != null);
    }
    // ppm band
    return BAND_COLORS.map((c, idx) => (c.ppm != null ? idx : null)).filter(
      (x) => x != null,
    );
  }

  _pickBandForIndex(i) {
    const sel = this._wrap.querySelector(`[data-band-select="${i}"]`);
    if (sel) {
      sel.focus();
      // No native dropdown.showPicker on all browsers; just focus to invite interaction.
      try {
        sel.showPicker?.();
      } catch (_) {}
    }
  }

  // ============================================================
  // Tool: E-series finder
  // ============================================================
  _render_estd() {
    const el = this._wrap.querySelector('[data-tool="estd"]');
    el.innerHTML = `
      <div class="tool-title">Standard resistor finder</div>
      <div class="tool-sub">Enter a target value, pick a tolerance series, get the nearest standard values.</div>

      <div class="row">
        <div class="field field-grow">
          <label>Target value</label>
          <input type="text" data-target placeholder="e.g. 3.3k, 1M, 470">
        </div>
        <div class="field">
          <label>E-series</label>
          <select data-series>
            ${eSeriesOptions(this.state.eSeriesSeries)}
          </select>
        </div>
        <button class="btn primary" data-go>Find</button>
      </div>

      <div class="result" data-result><div class="std-list" data-list></div></div>
    `;
    const list = el.querySelector("[data-list]");
    const go = () => {
      const target = parseSI(el.querySelector("[data-target]").value);
      const series = el.querySelector("[data-series]").value;
      this.state.eSeriesSeries = series;
      const matches = nearestStandard(target, series, 5);
      if (!matches.length) {
        list.innerHTML = "";
        return;
      }
      list.innerHTML = matches
        .map((m, i) => {
          const err = m.error * 100;
          const errStr =
            Math.abs(err) < 0.005
              ? "exact"
              : `${err >= 0 ? "+" : ""}${err.toFixed(2)}%`;
          return `
          <div class="std-row">
            <span class="std-rank">#${i + 1}</span>
            <span class="std-value">${formatSI(m.value, "Ω")}</span>
            <span class="std-error ${Math.abs(err) < 0.005 ? "zero" : ""}">${errStr}</span>
          </div>`;
        })
        .join("");
    };
    el.querySelector("[data-go]").addEventListener("click", go);
    el.querySelector("[data-target]").addEventListener("keydown", (e) => {
      if (e.key === "Enter") go();
    });
    el.querySelector("[data-series]").addEventListener("change", go);
  }

  // ============================================================
  // Tool: Voltage divider
  // ============================================================
  _render_vdiv() {
    const el = this._wrap.querySelector('[data-tool="vdiv"]');
    const dir = this.state.vdivDir;
    el.innerHTML = `
      <div class="tool-title">Voltage divider</div>
      <div class="tool-sub">Forward: V_in and resistors → V_out. Reverse: target V_out → closest standard pair.</div>

      <div class="schematic" data-schematic></div>

      <div class="row">
        <div class="seg" data-dir>
          <button class="btn ${dir === "fwd" ? "active" : ""}" data-d="fwd">R₁, R₂ → V_out</button>
          <button class="btn ${dir === "rev" ? "active" : ""}" data-d="rev">V_out → R₁, R₂</button>
        </div>
      </div>

      <div class="row">
        <div class="field"><label>V_in</label><input type="text" data-vin value="5"></div>
        ${
          dir === "fwd"
            ? `<div class="field"><label>R₁</label><input type="text" data-r1 value="10k"></div>
             <div class="field"><label>R₂</label><input type="text" data-r2 value="10k"></div>`
            : `<div class="field"><label>V_out target</label><input type="text" data-vout value="3.3"></div>
             <div class="field"><label>Series</label><select data-series>${eSeriesOptions(this.state.vdivSeries)}</select></div>`
        }
        <button class="btn primary" data-go>Compute</button>
      </div>

      <div class="result" data-result></div>
    `;
    const drawSchematic = (r1Label, r2Label) => {
      const c = new Circuit(14, 9);
      c.terminal(1, 2, "V_in", "left");
      c.wire(1, 2, 6, 2);
      c.resistor(6, 2, 6, 4, r1Label || "R₁");
      c.junction(6, 4);
      c.wire(6, 4, 11, 4);
      c.terminal(11, 4, "V_out", "right");
      c.resistor(6, 4, 6, 6.5, r2Label || "R₂");
      c.wire(6, 6.5, 6, 7.4);
      c.ground(6, 7.4);
      el.querySelector("[data-schematic]").innerHTML = c.render();
    };
    drawSchematic();
    el.querySelectorAll("[data-dir] [data-d]").forEach((b) => {
      b.addEventListener("click", () => {
        this.state.vdivDir = b.dataset.d;
        this._renderTool("vdiv");
      });
    });
    const go = () => {
      const result = el.querySelector("[data-result]");
      const vin = parseSI(el.querySelector("[data-vin]").value);
      if (dir === "fwd") {
        const r1 = parseSI(el.querySelector("[data-r1]").value);
        const r2 = parseSI(el.querySelector("[data-r2]").value);
        const r = vdivForward(vin, r1, r2);
        if (!r) {
          result.innerHTML = `<span class="result-value warn">invalid</span>`;
          return;
        }
        drawSchematic(formatSI(r1, "Ω"), formatSI(r2, "Ω"));
        result.innerHTML = `
          <div class="result-row"><span class="result-label">V_out</span><span class="result-value accent">${formatSI(r.vout, "V")}</span></div>
          <div class="result-row"><span class="result-label">I_divider</span><span class="result-value">${formatSI(r.iDiv, "A")}</span></div>
          <div class="result-row"><span class="result-label">P_R1 + P_R2</span><span class="result-value">${formatSI(vin * r.iDiv, "W")}</span></div>
        `;
      } else {
        const vout = parseSI(el.querySelector("[data-vout]").value);
        const series = el.querySelector("[data-series]").value;
        this.state.vdivSeries = series;
        const r = vdivReverse(vin, vout, series);
        if (!r) {
          result.innerHTML = `<span class="result-value warn">V_out must be between 0 and V_in</span>`;
          return;
        }
        const errPct = (r.error * 100).toFixed(3);
        drawSchematic(formatSI(r.r1, "Ω"), formatSI(r.r2, "Ω"));
        result.innerHTML = `
          <div class="result-row"><span class="result-label">R₁</span><span class="result-value accent">${formatSI(r.r1, "Ω")}</span></div>
          <div class="result-row"><span class="result-label">R₂</span><span class="result-value accent">${formatSI(r.r2, "Ω")}</span></div>
          <div class="result-row"><span class="result-label">Actual V_out</span><span class="result-value">${formatSI(r.vout, "V")}</span></div>
          <div class="result-row"><span class="result-label">Error</span><span class="result-value ${r.error < 0.001 ? "ok" : ""}">${errPct}%</span></div>
        `;
      }
    };
    el.querySelector("[data-go]").addEventListener("click", go);
    el.querySelectorAll("input").forEach((inp) =>
      inp.addEventListener("keydown", (e) => {
        if (e.key === "Enter") go();
      }),
    );
    go();
  }

  // ============================================================
  // Tool: LED resistor
  // ============================================================
  _render_led() {
    const el = this._wrap.querySelector('[data-tool="led"]');
    el.innerHTML = `
      <div class="tool-title">LED current-limiting resistor</div>
      <div class="tool-sub">Pick supply voltage, forward voltage, count, target current. Get R, wattage, dissipation.</div>

      <div class="row">
        <div class="field"><label>V_supply</label><input type="text" data-vsup value="5"></div>
        <div class="field"><label>V_f per LED</label><input type="text" data-vf value="2.0"></div>
        <div class="field"><label># LEDs</label><input type="number" data-n value="1" min="1" max="20" step="1"></div>
        <div class="field"><label>I_f (mA)</label><input type="text" data-if value="20"></div>
        <div class="field"><label>Series</label><select data-series>${eSeriesOptions(this.state.ledSeries)}</select></div>
        <button class="btn primary" data-go>Compute</button>
      </div>

      <div class="schematic" data-schematic></div>
      <div class="result" data-result></div>
    `;
    const drawSchematic = (n, rLabel) => {
      const cols = 7 + 2 * n;
      const c = new Circuit(cols, 4);
      c.terminal(1, 2, "V+", "left");
      c.wire(1, 2, 2, 2);
      c.resistor(2, 2, 5, 2, rLabel || "R");
      let x = 5;
      for (let i = 0; i < n; i++) {
        c.led(x, 2, x + 2, 2);
        x += 2;
      }
      c.wire(x, 2, x + 1, 2);
      c.terminal(x + 1, 2, "GND", "right");
      el.querySelector("[data-schematic]").innerHTML = c.render();
    };
    const go = () => {
      const vsup = parseSI(el.querySelector("[data-vsup]").value);
      const vf = parseSI(el.querySelector("[data-vf]").value);
      const n = Math.max(
        1,
        Math.min(20, parseInt(el.querySelector("[data-n]").value) || 1),
      );
      const ifMa = parseSI(el.querySelector("[data-if]").value);
      const series = el.querySelector("[data-series]").value;
      this.state.ledSeries = series;
      const r = ledResistor(vsup, vf, n, ifMa, series);
      drawSchematic(n, r.ok ? formatSI(r.rStandard, "Ω") : "R");
      const result = el.querySelector("[data-result]");
      if (!r.ok) {
        result.innerHTML = `<span class="result-value warn">${r.reason}</span>`;
        return;
      }
      result.innerHTML = `
        <div class="result-row"><span class="result-label">V dropped across R</span><span class="result-value">${formatSI(r.vDrop, "V")}</span></div>
        <div class="result-row"><span class="result-label">R exact</span><span class="result-value">${formatSI(r.rExact, "Ω")}</span></div>
        <div class="result-row"><span class="result-label">R standard</span><span class="result-value accent">${formatSI(r.rStandard, "Ω")}</span></div>
        <div class="result-row"><span class="result-label">Actual I</span><span class="result-value">${formatSI(r.iActualMa / 1000, "A")}</span></div>
        <div class="result-row"><span class="result-label">P dissipated</span><span class="result-value">${formatSI(r.pR, "W")}</span></div>
        <div class="result-row"><span class="result-label">Suggested rating</span><span class="result-value ok">${formatWattage(r.wattage)}</span></div>
      `;
    };
    el.querySelector("[data-go]").addEventListener("click", go);
    el.querySelectorAll("input, select").forEach((inp) => {
      inp.addEventListener("change", go);
      inp.addEventListener("keydown", (e) => {
        if (e.key === "Enter") go();
      });
    });
    go();
  }

  // ============================================================
  // Tool: Ohm's law
  // ============================================================
  _render_ohms() {
    const el = this._wrap.querySelector('[data-tool="ohms"]');
    el.innerHTML = `
      <div class="tool-title">Ohm's law / power wheel</div>
      <div class="tool-sub">Fill in any two of V, I, R, P. The other two appear.</div>

      <div class="row">
        <div class="field"><label>V (V)</label><input type="text" data-v placeholder="e.g. 5"></div>
        <div class="field"><label>I (A)</label><input type="text" data-i placeholder="e.g. 10m"></div>
        <div class="field"><label>R (Ω)</label><input type="text" data-r placeholder="e.g. 500"></div>
        <div class="field"><label>P (W)</label><input type="text" data-p placeholder="e.g. 50m"></div>
        <button class="btn primary" data-go>Solve</button>
      </div>

      <div class="result" data-result></div>
    `;
    const go = () => {
      const get = (sel) => {
        const v = el.querySelector(sel).value.trim();
        if (v === "") return null;
        const n = parseSI(v);
        return isFinite(n) ? n : null;
      };
      const known = {
        v: get("[data-v]"),
        i: get("[data-i]"),
        r: get("[data-r]"),
        p: get("[data-p]"),
      };
      const r = solveOhms(known);
      const result = el.querySelector("[data-result]");
      if (!r.ok) {
        result.innerHTML = `<span class="result-value warn">${r.reason}</span>`;
        return;
      }
      result.innerHTML = `
        <div class="result-row"><span class="result-label">Voltage</span><span class="result-value ${known.v == null ? "accent" : ""}">${formatSI(r.v, "V")}</span></div>
        <div class="result-row"><span class="result-label">Current</span><span class="result-value ${known.i == null ? "accent" : ""}">${formatSI(r.i, "A")}</span></div>
        <div class="result-row"><span class="result-label">Resistance</span><span class="result-value ${known.r == null ? "accent" : ""}">${formatSI(r.r, "Ω")}</span></div>
        <div class="result-row"><span class="result-label">Power</span><span class="result-value ${known.p == null ? "accent" : ""}">${formatSI(r.p, "W")}</span></div>
      `;
    };
    el.querySelector("[data-go]").addEventListener("click", go);
    el.querySelectorAll("input").forEach((inp) => {
      inp.addEventListener("input", go);
      inp.addEventListener("keydown", (e) => {
        if (e.key === "Enter") go();
      });
    });
  }

  // ============================================================
  // Tool: RC cutoff
  // ============================================================
  _render_rc() {
    const el = this._wrap.querySelector('[data-tool="rc"]');
    el.innerHTML = `
      <div class="tool-title">RC cutoff frequency</div>
      <div class="tool-sub">Same math for both topologies. Output at -3 dB at f_c.</div>

      <div class="schematic-pair">
        <figure><figcaption>Low-pass</figcaption><div data-schematic-lp></div></figure>
        <figure><figcaption>High-pass</figcaption><div data-schematic-hp></div></figure>
      </div>

      <div class="row">
        <div class="field"><label>R</label><input type="text" data-r placeholder="e.g. 10k"></div>
        <div class="field"><label>C</label><input type="text" data-c placeholder="e.g. 100n"></div>
        <div class="field"><label>f_c (Hz)</label><input type="text" data-fc placeholder="e.g. 1k"></div>
        <button class="btn primary" data-go>Solve</button>
      </div>

      <div class="result" data-result></div>
    `;
    const drawLP = (rLabel, cLabel) => {
      const c = new Circuit(14, 9);
      c.terminal(1, 2, "V_in", "left");
      c.wire(1, 2, 2, 2);
      c.resistor(2, 2, 6, 2, rLabel || "R");
      c.junction(6, 2);
      c.wire(6, 2, 11, 2);
      c.terminal(11, 2, "V_out", "right");
      c.capacitor(6, 2, 6, 6, cLabel || "C");
      c.wire(6, 6, 6, 7.4);
      c.ground(6, 7.4);
      return c.render();
    };
    const drawHP = (rLabel, cLabel) => {
      const c = new Circuit(14, 9);
      c.terminal(1, 2, "V_in", "left");
      c.wire(1, 2, 2, 2);
      c.capacitor(2, 2, 6, 2, cLabel || "C");
      c.junction(6, 2);
      c.wire(6, 2, 11, 2);
      c.terminal(11, 2, "V_out", "right");
      c.resistor(6, 2, 6, 6, rLabel || "R");
      c.wire(6, 6, 6, 7.4);
      c.ground(6, 7.4);
      return c.render();
    };
    const drawBoth = (rLabel, cLabel) => {
      el.querySelector("[data-schematic-lp]").innerHTML = drawLP(
        rLabel,
        cLabel,
      );
      el.querySelector("[data-schematic-hp]").innerHTML = drawHP(
        rLabel,
        cLabel,
      );
    };
    drawBoth();
    const go = () => {
      const get = (sel) => {
        const v = el.querySelector(sel).value.trim();
        if (v === "") return null;
        const n = parseSI(v);
        return isFinite(n) ? n : null;
      };
      const r = rcSolve(get("[data-r]"), get("[data-c]"), get("[data-fc]"));
      const result = el.querySelector("[data-result]");
      if (!r.ok) {
        result.innerHTML = `<span class="result-value warn">need two of R, C, f_c</span>`;
        return;
      }
      drawBoth(formatSI(r.r, "Ω"), formatSI(r.c, "F"));
      result.innerHTML = `
        <div class="result-row"><span class="result-label">R</span><span class="result-value">${formatSI(r.r, "Ω")}</span></div>
        <div class="result-row"><span class="result-label">C</span><span class="result-value">${formatSI(r.c, "F")}</span></div>
        <div class="result-row"><span class="result-label">f_c (-3dB)</span><span class="result-value accent">${formatSI(r.fc, "Hz")}</span></div>
        <div class="result-row"><span class="result-label">τ (time constant)</span><span class="result-value">${formatSI(r.tau, "s")}</span></div>
        <div class="note">f_c = 1 / (2π R C). τ = R C. At f_c the output is 70.7% of input (-3 dB) and lags/leads by 45°.</div>
      `;
    };
    el.querySelector("[data-go]").addEventListener("click", go);
    el.querySelectorAll("input").forEach((inp) => {
      inp.addEventListener("input", go);
      inp.addEventListener("keydown", (e) => {
        if (e.key === "Enter") go();
      });
    });
  }

  // ============================================================
  // Tool: 555 timer
  // ============================================================
  _render_t555() {
    const el = this._wrap.querySelector('[data-tool="t555"]');
    const mode = this.state.t555Mode;
    const dir = this.state.t555Dir;
    el.innerHTML = `
      <div class="tool-title">555 timer</div>
      <div class="tool-sub">Astable: free-running oscillator. Monostable: one-shot pulse.</div>

      ${IC_555_SVG}

      <div class="row">
        <div class="seg" data-mode>
          <button class="btn ${mode === "astable" ? "active" : ""}" data-m="astable">Astable</button>
          <button class="btn ${mode === "monostable" ? "active" : ""}" data-m="monostable">Monostable</button>
        </div>
        <div class="seg" data-dir>
          <button class="btn ${dir === "fwd" ? "active" : ""}" data-d="fwd">Components → timing</button>
          <button class="btn ${dir === "rev" ? "active" : ""}" data-d="rev">Timing → components</button>
        </div>
      </div>

      <div data-body></div>

      <div class="result" data-result></div>
    `;
    el.querySelectorAll("[data-mode] [data-m]").forEach((b) => {
      b.addEventListener("click", () => {
        this.state.t555Mode = b.dataset.m;
        this._renderTool("t555");
      });
    });
    el.querySelectorAll("[data-dir] [data-d]").forEach((b) => {
      b.addEventListener("click", () => {
        this.state.t555Dir = b.dataset.d;
        this._renderTool("t555");
      });
    });

    const body = el.querySelector("[data-body]");
    const result = el.querySelector("[data-result]");

    if (mode === "astable" && dir === "fwd") {
      body.innerHTML = `
        <div class="row">
          <div class="field"><label>R₁</label><input type="text" data-r1 value="10k"></div>
          <div class="field"><label>R₂</label><input type="text" data-r2 value="10k"></div>
          <div class="field"><label>C</label><input type="text" data-c value="100n"></div>
          <button class="btn primary" data-go>Compute</button>
        </div>`;
      const go = () => {
        const r1 = parseSI(body.querySelector("[data-r1]").value);
        const r2 = parseSI(body.querySelector("[data-r2]").value);
        const c = parseSI(body.querySelector("[data-c]").value);
        const r = timer555Astable(r1, r2, c);
        result.innerHTML = `
          <div class="result-row"><span class="result-label">Frequency</span><span class="result-value accent">${formatSI(r.f, "Hz")}</span></div>
          <div class="result-row"><span class="result-label">Period</span><span class="result-value">${formatSI(r.period, "s")}</span></div>
          <div class="result-row"><span class="result-label">t_high</span><span class="result-value">${formatSI(r.tHigh, "s")}</span></div>
          <div class="result-row"><span class="result-label">t_low</span><span class="result-value">${formatSI(r.tLow, "s")}</span></div>
          <div class="result-row"><span class="result-label">Duty cycle</span><span class="result-value">${(r.duty * 100).toFixed(2)}%</span></div>
          <div class="note">f = 1.44 / ((R₁ + 2R₂) C). Duty is always > 50% in classic astable.</div>
        `;
      };
      body.querySelector("[data-go]").addEventListener("click", go);
      body.querySelectorAll("input").forEach((inp) =>
        inp.addEventListener("keydown", (e) => {
          if (e.key === "Enter") go();
        }),
      );
      go();
    } else if (mode === "astable" && dir === "rev") {
      body.innerHTML = `
        <div class="row">
          <div class="field"><label>Target f</label><input type="text" data-f value="1k"></div>
          <div class="field"><label>Duty (0.5–1)</label><input type="text" data-duty value="0.75"></div>
          <div class="field"><label>Pick C</label><input type="text" data-c value="100n"></div>
          <button class="btn primary" data-go>Suggest R₁, R₂</button>
        </div>`;
      const go = () => {
        const f = parseSI(body.querySelector("[data-f]").value);
        const duty = parseFloat(body.querySelector("[data-duty]").value);
        const c = parseSI(body.querySelector("[data-c]").value);
        const r = timer555AstableReverse(f, duty, c, "E24");
        if (!r.ok) {
          result.innerHTML = `<span class="result-value warn">${r.reason}</span>`;
          return;
        }
        const s = r.suggestions[0];
        if (!s) {
          result.innerHTML = `<span class="result-value warn">no good standard pair found</span>`;
          return;
        }
        result.innerHTML = `
          <div class="result-row"><span class="result-label">R₁ (E24)</span><span class="result-value accent">${formatSI(s.r1Std, "Ω")}</span></div>
          <div class="result-row"><span class="result-label">R₂ (E24)</span><span class="result-value accent">${formatSI(s.r2Std, "Ω")}</span></div>
          <div class="result-row"><span class="result-label">C</span><span class="result-value">${formatSI(s.C, "F")}</span></div>
          <div class="result-row"><span class="result-label">Actual f</span><span class="result-value">${formatSI(s.verify.f, "Hz")}</span></div>
          <div class="result-row"><span class="result-label">Actual duty</span><span class="result-value">${(s.verify.duty * 100).toFixed(2)}%</span></div>
        `;
      };
      body.querySelector("[data-go]").addEventListener("click", go);
      body.querySelectorAll("input").forEach((inp) =>
        inp.addEventListener("keydown", (e) => {
          if (e.key === "Enter") go();
        }),
      );
      go();
    } else if (mode === "monostable" && dir === "fwd") {
      body.innerHTML = `
        <div class="row">
          <div class="field"><label>R</label><input type="text" data-r value="100k"></div>
          <div class="field"><label>C</label><input type="text" data-c value="10u"></div>
          <button class="btn primary" data-go>Compute</button>
        </div>`;
      const go = () => {
        const r = parseSI(body.querySelector("[data-r]").value);
        const c = parseSI(body.querySelector("[data-c]").value);
        const res = timer555Mono(r, c);
        result.innerHTML = `
          <div class="result-row"><span class="result-label">Pulse width</span><span class="result-value accent">${formatSI(res.t, "s")}</span></div>
          <div class="note">t = 1.1 · R · C</div>`;
      };
      body.querySelector("[data-go]").addEventListener("click", go);
      body.querySelectorAll("input").forEach((inp) =>
        inp.addEventListener("keydown", (e) => {
          if (e.key === "Enter") go();
        }),
      );
      go();
    } else {
      body.innerHTML = `
        <div class="row">
          <div class="field"><label>Target pulse</label><input type="text" data-t value="100m"></div>
          <div class="field"><label>Pick C</label><input type="text" data-c value="10u"></div>
          <button class="btn primary" data-go>Suggest R</button>
        </div>`;
      const go = () => {
        const t = parseSI(body.querySelector("[data-t]").value);
        const c = parseSI(body.querySelector("[data-c]").value);
        const res = timer555MonoReverse(t, c, "E24");
        result.innerHTML = `
          <div class="result-row"><span class="result-label">R exact</span><span class="result-value">${formatSI(res.R, "Ω")}</span></div>
          <div class="result-row"><span class="result-label">R (E24)</span><span class="result-value accent">${formatSI(res.rStd, "Ω")}</span></div>
          <div class="result-row"><span class="result-label">Actual pulse</span><span class="result-value">${formatSI(res.verifyT, "s")}</span></div>`;
      };
      body.querySelector("[data-go]").addEventListener("click", go);
      body.querySelectorAll("input").forEach((inp) =>
        inp.addEventListener("keydown", (e) => {
          if (e.key === "Enter") go();
        }),
      );
      go();
    }
  }

  // ============================================================
  // Tool: Series/parallel network reducer
  // ============================================================
  _render_net() {
    const el = this._wrap.querySelector('[data-tool="net"]');
    const kind = this.state.netKind;
    const topo = this.state.netTopo;
    el.innerHTML = `
      <div class="tool-title">Series/parallel reducer</div>
      <div class="tool-sub">Combine multiple resistors or capacitors. Enter comma-separated values with SI prefixes.</div>

      <div class="row">
        <div class="seg" data-kind>
          <button class="btn ${kind === "resistor" ? "active" : ""}" data-k="resistor">Resistors</button>
          <button class="btn ${kind === "capacitor" ? "active" : ""}" data-k="capacitor">Capacitors</button>
        </div>
        <div class="seg" data-topo>
          <button class="btn ${topo === "series" ? "active" : ""}" data-t="series">Series</button>
          <button class="btn ${topo === "parallel" ? "active" : ""}" data-t="parallel">Parallel</button>
        </div>
      </div>

      <div class="schematic" data-schematic></div>

      <div class="row">
        <div class="field field-grow">
          <label>Values (comma-separated)</label>
          <input type="text" data-vals placeholder="e.g. 10k, 4.7k, 2.2k">
        </div>
        <button class="btn primary" data-go>Compute</button>
      </div>

      <div class="result" data-result></div>
    `;
    el.querySelectorAll("[data-kind] [data-k]").forEach((b) => {
      b.addEventListener("click", () => {
        this.state.netKind = b.dataset.k;
        this._renderTool("net");
      });
    });
    el.querySelectorAll("[data-topo] [data-t]").forEach((b) => {
      b.addEventListener("click", () => {
        this.state.netTopo = b.dataset.t;
        this._renderTool("net");
      });
    });
    const placeComponent = (c, x1, y1, x2, y2, kind, label) => {
      if (kind === "capacitor") c.capacitor(x1, y1, x2, y2, label);
      else c.resistor(x1, y1, x2, y2, label);
    };
    const drawSchematic = (labels) => {
      const unit = kind === "resistor" ? "Ω" : "F";
      const sym = kind === "resistor" ? "R" : "C";
      const N = Math.max(1, Math.min(8, labels.length || 2));
      const lbl = (i) =>
        labels[i] != null ? formatSI(labels[i], unit) : `${sym}${i + 1}`;
      let svg = "";
      if (topo === "series") {
        const cols = 3 + 3 * N + 1;
        const c = new Circuit(cols, 4);
        c.terminal(1, 2, "A", "left");
        c.wire(1, 2, 2, 2);
        let x = 2;
        for (let i = 0; i < N; i++) {
          placeComponent(c, x, 2, x + 3, 2, kind, lbl(i));
          x += 3;
        }
        c.wire(x, 2, x + 1, 2);
        c.terminal(x + 1, 2, "B", "right");
        svg = c.render();
      } else {
        const rows = 2 + 2 * N;
        const c = new Circuit(12, rows);
        c.terminal(1, 2, "A", "left");
        c.wire(1, 2, 3, 2);
        c.wire(9, 2, 11, 2);
        c.terminal(11, 2, "B", "right");
        c.wire(3, 2, 3, 2 + 2 * (N - 1));
        c.wire(9, 2, 9, 2 + 2 * (N - 1));
        for (let i = 0; i < N; i++) {
          const y = 2 + 2 * i;
          placeComponent(c, 3, y, 9, y, kind, lbl(i));
          if (i > 0 && i < N) {
            c.junction(3, y);
            c.junction(9, y);
          }
        }
        svg = c.render();
      }
      el.querySelector("[data-schematic]").innerHTML = svg;
    };
    drawSchematic([]);
    const go = () => {
      const raw = el.querySelector("[data-vals]").value;
      const parts = raw
        .split(/[,\s]+/)
        .map((s) => s.trim())
        .filter(Boolean);
      const values = parts.map(parseSI).filter((v) => isFinite(v) && v > 0);
      const unit = kind === "resistor" ? "Ω" : "F";
      const r = reduceNetwork(values, topo, kind);
      const result = el.querySelector("[data-result]");
      if (r == null || !values.length) {
        drawSchematic([]);
        result.innerHTML = `<span class="result-value warn">enter at least one value</span>`;
        return;
      }
      drawSchematic(values);
      result.innerHTML = `
        <div class="result-row"><span class="result-label">${values.length} ${kind}${values.length > 1 ? "s" : ""} in ${topo}</span><span class="result-value accent">${formatSI(r, unit)}</span></div>
        <div class="result-row"><span class="result-label">Individual</span><span class="result-value" style="font-size:0.85em">${values.map((v) => formatSI(v, unit)).join(" • ")}</span></div>
      `;
    };
    el.querySelector("[data-go]").addEventListener("click", go);
    el.querySelector("[data-vals]").addEventListener("input", go);
    el.querySelector("[data-vals]").addEventListener("keydown", (e) => {
      if (e.key === "Enter") go();
    });
  }

  // ============================================================
  // Tool: AWG
  // ============================================================
  _render_awg() {
    const el = this._wrap.querySelector('[data-tool="awg"]');
    el.innerHTML = `
      <div class="tool-title">AWG wire gauge</div>
      <div class="tool-sub">Enter a target current to highlight gauges that handle it. Enter a length to see total resistance per gauge.</div>

      <div class="row">
        <div class="field"><label>Highlight gauges ≥</label><input type="text" data-current placeholder="e.g. 5A" value="${this.state.awgHighlight}"></div>
        <div class="field"><label>Ampacity mode</label><select data-mode>
          <option value="chassis">chassis (~92 cmil/A)</option>
          <option value="power">power (NEC 310.16)</option>
        </select></div>
        <div class="field"><label>Length</label><input type="text" data-length placeholder="e.g. 10" value="${this.state.awgLength || ""}"></div>
        <div class="field"><label>Unit</label><select data-length-unit>
          <option value="m" ${this.state.awgLengthUnit === "m" ? "selected" : ""}>m</option>
          <option value="ft" ${this.state.awgLengthUnit === "ft" ? "selected" : ""}>ft</option>
        </select></div>
      </div>

      <div class="table-wrap">
        <table class="awg-table">
          <thead>
            <tr>
              <th>AWG</th>
              <th>Ø (mm)</th>
              <th>Ø (mil)</th>
              <th>Area (mm²)</th>
              <th>cmil</th>
              <th>Ω/m</th>
              <th>Ω/ft</th>
              <th>Chassis A</th>
              <th>Power A</th>
              <th data-total-col>Total Ω</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
      <div class="note">Copper, 20°C. Chassis = short bench runs in air. Power = NEC 310.16, 60°C insulation, conduit.</div>
    `;

    const GAUGES = [
      "0000",
      "000",
      "00",
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
      "23",
      "24",
      "25",
      "26",
      "27",
      "28",
      "29",
      "30",
      "32",
      "34",
      "36",
      "38",
      "40",
    ];
    const rows = GAUGES.map((g) => ({ gauge: g, info: awgInfo(g) }));

    const renderBody = () => {
      const cur = parseSI(el.querySelector("[data-current]").value);
      const mode = el.querySelector("[data-mode]").value;
      const lengthRaw = el.querySelector("[data-length]").value.trim();
      const unit = el.querySelector("[data-length-unit]").value;
      const lengthVal = lengthRaw ? parseFloat(lengthRaw) : NaN;
      const length_m =
        isFinite(lengthVal) && lengthVal > 0
          ? unit === "ft"
            ? lengthVal * 0.3048
            : lengthVal
          : NaN;
      el.querySelector("tbody").innerHTML = rows
        .map(({ gauge, info }) => {
          const ampVal = mode === "chassis" ? info.chassisA : info.powerA;
          const passes =
            isFinite(cur) && cur > 0 && ampVal != null && ampVal >= cur;
          const totalCell = isFinite(length_m)
            ? formatSI(info.ohmsPerM * length_m, "Ω")
            : "—";
          return `<tr class="${passes ? "passes" : ""}">
            <td>${gauge}</td>
            <td>${info.d_mm.toFixed(3)}</td>
            <td>${(info.d_mm / 0.0254).toFixed(2)}</td>
            <td>${info.area_mm2.toFixed(4)}</td>
            <td>${info.cmil.toFixed(0)}</td>
            <td>${formatSI(info.ohmsPerM, "")}</td>
            <td>${formatSI(info.ohmsPerFt, "")}</td>
            <td>${info.chassisA.toFixed(1)}</td>
            <td>${info.powerA != null ? info.powerA.toFixed(2) : "—"}</td>
            <td>${totalCell}</td>
          </tr>`;
        })
        .join("");
    };

    renderBody();
    el.querySelector("[data-current]").addEventListener("input", () => {
      this.state.awgHighlight = el.querySelector("[data-current]").value;
      renderBody();
    });
    el.querySelector("[data-length]").addEventListener("input", () => {
      this.state.awgLength = el.querySelector("[data-length]").value;
      renderBody();
    });
    el.querySelector("[data-length-unit]").addEventListener("change", () => {
      this.state.awgLengthUnit = el.querySelector("[data-length-unit]").value;
      renderBody();
    });
    el.querySelector("[data-mode]").addEventListener("change", renderBody);
  }

  // ============================================================
  // Tool: PCB trace width
  // ============================================================
  _render_trace() {
    const el = this._wrap.querySelector('[data-tool="trace"]');
    el.innerHTML = `
      <div class="tool-title">PCB trace width (IPC-2221A)</div>
      <div class="tool-sub">Minimum trace width for a given current, copper weight, temperature rise.</div>

      <div class="row">
        <div class="field"><label>Current (A)</label><input type="text" data-i value="1"></div>
        <div class="field"><label>Copper</label><select data-oz>
          <option value="0.5">0.5 oz</option>
          <option value="1" selected>1 oz</option>
          <option value="2">2 oz</option>
          <option value="3">3 oz</option>
        </select></div>
        <div class="field"><label>ΔT (°C)</label><input type="text" data-dt value="10"></div>
        <div class="field"><label>Layer</label><select data-layer>
          <option value="external">external</option>
          <option value="internal">internal</option>
        </select></div>
        <button class="btn primary" data-go>Compute</button>
      </div>

      <div class="result" data-result></div>
    `;
    const result = el.querySelector("[data-result]");
    const go = () => {
      const i = parseSI(el.querySelector("[data-i]").value);
      const oz = parseFloat(el.querySelector("[data-oz]").value);
      const dt = parseSI(el.querySelector("[data-dt]").value);
      const layer = el.querySelector("[data-layer]").value;
      if (!isFinite(i) || i <= 0 || !isFinite(dt) || dt <= 0) {
        result.innerHTML = `<span class="result-value warn">enter positive values</span>`;
        return;
      }
      const r = traceWidth(i, oz, dt, layer);
      result.innerHTML = `
        <div class="result-row"><span class="result-label">Minimum width</span><span class="result-value accent">${r.width_mm.toFixed(3)} mm (${r.width_mil.toFixed(1)} mil)</span></div>
        <div class="result-row"><span class="result-label">Cross-section</span><span class="result-value">${r.area_mil2.toFixed(2)} mil²</span></div>
        <div class="result-row"><span class="result-label">Copper thickness</span><span class="result-value">${r.thickness_mil.toFixed(3)} mil</span></div>
        <div class="note">IPC-2221A: I = k · ΔT^0.44 · A^0.725, k = 0.048 (external) / 0.024 (internal). Add margin for vias, bends, and ambient. The newer IPC-2152 typically allows narrower traces; this estimate is conservative.</div>
      `;
    };
    el.querySelector("[data-go]").addEventListener("click", go);
    el.querySelectorAll("input, select").forEach((inp) => {
      inp.addEventListener("input", go);
      inp.addEventListener("keydown", (e) => {
        if (e.key === "Enter") go();
      });
    });
    go();
  }
}

customElements.define("ee-calculator", EECalculator);
