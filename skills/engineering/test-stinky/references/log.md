# Log

## 2026-07-27

**Migration to OKF v0.2.** Bundle retargeted from `okf_version` 0.1 to 0.2. Each concept's `timestamp` became `generated: { by, at }`, carrying the original datetime and naming `claude-code/unversioned` as the producing actor, since the bundles were agent-drafted and the specific model was never recorded per file. Any `# Citations` body section moved into the `sources` frontmatter family as `{ resource, title }` entries. No `verified` events were added: nothing here has been through a recorded human or process confirmation, and asserting one would inflate the trust tier the field exists to report. Validated with `okf-validate --strict`; the migration introduced no new findings.

## 2026-07-17

**Creation and enrichment.** Bundle created with the three operating documents: the 49-category smell catalog in nine pillars, the sweep-level suite pass with the slimming procedure, and the eight-gate mechanical enforcement stack, grounded in a survey of the okf-viewer test suite (god test files, silent env-gated passes, sleep-loop polling, copy-paste helpers, an unrun CI lane). Same day, the entity pass added the `concepts/` directory: seven background concepts for the load-bearing names the operating documents used without explaining (test pyramid and placement, test doubles, flakiness, hermeticity and lanes, DAMP vs DRY, mutation testing, property-based testing), linked from the documents with the relationships named in prose. Crawl boundary: sources are the canonical testing literature cited per entry (Meszaros, Google Testing Blog, SWE at Google, Fowler, Kent C. Dodds, Playwright docs); no live-web crawl was run.
