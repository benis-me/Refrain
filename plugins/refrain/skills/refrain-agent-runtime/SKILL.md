---
name: refrain-agent-runtime
description: Use when building, debugging, or reviewing Agent CLI scanning, model discovery, subprocess execution, run events, logs, local daemon state, or BYOK agent selection.
---

# Refrain Agent Runtime

Use this skill when a project shells out to coding-agent CLIs or exposes agent
runtime state in a product UI.

## Start Here

Read `references/agent-runtime-contract.md` when available.

## Discovery Contract

Scan `PATH` for candidate commands. For each candidate, record:

- stable id
- command
- resolved path when found
- version when cheap
- status: `available`, `missing`, or `errored`

Do not fake installed agents. Show missing agents clearly.

## Model Discovery

Prefer asking the CLI for its actual capabilities. If discovery is slow or
fragile:

- cache the result
- expose refresh
- show the source command
- separate "unknown" from "not supported"

Do not hardcode stale model lists when the CLI can report them.

## Run Events

Use explicit event types:

- `process-output`
- `file-changed`
- `quality-finding`
- `preview-ready`
- `summary`
- `error`
- `exit`

Keep final summary separate from process output. Keep stderr visible.

## Local Safety

- Default host is `127.0.0.1`.
- Show write-capable command lines before first execution.
- Do not request hosted credentials when a local authenticated CLI is enough.
- Never send project files to a service unless the user explicitly chooses that
  connector or CLI.

## UI Requirements

The product surface should show:

- selected CLI and version
- selected model when relevant
- run status
- live output
- final summary
- stop, restart, inspect, or open-log actions when supported

The runtime should be auditable, not theatrical.

## Verification

Use fake CLI tests for scanner behavior. For real integrations, run the cheapest
safe command, such as `--version` or `--help`, and record command, exit code,
and output excerpt.
