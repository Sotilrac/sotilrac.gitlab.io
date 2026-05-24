#!/usr/bin/env node
// Bundle src/ee-calculator/ (main.js + style.css + svg assets) into the
// single-file js/ee-calculator.js that the post embeds.
//
// The source layout:
//   src/ee-calculator/main.js     — logic with placeholder string constants
//   src/ee-calculator/style.css   — extracted CSS for the Shadow DOM
//   src/ee-calculator/resistor.svg
//   src/ee-calculator/ic-555.svg
//
// Placeholder convention in main.js: a const initialized to the literal
// string "__NAME__" (with surrounding quotes), e.g. `const STYLE = "__STYLE_CSS__";`.
// The build replaces "__NAME__" with a properly escaped JSON-encoded version
// of the source file contents.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "src/ee-calculator");
const OUT = path.join(ROOT, "js/ee-calculator.js");

const read = (rel) => fs.readFileSync(path.join(SRC, rel), "utf-8");
const main = read("main.js");

// Build the <symbol> defs blob from each component SVG. The Circuit class
// references these via <use href="#sym-X" /> inside the schematic SVG.
const symbolFiles = {
  "sym-r": "symbols/resistor.svg",
  "sym-c": "symbols/capacitor.svg",
  "sym-led": "symbols/led.svg",
  "sym-gnd": "symbols/ground.svg",
};
const symbolDefs = Object.entries(symbolFiles)
  .map(([id, file]) => {
    const svg = read(file);
    const vb = svg.match(/<svg[^>]*\bviewBox="([^"]+)"/);
    const inner = svg.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
    if (!vb || !inner) {
      console.error(`build-ee-calculator: ${file} is not a parseable SVG`);
      process.exit(1);
    }
    return `<symbol id="${id}" viewBox="${vb[1]}" overflow="visible">${inner[1].trim()}</symbol>`;
  })
  .join("");

const replacements = [
  { token: '"__STYLE_CSS__"', value: read("style.css") },
  { token: '"__RESISTOR_SVG__"', value: read("resistor.svg") },
  { token: '"__IC_555_SVG__"', value: read("ic-555.svg") },
  { token: '"__SYMBOL_DEFS__"', value: symbolDefs },
];

let out = main;
for (const { token, value } of replacements) {
  if (!out.includes(token)) {
    console.error(
      `build-ee-calculator: placeholder ${token} not found in main.js`,
    );
    process.exit(1);
  }
  out = out.replace(token, JSON.stringify(value));
}

const header = `// AUTO-GENERATED from src/ee-calculator/. Do not edit directly.\n// To make changes, edit src/ee-calculator/*.{js,css,svg} and rebuild.\n//   make ee-calc   (or just \`make build\`, which depends on it)\n\n`;

fs.writeFileSync(OUT, header + out);
console.log(
  `ee-calculator: ${out.split("\n").length} lines → ${path.relative(ROOT, OUT)}`,
);
