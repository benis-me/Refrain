# Refrain

Refrain is an agent-facing distillation of a restrained local-first product
style: a concrete design identity, interface grammar, engineering defaults,
agent runtime contracts, and a deterministic review gate, packaged as
installable Agent Skills for future AI-led projects.

## What Is Included

- `plugins/refrain/` - the canonical installable plugin:
  - `skills/refrain-design` - product shells, interface grammar, and the
    default identity (`identity/tokens.css` plus `identity/DESIGN.md`).
  - `skills/refrain-engineering` - restrained local-first engineering
    defaults (`reference/principles.md`).
  - `skills/refrain-agent-runtime` - Agent CLI discovery and runtime
    contracts, a per-CLI cookbook, and a runnable fake-runner example.
  - `skills/refrain-review` - review rubric plus a zero-dependency
    anti-slop linter (`scripts/anti-slop-lint.mjs`).
  - `commands/new-project.md` - the `/refrain:new-project` start command.
- `.claude-plugin/marketplace.json` - Claude Code marketplace entry.
- `.agents/plugins/marketplace.json` - Codex-compatible marketplace entry.
- `scripts/` and `tests/` - structural validation, linter fixtures, and
  drift tests for this repository.

## Install From GitHub

Claude Code users install Refrain as a plugin marketplace from GitHub:

```sh
/plugin marketplace add benis-me/Refrain
/plugin install refrain@refrain-marketplace
```

Codex-compatible runtimes load the same plugin package through
`.agents/plugins/marketplace.json`.

## Start A New Project

```txt
/refrain:new-project <brief>
```

Or without the command:

```txt
Use Refrain to start this project. Apply refrain-design,
refrain-engineering, and refrain-review. Add refrain-agent-runtime only if
this project executes or selects external coding agents. Start from my real
first workflow, adopt the default identity tokens, and ship one verified
vertical slice.
```

The plugin contains no starter app. Refrain shapes agent judgment and ships
a small set of copyable artifacts (identity tokens, a design charter, a
linter, a fake-runner example) instead of preloading a project with files.

## Skills

- `refrain-design` - structure and visual design, with a concrete default
  identity.
- `refrain-engineering` - hermetic Node-first architecture defaults.
- `refrain-agent-runtime` - Agent CLI discovery, execution, events, and
  safety.
- `refrain-review` - deterministic anti-slop gate plus judgment review.

## Commands

```sh
npm test        # validator-backed tests, linter fixtures, drift tests
npm run verify  # structural validator, tests, claude plugin validate
```

## Position

Refrain optimizes for products that are quiet, local-first, tool-like, and
verified on the real surface. It rejects generic AI gloss: decorative
gradients, invented metrics, shadow-heavy cards, oversized marketing heroes,
vague copy, and UI that only works in the filled state.

The bar is simple: if a future agent cannot use it, it is not distilled.
