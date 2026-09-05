#!/usr/bin/env node
/**
 * Spell + light grammar check for Markdown files.
 *
 * Strips frontmatter, code blocks, inline code, KaTeX math, HTML tags,
 * link URLs, and Eleventy shortcodes before piping the remaining prose
 * through `aspell` (en_CA). Cross-references _tools/spell-dictionary.txt
 * for project-specific technical terms so domain vocab isn't flagged.
 *
 * Also runs three heuristic grammar checks:
 *   - doubled adjacent words ("the the")
 *   - a small list of common typos (teh, recieve, seperate, …)
 *   - double spaces between words
 *
 * Requires `aspell` on PATH.
 *
 * Usage:
 *   node _tools/spell.mjs <file>...
 *   node _tools/spell.mjs --staged <file>...   # only lines added in the index
 *   make spell FILE=_drafts/foo.md
 *
 * --staged is what the pre-commit hook uses: it reports only words on lines
 * the commit adds, so an old post's backlog does not drown the new typo.
 *
 * Exits 0 if clean, 1 if anything was flagged, 2 on usage error.
 */

import { readFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DICT_PATH = path.join(ROOT, "_tools/spell-dictionary.txt");

// ---- Project dictionary -------------------------------------------------

const dictSet = new Set();
if (existsSync(DICT_PATH)) {
  for (const line of readFileSync(DICT_PATH, "utf-8").split(/\r?\n/)) {
    const word = line.trim();
    if (word && !word.startsWith("#")) dictSet.add(word.toLowerCase());
  }
}

// ---- Markdown stripping -------------------------------------------------

// Replace a matched span with whitespace so line/column positions in the
// original source still line up with the cleaned text.
function blankOut(src, re) {
  return src.replace(re, (m) => m.replace(/[^\n]/g, " "));
}

function stripMarkdown(src) {
  let out = src;
  // Frontmatter at the top
  out = blankOut(out, /^---\n[\s\S]*?\n---\n/);
  // Fenced code blocks
  out = blankOut(out, /```[\s\S]*?```/g);
  // Display math
  out = blankOut(out, /\$\$[\s\S]*?\$\$/g);
  // Inline math
  out = blankOut(out, /\$[^$\n]+\$/g);
  // Inline code
  out = blankOut(out, /`[^`\n]+`/g);
  // Eleventy shortcodes
  out = blankOut(out, /\{%[\s\S]*?%\}/g);
  // HTML tags (incl. self-closing and comments)
  out = blankOut(out, /<!--[\s\S]*?-->/g);
  out = blankOut(out, /<\/?[a-zA-Z][^>]*>/g);
  // Link URLs (keep the [text] visible part)
  out = out.replace(
    /\]\(([^)]*)\)/g,
    (_, url) => "]" + " ".repeat(url.length + 2),
  );
  // Bare URLs
  out = blankOut(out, /https?:\/\/\S+/g);
  // Ordinal suffixes ("6th band" → "6   band") so aspell doesn't flag "th"
  out = out.replace(
    /(\d)(st|nd|rd|th)\b/gi,
    (_, d, suf) => d + " ".repeat(suf.length),
  );
  // Hex / binary / octal numeric literals ("0xDEADBEEF" → blanked)
  out = out.replace(/\b0[xX][0-9a-fA-F]+\b/g, (m) => " ".repeat(m.length));
  out = out.replace(/\b0[bB][01]+\b/g, (m) => " ".repeat(m.length));
  out = out.replace(/\b0[oO][0-7]+\b/g, (m) => " ".repeat(m.length));
  return out;
}

// Look up a word in the project dictionary, also accepting the possessive
// form (Parekh's, multimeter's) when the base form is listed.
function inDict(word) {
  const lower = word.toLowerCase();
  if (dictSet.has(lower)) return true;
  const base = lower.replace(/['’]s$/, "");
  if (base !== lower && dictSet.has(base)) return true;
  return false;
}

// ---- aspell -------------------------------------------------------------

function aspellSuspects(text) {
  try {
    const out = execSync("aspell list --mode=none --lang=en_CA", {
      input: text,
      encoding: "utf-8",
    });
    return new Set(
      out
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean),
    );
  } catch (e) {
    console.error("aspell failed:", e.message);
    return new Set();
  }
}

// ---- Heuristic grammar --------------------------------------------------

const COMMON_TYPOS = {
  teh: "the",
  recieve: "receive",
  recieved: "received",
  seperate: "separate",
  seperated: "separated",
  occured: "occurred",
  definately: "definitely",
  untill: "until",
  accross: "across",
  alot: "a lot",
  wether: "whether",
  wich: "which",
  thier: "their",
  enviroment: "environment",
  refered: "referred",
  benifit: "benefit",
  recomend: "recommend",
  noticable: "noticeable",
  publically: "publicly",
};

// Some doubled words are legit; don't flag these.
const DOUBLED_OK = new Set(["had", "that", "is", "the"]);

function grammarChecks(src) {
  const issues = [];
  const lines = src.split("\n");

  // Track which lines are inside fenced code so we don't flag them.
  let inFence = false;
  const codeLine = new Array(lines.length).fill(false);
  for (let i = 0; i < lines.length; i++) {
    if (/^```/.test(lines[i])) {
      inFence = !inFence;
      codeLine[i] = true;
      continue;
    }
    if (inFence) codeLine[i] = true;
  }

  for (let i = 0; i < lines.length; i++) {
    if (codeLine[i]) continue;
    const line = lines[i];

    // Doubled words
    const dupRe = /\b(\w+)\s+\1\b/gi;
    let m;
    while ((m = dupRe.exec(line))) {
      if (DOUBLED_OK.has(m[1].toLowerCase())) continue;
      issues.push({
        line: i + 1,
        col: m.index + 1,
        kind: "doubled word",
        text: m[0],
      });
    }

    // Common typos
    for (const [bad, good] of Object.entries(COMMON_TYPOS)) {
      const re = new RegExp(`\\b${bad}\\b`, "gi");
      let t;
      while ((t = re.exec(line))) {
        issues.push({
          line: i + 1,
          col: t.index + 1,
          kind: "typo",
          text: `"${t[0]}" → "${good}"`,
        });
      }
    }

    // Double space between two non-space characters
    const dsRe = /\S( {2,})\S/g;
    let d;
    while ((d = dsRe.exec(line))) {
      issues.push({
        line: i + 1,
        col: d.index + 2,
        kind: "double space",
        text: "",
      });
    }
  }

  return issues;
}

// ---- File check ---------------------------------------------------------

function findOccurrences(src, word) {
  const lines = src.split("\n");
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`\\b${escaped}\\b`);
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(re);
    if (m)
      out.push({
        line: i + 1,
        col: (m.index ?? 0) + 1,
        context: lines[i].trim(),
      });
  }
  return out;
}

// Line numbers (in the working tree) added by the staged diff of `file`.
// Returns null when the file has no staged diff, so the caller checks all of it.
function stagedLines(file) {
  let diff;
  try {
    diff = execSync(`git diff --cached -U0 -- ${JSON.stringify(file)}`, {
      encoding: "utf-8",
    });
  } catch {
    return null;
  }
  if (!diff.trim()) return null;
  const lines = new Set();
  for (const m of diff.matchAll(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/gm)) {
    const start = Number(m[1]);
    const count = m[2] === undefined ? 1 : Number(m[2]);
    for (let i = 0; i < count; i++) lines.add(start + i);
  }
  return lines;
}

function checkFile(file, { staged = false } = {}) {
  const src = readFileSync(file, "utf-8");
  const stripped = stripMarkdown(src);
  const only = staged ? stagedLines(file) : null;
  const keep = (line) => only === null || only.has(line);

  const suspects = aspellSuspects(stripped);
  let unknown = [...suspects].filter((w) => !inDict(w));
  if (only !== null) {
    unknown = unknown.filter((w) =>
      findOccurrences(stripped, w).some((o) => keep(o.line)),
    );
  }
  unknown.sort((a, b) => a.localeCompare(b));

  const grammar = grammarChecks(src).filter((g) => keep(g.line));

  if (unknown.length === 0 && grammar.length === 0) {
    console.log(`${file}: clean`);
    return 0;
  }

  console.log(`\n${file}`);

  if (unknown.length) {
    console.log(`  Unknown words (${unknown.length}):`);
    for (const word of unknown) {
      const occ = findOccurrences(stripped, word).filter((o) => keep(o.line));
      if (occ.length === 0) {
        console.log(`    ${word}`);
      } else {
        for (const o of occ) {
          const ctx = o.context.slice(0, 90);
          console.log(`    L${o.line}  ${word.padEnd(20)}  ${ctx}`);
        }
      }
    }
    console.log("");
    console.log(`  (False positives belong in _tools/spell-dictionary.txt)`);
  }

  if (grammar.length) {
    console.log(`\n  Grammar (${grammar.length}):`);
    for (const g of grammar) {
      console.log(`    L${g.line}:${g.col}  ${g.kind.padEnd(14)}  ${g.text}`);
    }
  }

  return 1;
}

// ---- main ---------------------------------------------------------------

const args = process.argv.slice(2);
const staged = args.includes("--staged");
const files = args.filter((a) => a !== "--staged");
if (files.length === 0) {
  console.error("Usage: node _tools/spell.mjs [--staged] <file>...");
  process.exit(2);
}

let bad = 0;
for (const file of files) {
  if (!existsSync(file)) {
    console.error(`File not found: ${file}`);
    bad++;
    continue;
  }
  bad += checkFile(file, { staged });
}

process.exit(bad > 0 ? 1 : 0);
