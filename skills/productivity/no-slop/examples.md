# no-slop: before and after

Concrete rewrites for each rule. The "after" is shorter in almost every case. That is the signal you are doing it right.

## Em dashes

Before: The migration is simple — you change one config value — and everything else follows.
After: The migration is simple. You change one config value and everything else follows.

## not X, but Y

Before: This isn't just a refactor, it's a rethink of how the module is structured.
After: This refactor rethinks how the module is structured.

## Rule of three

Before: The API is fast, flexible, and powerful.
After: The API returns in under 10ms. (Name the property that matters, drop the decorative triple.)

## Throat-clearing opener

Before: In today's fast-moving development landscape, choosing the right database matters.
After: The database choice locks in your query patterns for years. Choose for the reads you do most.

## Self-summarizing close

Before: In conclusion, by following these steps you'll have a working setup that's robust and maintainable.
After: (Delete the paragraph. The last real instruction is the ending.)

## Transition filler

Before: Moreover, it's worth noting that the cache also reduces load on the primary.
After: The cache also takes load off the primary.

## Reflexive hedging

Before: It's important to note that this approach may potentially introduce some latency.
After: This approach adds latency, roughly 20ms per call. (Cut the hedge, then quantify if you can.)

## Validation

Before: Great question! You're absolutely right to think about error handling here.
After: Error handling is the gap here.

## Forced enumeration

Before: There are three main benefits to this approach. First, it's faster. Second, it's cleaner. Third, it scales.
After: The approach is faster and cleaner, and it holds up as the data grows. (Drop the announced count. Three short connected points read better as a sentence than as a numbered list.)

## List-itis (prose belongs here)

Before:

> The cache helps in several ways:
> - Reduces database load
> - Improves response time
> - Lowers cost

After:

> The cache takes read load off the database, which cuts response time and the bill that comes with it.

The three items are not independent. They are one causal chain (less load leads to faster reads leads to lower cost), so a sentence carries the logic that bullets flatten. Use the list when the items are genuinely parallel, like install steps or config options.

## Padding to a round number

Before: Five tips for faster builds: cache dependencies, parallelize tests, prune dead code, use a faster runner, and "consider your overall strategy".
After: Three things move build time most: cache dependencies, parallelize tests, switch to a faster runner. (The fourth and fifth were filler to reach five. Ship the real ones.)

## Slop vocabulary

Before: We leverage a robust, seamless pipeline to foster collaboration across teams.
After: The pipeline runs the same way in CI and locally, so teams share one build.

## A full paragraph

Before:

> In today's rapidly evolving tech landscape, it's crucial to leverage robust tooling. Our new CLI doesn't just speed things up, it fundamentally transforms your workflow. By delving into the intricate details of your config, it seamlessly handles edge cases. Moreover, it's worth noting that setup is a breeze. Ultimately, this is a game-changer for developer productivity.

After:

> The new CLI reads your existing config and handles the edge cases that used to need manual flags. Setup is one command. In our own repo it cut the release step from nine manual actions to one.

The after is shorter, says something checkable, and drops every slop tell. Note the central move: vague praise ("game-changer", "transforms your workflow") becomes a concrete number ("nine manual actions to one"). When you cut a slop phrase, replace it with a fact, not a quieter adjective.
