// Shared helpers for the scripts in _tools/. Also the single definition of the
// post-slug rule, imported by eleventy.config.mjs and _posts/_posts.11tydata.mjs.

import { readdirSync } from "node:fs";

export const POSTS_DIR = "_posts";
export const DRAFTS_DIR = "_drafts";

// Post filenames carry a YYYY-MM-DD- prefix that the permalink drops.
export const postSlug = (fileSlug) =>
  fileSlug.replace(/^\d{4}-\d{2}-\d{2}-/, "");

// Markdown filenames in _posts/, unsorted.
export const listPosts = (dir = POSTS_DIR) =>
  readdirSync(dir).filter((f) => f.endsWith(".md"));

// Minimal `--flag value` parser. Unknown flags are ignored.
export function parseArgs(argv, flags) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "-h" || a === "--help") out.help = true;
    else if (flags.includes(a.replace(/^--/, ""))) out[a.slice(2)] = argv[++i];
  }
  return out;
}
