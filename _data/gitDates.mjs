import { execFileSync } from "node:child_process";

// Committer date of the last commit that edited the body of each file under
// _posts/, keyed by repo-relative path, from one pass over `git log -p`
// (newest first). Feeds the `updated` computed field in
// _posts/_posts.11tydata.mjs.
//
// Skipped:
// - Root commits. In a shallow clone the boundary commit shows every file as
//   added; a post beyond the clone depth gets no date instead of a wrong one.
// - Mass edits touching MASS_EDIT posts or more: formatting passes, tag
//   overhauls and the Blogspot import. Real edits here touch at most four.
// - Frontmatter-only changes (tags, status): every changed line is within the
//   first FRONTMATTER_LINES lines and shaped like YAML. Renames are detected
//   (-M) so a redate does not count either.
const MASS_EDIT = 5;
const FRONTMATTER_LINES = 30;
const YAML_LINE = /^[+-](---|[A-Za-z_]+:.*|\s+- .*)$/;
const HUNK = /^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/;

// True when a file's diff touches anything past the frontmatter.
function editsBody(diff) {
  for (const line of diff.split("\n")) {
    const h = HUNK.exec(line);
    if (h) {
      if (+h[1] + (h[2] === undefined ? 1 : +h[2]) - 1 > FRONTMATTER_LINES) {
        return true;
      }
      continue;
    }
    if (
      (line[0] === "+" || line[0] === "-") &&
      !line.startsWith("+++") &&
      !line.startsWith("---") &&
      !YAML_LINE.test(line)
    ) {
      return true;
    }
  }
  return false;
}

export default function () {
  const git = (...args) =>
    execFileSync("git", args, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      maxBuffer: 256 * 1024 * 1024,
    });
  let log;
  try {
    if (git("rev-parse", "--is-shallow-repository").trim() === "true") {
      console.warn(
        "[gitDates] shallow clone: posts older than the clone depth get no updated date",
      );
    }
    log = git(
      "log",
      "--format=%x1e%cI%x1f%P",
      "-p",
      "-M",
      "--unified=0",
      "--no-color",
      "--",
      "_posts",
    );
  } catch (err) {
    if (process.env.CI) throw err;
    console.warn("[gitDates] git log failed, no updated dates");
    return {};
  }
  const dates = {};
  for (const record of log.split("\x1e").slice(1)) {
    const nl = record.indexOf("\n");
    const [date, parents] = record.slice(0, nl).split("\x1f");
    if (!parents) continue;
    const files = record
      .slice(nl + 1)
      .split(/^diff --git /m)
      .slice(1)
      .map((d) => ({ path: /^\+\+\+ b\/(.+)$/m.exec(d)?.[1], diff: d }))
      .filter((f) => f.path?.endsWith(".md"));
    if (files.length >= MASS_EDIT) continue;
    for (const f of files) {
      if (!(f.path in dates) && editsBody(f.diff)) dates[f.path] = date;
    }
  }
  return dates;
}
