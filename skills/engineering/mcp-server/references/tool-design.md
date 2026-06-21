---
type: Playbook
title: "Tool Design for Agents"
description: "Anthropic's effective-tools guidance: build workflow tools not endpoint wrappers, write descriptions agents read correctly, structured output, error handling, and the context-budget problem."
tags: [mcp, tools, prompt-engineering, context, anthropic]
timestamp: 2026-06-21T00:00:00Z
---

# Tool Design for Agents

The tool definition is the contract the agent reads to decide what to call, with what arguments, and how to interpret the result. It is the highest-leverage file in the server. Anthropic's framing: building tools for an agent is not a deterministic-to-deterministic contract, it is a bridge to a non-deterministic, context-limited consumer, so the practices differ from ordinary API design. Sources: [Writing effective tools for AI agents](https://www.anthropic.com/engineering/writing-tools-for-agents), [Code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp).

## Build the right tools, not every endpoint

The named anti-pattern: "tools that merely wrap existing software functionality or API endpoints." More tools is not better. Traditional software has cheap abundant memory; an agent has limited context, so a `list_contacts` tool that forces it to read every entry is worse than a `search_contacts` tool that returns only the matches.

Consolidate multi-step chains into one high-impact workflow tool:

- `list_users` + `list_events` + `create_event` becomes one `schedule_event` that finds availability and books in a single call.
- `read_logs` becomes `search_logs` that returns only the relevant lines.
- `get_customer_by_id` + `list_transactions` + `list_notes` becomes one `get_customer_context`.

The goal: "Tools should enable agents to subdivide and solve tasks in much the same way that a human would... and simultaneously reduce the context that would have otherwise been consumed by intermediate outputs."

## Namespace so the agent disambiguates

When tools overlap or have vague purposes, "agents can get confused about which ones to use." Namespace by service and resource: `asana_search`, `jira_search`, `asana_projects_search`, `asana_users_search`. Across servers a name is only unique within one server, so an aggregating client should prefix with a server identifier. Whether a prefix or suffix works better varies by model, so confirm with your own evals.

## Write descriptions like onboarding a new hire

The description is the agent's only documentation. Make implicit context explicit: special query formats, domain terms, the relationships between resources.

- **Precise verbs.** "Create a new sprite file with the given dimensions and save it to the path" beats "Sprite creation tool."
- **Precise parameter names.** `user_id`, not `user`. Naming refinements alone moved Claude to state-of-the-art on SWE-bench Verified by cutting error rates.
- **Enums over free strings** for fixed choices (`enum: ["RGB", "Grayscale", "Indexed"]`).
- **Required vs optional.** Put required fields in the schema's `required` array; for optional ones, document the default behavior in the description, because the agent cannot see a server-side default.
- **Author the schema from Zod or Pydantic.** `inputSchema` must be a valid JSON Schema object. A no-parameter tool should use `{ "type": "object", "additionalProperties": false }`.

For stateful flows, MCP has no protocol session, so return an opaque **handle** from a creation tool and require it on later calls (`basket_id`); authorize it on every call, state its lifetime in the creation tool's description, and return a tool execution error on expiry so the model can recover.

## Return high-signal context

"Prioritize contextual relevance over flexibility, and eschew low-level technical identifiers." Agents "grapple with natural language names... significantly more successfully than they do with cryptic identifiers," so resolving a UUID to a semantic name reduces hallucination. Prefer `name`, `image_url`, `file_type` over `uuid`, `256px_image_url`, `mime_type`.

When the agent genuinely needs technical IDs downstream, gate them behind a `response_format` enum (`concise` / `detailed`) rather than always dumping them. Anthropic's Slack example: thread IDs appear only in `detailed`, and `concise` "use[s] ~1/3 of the tokens."

## Be token-efficient by default

Any response that could be large needs "some combination of pagination, range selection, filtering, and/or truncation with sensible default parameter values." Claude Code caps tool responses at 25,000 tokens by default. You can steer the agent in the description toward "many small and targeted searches instead of a single, broad search."

## Structured output

Declare an `outputSchema` (JSON Schema) when the consumer (downstream code, the client UI, or another tool) needs typed, validatable fields rather than prose. Then the server must return `structuredContent` conforming to it, and the client should validate. Keep the unstructured `content` in sync by also serializing the same JSON into a `text` block. Tighten an existing `outputSchema` only as a breaking change (see [maintenance.md](maintenance.md)).

## Error handling: let the model self-correct

Two mechanisms, split by whether the model can recover:

1. **Protocol errors** are JSON-RPC `error` objects for problems in the request itself (unknown tool, malformed request). The model usually cannot fix these.
2. **Tool execution errors** ride inside a normal successful result with **`isError: true`** and an explanatory `content` block, for API failures, input-validation failures, and business-logic errors. The model sees them in-band and self-corrects.

Make the message actionable. The spec's own example: `"Invalid departure date: must be in the future. Current date is 08/08/2025."` Return `isError: true` rather than throwing a protocol error precisely so the model reads the message and retries with adjusted arguments. For a stateful tool, an expired or unknown handle should be a tool execution error.

## The context-budget problem

Tool definitions are not free. They are paid on every request before the user speaks: a well-documented tool runs roughly 500 to 1,500 tokens, so a 50-tool server is tens of thousands of tokens, and real multi-server stacks have been measured consuming the majority of a 200,000-token window in schemas alone. Beyond roughly 150 definitions, schemas dominate the budget and overlapping tools degrade selection accuracy. Mitigations in order of leverage:

1. **Fewer, consolidated workflow tools** (the rules above). Highest leverage, because it shrinks both definition count and intermediate-result volume.
2. **Filtering and toolsets** so only relevant tools are exposed; lazy-loading per-tool schemas on demand. See toolsets in [maintenance.md](maintenance.md).
3. **Progressive disclosure**: a `search_tools` capability so the agent reads definitions on demand instead of all up front.
4. **Code execution with MCP** for the heaviest cases: present servers as code APIs the agent calls from a sandbox, reading only the tool files it needs and filtering large results before they re-enter context. Anthropic reports one workflow dropping from 150,000 tokens to 2,000, a 98.7% saving. The cost is real: it needs a secure, sandboxed, resource-limited execution environment, so weigh it against that operational overhead.

## The evaluation loop

Treat tool quality as something you measure, not guess.

1. Prototype against agent-friendly docs and a local server.
2. Generate realistic eval tasks with Claude: multi-step, grounded in real workflows ("Customer 9182 reported three charges; find the relevant log entries and determine if other customers were affected"), not trivially prescriptive ("search logs for `purchase_complete`").
3. Run them programmatically with simple agentic loops and collect accuracy, runtime, tool-call count, token consumption, and tool errors.
4. Let the agent optimize the tools: paste the eval transcripts into Claude Code and have it refactor descriptions and schemas. "What agents omit in their feedback... can often be more important than what they include." The testing mechanics are in [testing.md](testing.md).
