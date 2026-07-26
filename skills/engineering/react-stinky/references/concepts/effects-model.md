---
type: Concept
title: "Effects Are Synchronization"
description: "The decision model behind every effect finding; an effect exists to synchronize with a system outside React, everything else belongs in render or in a handler."
tags: [react, effects, lifecycle, mental-model]
generated: { by: claude-code/unversioned, at: 2026-07-17T00:00:00Z }
sources:
  - resource: https://react.dev/learn/synchronizing-with-effects
    title: "React, Synchronizing with Effects"
  - resource: https://react.dev/learn/you-might-not-need-an-effect
    title: "React, You Might Not Need an Effect"
  - resource: https://react.dev/learn/lifecycle-of-reactive-effects
    title: "React, Lifecycle of Reactive Effects"
---
# Effects Are Synchronization

An effect has exactly one legitimate job: **keep something outside React in sync with the component while it is displayed** (a subscription, a browser API, a non-React widget, a network resource). Every effect finding in the [catalog's](../catalog.md) pillar 3 (categories 26 to 31) is code using an effect for one of the two jobs that belong elsewhere.

```mermaid
flowchart TD
    Q{"Why does this code run?"}
    Q -->|"to compute a value from data already in render scope"| R["During render.<br/>No effect, no state. (26)"]
    Q -->|"because the user did something"| H["In that event handler. (27, 28)"]
    Q -->|"because the component is on screen and something external must follow it"| E["An effect, with cleanup<br/>and honest deps. (29, 30)"]
```

## The corollaries

- **Derived data is a render-time computation.** An effect that only calls `setState` from props or state adds a render cycle and a value that can drift (category 26 and [one-fact-one-home](one-fact-one-home.md)).
- **An event's consequences belong to the event.** Firing a POST because a flag flipped, or a parent callback from an effect watching internal state, delivers the news one render late and tangles causality (27, 28). The handler that caused the change makes the call, in the same event.
- **Synchronization implies desynchronization.** Whatever the effect sets up, the cleanup tears down: abort the fetch, remove the listener, close the socket (29). An effect without cleanup for an external resource is a leak or a race by construction.
- **The dependency array is the sync condition**, not a scheduling tool. It declares which values the synchronization reads ([render snapshots](render-snapshots.md)); editing it to control *when* the effect runs is the smell behind most `[]` bugs (30).
- **State reset is not synchronization.** Restarting state because an identity changed is `key={id}` at the call site, not an effect (31, and [controlled-uncontrolled](controlled-uncontrolled.md)).
