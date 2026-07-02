# refrain

> Category: Tool & Minimal

## 1. Visual Theme & Atmosphere

Quiet, engineered, near-monochrome. A serious local tool: graphite ink on
paper, structure from hairline borders and spacing, zero decoration in the
page plane. The interactive accent is achromatic: selection and primary
actions invert ink and paper instead of introducing a hue. Dark-first, with
dark as a designed theme rather than an inversion.

## 2. Color Palette & Roles

- Background surfaces: --background oklch(1 0 0), --surface oklch(0.985 0 0),
  --surface-2 oklch(0.968 0.001 90)
- Text: --foreground oklch(0.145 0 0), --foreground-2 oklch(0.43 0 0),
  --muted-foreground oklch(0.556 0 0)
- Interactive accent: --brand oklch(0.205 0 0) on --brand-foreground
  oklch(0.985 0 0); inverts in dark mode
- Status: --success oklch(0.55 0.14 150), --destructive
  oklch(0.577 0.245 27.3)
- Border: --border oklch(0.922 0 0), --border-strong oklch(0.87 0 0); dark
  mode borders are white at 9% and 17% opacity

Budget: neutrals 80-90% of pixels. Green means success or live data only;
red-orange means destruction only. No third hue without a product reason.

## 3. Typography Rules

Geist for display and body; Geist Mono for metadata and numerics; Space
Grotesk reserved for the wordmark. Display 3.5rem / line-height 1.02 /
-0.03em; title 2rem / 1.1 / -0.02em; body 0.875rem. Metadata uses the
`.label-mono` treatment: 0.6875rem monospace uppercase, 0.09em tracking,
weight 500. Tabular numerics for comparable values. Never justify. Uppercase
only with tracking.

## 4. Component Stylings

Buttons: 36px height, --radius-md, hairline or transparent border, press
scales to 0.97. Icon buttons: 32px square, press scales to 0.90. Inputs:
36px, 1px --input border; focus adds a 2px --ring ring and a --ring border.
Cards: --card fill, 1px --border, --radius-xl, no shadow. Segmented
controls: padded track on --surface-2, active segment is --card with a 1px
ring and a spring-animated indicator. Panel headers: 36px bar, `.label-mono`
title, bottom hairline. Motion: 150ms cubic-bezier(0.25, 1, 0.5, 1)
transitions, 180ms entrance fades, 320ms staggered entrances (45ms apart),
one ambient loop at most and only to signal a live run.

## 5. Layout Principles

4px spacing grid. Tool shell: sidebar 176-320px, content plane minimum
520px, resizable panes with 1px visual handles and generous hit targets.
Rows keep stable heights; density comes from rhythm, not cramming. Radius
scale only: 8 / 10 / 12 / 16px.

## 6. Depth & Elevation

Borders, not shadows. The page plane is flat; --shadow-pop is reserved for
true overlays (menus, popovers, dialogs) and --shadow-card is a hairline
lift at most. Scrollbars are thin, themed, and quiet.

## 7. Do's and Don'ts

Do: hairline borders, achromatic accent, tracked mono labels, tabular
numerics, designed empty and error states, dark-first theming, press-scale
feedback. Don't: gradients, glows, shadow-heavy cards, emoji icons, more
than one ambient animation, pure black surfaces, a second accent hue.

## 8. Responsive Behavior

Type scale stays fixed; layout adapts. Collapse multi-pane layouts under
640px wide, keep touch targets at 24px or larger, and never let pane
resizing hide the primary command.

## 9. Agent Prompt Guide

Quick summary: paper/ink OKLCH neutrals, achromatic brand accent that
inverts in dark mode, green success, red-orange destructive, 1px borders
over shadows, Geist plus Geist Mono, tight negative tracking on display
type, 150ms ease-out motion. Example: "A run inspector pane,
hairline-bordered, label-mono section headers, tabular timing numbers, no
shadows in the page plane."
