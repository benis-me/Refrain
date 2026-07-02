#!/usr/bin/env node
/**
 * Runs `claude plugin validate --strict` when the Claude CLI is available.
 * Skips with a notice otherwise, so `npm run verify` stays green in
 * environments without Claude Code installed.
 */

import { spawnSync } from "node:child_process";

const probe = spawnSync("claude", ["--version"], { encoding: "utf8" });
if (probe.error || probe.status !== 0) {
  console.log(
    "check-plugin-manifest: claude CLI not found, skipped. Run `claude plugin validate plugins/refrain --strict` where Claude Code is installed.",
  );
  process.exit(0);
}

const result = spawnSync(
  "claude",
  ["plugin", "validate", "plugins/refrain", "--strict"],
  { stdio: "inherit" },
);
process.exit(result.status ?? 1);
