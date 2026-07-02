---
description: Start a new project with Refrain defaults - smallest structure, identity tokens, one verified vertical slice
argument-hint: [project brief]
---

Start a new project under Refrain. Brief: $ARGUMENTS

Apply the refrain-design and refrain-engineering skills while building, and
refrain-review before calling anything done. Add refrain-agent-runtime only
if this project executes or selects external coding agents.

1. Answer the six New Project questions in the refrain-engineering skill
   before creating any files. Start from the user's real first workflow,
   not from a prebuilt app shape.
2. Choose the smallest file shape that fits that workflow. Do not scaffold
   boundaries the product does not need yet.
3. Adopt the default identity: copy
   `${CLAUDE_PLUGIN_ROOT}/skills/refrain-design/identity/tokens.css` into
   the project and consume semantic tokens from components. Read
   `${CLAUDE_PLUGIN_ROOT}/skills/refrain-design/identity/DESIGN.md` for how
   to apply it. Replace the identity only if the user brings their own
   design system.
4. Build one vertical slice: one working user action, one visible result,
   one verification command, one honest empty or error state.
5. Verify on the real surface, run the refrain-review anti-slop linter on
   generated UI artifacts, and report exact commands, results, and gaps.

Stop after the verified slice; expand only on request.
