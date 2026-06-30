---
name: refrain-product-style
description: Use when designing or implementing product UI, app shells, dashboards, local tools, generated interfaces, or user-facing screens that should follow Refrain's restrained product style.
---

# Refrain Product Style

Use this skill when the work has a visible product surface. The goal is not to
decorate the UI. The goal is to make the product quieter, sharper, and easier to
operate than generic AI output.

## Start Here

Read `references/distilled-charter.md` and
`references/product-shell-guidelines.md` when available. If neither path exists,
apply the rules below directly.

## Default Product Shape

- Build the actual working surface first, not a landing page.
- Prefer a tool shell: sidebar, primary workspace, inspector or detail pane when
  needed.
- Keep the first screen operational.
- Make files, runs, previews, versions, logs, and quality state visible when the
  product has them.
- Use dense but calm spacing. Empty space should clarify structure, not hide
  missing functionality.

## Visual Rules

- Use one accent color.
- Use borders before shadows.
- Reserve shadows for overlays.
- Avoid purple-blue trust gradients, bokeh, or decorative glow.
- Keep cards for repeated records, dialogs, or framed tools.
- Do not nest cards inside cards.
- Let typography carry hierarchy through weight, scale, and spacing.
- Keep motion short and functional.

## Component Defaults

- Icon buttons need accessible labels.
- Segmented controls are for modes.
- Tabs are for peer views.
- Select menus are for option sets.
- Sliders and steppers are for quantities.
- Every data surface needs loading, empty, error, and populated states.

## Copy Rules

Use concrete commands and nouns:

- Build
- Scan agents
- Preview
- Open log
- Restore version
- Compare

Avoid generic AI copy:

- unlock
- supercharge
- seamless
- reimagine
- transform your workflow
- AI-powered magic

## When To Challenge The User

Challenge a request when it pushes the product toward generic SaaS decoration,
marketing-page framing, broad purple gradients, invented metrics, or UI text
that describes features instead of making them usable.

Offer a restrained alternative that preserves the user's goal.

## Verification

Before claiming UI work is complete:

1. Run the project's test or verification command.
2. Inspect the real surface when layout, copy, or interaction changed.
3. Check for text overflow, overlapping controls, blank preview areas, missing
   empty/error states, and decorative filler.

Report the command and the visible surface checked.
