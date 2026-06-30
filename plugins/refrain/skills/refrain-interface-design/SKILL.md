---
name: refrain-interface-design
description: Use when designing, redesigning, critiquing, or polishing interface visuals, design systems, layout density, typography, color, component treatment, or visual direction for Refrain-style products.
---

# Refrain Interface Design

Use this skill when the work is primarily visual design, not just product
structure. Refrain's design bar is operational, precise, and tool-native:
quiet enough for daily use, dense enough for real work, and sharp enough to
feel authored.

## Start Here

Read only the route files needed for the task:

- foundation decisions: `foundations/tokens.md`,
  `foundations/typography.md`, `foundations/surface.md`,
  `foundations/motion.md`
- control design: `controls/selectors.md`, `controls/panes.md`,
  `controls/toolbars.md`, `controls/empty-error-states.md`
- full surfaces: `surfaces/creation-home.md`, `surfaces/workspace.md`,
  `surfaces/design-system-gallery.md`, `surfaces/settings.md`
- prompt/output shaping: `prompts/interface-generation.md`,
  `prompts/design-review.md`
- taste calibration: `cases/good-case.md`, `cases/bad-case.md`

Read `references/product-shell-guidelines.md` and
`references/polish-rubric.md` when the task involves a full product shell or
review.

## Design Position

Default to the working product surface, not a marketing composition. Navigation,
runtime state, preview, files, versions, quality, settings, and design-system
selection are design material.

Do not translate "restrained" into empty. Refrain is dense when density helps
the work. It removes decoration, not capability.

## Core Pattern

Design in this order:

1. Identify the repeated user loop.
2. Choose the smallest shell that exposes that loop.
3. Define semantic tokens before component styling.
4. Make the design system inspectable with specimens, swatches, type, spacing,
   radii, and components.
5. Use borders, spacing, type, and state before color or shadow.
6. Add one product-specific detail that proves understanding.
7. Verify on the real surface when implemented.

## Surface Archetypes

Choose the archetype that matches the product instead of starting from a generic
page layout:

- Creation surface: composer, references, mode, design-system choice, runtime
  target, recent work.
- Workspace surface: navigation, preview, files, versions, quality, history,
  runtime state, resizable inspection panes.
- Design-system surface: gallery, swatches, specimens, sectioned detail,
  light/dark examples, component previews.
- Settings surface: sidebar by concern, provider/runtime status, defaults,
  destructive actions separated from setup.
- Selector surface: compact trigger, search, built-in/custom tabs, visual row,
  hover preview, clear/create/rescan actions.

If none of these fits, define the product's repeated loop first and derive the
shell from that loop.

## Visual Defaults

- 80-90% neutral surface.
- One active accent, used sparingly.
- Hairline borders before shadows.
- Shadows only for overlays.
- Type hierarchy through weight, scale, density, and tracking.
- Monospace/tracked labels for metadata.
- Tabular numerics for comparable values.
- Motion around 150-180ms with reduced-motion coverage.
- Stable dimensions for panes, rows, toolbars, and controls.

## Design-System Requirements

When the task involves brand or visual system work, do not stop at colors. Define
or request:

- theme and atmosphere
- color roles
- typography rules
- component treatment
- layout rules
- depth/elevation rules
- do/don't list
- responsive behavior
- agent prompt guidance

If a UI lets users choose a design system, make the choice visual: mark, swatch,
specimen, preview, and detail page. A text-only selector is insufficient.

## Agent Output Contract

When producing design guidance, return concrete decisions in this shape:

1. Main product loop and chosen surface archetype.
2. Token plan: background, surface, foreground, border, accent, semantic states.
3. Typography plan: heading/body/label/numeric treatment.
4. Component plan: shell, panels, controls, selectors, empty/error/loading states.
5. One product-specific detail that should make the UI feel authored.
6. Real-surface verification plan for implementation.

Do not paste the route files back to the user. Use them to produce a compact,
project-specific design direction or implementation diff.

## Anti-Patterns

Reject:

- decorative hero as the first screen of a tool
- purple-blue AI gloss
- gradient-clipped text
- decorative bokeh, blobs, or orbits
- stock SaaS card grids
- heavy in-page card shadows
- nested cards
- more than one dominant accent
- pure black/white dark mode
- fake metrics
- emoji-led iconography
- filler copy
- oversized empty hero text inside tools
- controls without accessible labels

## Review Checklist

Before calling interface work ready, check:

1. Is the first viewport operational?
2. Can the main state be scanned in five seconds?
3. Is the design system visible through specimens or component treatment?
4. Are accents scarce and meaningful?
5. Are in-page surfaces flat and border-separated?
6. Are empty, loading, error, and populated states designed?
7. Are visual choices previewable when preview matters?
8. Does motion communicate state and respect reduced motion?
9. Does one product-specific detail add soul without decoration?

## Verification

For implemented UI, inspect the real surface in a browser or app and check
overflow, overlap, blank states, focus rings, and responsive framing. For design
guidance, list concrete layout, token, typography, state, and component decisions
the next agent should apply.
