import assert from "node:assert/strict";
import { test } from "node:test";

import { validateWorkspace } from "../scripts/validate-refrain.mjs";

test("workspace distillation is a lean installable plugin marketplace", async () => {
  const result = await validateWorkspace(new URL("../", import.meta.url));

  assert.equal(result.ok, true, result.errors.join("\n"));
  assert.equal(result.summary.skills, 5);
  assert.equal(result.summary.plugin, true);
  assert.equal(result.summary.blueprints, 1);
  assert.equal(result.summary.references >= 7, true);
});

test("skill descriptions are trigger-oriented and do not summarize workflow shortcuts", async () => {
  const result = await validateWorkspace(new URL("../", import.meta.url));

  assert.deepEqual(result.errors.filter((error) => error.includes("description")), []);
});

test("root does not keep duplicated canonical skills or starter templates", async () => {
  const result = await validateWorkspace(new URL("../", import.meta.url));

  assert.deepEqual(result.errors.filter((error) => error.includes("duplicated root")), []);
});

test("README describes Refrain without referencing source projects", async () => {
  const result = await validateWorkspace(new URL("../", import.meta.url));

  assert.deepEqual(result.errors.filter((error) => error.includes("README")), []);
});

test("marketplace metadata is plugin-first and points at the GitHub package", async () => {
  const result = await validateWorkspace(new URL("../", import.meta.url));

  assert.deepEqual(
    result.errors.filter((error) => error.includes("manifest repository")),
    []
  );
  assert.deepEqual(
    result.errors.filter((error) => error.includes("brandColor")),
    []
  );
});

test("interface design skill preserves the distilled product-UI grammar", async () => {
  const result = await validateWorkspace(new URL("../", import.meta.url));

  assert.deepEqual(
    result.errors.filter((error) => error.includes("interface-design marker")),
    []
  );
  assert.deepEqual(
    result.errors.filter((error) => error.includes("interface design route file")),
    []
  );
});
