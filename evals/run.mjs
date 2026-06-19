#!/usr/bin/env node
// Skill-invocation eval runner.
//
// Measures whether the CURRENT skill descriptions make the model auto-invoke
// the right skill, the wrong one, or none, over a set of realistic prompts. It
// reads descriptions live from skills/**/SKILL.md, so it doubles as a
// regression gate after a description edit.
//
// No API key and no model id: the classification "text run" is done by the
// agent this already runs inside (or one of its subagents), or by any command
// you wire via the EVAL_CLASSIFIER env var. The runner only validates, builds
// the task manifest, and scores answers. All deterministic.
//
//   node evals/run.mjs --build        # validate + write evals/results/manifest.json
//   node evals/run.mjs --score        # read evals/results/answers.json -> table
//   node evals/run.mjs                # build, then classify if EVAL_CLASSIFIER is set, then score
//
// Flags: --samples N (default 1), --only <skill>.
// Agent flow (no classifier wired): run --build, hand evals/results/manifest.json
// to a subagent for a text run, have it write evals/results/answers.json as
// [{ "id": "...", "choice": "<skill-name|NONE>" }], then run --score.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { discoverSkills, loadCases, validate, buildTasks, systemPrompt, resultsDir } from "./lib.mjs";

const argv = process.argv.slice(2);
const has = (n) => argv.includes(n);
const val = (n, d) => { const i = argv.indexOf(n); return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : d; };
const SAMPLES = Math.max(1, parseInt(val("--samples", process.env.EVAL_SAMPLES || "1"), 10));
const ONLY = val("--only", null);
const manifestPath = join(resultsDir, "manifest.json");
const answersPath = join(resultsDir, "answers.json");

const mode = has("--score") ? "score" : has("--build") ? "build" : "auto";

// score only needs the manifest + answers; build/auto need fresh validation.
if (mode === "score") {
  score();
} else {
  const skills = discoverSkills();
  const loaded = loadCases();
  const { errors } = validate(skills, loaded);
  if (errors.length) {
    for (const e of errors) console.error(`error ${e}`);
    console.error(`\n${errors.length} validation errors. Fix evals/cases first (pnpm eval:validate).`);
    process.exit(1);
  }
  build(skills, loaded);
  if (mode === "auto") {
    if (process.env.EVAL_CLASSIFIER) { classifyWithCommand(); score(); }
    else printAgentInstructions();
  }
}

// ---------------------------------------------------------------- build
function build(skills, loaded) {
  const allTasks = buildTasks(loaded, SAMPLES);
  const tasks = ONLY ? allTasks.filter((t) => t.owner === ONLY || t.expect === ONLY) : allTasks;
  const manifest = {
    built_at: new Date().toISOString(),
    samples: SAMPLES,
    skills: skills.map((s) => s.name),
    system: systemPrompt(skills),
    tasks,
  };
  mkdirSync(resultsDir, { recursive: true });
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`built ${tasks.length} tasks (${SAMPLES} sample(s)) -> evals/results/manifest.json`);
}

// ---------------------------------------------------------------- classify (optional CLI)
function classifyWithCommand() {
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const cmd = process.env.EVAL_CLASSIFIER;
  const answers = [];
  let done = 0;
  process.stdout.write(`classifying ${manifest.tasks.length} tasks via EVAL_CLASSIFIER `);
  for (const t of manifest.tasks) {
    const input = `${manifest.system}\n\nRequest: ${t.prompt}\n\nAnswer with one skill name or NONE:`;
    const r = spawnSync("sh", ["-c", cmd], { input, encoding: "utf8" });
    answers.push({ id: t.id, choice: (r.stdout || "").trim() });
    if (++done % 10 === 0) process.stdout.write(".");
  }
  process.stdout.write(" done\n");
  writeFileSync(answersPath, JSON.stringify(answers, null, 2));
}

// ---------------------------------------------------------------- score
function normalize(raw, names) {
  if (raw == null) return undefined;
  const lines = String(raw).split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const last = (lines[lines.length - 1] || "").replace(/[`'".]/g, "").trim();
  if (/^none$/i.test(last)) return null;
  const lc = last.toLowerCase();
  if (names.has(lc)) return lc;
  const hit = [...names].find((n) => new RegExp(`(^|[^a-z0-9-])${n}([^a-z0-9-]|$)`, "i").test(String(raw)));
  if (/\bnone\b/i.test(String(raw)) && !hit) return null;
  return hit || "__UNPARSED__";
}

function score() {
  if (!existsSync(manifestPath)) { console.error(`No manifest. Run: node evals/run.mjs --build`); process.exit(2); }
  if (!existsSync(answersPath)) { console.error(`No answers at evals/results/answers.json. See --build instructions.`); process.exit(2); }
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const rawAnswers = JSON.parse(readFileSync(answersPath, "utf8"));
  const names = new Set(manifest.skills.map((n) => n.toLowerCase()));
  const byId = new Map();
  const arr = Array.isArray(rawAnswers) ? rawAnswers : Object.entries(rawAnswers).map(([id, choice]) => ({ id, choice }));
  for (const a of arr) byId.set(a.id, normalize(a.choice, names));

  const perSkill = new Map();
  const findings = [];
  let nothingN = 0, nothingD = 0, unanswered = 0, unparsed = 0;
  const label = (c) => (c === null ? "none" : c === undefined ? "unanswered" : c === "__UNPARSED__" ? "unparsed" : c);

  for (const t of manifest.tasks) {
    const c = byId.get(t.id);
    if (c === undefined) { unanswered++; continue; }
    if (c === "__UNPARSED__") unparsed++;
    const acc = perSkill.get(t.owner) || { rN: 0, rD: 0, sN: 0, sD: 0, dN: 0, dD: 0 };
    const owner = (t.owner || "").toLowerCase();
    const expect = (t.expect || "").toLowerCase();
    if (t.bucket === "should_fire") {
      acc.rD++; if (c === owner) acc.rN++; else findings.push(`[recall]   ${t.owner} missed "${t.prompt}" -> ${label(c)}`);
    } else if (t.bucket === "route_to_sibling") {
      acc.dD++; if (c === expect) acc.dN++; else findings.push(`[route]    want ${t.expect} for "${t.prompt}" -> ${label(c)}`);
    } else if (t.bucket === "should_not_fire") {
      acc.sD++; if (c !== owner && c !== "__UNPARSED__") acc.sN++; else if (c === owner) findings.push(`[over]     ${t.owner} fired on "${t.prompt}"`);
    } else if (t.bucket === "fire_nothing") {
      nothingD++; if (c === null) nothingN++; else findings.push(`[spurious] unrelated "${t.prompt}" -> ${label(c)}`);
    }
    perSkill.set(t.owner, acc);
  }

  const pct = (n, d) => (d ? `${Math.round((100 * n) / d)}%` : "  --");
  const pad = (s, n) => String(s).padEnd(n);
  const lpad = (s, n) => String(s).padStart(n);
  console.log(`\nmodel run: ${manifest.tasks.length} tasks, ${manifest.samples} sample(s)`);
  console.log(`\n${pad("skill", 22)}${lpad("recall", 14)}${lpad("specificity", 14)}${lpad("disambig", 12)}`);
  console.log("-".repeat(62));
  const rows = [...perSkill.entries()].filter(([o]) => o && o !== "none").sort((a, b) => a[0].localeCompare(b[0]));
  let R = { n: 0, d: 0 }, S = { n: 0, d: 0 }, D = { n: 0, d: 0 };
  for (const [owner, a] of rows) {
    R.n += a.rN; R.d += a.rD; S.n += a.sN; S.d += a.sD; D.n += a.dN; D.d += a.dD;
    console.log(
      pad(owner, 22) +
      lpad(a.rD ? `${pct(a.rN, a.rD)} (${a.rN}/${a.rD})` : "--", 14) +
      lpad(a.sD ? `${pct(a.sN, a.sD)} (${a.sN}/${a.sD})` : "--", 14) +
      lpad(a.dD ? `${pct(a.dN, a.dD)} (${a.dN}/${a.dD})` : "--", 12)
    );
  }
  console.log("-".repeat(62));
  console.log(pad("OVERALL", 22) + lpad(pct(R.n, R.d), 14) + lpad(pct(S.n, S.d), 14) + lpad(pct(D.n, D.d), 12));
  if (nothingD) console.log(`abstention on unrelated prompts: ${pct(nothingN, nothingD)} (${nothingN}/${nothingD})`);
  if (unanswered) console.log(`unanswered tasks (no entry in answers.json): ${unanswered}`);
  if (unparsed) console.log(`unparsable answers: ${unparsed}`);

  console.log(`\nrecall = fires the owner when it should; specificity = stays quiet when it should not;`);
  console.log(`disambig = the intended sibling wins on an overlapping prompt.`);
  if (findings.length) { console.log(`\nfindings (${findings.length}):`); for (const f of findings.sort()) console.log(`  ${f}`); }
  else console.log(`\nNo findings. Every answered prompt routed as expected.`);

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  writeFileSync(join(resultsDir, `score-${stamp}.json`), JSON.stringify({ at: stamp, overall: { R, S, D, abstention: { n: nothingN, d: nothingD } }, perSkill: Object.fromEntries(perSkill) }, null, 2));
}

// ---------------------------------------------------------------- agent instructions
function printAgentInstructions() {
  console.log(`\nNo EVAL_CLASSIFIER set, so the classification is an agent text run.`);
  console.log(`Next steps:`);
  console.log(`  1. Read evals/results/manifest.json (it holds 'system' and 'tasks').`);
  console.log(`  2. For each task, given 'system', decide the one skill name or NONE for task.prompt.`);
  console.log(`     Do this yourself or hand the manifest to a subagent for a clean text run.`);
  console.log(`  3. Write evals/results/answers.json as [{ "id": task.id, "choice": "<skill|NONE>" }].`);
  console.log(`  4. Run: node evals/run.mjs --score`);
  console.log(`\n(To fully automate instead, set EVAL_CLASSIFIER to a command that reads a prompt`);
  console.log(` on stdin and prints one skill name or NONE, e.g. a headless agent CLI.)`);
}
