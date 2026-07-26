---
type: Concept
title: "Interface Comments vs Implementation Comments"
description: "The two populations of comment, the different readers they serve, and why mixing them is what makes doc comments both bloated and wrong."
tags: [comments, api-design, documentation]
timestamp: 2026-07-26T00:00:00Z
---
# Interface Comments vs Implementation Comments

Comments split cleanly into two populations that answer to different readers and obey different rules. Treating them as one thing is the root of several catalog entries at once.

**Interface comments** sit on a declaration and describe the contract. Their reader is a caller who will never open the body. They must be complete enough that using the thing correctly requires nothing else, and they must say nothing about how it currently works, because that is free to change without breaking anyone.

**Implementation comments** sit inside a body and explain why the code there is shaped the way it is. Their reader is whoever is about to modify it. They may name mechanisms, tradeoffs, and hazards freely, because that reader is looking straight at them.

| | Interface comment | Implementation comment |
| --- | --- | --- |
| Reader | The caller | The modifier |
| Lives on | The declaration | A line or block inside |
| Says | Contract, guarantees, requirements | Reasoning, hazards, tradeoffs |
| Must not say | How it currently works | Anything a caller has to know |
| Channel | The ecosystem's doc form (`///`, `/** */`, docstring) | An ordinary comment |

## What each must carry

An interface comment earns its length only from what the signature cannot express. In rough priority: units and ranges, null and empty semantics, ownership and lifetime, which errors are raised and when, side effects, thread-safety and reentrancy, cost, and what the caller must guarantee before calling. A block containing none of that, only the parameter names spelled out in prose, is [signature-echo](../catalog.md).

An implementation comment earns its place from non-obviousness. The [why rung](./why-not-what.md), and nothing below it.

## The three failures of mixing them

- **Implementation detail leaks into the contract.** The doc comment says "walks the tree depth-first", the implementation switches to breadth-first, and the doc is now a lie that no caller depended on and everyone believed. This is the most common source of [lying-doc](../catalog.md).
- **The contract hides inside the body.** The fact that callers must hold a lock is written at line 200, where only someone already reading the implementation will find it, which is exactly the person who does not need telling. This is [wrong-altitude](../catalog.md) and it is why [unstated-invariant](../catalog.md) is rated Rancid.
- **The channel is wrong.** Contract text written as a plain comment does not reach the IDE tooltip, the generated docs, or the hover in an editor, which are the three places a caller actually encounters it. This is [wrong-channel](../catalog.md), and the fix is mechanical.

## Where the split comes from

Ousterhout frames it as the difference between the abstraction a module presents and the implementation behind it, and the argument that a good interface comment is *shorter* than the code it describes: if it takes as long to read the contract as to read the body, the abstraction is not doing any work. That reframes a bloated doc comment as a design signal rather than a writing problem.

Each ecosystem then fixes the channel and the shape: rustdoc and the Rust API guidelines, godoc, PEP 257, TSDoc. Follow the local one over any generic advice, including this document.

Related: [taxonomy.md](../taxonomy.md) gives the contract comment its own entry as kind 2, and [comment-decay.md](./comment-decay.md) explains why the interface population rots more slowly when its examples are executable.

# Citations

- Ousterhout, A Philosophy of Software Design, ch. 13, "Interface vs implementation comments" (https://web.stanford.edu/~ouster/cgi-bin/book.php)
- Rust API Guidelines, Documentation (https://rust-lang.github.io/api-guidelines/documentation.html)
- Go Doc Comments (https://go.dev/doc/comment)
- PEP 257, Docstring Conventions (https://peps.python.org/pep-0257/)
- TSDoc (https://tsdoc.org/)
