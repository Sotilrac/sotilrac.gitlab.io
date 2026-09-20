#!/usr/bin/env node
// Verify every post and draft uses a category the blog page can filter by.
//
// A category that is not in the filter list is invisible: the post still
// builds, but clicking its name on /blog/ never surfaces it and its coloured
// dot falls back to nothing. The list lives in blog.njk as `data-cat`
// attributes and is read from there, so this check cannot drift from the UI.
//
//   node _tools/check-categories.mjs          # posts and drafts
//   node _tools/check-categories.mjs a.md b.md
//
// Exits 1 and names every offender, with the closest legal category.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");

// `info` predates the filter list and renders under the News dot, via the
// categoryIcon filter in eleventy.config.mjs. Keep the two in step.
const ALIASES = { info: "news" };

function allowedCategories() {
  const njk = fs.readFileSync(path.join(ROOT, "blog.njk"), "utf8");
  const found = [...njk.matchAll(/data-cat="([^"]+)"/g)].map((m) => m[1]);
  if (!found.length) {
    console.error("check-categories: no data-cat entries found in blog.njk");
    process.exit(2);
  }
  return new Set([...found, ...Object.keys(ALIASES)]);
}

// The categories block of the YAML frontmatter, as written.
function categoriesOf(file) {
  const text = fs.readFileSync(file, "utf8");
  const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) return [];
  const block = fm[1].match(
    /^categories:[ \t]*\r?\n((?:[ \t]+-[ \t]*.+\r?\n?)+)/m,
  );
  if (block) {
    return [...block[1].matchAll(/^[ \t]+-[ \t]*(.+?)[ \t]*$/gm)].map((m) =>
      m[1].replace(/^["']|["']$/g, ""),
    );
  }
  const inline = fm[1].match(/^categories:[ \t]*(.+)$/m);
  if (!inline) return [];
  return inline[1]
    .replace(/^\[|\]$/g, "")
    .split(",")
    .map((s) => s.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);
}

const listMarkdown = (dir) =>
  fs.existsSync(dir)
    ? fs
        .readdirSync(dir)
        .filter((f) => f.endsWith(".md"))
        .map((f) => path.join(dir, f))
    : [];

const files = process.argv.slice(2).length
  ? process.argv.slice(2).filter((f) => f.endsWith(".md"))
  : [
      ...listMarkdown(path.join(ROOT, "_posts")),
      ...listMarkdown(path.join(ROOT, "_drafts")),
    ];

const allowed = allowedCategories();
const pretty = [...allowed].sort().join(", ");
const problems = [];

for (const file of files) {
  const cats = categoriesOf(file);
  const rel = path.relative(ROOT, file);
  if (!cats.length) {
    problems.push([rel, "(none)", "every post needs at least one category"]);
    continue;
  }
  for (const cat of cats) {
    const key = cat.toLowerCase();
    if (allowed.has(key)) continue;
    // "My Projects" should have been "Projects": suggest a category that
    // contains, or is contained by, what was written.
    const near = [...allowed].find(
      (a) => key.includes(a) || a.includes(key.replace(/^my /, "")),
    );
    problems.push([rel, cat, near ? `did you mean "${near}"?` : ""]);
  }
}

if (!problems.length) {
  console.log(
    `OK: ${files.length} posts and drafts use filterable categories (${pretty})`,
  );
  process.exit(0);
}

console.error("\nCategories not in the /blog/ filter list:\n");
for (const [file, cat, hint] of problems) {
  console.error(`  ${file}\n      ${cat}  ${hint}`);
}
console.error(`\nAllowed (from blog.njk data-cat): ${pretty}`);
console.error(
  "Match is case-insensitive; keep the Title Case in frontmatter.\n",
);
process.exit(1);
