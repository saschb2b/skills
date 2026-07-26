---
type: Concept
title: "The Comment's Real Audience"
description: "A comment is read by someone holding only the file, never the diff that produced it, and every rule in the skill follows from that asymmetry."
tags: [comments, readers, rationale]
timestamp: 2026-07-26T00:00:00Z
---
# The Comment's Real Audience

Every comment has two possible audiences, and they see completely different things.

**The reviewer** reads a diff. They have the before and the after side by side, the pull request description, the ticket, and often the conversation. For them, "this now uses a label so the target is bigger" is a complete, useful sentence.

**The reader** opens the file, months or years later, usually while debugging something else. They have the code as it stands, the rest of the repo, and, if they think to look, `git blame`. They do not have the before, the ticket, or the conversation. For them the same sentence is noise wrapped around an unanswerable question: bigger than what?

A comment is written once for the reviewer and then read forever by the reader. The reviewer's audience lasts hours. The reader's lasts the life of the file. Optimizing for the first at the cost of the second is a bad trade that feels correct at the moment of writing, which is exactly why it needs a gate rather than good intentions ([write-gate.md](../write-gate.md)).

## What the reader has, and does not

| The reader has | The reader does not have |
| --- | --- |
| The code as it stands | The code as it stood |
| Every other file in the repo | The diff, the branch, the review thread |
| Types, tests, and names | The prompt, the ticket, the conversation |
| `git blame`, if they think to look and the line survived a reformat | Any memory that a change happened here at all |

The last row is the sharpest one. The reader does not merely lack the diff; they have **no reason to believe an edit ever occurred**. So a comment that only makes sense as a comparison against a previous version does not read as stale information. It reads as a claim about something they cannot find, which teaches them that comments in this codebase are unreliable, and that lesson generalizes to the good ones.

## The test this produces

Write for a reader who has only this file and does not know a change ever happened. Mechanically, question 2 of the gate: strike any clause that fails to resolve for that person.

The one nuance that keeps this from over-firing is the **comparative test**. Comparisons are not the problem; comparisons against invisible things are. "Average rather than sum" compares against what a reader would assume on their own, so it resolves fine. "Rather than the fixed breakpoint we had" compares against a deleted line, so it does not. The distinction is in [false-comparative](../catalog.md) and it is the guard that keeps this skill from making people afraid to explain themselves.

Related: [why-not-what.md](./why-not-what.md) covers what to say once you know who you are saying it to, [information-routing.md](./information-routing.md) covers where the rejected material goes, and [agent-context-collapse.md](./agent-context-collapse.md) covers why coding agents get this wrong so consistently.

# Citations

- Ousterhout, A Philosophy of Software Design, ch. 13 (https://web.stanford.edu/~ouster/cgi-bin/book.php)
- Fowler, CodeAsDocumentation (https://martinfowler.com/bliki/CodeAsDocumentation.html)
