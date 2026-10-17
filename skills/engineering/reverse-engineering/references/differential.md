---
type: Runbook
title: Differential testing against the original
description: Prove an implementation matches the original by running both from one state and input, aligned on the target's own clock, with every allowed difference written down, verdicts that cannot pass by accident, mutation checks of the comparator, and a triage path for each failure.
tags: [reverse-engineering, differential-testing, mutation-testing, oracle]
generated: { by: claude-code/unversioned, at: 2026-10-17T12:00:00Z }
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
---

# Write specs, then a control

A spec is one unit in one scenario: start state, setup (flags, inventory, HP), seed, inputs keyed to the target's clock, and a length. Give each unit several specs: alone and idle, against a scripted input sequence, and once per variant. Cyberworld Endless ran seven per moved enemy family.[^cwe-devtools]

Before the first subject, run the control: a unit whose right answer you know, pushed through your pipeline. Three runs, compared every byte: native, native with your install present, and the native unit moved by your pipeline. Native and installed must match exactly (the no-op invariant). The moved control must match native to the end. The control caught a hidden per-ID table (an ice block's size) that the moved unit read past.[^cwe-emulation] Where a variant must differ, add that as a negative arm that fails when it matches.

# Run the oracle and the subject in lockstep

- **Align on the target's own clock** (a battle timer, a sequence number), never wall frames or ticks. The side whose clock moved on waits for the other.
- **Seed both** at the first aligned frame, not at start: an opening that draws a different number of random values desynchronizes everything after it. Where draw counts legitimately differ, let the subject follow the reference's generator state, or replay draws per call site.
- **Compare by role.** Match objects by what they are, not by memory slot. Translate IDs and layouts into one numbering before comparing. Compare spawns, sounds, and draws by the call site that made them.
- **Compare everything** in the subsystem's memory every aligned frame, and require both traces to end at the same length.

# Allow a difference only with a reason

Each mask has a name, the part it covers, the exact cells or bits (offset, reference value, subject value), a why, and evidence: both sides' routines by address and the spec that showed it. Masks never cover the subject's own records, which is the thing under test. Keep translations (reading one side in the other's terms) apart from masks. Re-verify, against the image bytes, every "these two routines are twins" claim a mask relies on.[^cwe-xdiff]

# Read the verdict honestly

| Verdict | Means | Next |
| --- | --- | --- |
| PASS | No unexplained difference on any aligned frame, traces the same length | Next spec |
| FAIL | First unexplained difference: frame, address, role, both values | Triage below |
| INCONCLUSIVE | The shared world diverged for a reason that is not the subject (the player's own state, setup) | Fix the harness or spec; never count it as PASS |

A recorded non-PASS (a known, bounded deviation) holds only while the run ends the same way at the same frame.

# Prove the comparator can fail

Break the implementation on purpose, the way a real bug would: an immediate or struct offset not moved, a call to nothing or the wrong twin, a table entry, an effect ID, a shifted random draw. Each break must FAIL its spec; the mutation run passes only when every break is caught. A new mask rule ships with its own breaks. Cyberworld Endless ended at 366 specs (363 PASS, 3 stopping where recorded) and 167 breaks, all caught.[^cwe-release] This is mutation testing aimed at the oracle rather than the product.[^demillo-1978]

A detector that reacts to an event needs a negative control too: run without the event and require silence. One price was "verified" by a line printed from stale bytes.

# Triage a FAIL

1. Open the spec's story view (each side's timeline) at the first divergent frame. Ignore later differences; they are consequences.
2. Name the role and field that differ, then watch writes to it on both sides to find the routine that wrote each value.
3. Compare the two routines (twins). Classify: your relocation or recipe, a table not grown, an engine difference, or a harness setup.
4. Fix at the root. Add a mask only for a proven engine difference, with both routines cited.
5. Rerun every spec and the mutations, not just the failing spec.

Use the survey view (every difference counted, masked or not) to audit masks that grew too wide.

# Fill in around the oracle

- **Target-free unit tests in CI**: parsers, relocation, the claim registry, the comparator's own parts, two instances on a test image of your own bytes. Target-bound specs run locally from one command.
- **Rates over many seeds** for anything stochastic: turn one report into a measured rate, fix, and keep the rate in a test.
- **Golden equivalence for refactors**: seeded runs give the same logs line for line, and native runs stay identical at every byte.
- **Ratchets**: lint baselines that only shrink, and generators with a `--check` that fails on drift.

Differential testing in this sense goes back to McKeeman's comparison of compilers on shared inputs.[^mckeeman-1998]
