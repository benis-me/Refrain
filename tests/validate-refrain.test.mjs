import assert from "node:assert/strict";
import { test } from "node:test";

import { validateWorkspace } from "../scripts/validate-refrain.mjs";

const result = await validateWorkspace(new URL("../", import.meta.url));

test("workspace is a lean installable plugin marketplace", () => {
  assert.equal(result.ok, true, result.errors.join("\n"));
  assert.equal(result.summary.skills, 4);
  assert.equal(result.summary.commands, 1);
  assert.equal(result.summary.plugin, true);
  assert.equal(result.summary.rules > 10, true);
});

test("skill descriptions are trigger-oriented and do not summarize workflow shortcuts", () => {
  assert.deepEqual(
    result.errors.filter((error) => error.includes("description")),
    []
  );
});

test("every path a skill references resolves inside that skill directory", () => {
  assert.deepEqual(
    result.errors.filter(
      (error) =>
        error.includes("unreachable") ||
        error.includes("escapes the skill directory") ||
        error.includes("references/")
    ),
    []
  );
});

test("canonical rule corpus does not drift between linter, rubric, and design skill", () => {
  assert.deepEqual(
    result.errors.filter((error) => error.includes("drift")),
    []
  );
});

test("plugin content stays portable and single-source", () => {
  assert.deepEqual(
    result.errors.filter(
      (error) =>
        error.includes("portability") ||
        error.includes("em-dash") ||
        error.includes("motion numbers")
    ),
    []
  );
});

test("marketplace metadata is plugin-first and versions stay in sync", () => {
  assert.deepEqual(
    result.errors.filter(
      (error) =>
        error.includes("manifest") ||
        error.includes("marketplace") ||
        error.includes("version")
    ),
    []
  );
});
