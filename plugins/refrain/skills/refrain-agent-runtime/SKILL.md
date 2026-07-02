---
name: refrain-agent-runtime
description: Use when building, debugging, or reviewing anything that discovers or shells out to coding-agent CLIs - agent scanning, model discovery, subprocess execution, run events, transcripts, or BYOK agent selection in a product.
---

# Refrain Agent Runtime

Use this skill when a project shells out to coding-agent CLIs or exposes
agent runtime state in a product UI. The goal is an auditable runtime, not a
theatrical one.

## Start Here

In this skill directory:

- `reference/contract.md`: the normative discovery, execution, event, and
  persistence contract.
- `reference/cli-cookbook.md`: per-CLI invocation flags, model discovery
  commands, and environment hygiene, as last verified.
- `scripts/fake-runner-example.mjs`: runnable reference for the runner
  interface, a fake CLI on a temp PATH, and scanner behavior. Run it with
  `node scripts/fake-runner-example.mjs`.

## Core Decisions

- Discovery scans an augmented PATH (GUI apps do not inherit the shell PATH;
  the cookbook lists the directories) and probes `--version` with a short
  timeout.
- Runners come in two tiers: structured-stream runners for CLIs with a JSON
  event stream, and a generic best-effort runner for everything else. One
  interface, per-CLI adapters.
- Prompts travel over stdin, never argv. Bound conversation history before
  prepending it.
- Model discovery asks the CLI when possible, caches the answer, exposes a
  refresh action, and separates "unknown" from "not supported". Slow
  discovery runs only on explicit deep rescan.
- Every run persists an append-only event log so the UI can reattach after
  restart.
- Cancellation is not an error: distinguish abort from failure, and never
  retry an abort.

## Local Safety

- Default host is `127.0.0.1`.
- Show write-capable command lines before first execution.
- Decide the permission posture deliberately: full-access flags are a product
  decision for trusted local generation, never a silent default.
- Do not request hosted credentials when a local authenticated CLI is enough,
  and never send project files to a hosted service unless the user explicitly
  chooses that connector or CLI.

## UI Requirements

The product surface shows: selected CLI and version, selected model when
relevant, run status, live output, final summary separated from process
output, and stop, restart, inspect, or open-log actions when supported.
Missing agents are shown as missing, never faked.

## Verification

Use fake-CLI tests for scanner and runner behavior; the pattern is in
`scripts/fake-runner-example.mjs`. For real integrations, run the cheapest
safe command such as `--version`, and record command, exit code, and an
output excerpt.
