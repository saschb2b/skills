// Shared helpers for the skill-invocation evals: skill discovery, case loading
// (real YAML via the `yaml` package), schema validation, task building, and the
// classification system prompt. Imported by validate.mjs and run.mjs.

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

export const here = dirname(fileURLToPath(import.meta.url));
export const repo = join(here, "..");
export const casesDir = join(here, "cases");
export const resultsDir = join(here, "results");

export const BUCKETS = ["should_fire", "route_to_sibling", "should_not_fire", "fire_nothing"];

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });

// Read name + description straight from each SKILL.md frontmatter, so the eval
// always tests the descriptions you actually ship.
export function discoverSkills() {
  const out = [];
  for (const f of walk(join(repo, "skills")).filter((f) => f.endsWith("SKILL.md"))) {
    const text = readFileSync(f, "utf8");
    const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!fm) continue;
    const fields = {};
    for (const line of fm[1].split(/\r?\n/)) {
      if (!line.trim() || /^\s/.test(line)) continue; // skip nested/indented YAML
      const idx = line.indexOf(": ");
      if (idx < 0) continue;
      fields[line.slice(0, idx).trim()] = line.slice(idx + 2);
    }
    if (fields.name && fields.description) out.push({ name: fields.name, description: fields.description });
  }
  out.sort((a, b) => a.name.localeCompare(b.name));
  return out;
}

// Parse every case file with a real YAML parser. A parse failure is a hard
// error (this is the "yaml validator" the cases are checked against).
export function loadCases() {
  const files = existsSync(casesDir) ? readdirSync(casesDir).filter((f) => /\.ya?ml$/.test(f)).sort() : [];
  const cases = [];
  const parseErrors = [];
  for (const file of files) {
    const raw = readFileSync(join(casesDir, file), "utf8");
    try {
      cases.push({ file, doc: parse(raw) ?? {} });
    } catch (e) {
      parseErrors.push(`${file}: invalid YAML, ${String(e.message).split("\n")[0]}`);
    }
  }
  return { files, cases, parseErrors };
}

// Schema + coverage checks. Returns { errors } (empty means clean).
export function validate(skills, loaded) {
  const errors = [...loaded.parseErrors];
  const names = new Set(skills.map((s) => s.name));
  const owners = new Set();

  for (const { file, doc } of loaded.cases) {
    const slug = file.replace(/\.ya?ml$/, "");
    const isUnrelated = slug.startsWith("_");
    if (typeof doc !== "object" || Array.isArray(doc) || doc === null) {
      errors.push(`${file}: top level must be a mapping`);
      continue;
    }
    for (const k of Object.keys(doc)) if (k !== "owner" && !BUCKETS.includes(k)) errors.push(`${file}: unknown key '${k}'`);

    const owner = doc.owner;
    if (!owner) errors.push(`${file}: missing 'owner'`);
    else if (!isUnrelated) {
      owners.add(owner);
      if (!names.has(owner)) errors.push(`${file}: owner '${owner}' is not a known skill`);
      if (owner !== slug) errors.push(`${file}: owner '${owner}' does not match filename '${slug}'`);
    }

    for (const b of ["should_fire", "should_not_fire", "fire_nothing"]) {
      if (doc[b] == null) continue;
      if (!Array.isArray(doc[b])) { errors.push(`${file}: '${b}' must be a list`); continue; }
      doc[b].forEach((v, i) => { if (typeof v !== "string" || !v.trim()) errors.push(`${file}: ${b}[${i}] must be a non-empty string`); });
    }

    if (doc.route_to_sibling != null) {
      if (!Array.isArray(doc.route_to_sibling)) errors.push(`${file}: 'route_to_sibling' must be a list`);
      else
        doc.route_to_sibling.forEach((v, i) => {
          if (typeof v !== "object" || Array.isArray(v) || v === null) {
            errors.push(`${file}: route_to_sibling[${i}] must be a {prompt, expect} mapping`);
            return;
          }
          if (typeof v.prompt !== "string" || !v.prompt.trim()) errors.push(`${file}: route_to_sibling[${i}].prompt must be a non-empty string`);
          if (typeof v.expect !== "string" || !v.expect.trim()) errors.push(`${file}: route_to_sibling[${i}].expect must be a non-empty string`);
          else {
            if (!names.has(v.expect)) errors.push(`${file}: route_to_sibling[${i}].expect '${v.expect}' is not a known skill`);
            if (v.expect === owner) errors.push(`${file}: route_to_sibling[${i}].expect equals owner '${owner}'`);
          }
        });
    }
  }

  for (const s of skills) if (!owners.has(s.name)) errors.push(`coverage: skill '${s.name}' has no case file in evals/cases/`);
  return { errors };
}

// Flatten cases into ordered, stable-id tasks. One task per (prompt, sample).
export function buildTasks(loaded, samples) {
  const tasks = [];
  for (const { file, doc } of loaded.cases) {
    const owner = doc.owner;
    const add = (bucket, idx, prompt, expect) => {
      for (let s = 0; s < samples; s++) tasks.push({ id: `${file}#${bucket}#${idx}#s${s}`, file, owner, bucket, prompt, expect: expect ?? null });
    };
    (doc.should_fire || []).forEach((p, i) => add("should_fire", i, p));
    (doc.route_to_sibling || []).forEach((r, i) => add("route_to_sibling", i, r.prompt, r.expect));
    (doc.should_not_fire || []).forEach((p, i) => add("should_not_fire", i, p));
    (doc.fire_nothing || []).forEach((p, i) => add("fire_nothing", i, p));
  }
  return tasks;
}

// The neutral routing prompt. Lists the live descriptions and asks for one
// skill name or NONE, mirroring how Claude Code decides to auto-invoke.
export function systemPrompt(skills) {
  const list = skills.map((s) => `- ${s.name}: ${s.description}`).join("\n");
  return [
    "You route a single user request to at most one skill.",
    "Each skill below packages a procedure an agent applies when it genuinely fits the request.",
    "",
    "Given the request, decide which one skill should auto-activate, exactly as you would mid-task.",
    "Reply with ONLY the exact skill name. If no skill clearly fits, reply with exactly NONE.",
    "Do not explain, and do not force a skill onto an unrelated request.",
    "",
    "Skills:",
    list,
  ].join("\n");
}
