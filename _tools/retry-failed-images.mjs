#!/usr/bin/env node
/**
 * Retries failed image downloads with alternative URL patterns.
 */

import {
  writeFileSync,
  readFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
} from "fs";
import { join, basename } from "path";

const REPORT_PATH = "_tools/blogspot-image-report.json";
const IMG_BASE = "img/blog";

function sanitizeFilename(name) {
  return decodeURIComponent(name)
    .replace(/\+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

async function tryDownload(url, destPath) {
  try {
    const resp = await fetch(url, { redirect: "follow" });
    if (!resp.ok) return false;
    const buf = Buffer.from(await resp.arrayBuffer());
    if (buf.length < 100) return false; // too small, probably error page
    writeFileSync(destPath, buf);
    return buf.length;
  } catch {
    return false;
  }
}

async function main() {
  const report = JSON.parse(readFileSync(REPORT_PATH, "utf8"));

  let fixed = 0;
  let stillFailed = 0;

  for (const post of report) {
    for (const img of post.images) {
      if (img.status !== "failed") continue;
      const url = img.url;

      // Skip non-image URLs (revver, slideshare, youtube, etc.)
      if (/revver|slideshare|youtube|nexodyne/.test(url)) continue;

      const imgDir = join(IMG_BASE, post.imgSlug);
      if (!existsSync(imgDir)) mkdirSync(imgDir, { recursive: true });

      const urlObj = new URL(url);
      const rawName = basename(urlObj.pathname);
      const localName = sanitizeFilename(rawName);
      const destPath = join(imgDir, localName);

      // Already downloaded in a previous run?
      if (existsSync(destPath)) {
        fixed++;
        continue;
      }

      // Generate alternative URLs to try
      const alts = [];

      if (url.includes("photos1.blogger.com")) {
        // Try original patterns: /200/, /320/, /400/, /800/, /1600/
        // The original URL format might be photos1.blogger.com/blogger/4122/3639/SIZE/filename
        // or photos1.blogger.com/x/blogger/4122/3639/SIZE/SIZE/filename
        const base = url.replace(/\/1600\/([^/]+)$/, "");
        for (const size of ["1600", "800", "400", "320", "200"]) {
          alts.push(`${base}/${size}/${rawName}`);
        }
        // Also try without /x/ prefix and with single size dir
        const altBase = url
          .replace("/x/blogger/", "/blogger/")
          .replace(/\/1600\/1600\//, "/1600/")
          .replace(/\/1600\/([^/]+)$/, "");
        for (const size of ["1600", "800", "400", "320", "200"]) {
          alts.push(`${altBase}/${size}/${rawName}`);
        }
      }

      if (/\d\.bp\.blogspot\.com/.test(url)) {
        // Try different size params
        for (const size of ["s1600", "s800", "s400", "s320", "s200"]) {
          alts.push(url.replace(/\/s0\//, `/${size}/`));
        }
        // Also try -h variants
        for (const size of ["s1600-h", "s800-h", "s400-h"]) {
          alts.push(url.replace(/\/s0\//, `/${size}/`));
        }
      }

      // Try external URLs as-is (they were already tried with the original URL)
      if (!url.includes("blogger") && !url.includes("blogspot")) {
        // Try HTTPS version
        if (url.startsWith("http://")) {
          alts.push(url.replace("http://", "https://"));
        }
      }

      let success = false;
      for (const alt of alts) {
        const size = await tryDownload(alt, destPath);
        if (size) {
          console.log(`  OK (${size}b): ${localName} <- ${alt}`);
          img.status = "downloaded";
          img.size = size;
          img.retryUrl = alt;
          fixed++;
          success = true;
          break;
        }
        await new Promise((r) => setTimeout(r, 50));
      }

      if (!success) {
        console.log(`  FAIL: ${post.title} - ${localName}`);
        stillFailed++;
      }
    }
  }

  console.log(`\nFixed: ${fixed}, Still failed: ${stillFailed}`);
  writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
}

main().catch(console.error);
