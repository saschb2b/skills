---
type: Concept
title: "Non-Obvious Information"
description: "The test that decides whether a comment should exist at all, why the knowledge it captures is unrecoverable rather than merely inconvenient to recover, and how to find the gaps."
tags: [comments, design, rationale]
timestamp: 2026-07-26T00:00:00Z
---
# Non-Obvious Information

The single criterion for whether a comment should exist: **does it record something a competent reader cannot determine from the code?** Everything else is a corollary.

Ousterhout's formulation is that comments exist to capture information that was in the designer's head but could not be represented in the code. That framing does two things at once. It rules out the entire redundancy pillar, because anything the code represents is by definition not in this category. And it rules *in* an obligation, because information that was in the designer's head and got written nowhere is simply lost when they leave, no matter how clean the code is.

## Why it is unrecoverable, not just inconvenient

Reading code recovers what it does. It cannot recover:

- **The alternatives that were rejected.** Nothing in a depth-first traversal records that breadth-first was tried and reordered the render. The next person tries it again.
- **The forces from outside the file.** A vendor quota, a browser bug, a regulation, a wire format's alignment rule, a downstream consumer's assumption. None of it is in the repository at all.
- **The measurements.** That the loop was rewritten because profiling showed it at 40% of frame time is not visible in the rewritten loop, which now looks like premature optimization.
- **The hazards.** That hoisting this read out of the loop breaks on the second pass is knowable only by having broken it.

Code preserves conclusions and discards reasoning. The reasoning is the entire content of a good comment, which is why the [why rung](./why-not-what.md) is the only one worth a line.

## Finding what is missing

The redundancy pillars are found by reading comments. This one is found by reading *code* and asking, at each decision, whether a stranger could reconstruct it. The reliable prompts, which are Pillar 3 of the [catalog](../catalog.md):

- A tuned literal. Why this number and not one twice as large?
- Code a reasonable reader would delete as pointless. What breaks without it?
- A local convention broken in exactly one place. Why here?
- An empty handler, an ignored result, a swallowed error. Deliberate or a hole?
- Something whose correct use depends on state elsewhere. Who guarantees it?
- A surprising structure or complexity choice. What was it traded for?

Each unanswered prompt is a finding, and the absence of a comment is as reportable as the presence of a bad one.

## The counterweight

"Non-obvious" is a bar, not an invitation. It does not license commenting every line in case someone finds it hard, and it does not license the essay ([essay-comment](../catalog.md)). The test is whether a competent reader of this codebase would be stuck, not whether a novice might be. And where the non-obvious thing can be made obvious instead, by a name, a type, or an extraction, doing that beats explaining it ([information-routing.md](./information-routing.md)).

The interaction with agent-written code cuts both ways. Agents over-produce comments on the obvious, because they are narrating their own edit ([agent-context-collapse.md](./agent-context-collapse.md)), and under-produce them on the non-obvious, because the non-obvious parts are usually the ones they did not touch this turn.

# Citations

- Ousterhout, A Philosophy of Software Design, ch. 12, "Why Write Comments?" (https://web.stanford.edu/~ouster/cgi-bin/book.php)
- Sanfilippo, Writing System Software: Code Comments (https://antirez.com/news/124)
- Google C++ Style Guide, Implementation Comments (https://google.github.io/styleguide/cppguide.html#Implementation_Comments)
