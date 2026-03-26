#!/usr/bin/env node
/**
 * Replaces old carlitoscontraptions.com and blogspot internal links
 * with new /blog/slug/ format.
 */

import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";

const POSTS_DIR = "_posts";

// Build slug lookup from repo filenames
const repoFiles = readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
const slugMap = new Map();

for (const f of repoFiles) {
  const slug = f.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.md$/, "");
  // Map from old WP-style slug (which may differ slightly) to new slug
  slugMap.set(slug, `/blog/${slug}/`);
}

// Build old-slug -> new-slug mapping by also indexing without common prefixes
// e.g., "compact-keychain-20" should match "compact-keychain-20"
function findNewUrl(oldSlug) {
  // Direct match
  if (slugMap.has(oldSlug)) return slugMap.get(oldSlug);

  // Try removing trailing slashes and normalizing
  const norm = oldSlug.replace(/\/$/, "").toLowerCase();
  if (slugMap.has(norm)) return slugMap.get(norm);

  // Fuzzy: find best match
  for (const [slug, url] of slugMap) {
    const slugNorm = slug.replace(/-/g, "");
    const oldNorm = norm.replace(/-/g, "");
    if (slugNorm === oldNorm) return url;
    // Substring match (old slug contained in new or vice versa)
    if (slugNorm.includes(oldNorm) || oldNorm.includes(slugNorm)) {
      // Only accept if they're very similar (avoid false matches)
      if (
        Math.abs(slugNorm.length - oldNorm.length) <= 5 ||
        oldNorm.length > 10
      ) {
        return url;
      }
    }
  }

  return null;
}

let totalFixed = 0;
let totalUnresolved = 0;
const unresolved = [];

for (const file of repoFiles) {
  const postPath = join(POSTS_DIR, file);
  let content = readFileSync(postPath, "utf8");
  let changed = false;

  // Split content into frontmatter and body
  const fmMatch = content.match(/^(---\n[\s\S]*?\n---\n)([\s\S]*)$/);
  if (!fmMatch) continue;
  const frontmatter = fmMatch[1];
  let body = fmMatch[2];

  // Pattern 1: http(s)://carlitoscontraptions.com/YYYY/MM/slug/
  body = body.replace(
    /https?:\/\/carlitoscontraptions\.com\/(\d{4})\/(\d{2})\/([^/)\s"]+)\/?/g,
    (match, year, month, slug) => {
      // Skip if inside a comment
      const newUrl = findNewUrl(slug);
      if (newUrl) {
        changed = true;
        totalFixed++;
        return newUrl;
      }
      unresolved.push({ file, old: match, slug });
      totalUnresolved++;
      return match;
    },
  );

  // Pattern 2: http(s)://carlitoscontraptions.blogspot.com/YYYY/MM/slug.html
  body = body.replace(
    /https?:\/\/carlitoscontraptions\.blogspot\.com\/(\d{4})\/(\d{2})\/([^.)\s"]+)\.html/g,
    (match, year, month, slug) => {
      const newUrl = findNewUrl(slug);
      if (newUrl) {
        changed = true;
        totalFixed++;
        return newUrl;
      }
      unresolved.push({ file, old: match, slug });
      totalUnresolved++;
      return match;
    },
  );

  // Pattern 3: http://carlitoscontraptions.com/tag/tag-name/
  // These are tag index pages that don't exist in the new site.
  // Leave them — they'll be dead links but changing to what?

  // Pattern 4: http://carlitoscontraptions.com/category/cat/
  // Same as tags — no equivalent in new site.

  // Pattern 5: http://carlitoscontraptions.com/project/name/
  // Same — no equivalent.

  if (changed) {
    content = frontmatter + body;
    writeFileSync(postPath, content);
    console.log(`Updated: ${file}`);
  }
}

console.log(`\nTotal links fixed: ${totalFixed}`);
console.log(`Total unresolved: ${totalUnresolved}`);

if (unresolved.length > 0) {
  console.log("\nUnresolved links:");
  for (const u of unresolved) {
    console.log(`  ${u.file}: ${u.old} (slug: ${u.slug})`);
  }
}
