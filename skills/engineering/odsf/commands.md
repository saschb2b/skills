# ODSF commands

Each command is a verb over a bundle. They share one invariant: when a command finishes, `node odsf-validate.mjs <bundle>` still passes. The normative rules each step relies on are in [spec.md](./spec.md); ready-to-edit shells are in [templates.md](./templates.md). ODSF is a profile of OKF, so the OKF verbs (`init`, `add`, `enrich`, `link`, `index`, `log`, `validate`, `export`, `consume`) carry over; ODSF adds two design-specific ones, `token` and `asset`.

## `init`: start a bundle

Create the skeleton an agent can navigate from the first file.

1. Choose the bundle root, ideally a directory in version control next to the product it styles (for example `design-system/`).
2. Write a bundle-root `index.md` whose frontmatter declares **both** `odsf_version: "0.1"` and `okf_version: "0.1"`. This is the only `index.md` allowed frontmatter.
3. Create the domain folders, not file-type folders: `foundations/`, `components/`, `patterns/`, `behaviors/`, `guidelines/`, `styles/`, and `references/` as needed.
4. Add an `overview.md` (`type: Design System`) with the system's principles, and a `log.md` with a single `Creation` entry dated today.
5. Seed `styles/tokens.css` with a `:root` block, even if empty, so examples have a stylesheet to link.

Touches: `index.md`, `overview.md`, `log.md`, `styles/tokens.css`, the directory tree. Validate before moving on.

## `add`: write one concept

Add a single concept document. Resist documenting ten components at once; one good concept with its example beats ten stubs.

1. Pick the path. The path is the identity, so `components/button.md` is the button. Never name a concept file `index.md` or `log.md`.
2. Pick a design `type` from the §5 vocabulary (`Color`, `Component`, `Pattern`, `Behavior`, `Guideline`, …). Pick the most specific that fits; invent one when none does.
3. Fill the recommended frontmatter you can stand behind: `title`, a one-sentence `description`, `tags`, `status`, a `timestamp` of now, and where they apply `tokens`, `examples`, and `applies_to`.
4. Body it with the per-type conventional headings (spec §7): a foundation gets `# Tokens` / `# Roles` / `# Usage` / `# Do & Don't`; a component gets `# Anatomy` / `# Tokens` / `# Variants & States` / `# Examples` / `# Behavior` / `# Accessibility` / `# Do & Don't`.
5. If the concept is a `Component`, `Pattern`, or `Guideline`, author its companion asset (see `asset`) and declare it in `examples`.
6. Link out to the concepts this one relates to (see `link`), add it to the directory's `index.md` (see `index`), and append a `log.md` `Creation` entry.

Touches: the new concept file, its asset(s), its directory `index.md`, `log.md`.

## `token`: define and project tokens

The first of ODSF's two additions. A token lives once and appears twice (spec §4); this command keeps the two in sync.

1. **Define** the token on the foundation concept that owns it, as frontmatter `tokens`. Group by category (`colors`, `spacing`, `typography`, `radius`, `motion`, …); a value is a string or a small map for a composite token (a type style). The foundation's frontmatter is the canonical definition.
2. **Reference, don't restate.** A component's `tokens` point at foundation tokens with the `{group.name}` syntax (`backgroundColor: "{colors.primary}"`), not a copied hex value. Express interactive states as separate suffixed entries (`button-primary`, `button-primary-hover`).
3. **Project** every foundation token to `styles/tokens.css` by the mechanical rule: token path `a.b.c` → custom property `--a-b-c`, defined under `:root`. The frontmatter is the source of truth; the CSS is its projection. Regenerate the affected lines whenever you add, rename, or change a token.
4. Mirror the token in the foundation's `# Tokens` table so a human reader sees name / value / role, then validate. The checker warns on any `{group.name}` that does not resolve to a defined token.

Touches: a foundation concept's frontmatter and `# Tokens` body, `styles/tokens.css`, every component that references the changed token.

## `asset`: author a companion example

The second addition. An asset is what makes a concept *reproducible* rather than merely *described* (spec §6).

1. Name it by the concept basename plus a role suffix: `<concept>.example.html` (the canonical correct usage), `<concept>.do.html` / `<concept>.dont.html` (a contrastive pair), or `<concept>.css` (concept-specific styles).
2. Make `*.example.html` a **complete, standalone HTML document** that renders on a double-click with no build step. Link the bundle stylesheets with **relative** paths (`../styles/tokens.css`, `../styles/components.css`) so it resolves over `file://` and when served. Never hard-code token values; pull them from the linked CSS so the example re-renders when a token changes.
3. Keep it **minimal**: the markup for the one thing the concept teaches, not a page of chrome. Show the exact element, class names, attributes, and ARIA an agent should emit.
4. For a `Guideline` (or a `Component` with a sharp failure mode), ship the `*.do.html` / `*.dont.html` pair; the concept body explains *why* the don't is wrong, the asset shows *what* it looks like.
5. Declare the asset in the concept's `examples` frontmatter list and link it from an `# Examples` body section, then validate. The checker warns on a declared or linked asset that does not exist.

Touches: one or more `.html`/`.css` assets, the concept's `examples` frontmatter and `# Examples` body.

## `enrich`: turn a source into concepts

Two passes. Use this when pointing the skill at a real design system: a token export, a component library, a Storybook, a Figma spec, or a docs site.

1. **Walk the source.** Enumerate its units (every token group, every component, every documented pattern). One unit becomes one concept; one component becomes one concept plus its example asset.
2. **Structure pass.** For each unit, write one concept from the source's own data alone: a design `type`, the frontmatter you can derive (name, `description`, `status`), the `tokens` it defines or uses, and the per-type body headings. Project tokens to `tokens.css` (see `token`) and author the example (see `asset`).
3. **Web pass (optional).** Treat a list of seed URLs (the live site, a brand guideline, a design.md) as authoritative. Fetch each, and for each page either enrich existing concepts (confirm a hex, a class name, a state), mint a `references/<slug>.md` concept (`type: Reference`) for the page, or skip. Record sources under `# Citations`. Bound the crawl: cap pages and restrict to allowed hosts.
4. **Wire the graph.** Add cross-links (a component to its foundations and behaviors, a pattern to its components, any concept to the guidelines that constrain it), labeling each relationship in prose.
5. **Generate indexes and a log**, then validate. This is the heaviest command; do it in slices and validate between slices.

Touches: many concept files, their assets, `styles/tokens.css`, a `references/` subtree, `index.md` at each level, `log.md`.

## `link`: assert a relationship

Connect two concepts and say what the connection means.

1. Prefer a bundle-absolute target beginning with `/`, for example `/foundations/color.md`. It survives moving the source file within its directory. Relative targets are valid too.
2. Put the relationship in the prose around the link, not in the link. `Press darkening follows [press states only](/behaviors/press-states-only.md)` says what the edge means; the link alone does not. Wire the ODSF relationships (component → foundations and behaviors, pattern → components, anything → its guidelines).
3. A broken link is tolerated, not an error, so linking ahead of a concept you have not written yet is fine. Note it in `log.md` if you want to come back.

Touches: the source concept's body.

## `index`: refresh progressive disclosure

Keep each directory's `index.md` current so an agent can choose where to descend without reading everything.

1. For each directory, list its concepts as a bulleted set of links with a short description each, and link the example asset inline where one exists (`([example](button.example.html))`). Group under headings; link subdirectories with a trailing slash.
2. An `index.md` carries no frontmatter, except the bundle-root one, which keeps its `odsf_version` and `okf_version`.
3. Regenerate the affected `index.md` whenever you add, rename, remove, or re-describe a concept in that directory. A stale index is the most common drift.

Touches: one or more `index.md` files.

## `log`: record a change

Append a dated entry so consumers and humans can see what moved.

1. Use a `## YYYY-MM-DD` heading (ISO 8601, required), newest first.
2. Lead the entry with a bold word by convention: `**Creation**`, `**Update**`, `**Deprecation**`.
3. Log meaningful changes (a new component, a token change, a deprecated variant), not every typo. A token change is worth a line because it ripples to `tokens.css` and every example.

Touches: `log.md`.

## `validate`: check conformance

Run the script, then read the warnings with judgment.

```sh
node odsf-validate.mjs path/to/bundle
```

It exits non-zero only on the hard requirements. The reviewer's checklist behind it:

- **Errors (must fix).** Every non-reserved `.md` opens with frontmatter carrying a non-empty `type`, and the bundle-root `index.md` declares `odsf_version`.
- **Structure (should hold).** `index.md` has no frontmatter except the root's version declaration. `log.md` date headings are `YYYY-MM-DD`. Reserved names are not used for concepts.
- **Warnings (judgment).** A missing `okf_version`, a referenced example asset that is absent, an unresolved `{group.name}` token reference, a broken cross-link, a non-ISO log date, or a file that is not `.md`/`.html`/`.css`. None fail the bundle, because consumers tolerate them. Fix the real mistakes; leave the forward-references you meant.

## `export`: produce a bundle from a source

The producer role: turn an existing design system into a bundle.

**Structured sources** (a token JSON, a Tailwind config, a component library, a Storybook).

1. Map each entity to a concept path and a design `type` (a token group → a foundation, a component → a `Component`).
2. Translate tokens into frontmatter `tokens` and project them to `styles/tokens.css`; translate component metadata into the per-type body.
3. Author an example asset per component from the library's own markup, restyled by `tokens.css`.
4. Run `enrich` to add what the raw export lacks (behaviors, guidelines, accessibility), emit the tree, indexes, and a `log.md`, then validate.

**Prose sources** (a design.md, a brand site, a docs page, a Figma spec). Fetch with your web-fetch tool, transform (don't paste) into structural concepts, mirror an external page as `references/<slug>.md` (`type: Reference`) with the URL in `resource` and a fetch `timestamp`, and cite under `# Citations`. A page is a moving target, so the concept is a dated snapshot; bound a multi-URL crawl with a page cap and an allowed-hosts list, and summarize-and-cite rather than copy a third party's text.

The output of either path is a plain directory you can commit, tar, or drop into a larger repo.

## `consume`: apply a bundle to a design task

The consumer role. Be forgiving by design (the spec requires it). Handed a task like "build a sign-up form, adhere to this design system":

1. **Orient** at the bundle-root `index.md` and the `Design System` overview for principles.
2. **Pull foundations:** load the relevant foundation tokens, or simply link/inline `styles/tokens.css`.
3. **Descend by need:** follow `index.md` and cross-links to the `Pattern`, `Component`, and `Behavior` concepts the task requires; don't read the whole bundle.
4. **Copy from the assets:** reproduce structure, class names, and attributes from the relevant `*.example.html`, restyled by the same `tokens.css`, not from a prose paraphrase.
5. **Respect the rules:** honor the `Guideline` and `Accessibility` concepts in scope and the `*.dont.html` counter-examples.
6. **Stay forgiving:** tolerate missing tokens, absent assets, unknown types, and broken links; never refuse a bundle over them.

If you also modify the bundle while building (correcting a token, adding a state), you have become a producer too: refresh the `timestamp`, keep `tokens.css` in sync, append to `log.md`, update the `index.md`, and validate.
