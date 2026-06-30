# Verification Standard

Refrain work is complete only when the relevant surface has fresh evidence.

## Root Verification

From `/Users/ben/Projects/Refrain`:

```sh
npm run verify
```

This runs the structural validator and all Node tests.

## Plugin Package Verification

From `/Users/ben/Projects/Refrain`:

```sh
npm run verify
```

When Claude Code is available, also run:

```sh
claude plugin validate plugins/refrain --strict
```

## Evidence Rules

- Read the command output before making a completion claim.
- Do not treat a prior run as current evidence.
- If UI behavior changed in a downstream project, run or inspect the real
  surface there.
- If an Agent CLI integration changed, verify with a fake CLI test and at least
  one real command lookup when practical.
- If prose changed, run the structure validator.

## Completion Report

A final report should include:

- files changed by category
- verification commands run
- pass/fail outcome
- known gaps, if any

Do not say "should work" when the command was not run.
