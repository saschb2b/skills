---
type: Concept
title: "The What, How, and Why Ladder"
description: "The three levels a comment can address, why only two of them are worth a line, and the narrow cases where a what-comment is the right answer."
tags: [comments, rationale, documentation]
timestamp: 2026-07-26T00:00:00Z
---
# The What, How, and Why Ladder

Any statement about a piece of code sits on one of three rungs. Knowing which rung you are on decides whether the sentence is worth writing.

`What`
: The operation being performed. "Increments the counter." The code already says this, in a form that cannot drift from itself.

`How`
: The mechanism. "Walks the tree depth-first, memoizing by node id." Worth writing only when the mechanism is genuinely hard to read off the code, and usually better fixed by naming the parts.

`Why`
: The force that produced the code's shape. "Depth-first because the renderer needs parents laid out before children." Never recoverable from the code, because the alternatives that were rejected leave no trace.

Comments exist for the third rung. The first is duplication with a maintenance cost and no benefit ([restates-the-code](../catalog.md)). The second is a hint that a name or an extraction would serve better ([should-be-a-name](../catalog.md)).

## The asymmetry that makes this a rule

The three rungs decay at different rates. A what-comment is wrong the moment the line under it changes, which is often, and nothing detects it. A why-comment stays true as long as the force behind it holds, which is usually far longer than any particular implementation of it. So the rung that is cheapest to write is also the one that rots fastest ([comment-decay.md](./comment-decay.md)).

## When a what-comment is correct

Three cases, and they are narrower than they look:

- **Genuinely dense code.** Bit manipulation, a regular expression, a numerical kernel, a hand-rolled parser state machine. Here the plain-language statement of what the line does is real information, because reading it off the code takes minutes.
- **Navigation through a long procedure.** One line per phase in a routine that cannot reasonably be split. This is the guide comment in [taxonomy.md](../taxonomy.md), and the test is one per phase, not one per line.
- **A contract, stated from outside.** A doc comment says what a function does because the caller is not going to read the body. That is not restatement; it is the whole point of an interface. See [interface-vs-implementation.md](./interface-vs-implementation.md).

Everywhere else, the what is already written directly below the comment, in a language the compiler checks.

## The practical form

The strongest why-comments name a specific force and its consequence, in that order, and stop:

- A measurement. "Struct-of-arrays keeps the hot loop cache-resident; measured 3x on 5k nodes."
- An external constraint. "The API caps a page at 50, so the cursor is per-page rather than per-item."
- A rejected obvious alternative. "Average rather than sum, so a three-word query stays comparable to a one-word one."
- A hazard. "Empty ids arrive from the legacy importer and would key the cache at the root."

Each is falsifiable, each survives a rewrite of the code beneath it, and none of them requires knowing that anything ever changed ([comment-audience.md](./comment-audience.md)).

# Citations

- Atwood, Code Tells You How, Comments Tell You Why (https://blog.codinghorror.com/code-tells-you-how-comments-tell-you-why/)
- Ousterhout, A Philosophy of Software Design, ch. 13 (https://web.stanford.edu/~ouster/cgi-bin/book.php)
- Linux kernel coding style, Commenting (https://www.kernel.org/doc/html/latest/process/coding-style.html#commenting)
