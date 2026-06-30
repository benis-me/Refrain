# Engineering Principles

Refrain's engineering style is restrained for the same reason as its UI style:
less surface area makes future agents more reliable.

## Module Boundaries

Prefer these boundaries in new projects:

- `apps/web`: user-facing shell and browser runtime.
- `apps/daemon`: local HTTP process, filesystem access, subprocesses.
- `packages/agent-runtime`: Agent CLI discovery, process execution, event shape.
- `packages/quality`: deterministic lint, scoring, and review formatting.
- `packages/core`: persistent project state when storage becomes necessary.

Do not create a package until at least two files need the boundary or the
boundary protects a risky capability such as subprocess execution.

## Runtime Shape

- Bind local daemons to `127.0.0.1` by default.
- Keep user data in a named local data directory.
- Treat subprocess output, final summaries, and errors as separate event types.
- Persist enough run state to reopen the app without lying about progress.
- Keep model/provider selection close to the actual Agent CLI capability scan.

## Dependency Posture

Use dependencies for real leverage: routing, rendering, complex parsing, or
domain engines. Avoid dependencies for small wrappers around Node built-ins.

Default starter code should run without install friction. Add packages only when
the project needs them.

## Error Handling

Every boundary should return a typed result, not vague truthiness:

- discovered vs missing CLI
- started vs running vs exited run
- lint clean vs lint blocked
- preview ready vs preview stale vs preview failed

Errors should tell the next agent what to inspect: command, cwd, exit code,
stderr excerpt, file path, route, or validation rule.

## Tests

Start with behavior tests at the boundary:

- scanner finds a fake CLI on `PATH`
- quality linter flags known slop
- daemon returns health and JSON routes
- UI shell preserves required landmarks

Broaden tests when a module becomes shared or stateful.

## Refactoring Rule

Refactor when it reduces future agent context, not when it makes the code look
architecturally impressive. A good Refrain refactor makes the next edit smaller
and the next verification command clearer.

