#!/usr/bin/env node
// Validate the skill-invocation eval cases: every file in evals/cases/ must be
// valid YAML, conform to the case schema, and together cover every skill.
// Pure Node, no model and no network. Run before you commit a description edit.
//
//   node evals/validate.mjs      (or: pnpm eval:validate)

import { discoverSkills, loadCases, validate } from "./lib.mjs";

const skills = discoverSkills();
const loaded = loadCases();
const { errors } = validate(skills, loaded);

for (const e of errors) console.error(`error ${e}`);
console.log(`\nValidated ${loaded.cases.length} case files against ${skills.length} skills. ${errors.length} errors.`);
process.exit(errors.length ? 1 : 0);
