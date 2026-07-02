# Empty And Error States

Design the whole state set, not only the filled view.

## Required States

- empty
- loading or running
- partial
- failed
- stale or disconnected when runtime data can drift
- populated

## Empty State

- show what is missing
- offer one next action
- keep copy concrete
- use restrained canvas treatment

## Error State

- name what failed
- show what the user or agent can inspect
- keep retry near the failed surface
- use toast only for boundary failures

## Reject

- explaining the whole product in an empty state
- fake sample metrics
- generic "Something went wrong"
- success-looking color for incomplete state
