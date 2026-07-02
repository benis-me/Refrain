# Engineering Principles

Less surface area makes future agents more reliable. These defaults are
extracted from a shipped local-first product; deviate deliberately, not by
habit.

## Hermetic Baseline

- Node standard library first: `node:http` with a hand-rolled router instead
  of Express, `node:sqlite` with raw SQL instead of an ORM, `node:test`
  instead of a test framework, `console` instead of a logging framework.
- TypeScript strict mode executed via type stripping: no build step for
  backend code.
- Useful strict flags beyond `strict`: `noUncheckedIndexedAccess`,
  `noImplicitOverride`, `verbatimModuleSyntax`, `isolatedModules`.
- No ESLint or Prettier by default. The compiler is the gate; taste lives in
  review, not formatter churn.
- Zero external dependencies in core packages is a realistic target. Apps may
  carry a curated handful (UI primitives, icons, motion, markdown).

## Module Boundaries

- Do not create a package until at least two consumers need the boundary or
  it protects a risky capability: subprocess execution, persistence, prompt
  assembly.
- Packages export plain data contracts; callers decide policy.
- Name functions for what the caller needs, not how the work happens.
- Do not hide subprocess, filesystem, or network behavior behind vague
  helpers.

## Runtime Shape

- Bind local daemons to `127.0.0.1`.
- Keep user data in one named local data directory.
- Ephemeral ports with a discovery file beat hardcoded ports: the daemon
  writes `{host, port}` to a known JSON path and clients read it. No port
  collisions, no config.
- Persist enough run state to reopen the app without lying about progress.

## Configuration

- Environment variables for process-level knobs, a settings store for user
  choices, nothing else. No YAML, TOML, or JSON config files until a real
  consumer exists.
- Settings persisted in storage override environment defaults.

## Errors

Every boundary returns a typed result, not vague truthiness: discovered vs
missing CLI, started vs running vs exited run, lint clean vs blocked, preview
ready vs stale vs failed. Errors carry what the next agent inspects: command,
cwd, exit code, stderr excerpt, file path, route, or rule id.

## Prompt Composition

When the product drives an agent, prompt assembly is its own boundary with a
fixed layer order:

1. injection-resistance rules, pinned first
2. product identity and charter
3. quality contract, generated from the linter's rule source
4. design system and tokens for the current task
5. task instructions and user instructions
6. anti-roleplay guard, pinned last

Layers are functions over data, not string concatenation scattered through
handlers. The quality contract is generated so the prompt and the linter
cannot disagree.

## One Source Of Truth, Drift-Tested

When a rule list feeds both documentation and enforcement, one artifact is
the source and the other is generated from it or checked against it, with a
test that fails on divergence. Never maintain two hand-written copies of the
same rule corpus.

## Dogfood Rule

The product must pass its own quality gate. If the product ships a linter,
its own UI is a bug whenever that linter would flag it. Write this down in
the repository so future agents inherit the constraint.

## Tests

Start with behavior tests at risky boundaries:

- scanner finds a fake CLI placed on a temp PATH
- quality linter flags a known-bad fixture and passes a clean one
- daemon answers health and JSON routes
- store migrations preserve existing data
- real browser or app checks when UI behavior matters

Broaden only when a module becomes shared or stateful.

## Refactoring Rule

Refactor when it reduces future agent context, not when it looks
architecturally impressive. A good refactor makes the next edit smaller and
the next verification command clearer.
