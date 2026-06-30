# Quality Kernel

Refrain treats quality as a gate, not advice. Model judgment can help, but the
first line of defense should be deterministic and repeatable.

## Finding Shape

Quality checks should return findings with:

- `ruleId`
- `severity`: `blocker`, `warning`, or `note`
- `message`
- `evidence`
- `suggestion`

Blockers prevent completion. Warnings require review. Notes are polish prompts.

## Default Blockers

- default AI gradient treatment
- emoji used as primary iconography
- invented metrics or unverifiable claims
- lorem ipsum or placeholder copy
- shadow-heavy card stacks
- inaccessible icon buttons
- text overflow in fixed controls
- missing empty, loading, or error state on data surfaces

## Review Loop

The minimum loop:

1. Agent creates or changes an artifact.
2. Deterministic linter runs.
3. Blockers are fed back as concrete repair instructions.
4. Agent repairs.
5. Linter runs again.
6. Real surface is verified when UI behavior matters.

Never present this loop as optional if the output is user-facing.

## Visual QA

Screenshot or browser verification is required when:

- layout changes
- responsive behavior changes
- generated assets are referenced
- text may overflow
- preview routing or iframe rendering changes
- a claim depends on visible polish

Visual QA should inspect the actual running page or app, not a static guess.

## Scoring

Start at 100:

- blocker: minus 30
- warning: minus 10
- note: minus 3

A score can guide triage, but blockers are binary. A 90 with one blocker is not
ready.

