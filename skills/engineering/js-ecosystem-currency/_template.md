# Notes template

Copy this block when adding a tool. Keep it tight, one screen. Volatile version numbers live here, not in `SKILL.md`, so there is one place to re-verify.

```
# <Tool>

**Verified <YYYY-MM-DD>.** Check the project's installed version first; re-verify if newer than below.

**Current stable**: <major.minor> (<month year>). **LLM default bias**: <the versions and patterns training data over-represents>.

## The shift
<2-3 sentences on what changed and why it matters. This section ages slowly. Lead here.>

## Stop / Start
| Stop (LLM default) | Start (current) |
| --- | --- |
| <old pattern an agent reaches for> | <the current replacement> |

## Gotchas
- <migration trap, peer-dep requirement, common footgun>

## Companion (optional)
<link to a deeper sibling skill or related notes file, only if it already exists>

## Sources
- <official release notes or migration guide>
- <docs>
```

## Conventions

- **Stop column** is what an LLM emits unprompted. **Start column** is the current paradigm. Phrase both as concrete patterns, not prose.
- **No version numbers in `SKILL.md`.** The index routes; the notes file dates.
- Lead with **The shift**, not the version. Paradigms outlive release numbers.
- Cross-link a notes file to another only after the target file exists, so every commit stays link-valid.
- After adding a file, register the row in the matching `SKILL.md` table. That is the only required edit outside this folder.
