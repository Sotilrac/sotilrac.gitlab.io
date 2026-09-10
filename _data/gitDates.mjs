import { execFileSync } from "node:child_process";

// Committer date of the last commit touching each file under _posts/, keyed by
// repo-relative path, from one pass over the log (newest first). Feeds the
// `updated` computed field in _posts/_posts.11tydata.mjs.
//
// Two kinds of commit are skipped:
// - Root commits. In a shallow clone the boundary commit shows every file as
//   added, which would stamp every old post with that date. Skipping roots
//   means a post beyond the clone depth gets no date instead of a wrong one.
// - Mass edits, meaning commits touching MASS_EDIT posts or more: formatting
//   passes, tag overhauls and the Blogspot import touch every post without
//   updating any of them. In this history real edits touch at most four.
const MASS_EDIT = 5;

export default function () {
  const git = (...args) =>
    execFileSync("git", args, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
  let log;
  try {
    if (git("rev-parse", "--is-shallow-repository").trim() === "true") {
      console.warn(
        "[gitDates] shallow clone: posts older than the clone depth get no updated date",
      );
    }
    log = git("log", "--format=%x1e%cI%x1f%P", "--name-only", "--", "_posts");
  } catch {
    console.warn("[gitDates] git log failed, no updated dates");
    return {};
  }
  const dates = {};
  for (const record of log.split("\x1e").slice(1)) {
    const [head, ...files] = record.split("\n");
    const [date, parents] = head.split("\x1f");
    const posts = files.filter((f) => f.endsWith(".md"));
    if (!parents || posts.length >= MASS_EDIT) continue;
    for (const file of posts) {
      if (!(file in dates)) dates[file] = date;
    }
  }
  return dates;
}
