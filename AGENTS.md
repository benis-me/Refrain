# Refrain Agent Instructions

Refrain is a distillation repository. Work only inside this repository unless
the user explicitly gives another path.

## Boundaries

- Do not modify source projects outside this repository unless the user
  explicitly asks for that path.
- Do not copy implementation code from source projects.
- Extract principles, contracts, tests, and starter patterns.
- Keep outputs agent-facing: concrete triggers, defaults, forbidden moves, and
  verification commands.
- Prefer small files with one responsibility.

## Required Reading

Before changing product guidance, read the plugin references:

- `plugins/refrain/references/distilled-charter.md`
- `plugins/refrain/references/engineering-principles.md`
- `plugins/refrain/references/verification-standard.md`

Before changing a skill, read:

- the target `plugins/refrain/skills/*/SKILL.md`
- `plugins/refrain/references/polish-rubric.md`

Before changing the new-project guidance, read:

- `plugins/refrain/blueprints/new-project.md`

## Validation

Run this before claiming completion:

```sh
npm run verify
```

If a change only touches prose, still run the validator. This repository is a
plugin distribution package, so prose structure is production behavior.

## Style

- Direct, restrained, specific.
- No motivational filler.
- No generic AI-product language.
- Prefer explicit tradeoffs over broad principles.
- If a rule cannot guide an agent's next action, tighten it.
