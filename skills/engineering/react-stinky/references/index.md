---
okf_version: "0.2"
---

# Detection catalog, sweep passes, and background models behind the react-stinky skill.

The three operating documents, in the order a scan uses them:

- [React Stinky Catalog](catalog.md) - The full smell catalog, in nine pillars and 57 categories.
- [React Stinky: Duplication Pass](duplication-pass.md) - A sweep-level pass for cross-file duplication, the DRY smells a single-file scan cannot see.
- [React Stinky: Restructure Pass](restructure-pass.md) - A dependency-graph method for planning the fix when findings cluster on structural smells.

The background models the operating documents link into ([concepts/](concepts/index.md)):

- [Controlled vs Uncontrolled](concepts/controlled-uncontrolled.md) - Who owns a piece of interactive state, the value/onChange/defaultValue contract, and the key-remount reset.
- [Render Snapshots](concepts/render-snapshots.md) - Each render captures its own props, state, and functions; the model behind stale closures and dependency arrays.
- [Effects Are Synchronization](concepts/effects-model.md) - The render vs handler vs effect decision model behind every effect finding.
- [One Fact, One Home](concepts/one-fact-one-home.md) - Single source of truth at the lowest common ancestor; derive everything else during render.
- [Impossible States](concepts/impossible-states.md) - Discriminated unions, status unions, and exhaustiveness so invalid combinations cannot be expressed.
- [The Composition Layer](concepts/composition-layer.md) - The container/view split, behavior-named props, and the Storybook litmus.
- [Hydration and Render Purity](concepts/hydration.md) - Why server-rendered React runs every component twice and punishes impure renders.
