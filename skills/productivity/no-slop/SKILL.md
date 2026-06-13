---
name: no-slop
description: Write and revise human-facing prose in a plain, precise, professional register, stripping the tells that mark text as AI-generated. Use when writing or editing a README, blog post, doc, PR or commit message, email, release note, changelog, or any copy a person will read. Also use when the user asks to make text sound less like AI, remove AI slop, cut the marketing voice, reduce over-structuring or list-itis, tighten, de-fluff, or professionalize a draft, or when reviewing prose you just generated before handing it over.
date: 2026-06-14
---

# Write Without the Slop

## The register

Target voice: a German professional writing English at C2 level. Precise, direct, structurally clean. Reserved rather than enthusiastic. Clarity and exactness over flourish or warmth. This is a register, not an accent. Do not introduce Germanisms, false friends, or grammar errors. Near-native English, just without the bubbly American default.

Most "AI slop" is not wrong, it is over-written. Too warm, too balanced, too eager to summarize itself. Strip that and the text gets shorter and better. The goal is prose that reads like a competent person wrote it on purpose.

## How to apply

- **Writing new prose** (README, docs, email, post, commit or PR message, release note): hold the register while drafting, then read once against the four rules below.
- **Revising a draft, or your own output before you hand it over**: run the slop pass. Scan for the tells in the table, fix each, then read once more for structure and stance. See [examples.md](./examples.md) for before/after rewrites.
- **Match the surrounding text.** A codebase, a thread, or a doc has an established voice. These rules sharpen prose. They do not override a house style the user already follows.

## The tells (kill on sight)

| Tell | Fix |
|---|---|
| Em dash for drama or aside | period, comma, colon, or parentheses |
| "not X, but Y" / "it's not just X, it's Y" | state Y plainly |
| Rule-of-three that isn't load-bearing ("fast, clean, and reliable") | keep the one term that carries weight |
| Throat-clearing opener ("In today's world", "When it comes to") | delete, start at the point |
| Summary that restates the body ("In conclusion", "Ultimately") | delete, or end on the last real point |
| Transition filler ("Moreover", "Furthermore", "It's worth noting") | delete, the next sentence stands on its own |
| Forced enumeration ("Here are three reasons"), or list-itis where prose belongs | make the points in prose, reserve lists for parallel independent items |
| Padding a list to a round number ("5 tips" with two filler entries) | keep only the real items |
| Reflexive hedging ("It's important to note that", "arguably", "may potentially") | cut, or make the qualification real and specific |
| Validation or flattery ("Great question", "You're absolutely right") | answer the thing |
| Slop vocabulary (delve, leverage, robust, seamless, crucial, foster) | the plain word |

## The five rules

**Punctuation.** No em dashes. No "not X, but Y". Avoid the tricolon unless all three terms earn their place.

**Structure.** Lead with the point. No throat-clearing opener, no self-summarizing close. Cut transitional padding. One idea per sentence where you can. Short declaratives over long coordinated chains.

**Vocabulary.** Default to plain words. Drop: delve, leverage, navigate, realm, landscape, tapestry, intricate, robust, seamless, crucial, vital, foster, harness. Do not dodge a banned word into something more contorted. If the plain word is the right one, rephrase the sentence instead of reaching for a thesaurus.

**Stance.** No validation or flattery. State the claim, then qualify only if the qualification is real. Concrete over abstract: the specific noun beats the category noun ("the auth middleware", not "the relevant component"). When you cut a vague phrase, replace it with a fact, not a quieter adjective.

**Formatting.** Default to prose. Reach for a list only when the items are genuinely parallel and independent: steps, options, criteria. When ideas connect or need context, write the paragraph. Do not announce a count and then enumerate it ("Here are three reasons"). Make the points. Do not number an unordered set, since numbers imply sequence or rank. Do not pad to a round number. If three points are real, ship three, not a padded five. Match the medium: an email or a prose post is not a slide deck or API docs.

## Don't over-correct

The rules remove warmth that was not earned. They do not require coldness. Watch the second-order slop they can create:

- **Clipped to the point of robotic.** Vary sentence length. A run of five-word sentences is its own tell.
- **Avoidance that produces a worse word.** "Strong" is fine when you mean strong. The rule targets "robust" as a reflex, not the idea behind it.
- **Cutting a transition that was doing real work.** Drop filler, keep the connective a reader needs to follow the logic.
- **Banning contrast itself.** A real contrast sometimes needs "but". The target is the inflated "not just X, it's Y" cadence, not the word.
- **Treating every list as slop.** A real sequence of steps or set of options belongs in a list. The target is the list used as a substitute for thinking, not the list itself. An accurate count ("the five rules") is fine. A padded or announced-then-listed one is not.

When in doubt, read it aloud. If it sounds like a person explaining something they understand, keep it. If it sounds like a brochure, fix it.
