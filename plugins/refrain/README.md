# Refrain Plugin

This plugin packages Refrain's Agent Skills for installation through compatible
agent runtimes.

## Install

From GitHub:

```sh
/plugin marketplace add benis-me/Refrain
/plugin install refrain@refrain-marketplace
```

## Contents

- `skills/refrain-interface-design`
- `skills/refrain-product-style`
- `skills/refrain-engineering-kernel`
- `skills/refrain-agent-runtime`
- `skills/refrain-product-review`
- `references/`
- `blueprints/new-project.md`

This plugin is the canonical content source. The repository root only holds
marketplace metadata, validation, and contributor instructions.

## New Projects

Do not copy a starter app from this plugin. Invoke the installed skills and let
the agent choose the smallest structure that fits the actual product:

```txt
Use Refrain to start this project. Apply product-style, interface-design,
engineering-kernel, and product-review. Add agent-runtime only if this project
executes or selects external coding agents.
```
