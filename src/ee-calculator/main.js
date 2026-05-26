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

const RESISTOR_SVG = "__RESISTOR_SVG__";

// Fixed band slots A..F in the resistor SVG. The 4/5/6-band modes pick a
// subset of slots (slot indices are 0=A, 1=B, 2=C, 3=D, 4=E, 5=F).
const BAND_SLOTS = [
  { x: 82.61, y: 12.19, w: 10.02, h: 45.75 }, // A (left end, tall)
  { x: 111.94, y: 16.19, w: 10.5, h: 37.15 }, // B (inner)
  { x: 134.25, y: 16.19, w: 10.12, h: 37.75 }, // C (inner)
  { x: 155.78, y: 16.19, w: 10.5, h: 37.75 }, // D (inner)
  { x: 194.6, y: 16.19, w: 10.12, h: 37.75 }, // E (inner)
  { x: 229.65, y: 12.19, w: 9.86, h: 45.75 }, // F (right end, tall)
];
const BAND_SLOT_MAP = {
  4: [1, 2, 3, 5], // B, C, D, F
  5: [0, 1, 2, 3, 5], // A, B, C, D, F
  6: [0, 1, 2, 3, 4, 5], // all
};

// 8-pin DIP for the 555. Labels on pins.
const IC_555_SVG = "__IC_555_SVG__";

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
  SW: 1, // matches the default stroke-width inside the symbol SVGs
  FONT: 'ui-monospace, "Courier New", monospace',
  GRID: 20,
};

// Inlined <symbol> definitions for R/C/LED/GND, built from src/ee-calculator/symbols/.
const SYMBOL_DEFS = "__SYMBOL_DEFS__";

// Natural dimensions of each symbol in its own viewBox, with the anchor offset
// from its top-left corner. Used to position <use> references so the symbol's
// anchor lands exactly on the requested grid endpoint.
const SYM = {
  r: { id: "sym-r", w: 40, h: 10, ax: 0, ay: 5 }, // left anchor
  c: { id: "sym-c", w: 40, h: 20, ax: 0, ay: 10 },
  led: { id: "sym-led", w: 40, h: 35, ax: 0, ay: 25 },
  gnd: { id: "sym-gnd", w: 20, h: 25, ax: 10, ay: 0 }, // top anchor
};

// Replace `V_in` style underscore-suffix labels with proper SVG subscripts
// using <tspan>. Leaves other characters untouched.
function svgSubscript(label) {
  if (label == null) return "";
  return String(label).replace(
    /_([A-Za-z][A-Za-z0-9]*)/g,
    '<tspan baseline-shift="sub" font-size="0.72em">$1</tspan>',
  );
}

// HTML version of the same: turns `V_in` into `V<sub>in</sub>`. Used for
// form labels and result rows.
function htmlSubscript(label) {
  if (label == null) return "";
  return String(label).replace(/_([A-Za-z][A-Za-z0-9]*)/g, "<sub>$1</sub>");
}

class Circuit {
  constructor(cols, rows) {
    this.W = cols * CIRCUIT.GRID;
    this.H = rows * CIRCUIT.GRID;
    this.parts = [];
    this.overlay = []; // drawn last so terminals/junctions sit on top of wires
  }
  _p(x) {
    return x * CIRCUIT.GRID;
  }
  _push(s) {
    this.parts.push(s);
    return this;
  }
  _pushOverlay(s) {
    this.overlay.push(s);
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
    return this._pushOverlay(
      `<circle cx="${this._p(x)}" cy="${this._p(y)}" r="3" fill="${CIRCUIT.STROKE}"/>`,
    );
  }
  // Place a two-terminal horizontal/vertical symbol between (x1,y1) and
  // (x2,y2). Draws lead extensions when the requested span exceeds the
  // symbol's natural length. Label is positioned perpendicular to the symbol.
  _placeSymbol(sym, x1, y1, x2, y2, label) {
    const px1 = this._p(x1),
      py1 = this._p(y1),
      px2 = this._p(x2),
      py2 = this._p(y2);
    const horiz = Math.abs(px2 - px1) >= Math.abs(py2 - py1);
    if (horiz) {
      const cx = (px1 + px2) / 2;
      const cy = py1;
      const useX = cx - sym.w / 2;
      const useY = cy - sym.ay;
      this._push(
        `<use href="#${sym.id}" x="${useX}" y="${useY}" width="${sym.w}" height="${sym.h}"/>`,
      );
      const sign = Math.sign(px2 - px1) || 1;
      const leftEdge = cx - (sym.w / 2) * sign;
      const rightEdge = cx + (sym.w / 2) * sign;
      this._push(
        `<line x1="${px1}" y1="${py1}" x2="${leftEdge}" y2="${cy}" stroke="${CIRCUIT.STROKE}" stroke-width="${CIRCUIT.SW}" stroke-linecap="round"/>`,
      );
      this._push(
        `<line x1="${rightEdge}" y1="${cy}" x2="${px2}" y2="${py2}" stroke="${CIRCUIT.STROKE}" stroke-width="${CIRCUIT.SW}" stroke-linecap="round"/>`,
      );
      if (label) {
        const ly = cy - sym.ay - 6;
        this._push(
          `<text x="${cx}" y="${ly}" text-anchor="middle" font-family="${CIRCUIT.FONT}" font-size="12" fill="${CIRCUIT.STROKE}">${svgSubscript(label)}</text>`,
        );
      }
    } else {
      // Vertical orientation. Place the symbol so its anchor midpoint lands at
      // (cx, cy), then rotate 90° around that midpoint.
      const cx = px1;
      const cy = (py1 + py2) / 2;
      const useX = cx - sym.w / 2;
      const useY = cy - sym.ay;
      this._push(
        `<use href="#${sym.id}" x="${useX}" y="${useY}" width="${sym.w}" height="${sym.h}" transform="rotate(90 ${cx} ${cy})"/>`,
      );
      const sign = Math.sign(py2 - py1) || 1;
      const endA = cy - (sym.w / 2) * sign;
      const endB = cy + (sym.w / 2) * sign;
      this._push(
        `<line x1="${px1}" y1="${py1}" x2="${cx}" y2="${endA}" stroke="${CIRCUIT.STROKE}" stroke-width="${CIRCUIT.SW}" stroke-linecap="round"/>`,
      );
      this._push(
        `<line x1="${cx}" y1="${endB}" x2="${px2}" y2="${py2}" stroke="${CIRCUIT.STROKE}" stroke-width="${CIRCUIT.SW}" stroke-linecap="round"/>`,
      );
      if (label) {
        // After rotation, the symbol's body extends ±(sym.h - sym.ay) from cx
        // perpendicular to the lead axis. Place the label just past that.
        const lx = cx + (sym.h - sym.ay) + 6;
        this._push(
          `<text x="${lx}" y="${cy + 4}" font-family="${CIRCUIT.FONT}" font-size="12" fill="${CIRCUIT.STROKE}">${svgSubscript(label)}</text>`,
        );
      }
    }
    return this;
  }
  // Resistor between (x1,y1) and (x2,y2). Horizontal or vertical only.
  resistor(x1, y1, x2, y2, label) {
    return this._placeSymbol(SYM.r, x1, y1, x2, y2, label);
  }
  // Capacitor (non-polarized) between (x1,y1) and (x2,y2).
  capacitor(x1, y1, x2, y2, label) {
    return this._placeSymbol(SYM.c, x1, y1, x2, y2, label);
  }
  // LED. (x1,y1) is anode side, (x2,y2) is cathode side. Horizontal only.
  led(x1, y1, x2, y2) {
    return this._placeSymbol(SYM.led, x1, y1, x2, y2, null);
  }
  // Ground symbol with its top lead anchored at (x, y).
  ground(x, y) {
    const px = this._p(x);
    const py = this._p(y);
    const sym = SYM.gnd;
    this._push(
      `<use href="#${sym.id}" x="${px - sym.ax}" y="${py - sym.ay}" width="${sym.w}" height="${sym.h}"/>`,
    );
    return this;
  }
  // Labeled terminal (input/output node).
  terminal(x, y, label, side = "left") {
    const px = this._p(x),
      py = this._p(y);
    this._pushOverlay(
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
    this._pushOverlay(
      `<text x="${lx}" y="${ly}" text-anchor="${anchor}" font-family="${CIRCUIT.FONT}" font-size="13" fill="${CIRCUIT.STROKE}" font-weight="600">${svgSubscript(label)}</text>`,
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
    // Pad the viewBox so terminal labels at the edges don't get clipped.
    const padX = 28,
      padY = 8;
    return `<svg viewBox="${-padX} ${-padY} ${this.W + 2 * padX} ${this.H + 2 * padY}" xmlns="http://www.w3.org/2000/svg" class="circuit-svg"><defs>${SYMBOL_DEFS}</defs>${this.parts.join("")}${this.overlay.join("")}</svg>`;
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
  const p = formatSIParts(value, unit, precision);
  if (p.number === "—") return "—";
  return `${p.number} ${p.prefix}${p.unit}`.trim();
}

// Same as formatSI but returns the number, prefix, and unit separately so
// callers can lay them out in fixed-width columns.
function formatSIParts(value, unit = "", precision = 3) {
  if (value == null || !isFinite(value))
    return { number: "—", prefix: "", unit: "" };
  if (value === 0) return { number: "0", prefix: "", unit };
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
  if (str.includes(".") && !str.includes("e")) {
    str = str.replace(/\.?0+$/, "");
  }
  return { number: str, prefix: chosen.sym, unit };
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

const STYLE = "__STYLE_CSS__";

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
    id: "ac",
    label: "AC signals",
    tools: ["acamp", "acfreq", "acdbm"],
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
      eSeriesSeries: "E24",
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
      netVals: "",
      // AWG
      awgHighlight: "",
      awgLength: "",
      awgLengthUnit: "m",
      // AC tool state
      acZ: "50",
      // Trace
    };
  }

  connectedCallback() {
    this._build();
    this._render();
    this._decorateResults();
    this._decorateInputs();
    this._decorateNumberInputs();
    this._decorateLabels();
    this._observer = new MutationObserver(() => {
      this._decorateResults();
      this._decorateInputs();
      this._decorateNumberInputs();
      this._decorateLabels();
    });
    this._observer.observe(this._wrap, { childList: true, subtree: true });
  }

  disconnectedCallback() {
    this._observer?.disconnect();
  }

  // Walk every result line and add a copy button if it doesn't already have
  // one. Called by a MutationObserver so result tables that update outside
  // _render() (the per-tool go() functions writing innerHTML) get decorated
  // automatically.
  _decorateResults() {
    this._wrap.querySelectorAll(".result-row, .std-row").forEach((row) => {
      if (row.querySelector(".btn-copy")) return;
      const val = row.querySelector(".result-value, .std-value");
      if (!val) return;
      const btn = document.createElement("button");
      btn.className = "btn-copy";
      btn.type = "button";
      btn.textContent = "copy";
      btn.title = "Copy value";
      row.appendChild(btn);
    });
  }

  // Replace `V_in`-style labels with HTML subscripts inside labels, result
  // row labels, tool subtitles, and notes. Idempotent: once the underscore is
  // consumed into a <sub> tag, the textContent no longer matches.
  _decorateLabels() {
    this._wrap
      .querySelectorAll("label, .tool-sub, .result-label, .note")
      .forEach((el) => {
        if (!/_[A-Za-z]/.test(el.textContent)) return;
        el.innerHTML = el.textContent.replace(
          /_([A-Za-z][A-Za-z0-9]*)/g,
          "<sub>$1</sub>",
        );
      });
  }

  // Replace the native number-input spinner with custom themed up/down arrows.
  _decorateNumberInputs() {
    this._wrap.querySelectorAll('input[type="number"]').forEach((inp) => {
      const parent = inp.parentElement;
      if (!parent || parent.classList.contains("number-wrap")) return;
      const wrap = document.createElement("span");
      wrap.className = "number-wrap";
      parent.insertBefore(wrap, inp);
      wrap.appendChild(inp);
      const up = document.createElement("button");
      up.className = "number-step up";
      up.type = "button";
      up.tabIndex = -1;
      up.setAttribute("aria-label", "Increment");
      up.textContent = "▴";
      const down = document.createElement("button");
      down.className = "number-step down";
      down.type = "button";
      down.tabIndex = -1;
      down.setAttribute("aria-label", "Decrement");
      down.textContent = "▾";
      wrap.appendChild(up);
      wrap.appendChild(down);
    });
  }

  // Wrap every text input in a container with a clear (×) button.
  _decorateInputs() {
    this._wrap.querySelectorAll('input[type="text"]').forEach((inp) => {
      const parent = inp.parentElement;
      if (!parent || parent.classList.contains("input-wrap")) return;
      const wrap = document.createElement("span");
      wrap.className = "input-wrap";
      if (inp.value !== "") wrap.classList.add("has-value");
      parent.insertBefore(wrap, inp);
      wrap.appendChild(inp);
      const btn = document.createElement("button");
      btn.className = "input-clear";
      btn.type = "button";
      btn.tabIndex = -1;
      btn.setAttribute("aria-label", "Clear");
      btn.textContent = "×";
      wrap.appendChild(btn);
      inp.addEventListener("input", () => {
        wrap.classList.toggle("has-value", inp.value !== "");
      });
    });
  }

  _build() {
    const root = this.shadowRoot;
    const style = document.createElement("style");
    style.textContent = STYLE;
    root.appendChild(style);

    const wrap = document.createElement("div");
    wrap.className = "calc";

    // Click delegation: any .btn-copy in any result row copies the row's value.
    wrap.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-copy");
      if (!btn) return;
      const row = btn.closest(".result-row, .std-row");
      if (!row) return;
      const val = row.querySelector(".result-value, .std-value");
      if (!val) return;
      navigator.clipboard.writeText(val.textContent.trim()).then(() => {
        btn.textContent = "ok!";
        btn.classList.add("copied");
        setTimeout(() => {
          btn.textContent = "copy";
          btn.classList.remove("copied");
        }, 1000);
      });
    });

    // Click delegation: an input-clear (×) button empties its sibling input
    // and fires an "input" event so live-compute tools re-run.
    wrap.addEventListener("click", (e) => {
      const btn = e.target.closest(".input-clear");
      if (!btn) return;
      const inp = btn.parentElement?.querySelector("input");
      if (!inp) return;
      inp.value = "";
      inp.dispatchEvent(new Event("input", { bubbles: true }));
      inp.focus();
    });

    // Click delegation: themed number-input step buttons.
    wrap.addEventListener("click", (e) => {
      const btn = e.target.closest(".number-step");
      if (!btn) return;
      const inp = btn.parentElement?.querySelector('input[type="number"]');
      if (!inp) return;
      if (btn.classList.contains("up")) inp.stepUp();
      else inp.stepDown();
      inp.dispatchEvent(new Event("input", { bubbles: true }));
    });

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
      <div class="tool-sub">Click a band and pick a color, or type a value and get the band pattern.</div>

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
        <div class="band-pickers" data-pickers></div>
      </div>

      <div class="row" style="margin-top:0.85em">
        <div class="field field-grow">
          <label>Or enter a value</label>
          <input type="text" data-value-input placeholder="e.g. 4.7k, 220, 1M">
        </div>
      </div>
      <div class="note">Body color hints at construction: beige or tan for carbon-film (5%), blue or green for metal-film (1% or better), white ceramic for wirewound (high-power), and pink or salmon for fusible. The band code reads the same regardless.</div>
    `;

    // Fill the appropriate band slots for this band mode. Slot positions are
    // fixed in the SVG; BAND_SLOT_MAP picks which slots are used per mode.
    const svg = el.querySelector(".resistor-svg");
    const bandsG = svg.querySelector(".bands");
    bandsG.innerHTML = "";
    const slots = BAND_SLOT_MAP[bandMode] || BAND_SLOT_MAP[4];
    for (let i = 0; i < bandMode; i++) {
      const slot = BAND_SLOTS[slots[i]];
      const colorIdx = bands[i] ?? 0;
      const color = BAND_COLORS[colorIdx]?.hex || "#888";
      const r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      r.setAttribute("x", slot.x);
      r.setAttribute("y", slot.y);
      r.setAttribute("width", slot.w);
      r.setAttribute("height", slot.h);
      r.setAttribute("fill", color);
      r.setAttribute("stroke", "#8b6a3a");
      r.setAttribute("stroke-width", "1.2");
      r.setAttribute("data-band", i);
      r.addEventListener("click", () => this._pickBandForIndex(i));
      bandsG.appendChild(r);
    }

    // Band pickers.
    const pickers = el.querySelector("[data-pickers]");
    const labels = this._bandLabels(bandMode);
    const sigCount = bandMode === 4 ? 2 : 3;
    const bandKind = (i) => {
      if (i < sigCount) return "digit";
      if (i === sigCount) return "mult";
      if (i === sigCount + 1) return "tol";
      return "ppm";
    };
    const fmtMult = (m) => {
      if (m >= 1e9) return `${m / 1e9}G`;
      if (m >= 1e6) return `${m / 1e6}M`;
      if (m >= 1e3) return `${m / 1e3}k`;
      return `${m}`;
    };
    const annotate = (c, kind) => {
      if (kind === "digit") return c.digit != null ? c.digit : "";
      if (kind === "mult")
        return c.multiplier != null ? fmtMult(c.multiplier) : "";
      if (kind === "tol") return c.tolerance != null ? `${c.tolerance}` : "";
      if (kind === "ppm") return c.ppm != null ? `${c.ppm}` : "";
      return "";
    };
    pickers.innerHTML = "";
    // Use emoji color circles for the dot. Native <option> color styling
    // isn't honored consistently across browsers; emoji are font-rendered
    // by the OS and always show in their proper colors.
    const COLOR_DOT = {
      black: "⚫",
      brown: "🟤",
      red: "🔴",
      orange: "🟠",
      yellow: "🟡",
      green: "🟢",
      blue: "🔵",
      violet: "🟣",
      grey: "🔘",
      white: "⚪",
      gold: "🪙",
      silver: "💿",
    };
    for (let i = 0; i < bandMode; i++) {
      const kind = bandKind(i);
      const opts = this._bandOptionsFor(bandMode, i)
        .map((idx) => {
          const c = BAND_COLORS[idx];
          const ann = annotate(c, kind);
          const dot = COLOR_DOT[c.name] || "●";
          const text =
            ann !== "" ? `${ann} ${dot} ${c.name}` : `${dot} ${c.name}`;
          return `<option value="${idx}" ${bands[i] === idx ? "selected" : ""}>${text}</option>`;
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
      // Highlight the band rect that this picker controls when focused.
      sel.addEventListener("focus", () => {
        const i = sel.dataset.bandSelect;
        el.querySelectorAll(".bands rect").forEach((r) => {
          r.classList.toggle("active", r.dataset.band === i);
        });
      });
      sel.addEventListener("blur", () => {
        el.querySelectorAll(".bands rect").forEach((r) =>
          r.classList.remove("active"),
        );
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

    // Value → bands, live on input. Use a partial repaint so the text input
    // keeps focus while the user is typing.
    el.querySelector("[data-value-input]").addEventListener("input", () => {
      const input = el.querySelector("[data-value-input]");
      const v = parseSI(input.value);
      if (!isFinite(v) || v <= 0) return;
      const sc = bandMode === 4 ? 2 : 3;
      const res = valueToBands(v, sc);
      if (!res.ok) return;
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
      this._repaintColor();
    });

    this._renderColorReadout();
  }

  // Repaint bands + pickers + readout without re-rendering the whole tool.
  // Used by the live value-input handler so the text input doesn't get
  // destroyed (and focus lost) on every keystroke.
  _repaintColor() {
    const el = this._wrap.querySelector('[data-tool="color"]');
    if (!el) return;
    const bands = this.state.bands;
    el.querySelectorAll(".bands rect[data-band]").forEach((r) => {
      const i = parseInt(r.dataset.band);
      const colorIdx = bands[i] ?? 0;
      r.setAttribute("fill", BAND_COLORS[colorIdx]?.hex || "#888");
    });
    el.querySelectorAll("[data-band-select]").forEach((sel) => {
      const i = parseInt(sel.dataset.bandSelect);
      sel.value = String(bands[i] ?? 0);
    });
    this._renderColorReadout();
  }

  _renderColorReadout() {
    const el = this._wrap.querySelector('[data-tool="color"]');
    if (!el) return;
    const { bandMode, bands } = this.state;
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
      readout.innerHTML = `<span class="readout-num warn">invalid</span>`;
      return;
    }
    const parts = formatSIParts(r.value, "Ω");
    const tol = r.tolerance != null ? `±${r.tolerance}%` : "";
    const ppm =
      bandMode === 6 && r.ppm != null
        ? `<span class="readout-ppm">${r.ppm} ppm/°C</span>`
        : "";
    readout.innerHTML = `
      <span class="readout-num">${parts.number}</span>
      <span class="readout-unit">${parts.prefix}${parts.unit}</span>
      <span class="readout-tol">${tol}</span>
      ${ppm}
    `;
  }

  _bandLabels(mode) {
    if (mode === 4) return ["digit 1", "digit 2", "mult (×)", "tol (%)"];
    if (mode === 5)
      return ["digit 1", "digit 2", "digit 3", "mult (×)", "tol (%)"];
    return ["digit 1", "digit 2", "digit 3", "mult (×)", "tol (%)", "ppm/°C"];
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
      </div>

      <div class="result" data-result><div class="std-list" data-list></div></div>
      <div class="note">Each E-series is spaced geometrically by 10^(1/N) per decade, chosen so the tolerance bands of adjacent values just touch and the whole decade is covered with no gaps. E12 (10%) needs 12 values per decade; E96 (1%) needs 96. Any "in-between" value falls inside the tolerance of one of the standards, so there's no reason to manufacture it.</div>
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
      const tol = E_SERIES_TOL[series];
      list.innerHTML = matches
        .map((m, i) => {
          const err = m.error * 100;
          const errStr =
            Math.abs(err) < 0.005
              ? "exact"
              : `${err >= 0 ? "+" : ""}${err.toFixed(2)}%`;
          const parts = formatSIParts(m.value, "");
          // Build a vendor-friendly search string: e.g., "4.7k 1% resistor".
          const q = encodeURIComponent(
            `${parts.number}${parts.prefix} ${tol}% resistor`,
          );
          const mouserUrl = `https://www.mouser.com/c/passive-components/resistors/?q=${q}`;
          return `
          <div class="std-row">
            <span class="std-rank">#${i + 1}</span>
            <span class="std-value">${formatSI(m.value, "Ω")}</span>
            <span class="std-error ${Math.abs(err) < 0.005 ? "zero" : ""}">${errStr}</span>
            <a class="btn-vendor" href="${mouserUrl}" target="_blank" rel="noopener">Mouser</a>
          </div>`;
        })
        .join("");
    };
    el.querySelector("[data-target]").addEventListener("input", go);
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
      c.resistor(6, 4, 6, 6, r2Label || "R₂");
      c.wire(6, 6, 6, 6.8);
      c.ground(6, 6.8);
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
    el.querySelectorAll("input").forEach((inp) =>
      inp.addEventListener("input", go),
    );
    el.querySelectorAll("select").forEach((sel) =>
      sel.addEventListener("change", go),
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
        <div class="field"><label>V_in</label><input type="text" data-vsup value="5"></div>
        <div class="field"><label>V_f per LED</label><input type="text" data-vf value="2.0"></div>
        <div class="field"><label># LEDs</label><input type="number" data-n value="1" min="1" max="20" step="1"></div>
        <div class="field"><label>I_f <span class="unit">(mA)</span></label><input type="text" data-if value="20"></div>
        <div class="field"><label>Series</label><select data-series>${eSeriesOptions(this.state.ledSeries)}</select></div>
      </div>

      <div class="schematic grow" data-schematic></div>
      <div class="result" data-result></div>
    `;
    const drawSchematic = (n, rLabel) => {
      const cols = 7 + 2 * n;
      const c = new Circuit(cols, 5);
      c.terminal(1, 2, "V_in", "left");
      c.wire(1, 2, 2, 2);
      c.resistor(2, 2, 5, 2, rLabel || "R");
      let x = 5;
      for (let i = 0; i < n; i++) {
        c.led(x, 2, x + 2, 2);
        x += 2;
      }
      c.wire(x, 2, x + 1, 2, x + 1, 3.5);
      c.ground(x + 1, 3.5);
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
    el.querySelectorAll("input").forEach((inp) =>
      inp.addEventListener("input", go),
    );
    el.querySelectorAll("select").forEach((sel) =>
      sel.addEventListener("change", go),
    );
    go();
  }

  // ============================================================
  // Tool: AC sine amplitudes
  // ============================================================
  _render_acamp() {
    const el = this._wrap.querySelector('[data-tool="acamp"]');
    el.innerHTML = `
      <div class="tool-title">Sine amplitudes</div>
      <div class="tool-sub">Enter any one of V_peak, V_pk-pk, V_rms, V_avg. The others are derived assuming a pure sine wave.</div>

      <div class="row">
        <div class="field"><label>V_peak</label><input type="text" data-vp placeholder="e.g. 5"></div>
        <div class="field"><label>V_pk-pk</label><input type="text" data-vpp placeholder="e.g. 10"></div>
        <div class="field"><label>V_rms</label><input type="text" data-vrms placeholder="e.g. 3.54"></div>
        <div class="field"><label>V_avg</label><input type="text" data-vavg placeholder="e.g. 3.18"></div>
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
        vp: get("[data-vp]"),
        vpp: get("[data-vpp]"),
        vrms: get("[data-vrms]"),
        vavg: get("[data-vavg]"),
      };
      let vp = null;
      if (known.vp != null) vp = known.vp;
      else if (known.vpp != null) vp = known.vpp / 2;
      else if (known.vrms != null) vp = known.vrms * Math.SQRT2;
      else if (known.vavg != null) vp = (known.vavg * Math.PI) / 2;
      const result = el.querySelector("[data-result]");
      if (vp == null || !isFinite(vp)) {
        result.innerHTML = `<span class="result-value warn">enter one value</span>`;
        return;
      }
      const vpp = 2 * vp;
      const vrms = vp / Math.SQRT2;
      const vavg = (2 * vp) / Math.PI;
      const cls = (k) => (known[k] == null ? "accent" : "");
      result.innerHTML = `
        <div class="result-row"><span class="result-label">V_peak</span><span class="result-value ${cls("vp")}">${formatSI(vp, "V")}</span></div>
        <div class="result-row"><span class="result-label">V_pk-pk</span><span class="result-value ${cls("vpp")}">${formatSI(vpp, "V")}</span></div>
        <div class="result-row"><span class="result-label">V_rms</span><span class="result-value ${cls("vrms")}">${formatSI(vrms, "V")}</span></div>
        <div class="result-row"><span class="result-label">V_avg</span><span class="result-value ${cls("vavg")}">${formatSI(vavg, "V")}</span></div>
        <div class="note">V_rms = V_p / √2 ≈ 0.707·V_p. V_avg is the full-wave rectified mean = 2·V_p/π ≈ 0.637·V_p. The formulas apply only to pure sine waves; square or triangle waves use different factors.</div>
      `;
    };
    el.querySelectorAll("input").forEach((inp) =>
      inp.addEventListener("input", go),
    );
  }

  // ============================================================
  // Tool: AC frequency / period / ω
  // ============================================================
  _render_acfreq() {
    const el = this._wrap.querySelector('[data-tool="acfreq"]');
    el.innerHTML = `
      <div class="tool-title">Frequency, period, ω</div>
      <div class="tool-sub">Enter any one of f, T, ω. The other two are computed.</div>

      <div class="row">
        <div class="field"><label>f <span class="unit">(Hz)</span></label><input type="text" data-f placeholder="e.g. 1k"></div>
        <div class="field"><label>T <span class="unit">(s)</span></label><input type="text" data-t placeholder="e.g. 1m"></div>
        <div class="field"><label>ω <span class="unit">(rad/s)</span></label><input type="text" data-w placeholder="e.g. 6.28k"></div>
      </div>

      <div class="result" data-result></div>
    `;
    const go = () => {
      const get = (sel) => {
        const v = el.querySelector(sel).value.trim();
        if (v === "") return null;
        const n = parseSI(v);
        return isFinite(n) && n > 0 ? n : null;
      };
      const known = {
        f: get("[data-f]"),
        t: get("[data-t]"),
        w: get("[data-w]"),
      };
      let f = null;
      if (known.f != null) f = known.f;
      else if (known.t != null) f = 1 / known.t;
      else if (known.w != null) f = known.w / (2 * Math.PI);
      const result = el.querySelector("[data-result]");
      if (f == null || !isFinite(f)) {
        result.innerHTML = `<span class="result-value warn">enter one value</span>`;
        return;
      }
      const t = 1 / f;
      const w = 2 * Math.PI * f;
      const cls = (k) => (known[k] == null ? "accent" : "");
      result.innerHTML = `
        <div class="result-row"><span class="result-label">Frequency</span><span class="result-value ${cls("f")}">${formatSI(f, "Hz")}</span></div>
        <div class="result-row"><span class="result-label">Period</span><span class="result-value ${cls("t")}">${formatSI(t, "s")}</span></div>
        <div class="result-row"><span class="result-label">ω (angular)</span><span class="result-value ${cls("w")}">${formatSI(w, "rad/s")}</span></div>
      `;
    };
    el.querySelectorAll("input").forEach((inp) =>
      inp.addEventListener("input", go),
    );
  }

  // ============================================================
  // Tool: dBm / power / V_rms at a load impedance
  // ============================================================
  _render_acdbm() {
    const el = this._wrap.querySelector('[data-tool="acdbm"]');
    el.innerHTML = `
      <div class="tool-title">dBm, power, V_rms</div>
      <div class="tool-sub">Convert between dBm, absolute power, and V_rms across a load impedance.</div>

      <div class="row">
        <div class="field"><label><span class="unit">dBm</span></label><input type="text" data-dbm placeholder="e.g. 10"></div>
        <div class="field"><label>Power (W)</label><input type="text" data-p placeholder="e.g. 10m"></div>
        <div class="field"><label>V_rms</label><input type="text" data-vrms placeholder="e.g. 707m"></div>
        <div class="field"><label>Load Z (Ω)</label><select data-z>
          <option value="50" ${this.state.acZ === "50" ? "selected" : ""}>50 (RF)</option>
          <option value="75" ${this.state.acZ === "75" ? "selected" : ""}>75 (video)</option>
          <option value="600" ${this.state.acZ === "600" ? "selected" : ""}>600 (audio)</option>
          <option value="custom" ${this.state.acZ === "custom" ? "selected" : ""}>custom</option>
        </select></div>
        <div class="field" data-z-custom-wrap><label>Custom Z (Ω)</label><input type="text" data-z-custom placeholder="e.g. 100"></div>
      </div>

      <div class="result" data-result></div>
    `;
    const customWrap = el.querySelector("[data-z-custom-wrap]");
    const syncCustomVisibility = () => {
      customWrap.style.display =
        el.querySelector("[data-z]").value === "custom" ? "" : "none";
    };
    syncCustomVisibility();
    const getZ = () => {
      const sel = el.querySelector("[data-z]").value;
      if (sel === "custom") {
        const v = parseSI(el.querySelector("[data-z-custom]").value);
        return isFinite(v) && v > 0 ? v : NaN;
      }
      return parseFloat(sel);
    };
    const go = () => {
      const get = (sel) => {
        const v = el.querySelector(sel).value.trim();
        if (v === "") return null;
        const n = parseSI(v);
        return isFinite(n) ? n : null;
      };
      const z = getZ();
      const known = {
        dbm: get("[data-dbm]"),
        p: get("[data-p]"),
        vrms: get("[data-vrms]"),
      };
      let pW = null;
      if (known.dbm != null) pW = Math.pow(10, known.dbm / 10) / 1000;
      else if (known.p != null && known.p > 0) pW = known.p;
      else if (known.vrms != null && known.vrms > 0 && isFinite(z) && z > 0)
        pW = (known.vrms * known.vrms) / z;
      const result = el.querySelector("[data-result]");
      if (pW == null || !isFinite(pW) || pW <= 0) {
        result.innerHTML = `<span class="result-value warn">enter dBm, power, or V_rms</span>`;
        return;
      }
      const dbm = 10 * Math.log10(pW * 1000);
      const vrms = isFinite(z) && z > 0 ? Math.sqrt(pW * z) : null;
      const vp = vrms != null ? vrms * Math.SQRT2 : null;
      const vpp = vp != null ? 2 * vp : null;
      const cls = (k) => (known[k] == null ? "accent" : "");
      result.innerHTML = `
        <div class="result-row"><span class="result-label">dBm</span><span class="result-value ${cls("dbm")}">${dbm.toFixed(2)} dBm</span></div>
        <div class="result-row"><span class="result-label">Power</span><span class="result-value ${cls("p")}">${formatSI(pW, "W")}</span></div>
        <div class="result-row"><span class="result-label">V_rms @ ${isFinite(z) ? formatSI(z, "Ω") : "?"}</span><span class="result-value ${cls("vrms")}">${vrms != null ? formatSI(vrms, "V") : "—"}</span></div>
        <div class="result-row"><span class="result-label">V_peak</span><span class="result-value">${vp != null ? formatSI(vp, "V") : "—"}</span></div>
        <div class="result-row"><span class="result-label">V_pk-pk</span><span class="result-value">${vpp != null ? formatSI(vpp, "V") : "—"}</span></div>
      `;
    };
    el.querySelector("[data-z]").addEventListener("change", () => {
      this.state.acZ = el.querySelector("[data-z]").value;
      syncCustomVisibility();
      go();
    });
    el.querySelectorAll("input").forEach((inp) =>
      inp.addEventListener("input", go),
    );
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
    el.querySelectorAll("input").forEach((inp) =>
      inp.addEventListener("input", go),
    );
  }

  // ============================================================
  // Tool: RC cutoff
  // ============================================================
  _render_rc() {
    const el = this._wrap.querySelector('[data-tool="rc"]');
    el.innerHTML = `
      <div class="tool-title">RC cutoff frequency</div>
      <div class="tool-sub">Same math for both topologies. Output at -3 dB at F_c.</div>

      <div class="schematic-pair">
        <figure><figcaption>Low-pass</figcaption><div data-schematic-lp></div></figure>
        <figure><figcaption>High-pass</figcaption><div data-schematic-hp></div></figure>
      </div>

      <div class="row">
        <div class="field"><label>R</label><input type="text" data-r placeholder="e.g. 10k"></div>
        <div class="field"><label>C</label><input type="text" data-c placeholder="e.g. 100n"></div>
        <div class="field"><label>f_c <span class="unit">(Hz)</span></label><input type="text" data-fc placeholder="e.g. 1k"></div>
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
    el.querySelectorAll("input").forEach((inp) =>
      inp.addEventListener("input", go),
    );
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
      <div class="tool-sub">Astable: free-running oscillator. Monostable: one-shot pulse. See the <a href="https://en.wikipedia.org/wiki/555_timer_IC" target="_blank" rel="noopener">Wikipedia article on the 555</a> for the canonical application circuits and the internal block diagram.</div>

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
      body
        .querySelectorAll("input")
        .forEach((inp) => inp.addEventListener("input", go));
      go();
    } else if (mode === "astable" && dir === "rev") {
      body.innerHTML = `
        <div class="row">
          <div class="field"><label>Target f</label><input type="text" data-f value="1k"></div>
          <div class="field"><label>Duty (0.5–1)</label><input type="text" data-duty value="0.75"></div>
          <div class="field"><label>Pick C</label><input type="text" data-c value="100n"></div>
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
      body
        .querySelectorAll("input")
        .forEach((inp) => inp.addEventListener("input", go));
      go();
    } else if (mode === "monostable" && dir === "fwd") {
      body.innerHTML = `
        <div class="row">
          <div class="field"><label>R</label><input type="text" data-r value="100k"></div>
          <div class="field"><label>C</label><input type="text" data-c value="10u"></div>
        </div>`;
      const go = () => {
        const r = parseSI(body.querySelector("[data-r]").value);
        const c = parseSI(body.querySelector("[data-c]").value);
        const res = timer555Mono(r, c);
        result.innerHTML = `
          <div class="result-row"><span class="result-label">Pulse width</span><span class="result-value accent">${formatSI(res.t, "s")}</span></div>
          <div class="note">t = 1.1 · R · C</div>`;
      };
      body
        .querySelectorAll("input")
        .forEach((inp) => inp.addEventListener("input", go));
      go();
    } else {
      body.innerHTML = `
        <div class="row">
          <div class="field"><label>Target pulse</label><input type="text" data-t value="100m"></div>
          <div class="field"><label>Pick C</label><input type="text" data-c value="10u"></div>
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
      body
        .querySelectorAll("input")
        .forEach((inp) => inp.addEventListener("input", go));
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
          <input type="text" data-vals placeholder="e.g. 10k, 4.7k, 2.2k" value="${this.state.netVals || ""}">
        </div>
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
    const MAX_DIAGRAM = 8;
    const drawSchematic = (labels) => {
      const unit = kind === "resistor" ? "Ω" : "F";
      const sym = kind === "resistor" ? "R" : "C";
      const total = labels.length || 2;
      const N = Math.max(1, Math.min(MAX_DIAGRAM, total));
      const truncated = total > MAX_DIAGRAM;
      const lbl = (i) =>
        labels[i] != null ? formatSI(labels[i], unit) : `${sym}${i + 1}`;
      let svg = "";
      if (topo === "series") {
        // When truncated, draw a "..." stub before the right terminal.
        const cols = 3 + 3 * N + (truncated ? 3 : 0) + 1;
        const c = new Circuit(cols, 4);
        c.terminal(1, 2, "A", "left");
        c.wire(1, 2, 2, 2);
        let x = 2;
        for (let i = 0; i < N; i++) {
          placeComponent(c, x, 2, x + 3, 2, kind, lbl(i));
          x += 3;
        }
        if (truncated) {
          c.wire(x, 2, x + 3, 2);
          c.text(x + 1.5, 1.4, `… +${total - N}`, {
            anchor: "middle",
            size: 11,
          });
          x += 3;
        }
        c.wire(x, 2, x + 1, 2);
        c.terminal(x + 1, 2, "B", "right");
        svg = c.render();
      } else {
        const rows = 2 + 2 * N + (truncated ? 2 : 0);
        const c = new Circuit(12, rows);
        c.terminal(1, 2, "A", "left");
        c.wire(1, 2, 3, 2);
        c.wire(9, 2, 11, 2);
        c.terminal(11, 2, "B", "right");
        const lastBranchY = 2 + 2 * (N - 1);
        c.wire(3, 2, 3, lastBranchY);
        c.wire(9, 2, 9, lastBranchY);
        for (let i = 0; i < N; i++) {
          const y = 2 + 2 * i;
          placeComponent(c, 3, y, 9, y, kind, lbl(i));
          if (i > 0 && i < N) {
            c.junction(3, y);
            c.junction(9, y);
          }
        }
        if (truncated) {
          // Extend both rails one more step and annotate with "+K more".
          const dotsY = lastBranchY + 2;
          c.wire(3, lastBranchY, 3, dotsY);
          c.wire(9, lastBranchY, 9, dotsY);
          c.text(6, dotsY - 0.1, "⋮", { anchor: "middle", size: 18 });
          c.text(11, dotsY + 0.2, `+${total - N} more`, {
            anchor: "start",
            size: 11,
          });
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
    el.querySelector("[data-vals]").addEventListener("input", () => {
      this.state.netVals = el.querySelector("[data-vals]").value;
      go();
    });
    if (this.state.netVals) go();
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
    el.querySelectorAll("input").forEach((inp) =>
      inp.addEventListener("input", go),
    );
    el.querySelectorAll("select").forEach((sel) =>
      sel.addEventListener("change", go),
    );
    go();
  }
}

customElements.define("ee-calculator", EECalculator);
