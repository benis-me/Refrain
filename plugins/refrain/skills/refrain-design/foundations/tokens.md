# Tokens

Use semantic tokens as the design boundary. Components consume roles, not raw
colors. Values live in the token layer; rules live here.

## Default Identity

The default palette, type ramp, radii, and motion variables are the identity
package in this skill: `identity/tokens.css` (copy it into new projects) and
`identity/DESIGN.md` (the charter that explains how to use it). Use it unless
the project defines its own design system. Override by replacing tokens, not
by scattering raw values through components.

## Required Roles

- background and foreground
- surface and surface-2
- muted-foreground and foreground-2
- border and border-strong
- brand, brand-foreground, brand-soft
- success and destructive; add warning, info, or product states (running,
  stale, verified) only when the product has them

## Rules

- Near-monochrome by default: neutrals carry 80-90% of pixels.
- The interactive accent may be achromatic. The default identity inverts ink
  and paper for selection and primary actions instead of introducing a hue.
- OKLCH for new palettes. Raw color values belong in token files only.
- State color describes product semantics such as running, ready, stale,
  failed, or verified.
- Dark mode is a designed theme, not an inversion filter: borders become
  low-opacity white, surfaces stay near-black rather than pure black.

## Reject

- default indigo as a convenience accent (ai-default-indigo)
- multiple dominant accents
- pure black or pure white dark mode (pure-black-surface)
- state colors borrowed from random brand hues
- raw color values inside components
