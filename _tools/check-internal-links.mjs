#!/usr/bin/env node
/**
 * Verifies that every internal href/src in the built HTML resolves
 * to a real file in the output directory. External URLs and hash-only
 * anchors are skipped. Exits 1 on any broken reference.
 *
 * Usage: node _tools/check-internal-links.mjs [output-dir]
 *   output-dir defaults to _site
 */

import { readFileSync, readdirSync, statSync, existsSync } from "fs";
import { join, dirname, resolve } from "path";

const root = process.argv[2] || "_site";

if (!existsSync(root)) {
  console.error(`Directory not found: ${root}`);
  process.exit(1);
}

function walkHtml(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkHtml(p));
    else if (entry.name.endsWith(".html")) out.push(p);
  }
  return out;
}

const URL_RE = /(?:href|src)\s*=\s*"([^"]+)"/gi;

function extractRefs(html) {
  const refs = [];
  let m;
  while ((m = URL_RE.exec(html)) !== null) refs.push(m[1]);
  return refs;
}

function shouldSkip(url) {
  if (!url) return true;
  if (url.startsWith("#")) return true;
  if (url.startsWith("//")) return true;
  if (/^[a-z][a-z0-9+.-]*:/i.test(url)) return true;
  return false;
}

function resolveLocal(url, htmlFile, root) {
  const clean = url.split("?")[0].split("#")[0];
  if (!clean) return null;
  if (clean.startsWith("/")) return join(root, clean);
  return resolve(dirname(htmlFile), clean);
}

function exists(target, urlEndsWithSlash) {
  if (urlEndsWithSlash) return existsSync(join(target, "index.html"));
  if (!existsSync(target)) return false;
  if (statSync(target).isDirectory()) {
    return existsSync(join(target, "index.html"));
  }
  return true;
}

const htmlFiles = walkHtml(root);
const broken = [];

for (const file of htmlFiles) {
  const content = readFileSync(file, "utf8");
  const refs = extractRefs(content);
  for (const ref of refs) {
    if (shouldSkip(ref)) continue;
    const target = resolveLocal(ref, file, root);
    if (!target) continue;
    const cleanRef = ref.split("?")[0].split("#")[0];
    const endsWithSlash = cleanRef.endsWith("/");
    if (!exists(target, endsWithSlash)) {
      broken.push({
        file: file.startsWith(root + "/") ? file.slice(root.length + 1) : file,
        ref,
        resolved: target,
      });
    }
  }
}

if (broken.length === 0) {
  console.log(
    `OK: all internal links resolve (${htmlFiles.length} HTML files scanned)`,
  );
  process.exit(0);
}

console.error(`FAIL: ${broken.length} broken internal link(s):\n`);
const byFile = new Map();
for (const b of broken) {
  if (!byFile.has(b.file)) byFile.set(b.file, []);
  byFile.get(b.file).push(b);
}
for (const [file, items] of byFile) {
  console.error(`  ${file}:`);
  for (const b of items) {
    console.error(`    ${b.ref}  ->  ${b.resolved}`);
  }
}
process.exit(1);
