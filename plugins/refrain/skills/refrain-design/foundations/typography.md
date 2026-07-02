# Typography

Type carries hierarchy before color or decoration.

## Default Identity

The default stacks and ramp live in `identity/tokens.css` and section 3 of
`identity/DESIGN.md`: Geist for display and body, Geist Mono for metadata and
numerics, Space Grotesk reserved for the wordmark, tight negative tracking on
display sizes. Read them before inventing a new ramp.

## Roles

- display: strong weight, tight line-height, negative tracking, no gradient
  clipping
- heading: clear section ownership, not hero-sized inside tools
- body: concrete copy, comfortable line height
- metadata: the signature label treatment is monospace, uppercase, tracked,
  small, medium weight (`.label-mono` in `identity/tokens.css`)
- numerics: tabular when values compare (`.tnum`)

## Rules

- Uppercase only with tracking (untracked-all-caps).
- Hierarchy through weight, scale, and tracking, not size alone.
- Keep button and control text short enough for compact layouts.
- Reserve large type for actual first-viewport identity, not every panel.
- Maximum two typefaces per product, plus an optional wordmark face.

## Reject

- hardcoded generic display fonts when the design system provides font tokens
  (hardcoded-display-sans)
- text justification
- multiple h1s in app shells (multiple-h1)
- gradient-clipped display text (gradient-text)
- filler claims such as "unlock", "supercharge", or "seamless"
  (marketing-filler)
