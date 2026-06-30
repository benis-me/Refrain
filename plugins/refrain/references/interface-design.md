# Interface Design

This reference defines Refrain's interface grammar. It is meant for agents that
need to design, critique, or implement product UI with strong taste.

For task-specific depth, use the route files inside
`skills/refrain-interface-design/`: `foundations/`, `controls/`, `surfaces/`,
`prompts/`, and `cases/`.

## Thesis

Refrain minimalism is not emptiness. It is operational density with fewer visual
crutches. The screen should feel authored because hierarchy, state, spacing,
tokens, and interaction are precise.

The target is a serious local tool:

- quiet enough for daily use
- dense enough for repeated work
- explicit enough for agent/runtime inspection
- polished enough that the design system is visible in every control

## Product Surface Before Composition

Start from the working surface. Navigation, run state, files, preview, history,
quality, design-system selection, and settings are design material. Do not hide
them behind a hero section or marketing copy.

Use a shell when the product has repeated work:

- slim sidebar for global areas
- full-bleed workspace for project pages
- top bars only when they carry real controls
- resizable panes when the user compares or inspects
- command palette and settings as overlays, not page sections

If a screen is a tool, the first viewport should show the tool.

## Screen Archetypes

Use these as starting points, then adapt them to the product:

- Creation home: an actual input/composer first, with attachment/reference
  affordances, mode controls, design-system choice, runtime target, and recent
  work close enough to continue.
- Workspace: slim global navigation plus a full-bleed work plane. Use panes for
  preview, files, conversation, quality, versions, or inspection when the user
  compares state.
- Design-system gallery: visual covers, filters, search, built-in/custom split,
  and cards that preview real components rather than slogans.
- Design-system detail: section navigation for overview, colors, type,
  spacing/radii, components, and brand examples.
- Settings: split by function in a sidebar. Group provider/runtime identity,
  defaults, local paths, and destructive actions separately.
- Selector popover: compact trigger, searchable list, visual rows, selected-row
  persistence, and optional hover preview when the selected value changes the UI.

## Token Grammar

Use semantic tokens before raw values:

- `--background`, `--foreground`
- `--card`, `--popover`
- `--surface`, `--surface-2`
- `--foreground-2`, `--muted-foreground`
- `--border`, `--border-strong`
- `--brand`, `--brand-soft`
- `--success`, `--destructive`

Prefer OKLCH or token references for new palettes. Raw hex belongs in the token
definition layer, not scattered across components.

Refrain's default tone is neutral: 80-90% neutrals, one active accent. Accent is
for selected state, focus, and the primary command. Repeated accent use makes a
screen feel generated.

Tokens should express product semantics. If the product has build state,
quality, preview, history, or runtime connection, define states for those
concepts instead of borrowing random accent colors.

## Type Grammar

Type does the hierarchy work:

- display/headings: weight and scale, not color effects
- body: comfortable line height, concrete copy
- metadata: monospace uppercase label with tracking
- numerics: tabular where values compare

Use uppercase only when tracked. Avoid gradient text. Avoid hardcoding generic
display fonts when the design system provides font tokens.

Labels should be terse and concrete. Metadata can use a compact monospace voice;
primary actions and errors should read plainly.

## Surface Grammar

Use borders and spacing first.

- In-page cards and panels: 1px border, flat fill.
- Overlays: popover/dialog/menu shadow is allowed.
- Dividers: use soft border opacity when the divider is secondary.
- Resize handles: visually thin but hit-target generous.
- Scrollbars: subtle, themed, and not chunky.

Cards are records, previews, dialogs, or framed tools. Do not use nested cards
as page layout.

Tool surfaces can be dense. Density becomes legible when rows have stable
height, icons have consistent hit targets, and groups are separated by rhythm
rather than decorative boxes.

## Motion Grammar

Motion is feedback, not atmosphere.

- default transitions around 150-180ms
- ease-out or spring only for small segmented/tab indicators
- no bounce or elastic motion
- all named animation needs `prefers-reduced-motion`
- one subtle loading/running treatment is acceptable when it communicates state

## Design System As Product Object

A design system should be inspectable, not just selectable.

For each system, expose:

- name and category
- brand mark or glyph when available
- swatch row: background, surface, foreground, accent
- specimen: brand lockup, sample type, button, input, chip
- detail sections: overview, colors, type, spacing/radii, components
- light/dark or on-surface examples when relevant

This lets agents and users see the style contract. A plain text theme dropdown is
not enough.

## Picker And Control Grammar

Controls should be compact but legible:

- selectors use a two-line form when space allows: meta label over selected value
- compact toolbar selectors show icon/mark, current value, chevron
- popovers include search when lists can grow
- built-in/custom split belongs in tabs
- clear/create actions live near search
- selected rows scroll into view without hijacking the page
- hover preview is useful when a choice is visual

Agent/model selectors should mirror design selectors: logo cards, model chips,
version text, and a rescan action.

Controls with visual consequences need previews. If choosing a theme, model,
reference, template, or asset changes downstream output, expose a specimen or
status summary near the choice.

## Empty And Error States

Empty states are part of composition:

- use a restrained canvas or dashed border when a surface waits for content
- state what is missing
- offer the next action
- avoid product explanations

Error states should identify what failed and what to inspect. Toasts are for
boundary failures and should use concrete copy.

Do not design only the filled state. At minimum, cover empty, loading/running,
partial, failed, and populated states for the main loop.

## Verification On The Surface

For implemented UI, verify in the product surface instead of trusting component
snapshots alone:

- first viewport shows the actual work loop
- no text overflow in compact controls
- pane resizing does not hide required actions
- selector search, selected row, and clear/create actions remain reachable
- focus rings are visible
- reduced motion is honored
- empty/loading/error/populated states are reachable or represented
- visual assets, specimens, and previews are not placeholders unless explicitly
  marked as pending

## Anti-Patterns

Block these:

- purple-blue or blue-cyan "trust" gradients
- gradient-clipped text
- decorative bokeh, blobs, or glow as the main idea
- default Tailwind indigo used outside the accent token
- emoji as feature icons
- rounded left-accent dashboard cards
- invented metrics
- filler copy
- external placeholder image CDNs
- more than one dominant accent
- heavy card shadows inside the page plane
- pure black/white dark mode
- multiple `h1`s, fake buttons, positive tabindex

## The 80/20 Rule

Use 80% proven product grammar and 20% distinctive product-specific detail.

Distinctive detail should come from the product's real use:

- a better status label
- a useful specimen
- a thoughtful empty state
- a small inspect/compare affordance
- a command placed where the user needs it

Do not invent visual personality through decoration.

## Review Questions

Ask these before approving a UI:

1. Is the first viewport an operational surface?
2. Can the user scan the important state in five seconds?
3. Is the design system visible through tokens, specimens, and controls?
4. Are accents scarce and meaningful?
5. Are flat surfaces separated by border and spacing before shadow?
6. Are empty, loading, error, and populated states present?
7. Are choices with visual consequences previewable?
8. Does motion communicate state and respect reduced motion?
9. Could this screen pass a deterministic anti-slop linter?
10. Does one detail prove the designer understood the product?
