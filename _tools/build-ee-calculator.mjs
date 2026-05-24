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

const replacements = [
  { token: '"__STYLE_CSS__"', file: "style.css" },
  { token: '"__RESISTOR_SVG__"', file: "resistor.svg" },
  { token: '"__IC_555_SVG__"', file: "ic-555.svg" },
];

let out = main;
for (const { token, file } of replacements) {
  if (!out.includes(token)) {
    console.error(
      `build-ee-calculator: placeholder ${token} not found in main.js`,
    );
    process.exit(1);
  }
  out = out.replace(token, JSON.stringify(read(file)));
}

const header = `// AUTO-GENERATED from src/ee-calculator/. Do not edit directly.\n// To make changes, edit src/ee-calculator/*.{js,css,svg} and rebuild.\n//   make ee-calc   (or just \`make build\`, which depends on it)\n\n`;

fs.writeFileSync(OUT, header + out);
console.log(
  `ee-calculator: ${out.split("\n").length} lines → ${path.relative(ROOT, OUT)}`,
);
