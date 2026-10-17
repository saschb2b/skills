---
type: Technique Catalog
title: Locate data and logic
description: Techniques for finding where a value, table, or routine lives in an opaque target of any class, ordered cheapest first from leftover metadata to cross-version matching, with the confidence tier each placement earns.
tags: [reverse-engineering, search, signatures, disassembly]
generated: { by: claude-code/unversioned, at: 2026-10-17T17:00:00Z }
sources:
  - id: cwe-romdata
    resource: https://github.com/saschb2b/Mega-Man-Battle-Network-Cyberworld-Endless/blob/main/docs/ROM_DATA.md
    title: "Cyberworld Endless, docs/ROM_DATA.md (every offset with how it was found)"
  - id: cwe-symbols
    resource: https://github.com/saschb2b/Mega-Man-Battle-Network-Cyberworld-Endless/blob/main/docs/SYMBOLS.md
    title: "Cyberworld Endless, docs/SYMBOLS.md (bn6f's functions located by masked bytes, tiers, twins)"
  - id: tools-recalled
    resource: "scope:author knowledge of Ghidra, IDA, Binary Ninja, Cheat Engine, and metadata recovery for managed and engine builds"
  - id: ida-pro-mcp
    resource: https://github.com/mrexodia/ida-pro-mcp
    title: "ida-pro-mcp README (remove string encryption, import hashing, and control-flow flattening first; resolve library code with Lumina or FLIRT), read 2026-10-17"
  - id: raptor
    resource: https://github.com/gadievron/raptor
    title: "RAPTOR, .claude/commands/binary.md (absence of a call edge is not dataflow proof) and code-understanding/hunt.md (indirect calls, function pointers, and vtables a text search misses), read 2026-10-17"
---

# Work up the ladder

Start with the cheapest technique that can answer the question. Every placement goes into the [ledger](./ledger.md) with how it was found and its tier before code depends on it.

| Technique | Use when | How |
| --- | --- | --- |
| Normalize | Before naming anything | Undo obfuscation (string encryption, import hashing, control-flow flattening) and identify library code with signatures (FLIRT, Lumina, or the tool's equivalent), so you never name a library function by hand.[^ida-pro-mcp] When a decompiled function reads wrong, compare a second decompiler before blaming the model. |
| Leftover metadata | Always, first | Read what the build kept: managed assemblies and IL2CPP metadata, exports and imports, RTTI and vtables, debug strings, log messages, engine reflection data. Managed code decompiles to near-source, so start at Understand. |
| Static read | You need the routine around a known address or string | Load the pinned build into a decompiler (Ghidra, IDA, Binary Ninja), follow cross-references from strings and data, and name what you learn in the decompiler and the ledger together. |
| Known value search | The target shows a value you know (a name, a price, a stat) | Encode it as the target stores it (character table, endianness, fixed point) and search, in the image or live (Cheat Engine, an emulator's RAM search). BN6's chip names were found by encoding "Cannon" with the game's character table.[^cwe-romdata] |
| Structure shape search | You know a record's stride and field ranges | Scan for runs where every record fits: pointers land inside the image, enums stay in range, strides repeat. |
| Snapshot diff | A runtime value changes on an action you control | Snapshot, act once (take damage, buy, move), snapshot, diff. Intersect over repeats until one address remains. Value scanners automate exactly this. |
| Write watch | You know the address but not the code | Break on writes, read the program counter, walk back to the routine and its caller. |
| Output traceback | You can capture what the target draws, plays, or sends | Capture tiles, textures, sprites, sounds, or packets and trace each back to its source bytes or asset archive. |
| Reference walk | One routine or table is already located | Follow its calls, loads, literal pools, and jump tables; neighbors are usually related. |
| Cross-version matching | A sibling build is already mapped (a disassembly, a symbol dump, an older build of your own) | Assemble each function, mask what depends on placement (call targets, outside branches, literal labels), and search the masked bytes. On PC builds the same masked pattern (an array-of-bytes signature) also finds the code again after an update or relocation. |
| Twin pairing | The same routine exists in two builds or games | Compare bodies: identical, identical but load and store offsets, or differing. Audit every differing twin for what the caller asks of it. |

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
- A missing call edge is not proof of no callers: indirect calls, function pointers, and vtables hide them.[^raptor] Check a static "dead code" verdict against a runtime call trace before relying on it.
- A located address is not understood. Confirm it by experiment (poke and observe, or watch it change) before [implementing](./implement.md) against it.
