# Refrain

Refrain is an agent-facing distillation of a restrained local-first product
style. It packages design taste, engineering boundaries, runtime contracts, and
review standards into an installable plugin for future AI-led projects.

Refrain is a product operating layer for agents. It helps future projects keep a
quiet interface, clear architecture, auditable local runtime behavior, and
evidence-backed verification without starting from a prebuilt app template.

## What Is Included

- `AGENTS.md` — repository instructions for agents working inside Refrain.
- `LICENSE` — MIT license for the distributable plugin package.
- `.claude-plugin/marketplace.json` — Claude Code marketplace entry for GitHub
  installation.
- `.agents/plugins/marketplace.json` — Codex-compatible marketplace entry for
  local and shared plugin installation.
- `plugins/refrain/` — the canonical installable plugin package:
  - `skills/`
  - `references/`
  - `blueprints/new-project.md`
- `scripts/validate-refrain.mjs` — structural validation for this repository.

## Install From GitHub

Claude Code users install Refrain as a plugin marketplace from GitHub:

```sh
/plugin marketplace add benis-me/Refrain
/plugin install refrain@refrain-marketplace
```

Codex-compatible runtimes should load the same plugin package through
`.agents/plugins/marketplace.json` or a compatible marketplace source.

## Start A New Project

After installation, start new projects by naming the plugin skills, not by
copying files:

```txt
Use Refrain to start this project.

Apply:
- refrain-product-style
- refrain-interface-design
- refrain-engineering-kernel
- refrain-product-review

If this project executes or selects external coding agents, also apply
refrain-agent-runtime.

Start from my real first workflow, choose the smallest structure that fits, and
ship one verified vertical slice.
```

The plugin contains no starter app. Refrain is meant to shape agent judgment,
not preload a project with unrelated files.

## Skills

- `refrain-product-style` — product shell and app-style defaults.
- `refrain-interface-design` — visual direction, interface grammar, and design
  review routing.
- `refrain-engineering-kernel` — restrained local-first architecture.
- `refrain-agent-runtime` — Agent CLI discovery and runtime contracts.
- `refrain-product-review` — polish and anti-slop verification.

## Commands

```sh
npm test
npm run verify
```

`npm test` runs the root validation tests.
`npm run verify` runs the structural validator first, then the full test suite.

## Position

Refrain optimizes for products that are quiet, local-first, tool-like, and
verified on the real surface. It rejects generic AI gloss: decorative gradients,
invented metrics, shadow-heavy cards, oversized marketing heroes, vague copy,
and UI that only works in the filled state.

The default bar is simple: if a future agent cannot use it, it is not distilled.
