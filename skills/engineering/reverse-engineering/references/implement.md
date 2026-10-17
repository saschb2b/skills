---
type: Playbook
title: Implement against the target
description: Choose the least invasive integration rung, patch only an in-memory copy inside declared and claimed regions, hook at named points, transplant code by generated recipes, and keep output reproducible and saves versioned.
tags: [reverse-engineering, patching, hooks, transplant]
generated: { by: claude-code/unversioned, at: 2026-10-17T12:00:00Z }
sources:
  - id: cwe-emulation
    resource: https://github.com/saschb2b/Mega-Man-Battle-Network-Cyberworld-Endless/blob/main/docs/EMULATION.md
    title: "Cyberworld Endless, docs/EMULATION.md (memory the engine writes, hooks, free space)"
  - id: cwe-multirom
    resource: https://github.com/saschb2b/Mega-Man-Battle-Network-Cyberworld-Endless/blob/main/docs/MULTIROM.md
    title: "Cyberworld Endless, docs/MULTIROM.md (data, not code; transplanted families, Navis, chips, Souls)"
  - id: cwe-agents
    resource: https://github.com/saschb2b/Mega-Man-Battle-Network-Cyberworld-Endless/blob/main/AGENTS.md
    title: "Cyberworld Endless, AGENTS.md (patch rules, seeds, save versioning)"
---

# Climb only as high as the goal needs

| Rung | What you do | Risk |
| --- | --- | --- |
| 1. Read | Read target data through the [ledger](./ledger.md)'s names | None to the target |
| 2. Call | Run the target's own routine at a safe point and return to a trampoline | Low; the target's code does the work |
| 3. Observe | A hook queues what it saw; you act after the frame or call | Low |
| 4. Answer | A hook returns or rewrites a value you prepared before the frame | Medium; one decision point changes |
| 5. Patch data | Rewrite or grow tables and records in the in-memory copy | Medium; every reader of the table is affected |
| 6. Transplant | Copy a routine from another version or game into free space, its references aimed at the host's twins | High; prove it with the [differential](./differential.md) |
| 7. Reimplement | Write the behavior yourself | Highest; the oracle is all that keeps it honest |

Cyberworld Endless lets BN6's own code run battles, menus, and shops, and only directs it.[^cwe-emulation] It writes new layers in the game's map formats, points map tables at them, and hooks events. It reads BN5 content as data and transplants BN5 code only where data was not enough.[^cwe-multirom]

# Patch with discipline

- Patch only the in-memory copy (or a shim in front of the process). Never write the user's file.
- Place new data and code in a free-space map: past the end of the image, and RAM the target provably leaves alone (trace long runs to confirm it is never written).
- Wrap every installer's writes in a claim registry, so two installers writing the same bytes fails at once. Unit-test that the free-space regions never overlap.[^cwe-agents]
- Order installs explicitly (shared objects, then the units that use them) and install each moved type once.

# Hook at named points

Write a breakpoint instruction over one instruction of the target (on the GBA, Thumb `BKPT` with a reserved immediate) and dispatch to your code with the registers. After the hook, continue with the original instruction, return from the routine with a result, or jump elsewhere.

- **Event hooks** only queue the registers they met; your logic runs after the frame.
- **Answer hooks** return or change what you prepared before the frame, and may post an event when a call is worth one.
- Neither mutates your own state mid-call, and both access memory through the raw path the core thread allows.
- A hook in the image survives state loads; a hook in RAM is reapplied after every state load and reset.[^cwe-emulation]

# Transplant by recipe, never by hand

1. Inventory every external reference of the routine: calls, loads, tables, constants, IDs, and the engine objects it spawns.
2. Map each to the host's twin and classify it: identical, identical but offsets, or differing. Differing twins get an audit of what the routine asks of them; bring the guest's own version along where the host's does something else.
3. Grow the host's tables once for the new IDs (behavior tables, sprite tables, drop rows, size tables), shared by every unit that needs them.
4. Generate the recipe with a tool that reads both images, and check it with a second reader in the build. A fix to the generator then fixes every recipe.

# Keep output reproducible

- Generation depends on a seed and your inputs, never on the target's live memory, so a checkpoint can rebuild it.
- Version your save formats: bump a magic number on a layout change, pin the size with a static assertion, and pin a hash of generated output in a unit test so an unintended generation change fails.
- A state saved with your install present must carry nothing of the install: compare it byte for byte with one saved without.
