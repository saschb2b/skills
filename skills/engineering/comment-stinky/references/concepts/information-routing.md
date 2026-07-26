---
type: Concept
title: "Routing Information to Its Real Home"
description: "The set of durable homes a fact about code can live in, the property that makes each the right destination, and why a comment is the fallback rather than the default."
tags: [comments, documentation, architecture]
generated: { by: claude-code/unversioned, at: 2026-07-26T00:00:00Z }
sources:
  - resource: https://martinfowler.com/bliki/CodeAsDocumentation.html
    title: "Fowler, CodeAsDocumentation"
  - resource: https://cbea.ms/git-commit/
    title: "Beams, How to Write a Git Commit Message"
  - resource: https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions
    title: "Nygard, Documenting Architecture Decisions"
  - resource: https://web.stanford.edu/~ouster/cgi-bin/book.php
    title: "Ousterhout, A Philosophy of Software Design, ch. 14"
---
# Routing Information to Its Real Home

A codebase has many places to put a fact, and they are not interchangeable. Each has a different lifetime, a different audience, and a different answer to the question "what happens when this stops being true?" Choosing correctly is most of comment discipline, because the majority of bad comments are good facts filed in the wrong drawer.

## The homes, ordered by how strongly they hold a fact

| Home | Holds | What happens when it goes stale |
| --- | --- | --- |
| A type | A rule about which values are possible | The build fails |
| An assertion or invariant check | A rule about runtime state | The program fails loudly, at the site |
| A test | A behavioral claim | CI fails, named after the claim |
| A name | What a value or block is | Nothing, but it is read on every line, so drift is noticed |
| A doc comment | The caller's contract | Nothing, unless examples are executable |
| A comment | Why the code has this shape | Nothing. It silently misleads |
| A commit message | What changed and why then | Nothing, and it never needs to change |
| A ticket | Work not yet done | It is triaged, or it is closed |
| An ADR | A decision and its alternatives | Superseded by a later record |
| A design doc or knowledge bundle | The subsystem's model | Reviewed on its own cadence |

The ordering matters. A fact should live in the strongest home that can hold it, because strength here means "the system tells you when it is wrong". A comment sits low on that list; it is what you use when nothing stronger can carry the fact, which is genuinely often for *why*, and almost never for *what*.

## Two routes that absorb most rejected comments

**Upward, into a mechanism.** "Keep this list in sync with the enum" wants to be an exhaustive match. "Callers must call `init` first" wants to be a type that does not exist until `init` returns. "Do not exceed 64 entries" wants an assertion. Each promotion converts a comment nobody reads into a failure somebody cannot ignore. This is the [unenforced-invariant](../catalog.md) finding, and it is the highest-value fix in the catalog.

**Sideways, into the commit message.** Everything about the transition goes here, and this is where nearly all agent change-narration belongs. The commit message is the one artifact whose entire job is to describe a change, it is permanently addressable, and unlike a comment it never goes stale because it describes a moment rather than a state. See [commit-message-craft.md](./commit-message-craft.md).

## Why a comment is the fallback, not the default

A comment is the only home with no enforcement and no review cadence. Nothing compiles it, nothing runs it, nothing lists it, and nothing notices when the code beneath it changes ([comment-decay.md](./comment-decay.md)). That makes it uniquely suited to the one thing nothing else can carry, the reasoning that produced the code, and uniquely bad at everything else.

So the routing question in the [write gate](../write-gate.md) is not a formality. Asking "is a comment the best home for this?" moves a large fraction of would-be comments into artifacts that will actually defend themselves, and the ones that survive are the ones worth reading. The nine that survive are catalogued in [taxonomy.md](../taxonomy.md), and the rung they occupy is in [why-not-what.md](./why-not-what.md).
