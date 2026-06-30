# Tokens

Use semantic tokens as the design boundary. Components should consume roles, not
raw colors.

## Required Roles

- background and foreground
- surface and surface-2
- muted foreground and secondary foreground
- border and strong border
- brand and brand-soft
- success, warning, destructive, and info when state exists

## Defaults

- 80-90% neutral surface.
- One active accent.
- OKLCH or design-system variables for palette definitions.
- Raw hex only inside token files.
- State color should describe product semantics such as running, ready, stale,
  failed, blocked, or verified.

## Reject

- default indigo as a convenience accent
- multiple dominant accents
- pure black or pure white dark mode
- state colors borrowed from random brand hues
