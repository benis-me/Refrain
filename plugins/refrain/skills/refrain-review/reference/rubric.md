# Review Rubric

Quality is a gate, not advice. Deterministic checks run first; model
judgment covers what rules cannot see.

## Review Axes

1. Requirements: the work solves the user's actual workflow.
2. Taste: restrained, specific, operational; no generic AI visual or copy
   patterns.
3. Agent usability: a future agent can act without interpretation. Look
   for clear triggers, defaults, forbidden moves, exact commands, evidence
   requirements, and small files with obvious ownership.
4. Engineering restraint: smaller and more inspectable than the
   alternatives. Look for direct interfaces, a dependency-light baseline,
   explicit runtime event types, and tests at risky boundaries.
5. Verification: claims backed by fresh output, never inferred from code
   edits alone.
6. Portability: usable in a new project with no source-project paths, no
   private runtime assumptions, and clear install or copy instructions.

## Deterministic Gate

Run the linter on generated or changed UI artifacts:

```sh
node scripts/anti-slop-lint.mjs <file-or-dir>
```

Finding shape: ruleId, severity (blocker, warning, note), message,
evidence, suggestion. Blockers prevent completion; warnings require
review; notes are polish prompts.

Score starts at 100: blocker minus 30, warning minus 10, note minus 3. The
score guides triage, but blockers are binary: a 90 with one blocker is not
ready.

### Blockers

| Rule id | Meaning |
| --- | --- |
| ai-default-indigo | default AI indigo or violet accent |
| trust-gradient | purple or blue-cyan trust gradient |
| gradient-text | gradient-clipped text |
| emoji-icon | emoji used as feature or button icons |
| invented-metric | fabricated marketing metrics |
| filler-copy | lorem ipsum or feature-one placeholder copy |
| marketing-filler | unlock, supercharge, seamless hype copy |
| icon-only-button-unlabeled | icon-only button without an accessible name |

### Warnings

| Rule id | Meaning |
| --- | --- |
| external-placeholder-image | fragile external placeholder image host |
| hardcoded-display-sans | generic sans hardcoded on display type |
| untracked-all-caps | ALL-CAPS text without tracking |
| heavy-card-shadow | shadow-heavy cards in the page plane |
| pure-black-surface | pure black background surface |
| positive-tabindex | positive tabindex breaks focus order |
| multiple-h1 | more than one h1 in a page |

### Notes

| Rule id | Meaning |
| --- | --- |
| em-dash-copy | em-dash (U+2014) in user-facing copy |

A file can suppress one rule with a comment containing
`refrain-allow: <rule-id>` plus a reason. Suppressions without a reason
fail review.

Judgment blockers the linter cannot see: missing empty, loading, or error
state on a data surface; text overflow in fixed controls; success claims
without fresh verification; instructions that sound good but do not tell
an agent what to do.

## Review Loop

1. Agent creates or changes an artifact.
2. The linter runs.
3. Blockers feed back as concrete repair instructions.
4. Agent repairs; the linter runs again. Bound the loop (default two
   repair rounds) and report what remains.
5. The real surface is verified when UI behavior matters.

Never present this loop as optional when the output is user-facing.

## Visual QA

Screenshot or live-surface inspection is required when layout changes,
responsive behavior changes, generated assets are referenced, text may
overflow, preview routing changes, or a claim depends on visible polish.
Inspect the actual running page or app, not a static guess.

## Verification Standard

For any project that inherits Refrain:

- Run the project's verification command and read the output before any
  completion claim. A prior run is not current evidence.
- If UI behavior changed, run or inspect the real surface.
- If an Agent CLI integration changed, run the fake-CLI tests plus at
  least one real `--version` lookup when practical.
- A completion report includes files changed by category, commands run,
  pass or fail outcomes, and known gaps. Never say "should work" when the
  command was not run.

## Repair Guidance

Repairs are concrete: replace the copy with specific verbs, remove the
gradient, add the missing empty state, split process output from summary,
add the fake-CLI test, run the real verification command. Never broad
advice such as "make it cleaner" without an actionable target.
