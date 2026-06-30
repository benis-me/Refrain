---
name: refrain-product-review
description: Use when reviewing, polishing, or quality-gating UI, generated artifacts, project blueprints, Agent Skills, or local-first product work against Refrain's taste and verification bar.
---

# Refrain Product Review

Use this skill before calling a Refrain-style product, template, or skill ready.
Review for taste, agent usability, engineering restraint, verification, and
portability.

## Start Here

Read `references/polish-rubric.md`, `references/quality-kernel.md`, and
`references/verification-standard.md` when available.

## Review Order

1. Requirements: did the work solve the user's actual workflow?
2. Taste: does it avoid generic AI visual and copy patterns?
3. Agent usability: can a future agent act on the instructions?
4. Engineering restraint: is the implementation smaller and more inspectable
   than the alternatives?
5. Verification: is there fresh evidence from the relevant command or surface?

## Blockers

Treat these as blockers:

- generic gradient/glow hero treatment
- invented metrics or claims
- placeholder/lorem copy
- emoji as primary iconography
- missing empty/error/loading state on a data surface
- inaccessible icon-only controls
- text overflow in controls
- success claim without fresh verification
- instructions that sound good but do not tell an agent what to do

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

## Verification

Before approving work, require fresh evidence:

- repository verification command and result
- template or package tests when relevant
- real UI surface inspection when visible behavior changed
- exact gaps when evidence is missing

## Repair Guidance

Repair instructions should be concrete:

- replace the copy with specific verbs
- remove one accent or gradient
- add the missing empty state
- split process output from summary
- add the fake CLI test
- run the real verification command

Do not write broad advice such as "make it cleaner" without an actionable
target.
