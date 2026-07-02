# Agent CLI Cookbook

Field notes for driving coding-agent CLIs from a product. Last verified
2026-07 against shipping versions; CLIs change fast, so re-verify flags with
`--help` before relying on them.

## Augmented PATH

GUI-launched processes (Electron, app bundles) do not inherit the shell
PATH. Build one before scanning or spawning; include at least:

- the active Node's bin directory (`dirname(process.execPath)`)
- `~/.local/bin`, `~/.npm-global/bin`, `~/.bun/bin`, `~/.deno/bin`,
  `~/.cargo/bin`
- `/opt/homebrew/bin`, `/usr/local/bin`, `/usr/bin`, `/bin`

Probe each candidate with `<command> --version`, a timeout of a few seconds,
and bounded stdout/stderr capture.

## Permission Posture

The flags below include full-access examples (`--permission-mode
bypassPermissions`, `--sandbox danger-full-access`, `--yolo`,
`--allow-all-tools`, `--yes-always`). They fit a trusted local generation
product where the user chose the tool and the working directory. Treat them
as a deliberate product decision: pick the strictest mode the product can
tolerate, and show write-capable commands before first execution.

## Invocation Matrix

| CLI | Non-interactive run | Prompt transport | Model discovery |
| --- | --- | --- | --- |
| claude (Claude Code) | `claude -p --input-format stream-json --output-format stream-json --verbose --permission-mode <mode> --append-system-prompt <sys> [--model <m>]` | stdin, one JSON message per line | seed aliases (opus, sonnet, haiku) |
| codex (Codex CLI) | `codex exec --skip-git-repo-check --sandbox <mode> [-m <model>] <prompt>` | argv | `codex debug models` returns JSON |
| gemini (Gemini CLI) | `gemini --yolo [-m <model>] -p <prompt>` | argv | API model list when an API key is set; seed otherwise |
| cursor-agent | `cursor-agent [--model <m>] -p <prompt>` | argv | `cursor-agent models` (requires auth) |
| copilot (Copilot CLI) | `copilot --allow-all-tools --output-format json [--model <m>]` | stdin | none; seed only |
| codebuddy | Claude Code compatible flags | stdin stream-json | `--help` parse; deep rescan drives `/model list` over a PTY |
| qwen (Qwen Code) | `qwen --yolo [-m <model>] -p <prompt>` | argv | seed only |
| opencode | `opencode run [--model <m>] <prompt>` | argv | provider-dependent; empty seed |
| aider | `aider --yes-always --no-auto-commits [-m <model>] --message <prompt>` | argv | seed only |

Runner tiers: claude and codebuddy support a structured stream; everything
else is generic tier. Generic tier: capture stdout, surface a trimmed tail
(about the last dozen lines) as the result, and rely on the exit code for
success.

## Stream Parsing (structured tier)

- Parse each line as JSON; skip unparseable lines.
- Extract text blocks and tool_use blocks; summarize only meaningful tools
  (writes, edits, commands) into the activity feed, and drop read-only
  churn.
- The `result` event carries `is_error`, the final text, and a session id;
  keep the session id for future resume support.

## Environment Hygiene

Set on every child process:

- the augmented PATH
- your own hooks disabled for the child, or a nested agent will recurse into
  them; ship a documented kill-switch variable such as
  `<PRODUCT>_HOOK_DISABLED=1`
- `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1` when driving Claude Code

## Failure Notes

- Auth-gated discovery (cursor-agent) errors when logged out: treat as
  "unknown models", not "no models".
- PTY-scrape discovery (codebuddy) can take tens of seconds: deep-rescan
  only.
- Generic-tier CLIs report success only via exit code; treat a nonzero exit
  plus captured stderr as the error message.
- History prepended to prompts must be bounded (a few thousand characters)
  or long conversations blow the CLI's input limits.
