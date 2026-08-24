# The enrichment state machine

`/odsf enrich <urls…>` and `/odsf export <url>` with a web source both run this machine. It turns any set of seed references — a brand site, a docs site, a Storybook, a published token file — into a holistic bundle, and it is built around the two failure modes a single pass always hits: **partial coverage** (the second look at a page finds the quicklink row, the stat band, the share rail the first look skated over) and **plausible invention** (a value or glyph name that came from the agent, not the source). The machine kills the first with a persistent coverage ledger and a loop-until-dry exit, and the second with an evidence rule that every state enforces.

**The evidence rule, in force everywhere:** every value the bundle asserts — a hex, a padding, a font weight, a duration, an icon codepoint, a class name, an ARIA attribute — must be traceable to a fetched artifact (a CSS rule or a DOM node). The stylesheet proposes; the DOM confirms (long-lived sites ship dead generations of CSS side by side). Nothing is named by guess: icon glyphs get the names the source CSS gives them, aliases included.

## The ledger

State lives in the bundle, not in the conversation, so the machine survives session boundaries and interruptions. Two artifacts:

- **`references/<slug>.md`** per fetched page (`type: Reference`, standard OKF provenance) — what it is, when fetched, what it contributed.
- **`references/coverage.md`** (`type: Reference`) — the machine's working memory:

```markdown
# Pages
| URL | Fetched | Inventoried | Last sweep | Dry |
|-----|---------|-------------|------------|-----|
| /            | 2026-08-17 | yes | 2026-08-18 | no |

# Units
| Unit | Kind | Seen on | State | Concept |
|------|------|---------|-------|---------|
| button-primary | component | / | verified | /components/button.md |
| stat band      | component | / | inventoried | — |
```

Unit states advance monotonically: `inventoried → authored → reconciled → verified`. A unit regresses to `authored` when a later page contradicts it. The machine is done only when every page row is `Dry: yes` and every unit row is `verified`.

## States

**S0 · SCOPE.** Classify each seed (live site, docs site, Storybook, token export, design.md). Set crawl bounds: allowed hosts, a page cap, a depth cap; pick the representative page set for a live site (home, a category page, a detail page, a form page — plus whatever the user points at). Initialize the ledger. → S1.

**S1 · HARVEST.** Fetch the frontier: page HTML *and* every linked stylesheet, including font CSS. Discover in-scope URLs (nav, sitemap) and enqueue within bounds; keep raw snapshots for later diffing; mint the page's `references/<slug>.md`. → S2.

**S2 · INVENTORY.** Per page: walk the DOM and list every distinct module/component with its real classes. Globally, from the CSS: color/font/breakpoint/shadow histograms, class-root census, the **complete icon-class → codepoint map**, and an asset census (icon fonts, logo SVGs, watermark SVGs, their URLs). Write every unit into the ledger as `inventoried`. → S3 on the first cycle, S4 after.

**S3 · FOUNDATIONS.** Author the token foundations from the histograms, each value DOM-confirmed; project `tokens.css`. Download the publicly served assets and embed them as data URIs in the bundle CSS (the bundle stays `.md`/`.html`/`.css`); substitute only unshippable licensed text faces, with documented fallbacks. Every foundation ships its demo asset — swatch sheet with on-color pairings, type specimen, scale bars, live motion hovers, and for iconography the **full gallery**: every icon class rendered from the real font with name and codepoint. → S4.

**S4 · UNITS.** Pull the next `inventoried` unit from the ledger. Find its markup in the fetched pages; take classes, structure, and ARIA from there; where CSS offers two generations, author the one the DOM renders and note the other as legacy. Write the concept (its `# Structure` from the DOM's own layout facts, not from a screenshot impression), its example asset and, for a non-trivial layout, its wireframe (`asset` step 4), its `components.css` rules (`var(--…)` only); wire links; mark `authored`. Static examples never open in an error state — validation classes belong after first interaction. Loop S4 until no `inventoried` units remain. → S5 once, else S7.

**S5 · COMPOSE.** Author the composition pattern (`patterns/landing-page.md` or the domain's equivalent): one example that rebuilds a full real page of the source from the bundle's own classes, header to footer, nothing bespoke, plus its wireframe — the page skeleton (regions, source order, spacing rhythm, the collapse story) judged with the skin stripped, since a composition is structure before it is anything else. Link it from the overview as "the whole system composed". → S6.

**S6 · WIRE.** Indexes at every level, cross-links labeled in prose, `log.md`. → S7.

**S7 · RECONCILE.** Diff every authored value against the reference stylesheet: paddings, sizes *and weights*, line-heights, durations, rotations, codepoints and their names. Fix mismatches; a fixed unit's stale `verified` events drop with it. Mark surviving units `reconciled`. → S8.

**S8 · RENDER-VERIFY.** Screenshot every example (headless browser) beside the live site. Fix what differs — clipped or wrapping layout under fallback fonts, wrong glyph directions, states that should not exist at rest. A layout mismatch is easier to localize in the wireframe, where the skin cannot distract; shoot it at more than one width when the difference is structural. Re-shoot until it matches; mark units `verified`. → S9.

**S9 · SWEEP.** Re-walk one fetched page end to end and diff its DOM inventory against the ledger. Anything new → new `inventoried` rows, page marked `Dry: no`, → S4. Nothing new → page marked `Dry: yes`. Any page not dry → S9 on the next page. All pages dry and all units verified → the coverage gate, then S10.

**The holistic coverage gate.** Page sweeps find what the pages show; they never ask what a design system *should* contain. Before sealing, walk the canonical anatomy and, for each section, either the bundle has it or the ledger records **why not** ("no evidence in source" is a valid and honest answer; silence is not):

- *Foundations*: color, typography, iconography, spacing, layout/grid, elevation/shape, motion — plus the ones single passes always miss: an **interactive-states matrix** (one behavior, not per-component notes), a **layering/z-index scale** (the CSS census will show one), and **imagery** (what photography looks like, scrims, decorative textures — on a brand site this is a signature, not a nicety).
- *Content*: a **`Voice` concept** — naming conventions (trademark prefixes are hard evidence in the copy), tagline usage, register, localization surface. Mark observational parts `draft`.
- *Access*: an **`Accessibility` concept** consolidating the ARIA contracts you verified from the DOM, the contrast pairs the palette guarantees, and the focus policy — the per-component notes cite it, not the other way round.
- *Navigation aids*: a **site-vocabulary reference** mapping the production markup's dialect (its module names, its internal prefixes, which generation is current) to bundle concepts, so a consumer reading live pages can orient.
- *Facts about absence*: what the source deliberately lacks (no dark mode, no data-viz, no illustration system) is itself knowledge — record it in the owning foundation instead of leaving the question open.

A gap found here is a new `inventoried` unit → S4. The gate passes when every canonical section is either shipped or accounted for. → S10.

**S10 · SEAL.** `node odsf-validate.mjs <bundle> --strict` to zero errors *and* zero warnings, a closing `log.md` entry, and a coverage report to the user: pages crawled, units shipped, anything deliberately skipped and why. Halt.

## Interrupts

At any state, new input re-enters the machine instead of being handled ad hoc:

- **User shows a new URL or screenshot** → enqueue as a page (S1) or, for a screenshot, inventory it directly (S2); its units join the ledger and the affected pages lose `Dry`.
- **User corrects a detail** ("your breadcrumb is wrong") → regress the unit to `authored`, re-enter S4 for it with the DOM open, then S7/S8 for it. If the correction reveals a *method* gap, also re-sweep every page (`Dry: no` across the board) — one wrong unit usually has siblings.
- **A page changed upstream** (re-fetch differs from snapshot) → refresh the reference concept, re-inventory the page, regress contradicted units.

## Bounds and honesty

The crawl is bounded (hosts, page cap, depth) and the caps are reported, never silently hit. Fetches respect the source: summarize-and-cite prose, never paste it; embed only assets the site serves publicly, and record in the overview what was embedded and what was substituted. The ledger is part of the bundle's provenance — leave it in; a consumer reading `coverage.md` learns exactly how far the clone goes.
