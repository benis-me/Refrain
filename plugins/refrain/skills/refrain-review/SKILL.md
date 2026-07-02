---
name: refrain-review
description: Use when reviewing, polishing, or quality-gating UI, generated artifacts, Agent Skills, or local-first product work against Refrain's taste, restraint, and verification bar, before calling the work ready.
---

# Refrain Review

Use this skill before calling Refrain-style work ready. Review for taste,
agent usability, engineering restraint, verification, and portability.
Deterministic checks run before judgment.

## Start Here

In this skill directory:

- `reference/rubric.md`: review axes, blocker tables, scoring, and the
  verification standard for downstream projects.
- `scripts/anti-slop-lint.mjs`: zero-dependency linter for generated UI
  artifacts. Run `node scripts/anti-slop-lint.mjs <file-or-dir>`; exit code
  1 means blockers.

## Review Order

1. Requirements: does the work solve the user's actual workflow?
2. Deterministic gate: run the linter on changed or generated artifacts.
3. Taste: generic AI visual and copy patterns are blockers even where the
   linter cannot see them (rendered output, screenshots).
4. Agent usability: can a future agent act on the instructions?
5. Engineering restraint: is the implementation smaller and more
   inspectable than the alternatives?
6. Verification: is there fresh evidence from the relevant command or
   surface?

## Blockers

The canonical machine-checkable list lives in the linter (`RULES` in
`scripts/anti-slop-lint.mjs`) and is tabulated in `reference/rubric.md`.
Judgment blockers on top of it:

- missing empty, loading, or error state on a data surface
- text overflow in fixed controls
- success claim without fresh verification
- instructions that sound good but do not tell an agent what to do
- inaccessible controls beyond what a regex can catch

## Review Output

Lead with findings:

```text
Findings
- [severity] file/path:line - concrete issue and impact

Verification
- command run, result
- surface inspected, if any

Summary
- what changed or what passes
```

If there are no findings, say so and list residual risks.

## Repair Guidance

Concrete instructions only: replace the copy with specific verbs, remove
the gradient, add the missing empty state, split process output from
summary, add the fake-CLI test, run the real verification command. No
"make it cleaner" without an actionable target.

## Verification

Before approving work, require fresh evidence: the repository verification
command and its output, linter results for generated artifacts, real UI
surface inspection when visible behavior changed, and exact gaps when
evidence is missing.
