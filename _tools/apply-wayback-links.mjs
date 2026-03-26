#!/usr/bin/env node
/**
 * Replaces dead external links with {% wayback %} shortcodes
 * using data from the link-report.json.
 */

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const REPORT_PATH = "_tools/link-report.json";
const POSTS_DIR = "_posts";

const report = JSON.parse(readFileSync(REPORT_PATH, "utf8"));

// Build lookup: original URL -> { waybackUrl, text, file }
const waybackMap = new Map();
for (const entry of report.dead) {
  if (entry.waybackUrl) {
    waybackMap.set(entry.url, entry.waybackUrl);
  }
}

console.log(`Loaded ${waybackMap.size} wayback URL mappings`);

// Group replacements by file
const byFile = new Map();
for (const entry of report.dead) {
  if (!entry.waybackUrl) continue;
  if (!byFile.has(entry.file)) byFile.set(entry.file, []);
  byFile.get(entry.file).push(entry);
}

let totalReplaced = 0;

for (const [file, entries] of byFile) {
  const postPath = join(POSTS_DIR, file);
  let content = readFileSync(postPath, "utf8");
  let changed = false;

  for (const entry of entries) {
    // Escape special regex characters in the URL
    const escaped = entry.url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Match markdown link: [text](url) or [text](url "title")
    const re = new RegExp(
      `\\[([^\\]]*)\\]\\(${escaped}(?:\\s+"[^"]*")?\\)`,
      "g",
    );

    const newContent = content.replace(re, (match, linkText) => {
      changed = true;
      totalReplaced++;
      return `{% wayback "${entry.waybackUrl}", "${linkText.replace(/"/g, '\\"')}" %}`;
    });

    content = newContent;
  }

  if (changed) {
    writeFileSync(postPath, content);
    console.log(`Updated: ${file}`);
  }
}

console.log(`\nTotal links replaced: ${totalReplaced}`);
