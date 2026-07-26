# Log

## 2026-07-27

**Migration to OKF v0.2.** Bundle retargeted from `okf_version` 0.1 to 0.2. Each concept's `timestamp` became `generated: { by, at }`, carrying the original datetime and naming `claude-code/unversioned` as the producing actor, since the bundles were agent-drafted and the specific model was never recorded per file. Any `# Citations` body section moved into the `sources` frontmatter family as `{ resource, title }` entries. No `verified` events were added: nothing here has been through a recorded human or process confirmation, and asserting one would inflate the trust tier the field exists to report. Validated with `okf-validate --strict`; the migration introduced no new findings.

## 2026-07-16

- **Update**: Added the trust-boundaries concept (source standings, injection resistance), the opt-in rule for orchestration scale, and version-control conduct, after auditing the doctrine against Fable's actual operating rules; verified the leaked GPT 5.6 prompt lacks all three and extended the delta map.
- **Creation**: Documented the Fable operating doctrine as ten core concepts (operating loop, parallel dispatch, delegation, orchestration, verification, reporting, irreversibility, context economy, tool and code conduct, memory) plus the harness-mapping runbook and the GPT 5.6 delta map keyed to the leaked "sol extra high" prompt.
