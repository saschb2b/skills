# Skill-invocation evals

A unit test for whether the skill `description` fields make the model reach for
the right skill on its own. It replicates Claude Code's surfacing (every skill
name and description in context, the model picks one or none), runs a set of
realistic prompts, and scores the routing decision. Descriptions are read live
from `skills/**/SKILL.md`, so it tests what you ship and catches a description
edit that silently breaks auto-invocation.

This is the measure-then-refine loop, not trial and error: change a description,
re-run, compare. It mirrors Anthropic's updated `skill-creator` (test, measure,
refine) and the function-calling relevance benchmarks (BFCL, MetaTool) that
score whether a model invokes the right capability or abstains.

## No API key

The classification is a text run done by the agent this repo is already running
inside, or one of its subagents. The Node scripts only validate, build the task
manifest, and score answers, all deterministic. The model never needs a separate
key or model id. (To fully automate outside an agent, wire `EVAL_CLASSIFIER`; see
the bottom.)

## Commands

```sh
pnpm eval:validate    # YAML + schema + coverage of the case files (no model)
pnpm eval:build       # write evals/results/manifest.json (the task list)
pnpm eval:score       # read evals/results/answers.json -> table + findings
pnpm eval             # validate + build, then print the agent text-run steps
```

Flags: `--samples N` (default 1, more = a real trigger rate since invocation is
stochastic), `--only <skill>` (one skill's cases).

## The agent text run

`pnpm eval` validates, builds the manifest, and tells you the rest:

1. The runner writes `evals/results/manifest.json` (`system` + `tasks`).
2. Hand the prompts to a subagent for a clean, blind text run. To avoid leaking
   the answers, classify against a stripped view that contains only `system` and
   `{id, prompt}` (the owner/expect fields stay out of the classifier's sight):

   ```sh
   node -e "const fs=require('fs');const m=JSON.parse(fs.readFileSync('evals/results/manifest.json','utf8'));fs.writeFileSync('evals/results/_prompts.json',JSON.stringify({system:m.system,items:m.tasks.map(t=>({id:t.id,prompt:t.prompt}))},null,2))"
   ```

   The subagent reads `evals/results/_prompts.json`, decides one skill name or
   `NONE` per prompt, and writes `evals/results/answers.json` as
   `[{ "id": "...", "choice": "<skill|NONE>" }]`.
3. `pnpm eval:score` prints the table and the findings.

## What it measures

- **recall.** The owning skill fires when it should (`should_fire`).
- **specificity.** The owning skill stays quiet when it should not (`should_not_fire`); another skill firing is still fine.
- **disambiguation.** On an overlapping prompt, the intended sibling wins, not the owner (`route_to_sibling`). This is the one that matters most here: "review my React component" legitimately matches `react-stinky`, `react-compiler`, `theme-colors`, and `visual-consistency`, and when several compete the model often fires none and waits for you to name one.
- **in-context.** The owning skill still fires when the request is buried in a realistic mid-task conversation, not a clean isolated prompt (`in_context`, a list of short transcripts). This is the closest the harness gets to the real failure mode: a skill that does not fire once the model is committed to a coding task. Sample several times (`--samples 5`) and read the column as a trigger rate, not a binary.
- **abstention.** Unrelated prompts fire nothing (`_unrelated.yaml`).

## Case file format

Plain, valid YAML (parsed by the `yaml` package and schema-checked). One file per
skill, named after the skill, `owner:` matching the skill name.

```yaml
owner: theme-colors

should_fire:                # recall: owner should fire
  - make this button use our brand blue
  - 'wrap a prompt in single quotes if it contains "#hex", a colon, or quotes'

in_context:                 # in-context: owner fires even mid-task; a block scalar holds a transcript
  - |-
    (mid-session, editing files in the project)
    User: a request that embeds the owner's trigger inside a coding conversation

route_to_sibling:           # disambiguation: the sibling wins, not the owner
  - prompt: the cards in this grid are different heights
    expect: visual-consistency

should_not_fire:            # specificity: owner should NOT fire (another skill may)
  - write a SQL migration
```

`_unrelated.yaml` uses a `fire_nothing:` list for prompts where no skill should
fire. `pnpm eval:validate` rejects invalid YAML, an unknown `owner`/`expect`, a
filename that does not match its owner, a bad shape, or a skill with no case file.

## Caveats

- **Batch classification is an approximation.** Routing all prompts at once with
  the descriptions in front of the model is an easier setting than real
  mid-conversation auto-invocation, where the model has already committed to a
  task. A 100% here means the descriptions separate cleanly, not that
  auto-invocation is guaranteed in practice. The "I had to name the skill"
  moment lives in that gap; the disambiguation and in-context columns are the
  most transferable signals. The `in_context` bucket narrows the gap by burying
  the trigger in a transcript, but the faithful guarantee is project-side: a
  path-scoped `CLAUDE.md` rule or a `UserPromptSubmit` hook in the consuming
  project (a skill that needs this ships an `INTEGRATION.md` with the snippets).
- **Stochastic.** Sample several times (`--samples`) and read numbers as a rate
  and a relative signal between description variants.
- **Test your real model.** Routing differs across models; run the text run on
  the model your agent actually uses.
- **Sibling ground truth is opinionated.** A `route_to_sibling` expectation
  encodes the intended owner. A genuinely ambiguous case that fails is itself a
  finding: the two descriptions may need cleaner boundaries.
- Results land in `evals/results/` (gitignored, model- and time-dependent).

## Full automation (optional)

Set `EVAL_CLASSIFIER` to a command that reads a prompt on stdin and prints one
skill name or `NONE`, and `pnpm eval` will classify and score in one shot without
an agent in the loop:

```sh
EVAL_CLASSIFIER='your-headless-agent --print' pnpm eval
```
