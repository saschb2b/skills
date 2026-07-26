---
type: Concept
title: "Agent Context Collapse"
description: "Why coding agents systematically write comments about the edit rather than the code, and why the failure is structural rather than careless."
tags: [agents, comments, failure-modes]
generated: { by: claude-code/unversioned, at: 2026-07-26T00:00:00Z }
sources:
  - resource: https://web.stanford.edu/~ouster/cgi-bin/book.php
    title: "Ousterhout, A Philosophy of Software Design, ch. 15, \"Write the comments first\""
  - resource: https://google.github.io/eng-practices/review/developer/cl-descriptions.html
    title: "Google Engineering Practices, Writing good CL descriptions"
---
# Agent Context Collapse

Change narration is not an occasional slip in agent-written code. It is the default output of the situation the agent is in, which is why it needs a mechanical gate rather than a reminder to be careful.

## The mechanism

Four properties of a coding agent's working state push every comment toward the diff:

1. **The working context is the change.** The agent is holding the old code, the new code, and the reason for the transition. That reason is the freshest, most salient thing available when a comment is needed, so it is what gets written.
2. **The immediate audience is the reviewer.** The agent is about to hand over a diff for approval. Everything it writes in that turn is shaped by wanting the diff to be understood and accepted, and a comment is just more surface for that argument. This is the origin of [reviewer-defense](../catalog.md) and [prompt-echo](../catalog.md).
3. **The success signal is the turn, not the year.** Nothing in the loop rewards a comment that is still useful in eighteen months, and nothing penalizes one that stops parsing after the next commit. The feedback that would correct this arrives long after the session ends.
4. **The task framing is transitional by construction.** The instruction was "make X do Y". A comment written to that framing narrates the transition, because the transition is what the agent was asked about. Nobody asked it to describe the resulting artifact.

The result is a comment that is true, well-written, relevant to the moment, and dead on arrival. It documents a state transition in a medium that only ever displays the destination.

## Why humans do it less

Not because they are more disciplined. Because their context decays. A developer who returns to a file after a week has already lost the diff, so their comments naturally address the file. An agent's context is maximally fresh at exactly the moment it writes, so it never gets that free correction. The gap widens rather than closes as agents get better at holding context.

## What follows

- The correction cannot come from taste, because the comment reads correctly to the author at the time of writing. It has to come from a check applied at write time. That is [write-gate.md](../write-gate.md).
- The check has to be cheap, because it runs on every comment. Four questions, and the first failure ends it.
- The material the check rejects is usually good material aimed at the wrong artifact, so the gate routes rather than deletes. See [information-routing.md](./information-routing.md) and [commit-message-craft.md](./commit-message-craft.md).
- The same collapse produces the inverse smell. Because the agent is focused on the delta, the non-obvious decisions it did not change go uncommented, which is Pillar 3 of the [catalog](../catalog.md). A file can be dense with commentary about last week's edit and silent about the invariant that will break production.

This concept is the reason the skill's default mode is implicit rather than on request. A review-time skill catches the smell after it has shipped; the whole value is in catching it in the turn that writes it. The audience asymmetry it collapses is described in [comment-audience.md](./comment-audience.md).
