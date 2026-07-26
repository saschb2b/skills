## 2026-07-27

**Migration to OKF v0.2.** Bundle retargeted from `okf_version` 0.1 to 0.2. Each concept's `timestamp` became `generated: { by, at }`, carrying the original datetime and naming `claude-code/unversioned` as the producing actor, since the bundles were agent-drafted and the specific model was never recorded per file. Any `# Citations` body section moved into the `sources` frontmatter family as `{ resource, title }` entries. No `verified` events were added: nothing here has been through a recorded human or process confirmation, and asserting one would inflate the trust tier the field exists to report. Validated with `okf-validate --strict`; the migration introduced no new findings.

## 2026-07-12

- **Update**: Added research-backed navigation signals, contract and diagnostic guidance, documentation placement, ADR thresholds, and a primary-source evidence synthesis.
- **Creation**: Added the knowledge smell catalog, repair patterns, scope rails, and worked examples for progressive disclosure from the breadcrumbs skill.
