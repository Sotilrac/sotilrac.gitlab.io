#!/usr/bin/env node
/**
 * Updates blog posts to fix image references:
 * 1. Converts bare filenames to full paths: "file.jpg" -> "/img/blog/slug/file.jpg"
 * 2. Maps old filenames (with +, spaces, mixed case) to sanitized downloaded names
 * 3. Reports images that couldn't be matched
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";

const PLAN_PATH = "_tools/post-update-plan.json";
const POSTS_DIR = "_posts";
const IMG_BASE = "img/blog";

const plan = JSON.parse(readFileSync(PLAN_PATH, "utf8"));

function sanitize(name) {
  return decodeURIComponent(name)
    .replace(/\+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function findMatch(refPath, availableImages) {
  // Direct match
  if (availableImages.includes(refPath)) return refPath;

  // Try sanitized version
  const sanitized = sanitize(refPath);
  if (availableImages.includes(sanitized)) return sanitized;

  // Try case-insensitive
  const lower = sanitized.toLowerCase();
  const match = availableImages.find((f) => f.toLowerCase() === lower);
  if (match) return match;

  // Try without extension case sensitivity
  const noExt = lower.replace(/\.[^.]+$/, "");
  const extMatch = availableImages.find((f) => {
    const fNoExt = f.toLowerCase().replace(/\.[^.]+$/, "");
    return fNoExt === noExt;
  });
  if (extMatch) return extMatch;

  // Try fuzzy: remove all non-alphanumeric and compare
  const fuzzy = lower.replace(/[^a-z0-9]/g, "");
  const fuzzyMatch = availableImages.find((f) => {
    const fFuzzy = f.toLowerCase().replace(/[^a-z0-9]/g, "");
    return fFuzzy === fuzzy;
  });
  if (fuzzyMatch) return fuzzyMatch;

  return null;
}

let totalFixed = 0;
let totalUnmatched = 0;
const unmatched = [];

for (const entry of plan) {
  if (!entry.needsUpdate) continue;

  const postPath = join(POSTS_DIR, entry.repoFile);
  let content = readFileSync(postPath, "utf8");
  const imgDir = join(IMG_BASE, entry.postSlug);
  const available = entry.availableImages;

  let changed = false;
  let postUnmatched = [];

  // Fix {% fig "..." %} references
  content = content.replace(
    /(\{%\s*fig\s+")([^"]*)("\s*(?:,\s*"[^"]*")?\s*%\})/g,
    (match, prefix, imgPath, suffix) => {
      const fullPathPrefix = `/img/blog/${entry.postSlug}/`;

      // Already a full path — check if the file exists
      if (imgPath.startsWith("/img/blog/")) {
        const localPath = imgPath.substring(1); // remove leading /
        if (existsSync(localPath)) return match; // Already good

        // Try to find the file by basename
        const bname = imgPath.split("/").pop();
        const found = findMatch(bname, available);
        if (found) {
          totalFixed++;
          changed = true;
          return `${prefix}${fullPathPrefix}${found}${suffix}`;
        }
        postUnmatched.push(imgPath);
        return match;
      }

      // Bare filename — find match and add full path
      const found = findMatch(imgPath, available);
      if (found) {
        totalFixed++;
        changed = true;
        return `${prefix}${fullPathPrefix}${found}${suffix}`;
      }

      // Couldn't match — still add the path prefix with sanitized name
      // so at least the path structure is correct
      const sanitized = sanitize(imgPath);
      if (available.includes(sanitized)) {
        totalFixed++;
        changed = true;
        return `${prefix}${fullPathPrefix}${sanitized}${suffix}`;
      }

      postUnmatched.push(imgPath);
      return match;
    },
  );

  // Fix {% gallery N, "...", "...", ... %} references
  content = content.replace(
    /(\{%\s*gallery\s+\d+\s*,\s*)((?:"[^"]*"(?:\s*,\s*)?)+)(\s*%\})/g,
    (match, prefix, imgList, suffix) => {
      const fullPathPrefix = `/img/blog/${entry.postSlug}/`;
      const newImgs = imgList.replace(/"([^"]*)"/g, (imgMatch, imgPath) => {
        if (
          imgPath.startsWith("/img/blog/") &&
          existsSync(imgPath.substring(1))
        ) {
          return imgMatch;
        }
        const bname = imgPath.startsWith("/img/blog/")
          ? imgPath.split("/").pop()
          : imgPath;
        const found = findMatch(bname, available);
        if (found) {
          totalFixed++;
          changed = true;
          return `"${fullPathPrefix}${found}"`;
        }
        postUnmatched.push(imgPath);
        return imgMatch;
      });
      return `${prefix}${newImgs}${suffix}`;
    },
  );

  if (changed) {
    writeFileSync(postPath, content);
    console.log(
      `Updated: ${entry.repoFile}${postUnmatched.length ? ` (${postUnmatched.length} unmatched)` : ""}`,
    );
  }

  if (postUnmatched.length > 0) {
    totalUnmatched += postUnmatched.length;
    unmatched.push({
      file: entry.repoFile,
      refs: postUnmatched,
    });
  }
}

console.log(`\nTotal references fixed: ${totalFixed}`);
console.log(`Total unmatched references: ${totalUnmatched}`);

if (unmatched.length > 0) {
  console.log("\nUnmatched references:");
  for (const u of unmatched) {
    console.log(`  ${u.file}:`);
    for (const r of u.refs) {
      console.log(`    - ${r}`);
    }
  }
}
