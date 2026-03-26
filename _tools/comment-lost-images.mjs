#!/usr/bin/env node
/**
 * Comments out {% fig %} references where the image file doesn't exist locally.
 * Uses Nunjucks comment syntax: {# ... #}
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";

const POSTS_DIR = "_posts";
const IMG_BASE = "img/blog";

const posts = readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));

let total = 0;

for (const file of posts) {
  const postPath = join(POSTS_DIR, file);
  const content = readFileSync(postPath, "utf8");
  let updated = content;
  let changed = false;

  // Check each fig reference
  updated = updated.replace(
    /(\{%\s*fig\s+"([^"]*)"(?:\s*,\s*"[^"]*")?\s*%\})/g,
    (match, full, imgPath) => {
      // Resolve path
      let localPath;
      if (imgPath.startsWith("/")) {
        localPath = imgPath.substring(1);
      } else if (imgPath.startsWith("http")) {
        return match; // external URL, skip
      } else {
        // bare filename - shouldn't happen anymore but handle it
        const slug = file
          .replace(/^\d{4}-\d{2}-\d{2}-/, "")
          .replace(/\.md$/, "");
        localPath = join(IMG_BASE, slug, imgPath);
      }

      if (!existsSync(localPath)) {
        changed = true;
        total++;
        return `{# ${full} - image lost #}`;
      }
      return match;
    },
  );

  if (changed) {
    writeFileSync(postPath, updated);
    console.log(`Updated: ${file}`);
  }
}

console.log(`\nCommented out ${total} lost image references`);
