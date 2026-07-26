---
type: Concept
title: "Render Snapshots"
description: "Each render captures its own props, state, and functions; the mental model behind stale closures, functional updates, and the latest-value ref."
tags: [react, closures, state, mental-model]
generated: { by: claude-code/unversioned, at: 2026-07-17T00:00:00Z }
sources:
  - resource: https://react.dev/learn/state-as-a-snapshot
    title: "React, State as a Snapshot"
  - resource: https://react.dev/learn/queueing-a-series-of-state-updates
    title: "React, Queueing a Series of State Updates"
  - resource: https://react.dev/learn/referencing-values-with-refs
    title: "React, Referencing Values with Refs"
---
# Render Snapshots

A component's function body runs once per render, and everything it defines, variables, JSX, and every function created in it, closes over **that render's** props and state. State does not change inside a render; a new value means a new render with a new snapshot. This is the single model behind the [catalog's](../catalog.md) stale-closure findings (category 23) and half of its effect-dependency findings (category 30).

## What follows from it

- **A handler sees the render it was created in.** `setCount(count + 1)` twice in one handler adds one, not two: both calls read the same snapshot. When the next state depends on the previous, use the functional update `setCount(c => c + 1)`, which reads the queue, not the snapshot.
- **Long-lived callbacks freeze their snapshot.** A `setInterval`, subscription, or listener created once (`[]` deps) reads the first render's values forever. Either re-create it when its inputs change (honest dependency array), or route the freshest value through a ref an effect keeps updated; a ref is a box shared across renders, not part of any snapshot.
- **`await` is a time machine.** Code after `await` runs in a later world but still reads the old snapshot; state read there is not the state a `setState` above just queued. Carry local variables across the gap instead of re-reading state.
- **Dependency arrays are snapshot declarations.** The array lists which snapshot values the effect reads; a mismatch means the effect lies about its inputs (category 30). The fix is an honest array or fewer inputs, never a silencing comment.
