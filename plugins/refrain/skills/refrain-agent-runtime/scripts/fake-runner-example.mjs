#!/usr/bin/env node
/**
 * Runnable reference for the Refrain agent-runtime contract.
 *
 * - AgentRunner: the one interface every CLI adapter implements.
 * - FakeRunner: deterministic runner for tests and closed-loop wiring.
 * - scanPath(): discovery over an explicit directory list with a version
 *   probe, returning typed statuses.
 *
 * Run the built-in checks:
 *
 *   node scripts/fake-runner-example.mjs
 *
 * Zero dependencies. The fake CLI is a POSIX shell script; on Windows,
 * write a .cmd shim instead.
 */

import { spawnSync } from "node:child_process";
import {
  accessSync,
  constants,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import assert from "node:assert/strict";

/**
 * @typedef {Object} AgentTurnInput
 * @property {string} message        user message for this turn
 * @property {string} [systemPrompt] composed system prompt
 * @property {string} cwd            directory the agent works in
 * @property {AbortSignal} [signal]  abort is a cancel, never an error
 * @property {(activity: {kind: "text"|"tool", text?: string, name?: string}) => void} [onActivity]
 *
 * @typedef {Object} AgentTurnResult
 * @property {string} text     narrative output
 * @property {string} summary  final summary, separate from process output
 * @property {boolean} isError
 *
 * @typedef {Object} AgentRunner
 * @property {(input: AgentTurnInput) => Promise<AgentTurnResult>} runTurn
 */

/** Deterministic runner: scripted turns, activity forwarding, abort support. */
export class FakeRunner {
  /**
   * @param {Array<Partial<AgentTurnResult> & {activities?: Array<{kind: "text"|"tool", text?: string, name?: string}>}>} turns
   */
  constructor(turns) {
    this.turns = [...turns];
    this.calls = [];
  }

  /** @param {AgentTurnInput} input @returns {Promise<AgentTurnResult>} */
  async runTurn(input) {
    if (input.signal?.aborted) {
      throw Object.assign(new Error("aborted"), { name: "AbortError" });
    }
    this.calls.push(input);
    const turn = this.turns.shift() ?? {};
    for (const activity of turn.activities ?? []) {
      input.onActivity?.(activity);
    }
    return {
      text: turn.text ?? "",
      summary: turn.summary ?? "",
      isError: turn.isError ?? false,
    };
  }
}

/** @param {unknown} error */
export function isAbortError(error) {
  return error instanceof Error && error.name === "AbortError";
}

/**
 * Discovery over an explicit directory list. Never trusts the inherited
 * PATH: callers pass the augmented directory list from the cookbook.
 *
 * @param {string[]} commands
 * @param {string[]} pathDirs
 * @param {{timeoutMs?: number}} [options]
 * @returns {Array<{id: string, command: string, path: string | null, version: string | null, status: "available" | "missing" | "errored"}>}
 */
export function scanPath(commands, pathDirs, { timeoutMs = 3000 } = {}) {
  return commands.map((command) => {
    const resolved = resolveCommand(command, pathDirs);
    if (!resolved) {
      return { id: command, command, path: null, version: null, status: "missing" };
    }
    const probe = spawnSync(resolved, ["--version"], {
      timeout: timeoutMs,
      encoding: "utf8",
      env: { ...process.env, PATH: pathDirs.join(path.delimiter) },
    });
    if (probe.error || probe.status !== 0) {
      return { id: command, command, path: resolved, version: null, status: "errored" };
    }
    const version = (probe.stdout || probe.stderr || "")
      .split("\n")[0]
      .trim()
      .slice(0, 200);
    return { id: command, command, path: resolved, version, status: "available" };
  });
}

/**
 * @param {string} command
 * @param {string[]} pathDirs
 * @returns {string | null}
 */
function resolveCommand(command, pathDirs) {
  for (const dir of pathDirs) {
    const candidate = path.join(dir, command);
    try {
      accessSync(candidate, constants.X_OK);
      return candidate;
    } catch {
      // keep looking
    }
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* Built-in checks: the boundary tests every runtime should start with. */
/* ------------------------------------------------------------------ */

async function main() {
  const binDir = mkdtempSync(path.join(tmpdir(), "refrain-runtime-"));
  try {
    const fakeCli = path.join(binDir, "mockagent");
    writeFileSync(
      fakeCli,
      '#!/bin/sh\nif [ "$1" = "--version" ]; then\n  echo "mockagent 1.2.3"\n  exit 0\nfi\necho "done"\n',
      { mode: 0o755 },
    );

    // Discovery: available with version, missing stays missing.
    const scanned = scanPath(["mockagent", "ghostagent"], [binDir]);
    assert.equal(scanned[0].status, "available");
    assert.equal(scanned[0].version, "mockagent 1.2.3");
    assert.equal(scanned[0].path, fakeCli);
    assert.equal(scanned[1].status, "missing");
    assert.equal(scanned[1].path, null);

    // FakeRunner: activities are forwarded, summary stays separate.
    const runner = new FakeRunner([
      {
        text: "built the page",
        summary: "One page, one verified action.",
        activities: [
          { kind: "tool", name: "Write", text: "index.html" },
          { kind: "text", text: "writing markup" },
        ],
      },
    ]);
    const seen = [];
    const result = await runner.runTurn({
      message: "build it",
      cwd: binDir,
      onActivity: (activity) => seen.push(activity),
    });
    assert.equal(result.isError, false);
    assert.equal(result.summary, "One page, one verified action.");
    assert.equal(seen.length, 2);
    assert.equal(seen[0].name, "Write");

    // Abort is a cancel, not an error, and is never retried.
    const aborted = new AbortController();
    aborted.abort();
    await assert.rejects(
      () => runner.runTurn({ message: "again", cwd: binDir, signal: aborted.signal }),
      (error) => isAbortError(error),
    );

    console.log("ok: discovery and fake runner behave per contract");
  } finally {
    rmSync(binDir, { recursive: true, force: true });
  }
}

if (process.argv[1] && import.meta.url === `file://${process.argv[1]}`) {
  await main();
}
