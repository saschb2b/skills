---
type: Concept
title: "Comment Decay"
description: "Why comments drift out of agreement with the code, which kinds rot fastest, and the structural properties that slow it down."
tags: [comments, maintenance, staleness]
generated: { by: claude-code/unversioned, at: 2026-07-26T00:00:00Z }
sources:
  - resource: https://web.stanford.edu/~ouster/cgi-bin/book.php
    title: "Ousterhout, A Philosophy of Software Design, ch. 16, \"Modifying Existing Code\""
  - resource: https://martinfowler.com/bliki/CodeAsDocumentation.html
    title: "Fowler, CodeAsDocumentation"
  - resource: https://doc.rust-lang.org/rustdoc/write-documentation/documentation-tests.html
    title: "rustdoc, Documentation tests"
---
# Comment Decay

A comment is the only artifact in a codebase that can be wrong without anything noticing. The compiler does not read it, the tests do not run it, and the reviewer of the change that invalidated it was looking three lines lower. So comments do not merely age; they drift silently into being false, and a false comment is worse than no comment because the reader trusts it and stops reading the code ([stale-comment](../catalog.md)).

## What determines the rot rate

Three properties, in order of effect:

1. **Rung.** A comment on the [what rung](./why-not-what.md) is invalidated by any edit to the line beneath it. A comment on the why rung is invalidated only when the underlying force changes, which is rare. This alone is most of the difference.
2. **Distance.** A comment far from what it describes is not seen by the person changing that thing. Rationale about a constant, written at a call site three files away, is invisible at the moment it becomes wrong. This is why the fix for [wrong-altitude](../catalog.md) is placement rather than wording.
3. **Multiplicity.** The same rationale in four places cannot be updated in one edit, so it drifts partially, which is the worst state: some copies are right and the reader cannot tell which ([duplicated-rationale](../catalog.md)).

## The structural defenses

Ranked by how much they actually help:

- **Move the fact into something enforceable.** A type, an assertion, or a test fails when it becomes wrong. This is the only defense that is not a matter of discipline, and it is the argument in [information-routing.md](./information-routing.md).
- **Make examples executable.** Doctests, rustdoc examples, and docstring examples turn a class of documentation into code the build checks, which is why [lying-doc](../catalog.md) is largely preventable in ecosystems that support them.
- **Write why, not what.** Fewer invalidating events per comment.
- **Keep the comment adjacent to what it describes,** and state each fact exactly once, at the thing it is about.
- **Anchor to names, not positions.** "See `flushStaged`" survives a reorder; "see the block below" does not ([orphaned-anchor](../catalog.md)).

## Decay and change narration are the same failure, seen from different ends

A change-narrating comment is not merely useless on arrival. It is **pre-decayed**: it describes a state that stopped existing at the moment of the commit that introduced it, so it enters the codebase already referring to something the reader cannot find. Every property that makes ordinary comments rot slowly, adjacency, enforceability, present-tense claims about the current code, is absent from it by construction.

That is the connection between this concept and [agent-context-collapse.md](./agent-context-collapse.md): the volume of agent-written code makes the rot rate matter more, and the agent's natural comment style produces the fastest-rotting kind. The audit for the accumulated result is the [catalog](../catalog.md); the prevention is the [write gate](../write-gate.md).
