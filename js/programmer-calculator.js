// ============================================================
// 0xDEADBEEF: A Calculator for Programmers
// A browser-based calculator for engineers working with
// binary, octal, decimal, and hexadecimal numbers.
// Zero dependencies. Single file. Works forever.
// Author: Carlos Asmat, https://asmat.ca
// ============================================================

// ---- CalcEngine: pure computation, no DOM ----

class CalcEngine {
  constructor() {
    this.bitWidth = 32;
    this.signed = false;
    this.value = 0n;
    this.history = [];
  }

  clamp(v) {
    return this.signed
      ? BigInt.asIntN(this.bitWidth, v)
      : BigInt.asUintN(this.bitWidth, v);
  }

  mask() {
    return (1n << BigInt(this.bitWidth)) - 1n;
  }

  // ---- Arithmetic ----
  add(a, b) {
    return this.clamp(a + b);
  }
  sub(a, b) {
    return this.clamp(a - b);
  }
  mul(a, b) {
    return this.clamp(a * b);
  }
  div(a, b) {
    if (b === 0n) return 0n;
    return this.clamp(a / b);
  }
  mod(a, b) {
    if (b === 0n) return 0n;
    return this.clamp(a % b);
  }

  // ---- Bitwise ----
  and(a, b) {
    return this.clamp(a & b);
  }
  or(a, b) {
    return this.clamp(a | b);
  }
  xor(a, b) {
    return this.clamp(a ^ b);
  }
  not(a) {
    return this.clamp(~a);
  }

  // ---- Shifts ----
  lsh(a, b) {
    return this.clamp(a << b);
  }
  rsh(a, b) {
    // Logical right shift: treat as unsigned, shift, then re-clamp
    const unsigned = BigInt.asUintN(this.bitWidth, a);
    return this.clamp(unsigned >> b);
  }
  ashr(a, b) {
    // Arithmetic right shift: treat as signed, shift
    const signed = BigInt.asIntN(this.bitWidth, a);
    return this.clamp(signed >> b);
  }

  // ---- Rotates ----
  rol(a, b) {
    const w = BigInt(this.bitWidth);
    const shift = ((b % w) + w) % w;
    const unsigned = BigInt.asUintN(this.bitWidth, a);
    return this.clamp((unsigned << shift) | (unsigned >> (w - shift)));
  }
  ror(a, b) {
    const w = BigInt(this.bitWidth);
    const shift = ((b % w) + w) % w;
    const unsigned = BigInt.asUintN(this.bitWidth, a);
    return this.clamp((unsigned >> shift) | (unsigned << (w - shift)));
  }

  // ---- Byte operations ----
  byteSwap(a) {
    const unsigned = BigInt.asUintN(this.bitWidth, a);
    const bytes = this.bitWidth / 8;
    let result = 0n;
    for (let i = 0; i < bytes; i++) {
      const byte = (unsigned >> BigInt(i * 8)) & 0xffn;
      result |= byte << BigInt((bytes - 1 - i) * 8);
    }
    return this.clamp(result);
  }

  bitReverse(a) {
    const unsigned = BigInt.asUintN(this.bitWidth, a);
    let result = 0n;
    for (let i = 0; i < this.bitWidth; i++) {
      if (unsigned & (1n << BigInt(i))) {
        result |= 1n << BigInt(this.bitWidth - 1 - i);
      }
    }
    return this.clamp(result);
  }

  nibbleSwap(a) {
    // Swap nibbles within each byte
    const unsigned = BigInt.asUintN(this.bitWidth, a);
    let result = 0n;
    const bytes = this.bitWidth / 8;
    for (let i = 0; i < bytes; i++) {
      const byte = (unsigned >> BigInt(i * 8)) & 0xffn;
      const swapped = ((byte & 0xf0n) >> 4n) | ((byte & 0x0fn) << 4n);
      result |= swapped << BigInt(i * 8);
    }
    return this.clamp(result);
  }

  // ---- Bit manipulation ----
  getBit(n) {
    const unsigned = BigInt.asUintN(this.bitWidth, this.value);
    return (unsigned >> BigInt(n)) & 1n ? 1 : 0;
  }

  toggleBit(n) {
    const unsigned = BigInt.asUintN(this.bitWidth, this.value);
    this.value = this.clamp(unsigned ^ (1n << BigInt(n)));
  }

  // ---- Formatting ----
  toHex() {
    const unsigned = BigInt.asUintN(this.bitWidth, this.value);
    const digits = this.bitWidth / 4;
    const hex = unsigned.toString(16).toUpperCase().padStart(digits, "0");
    return hex.replace(/(.{4})/g, "$1 ").trim();
  }

  toDec() {
    return this.value.toString(10);
  }

  toOct() {
    const unsigned = BigInt.asUintN(this.bitWidth, this.value);
    return unsigned.toString(8);
  }

  toBin() {
    const unsigned = BigInt.asUintN(this.bitWidth, this.value);
    const bin = unsigned.toString(2).padStart(this.bitWidth, "0");
    return bin.replace(/(.{4})/g, "$1 ").trim();
  }

  toRawHex() {
    const unsigned = BigInt.asUintN(this.bitWidth, this.value);
    return "0x" + unsigned.toString(16).toUpperCase();
  }

  toRawBin() {
    const unsigned = BigInt.asUintN(this.bitWidth, this.value);
    return "0b" + unsigned.toString(2);
  }

  // ---- Endianness ----
  toEndianBytes(littleEndian) {
    const unsigned = BigInt.asUintN(this.bitWidth, this.value);
    const bytes = [];
    for (let i = 0; i < this.bitWidth / 8; i++) {
      bytes.push(Number((unsigned >> BigInt(i * 8)) & 0xffn));
    }
    if (!littleEndian) bytes.reverse();
    return bytes;
  }

  toAscii() {
    const bytes = this.toEndianBytes(false);
    return bytes
      .map((b) => (b >= 32 && b < 127 ? String.fromCharCode(b) : "."))
      .join(" ");
  }

  // ---- IEEE 754 ----
  toFloat32Parts() {
    if (this.bitWidth < 32) return null;
    const unsigned = BigInt.asUintN(32, this.value);
    const bits = Number(unsigned);
    const buf = new ArrayBuffer(4);
    new DataView(buf).setUint32(0, bits);
    const float = new DataView(buf).getFloat32(0);
    const sign = (bits >>> 31) & 1;
    const exponent = (bits >>> 23) & 0xff;
    const mantissa = bits & 0x7fffff;
    return { sign, exponent, mantissa, float, bits };
  }

  toFloat64Parts() {
    if (this.bitWidth < 64) return null;
    const unsigned = BigInt.asUintN(64, this.value);
    const buf = new ArrayBuffer(8);
    const view = new DataView(buf);
    view.setUint32(0, Number(unsigned >> 32n));
    view.setUint32(4, Number(unsigned & 0xffffffffn));
    const float = view.getFloat64(0);
    const hi = Number(unsigned >> 32n);
    const sign = (hi >>> 31) & 1;
    const exponent = (hi >>> 20) & 0x7ff;
    const mantissa = Number(unsigned & 0xfffffffffffffn);
    return { sign, exponent, mantissa, float };
  }

  // ---- Bitmask ----
  generateMask(fromBit, toBit) {
    const lo = Math.min(fromBit, toBit);
    const hi = Math.max(fromBit, toBit);
    let mask = 0n;
    for (let i = lo; i <= hi; i++) {
      mask |= 1n << BigInt(i);
    }
    return this.clamp(mask);
  }

  // ---- Expression Parser (Pratt) ----
  tokenize(expr) {
    const tokens = [];
    let i = 0;
    while (i < expr.length) {
      if (/\s/.test(expr[i])) {
        i++;
        continue;
      }
      // Numbers: hex 0x, binary 0b, octal 0o, decimal
      if (/[0-9]/.test(expr[i])) {
        let num = "";
        if (expr[i] === "0" && i + 1 < expr.length) {
          const next = expr[i + 1].toLowerCase();
          if (next === "x") {
            i += 2;
            while (i < expr.length && /[0-9a-fA-F_]/.test(expr[i]))
              num += expr[i++];
            tokens.push({
              type: "NUM",
              value: BigInt("0x" + num.replace(/_/g, "")),
            });
            continue;
          }
          if (next === "b") {
            i += 2;
            while (i < expr.length && /[01_]/.test(expr[i])) num += expr[i++];
            tokens.push({
              type: "NUM",
              value: BigInt("0b" + num.replace(/_/g, "")),
            });
            continue;
          }
          if (next === "o") {
            i += 2;
            while (i < expr.length && /[0-7_]/.test(expr[i])) num += expr[i++];
            tokens.push({
              type: "NUM",
              value: BigInt("0o" + num.replace(/_/g, "")),
            });
            continue;
          }
        }
        while (i < expr.length && /[0-9_]/.test(expr[i])) num += expr[i++];
        tokens.push({ type: "NUM", value: BigInt(num.replace(/_/g, "")) });
        continue;
      }
      // Hex digits when not starting a number (A-F)
      if (/[a-fA-F]/.test(expr[i])) {
        let hex = "";
        while (i < expr.length && /[0-9a-fA-F_]/.test(expr[i]))
          hex += expr[i++];
        // Interpret as hex
        tokens.push({
          type: "NUM",
          value: BigInt("0x" + hex.replace(/_/g, "")),
        });
        continue;
      }
      // Two-char operators
      if (expr.substring(i, i + 2) === "<<") {
        tokens.push({ type: "OP", value: "<<" });
        i += 2;
        continue;
      }
      if (expr.substring(i, i + 3) === ">>>") {
        tokens.push({ type: "OP", value: ">>>" });
        i += 3;
        continue;
      }
      if (expr.substring(i, i + 2) === ">>") {
        tokens.push({ type: "OP", value: ">>" });
        i += 2;
        continue;
      }
      // Single-char operators and parens
      if ("+-*/%&|^~()".includes(expr[i])) {
        tokens.push({
          type: expr[i] === "(" || expr[i] === ")" ? expr[i] : "OP",
          value: expr[i],
        });
        i++;
        continue;
      }
      i++; // skip unknown
    }
    return tokens;
  }

  parse(tokens) {
    let pos = 0;

    const peek = () => tokens[pos] || null;
    const advance = () => tokens[pos++];

    const prefixPrec = { "~": 90, "-": 90, "+": 90 };
    const infixPrec = {
      "|": 10,
      "^": 20,
      "&": 30,
      "<<": 40,
      ">>": 40,
      ">>>": 40,
      "+": 50,
      "-": 50,
      "*": 60,
      "/": 60,
      "%": 60,
    };

    const parseExpr = (minPrec) => {
      let t = advance();
      let left;

      if (!t) return 0n;

      if (t.type === "NUM") {
        left = t.value;
      } else if (t.type === "(") {
        left = parseExpr(0);
        if (peek()?.type === ")") advance();
      } else if (t.type === "OP" && t.value in prefixPrec) {
        const operand = parseExpr(prefixPrec[t.value]);
        if (t.value === "~") left = this.not(operand);
        else if (t.value === "-") left = this.clamp(-operand);
        else left = operand;
      } else {
        return 0n;
      }

      while (
        peek()?.type === "OP" &&
        (infixPrec[peek().value] || 0) > minPrec
      ) {
        const op = advance();
        const prec = infixPrec[op.value];
        const right = parseExpr(prec);

        switch (op.value) {
          case "+":
            left = this.add(left, right);
            break;
          case "-":
            left = this.sub(left, right);
            break;
          case "*":
            left = this.mul(left, right);
            break;
          case "/":
            left = this.div(left, right);
            break;
          case "%":
            left = this.mod(left, right);
            break;
          case "&":
            left = this.and(left, right);
            break;
          case "|":
            left = this.or(left, right);
            break;
          case "^":
            left = this.xor(left, right);
            break;
          case "<<":
            left = this.lsh(left, right);
            break;
          case ">>":
            left = this.ashr(left, right);
            break;
          case ">>>":
            left = this.rsh(left, right);
            break;
        }
      }
      return left;
    };

    return parseExpr(0);
  }

  // ---- Float to bits ----
  floatToBits(f) {
    const buf = new ArrayBuffer(8);
    const view = new DataView(buf);
    if (this.bitWidth <= 32) {
      view.setFloat32(0, f);
      return BigInt(view.getUint32(0));
    }
    view.setFloat64(0, f);
    const hi = BigInt(view.getUint32(0)) << 32n;
    const lo = BigInt(view.getUint32(4));
    return hi | lo;
  }

  evaluate(expr) {
    // Float literal: contains a dot or scientific notation (e.g. 3.14, 1e-5)
    const trimmed = expr.trim();
    if (
      /^-?(\d+\.\d*|\d*\.\d+)([eE][+-]?\d+)?$/.test(trimmed) ||
      /^-?\d+[eE][+-]?\d+$/.test(trimmed)
    ) {
      const f = parseFloat(trimmed);
      if (!isNaN(f)) return this.clamp(this.floatToBits(f));
    }

    const tokens = this.tokenize(trimmed);
    if (tokens.length === 0) return this.value;
    const result = this.parse(tokens);
    return this.clamp(result);
  }
}

// ---- ProgrammerCalculator: Custom Element ----

const STYLE = `
@font-face {
  font-family: 'Hack';
  src: url('/font/Hack-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

:host {
  display: block;
  font-family: 'Hack', 'Courier New', monospace;
  font-size: 14px;
  color: #e8e8e8;
  --bg: #0f1923;
  --surface: #162133;
  --surface2: #1c2b3f;
  --border: #2a3f5a;
  --text: #e8e8e8;
  --text-dim: #8899aa;
  --accent: #fd7e14;
  --blue: #4dabf7;
  --teal: #38d9a9;
  --crimson: #ff6b8a;
  --bit-on: #fd7e14;
  --bit-off: #1c2b3f;
  --bit-hover: #253a54;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

.calc {
  background: var(--bg);
  border-radius: 8px;
  padding: 1em;
  max-width: 52em;
  box-shadow: 0em 0.25em 0.3em rgba(0, 0, 0, 0.3);
}

/* -- Expression input -- */
.expr-row {
  display: flex;
  gap: 0.5em;
  margin-bottom: 1em;
}
.expr-input {
  flex: 1;
  font-family: inherit;
  font-size: 1.15em;
  padding: 0.5em 0.75em;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 4px;
  color: var(--text);
  outline: none;
}
.expr-input:focus { border-color: var(--accent); }
.expr-input::placeholder { color: var(--text-dim); }
.btn-eval {
  font-family: inherit;
  font-size: 1.15em;
  padding: 0.5em 1em;
  background: var(--accent);
  color: #000;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}
.btn-eval:hover { opacity: 0.85; }

/* -- Base displays -- */
.bases {
  display: grid;
  grid-template-columns: 3.5em 1fr auto;
  gap: 0.25em 0.75em;
  margin-bottom: 1em;
  align-items: center;
}
.base-label {
  color: var(--text-dim);
  font-size: 0.85em;
  text-align: right;
}
.base-value {
  font-size: 1.05em;
  word-break: break-all;
  letter-spacing: 0.05em;
  padding: 0.2em 0;
  cursor: text;
  user-select: all;
}
.base-value.hex { color: var(--blue); }
.base-value.dec { color: var(--text); }
.base-value.oct { color: var(--teal); }
.base-value.bin { color: var(--accent); width: 26em;}
.btn-copy {
  font-family: inherit;
  font-size: 0.75em;
  padding: 0.2em 0.7em;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 3px;
  color: var(--text-dim);
  cursor: pointer;
}
.btn-copy:hover { border-color: var(--accent); color: var(--accent); }
.btn-copy.copied { color: var(--teal); border-color: var(--teal); }

/* -- Controls -- */
.controls {
  display: flex;
  gap: 0.5em;
  margin-bottom: 1em;
  flex-wrap: wrap;
  align-items: center;
}
.control-group {
  display: flex;
  gap: 0;
}
.control-group .btn {
  font-family: inherit;
  font-size: 0.85em;
  padding: 0.35em 0.75em;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text-dim);
  cursor: pointer;
}
.control-group .btn:first-child { border-radius: 4px 0 0 4px; }
.control-group .btn:last-child { border-radius: 0 4px 4px 0; }
.control-group .btn:not(:first-child) { border-left: none; }
.control-group .btn.active {
  background: var(--accent);
  color: #000;
  border-color: var(--accent);
  font-weight: bold;
}
.control-group .btn:hover:not(.active) { background: var(--bit-hover); }
.controls-spacer { flex: 1; }

/* -- Bit grid -- */
.bit-grid-container { margin-bottom: 1em; overflow-x: auto; }
.bit-row {
  display: flex;
  justify-content: flex-end;
}
.bit-row + .bit-row { margin-top: 0.6em; }
.bit-row-indices {
  display: flex;
  justify-content: flex-end;
  margin-top: 2px;
}
.bit-row-indices + .bit-row { margin-top: 0.8em; }
.byte-group {
  display: flex;
  gap: 1px;
  margin-left: 14px;
}
.byte-group:first-child { margin-left: 0; }
.nibble-group {
  display: flex;
  gap: 1px;
  margin-left: 6px;
}
.nibble-group:first-child { margin-left: 0; }
.bit-cell {
  width: 1.5em;
  height: 1.8em;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bit-off);
  border: 1px solid var(--border);
  border-radius: 2px;
  cursor: pointer;
  font-size: 0.9em;
  color: var(--text-dim);
  transition: background 0.1s;
  user-select: none;
}
.bit-cell:hover { background: var(--bit-hover); }
.bit-cell.on {
  background: var(--bit-on);
  color: #000;
  font-weight: bold;
  border-color: var(--bit-on);
}
.bit-row-indices .byte-group { margin-left: 14px; }

.bit-row-indices .nibble-group { margin-left: 6px; }
.bit-row-indices .nibble-group:first-child { margin-left: 0; }
.bit-idx {
  width: 2.25em;
  text-align: center;
  font-size: 0.6em;
  border: 1px solid transparent;
  color: var(--text-dim);
}

/* -- Panels -- */
.panel {
  border: 1px solid var(--border);
  border-radius: 4px;
  margin-bottom: 0.5em;
  overflow: hidden;
}
.panel-header {
  display: flex;
  align-items: center;
  padding: 0.4em 0.75em;
  background: var(--surface);
  cursor: pointer;
  user-select: none;
  font-size: 0.85em;
  color: var(--text-dim);
  gap: 0.5em;
}
.panel-header:hover { background: var(--surface2); }
.panel-arrow {
  font-size: 0.7em;
  transition: transform 0.15s;
}
.panel.open .panel-arrow { transform: rotate(90deg); }
.panel-body {
  display: none;
  padding: 0.75em;
  background: var(--bg);
}
.panel.open .panel-body { display: block; }

/* -- Operations panel -- */
.ops-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3em;
}
.ops-group-label {
  font-size: 0.75em;
  color: var(--text-dim);
  width: 100%;
  margin-top: 0.3em;
}
.ops-group-label:first-child { margin-top: 0; }
.btn-op {
  font-family: inherit;
  font-size: 0.85em;
  padding: 0.35em 0.7em;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 3px;
  color: var(--text);
  cursor: pointer;
}
.btn-op:hover { border-color: var(--accent); color: var(--accent); }

/* -- IEEE 754 panel -- */
.ieee-row {
  display: flex;
  gap: 2px;
  margin-bottom: 0.5em;
  font-size: 0.9em;
}
.ieee-bit {
  width: 1.4em;
  height: 1.6em;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  font-size: 0.85em;
}
.ieee-sign { background: var(--crimson); color: #fff; }
.ieee-exp { background: var(--blue); color: #000; }
.ieee-mantissa { background: var(--teal); color: #000; }
.ieee-label {
  font-size: 0.8em;
  color: var(--text-dim);
  margin-bottom: 0.25em;
}
.ieee-result {
  font-size: 1.1em;
  color: var(--text);
  margin-top: 0.25em;
}
.ieee-legend {
  display: flex;
  gap: 1em;
  font-size: 0.75em;
  color: var(--text-dim);
  margin-top: 0.5em;
}
.ieee-legend-swatch {
  display: inline-block;
  width: 0.8em;
  height: 0.8em;
  border-radius: 2px;
  vertical-align: middle;
  margin-right: 0.25em;
}

/* -- Byte view panel -- */
.byte-view-row {
  display: flex;
  gap: 0.5em;
  align-items: baseline;
  margin-bottom: 0.3em;
  font-size: 0.9em;
}
.byte-view-label {
  color: var(--text-dim);
  min-width: 3em;
  font-size: 0.8em;
}
.byte-view-value {
  letter-spacing: 0.1em;
}

/* -- Bitmask panel -- */
.mask-row {
  display: flex;
  gap: 0.5em;
  align-items: center;
  font-size: 0.9em;
  flex-wrap: wrap;
}
.mask-input {
  font-family: inherit;
  font-size: 1em;
  width: 3.5em;
  padding: 0.25em 0.5em;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 3px;
  color: var(--text);
  text-align: center;
}
.mask-input:focus { border-color: var(--accent); outline: none; }
.mask-result {
  color: var(--blue);
  margin-left: 0.5em;
}

/* -- History panel -- */
.history-list {
  max-height: 10em;
  overflow-y: auto;
  font-size: 0.85em;
}
.history-item {
  padding: 0.2em 0;
  color: var(--text-dim);
  cursor: pointer;
}
.history-item:hover { color: var(--accent); }
.history-item .hist-result { color: var(--blue); }
.history-empty { color: var(--text-dim); font-style: italic; }

/* -- Branding -- */
.calc-footer {
  text-align: right;
  font-size: 0.7em;
  color: var(--text-dim);
  margin-top: 0.75em;
  opacity: 0.6;
}
.calc-footer a {
  color: var(--text-dim);
  text-decoration: none;
}
.calc-footer a:hover { color: var(--accent); }

/* -- Responsive -- */
@media (max-width: 40em) {
  .calc { padding: 0.75em; font-size: 12px; }
  .expr-input::placeholder { font-size: 0.8em; }
  .bit-cell { width: 1.7em; height: 1.9em; font-size: 0.85em; }
  .bit-idx { width: 2.88em; font-size: 0.5em; }
  .byte-group { margin-left: 8px; }
  .nibble-group { margin-left: 4px; }
  .bit-row-indices .byte-group { margin-left: 6px; }
  .bit-row-indices .nibble-group { margin-left: 4px; }
  .base-value.bin {width: 13em;}
}
`;

class ProgrammerCalculator extends HTMLElement {
  constructor() {
    super();
    this.engine = new CalcEngine();
    this.attachShadow({ mode: "open" });
    this._buildDOM();
  }

  connectedCallback() {
    this._wireEvents();
    this._render();
    this._resizeObserver = new ResizeObserver(() => this._renderBitGrid());
    this._resizeObserver.observe(this._calc);
  }

  disconnectedCallback() {
    this._resizeObserver?.disconnect();
  }

  _buildDOM() {
    const root = this.shadowRoot;

    const style = document.createElement("style");
    style.textContent = STYLE;
    root.appendChild(style);

    const calc = document.createElement("div");
    calc.className = "calc";
    calc.innerHTML = `
      <!-- Expression input -->
      <div class="expr-row">
        <input class="expr-input" type="text" placeholder="e.g. (0xDEAD << 16) | 0xBEEF or 3.14" spellcheck="false" autocomplete="off">
        <button class="btn-eval">=</button>
      </div>

      <!-- Base displays -->
      <div class="bases">
        <span class="base-label">HEX</span>
        <span class="base-value hex" data-base="hex"></span>
        <button class="btn-copy" data-copy="hex">copy</button>

        <span class="base-label">DEC</span>
        <span class="base-value dec" data-base="dec"></span>
        <button class="btn-copy" data-copy="dec">copy</button>

        <span class="base-label">OCT</span>
        <span class="base-value oct" data-base="oct"></span>
        <button class="btn-copy" data-copy="oct">copy</button>

        <span class="base-label">BIN</span>
        <span class="base-value bin" data-base="bin"></span>
        <button class="btn-copy" data-copy="bin">copy</button>
      </div>

      <!-- Controls -->
      <div class="controls">
        <div class="control-group" data-control="width">
          <button class="btn" data-width="8">8</button>
          <button class="btn" data-width="16">16</button>
          <button class="btn active" data-width="32">32</button>
          <button class="btn" data-width="64">64</button>
        </div>
        <div class="controls-spacer"></div>
        <div class="control-group" data-control="sign">
          <button class="btn active" data-sign="unsigned">Unsigned</button>
          <button class="btn" data-sign="signed">Signed</button>
        </div>
      </div>

      <!-- Bit grid -->
      <div class="bit-grid-container"></div>

      <!-- Panels -->
      <div class="panel open" data-panel="ops">
        <div class="panel-header"><span class="panel-arrow">&#9654;</span> Operations</div>
        <div class="panel-body">
          <div class="ops-grid">
            <div class="ops-group-label">Bitwise</div>
            <button class="btn-op" data-op="and">AND</button>
            <button class="btn-op" data-op="or">OR</button>
            <button class="btn-op" data-op="xor">XOR</button>
            <button class="btn-op" data-op="not">NOT</button>
            <div class="ops-group-label">Shift / Rotate</div>
            <button class="btn-op" data-op="lsh" title="Left Shift — shifts all bits left, fills with 0 (value << n)">Lsh</button>
            <button class="btn-op" data-op="rsh" title="Logical Right Shift — shifts bits right, fills with 0 (value >>> n)">Rsh</button>
            <button class="btn-op" data-op="ashr" title="Arithmetic Right Shift — shifts bits right, preserves sign bit (value >> n)">AShr</button>
            <button class="btn-op" data-op="rol" title="Rotate Left — bits shifted out the left wrap to the right">RoL</button>
            <button class="btn-op" data-op="ror" title="Rotate Right — bits shifted out the right wrap to the left">RoR</button>
            <div class="ops-group-label">Byte</div>
            <button class="btn-op" data-op="byteswap" title="Byte Swap — reverses byte order (e.g. 0xAABBCCDD → 0xDDCCBBAA)">ByteSwap</button>
            <button class="btn-op" data-op="bitrev" title="Bit Reverse — reverses all bit positions">BitRev</button>
            <button class="btn-op" data-op="nibswap" title="Nibble Swap — swaps high and low nibble within each byte (e.g. 0xAB → 0xBA)">NibSwap</button>
          </div>
        </div>
      </div>

      <div class="panel" data-panel="ieee">
        <div class="panel-header"><span class="panel-arrow">&#9654;</span> IEEE 754 Float</div>
        <div class="panel-body ieee-body"></div>
      </div>

      <div class="panel" data-panel="bytes">
        <div class="panel-header"><span class="panel-arrow">&#9654;</span> Byte View</div>
        <div class="panel-body bytes-body"></div>
      </div>

      <div class="panel" data-panel="mask">
        <div class="panel-header"><span class="panel-arrow">&#9654;</span> Bitmask Generator</div>
        <div class="panel-body mask-body">
          <div class="mask-row">
            <span>From bit</span>
            <input class="mask-input" type="number" data-mask="from" value="0" min="0" max="63">
            <span>to bit</span>
            <input class="mask-input" type="number" data-mask="to" value="7" min="0" max="63">
            <span class="mask-result"></span>
            <button class="btn-copy" data-copy="mask">copy</button>
          </div>
        </div>
      </div>

      <div class="panel open" data-panel="history">
        <div class="panel-header"><span class="panel-arrow">&#9654;</span> History</div>
        <div class="panel-body history-body">
          <div class="history-list"><span class="history-empty">No history yet</span></div>
        </div>
      </div>

      <div class="calc-footer"><a href="https://asmat.ca">0xDEADBEEF by Carlos Asmat</a></div>
    `;

    root.appendChild(calc);
    this._calc = calc;
  }

  _wireEvents() {
    const $ = (sel) => this._calc.querySelector(sel);
    const $$ = (sel) => this._calc.querySelectorAll(sel);

    // Expression submit
    const input = $(".expr-input");
    const evalBtn = $(".btn-eval");
    const isFloat = (s) =>
      /^-?(\d+\.\d*|\d*\.\d+)([eE][+-]?\d+)?$/.test(s) ||
      /^-?\d+[eE][+-]?\d+$/.test(s);

    const submit = () => {
      const expr = input.value.trim();
      if (!expr) return;

      // Auto-select 32-bit for float input
      if (isFloat(expr) && this.engine.bitWidth < 32) {
        this.engine.bitWidth = 32;
        $$('[data-control="width"] .btn').forEach((b) =>
          b.classList.toggle("active", b.dataset.width === "32"),
        );
      }

      const result = this.engine.evaluate(expr);
      this.engine.value = result;
      this.engine.history.unshift({
        expr,
        result: this.engine.toRawHex(),
      });
      if (this.engine.history.length > 50) this.engine.history.pop();
      input.value = "";
      this._render();
    };
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") submit();
    });
    evalBtn.addEventListener("click", submit);

    // Bit width
    $$('[data-control="width"] .btn').forEach((btn) => {
      btn.addEventListener("click", () => {
        const w = parseInt(btn.dataset.width);
        this.engine.bitWidth = w;
        this.engine.value = this.engine.clamp(this.engine.value);
        $$('[data-control="width"] .btn').forEach((b) =>
          b.classList.toggle("active", b === btn),
        );
        this._render();
      });
    });

    // Signed/unsigned
    $$('[data-control="sign"] .btn').forEach((btn) => {
      btn.addEventListener("click", () => {
        this.engine.signed = btn.dataset.sign === "signed";
        this.engine.value = this.engine.clamp(this.engine.value);
        $$('[data-control="sign"] .btn').forEach((b) =>
          b.classList.toggle("active", b === btn),
        );
        this._render();
      });
    });

    // Copy buttons
    $$(".btn-copy").forEach((btn) => {
      btn.addEventListener("click", () => {
        let text;
        switch (btn.dataset.copy) {
          case "hex":
            text = this.engine.toRawHex();
            break;
          case "dec":
            text = this.engine.toDec();
            break;
          case "oct":
            text =
              "0o" +
              BigInt.asUintN(this.engine.bitWidth, this.engine.value).toString(
                8,
              );
            break;
          case "bin":
            text = this.engine.toRawBin();
            break;
          case "mask":
            text = $(".mask-result")?.textContent || "";
            break;
          default:
            return;
        }
        navigator.clipboard.writeText(text).then(() => {
          btn.textContent = "ok!";
          btn.classList.add("copied");
          setTimeout(() => {
            btn.textContent = "copy";
            btn.classList.remove("copied");
          }, 1000);
        });
      });
    });

    // Operations
    $$(".btn-op").forEach((btn) => {
      btn.addEventListener("click", () => {
        const op = btn.dataset.op;
        const input = $(".expr-input");
        const unaryOps = ["not", "byteswap", "bitrev", "nibswap"];
        if (unaryOps.includes(op)) {
          switch (op) {
            case "not":
              this.engine.value = this.engine.not(this.engine.value);
              break;
            case "byteswap":
              this.engine.value = this.engine.byteSwap(this.engine.value);
              break;
            case "bitrev":
              this.engine.value = this.engine.bitReverse(this.engine.value);
              break;
            case "nibswap":
              this.engine.value = this.engine.nibbleSwap(this.engine.value);
              break;
          }
          this._render();
        } else {
          // Binary ops: insert operator symbol into expression
          const symbols = {
            and: " & ",
            or: " | ",
            xor: " ^ ",
            lsh: " << ",
            rsh: " >>> ",
            ashr: " >> ",
            rol: " ROL ",
            ror: " ROR ",
          };
          const current = input.value || this.engine.toRawHex();
          input.value = current + (symbols[op] || "");
          input.focus();
        }
      });
    });

    // Panel toggle
    $$(".panel-header").forEach((header) => {
      header.addEventListener("click", () => {
        header.parentElement.classList.toggle("open");
      });
    });

    // Bitmask inputs
    $$(".mask-input").forEach((inp) => {
      inp.addEventListener("input", () => this._renderMask());
    });

    // Bit grid click delegation
    $(".bit-grid-container").addEventListener("click", (e) => {
      const cell = e.target.closest(".bit-cell");
      if (!cell) return;
      const idx = parseInt(cell.dataset.bit);
      this.engine.toggleBit(idx);
      this._render();
    });

    // History click delegation
    $(".history-list").addEventListener("click", (e) => {
      const item = e.target.closest(".history-item");
      if (!item) return;
      const expr = item.dataset.expr;
      $(".expr-input").value = expr;
      $(".expr-input").focus();
    });
  }

  _render() {
    this._renderBases();
    this._renderBitGrid();
    this._renderIEEE754();
    this._renderByteView();
    this._renderMask();
    this._renderHistory();
  }

  _renderBases() {
    const $ = (sel) => this._calc.querySelector(sel);
    $('[data-base="hex"]').textContent = this.engine.toHex();
    $('[data-base="dec"]').textContent = this.engine.toDec();
    $('[data-base="oct"]').textContent = this.engine.toOct();
    $('[data-base="bin"]').textContent = this.engine.toBin();
  }

  _renderBitGrid() {
    const container = this._calc.querySelector(".bit-grid-container");
    const bits = this.engine.bitWidth;
    const narrow = container.offsetWidth < 480;
    const bitsPerRow = narrow ? 16 : 32;
    const totalRows = Math.ceil(bits / bitsPerRow);
    let html = "";

    for (let row = totalRows - 1; row >= 0; row--) {
      const rowStart = row * bitsPerRow;
      const rowEnd = Math.min(rowStart + bitsPerRow, bits);
      const rowBytes = Math.ceil((rowEnd - rowStart) / 8);

      // Bit cells row
      html += '<div class="bit-row">';
      for (let b = rowBytes - 1; b >= 0; b--) {
        html += '<div class="byte-group">';
        // High nibble
        html += '<div class="nibble-group">';
        for (let bit = 7; bit >= 4; bit--) {
          const idx = rowStart + b * 8 + bit;
          if (idx >= rowEnd) {
            html += '<div class="bit-cell" style="visibility:hidden"></div>';
          } else {
            const on = this.engine.getBit(idx) ? " on" : "";
            html += `<div class="bit-cell${on}" data-bit="${idx}">${this.engine.getBit(idx)}</div>`;
          }
        }
        html += "</div>";
        // Low nibble
        html += '<div class="nibble-group">';
        for (let bit = 3; bit >= 0; bit--) {
          const idx = rowStart + b * 8 + bit;
          const on = this.engine.getBit(idx) ? " on" : "";
          html += `<div class="bit-cell${on}" data-bit="${idx}">${this.engine.getBit(idx)}</div>`;
        }
        html += "</div>";
        html += "</div>";
      }
      html += "</div>";

      // Index labels row
      html += '<div class="bit-row-indices">';
      for (let b = rowBytes - 1; b >= 0; b--) {
        html += '<div class="byte-group">';
        html += '<div class="nibble-group">';
        for (let bit = 7; bit >= 4; bit--) {
          const idx = rowStart + b * 8 + bit;
          if (idx >= rowEnd) {
            html += '<div class="bit-idx"></div>';
          } else {
            html += `<div class="bit-idx">${idx}</div>`;
          }
        }
        html += "</div>";
        html += '<div class="nibble-group">';
        for (let bit = 3; bit >= 0; bit--) {
          const idx = rowStart + b * 8 + bit;
          html += `<div class="bit-idx">${idx}</div>`;
        }
        html += "</div>";
        html += "</div>";
      }
      html += "</div>";
    }

    container.innerHTML = html;
  }

  _renderIEEE754() {
    const body = this._calc.querySelector(".ieee-body");
    const w = this.engine.bitWidth;

    if (w < 32) {
      body.innerHTML =
        '<span style="color:var(--text-dim);font-size:0.85em">IEEE 754 requires 32-bit or 64-bit width</span>';
      return;
    }

    const is64 = w >= 64;
    const parts = is64
      ? this.engine.toFloat64Parts()
      : this.engine.toFloat32Parts();

    if (!parts) return;

    const signBits = 1;
    const expBits = is64 ? 11 : 8;
    const manBits = is64 ? 52 : 23;
    const totalBits = signBits + expBits + manBits;

    // Build bit display
    const unsigned = BigInt.asUintN(totalBits, this.engine.value);
    const allBits = unsigned.toString(2).padStart(totalBits, "0");

    let bitsHTML = '<div class="ieee-row">';
    for (let i = 0; i < totalBits; i++) {
      let cls;
      if (i === 0) cls = "ieee-sign";
      else if (i <= expBits) cls = "ieee-exp";
      else cls = "ieee-mantissa";
      bitsHTML += `<div class="ieee-bit ${cls}">${allBits[i]}</div>`;
    }
    bitsHTML += "</div>";

    const bias = is64 ? 1023 : 127;
    const expVal = parts.exponent - bias;
    let floatStr;
    if (!isFinite(parts.float)) {
      floatStr = parts.float > 0 ? "+Infinity" : "-Infinity";
    } else if (isNaN(parts.float)) {
      floatStr = "NaN";
    } else {
      floatStr = parts.float.toString();
    }

    body.innerHTML = `
      <div class="ieee-label">${is64 ? "Double (64-bit)" : "Single (32-bit)"} IEEE 754</div>
      ${bitsHTML}
      <div class="ieee-legend">
        <span><span class="ieee-legend-swatch" style="background:var(--crimson)"></span>Sign: ${parts.sign ? "-" : "+"}</span>
        <span><span class="ieee-legend-swatch" style="background:var(--blue)"></span>Exp: ${parts.exponent} (${expVal >= 0 ? "+" : ""}${expVal})</span>
        <span><span class="ieee-legend-swatch" style="background:var(--teal)"></span>Mantissa</span>
      </div>
      <div class="ieee-result">= ${floatStr}</div>
    `;
  }

  _renderByteView() {
    const body = this._calc.querySelector(".bytes-body");
    const be = this.engine
      .toEndianBytes(false)
      .map((b) => b.toString(16).toUpperCase().padStart(2, "0"))
      .join(" ");
    const le = this.engine
      .toEndianBytes(true)
      .map((b) => b.toString(16).toUpperCase().padStart(2, "0"))
      .join(" ");
    const ascii = this.engine.toAscii();

    body.innerHTML = `
      <div class="byte-view-row"><span class="byte-view-label">BE</span><span class="byte-view-value">${be}</span></div>
      <div class="byte-view-row"><span class="byte-view-label">LE</span><span class="byte-view-value">${le}</span></div>
      <div class="byte-view-row"><span class="byte-view-label">ASCII</span><span class="byte-view-value">${ascii}</span></div>
    `;
  }

  _renderMask() {
    const from = parseInt(
      this._calc.querySelector('[data-mask="from"]')?.value || "0",
    );
    const to = parseInt(
      this._calc.querySelector('[data-mask="to"]')?.value || "7",
    );
    if (isNaN(from) || isNaN(to)) return;
    const mask = this.engine.generateMask(from, to);
    const hex =
      "0x" +
      BigInt.asUintN(this.engine.bitWidth, mask).toString(16).toUpperCase();
    const resultEl = this._calc.querySelector(".mask-result");
    if (resultEl) resultEl.textContent = hex;
  }

  _renderHistory() {
    const list = this._calc.querySelector(".history-list");
    if (this.engine.history.length === 0) {
      list.innerHTML = '<span class="history-empty">No history yet</span>';
      return;
    }
    list.innerHTML = this.engine.history
      .map(
        (h) =>
          `<div class="history-item" data-expr="${h.expr.replace(/"/g, "&quot;")}">${h.expr} = <span class="hist-result">${h.result}</span></div>`,
      )
      .join("");
  }
}

customElements.define("programmer-calculator", ProgrammerCalculator);
