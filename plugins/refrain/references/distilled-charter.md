# Distilled Charter

Refrain exists to make a personal product style reusable by agents. The style is
not a palette. It is a set of defaults that shape product decisions, code
structure, runtime behavior, and verification.

## Product Position

Build tools, not theater. The first screen should help the user work. Marketing
language, oversized hero sections, and decorative spectacle are allowed only
when the product is explicitly a marketing site.

Favor:

- dense but readable work surfaces
- calm empty, loading, and error states
- visible files, runs, previews, versions, and logs
- local-first defaults and explicit boundaries
- evidence from the running surface

Reject:

- generic AI glow
- purple-blue trust gradients
- shadow-heavy card stacks
- emoji-as-icon decoration
- invented metrics
- filler copy such as "unlock", "seamless", and "supercharge"
- UI that only works in the happy, populated state

## Visual Defaults

- One accent color, used sparingly for focus, active state, and primary action.
- Borders over shadows. Hairline borders define surfaces; shadows are for
  overlays.
- Type carries hierarchy through size, weight, and spacing.
- Motion is short, functional, and guarded by reduced-motion support.
- Components use stable dimensions so state changes do not resize the layout.
- Icons are functional, not decorative.
- Cards are for repeated records, dialogs, and framed tools; page sections are
  not nested cards.

## Engineering Defaults

- Local-first before hosted.
- Bring-your-own-agent before managed model router.
- Small packages with direct interfaces before broad frameworks.
- Deterministic checks before model judgment.
- Runtime logs and persisted state before optimistic UI copy.
- Tests and visible verification before completion claims.

## Agent Defaults

An agent working under Refrain should:

1. Identify the user's actual workflow.
2. Choose the smallest product shell that supports that workflow.
3. Preserve local ownership of data and credentials.
4. Make agent/runtime state visible.
5. Run deterministic checks.
6. Verify the real surface before calling work complete.

## The Bar

The output should feel quieter, sharper, and more useful than the default AI
answer. If the work looks like a generic generated SaaS page, it missed the
charter even if the code compiles.

