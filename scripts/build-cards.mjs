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
