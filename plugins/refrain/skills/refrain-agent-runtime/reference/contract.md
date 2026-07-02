# Agent Runtime Contract

Keeps Agent CLI integration honest and inspectable. The names below are the
default vocabulary; rename only with a reason.

## Discovery

Scan for known commands on an augmented PATH (the cookbook lists the
directories). For each candidate store:

- stable id (`claude`, `codex`, `gemini`, ...)
- command name and resolved absolute path when found
- version when cheap: probe `--version` with a timeout of a few seconds and
  bounded output capture
- status: `available`, `missing`, or `errored`

Persist scan results (for example `agents.json` in the data directory) and
warm the cache on startup; never block the UI on a cold scan. Do not fake
installed agents.

## Model Discovery

Prefer asking the CLI for its capabilities; keep a seed list per CLI only as
a fallback. Two depths:

- shallow: cheap methods, runs on normal scan
- deep: slow methods (interactive scrapes, network calls), runs only on
  explicit rescan

Cache results with the source command visible, expose a refresh action, and
separate "unknown" from "not supported". Do not hardcode a stale model list
when the CLI can report its own.

## Execution Record

Every run carries: run id, project id, agent id, model id when selected,
cwd, command argv, started timestamp, and an event stream.

## Event Vocabulary

Lifecycle events: `run-start`, `turn-start`, `turn-end`, `run-done`,
`run-cancelled`, `run-error`.

Stream events: `activity` (kind `text` or `tool`, with a short tool
summary), `quality-finding`, `preview-update`, `summary`,
`ask-user-question`.

Rules:

- Never collapse stdout, stderr, tool activity, and final summary into one
  blob. Keep stderr visible.
- The final summary stays separate from process output.
- Filter tool noise at the parser: surface writes, edits, and commands; drop
  read-only churn from the activity feed.

## Prompt Transport

- Deliver prompts over stdin (line-delimited JSON for structured CLIs),
  never argv: argv leaks into process lists, hits length limits, and invites
  quoting bugs.
- Pass system prompts through the CLI's dedicated flag when one exists;
  otherwise prepend them to the message.
- Bound prepended conversation history to a few thousand characters, oldest
  dropped first.

## In-Band Control Markers

When the product needs structured signals from a text-only agent channel,
define explicit markers the agent is instructed to emit, such as
`<app-ask-user-question>` and `<app-final-summary>`. Extract them in the
stream parser; never regex the whole transcript after the fact.

## Environment Hygiene

Child processes get a curated environment:

- the augmented PATH
- your own hook or tracing systems disabled for the child; a nested agent
  that triggers the parent's hooks recurses
- the CLI's non-essential traffic disabled when it offers a switch

## Lifecycle

- One AbortSignal per run; abort sends SIGTERM and escalates to SIGKILL
  after a grace period.
- Abort is not an error: emit `run-cancelled` and never retry it.
- Transient failures retry with exponential backoff (for example three
  attempts starting around half a second), each retry visible in the UI.
- Close stdin on completion, ignore EPIPE from early exit, always reap the
  process.

## Persistence

Append every event as one JSON line to a per-run log file. After restart the
product must answer three questions: the last known run status, which
artifact or preview to show, and what to inspect next if it failed. Reattach
live clients by replaying the log, then streaming.

## Security

- Default host `127.0.0.1`.
- Show the exact command before first execution when it writes files.
- Permission and sandbox flags are explicit product decisions (see the
  cookbook's permission-posture note), never silent defaults.
- No hosted API keys when a local authenticated CLI is available; no project
  files to a hosted service without an explicit user choice.
