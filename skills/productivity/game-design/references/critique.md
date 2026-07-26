---
type: Playbook
title: "Critique and Rework Playbook"
description: "The design-review smell catalog with detection signals and fixes, plus the procedure for reworking a flat or broken mechanic."
tags: [game-design, critique, rework, review, balance]
generated: { by: claude-code/unversioned, at: 2026-07-06T00:00:00Z }
---

# Critique and Rework Playbook

How to review a design and fix one that is not working. Use it on a mechanic that feels off, a system that has gone flat, a balance complaint, or a fresh concept you want pressure-tested. The reading method is in [method.md](method.md); the moves you reach for as fixes are in [principles.md](principles.md), and the underlying theory is in [frameworks.md](frameworks.md) and [systems.md](systems.md).

## The smell catalog

Each smell has a detection signal you can look for and a fix to reach for. Most of these are failures of one principle, named in the fix.

| Smell | Detection signal | Fix |
| --- | --- | --- |
| **Dominant strategy** | One line of play wins regardless of situation; experts converge on the same move; telemetry shows one option in nearly every winning game. | Make it situational, give it a real counter, or fix the incentive rather than the player. Players will find any crack and cannot unlearn it, so close the math, do not ask them to behave. |
| **No opportunity cost** | The player can take everything they want; nothing is sacrificed; "best build" is reverse-engineerable. | Add a budget (loadout-as-budget). Make every gain foreclose another, and make the sacrifice visible. |
| **Hollow loop** | The reward does not feed the next tier; feedback is missing or illegible; the player cannot say what they are working toward. | Close the loop so each output fuels a larger loop, and make the feedback immediate and legible so the mental model updates. |
| **Bare core is not fun** | The loop only entertains once progression, story, and meta are layered on; the moment-to-moment verb is dull alone. | Run the isolation test and fix the core verb first. No progression or narrative scaffolding saves a boring core. |
| **Treadmill / power creep** | Numbers rise but the experience does not change; new content is strictly stronger than old and devalues it. | Prefer horizontal options over bigger numbers, reward capability over magnitude, and augment axes rather than replacing them. |
| **Lying or missing telegraph** | Players blame the game, not themselves; damage feels random; "there was no way to know". | Show intent before the player commits, and make the telegraph honest. A telegraph that lies or omits is worse than none. Honesty about *what* is the promise; deceptive *timing* is a legitimate difficulty dial, but only with assist tooling budgeted (see the telegraph principle in [principles.md](principles.md)). |
| **Skill gate dressed as skill bonus** | An execution mechanic sold as a bonus becomes mandatory at high difficulty: one-shot damage means the reward for skill is the only way to survive, and build-based answers (tank stats, shields, revives) stop mattering. | Audit the or-die threshold. Keep at least one honest build-based answer viable at every difficulty, or commit openly to being an action game and tutor it that way. Expedition 33's late-game parry-or-die is the canonical case. |
| **Complexity over depth** | Many rules to learn produce few real decisions; players bounce off the rules; the option space is wide but shallow. | Cut or fold options until the rules you keep each create a genuine decision. Depth comes from interaction, not addition; when unsure, choose the less complex option. |
| **Flat budget** | A loadout or grid is roomy enough to fit "the answer"; the constraint never bites; mid-game goes slack. | Tighten the slot count relative to the pool, or make items non-uniform in weight so the budget pressures choices. |
| **Meta as power, not variety (when it should be variety)** | A replay-heavy game gets easier each run; the new-player gap widens; runs stop feeling distinct. | Move meta-progression to unlocking options rather than base stats, unless the game deliberately wants you to win and stop. |
| **Forced resonance** | A mechanic is bent to justify the fiction and serves neither; presentation polish is mistaken for mechanical resonance. | Let it be honestly orthogonal. Resonance is diagnostic, not prescriptive; do not force a story onto a system that does not support one. |
| **Ethics smell** | Engagement is engineered against the player's interest: appointment grind, monetized randomness, near-miss loot boxes, social-graph extraction. | Apply the test: would the player have more fun fulfilling this contingency than not? If not, it is a withdrawal loop, not an engagement loop. See [systems.md](systems.md). |
| **Scope mismatch** | The systems are tuned for a team or budget the project does not have; nothing is balanced because there is too much to tune. | Scale the math down to what you can actually tune and ship, and cut what does not earn its slot. |

## The rework procedure

When a specific mechanic is broken or has gone flat, work it in order:

1. **Name the core dialectic the mechanic is supposed to serve.** If the mechanic does not restate the game's central tension, that is often the real problem; it is decoration, not design.
2. **Find the decision and check it is interesting.** Is there a real choice here, or has it collapsed into a dominant line, a coin flip, or a no-op? If there is no interesting decision, the mechanic has no reason to exist in its current form.
3. **Trace the loop and the economy.** Does the reward feed a larger loop? Are sources and sinks balanced, or is something inflating? Is feedback legible? Map it with the loop stack and the economy nodes.
4. **Locate the broken feedback loop, then tune the smallest lever.** This is MDA in practice: do not redesign the aesthetic, find the dynamic that is failing and change the one mechanic that produces it. Small mechanical changes cascade upward.
5. **Restore opportunity cost if it leaked.** Most flatness traces back to the player being able to take everything. Re-introduce a budget or a cost.
6. **Re-run the isolation test.** After the change, strip the scaffolding and confirm the bare loop is fun. If it is not, you fixed the wrong layer.

## Running a review

For a full design review of a concept or system, dissect it with the lens in [method.md](method.md), then walk the smell catalog above, then state the verdict as the catalog does: name the pitfall, name the dominant strategy if any, name the ethics smell if any, and propose the smallest concrete fix with the principle it draws on. Be opinionated and concrete, and say the cost of each fix, not just the upside. The opinions are meant to be argued with.
