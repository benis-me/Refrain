# Motion

Motion is feedback, not atmosphere.

## Defaults

- 150-180ms for ordinary transitions.
- Ease-out for visibility and state changes.
- Small spring movement only for tabs or segmented indicators.
- Every named animation needs `prefers-reduced-motion` coverage.

## Good Uses

- selected tab or mode indicator
- menu and popover entry
- loading/running treatment tied to actual state
- pane resize feedback

## Reject

- bounce
- elastic motion
- decorative looping motion
- animation that hides state latency
