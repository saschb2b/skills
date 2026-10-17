---
type: Runbook
title: Differential testing against the original
description: Prove an implementation matches the original by running both from one state and input, aligned on the target's own clock, with every allowed difference written down, an oracle the builder cannot edit, verdicts that cannot pass by accident, mutation checks of the comparator, ratcheted attempts, and a triage path for each failure.
tags: [reverse-engineering, differential-testing, mutation-testing, oracle]
generated: { by: claude-code/unversioned, at: 2026-10-17T17:00:00Z }
sources:
  - id: cwe-devtools
    resource: https://github.com/saschb2b/Mega-Man-Battle-Network-Cyberworld-Endless/blob/main/docs/DEVTOOLS.md
    title: "Cyberworld Endless, docs/DEVTOOLS.md (The differential: specs, alignment, seeding, modes)"
  - id: cwe-emulation
    resource: https://github.com/saschb2b/Mega-Man-Battle-Network-Cyberworld-Endless/blob/main/docs/EMULATION.md
    title: "Cyberworld Endless, docs/EMULATION.md (Testing: the control family, native against installed)"
  - id: cwe-xdiff
    resource: https://github.com/saschb2b/Mega-Man-Battle-Network-Cyberworld-Endless/tree/main/tests/xdiff
    title: "Cyberworld Endless, tests/xdiff (specs, legit.json with 48 masks, mutations.json with 167 breaks)"
  - id: cwe-release
    resource: https://github.com/saschb2b/Mega-Man-Battle-Network-Cyberworld-Endless/blob/main/docs/releases/v0.12.0.md
    title: "Cyberworld Endless 0.12.0 release notes (366 specs, 167 breaks)"
  - id: mckeeman-1998
    resource: "citation:McKeeman, Differential Testing for Software, Digital Technical Journal 10(1), 1998"
  - id: demillo-1978
    resource: "citation:DeMillo, Lipton, Sayward, Hints on Test Data Selection, IEEE Computer 11(4), 1978"
  - id: sbk2
    resource: https://github.com/cdlewis/snowboardkids2-decomp
    title: "Snowboard Kids 2 decompilation (.claude/hooks block edits to the reference checksum and commits with --no-verify; tools/claude-decomp-env/CLAUDE.md, the 40-attempt stall rule), read 2026-10-17"
  - id: decomp-wtf
    resource: https://github.com/i12bp8/decomp.wtf
    title: "decomp.wtf README (agents edit only sources and headers; a change that breaks a matched function is undone), archived 2026-10-15, read 2026-10-17"
  - id: llm-decomp-2026
    resource: https://arxiv.org/abs/2609.05370
    title: "When LLM Decompilers Recompile More and Preserve Less (2026); seen through search results only, not read"
---

# Write specs, then a control

A spec is one unit in one scenario: start state, setup (flags, inventory, HP), seed, inputs keyed to the target's clock, and a length. Give each unit several specs: alone and idle, against a scripted input sequence, and once per variant. Cyberworld Endless ran seven per moved enemy family.[^cwe-devtools]

Before the first subject, run the control: a unit whose right answer you know, pushed through your pipeline. Three runs, compared every byte: native, native with your install present, and the native unit moved by your pipeline. Native and installed must match exactly (the no-op invariant). The moved control must match native to the end. The control caught a hidden per-ID table (an ice block's size) that the moved unit read past.[^cwe-emulation] Where a variant must differ, add that as a negative arm that fails when it matches.

Pick the oracle's form from the [target profile](./targets.md). An emulator runs both sides in one process. A native or mobile target runs the unmodified build as a second process with the same injected input, compared through state dumps at tick boundaries. A file format's oracle is a round trip through the original application. A matching decompilation's oracle is the original's bytes, compared function by function.

# Run the oracle and the subject in lockstep

- **Align on the target's own clock** (a battle timer, a game tick, a sequence number), never wall time or the host's frame count. The side whose clock moved on waits for the other.
- **Seed both** at the first aligned step, not at start: an opening that draws a different number of random values desynchronizes everything after it. Where draw counts legitimately differ, let the subject follow the reference's generator state, or replay draws per call site.
- **Compare by role.** Match objects by what they are, not by memory slot. Translate IDs and layouts into one numbering before comparing. Compare spawns, sounds, and draws by the call site that made them.
- **Compare everything** in the subsystem's memory at every aligned step, and require both traces to end at the same length.

# Allow a difference only with a reason

Each mask has a name, the part it covers, the exact cells or bits (offset, reference value, subject value), a why, and evidence: both sides' routines by address and the spec that showed it. Masks never cover the subject's own records, which is the thing under test. Keep translations (reading one side in the other's terms) apart from masks. Re-verify, against the image bytes, every "these two routines are twins" claim a mask relies on.[^cwe-xdiff]

# Keep the oracle out of the builder's reach

An agent optimizes whatever the check measures, including the check itself. Put the comparator, reference hashes and expected outputs, masks, specs, and build scripts outside what the builder may change:

- Block edits to them with tool hooks, and block commits that skip verification. Snowboard Kids 2 refuses edits to its reference checksum and `git commit --no-verify`.[^sbk2]
- Narrow the builder's surface where you can: decomp.wtf let agents write only sources and headers, never targets, assembly, or build scripts.[^decomp-wtf]
- Pin the comparator's hash in CI. A mask or spec change is an oracle change: its own commit, reviewed, citing both code paths.
- Accept only the comparator's own output as a pass. A builder's report, a reviewer agent's reading of that report, "it builds", "it runs", and a passing unit-test suite are leads. Rebuilt or decompiled code that passes its tests can still differ on other inputs.[^llm-decomp-2026] Where whole-program specs are thin, add a per-unit differential over generated inputs. Leave the decompiler's unresolved placeholders visible instead of filling them in.
- Count passes reached through escape hatches (inline asm, register pinning, raw bytes, a transplanted blob where a rewrite was the goal) apart from real ones. Snowboard Kids 2's rule: a match that breaks its requirements is not complete.[^sbk2]

# Read the verdict honestly

| Verdict | Means | Next |
| --- | --- | --- |
| PASS | No unexplained difference at any aligned step, traces the same length | Next spec |
| FAIL | First unexplained difference: step, address, role, both values | Triage below |
| INCONCLUSIVE | The shared world diverged for a reason that is not the subject (the player's own state, setup) | Fix the harness or spec; never count it as PASS |

A recorded non-PASS (a known, bounded deviation) holds only while the run ends the same way at the same step.

# Prove the comparator can fail

Break the implementation on purpose, the way a real bug would: an immediate or struct offset not moved, a call to nothing or the wrong twin, a table entry, an effect ID, a shifted random draw. Each break must FAIL its spec; the mutation run passes only when every break is caught. A new mask rule ships with its own breaks. Cyberworld Endless ended at 366 specs (363 PASS, 3 stopping where recorded) and 167 breaks, all caught.[^cwe-release] This is mutation testing aimed at the oracle rather than the product.[^demillo-1978]

A detector that reacts to an event needs a negative control too: run without the event and require silence. One price was "verified" by a line printed from stale bytes.

# Triage a FAIL

1. Open the spec's story view (each side's timeline) at the first divergent step. Ignore later differences; they are consequences.
2. Name the role and field that differ, then watch writes to it on both sides to find the routine that wrote each value.
3. Compare the two routines (twins). Classify: your relocation or recipe, a table not grown, an engine difference, or a harness setup.
4. Fix at the root. Add a mask only for a proven engine difference, with both routines cited.
5. Rerun every spec and the mutations, not just the failing spec.

Treat each attempt as a transaction. Keep it only when a fresh oracle run beats the recorded best and nothing that passed before regresses; otherwise reset the worktree. decomp.wtf undid any change that broke an already-matched function.[^decomp-wtf] Give each unit an attempt budget (Snowboard Kids 2 stops after 40 attempts without improvement), then stop it and record the best result, the approaches tried, the remaining diff, and whether it looks solvable.[^sbk2] When a unit stalls, change the approach, escalate to a stronger model, or hand it to a person, rather than spending more attempts on the same idea.

Use the survey view (every difference counted, masked or not) to audit masks that grew too wide.

# Fill in around the oracle

- **Target-free unit tests in CI**: parsers, relocation, the claim registry, the comparator's own parts, two instances on a test image of your own bytes. Target-bound specs run locally from one command.
- **Rates over many seeds** for anything stochastic: turn one report into a measured rate, fix, and keep the rate in a test.
- **Golden equivalence for refactors**: seeded runs give the same logs line for line, and native runs stay identical at every byte.
- **Ratchets**: lint baselines that only shrink, and generators with a `--check` that fails on drift.

Differential testing in this sense goes back to McKeeman's comparison of compilers on shared inputs.[^mckeeman-1998]
