#!/usr/bin/env node
// Validate every skill against the conventions in CLAUDE.md before they bite.
// Hard-fails (exit 1) on the traps that silently drop a skill from the build:
//   - frontmatter value containing ": " (gray-matter throws, skill vanishes)
//   - frontmatter value containing " #" (YAML eats the rest as a comment)
//   - name missing or not matching the folder
//   - description missing or over 1024 chars
//   - skill folder not registered in .claude-plugin/plugin.json
//   - a relative markdown link inside the skill that does not resolve
// Soft-warns when a skill is not linked from the root or bucket README.
//
// Run: node scripts/check-skills.mjs

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname, relative, basename, sep } from "node:path";
import { fileURLToPath } from "node:url";

const repo = join(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const warnings = [];

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });

const plugin = JSON.parse(readFileSync(join(repo, ".claude-plugin/plugin.json"), "utf8"));
const registered = new Set(plugin.skills.map((s) => s.replace(/^\.\//, "")));
const rootReadme = readFileSync(join(repo, "README.md"), "utf8");

const skillFiles = walk(join(repo, "skills")).filter((f) => f.endsWith("SKILL.md"));

for (const file of skillFiles) {
  const skillDir = dirname(file);
  const slug = basename(skillDir);
  // Normalize to forward slashes so comparisons match plugin.json on Windows too.
  const rel = relative(repo, skillDir).split(sep).join("/");
  const text = readFileSync(file, "utf8");

  // Frontmatter must be the first block, fenced by --- lines (tolerate CRLF).
  const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) {
    errors.push(`${rel}: no frontmatter block`);
    continue;
  }
  const fields = {};
  for (const line of fm[1].split(/\r?\n/)) {
    if (!line.trim() || /^\s/.test(line)) continue; // skip nested/indented YAML
    const idx = line.indexOf(": ");
    const key = (idx === -1 ? line.replace(/:$/, "") : line.slice(0, idx)).trim();
    const value = idx === -1 ? "" : line.slice(idx + 2);
    fields[key] = value;
    if (value.includes(": ")) errors.push(`${rel}: frontmatter "${key}" contains ': ' (breaks YAML parsing)`);
    if (/\s#/.test(value)) errors.push(`${rel}: frontmatter "${key}" contains ' #' (YAML comment, value truncated)`);
  }

  if (!fields.name) errors.push(`${rel}: missing 'name'`);
  else if (fields.name !== slug) errors.push(`${rel}: name '${fields.name}' != folder '${slug}'`);

  if (!fields.description) errors.push(`${rel}: missing 'description'`);
  else if (fields.description.length > 1024) errors.push(`${rel}: description ${fields.description.length} chars (> 1024)`);

  if (!registered.has(rel)) errors.push(`${rel}: not registered in .claude-plugin/plugin.json`);
  if (!rootReadme.includes(slug)) warnings.push(`${rel}: slug not mentioned in root README.md`);

  // Every relative link in every file under the skill must resolve.
  for (const md of walk(skillDir).filter((f) => f.endsWith(".md"))) {
    const body = readFileSync(md, "utf8");
    for (const m of body.matchAll(/\]\((\.[^)]+)\)/g)) {
      const target = join(dirname(md), m[1].split("#")[0]);
      if (!existsSync(target)) errors.push(`${relative(repo, md)}: broken link -> ${m[1]}`);
    }
  }
}

for (const w of warnings) console.warn(`warn  ${w}`);
for (const e of errors) console.error(`error ${e}`);
console.log(`\nChecked ${skillFiles.length} skills. ${errors.length} errors, ${warnings.length} warnings.`);
process.exit(errors.length ? 1 : 0);
