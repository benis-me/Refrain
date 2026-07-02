---
name: refrain-engineering
description: Use when starting, structuring, refactoring, or reviewing an AI-led local-first codebase that should follow Refrain's restrained engineering defaults - module boundaries, runtime shape, dependencies, tests, and verification.
---

# Refrain Engineering

Use this skill when shaping a codebase. Refrain favors small, hermetic,
inspectable systems that future agents can understand quickly.

## Start Here

Read `reference/principles.md` in this skill directory for the full doctrine.
If the project has an `AGENTS.md`, follow it first.

## Defaults

- Runtime: current Node LTS, standard library first. `node:http`,
  `node:sqlite`, `node:test`, and `node:child_process` cover a daemon,
  storage, tests, and subprocesses without frameworks.
- TypeScript strict, executed via type stripping; no bundler for backend
  code.
- No ESLint or Prettier by default: strict TypeScript is the gatekeeper.
- Configuration through environment variables; persisted user settings may
  override them.
- Local daemons bind `127.0.0.1` and write to one named data directory.
- Dependencies buy real leverage (rendering, routing, parsing, domain
  engines), never thin wrappers around Node built-ins.

## Module Boundaries

Add a boundary only when it protects a risky capability or reduces future
agent context:

- `apps/web`: visible shell.
- `apps/daemon`: local HTTP, filesystem, subprocesses.
- `packages/agent-runtime`: Agent CLI discovery and run events (see the
  refrain-agent-runtime skill).
- `packages/quality`: deterministic lint and scoring.
- `packages/prompt`: system-prompt composition when the product drives an
  agent.
- `packages/core`: persistent state once storage is real.

## New Project

Answer before creating files:

1. What is the user's real first workflow?
2. Is the product mostly UI, local automation, Agent CLI orchestration,
   content generation, or data review?
3. Does it need a daemon, or can it run as a single app or script?
4. What data must stay local?
5. What visible surface proves the product works?
6. What command will verify the first slice?

Then choose the smallest shape that fits: static prototype (`index.html`,
`styles.css`, `main.js`), small Node tool (`package.json`, `src/`, `test/`),
or local-first app (`apps/web` plus `apps/daemon`). Do not create all
boundaries up front. The first deliverable is one vertical slice: one working
action, one visible result, one verification command, one honest empty or
error state.

## Verification

Before completion:

1. Run the repository verification command and read the output.
2. If runtime behavior changed, exercise the actual daemon, UI, or CLI path.
3. Report exact commands, results, and remaining gaps.
