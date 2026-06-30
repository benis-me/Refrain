# New Project Blueprint

Use this when starting a project under Refrain. It is a decision guide, not a
starter template. Do not copy code from it.

## Plugin Invocation

Start through the installed plugin. Do not paste local paths unless developing
the plugin itself.

```txt
Use Refrain to start this project. Apply product-style, interface-design,
engineering-kernel, and product-review. Add agent-runtime only if this project
executes or selects external coding agents.
```

## Principle

Start from the user's workflow, not from a prebuilt app shape. A fixed starter
can make agents preserve irrelevant files, packages, and UI regions. Refrain
should shape judgment, not pre-decide architecture.

## First Pass

Answer these before creating files:

1. What is the user's real first workflow?
2. Is the product mostly UI, local automation, Agent CLI orchestration, content
   generation, or data review?
3. Does it need a daemon, or can it run as a single app/script?
4. What data must stay local?
5. What visible surface proves the product works?
6. What command will verify the first slice?

## Default File Shapes

Use the smallest shape that fits:

- Static prototype: `index.html`, `styles.css`, `main.js`.
- Small Node tool: `package.json`, `src/`, `test/`.
- Local-first app: `apps/web`, `apps/daemon`.
- Shared risky boundaries: add `packages/agent-runtime`, `packages/quality`, or
  `packages/core` only when the boundary is real.

Do not create all of these up front.

## Agent Runtime

Add Agent CLI scanning only when the product actually executes or selects
external coding agents. If it does, follow `references/agent-runtime-contract.md`.

## Quality Gate

Add deterministic anti-slop checks when the product generates or reviews visible
artifacts. If the product is not a generator, use the review rubric instead of
building a linter.

## First Deliverable

The first deliverable should be a vertical slice:

- one working user action
- one visible result
- one verification command
- one honest empty/error state when relevant

Stop there, verify, then expand.
