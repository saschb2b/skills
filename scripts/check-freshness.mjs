#!/usr/bin/env node
// Freshness report for dated-snapshot skills (those using the
// "**Verified YYYY-MM-DD**" notes convention, e.g. javascript-ecosystem).
// A dated snapshot is technical debt; this lists the oldest entries so a
// maintainer knows what to re-verify against official docs first.
//
// Run:
//   node scripts/check-freshness.mjs
//   node scripts/check-freshness.mjs --max-age-days=120
//   node scripts/check-freshness.mjs --max-age-days=120 --fail   # exit 1 if any stale (CI gate)

import { readFileSync, readdirSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const repo = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const maxAge = Number(args.find((a) => a.startsWith("--max-age-days="))?.split("=")[1] ?? 180);
const fail = args.includes("--fail");

const now = new Date();
const ageDays = (d) => Math.floor((now - new Date(`${d}T00:00:00Z`)) / 86_400_000);

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });

const files = walk(join(repo, "skills")).filter((f) => f.endsWith(".md"));

// Per-tool notes files carry a "**Verified YYYY-MM-DD**" stamp.
const verifyRe = /\*\*Verified (\d{4}-\d{2}-\d{2})/;
const dated = [];
for (const f of files) {
  const m = readFileSync(f, "utf8").match(verifyRe);
  if (m) dated.push({ file: relative(repo, f), date: m[1], age: ageDays(m[1]) });
}
dated.sort((a, b) => b.age - a.age);

// SKILL.md frontmatter `date:` is the skill snapshot date.
const snapshots = files
  .filter((f) => f.endsWith("SKILL.md"))
  .map((f) => {
    const d = readFileSync(f, "utf8").match(/^date:\s*(\d{4}-\d{2}-\d{2})/m);
    return d ? { skill: relative(repo, dirname(f)), date: d[1], age: ageDays(d[1]) } : null;
  })
  .filter(Boolean)
  .sort((a, b) => b.age - a.age);

console.log(`Freshness report (today ${now.toISOString().slice(0, 10)}, threshold ${maxAge} days)\n`);

console.log("Skill snapshot dates (SKILL.md frontmatter `date`):");
for (const s of snapshots) {
  console.log(`  ${s.age > maxAge ? "STALE" : "ok   "} ${s.date} (${s.age}d)  ${s.skill}`);
}

const stale = dated.filter((d) => d.age > maxAge);
if (stale.length) {
  console.log(`\nStale notes (> ${maxAge} days). Refresh these first, official docs first:`);
  for (const d of stale) console.log(`  ${d.date} (${String(d.age).padStart(4)}d)  ${d.file}`);
} else if (dated.length) {
  console.log(`\nNo notes file older than ${maxAge} days. Oldest few to watch:`);
  for (const d of dated.slice(0, 5)) console.log(`  ${d.date} (${String(d.age).padStart(4)}d)  ${d.file}`);
}

console.log(`\n${stale.length} of ${dated.length} dated notes older than ${maxAge} days.`);
process.exit(fail && stale.length ? 1 : 0);
