---
okf_version: "0.1"
---

# Comment taxonomy, smell catalog, write gate, and background concepts behind the comment-stinky skill.

The three operating documents, in the order a task uses them:

- [The Nine Comments Worth Writing](taxonomy.md) - The positive taxonomy, what each kind of comment is for, the form it takes, the smell it degrades into, and the routing table for information that belongs somewhere other than a comment.
- [Comment Stinky Catalog](catalog.md) - The full code-comment smell catalog, in six pillars and 37 categories, language and framework agnostic.
- [The Comment Write Gate](write-gate.md) - The four-question gate to run before any comment lands, the trigger-phrase table, the rewrite recipes, and the self-check command for auditing the comments in your own diff.

The background concepts the operating documents link into ([concepts/](concepts/index.md)):

- [The Comment's Real Audience](concepts/comment-audience.md) - The reader holds only the file, never the diff, and every rule in the skill follows from that asymmetry.
- [Agent Context Collapse](concepts/agent-context-collapse.md) - Why coding agents write comments about the edit rather than the code, structurally rather than carelessly.
- [The What, How, and Why Ladder](concepts/why-not-what.md) - The three rungs a comment can address, which one is worth a line, and the narrow cases where a what-comment is right.
- [Routing Information to Its Real Home](concepts/information-routing.md) - The homes a fact can live in, ranked by whether the system notices when it goes wrong, and why a comment is the fallback.
- [Comment Decay](concepts/comment-decay.md) - Why comments drift into being false, which kinds rot fastest, and the structural defenses that slow it.
- [Interface Comments vs Implementation Comments](concepts/interface-vs-implementation.md) - The two populations, their different readers, and the three failures of mixing them.
- [Non-Obvious Information](concepts/nonobvious-information.md) - The test for whether a comment should exist at all, and how to find the ones that are missing.
- [Commit Message Craft](concepts/commit-message-craft.md) - The destination for everything the write gate strips out, and why it holds change information better than the source file.
