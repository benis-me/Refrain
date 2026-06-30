---
name: refrain-engineering-kernel
description: Use when starting, structuring, refactoring, or reviewing an AI-led local-first project that needs Refrain's restrained engineering defaults.
---

# Refrain Engineering Kernel

Use this skill when shaping the codebase. Refrain favors small, inspectable
systems that future agents can understand quickly.

## Start Here

Read `references/engineering-principles.md` when available. If the project
includes an `AGENTS.md`, follow it first.

## Default Architecture

Use these boundaries only when the project needs them:

- `apps/web` for the visible shell.
- `apps/daemon` for local HTTP, filesystem, and subprocess work.
- `packages/agent-runtime` for Agent CLI discovery and run events.
- `packages/quality` for deterministic lint and scoring.
- `packages/core` for persistent state.

Do not add a package just to look architectural. Add it when it protects a risky
boundary or reduces future agent context.

## Runtime Defaults

- Bind local servers to `127.0.0.1`.
- Keep user data in a named local data directory.
- Separate process output, final summaries, errors, file changes, and quality
  findings.
- Persist enough state to reopen without pretending an interrupted run
  succeeded.
- Prefer bring-your-own local Agent CLI over hosted model routing.

## Dependency Defaults

Use dependencies for real leverage: rendering, routing, parsing, domain engines,
and proven UI primitives. Avoid dependencies for thin wrappers around Node
built-ins or one-off helpers.

## File Design

- Keep files focused on one responsibility.
- Prefer plain data contracts between modules.
- Name functions for what the caller needs, not how the function works.
- Do not hide subprocess, filesystem, or network behavior behind vague helpers.

## Test Defaults

Start with boundary tests:

- fake CLI discovery on `PATH`
- quality rule findings
- health or JSON routes
- persistence migration when storage exists
- real browser or app checks when UI behavior matters

## Verification

Before completion:

1. Run the repository verification command.
2. Read the output.
3. If runtime behavior changed, verify the actual daemon, UI, or CLI path.
4. Report exact commands and any remaining gaps.
