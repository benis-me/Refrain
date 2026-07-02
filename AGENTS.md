# Refrain Agent Instructions

Refrain is a distillation repository: it packages a personal product style
as installable Agent Skills. Work only inside this repository unless the
user explicitly gives another path.

## Boundaries

- Do not modify source projects outside this repository unless the user
  explicitly asks for that path.
- Extract principles, contracts, rule tables, tests, and reference
  artifacts (token files, design charters, runnable examples). Do not copy
  product feature code, and never reference a source project by name or
  path inside `plugins/refrain/`.
- Keep outputs agent-facing: concrete triggers, defaults, forbidden moves,
  and verification commands.
- Prefer small files with one responsibility. Every rule lives in exactly
  one file; other files point to it. The linter's `RULES` table is the
  single source for machine-checkable blockers.
- All paths written inside a skill are relative to that skill's directory,
  so they resolve after installation. The validator link-checks them.
- Plugin prose avoids em-dashes, and motion numbers appear only in
  `foundations/motion.md` and the identity files; the validator enforces
  both.

## Required Reading

Before changing a skill, read the target `plugins/refrain/skills/*/SKILL.md`
and the files it routes to:

- design: `skills/refrain-design/` (`identity/`, `foundations/`,
  `controls/`, `surfaces/`, `prompts/`, `cases/`)
- engineering: `skills/refrain-engineering/reference/principles.md`
- agent runtime: `skills/refrain-agent-runtime/reference/contract.md` and
  `reference/cli-cookbook.md`
- review: `skills/refrain-review/reference/rubric.md` and
  `scripts/anti-slop-lint.mjs`

Before changing new-project guidance, read
`plugins/refrain/commands/new-project.md`.

## Validation

Run before claiming completion:

```sh
npm run verify
```

This runs the structural validator, the test suite (including linter
fixture and drift tests), and `claude plugin validate` when the Claude CLI
is installed. If a change only touches prose, still run it: this repository
is a plugin distribution package, so prose structure is production
behavior.

## Distribution

- Canonical content lives in `plugins/refrain/` (skills and commands). The
  repository root holds marketplace descriptors, validation, and this file.
- Claude Code marketplace: `.claude-plugin/marketplace.json`. Install with
  `/plugin marketplace add benis-me/Refrain`, then
  `/plugin install refrain@refrain-marketplace`.
- Codex marketplace: `.agents/plugins/marketplace.json` and
  `plugins/refrain/.codex-plugin/plugin.json`.
- Release: update content, run `npm run verify`, bump both
  `plugins/refrain/.claude-plugin/plugin.json` and
  `plugins/refrain/.codex-plugin/plugin.json` to the same version (the
  validator enforces equality, and the marketplace entry must match), then
  publish or tag.

## Style

- Direct, restrained, specific.
- No motivational filler, no generic AI-product language.
- Prefer explicit tradeoffs over broad principles.
- If a rule cannot guide an agent's next action, tighten it.
