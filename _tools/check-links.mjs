#!/usr/bin/env node
/**
 * Checks external links in old posts (<=2011) for liveness,
 * then looks up Wayback Machine snapshots for dead ones.
 *
 * Usage: node _tools/check-links.mjs
 * Output: _tools/link-report.json
 */

import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";

const POSTS_DIR = "_posts";
const REPORT_PATH = "_tools/link-report.json";

// Domains to skip checking (known-alive major sites)
const SKIP_DOMAINS = new Set([
  "en.wikipedia.org",
  "www.wikipedia.org",
  "wikipedia.org",
  "www.youtube.com",
  "youtube.com",
  "youtu.be",
  "vimeo.com",
  "www.python.org",
  "www.gnu.org",
  "creativecommons.org",
  "www.arduino.cc",
  "arduino.cc",
]);

function extractLinks(content) {
  const links = [];
  // Match markdown links [text](url) and [text](url "title")
  const re = /\[([^\]]*)\]\((https?:\/\/[^)\s]+)(?:\s+"[^"]*")?\)/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    links.push({ text: m[1], url: m[2] });
  }
  return links;
}

function getDomain(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

async function checkAlive(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const resp = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (link checker)" },
    });
    clearTimeout(timeout);
    return { alive: resp.ok, status: resp.status };
  } catch (e) {
    // Try GET if HEAD fails
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const resp = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: { "User-Agent": "Mozilla/5.0 (link checker)" },
      });
      clearTimeout(timeout);
      return { alive: resp.ok, status: resp.status };
    } catch (e2) {
      return { alive: false, status: "error", error: e2.message };
    }
  }
}

async function findWayback(url, dateStr) {
  // Use CDX API to find closest snapshot with status 200
  const year = dateStr.slice(0, 4);
  const from = `${Math.max(2005, parseInt(year) - 1)}0101`;
  const to = `${parseInt(year) + 2}1231`;

  const cdxUrl = `https://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(url)}&output=json&fl=timestamp,original,statuscode&filter=statuscode:200&limit=1&from=${from}&to=${to}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const resp = await fetch(cdxUrl, { signal: controller.signal });
    clearTimeout(timeout);
    if (!resp.ok) return null;
    const data = await resp.json();
    // data[0] is headers, data[1] is first result
    if (data.length < 2) return null;
    const [timestamp, original] = data[1];
    return {
      waybackUrl: `https://web.archive.org/web/${timestamp}/${original}`,
      timestamp,
    };
  } catch {
    return null;
  }
}

async function main() {
  // Collect all links from posts <= 2011
  const posts = readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .filter((f) => {
      const year = parseInt(f.slice(0, 4));
      return year >= 2006 && year <= 2011;
    });

  const allLinks = [];
  const seen = new Set();

  for (const file of posts) {
    const content = readFileSync(join(POSTS_DIR, file), "utf8");

    // Skip frontmatter
    const bodyMatch = content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
    if (!bodyMatch) continue;
    const body = bodyMatch[1];

    // Remove commented lines
    const cleanBody = body.replace(/\{#[\s\S]*?#\}/g, "");

    const links = extractLinks(cleanBody);
    const postDate = file.slice(0, 10); // YYYY-MM-DD

    for (const link of links) {
      // Skip internal links
      if (
        link.url.startsWith("/") ||
        link.url.includes("/blog/") ||
        link.url.includes("/img/")
      )
        continue;

      const domain = getDomain(link.url);
      if (!domain) continue;
      if (SKIP_DOMAINS.has(domain)) continue;

      const key = link.url;
      if (seen.has(key)) continue;
      seen.add(key);

      allLinks.push({ ...link, file, postDate, domain });
    }
  }

  console.log(`Found ${allLinks.length} unique external links to check`);

  // Check liveness in batches of 3
  const report = [];
  for (let i = 0; i < allLinks.length; i += 3) {
    const batch = allLinks.slice(i, i + 3);
    const results = await Promise.all(
      batch.map(async (link) => {
        process.stdout.write(".");
        const liveness = await checkAlive(link.url);
        return { ...link, ...liveness };
      }),
    );
    report.push(...results);
    // Small delay between batches
    await new Promise((r) => setTimeout(r, 300));
  }

  const alive = report.filter((r) => r.alive);
  const dead = report.filter((r) => !r.alive);

  console.log(`\n\nAlive: ${alive.length}, Dead: ${dead.length}`);

  // Look up Wayback Machine for dead links
  console.log(`\nLooking up Wayback Machine for ${dead.length} dead links...`);

  for (let i = 0; i < dead.length; i++) {
    process.stdout.write(".");
    const link = dead[i];
    const wb = await findWayback(link.url, link.postDate);
    if (wb) {
      link.waybackUrl = wb.waybackUrl;
      link.waybackTimestamp = wb.timestamp;
    }
    // Rate limit: ~1 req/sec
    await new Promise((r) => setTimeout(r, 1000));
  }

  const withWayback = dead.filter((r) => r.waybackUrl);
  const noWayback = dead.filter((r) => !r.waybackUrl);

  console.log(
    `\n\nDead with Wayback: ${withWayback.length}, Dead without Wayback: ${noWayback.length}`,
  );

  // Save full report
  writeFileSync(
    REPORT_PATH,
    JSON.stringify(
      {
        summary: {
          total: report.length,
          alive: alive.length,
          dead: dead.length,
          withWayback: withWayback.length,
          noWayback: noWayback.length,
        },
        alive: alive.map((r) => ({
          url: r.url,
          file: r.file,
          status: r.status,
        })),
        dead: dead.map((r) => ({
          url: r.url,
          text: r.text,
          file: r.file,
          postDate: r.postDate,
          status: r.status,
          waybackUrl: r.waybackUrl || null,
        })),
      },
      null,
      2,
    ),
  );

  console.log(`Report saved to ${REPORT_PATH}`);
}

main().catch(console.error);
