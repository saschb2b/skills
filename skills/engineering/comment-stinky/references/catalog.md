---
type: Smell Catalog
title: "Comment Stinky Catalog"
description: "The full code-comment smell catalog, in six pillars and 37 categories, language and framework agnostic."
tags: [comments, code-quality, documentation, smells]
generated: { by: claude-code/unversioned, at: 2026-07-26T00:00:00Z }
sources:
  - resource: https://web.stanford.edu/~ouster/cgi-bin/book.php
    title: "Ousterhout, A Philosophy of Software Design"
  - resource: https://antirez.com/news/124
    title: "Sanfilippo, Writing System Software: Code Comments"
  - resource: https://google.github.io/styleguide/cppguide.html#Comments
    title: "Google C++ Style Guide, Comments"
  - resource: https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings
    title: "Google Python Style Guide, Comments and Docstrings"
  - resource: https://google.github.io/eng-practices/review/developer/cl-descriptions.html
    title: "Google Engineering Practices, Writing good CL descriptions"
  - resource: https://martinfowler.com/bliki/CodeAsDocumentation.html
    title: "Fowler, CodeAsDocumentation"
  - resource: https://refactoring.guru/smells/comments
    title: "Fowler, Refactoring, the Comments smell"
  - resource: https://blog.codinghorror.com/code-tells-you-how-comments-tell-you-why/
    title: "Atwood, Code Tells You How, Comments Tell You Why"
  - resource: https://cbea.ms/git-commit/
    title: "Beams, How to Write a Git Commit Message"
  - resource: https://www.kernel.org/doc/html/latest/process/coding-style.html#commenting
    title: "Linux kernel coding style, Commenting"
  - resource: https://rust-lang.github.io/api-guidelines/documentation.html
    title: "Rust API Guidelines, Documentation"
  - resource: https://go.dev/doc/comment
    title: "Go Doc Comments"
  - resource: https://peps.python.org/pep-0257/
    title: "PEP 257, Docstring Conventions"
  - resource: https://tsdoc.org/
    title: "TSDoc"
---
# Comment Stinky Catalog

Six pillars, 37 categories. Each entry: what to sniff for, the fix, what NOT to flag, and the source. Run the "Don't flag" line before you report anything. The default stink rating is in brackets; raise it when the comment actively misleads, drop it when the project is internally consistent.

The catalog is language agnostic. Detection signals name concrete comment syntax (`//`, `#`, `///`, `/** */`, `--`, docstrings) as recognition anchors, not requirements.

Everything here rests on one model, that [the reader has only the file](./concepts/comment-audience.md) and never the diff, plus [why agents specifically break it](./concepts/agent-context-collapse.md). The load-bearing background terms each have their own concept: the [what/why/how ladder](./concepts/why-not-what.md), the [routing of information to its real home](./concepts/information-routing.md), [comment decay](./concepts/comment-decay.md), the [interface and implementation split](./concepts/interface-vs-implementation.md), [non-obvious information](./concepts/nonobvious-information.md), and [commit-message craft](./concepts/commit-message-craft.md). The positive side, what a good comment looks like per kind, is in [taxonomy.md](./taxonomy.md); the write-time procedure is in [write-gate.md](./write-gate.md).

Pillars:
1. Change narration (1 to 9)
2. Redundancy (10 to 14)
3. Missing intent (15 to 22)
4. Truth and decay (23 to 27)
5. Placement and form (28 to 33)
6. Voice and register (34 to 37)

# Pillar 1. Change narration

The signature smell of agent-written comments, and the reason this skill exists. Every entry here has the same root cause and the same fix: the comment was written for a reviewer holding a diff, and it must be rewritten for a reader holding only the file.

### 1. diff-narration [Funky, Rancid when the reader cannot tell what the code currently does]
- **Sniff for:** the comment describes the edit rather than the code. Tells: `now`, `we now`, `no longer`, `used to`, `previously`, `changed to`, `switched to`, `moved to`, `renamed`, `this fixes`, `added`, `new` applied to the code itself. "The sheet now renders the chord as two caps so it no longer breaks on narrow layouts."
- **Fix:** restate as a standing fact in the present tense, with no narrator and no history. "The chord renders as two caps; a single cap wraps below 320px." Everything about the transition goes in the commit message.
- **Don't flag:** `now` used temporally about runtime, not about the edit ("the socket is open now, so the retry timer is cancelled"). And see the comparative test in category 3.
- **Source:** Ousterhout, A Philosophy of Software Design, ch. 13 (https://web.stanford.edu/~ouster/cgi-bin/book.php).

### 2. ghost-reference [Rancid]
- **Sniff for:** the comment names code, a value, a function, a layout, or a behavior that is not in the tree. "the old HSL palette spread these ratios across 4.3 to 11.8", "the old fixed Actions-then-Concepts order buried the result", "unlike the previous handler". Grep the named symbol; if it is not there, the reader cannot check the claim.
- **Fix:** delete the ghost clause and keep the surviving reason, phrased against what the code does now. If the contrast is genuinely instructive, name the alternative generically ("ordering by declaration order buries the best match") so it stands without the history.
- **Don't flag:** a reference to something that still exists elsewhere in the tree, or to an external system's prior version that the code still has to cope with (`the v2 API omitted this field, so treat missing as zero`).
- **Source:** Fowler, CodeAsDocumentation (https://martinfowler.com/bliki/CodeAsDocumentation.html).

### 3. false-comparative [Funky]
- **Sniff for:** "X instead of Y" or "X rather than Y" where Y is only what the file used to say. Apply **the comparative test**: would a reader who never saw the old code recognize Y as the obvious alternative? "Average rather than sum, so a three-word query stays comparable to a one-word one" passes, because sum is what a reader would assume. "Follows the panel width instead of the fixed breakpoint we had" fails.
- **Fix:** replace the historical Y with the naive Y, or drop the comparison and state the rule.
- **Don't flag:** a comparative that passes the test. These are among the most useful comments in a codebase and this skill must not scare people off writing them.
- **Source:** Sanfilippo, Writing System Software: Code Comments, "why comments" (https://antirez.com/news/124).

### 4. changelog-comment [Funky]
- **Sniff for:** a commit message parked in the source. Dated entries above a function, a `Changes:` block, version bullets, "v2: added retry", a running history of who touched what. Also a file header that lists revisions.
- **Fix:** move it to the commit message and let `git log` and `git blame` own it, which they do better and without going stale. Keep only the standing facts extracted from it.
- **Don't flag:** a genuine public changelog file, a deprecation note with a version and a removal date on a published API, or a header the project's tooling generates.
- **Source:** Beams, How to Write a Git Commit Message (https://cbea.ms/git-commit/).

### 5. reviewer-defense [Funky]
- **Sniff for:** the comment argues that the edit is correct or safe, addressed to whoever approves it. "This is safe because all callers already check for null", "verified this does not break the existing tests", "kept the old behavior for compatibility with the tests above".
- **Fix:** if the claim is a real invariant, state it as one ("callers guarantee `node` is attached; see `mount`") and back it with an assertion or a type. If it was only reassurance for the review, delete it and put it in the pull request description.
- **Don't flag:** a genuine precondition or a safety argument for something subtle (a lock ordering, an unsafe block, a cast). Those are Pillar 3 comments doing their job.
- **Source:** Google Engineering Practices, Writing good CL descriptions (https://google.github.io/eng-practices/review/developer/cl-descriptions.html).

### 6. prompt-echo [Funky]
- **Sniff for:** the task restated as a comment. "As requested, added pagination", "per the requirement, cap at 50", "implements the user story", "this addresses the feedback about spacing". The requirement is not visible to the reader and will not be next year.
- **Fix:** delete, or convert the requirement into the standing rule it implies with its source ("the API caps a page at 50 items; see the rate-limit doc").
- **Don't flag:** a citation to a durable spec, RFC, standard, or ticket the reader can actually open.
- **Source:** Google Python Style Guide, Comments and Docstrings (https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings).

### 7. session-residue [Rancid]
- **Sniff for:** the comment mentions the agent, the session, the model, the conversation, the pull request number, or the reviewer. "Claude added this", "per our discussion", "as noted in the review thread", "see the chat above", "AI-generated helper". Also placeholder text left behind by a generation pass.
- **Fix:** delete it outright. None of it is available to the reader, and it invites the next reader to distrust the file.
- **Don't flag:** an attribution or provenance header a project deliberately requires (a license, an author tag, a codegen banner naming the generator and the source file).
- **Source:** Google C++ Style Guide, Comments (https://google.github.io/styleguide/cppguide.html#Comments).

### 8. removal-eulogy [Funky]
- **Sniff for:** a comment explaining code the reader cannot see, because it was deleted. "Removed the debounce here, it was fighting the scroll handler", "no longer need the fallback", "dropped the second pass". The comment is now an empty frame around nothing.
- **Fix:** delete. If the deletion encodes a trap ("do not reintroduce a debounce here, it fights the scroll handler"), keep it as a **trap comment** phrased as a standing prohibition with its reason, which is a legitimate kind (see [taxonomy.md](./taxonomy.md)).
- **Don't flag:** the standing-prohibition form. "Do not X, because Y" is durable advice; "we stopped doing X" is a diff note.
- **Source:** Sanfilippo, Writing System Software: Code Comments, "guide comments" (https://antirez.com/news/124).

### 9. commented-out-code [Funky, Rancid when it looks live enough to be re-enabled by mistake]
- **Sniff for:** blocks of disabled code with no explanation, alternate implementations kept "just in case", debug logging commented out, a whole function preserved above its replacement.
- **Fix:** delete it. Version control already has it, and unlike the comment it stays compilable and searchable. If it is a deliberate switch, make it a real flag or a config value.
- **Don't flag:** a short commented example of intended usage inside a doc comment, a deliberately disabled line with a reason and a ticket ("re-enable when the upstream fix lands, ISSUE-412"), or a template with placeholder blocks.
- **Source:** Fowler, Refactoring, the Comments smell (https://refactoring.guru/smells/comments).

# Pillar 2. Redundancy

### 10. restates-the-code [Funky]
- **Sniff for:** the comment says what the next line says. `// increment the counter` above `counter++`, `// return the result`, `// loop over the users`, `// set the title`. A reliable test: if you replaced the code with a rename, would the comment change too? If it tracks the code word for word, it is a duplicate.
- **Fix:** delete it. If the line genuinely needs explaining, explain why it is there, not what it does.
- **Don't flag:** a guide comment introducing a long block ("phase two: reconcile the staged tree against disk"), which is navigation, not restatement. Or a "what" comment on genuinely dense code (bit manipulation, a regex, a numerical kernel) where the plain-language statement is the value.
- **Source:** Atwood, Code Tells You How, Comments Tell You Why (https://blog.codinghorror.com/code-tells-you-how-comments-tell-you-why/).

### 11. signature-echo [Funky]
- **Sniff for:** a doc comment that restates the declaration. `@param userId The user id`, `@returns the result`, "Gets the name" above `getName()`, a docstring listing every parameter with its type and nothing more. The reader learns nothing they could not read one line down.
- **Fix:** document what the signature cannot say: units, ranges, ownership, null and empty semantics, error conditions, side effects, thread-safety, cost. If there is nothing of that kind, a one-line summary is enough, or drop the block.
- **Don't flag:** ecosystems and tools that require the tags to render (published API docs, rustdoc on public items, projects whose lint enforces complete docstrings). Fill them with substance rather than deleting them.
- **Source:** Rust API Guidelines, Documentation (https://rust-lang.github.io/api-guidelines/documentation.html).

### 12. step-narration [Funky]
- **Sniff for:** a comment on nearly every line of ordinary code, turning the function into a bilingual transcript. Density is the signal: more than roughly one comment per three lines of plain procedural code, none of which says why.
- **Fix:** delete the ones that restate. Keep at most a few guide comments marking the real phases. If the function needs a narrator to be followable, extract the phases into named functions instead.
- **Don't flag:** teaching code, a deliberately annotated reference implementation, an algorithm whose steps map to a published paper's steps, or assembly and shader code where line density is the norm.
- **Source:** Ousterhout, A Philosophy of Software Design, ch. 13 (https://web.stanford.edu/~ouster/cgi-bin/book.php).

### 13. banner-ceremony [Whiff]
- **Sniff for:** decorative dividers and section banners carrying no information. `// ===== Helpers =====`, boxed ASCII headers, `// ---`, a `// Constants` label above the constants, `#region` clutter, a header comment restating the file name.
- **Fix:** delete. If a file needs sections to be navigable, that is usually a signal to split it. Keep a banner only when it names a non-obvious grouping the reader could not infer.
- **Don't flag:** a project-wide convention applied consistently, generated separators, or a file-top header that actually explains the module's role (that is a design comment and belongs, see [taxonomy.md](./taxonomy.md)).
- **Source:** Linux kernel coding style, Commenting (https://www.kernel.org/doc/html/latest/process/coding-style.html#commenting).

### 14. tutorial-voice [Funky]
- **Sniff for:** the comment explains the language, the standard library, or a well-known framework rather than this code. "useEffect runs after render", "a HashMap stores key-value pairs", "await pauses until the promise settles", "this is a ternary operator".
- **Fix:** delete. The reader knows the language, or will learn it from its own docs, which stay current and this comment will not.
- **Don't flag:** a genuinely obscure or surprising API behavior that bites people (`Array.sort` is lexicographic by default, `HashMap` iteration order is unspecified). That is a trap comment and it earns its place.
- **Source:** Google C++ Style Guide, Comments (https://google.github.io/styleguide/cppguide.html#Comments).

# Pillar 3. Missing intent

The inverse pillar. These findings are about comments that should exist and do not. Scan the code, not the comments, and flag the decisions a reader cannot reconstruct.

### 15. unexplained-constant [Funky, Rancid when the value encodes an external contract]
- **Sniff for:** a literal that is clearly tuned rather than arbitrary and carries no reason: `setTimeout(fn, 320)`, `if (retries > 3)`, `MAX_ROWS = 5000`, `threshold = 0.87`, `24` as a pixel floor. The question the reader will ask is "what happens at 321?"
- **Fix:** name it as a constant and comment the force behind it: where it came from (a spec, a measurement, a platform limit, a vendor quota), what breaks above and below it, and how to re-derive it.
- **Don't flag:** genuinely arbitrary or self-evident values (`0`, `1`, `100` for a percentage), or a value whose constant name already carries the reason (`HTTP_TOO_MANY_REQUESTS = 429`).
- **Source:** Refactoring, Replace Magic Literal (https://refactoring.guru/replace-magic-number-with-symbolic-constant).

### 16. unexplained-workaround [Rancid]
- **Sniff for:** code that is visibly contorted with no cause named. A `setTimeout(fn, 0)` before a measurement, a double render, a try/catch around something that should not throw, a manual poll where an event exists, a version pin, a defensive re-check. The signal is code that a reasonable reader would delete as pointless.
- **Fix:** name the cause, the observable symptom, and the removal condition: which system misbehaves, what the user sees without this, and when it can go ("Safari reports zero height until the next frame; remove once the layout is driven by ResizeObserver").
- **Don't flag:** a pattern that is idiomatic in the framework and obvious to anyone using it.
- **Source:** Ousterhout, A Philosophy of Software Design, ch. 13 (https://web.stanford.edu/~ouster/cgi-bin/book.php).

### 17. unexplained-deviation [Funky]
- **Sniff for:** this one file or function breaks the local convention with no note. Hand-rolled where everything else uses the shared helper, a different error style, a manual loop where the codebase maps, an inline literal where every sibling uses a token.
- **Fix:** either conform, or say in one line why this site cannot ("the shared client retries; this path must fail fast so the queue can re-dispatch").
- **Don't flag:** a file that predates the convention and is consistent internally, unless it is actively confusing. Log it as a migration item, not a comment demand.
- **Source:** Fowler, CodeAsDocumentation (https://martinfowler.com/bliki/CodeAsDocumentation.html).

### 18. silent-ordering-dependency [Rancid]
- **Sniff for:** statements, initializers, registrations, middleware, imports, or CSS rules whose order matters and where nothing says so. The test is whether a plausible refactor (sorting, extracting, reordering for readability) breaks it silently.
- **Fix:** state the dependency at the coupling point, in both directions if both sides can move ("must run before `hydrate`, which reads the cache this fills"). Where the language allows, make it structural instead: pass the result, or assert the precondition.
- **Don't flag:** ordering that the language or framework makes explicit and checkable (a builder chain, an explicit dependency graph, a topological sort).
- **Source:** Google C++ Style Guide, Comments (https://google.github.io/styleguide/cppguide.html#Comments).

### 19. swallowed-error [Rancid]
- **Sniff for:** an empty catch, `except: pass`, `if let Err(_) = ...` with no body, `.catch(() => {})`, an ignored return code, a deliberately empty branch or default case. Nothing says whether it is intentional or a hole.
- **Fix:** name why the failure is acceptable and what it costs ("a failed prefetch is not user-visible; the read path fetches on demand"). If the answer is that it is not acceptable, that is a bug, not a comment.
- **Don't flag:** an ignore that the language marks explicitly and idiomatically (`_ = fn()` in Go, `let _ =` in Rust, a `# noqa` with a reason) where the convention already reads as deliberate.
- **Source:** CWE-390, Detection of Error Condition Without Action (https://cwe.mitre.org/data/definitions/390.html).

### 20. unstated-invariant [Rancid]
- **Sniff for:** a precondition, postcondition, ownership rule, lifetime, or concurrency requirement the caller must honor and that the type system does not enforce. Which lock guards this field, whether this may be called off the main thread, whether the buffer is owned or borrowed, whether the map may be mutated during iteration, whether the input is already validated or trusted.
- **Fix:** state it on the declaration, not at a call site. Prefer an enforcing mechanism where one exists (a guard annotation, a newtype for validated input, a debug assertion), and keep the comment for what the mechanism cannot say.
- **Don't flag:** an invariant the type already carries. A `NonEmptyList` does not need a comment saying it is non-empty.
- **Source:** JCIP annotations, GuardedBy (https://jcip.net/annotations/doc/net/jcip/annotations/GuardedBy.html).

### 21. unexplained-tradeoff [Funky]
- **Sniff for:** a surprising algorithmic or structural choice with no rationale. A quad-tree where a loop would read better, parallel arrays instead of objects, a hand-rolled parser, an O(n^2) pass on data that could be large, a cache with no stated eviction reason.
- **Fix:** one line naming what was traded for what, ideally with the number that justified it ("struct-of-arrays keeps the hot loop cache-resident; measured 3x on 5k nodes").
- **Don't flag:** the obvious choice for the domain, or a micro-decision with no real alternative. This is about choices a reader would otherwise "simplify" into a regression.
- **Source:** Ousterhout, A Philosophy of Software Design, ch. 12 (https://web.stanford.edu/~ouster/cgi-bin/book.php).

### 22. provenance-free-guard [Funky]
- **Sniff for:** a guard clause, a clamp, a null check, a retry, or a regression test that exists only because something once broke, with no record of what. It looks like paranoia, so the next reader deletes it and reintroduces the bug.
- **Fix:** name the failure it prevents in present tense, not the incident. "Empty ids arrive from the legacy importer and would key the cache at the root" beats "fix for the bug from last week". Link the ticket if there is one.
- **Don't flag:** a guard whose necessity is obvious from the surrounding types or contract.
- **Source:** Sanfilippo, Writing System Software: Code Comments, "why comments" (https://antirez.com/news/124).

# Pillar 4. Truth and decay

### 23. stale-comment [Rancid]
- **Sniff for:** the comment and the code disagree. A described default that is not the default, a named parameter that was renamed, a described order that changed, a stated range that no longer holds, a "this always returns X" above a function that can return null. Check every factual claim in a comment against the code under it.
- **Fix:** correct it or delete it. A wrong comment is worse than none, because the reader trusts it and stops reading the code.
- **Don't flag:** a comment about intent that the code merely fails to fully achieve; that is a bug in the code, and the comment is the spec.
- **Source:** Ousterhout, A Philosophy of Software Design, ch. 16 (https://web.stanford.edu/~ouster/cgi-bin/book.php). See also [comment-decay.md](./concepts/comment-decay.md).

### 24. lying-doc [Rancid]
- **Sniff for:** a doc comment whose contract does not match the signature. Documented parameters that no longer exist or are missing, a `@throws` for an error that is never raised, a `@returns` describing the wrong type, a documented default that the code overrides, an example that would not compile or run.
- **Fix:** regenerate the block from the current signature and verify each clause. Where the toolchain supports it, make examples executable (doctests, rustdoc examples, docstring doctests) so the compiler keeps them honest.
- **Don't flag:** an intentionally simplified example marked as such.
- **Source:** rustdoc, How to write documentation (https://doc.rust-lang.org/rustdoc/how-to-write-documentation.html).

### 25. orphaned-anchor [Funky]
- **Sniff for:** a comment pointing at something that has moved or died. A line number, "see the block below" after a reorder, a file path that no longer exists, a symbol that was renamed, a dead URL, a ticket in a tracker the team left, "see the comment in the other handler" with no name.
- **Fix:** anchor to something stable: a symbol name, a test name, a permalinked commit, or an archived URL. If the target is gone, inline the fact it was pointing at.
- **Don't flag:** links to durable external specs and standards.
- **Source:** Go Doc Comments, Links (https://go.dev/doc/comment).

### 26. duplicated-rationale [Funky]
- **Sniff for:** the same explanation copy-pasted at several call sites. Three files that each explain why the timeout is 320ms, five handlers each restating the same auth invariant. They will drift, and then some are wrong.
- **Fix:** put the rationale once at the thing it is about (the constant, the type, the function) and let the call sites point to it, or say nothing.
- **Don't flag:** a short cross-reference at each site ("see `RETRY_WINDOW`"), which is the fix, not the smell.
- **Source:** Ousterhout, A Philosophy of Software Design, ch. 13, "duplication" (https://web.stanford.edu/~ouster/cgi-bin/book.php).

### 27. unenforced-invariant [Funky]
- **Sniff for:** a rule that exists only as prose where the language could hold it. "Keep this list in sync with the enum", "callers must call `init` first", "do not exceed 64 entries", "must match the order in the CSS file". Nothing fails when it is violated.
- **Fix:** promote it to a mechanism: an exhaustive match, a type, a debug assertion, a builder that makes the wrong order unrepresentable, or a test that fails on drift. Keep the comment only for the part the mechanism cannot express.
- **Don't flag:** cases where no mechanism exists in the language or would cost more than the risk. Then the comment is the right answer and it belongs as a checklist comment (see [taxonomy.md](./taxonomy.md)).
- **Source:** Fowler, CodeAsDocumentation (https://martinfowler.com/bliki/CodeAsDocumentation.html).

# Pillar 5. Placement and form

### 28. wrong-altitude [Funky]
- **Sniff for:** rationale at the wrong level. A module's whole design explained inside one function halfway down the file, a per-line note where a block comment belongs, a cross-cutting rule stated at one of its five sites, an interface fact buried in the implementation where callers never look.
- **Fix:** move it to the level it governs. Facts about the whole file go at the top, facts about a contract go on the declaration, facts about one line go on the line.
- **Don't flag:** a deliberate short pointer at a lower level that routes the reader upward.
- **Source:** Ousterhout, A Philosophy of Software Design, ch. 13, "comments should be near the code they describe" (https://web.stanford.edu/~ouster/cgi-bin/book.php).

### 29. should-be-a-name [Funky]
- **Sniff for:** a comment that is a name in waiting. `// check if the user can edit` above a condition, `// build the request` above a block, `// this is the retry budget` above `const n = 3`. The comment is doing work the identifier should do.
- **Fix:** extract the block into a function or bind the value to a constant whose name says it, and delete the comment. This is the one case where deleting a comment strictly increases what the code says.
- **Don't flag:** a guide comment structuring a long routine that genuinely should stay one routine, or a name that would grow absurd. Do not force a `doTheThingThatAlsoHandlesTheOtherThing()`.
- **Source:** Fowler, Refactoring, Extract Function (https://refactoring.com/catalog/extractFunction.html).

### 30. should-be-a-test [Funky]
- **Sniff for:** a comment asserting behavior that nothing checks. "This handles the empty case", "returns null for unknown ids", "safe for concurrent readers", "works for up to 10k rows". A claim with no test is a claim that will quietly stop being true.
- **Fix:** write the test and let its name carry the claim. Keep the comment only for the reasoning the test cannot express.
- **Don't flag:** a claim that is already covered; check before demanding a test. Test-suite quality itself belongs to `test-stinky`.
- **Source:** Fowler, CodeAsDocumentation (https://martinfowler.com/bliki/CodeAsDocumentation.html).

### 31. wrong-channel [Funky]
- **Sniff for:** the information is in a form the ecosystem's tooling cannot use. A plain `//` block above an exported symbol where `///`, `/** */`, or a docstring is what renders in the IDE and the generated docs; a doc comment on a private helper nobody outside can call; interface facts written inside the body.
- **Fix:** move it to the channel the ecosystem reads. Follow the language convention (rustdoc, godoc, TSDoc, PEP 257) and keep implementation notes as ordinary comments inside.
- **Don't flag:** a project with a deliberate and consistent different convention.
- **Source:** PEP 257, Docstring Conventions (https://peps.python.org/pep-0257/) and TSDoc (https://tsdoc.org/).

### 32. essay-comment [Whiff, Funky when it buries the one load-bearing sentence]
- **Sniff for:** a comment much longer than the code it explains, with the actual reason in the fifth sentence. Multi-paragraph design narratives above a three-line function, background the reader does not need, a summary of everything the module does above one helper.
- **Fix:** lead with the load-bearing sentence and cut to two or three. If the material is genuinely large, it is design documentation and belongs in a module header, an architecture doc, or a knowledge bundle, with a one-line pointer here.
- **Don't flag:** a long comment on genuinely subtle code (a concurrency protocol, a numerical method, a security boundary) where every sentence is load-bearing.
- **Source:** Ousterhout, A Philosophy of Software Design, ch. 13 (https://web.stanford.edu/~ouster/cgi-bin/book.php).

### 33. unowned-todo [Funky]
- **Sniff for:** `TODO`, `FIXME`, `HACK`, `XXX` with no owner, no ticket, and no condition for doing it. Bare `// TODO: improve this` accretes forever and trains the team to read TODO as decoration. The same finding covers **undated temporal prose**, "for now", "currently", "temporarily", "until we", which is debt carrying no marker at all, so nothing will ever list it.
- **Fix:** every marker gets a name or a ticket and a trigger condition ("TODO(ISSUE-412): drop the shim once the v2 API ships"). Promote temporal prose into the same form, or delete the temporal word and state the rule as standing. If it does not deserve a ticket, it does not deserve a marker; either fix it or delete it.
- **Don't flag:** a marker that already carries an owner or a link, a scratch marker in a branch that is not being merged, or "currently" used about runtime state rather than about the code's lifespan.
- **Source:** Google C++ Style Guide, TODO Comments (https://google.github.io/styleguide/cppguide.html#TODO_Comments).

# Pillar 6. Voice and register

Prose style in general belongs to `no-slop`. These four are the register problems specific to code comments.

### 34. author-voice [Funky]
- **Sniff for:** the comment is about the person who wrote it. "I changed this to", "we decided", "let's keep this simple for now", "you should not call this directly", "our approach here". First person and second person both put a narrator between the reader and the code, and "we" has no referent a year later.
- **Fix:** write about the code, impersonally and in the present tense. "Callers outside the module use `open()`" beats "you should not call this directly".
- **Don't flag:** an established project voice used consistently, or "we" in genuine team documentation such as an architecture decision record.
- **Source:** Google Python Style Guide, Comments and Docstrings (https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings).

### 35. hedging [Whiff]
- **Sniff for:** uncertainty that should have been resolved before the comment was written. "This might be needed", "probably safe", "I think this handles the edge case", "should hopefully work", "not sure why this is required but it breaks without it".
- **Fix:** find out and state it. If it genuinely cannot be resolved, say precisely what is unknown and how someone would find out, which is useful; vague doubt is not.
- **Don't flag:** an honest, specific statement of a known unknown ("upstream does not document whether this is stable across restarts; treat as best-effort").
- **Source:** Sanfilippo, Writing System Software: Code Comments, "debt comments" (https://antirez.com/news/124).

### 36. overclaiming [Funky]
- **Sniff for:** an unbacked guarantee. "Fully handles all cases", "this is thread-safe", "guaranteed to never throw", "completely validates the input", "optimized". The strength of the claim is the tell; the reader will rely on it.
- **Fix:** state the bounded truth and back it. "Safe for concurrent readers; writers must hold `state_lock`" with the guard annotation and a test, or drop the claim.
- **Don't flag:** a strong claim that is actually enforced by the type system, a lock annotation, or a test named after it.
- **Source:** Rust API Guidelines, Documentation (https://rust-lang.github.io/api-guidelines/documentation.html).

### 37. decoration [Whiff]
- **Sniff for:** emoji, exclamation marks, ALL-CAPS emphasis, marketing register ("blazing fast helper"), rhetorical questions, and jokes that will need explaining. Also arrow art and alignment padding that every future edit has to maintain.
- **Fix:** plain declarative sentences. Save the emphasis for the one genuinely dangerous thing in the file, where all-caps still works because it is rare.
- **Don't flag:** a project that consistently uses a marker convention (`// SAFETY:`, `// NOTE:`, `// PERF:`) which is structure, not decoration, and often machine-greppable.
- **Source:** Linux kernel coding style, Commenting (https://www.kernel.org/doc/html/latest/process/coding-style.html#commenting).
