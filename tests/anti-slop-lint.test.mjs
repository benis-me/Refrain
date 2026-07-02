import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

import {
  RULES,
  lintText,
  lintScore
} from "../plugins/refrain/skills/refrain-review/scripts/anti-slop-lint.mjs";

const badHtml = await readFile(
  new URL("./fixtures/bad.html", import.meta.url),
  "utf8"
);
const cleanHtml = await readFile(
  new URL("./fixtures/clean.html", import.meta.url),
  "utf8"
);

test("rule ids are unique and carry severities", () => {
  const ids = RULES.map((rule) => rule.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const rule of RULES) {
    assert.equal(["blocker", "warning", "note"].includes(rule.severity), true);
    assert.equal(typeof rule.suggestion, "string");
  }
});

test("the bad fixture triggers every rule in the corpus", () => {
  const findings = lintText(badHtml, "tests/fixtures/bad.html");
  const hit = new Set(findings.map((finding) => finding.ruleId));
  for (const rule of RULES) {
    assert.equal(hit.has(rule.id), true, `expected ${rule.id} to fire`);
  }
  assert.equal(findings.some((finding) => finding.severity === "blocker"), true);
  assert.equal(lintScore(findings) < 50, true);
  for (const finding of findings) {
    assert.equal(finding.line > 0, true);
    assert.equal(finding.evidence.length > 0, true);
  }
});

test("the clean fixture passes with a full score", () => {
  const findings = lintText(cleanHtml, "tests/fixtures/clean.html");
  assert.deepEqual(findings, []);
  assert.equal(lintScore(findings), 100);
});

test("refrain-allow suppresses a rule for one file", () => {
  const suppressed = `${badHtml}\n<!-- refrain-allow: emoji-icon (bad-design fixture) -->`;
  const findings = lintText(suppressed, "tests/fixtures/bad.html");
  assert.equal(
    findings.some((finding) => finding.ruleId === "emoji-icon"),
    false
  );
  assert.equal(
    findings.some((finding) => finding.ruleId === "invented-metric"),
    true
  );
});

test("non-lintable files are ignored", () => {
  assert.deepEqual(lintText("# ✨ unlock 10x faster", "notes.md"), []);
});
