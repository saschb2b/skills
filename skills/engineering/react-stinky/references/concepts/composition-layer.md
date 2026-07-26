---
type: Concept
title: "The Composition Layer"
description: "The container/view split; environment access lives at the page or container layer, views receive behavior-named props, and the Storybook litmus decides which side code is on."
tags: [react, architecture, container-view, decoupling]
generated: { by: claude-code/unversioned, at: 2026-07-17T00:00:00Z }
sources:
  - resource: https://react.dev/learn/thinking-in-react
    title: "React, Thinking in React"
  - resource: https://react.dev/learn/passing-data-deeply-with-context
    title: "React, Passing Data Deeply with Context"
  - resource: https://martinfowler.com/bliki/PresentationDomainSeparation.html
    title: "Fowler, Presentation-Domain Separation"
---
# The Composition Layer

A component tree has one layer whose job is **knowing about the environment**: pages, route components, containers, and the hooks composed there. Everything below it is views, which receive facts and callbacks as props and could render anywhere. The [catalog's](../catalog.md) coupled-view category (33) polices the boundary, the god-component category (32) usually marks its absence, and the [restructure pass](../restructure-pass.md) is the method for moving it; its reach-out edge is precisely an environment access below this layer.

## The litmus

**Does it render in Storybook (or a unit test) from plain props, with no mocks?** A view does. Anything that first needs the network, a store, a provider stack, or the router mocked is carrying composition-layer duties below the composition layer.

## The boundary rules

- Data access (`useQuery`, `fetch`, api modules), global stores, and the router are composition-layer vocabulary. In a view they are reach-out edges to hoist.
- Props crossing the boundary are named for the **behavior they drive**, not the data's origin: `canEdit`, `dueLabel`, `onSubmit`, `items`. A view receiving `user.subscription.tier` to compute editability has been handed the environment's shape; hand it the decision instead.
- Domain rules (pricing, permissions, validation) become plain functions above the view: testable without React, reusable outside it.
- Extracting a fetch into a hook the view still calls **moves** the coupling, not removes it; the hook composes at the layer, and its results travel down as props.

## What is not a violation

The composition layer itself doing all of the above is the pattern working, not a smell. A narrow app-wide context read through a documented hook (theme, locale, session) is ambient, not environment coupling (category 25 governs its structure). A small one-off component that will never render in isolation does not owe anyone a container split.
