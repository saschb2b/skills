---
name: reverse-engineering
description: Reverse engineer an opaque target (ROM, binary, firmware, file or save format, network protocol, undocumented API) toward a stated goal, looping locate, understand, implement, and prove until a differential test against the original passes. Use when asked to reverse engineer, disassemble, mod, patch, hook, port, transplant, or reimplement something without source or spec, find where data or logic lives in one, or match its behavior byte for byte. Defers story acceptance contracts to proof and game design calls to game-design.
tags: [reverse-engineering, emulation, differential-testing, process]
date: 2026-10-17
---

# Reverse Engineering

Drive one reverse engineering goal to proven completion. The running original is the only authority. Your memory, a disassembly, a wiki, and a user's report are leads until an experiment on the pinned target confirms them. A loop ends in evidence, never in "looks right".

## Run the loop

Run phases 0 and 1 once per target. Then repeat phases 2 to 6 for each unit of work (one record, one routine, one message type, one enemy) until the stop rule holds. Load each reference when its phase begins, not before.

| Phase | Do | Exit when | Read |
| --- | --- | --- | --- |
| 0. Input | Pin the target by hash and version. Write the goal as an observable acceptance: what must match the original, over which inputs, compared how. Pick the oracle. Confirm authorization and the legal line. | The goal names a check that can fail | [Goal](./references/goal.md) |
| 1. Harness | Make the original controllable before studying it: headless runs, scripted input, seeded randomness, snapshot and restore, memory peek and poke, traces. | Two runs from one state and one script trace identically | [Harness](./references/harness.md) |
| 2. Locate | Find where the data or logic lives, cheapest technique first. | Each location has a confidence tier and a re-verify step | [Locate](./references/locate.md) |
| 3. Understand | Predict, then observe: poke the location, run, compare with the prediction. Name the routine and the field that do it. | The claim is in the ledger as verified (how) or assumed | [Ledger](./references/ledger.md) |
| 4. Output | Integrate at the least invasive rung that reaches the goal, through tools that read the target rather than hand-copied values. | Installed but unused, the target runs identically to native | [Implement](./references/implement.md) |
| 5. Test | Run the original and yours from the same state and input, aligned on the target's own clock. Compare everything and explain each allowed difference. Break your output on purpose and confirm each break fails. | Every spec PASS, every mutation FAIL | [Differential](./references/differential.md) |
| 6. Iterate | On FAIL, fix the first divergence at its root, update the ledger, rerun every spec. On INCONCLUSIVE, fix the harness or the spec, not the output. | The stop rule holds | [Pitfalls](./references/pitfalls.md) |

Order the units so each adds one new mechanism. Start with the simplest, which builds the harness. Next take the first unit that draws random numbers, moves, or allocates. Then scale to the rest. Land each unit as its own commit with its ledger rows, specs, and masks.

## Hold these every iteration

- **Authority order.** The target by experiment, then disassemblies and specs, then community references, then user reports. A lower source is a lead: verify it, then credit it.
- **Claims carry evidence.** Verified (the routine, the field, the experiment) or assumed. A negative claim ("it has no X") names the search that came up empty.
- **One ledger, names not numbers.** Every address, offset, or field gets one ledger row and one symbolic name, and code uses the name. Generate symbol files and docs from that single source so they cannot drift.
- **The original stays pristine.** Patch an in-memory copy or a shim. Place new data in a declared free-space map and register every write region so no two patches overlap.
- **Hooks observe or answer.** An observing hook queues what it saw, and you act after the frame or call. An answering hook returns a value you prepared before it. Neither mutates your own state mid-call.
- **Control before subject.** Push a unit whose right answer you already know (a native one) through your pipeline first. If the control differs from native, the pipeline is wrong, not the unit.
- **Every difference has a reason.** Cite both sides' code paths for each allowed difference, and scope it to a role and field, not a raw address. Unexplained is FAIL. A harness or setup divergence is INCONCLUSIVE, never PASS.
- **Prove the oracle can fail.** Mutation-check the comparator with the bugs a real implementation would have. Never widen a mask to get green.
- **Check the original before blaming yourself.** A reported defect may be the original's own. Reproduce it on the pristine target, then decide in writing whether to keep or mend it.
- **Ship facts and your own code.** No assets, text, code, or dumps from the target, and no unlicensed third-party symbol names in the repository. Derived numbers, your tools, and your docs are fine.

## Stop rule

Stop when all of these hold for the current build:

- [ ] Every spec in the goal's acceptance passes against the oracle.
- [ ] Every mutation fails its spec.
- [ ] Every location the output depends on has a ledger row with a re-verify step.
- [ ] Every allowed difference has its written reason, and you added none to reach green.
- [ ] Target-free checks run in CI, and target-bound checks run from one local command.

Stop early and report when the goal needs a decision only the user can make, the target or tooling is unavailable, or two iterations in a row produced no new signal at the first divergence.

## Report

State what you verified and how, what you assumed, and what no spec reached (states, inputs, code paths). An unreached path is a finding, not a footnote. Then name the next unit of work.

## Reference bundle

[Index](./references/index.md) routes the vendored OKF knowledge. Read only the concept the current phase needs:

- [Goal](./references/goal.md): pin the target, write a falsifiable acceptance, choose the oracle, set the legal line.
- [Harness](./references/harness.md): controllable, deterministic execution per target kind.
- [Locate](./references/locate.md): techniques from value search to cross-version signature matching, with confidence tiers.
- [Ledger](./references/ledger.md): the row format, verified and assumed claims, names over offsets, lint gates.
- [Implement](./references/implement.md): the integration ladder, patching, hooks, free space, transplanting code.
- [Differential](./references/differential.md): oracle runs, alignment, masks with reasons, verdicts, mutations, triage.
- [Pitfalls](./references/pitfalls.md): failure modes that cost real iterations, each with its guard.
- [Worked example](./references/worked-example.md): the whole loop on a shipped project, from ROM offsets to a 325-spec differential.
