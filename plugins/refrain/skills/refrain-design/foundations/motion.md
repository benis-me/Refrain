# Motion

Motion is feedback, not atmosphere. This file is the single source for motion
numbers; other files reference it instead of restating values.

## Canonical Values

- 150ms for ordinary state transitions: hover, focus, background, color.
- 180ms for entrance fades: opacity plus a 4px rise.
- 320ms for staggered list or grid entrances, 45ms between children.
- Easing: cubic-bezier(0.25, 1, 0.5, 1), a bounce-free ease-out.
- Spring motion only for segmented-control and tab indicators, around
  stiffness 520 and damping 42.

These values ship as `--motion-fast`, `--motion-enter`, `--motion-stagger`,
and `--ease-out` in `identity/tokens.css`.

## Tactile Press

Buttons scale to 0.97 on press; icon buttons to 0.90; text links do not
scale. Press feedback is part of the identity: instant, physical, small.

## What Does Not Animate

- border colors on focus or selection (instant)
- pane resizing (position-based, no tween)
- text content (no per-character or per-word effects)
- layout dimensions of stable controls

## Ambient Motion

At most one ambient loop per product, and only when it communicates a live
run, such as a shimmer on a running-state label. It must degrade to static
text under reduced motion.

## Reduced Motion

Every named animation needs `prefers-reduced-motion` coverage. The default
identity ships a global guard that flattens animation and transition
durations when reduced motion is requested.

## Reject

- bounce or elastic easing
- decorative looping motion
- animation that hides state latency
- entrance animation on ordinary flat-surface changes
