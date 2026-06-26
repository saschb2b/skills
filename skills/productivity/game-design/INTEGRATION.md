# Making game-design fire automatically in a game project

The skill's `description` makes Claude *consider* loading this skill, but that decision is probabilistic, and in a long coding session the model can keep answering design questions from training data instead of consulting the skill. Anthropic's own guidance is explicit: "If a skill seems to stop influencing behavior after the first response... the model is choosing other tools or approaches. Strengthen the skill's `description` and instructions so the model keeps preferring it, or use hooks to enforce behavior deterministically" ([Claude Code skills docs](https://code.claude.com/docs/en/skills)).

So for a project (a Godot game, say) where you want this consulted on *every* design-touching change, wire the project side. The levers, weakest to strongest. Start at the top; add the next one only if the skill still gets skipped.

## 1. Install the skill in the project

From your game project root:

```sh
npx skills@latest add saschb2b/skills --skill game-design
```

## 2. A standing CLAUDE.md rule (the simplest strong nudge)

`CLAUDE.md` loads at the start of every conversation as context. It is a strong nudge, not enforcement, but it is the most-followed lever short of a hook ([memory docs](https://code.claude.com/docs/en/memory)). Add:

```markdown
## Game design
For any change or discussion that touches a design decision (balance values, enemy or
difficulty scaling, drop rates, economy and shop prices, progression curves, inventory
rules, menu and UI flow, or "is this fun") consult the game-design skill FIRST and reason
from it before improvising from general knowledge. This applies mid-implementation,
together with the engine code.
```

## 3. A path-scoped rule that loads only on game files

A rule under `.claude/rules/` with `paths:` frontmatter loads only when Claude touches matching files, so it rides every GDScript or scene edit without weighing on unrelated work ([memory docs](https://code.claude.com/docs/en/memory)).

`.claude/rules/game-design.md`:

```markdown
---
paths: ["**/*.gd", "**/*.tscn", "**/*.tres"]
---
When editing this Godot code or scene, if the change encodes a design decision (a number,
a curve, a rule, a layout), load the game-design skill and reason from its patterns before
you commit the value.
```

The shared skill does not hardcode these globs because it is engine-agnostic; the globs belong to your project.

## 4. A UserPromptSubmit hook (near-deterministic, keyword-triggered)

A `UserPromptSubmit` hook runs on every prompt and can inject a system reminder when it sees design keywords; Claude treats the injected `additionalContext` as in-context instruction ([hooks docs](https://code.claude.com/docs/en/hooks)). This is the closest to "always consult" without hard-blocking.

`.claude/settings.json`:

```json
{
  "hooks": {
    "UserPromptSubmit": [
      { "hooks": [ { "type": "command", "command": "node .claude/hooks/nudge-game-design.mjs" } ] }
    ]
  }
}
```

`.claude/hooks/nudge-game-design.mjs`:

```js
// Nudge Claude to consult the game-design skill on design-touching prompts.
let raw = "";
process.stdin.on("data", (d) => (raw += d));
process.stdin.on("end", () => {
  let prompt = "";
  try { prompt = JSON.parse(raw).prompt || ""; } catch {}
  const re = /\b(balance|scaling|difficulty|drop rate|loot|econom|shop|price|progression|inventory|loadout|menu|hud|tutorial|onboarding|enemy|boss|reward|grind|fun|dominant strategy)\b/i;
  if (re.test(prompt)) {
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "UserPromptSubmit",
        additionalContext:
          "This request touches game design. Consult the game-design skill FIRST and reason from its patterns before answering from general knowledge.",
      },
    }));
  }
});
```

Tune the keyword list to your game. A hard guarantee (block until consulted) is possible with a blocking decision, but it is heavier than most workflows want; the nudge above is the sweet spot.

## What each lever buys

| Lever | Guarantee | Cost |
| --- | --- | --- |
| Description (shipped with the skill) | Probabilistic; the model may skip it mid-task | none |
| CLAUDE.md rule | Strong nudge, every session | one paragraph |
| Path-scoped rule | Strong nudge, scoped to game files | one file |
| UserPromptSubmit hook | Near-deterministic on a keyword match | a small script |

Anthropic states plainly that CLAUDE.md is "context, not enforced configuration" and that a hook is the deterministic layer ([memory docs](https://code.claude.com/docs/en/memory)). Begin with the CLAUDE.md rule; add the hook only if the skill is still being skipped on design work.
