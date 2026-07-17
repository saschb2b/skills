# Background models behind the react-stinky catalog and passes.

- [Controlled vs Uncontrolled](controlled-uncontrolled.md) - Who owns a piece of interactive state, the value/onChange/defaultValue contract, and the key-remount reset.
- [Render Snapshots](render-snapshots.md) - Each render captures its own props, state, and functions; the model behind stale closures and dependency arrays.
- [Effects Are Synchronization](effects-model.md) - The render vs handler vs effect decision model behind every effect finding.
- [One Fact, One Home](one-fact-one-home.md) - Single source of truth at the lowest common ancestor; derive everything else during render.
- [Impossible States](impossible-states.md) - Discriminated unions, status unions, and exhaustiveness so invalid combinations cannot be expressed.
- [The Composition Layer](composition-layer.md) - The container/view split, behavior-named props, and the Storybook litmus.
- [Hydration and Render Purity](hydration.md) - Why server-rendered React runs every component twice and punishes impure renders.
