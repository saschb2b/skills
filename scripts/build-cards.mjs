#!/usr/bin/env node
// Build cards.json: the combined render feed of every skill's trust card.
// Each entry is the skill's card evidence plus the gradient verify computes
// against the live bundle. Regenerate after a skill or its CARD.md changes:
//   pnpm cards
import { execFileSync } from "node:child_process";
import { readdirSync, existsSync, writeFileSync } from "node:fs";

const CARD = "skills/engineering/trust-card/scripts/card.py";
const buckets = ["engineering", "productivity"];
const skills = [];

for (const bucket of buckets) {
  const base = `skills/${bucket}`;
  for (const name of readdirSync(base).sort()) {
    const dir = `${base}/${name}`;
    if (!existsSync(`${dir}/SKILL.md`)) continue;
    if (!existsSync(`${dir}/CARD.md`)) {
      console.warn(`skip ${name}: no CARD.md (run: python3 ${CARD} generate ${dir})`);
      continue;
    }
    const out = execFileSync(
      "python3",
      [CARD, "verify", `${dir}/CARD.md`, "--bundle", dir, "--json"],
      { encoding: "utf8" },
    );
    skills.push({ skill: name, bucket, ...JSON.parse(out) });
  }
}

const doc = { repo: "saschb2b/skills", card_version: "0.1", count: skills.length, skills };
writeFileSync("cards.json", JSON.stringify(doc, null, 2) + "\n");
console.log(`wrote cards.json: ${skills.length} skills`);

// --check (CI): fail if any card is stale vs its live bundle. Pair with
// `git diff --exit-code -- cards.json` to also catch a cards.json left unbuilt.
if (process.argv.includes("--check")) {
  const stale = skills.filter((s) => s.grades?.integrity !== "STRONG").map((s) => s.skill);
  if (stale.length) {
    console.error(`stale cards (integrity not STRONG; regenerate with 'card.py generate'): ${stale.join(", ")}`);
    process.exit(1);
  }
  console.log("cards check: all integrity STRONG");
}
