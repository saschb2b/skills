---
type: Technique Catalog
title: Locate data and logic
description: Techniques for finding where a value, table, or routine lives in an opaque target, ordered cheapest first, with the confidence tier each placement earns.
tags: [reverse-engineering, search, signatures, disassembly]
generated: { by: claude-code/unversioned, at: 2026-10-17T12:00:00Z }
sources:
  - id: cwe-romdata
    resource: https://github.com/saschb2b/Mega-Man-Battle-Network-Cyberworld-Endless/blob/main/docs/ROM_DATA.md
    title: "Cyberworld Endless, docs/ROM_DATA.md (every offset with how it was found)"
  - id: cwe-symbols
    resource: https://github.com/saschb2b/Mega-Man-Battle-Network-Cyberworld-Endless/blob/main/docs/SYMBOLS.md
    title: "Cyberworld Endless, docs/SYMBOLS.md (bn6f's functions located by masked bytes, tiers, twins)"
---

# Work up the ladder

Start with the cheapest technique that can answer the question. Every placement goes into the [ledger](./ledger.md) with how it was found and its tier before code depends on it.

| Technique | Use when | How |
| --- | --- | --- |
| Known value search | The target shows a value you know (a name, a price, a stat) | Encode it as the target stores it (character table, endianness, fixed point) and search. BN6's chip names were found by encoding "Cannon" with the game's character table.[^cwe-romdata] |
| Structure shape search | You know a record's stride and field ranges | Scan for runs where every record fits: pointers land inside the image, enums stay in range, strides repeat. |
| Snapshot diff | A runtime value changes on an action you control | Snapshot, act once (take damage, buy, move), snapshot, diff. Intersect over repeats until one address remains. |
| Write watch | You know the address but not the code | Break on writes, read the program counter, walk back to the routine and its caller. |
| Output traceback | You can capture what the target draws or sends | Capture tiles, palettes, sprites, or packets and trace each back to its source bytes. |
| Reference walk | One routine or table is already located | Follow its calls, loads, literal pools, and jump tables; neighbors are usually related. |
| Cross-version matching | A disassembly exists for a sibling version | Assemble each function, mask what depends on placement (call targets, outside branches, literal labels), and search the masked bytes. |
| Twin pairing | The same routine exists in two games | Compare bodies: identical, identical but load and store offsets, or differing. Audit every differing twin for what the caller asks of it. |

# Grade every placement

Cross-version matching in Cyberworld Endless located 13,386 of bn6f's 13,646 functions (98.1%) in a different revision, each with one of these tiers:[^cwe-symbols]

| Tier | Meaning | Trust |
| --- | --- | --- |
| `bytes` | Masked bytes found exactly once, with at least 48 known bits | High |
| `calls+bytes` | Bytes found several times; located callers all agree on one | High |
| `neighbours` | At the shift the located functions before and after it share | Medium |
| `calls` | Named only by located references, all agreeing; its own bytes differ | Medium, verify by experiment |
| `shift` | Estimated from neighbors' shift | Low, a lead only |
| `twin` | Paired by hand across games | As good as the pairing's audit |

# Rules that kept placements honest

- A placement made by a single reference is a lead. Five rows of the BN5 search were wrong that way: another body placed by one reference where a twin sat.
- Disassembly comments can be wrong. Compute a field's offset from the declared types and mask it where type and comment disagree.
- Two functions claiming the same bytes, or a match whose located neighbors disagree, are untangled by neighbor consistency, never by picking the first.
- A located address is not understood. Confirm it by experiment (poke and observe, or watch it change) before [implementing](./implement.md) against it.
