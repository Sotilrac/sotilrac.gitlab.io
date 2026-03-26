#!/usr/bin/env node
/**
 * Generates a JSON file describing what needs to be updated in each post:
 * - Current image references in the markdown
 * - Available downloaded images
 * - Images from the Blogspot HTML that should be in the post
 * - Suggested fixes
 */

import { readFileSync, readdirSync, existsSync } from "fs";
import { writeFileSync } from "fs";
import { join, basename } from "path";

const REPORT_PATH = "_tools/blogspot-image-report.json";
const IMG_BASE = "img/blog";
const POSTS_DIR = "_posts";
const OUTPUT_PATH = "_tools/post-update-plan.json";

const report = JSON.parse(readFileSync(REPORT_PATH, "utf8"));

// Build a map of blogspot slug -> report entry (including the unmatched ones)
// We need to handle unmatched posts too
const repoFiles = readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));

// Manual mapping for unmatched posts
const manualMap = {
  batrang: "2009-03-10-the-batarang.md",
  "im-looking-for-job": "2008-07-22-im-looking-for-a-job.md",
  "repairing-shoelaces-with-heat-shinrk":
    "2008-01-31-repairing-shoelaces-heat-shrink.md",
  "arduino-launcher-for-kde-menu":
    "2007-08-17-arduino-launcher-for-the-kde-menu.md",
  "fully-featured-media-center-on-budget":
    "2007-07-15-fully-featured-media-center-on-a-budget.md",
  "bogot-rake": "2006-12-04-bogota-rake.md",
  "save-internet": "2006-09-23-save-the-internet.md",
};

const plan = [];

for (const entry of report) {
  // Find the repo file
  let repoFile = entry.repoFile;
  if (!repoFile) {
    // Try manual mapping using blogspot slug
    const bsSlug = entry.blogspotUrl.match(/\/([^/]+)\.html$/)?.[1];
    if (bsSlug && manualMap[bsSlug]) {
      repoFile = manualMap[bsSlug];
    }
  }
  if (!repoFile) continue; // Skip posts we can't match (creative-commons, etc.)

  const postSlug = repoFile
    .replace(/^\d{4}-\d{2}-\d{2}-/, "")
    .replace(/\.md$/, "");
  const imgDir = join(IMG_BASE, postSlug);

  // Get available downloaded images
  let availableImages = [];
  if (existsSync(imgDir)) {
    availableImages = readdirSync(imgDir).filter((f) =>
      /\.(jpe?g|png|gif|bmp|webp|svg)$/i.test(f),
    );
  }

  // Get blogspot images (successfully downloaded ones)
  const blogspotImages = entry.images
    .filter((i) => i.status === "downloaded" || i.status === "exists")
    .map((i) => ({
      localName: i.localName,
      originalUrl: i.url,
    }));

  // Read current post content
  const postPath = join(POSTS_DIR, repoFile);
  const content = readFileSync(postPath, "utf8");

  // Extract current image references
  const figRefs = [];
  const figRe = /\{%\s*fig\s+"([^"]*)"(?:\s*,\s*"([^"]*)")?\s*%\}/g;
  let m;
  while ((m = figRe.exec(content)) !== null) {
    figRefs.push({ path: m[1], caption: m[2] || "" });
  }

  const galleryRefs = [];
  const galleryRe =
    /\{%\s*gallery\s+(\d+)\s*,\s*((?:"[^"]*"(?:\s*,\s*)?)+)\s*%\}/g;
  while ((m = galleryRe.exec(content)) !== null) {
    galleryRefs.push({ columns: parseInt(m[1]), raw: m[0] });
  }

  // Determine what needs fixing
  const issues = [];

  // Check for bare filename references (no path prefix)
  for (const ref of figRefs) {
    if (ref.path && !ref.path.startsWith("/") && !ref.path.startsWith("http")) {
      issues.push({
        type: "bare_filename",
        current: ref.path,
        caption: ref.caption,
      });
    }
  }

  // Check for references to images that don't exist locally
  for (const ref of figRefs) {
    const expectedPath = ref.path.startsWith("/")
      ? ref.path.substring(1)
      : join(IMG_BASE, postSlug, ref.path);
    if (!existsSync(expectedPath)) {
      issues.push({
        type: "missing_image",
        current: ref.path,
        caption: ref.caption,
      });
    }
  }

  // Check if blogspot has images not referenced in the post
  if (
    blogspotImages.length > 0 &&
    figRefs.length === 0 &&
    !content.includes("youtube")
  ) {
    issues.push({
      type: "no_images_in_post",
      blogspotImageCount: blogspotImages.length,
    });
  }

  // Check image count mismatch (blogspot has more images)
  if (blogspotImages.length > figRefs.length + galleryRefs.length) {
    issues.push({
      type: "image_count_mismatch",
      postRefs: figRefs.length + galleryRefs.length,
      blogspotCount: blogspotImages.length,
    });
  }

  if (availableImages.length > 0 || issues.length > 0) {
    plan.push({
      repoFile,
      postSlug,
      title: entry.title,
      blogspotUrl: entry.blogspotUrl,
      availableImages,
      blogspotImages,
      currentFigRefs: figRefs,
      issues,
      needsUpdate: issues.length > 0,
    });
  }
}

// Sort: posts needing updates first
plan.sort((a, b) => {
  if (a.needsUpdate && !b.needsUpdate) return -1;
  if (!a.needsUpdate && b.needsUpdate) return 1;
  return a.repoFile.localeCompare(b.repoFile);
});

const needsUpdate = plan.filter((p) => p.needsUpdate);
console.log(`Total posts in plan: ${plan.length}`);
console.log(`Posts needing updates: ${needsUpdate.length}`);
console.log(`Posts already OK: ${plan.length - needsUpdate.length}`);

// Summary of issue types
const issueCounts = {};
for (const p of needsUpdate) {
  for (const i of p.issues) {
    issueCounts[i.type] = (issueCounts[i.type] || 0) + 1;
  }
}
console.log("Issue breakdown:", issueCounts);

// List posts needing update
console.log("\nPosts needing update:");
for (const p of needsUpdate) {
  const issueTypes = p.issues.map((i) => i.type).join(", ");
  console.log(`  ${p.repoFile} [${issueTypes}]`);
  console.log(
    `    available: ${p.availableImages.length}, blogspot: ${p.blogspotImages.length}, current refs: ${p.currentFigRefs.length}`,
  );
}

writeFileSync(OUTPUT_PATH, JSON.stringify(plan, null, 2));
console.log(`\nPlan saved to ${OUTPUT_PATH}`);
