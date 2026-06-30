# Agent Runtime Contract

Future Refrain projects often rely on external coding-agent CLIs. This contract
keeps that integration honest and inspectable.

## Discovery

Scan the user's `PATH` for known commands. Store:

- stable id, such as `codex`, `claude`, `gemini`, or `aider`
- command name
- absolute resolved path when available
- version output when cheap and safe
- status: `available`, `missing`, or `errored`

Do not hardcode a model list when the CLI can report its own capabilities. If
model discovery is slow or unreliable, show a cached result with a refresh
action.

## Execution

Every run should have:

- run id
- project id
- agent id
- model id when selected
- cwd
- command argv
- started timestamp
- event stream

Keep event types explicit:

- `process-output`
- `file-changed`
- `quality-finding`
- `preview-ready`
- `summary`
- `error`
- `exit`

Do not collapse stdout, stderr, tool output, and final summary into one blob.
That makes the UI easier to fake and harder to resume.

## State

Persist enough state to answer three questions after restart:

1. What was the last known run status?
2. What artifact or preview should be shown?
3. What command or log should be inspected next if it failed?

## Security

- Default host is `127.0.0.1`.
- Never ask for hosted API keys when a local authenticated CLI is available.
- Never send project files to a hosted service unless the user chooses that
  connector explicitly.
- Show the exact command before first execution when it writes files.

## UI Requirements

Agent runtime UI should expose:

- selected CLI and version
- selected model, if any
- run status
- live process output
- final summary separated from process output
- restart, stop, and inspect actions when supported

The point is not to dramatize the agent. The point is to make the runtime
auditable.

