#!/usr/bin/env node
// Extract each model's `base_instructions` from a models.json dump into a
// sibling `<slug>.md` file. Defaults to the file used by the no-goblins post.
//
// Usage:
//   node _tools/extract-codex-prompts.mjs [path/to/models.json]

import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(fileURLToPath(import.meta.url), "../..");
const defaultJson = join(repoRoot, "img/blog/no-goblins/models.json");
const jsonPath = resolve(process.argv[2] ?? defaultJson);
const outDir = dirname(jsonPath);

const raw = JSON.parse(await readFile(jsonPath, "utf8"));
const models = Array.isArray(raw) ? raw : (raw.models ?? []);
if (!models.length) {
  console.error(`No models found in ${jsonPath}`);
  process.exit(1);
}

let written = 0;
for (const m of models) {
  const slug = m.slug;
  const body = m.base_instructions;
  if (!slug || !body) {
    console.warn(
      `Skipping entry without slug/base_instructions:`,
      slug ?? "(no slug)",
    );
    continue;
  }
  const header = [
    `# ${m.display_name ?? slug}`,
    "",
    `Model: \`${slug}\``,
    m.description ? `Description: ${m.description}` : null,
    `Source: extracted from \`${jsonPath.replace(repoRoot + "/", "")}\``,
    "",
    "---",
    "",
  ]
    .filter((line) => line !== null)
    .join("\n");
  const out = join(outDir, `${slug}.md`);
  await writeFile(out, header + body + (body.endsWith("\n") ? "" : "\n"));
  console.log(`wrote ${out} (${body.length} chars)`);
  written++;
}
console.log(`\nDone. ${written} file(s) written to ${outDir}`);
