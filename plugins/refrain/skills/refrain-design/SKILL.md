---
name: refrain-design
description: Use when designing, implementing, critiquing, or polishing user-facing interfaces - product shells, app UI, dashboards, generated screens, design systems, tokens, typography, color, motion, or visual direction - for products that should follow Refrain's restrained style, or when the user asks for Refrain style.
---

# Refrain Design

One skill for product structure and visual design. The bar is a serious local
tool: quiet enough for daily use, dense enough for real work, sharp enough to
feel authored.

## Start Here

Read only what the task needs. All paths are relative to this skill directory.

- default identity (colors, type, radii, motion values): `identity/DESIGN.md`,
  `identity/tokens.css`
- foundation rules: `foundations/tokens.md`, `foundations/typography.md`,
  `foundations/surface.md`, `foundations/motion.md`
- control design: `controls/selectors.md`, `controls/panes.md`,
  `controls/toolbars.md`, `controls/empty-error-states.md`
- full surfaces: `surfaces/creation-home.md`, `surfaces/workspace.md`,
  `surfaces/design-system-gallery.md`, `surfaces/settings.md`
- prompt/output shaping: `prompts/interface-generation.md`,
  `prompts/design-review.md`
- taste calibration: `cases/good-case.md`, `cases/bad-case.md`

## Position

Build tools, not theater. The first screen helps the user work; marketing
composition is allowed only when the product is explicitly a marketing site.
Restrained does not mean empty: remove decoration, not capability. Use 80%
proven product grammar and 20% product-specific detail earned from the
product's real use.

## Default Product Shape

- Build the working surface first, not a landing page.
- Prefer a tool shell: sidebar, primary work plane, inspector or detail pane
  when the user compares or inspects.
- Make files, runs, previews, versions, logs, and quality state visible when
  the product has them.
- Keep run state close to the command that started it.
- Dense but calm spacing: empty space should clarify structure, not hide
  missing functionality.

## Core Pattern

Design in this order:

1. Identify the repeated user loop.
2. Choose the smallest shell that exposes that loop.
3. Apply `identity/tokens.css` as the default system, or the project's design
   system when one exists. Define semantic tokens before component styling.
4. Make the design system inspectable: swatches, specimens, component previews.
5. Use borders, spacing, type, and state before color or shadow.
6. Add one product-specific detail that proves understanding.
7. Verify on the real surface when implemented.

## Surface Archetypes

Start from the archetype that matches the product, then adapt:

- Creation surface: real composer first, references, mode, design-system
  choice, runtime target, recent work. See `surfaces/creation-home.md`.
- Workspace: slim global navigation, full-bleed work plane, resizable panes
  for preview, files, quality, versions. See `surfaces/workspace.md`.
- Design-system gallery and detail: visual cards, swatches, specimens,
  sectioned detail. See `surfaces/design-system-gallery.md`.
- Settings: sidebar by concern, provider/runtime status, destructive actions
  isolated. See `surfaces/settings.md`.
- Selector: compact trigger, search, visual rows, rescan and create actions
  near search. See `controls/selectors.md`.

If none fits, derive the shell from the product's repeated loop.

## Visual Defaults

- Near-monochrome surface; the default identity uses an achromatic
  interactive accent (ink on paper, inverted in dark mode).
- At most one hue per state meaning: green for success, red-orange for
  destructive. State color describes product semantics, not decoration.
- Hairline borders before shadows; shadows only for true overlays.
- Type carries hierarchy through weight, scale, and negative tracking.
- Monospace tracked-uppercase labels for metadata; tabular numerics for
  comparable values.
- Motion is feedback, not atmosphere: `foundations/motion.md` holds the
  canonical durations and easing.
- Stable dimensions for panes, rows, toolbars, and controls.

## Component Defaults

- Icon buttons need accessible labels; add tooltips when meaning is not
  obvious.
- Segmented controls for modes; tabs for peer views; select menus for option
  sets; sliders and steppers for quantities.
- Cards are repeated records, dialogs, or framed tools. No cards inside cards.
- Every data surface designs loading, empty, error, populated, and stale or
  disconnected states.

## Copy

Use concrete nouns and verbs: Build, Scan agents, Preview, Open log, Restore
version, Compare. Sentence case. No em-dashes (U+2014) in user-facing copy;
use commas, colons, or parentheses. Labels stay short enough for compact
controls.

## Anti-Patterns

Block these on sight. Ids in parentheses match the deterministic linter in
the refrain-review skill.

- default AI indigo or violet accents (ai-default-indigo)
- purple or blue-cyan trust gradients (trust-gradient)
- gradient-clipped text (gradient-text)
- emoji as feature or button icons (emoji-icon)
- invented metrics or unverifiable claims (invented-metric)
- lorem ipsum or "feature one" placeholder copy (filler-copy)
- unlock/supercharge/seamless marketing filler (marketing-filler)
- icon-only controls without accessible names (icon-only-button-unlabeled)
- external placeholder image CDNs (external-placeholder-image)
- hardcoded generic display fonts (hardcoded-display-sans)
- ALL-CAPS text without tracking (untracked-all-caps)
- shadow-heavy card stacks in the page plane (heavy-card-shadow)
- pure black surfaces in dark mode (pure-black-surface)
- positive tabindex (positive-tabindex)
- more than one h1 in an app shell (multiple-h1)
- decorative hero as the first screen of a tool, nested cards, fake metrics
  dashboards, more than one dominant accent

## When To Challenge The User

Challenge requests that push toward generic SaaS decoration, marketing framing
inside a tool, invented metrics, or copy that describes features instead of
making them usable. Offer a restrained alternative that preserves the goal.

## Agent Output Contract

When producing design guidance, return concrete decisions in this order:

1. Main product loop and chosen surface archetype.
2. Token plan: background, surface, foreground, border, accent, semantic
   states.
3. Typography plan: heading, body, label, numeric treatment.
4. Component plan: shell, panels, controls, selectors, empty/error/loading
   states.
5. One product-specific detail that makes the UI feel authored.
6. Real-surface verification plan.

Do not paste the route files back. Produce a compact, project-specific
direction or an implementation diff.

## Review Checklist

1. Is the first viewport operational?
2. Can the main state be scanned in five seconds?
3. Is the design system visible through specimens or component treatment?
4. Are accents scarce and meaningful?
5. Are in-page surfaces flat and border-separated?
6. Are empty, loading, error, populated, and stale states designed?
7. Are visual choices previewable when preview matters?
8. Does motion communicate state and respect reduced motion?
9. Does one product-specific detail add soul without decoration?

## Verification

For implemented UI, inspect the real surface: overflow in compact controls,
overlap, blank panes, focus rings, reduced motion, responsive framing, and
reachable empty/loading/error/populated states. Run the deterministic linter
from the refrain-review skill on generated HTML/CSS artifacts. For design
guidance, list the concrete token, layout, state, and component decisions the
next agent should apply.
