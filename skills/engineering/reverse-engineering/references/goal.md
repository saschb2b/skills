---
type: Playbook
title: Goal and input
description: Pin the target, write the reverse engineering goal as a falsifiable acceptance, choose the oracle and the integration strategy, and set the legal line before any study begins.
tags: [reverse-engineering, scoping, acceptance, legal]
generated: { by: claude-code/unversioned, at: 2026-10-17T15:00:00Z }
sources:
  - id: cwe-sources
    resource: https://github.com/saschb2b/Mega-Man-Battle-Network-Cyberworld-Endless/blob/main/docs/SOURCES.md
    title: "Cyberworld Endless, docs/SOURCES.md (authority order, verified and assumed claims)"
  - id: cwe-emulation
    resource: https://github.com/saschb2b/Mega-Man-Battle-Network-Cyberworld-Endless/blob/main/docs/EMULATION.md
    title: "Cyberworld Endless, docs/EMULATION.md (why an emulator, and when to ask again)"
  - id: cwe-agents
    resource: https://github.com/saschb2b/Mega-Man-Battle-Network-Cyberworld-Endless/blob/main/AGENTS.md
    title: "Cyberworld Endless, AGENTS.md (rules on ROMs, assets, and patching)"
---

# Pin the target

Every fact the loop produces is true of one artifact. Name its class from the [target profiles](./targets.md) (a cartridge ROM, a disc image, an installed PC build, a managed or engine build, a mobile package, firmware, a format, a protocol). Record its cryptographic hash (SHA-1 or SHA-256; for an installed game, the main executable's and its key libraries'), its region, revision, or store build number, and the versions of the tools that run it (emulator core, debugger, mod loader, proxy). A sibling version or a second game gets its own layout table, never shared offsets, even when most addresses coincide. Check the hash wherever the artifact enters the program, so a wrong file is refused with its reason instead of producing plausible garbage.

# Write the goal as an acceptance

A goal is done when a check that could fail passes. Fill this sentence before phase 1:

> For **unit**, **our output** matches **the oracle** on **observable**, over **inputs and states**, compared by **method**, with differences allowed only for **written reasons**.

| Target kind | Typical observable | Typical method |
| --- | --- | --- |
| Game mod, any platform | State of the subsystem, every frame or tick | Lockstep trace diff aligned on the game's own clock |
| Native binary or library | Return values, side effects, syscalls | Same inputs to both, compared outputs and traces |
| File or save format | Bytes and the original's acceptance | Round trip (parse then write is identical) and the original opens what you wrote |
| Network protocol | Message sequence and fields | Recorded original session replayed against yours |
| Undocumented API | Responses and status codes | Recorded fixtures compared field by field |
| Matching decompilation | Compiled bytes per function | Byte comparison against the original's function |

Then list the first specs by name (one unit, one scenario each) and the non-goals. Revise the goal only explicitly, never by weakening a spec to fit the output.

# Choose the oracle

The best oracle is the original running live under the [harness](./harness.md), from the same state and input as your output. Weaker oracles, in order:

1. A second copy of the original in a second instance, for content moved between versions or games.
2. Recorded traces of the original. They are frozen and cannot answer a new question.
3. The original as a judge only: it accepts or rejects your file.

Name the oracle in the goal. The [differential](./differential.md) is built around it.

# Choose the integration strategy

| Strategy | Ships target code? | Fits when |
| --- | --- | --- |
| Run the original and direct it (emulator or process plus hooks) | No | No matching decompilation exists, or redistribution of target code is not allowed |
| Read the target's data into your own engine | No | Formats are understood and behavior is simple enough to own |
| Decompile or recompile | Yes | A matching decompilation exists and its license allows redistribution |
| Replace incrementally inside the original | No | A full reimplementation is the goal, and the original can host your code while you replace it routine by routine |
| Clean-room reimplementation | No | Behavior must run where the original cannot, and a spec can be written from observation |

Cyberworld Endless chose the first because BN6 has only a matching disassembly, the GBA has no display list to replace, a native build would ship Capcom's code, and save states give free checkpoints. It wrote down when to ask again: when a C decompilation covers most battle code and a run needs changes hooks make awkward.[^cwe-emulation]

# Set the legal line

Confirm the user owns the artifact or is otherwise authorized, and that the purpose is interoperability, modding, preservation, or study. Decline work aimed at piracy, cheating in online play, credential theft, or defeating access control the user does not own. For a game with online services, work offline and single-player, and leave anti-cheat alone. Then write the project's rule down: never commit the artifact, saves, states, dumps, or extracted assets; read target data at runtime through the [ledger](./ledger.md)'s offsets; check each third-party disassembly's license before reusing its names.[^cwe-agents]

# Inventory the sources

List what exists, in authority order: the target by experiment, disassemblies and specs, community references (wikis, unused-content archives, forum research threads), then user reports. Keep local checkouts of references outside the repository. A user's claim is a lead that is usually right: verify it and credit it in the project's sources document.[^cwe-sources]
