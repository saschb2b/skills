# Maintaining the android-compose skill

This skill is a dated snapshot of a moving target (the current stable Android + Jetpack Compose + Material 3 ecosystem). It is technical debt by design: useful only as long as it is refreshed. This is the upkeep process.

The `date` field in `SKILL.md` frontmatter is the snapshot date (last full review). Each reference file under `references/` carries its own `**Verified YYYY-MM-DD**` line.

## When to refresh
- A new Compose BOM, Kotlin, AGP, or Android major/minor ships, or a notable paradigm shift lands.
- **Material 3 Expressive stabilizes.** This is the highest-value trigger: when `material3` 1.5.0 goes stable, the experimental opt-in caveats throughout `material3-expressive.md`, `SKILL.md`, and `pitfalls.md` must change. Re-confirm which Expressive APIs are stable vs still experimental.
- A reference file's `Verified` date is more than roughly 3 to 6 months old. Run the freshness report:
  ```sh
  node scripts/check-freshness.mjs                              # oldest entries first
  node scripts/check-freshness.mjs --max-age-days=120 --fail    # non-zero exit if any are stale (for CI)
  ```
- A user reports an API or behavior newer than a file documents.

## How to refresh an entry (official docs are the source of record)
1. Read the OFFICIAL source, not memory or blogs:
   - AndroidX release notes (developer.android.com/jetpack/androidx/releases) for `compose-*`, `material3`, `lifecycle`, `navigation`, `navigation3`, `room`, `hilt`.
   - developer.android.com for platform/SDK behavior, edge-to-edge, the Compose compiler, and architecture guidance.
   - m3.material.io for Material 3 / Expressive design and component status.
   - kotlinlang.org for Kotlin and the Compose-compiler-with-Kotlin story.
2. Update the affected facts: artifact versions, "experimental vs stable", deprecated/replacement API, breaking changes, and any signature that moved.
3. Bump that file's `**Verified YYYY-MM-DD**` line to today.
4. If the headline guidance changed, update the matching bullet in `SKILL.md` (Core Rules, Snapshot section, or Reference Files list).
5. Run the checks:
   ```sh
   node scripts/check-skills.mjs       # frontmatter, links, registration
   node scripts/check-freshness.mjs    # date report
   ```
6. After a full pass, bump the snapshot: the `date` in `SKILL.md` frontmatter and the "Snapshot date" line in the freshness section.

## Keep version-specific facts version-tagged
The paradigm sections (declarative composables, state hoisting, unidirectional data flow, color-by-role, KSP over kapt) age slowly and should stay version-neutral. The volatile facts (artifact versions, experimental-vs-stable status, breaking changes, edge-to-edge enforcement, target SDK) belong under explicitly version-tagged headings or with a named version so a reader can tell at a glance what is pinned to a release and what is durable.

## Efficient bulk refresh
A full re-verify is cheap with parallel research: one agent per reference file, each reading the official release notes for the target versions and returning the deltas, then fold the results back into the files. Prioritize the files whose `Verified` dates are oldest, and always re-check `material3-expressive.md` first since it tracks the fastest-moving, pre-stable surface.

## Source
Grounded in the official Android documentation (developer.android.com), the AndroidX release notes, the Material 3 site (m3.material.io), and the Kotlin docs (kotlinlang.org).
