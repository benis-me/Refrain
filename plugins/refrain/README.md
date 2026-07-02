# Refrain Plugin

Agent Skills packaging a restrained local-first product style.

## Install

From GitHub:

```sh
/plugin marketplace add benis-me/Refrain
/plugin install refrain@refrain-marketplace
```

## Contents

- `skills/refrain-design` - structure, interface grammar, and the default
  identity (`identity/tokens.css`, `identity/DESIGN.md`).
- `skills/refrain-engineering` - engineering defaults
  (`reference/principles.md`).
- `skills/refrain-agent-runtime` - runtime contract, per-CLI cookbook, and
  a runnable fake-runner example.
- `skills/refrain-review` - review rubric and the anti-slop linter
  (`scripts/anti-slop-lint.mjs`).
- `commands/new-project.md` - the `/refrain:new-project` start command.

This plugin is the canonical content source. The repository root only holds
marketplace metadata, validation, and contributor instructions.

## New Projects

Do not copy a starter app; there is none. Run `/refrain:new-project <brief>`
or invoke the skills directly and let the agent choose the smallest
structure that fits, adopting the identity tokens in
`skills/refrain-design/identity/tokens.css` as the default design system.
