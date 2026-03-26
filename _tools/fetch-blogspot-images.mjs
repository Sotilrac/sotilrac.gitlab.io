#!/usr/bin/env node
/**
 * Fetches images from the old Blogspot blog and saves them locally.
 * Also generates a JSON report mapping posts to their images.
 *
 * Usage: node _tools/fetch-blogspot-images.mjs
 */

import { writeFileSync, mkdirSync, existsSync, readdirSync } from "fs";
import { join, basename } from "path";

const FEED_URL =
  "https://carlitoscontraptions.blogspot.com/feeds/posts/default?max-results=500";
const IMG_BASE = "img/blog";
const POSTS_DIR = "_posts";
const REPORT_PATH = "_tools/blogspot-image-report.json";

// --- Helpers ---

function slugFromUrl(url) {
  // e.g. https://carlitoscontraptions.blogspot.com/2009/03/smoking-cyclops.html
  const match = url.match(/\/(\d{4})\/(\d{2})\/([^.]+)\.html/);
  if (!match) return null;
  return { year: match[1], month: match[2], slug: match[3] };
}

function extractImages(html) {
  const imgs = [];
  // Match src= in <img> and <a href=> wrapping images
  const srcRe =
    /(?:src|href)\s*=\s*["']([^"']+?(?:\.(?:jpe?g|png|gif|bmp|webp|svg))(?:[^"']*)?)["']/gi;
  let m;
  while ((m = srcRe.exec(html)) !== null) {
    let url = m[1].replace(/&amp;/g, "&");
    if (url && !imgs.includes(url)) imgs.push(url);
  }
  // Also get images from <a> tags that link to full-size images on blogger
  const aHrefRe =
    /href\s*=\s*["'](https?:\/\/(?:blogger\.googleusercontent\.com|photos1\.blogger\.com|[0-9]\.bp\.blogspot\.com)[^"']+)["']/gi;
  while ((m = aHrefRe.exec(html)) !== null) {
    let url = m[1].replace(/&amp;/g, "&");
    if (url && !imgs.includes(url)) imgs.push(url);
  }
  return imgs;
}

function toBigUrl(url) {
  // blogger.googleusercontent.com: /s320/ -> /s0/ (original)
  if (url.includes("blogger.googleusercontent.com")) {
    return url.replace(/\/s\d+(-[a-z])?\//, "/s0/");
  }
  // photos1.blogger.com: /200/ -> /1600/
  if (url.includes("photos1.blogger.com")) {
    return url.replace(/\/\d+\/([^/]+)$/, "/1600/$1");
  }
  // N.bp.blogspot.com: /sNNN/ -> /s0/
  if (/\d\.bp\.blogspot\.com/.test(url)) {
    return url.replace(/\/s\d+(-[a-z])?\//, "/s0/");
  }
  return url;
}

function sanitizeFilename(name) {
  return decodeURIComponent(name)
    .replace(/\+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function findRepoPost(year, month, blogspotSlug, repoFiles) {
  // Normalize the blogspot slug for comparison
  const norm = blogspotSlug.replace(/-/g, "").toLowerCase();
  const prefix = `${year}-${month}`;

  // First pass: exact prefix + slug substring match
  for (const f of repoFiles) {
    if (!f.startsWith(prefix)) continue;
    const repoSlug = f.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.md$/, "");
    const repoNorm = repoSlug.replace(/-/g, "").toLowerCase();
    if (
      repoNorm === norm ||
      repoNorm.includes(norm) ||
      norm.includes(repoNorm)
    ) {
      return f;
    }
  }

  // Second pass: just year match + slug
  for (const f of repoFiles) {
    if (!f.startsWith(year)) continue;
    const repoSlug = f.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.md$/, "");
    const repoNorm = repoSlug.replace(/-/g, "").toLowerCase();
    if (
      repoNorm === norm ||
      repoNorm.includes(norm) ||
      norm.includes(repoNorm)
    ) {
      return f;
    }
  }

  return null;
}

async function downloadImage(url, destPath) {
  try {
    const resp = await fetch(url, { redirect: "follow" });
    if (!resp.ok) {
      // Try HTTP if HTTPS fails
      if (url.startsWith("https://")) {
        const httpUrl = url.replace("https://", "http://");
        const resp2 = await fetch(httpUrl, { redirect: "follow" });
        if (!resp2.ok) return { ok: false, status: resp2.status };
        const buf = Buffer.from(await resp2.arrayBuffer());
        writeFileSync(destPath, buf);
        return { ok: true, size: buf.length };
      }
      return { ok: false, status: resp.status };
    }
    const buf = Buffer.from(await resp.arrayBuffer());
    writeFileSync(destPath, buf);
    return { ok: true, size: buf.length };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// Deduplicate images that are the same file at different sizes
function dedupeImages(urls) {
  const seen = new Map();
  for (const url of urls) {
    const big = toBigUrl(url);
    const fname = basename(new URL(big).pathname);
    if (!seen.has(fname) || big.length > seen.get(fname).length) {
      seen.set(fname, big);
    }
  }
  return [...seen.values()];
}

// --- Main ---

async function main() {
  console.log("Fetching Atom feed...");
  const resp = await fetch(FEED_URL);
  const xml = await resp.text();

  // Parse entries
  const entries = [];
  const entryRe = /<entry>([\s\S]*?)<\/entry>/g;
  let em;
  while ((em = entryRe.exec(xml)) !== null) {
    const block = em[1];
    const title = block.match(/<title[^>]*>([^<]*)<\/title>/)?.[1] || "";
    const published = block.match(/<published>([^<]*)<\/published>/)?.[1] || "";
    const content =
      block.match(/<content[^>]*>([\s\S]*?)<\/content>/)?.[1] || "";
    const altLink =
      block.match(/<link[^>]*rel='alternate'[^>]*href='([^']*)'/)?.[1] || "";

    // Decode HTML entities in content
    const decoded = content
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");

    entries.push({ title, published, url: altLink, html: decoded });
  }

  console.log(`Found ${entries.length} posts in feed`);

  // Get repo post files
  const repoFiles = readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));

  const report = [];
  let totalDownloaded = 0;
  let totalFailed = 0;
  let totalSkipped = 0;

  for (const entry of entries) {
    const parsed = slugFromUrl(entry.url);
    if (!parsed) {
      console.log(`  SKIP (no slug): ${entry.title}`);
      continue;
    }

    const repoFile = findRepoPost(
      parsed.year,
      parsed.month,
      parsed.slug,
      repoFiles,
    );

    const rawImages = extractImages(entry.html);
    const images = dedupeImages(rawImages);

    // Determine the image directory slug from the repo file or blogspot slug
    let imgSlug;
    if (repoFile) {
      imgSlug = repoFile
        .replace(/^\d{4}-\d{2}-\d{2}-/, "")
        .replace(/\.md$/, "");
    } else {
      imgSlug = parsed.slug;
    }

    const imgDir = join(IMG_BASE, imgSlug);

    const postReport = {
      title: entry.title,
      blogspotUrl: entry.url,
      repoFile: repoFile || null,
      imgSlug,
      images: [],
    };

    if (images.length === 0) {
      report.push(postReport);
      continue;
    }

    // Create image directory
    if (!existsSync(imgDir)) {
      mkdirSync(imgDir, { recursive: true });
    }

    // Check which images already exist
    const existing = existsSync(imgDir) ? readdirSync(imgDir) : [];

    for (const imgUrl of images) {
      const urlObj = new URL(imgUrl);
      const rawName = basename(urlObj.pathname);
      const localName = sanitizeFilename(rawName);
      const destPath = join(imgDir, localName);

      // Skip if already exists and has content
      if (existing.includes(localName)) {
        postReport.images.push({
          url: imgUrl,
          localName,
          status: "exists",
        });
        totalSkipped++;
        continue;
      }

      const result = await downloadImage(imgUrl, destPath);
      if (result.ok) {
        postReport.images.push({
          url: imgUrl,
          localName,
          status: "downloaded",
          size: result.size,
        });
        totalDownloaded++;
        process.stdout.write(".");
      } else {
        postReport.images.push({
          url: imgUrl,
          localName,
          status: "failed",
          error: result.status || result.error,
        });
        totalFailed++;
        process.stdout.write("x");
      }

      // Rate limit
      await new Promise((r) => setTimeout(r, 100));
    }

    report.push(postReport);
  }

  console.log(
    `\n\nDone! Downloaded: ${totalDownloaded}, Failed: ${totalFailed}, Skipped (existing): ${totalSkipped}`,
  );

  writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  console.log(`Report saved to ${REPORT_PATH}`);
}

main().catch(console.error);
