# Log

## 2026-07-27

**Migration to OKF v0.2.** Bundle retargeted from `okf_version` 0.1 to 0.2. Each concept's `timestamp` became `generated: { by, at }`, carrying the original datetime and naming `claude-code/unversioned` as the producing actor, since the bundles were agent-drafted and the specific model was never recorded per file. Any `# Citations` body section moved into the `sources` frontmatter family as `{ resource, title }` entries. No `verified` events were added: nothing here has been through a recorded human or process confirmation, and asserting one would inflate the trust tier the field exists to report. Validated with `okf-validate --strict`; the migration introduced no new findings.

## 2026-07-17

**Enrichment (entity pass).** Added the `concepts/` directory: seven background models the catalog and passes leaned on but never explained (controlled vs uncontrolled, render snapshots, effects are synchronization, one fact one home, impossible states, the composition layer, hydration and render purity). Linked the catalog, duplication pass, and restructure pass into the concept graph with relationships named in prose (also curing the restructure pass's orphan status), refreshed the touched timestamps, and regenerated the root index. Crawl boundary: sources are the canonical React and TypeScript documentation already cited per catalog entry; no live-web crawl was run.

## 2026-07-03

**Update.** Catalog extended to nine pillars and 57 categories; restructure pass added.

## 2026-06-16

**Creation.** Bundle created with the smell catalog and the duplication pass, distilled from the cant-maintain React API-design challenge set and the canonical React, TypeScript, MDN, Next.js, and MUI documentation.
