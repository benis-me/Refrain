#!/usr/bin/env node
/**
 * Deterministic anti-slop linter for generated UI artifacts.
 *
 * The RULES table below is the canonical machine-checkable list for
 * Refrain review. reference/rubric.md tabulates it, and a repository test
 * fails when the two drift.
 *
 * Usage:
 *   node anti-slop-lint.mjs <file-or-dir> [more paths] [--json]
 *
 * Exit code 1 when any blocker is found. Suppress one rule for one file
 * with a comment containing `refrain-allow: <rule-id>` plus a reason.
 * Zero dependencies.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const MARKUP_EXTS = new Set([".html", ".htm", ".jsx", ".tsx", ".vue", ".svelte"]);
const STYLE_EXTS = new Set([
  ".css", ".html", ".htm", ".jsx", ".tsx", ".vue", ".svelte", ".js", ".ts",
]);
const LINT_EXTS = new Set([...MARKUP_EXTS, ...STYLE_EXTS]);
const SKIP_DIRS = new Set(["node_modules", ".git", "dist", "build", "out", "coverage"]);

/* Rule corpus: hex lists and patterns mirror a shipped product linter. */

const AI_DEFAULT_INDIGO = [
  "#6366f1", "#4f46e5", "#4338ca", "#3730a3", "#8b5cf6", "#7c3aed", "#a855f7",
];

const PURPLE_HEXES = [
  "#a855f7", "#9333ea", "#7c3aed", "#6d28d9", "#581c87",
  "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe", "#ede9fe",
  "#6366f1", "#4f46e5", "#4338ca", "#3730a3", "#312e81",
  "#818cf8", "#a5b4fc", "#c7d2fe", "#e0e7ff", "#eef2ff",
];

const TRUST_GRADIENT_BLUE_HEXES = [
  "#3b82f6", "#2563eb", "#1d4ed8", "#60a5fa", "#93c5fd",
  "#0ea5e9", "#0284c7", "#38bdf8", "#7dd3fc",
];

const TRUST_GRADIENT_CYAN_HEXES = [
  "#06b6d4", "#0891b2", "#22d3ee", "#67e8f9", "#a5f3fc",
];

const SLOP_EMOJI = [
  "✨", "🚀", "🎯", "⚡", "🔥", "💡", "📈", "🎨", "🛡️",
  "🌟", "💪", "🎉", "👋", "🙌", "✅", "⭐", "🏆",
];

const INVENTED_METRIC_PATTERNS = [
  /\b10[x×]\s+(?:faster|better|easier)\b/gi,
  /\b100[x×]\s+(?:faster|better)\b/gi,
  /\b99\.\d+%\s+uptime\b/gi,
  /\bzero[- ]downtime\b/gi,
  /\b3[x×]\s+more\s+(?:productive|efficient)\b/gi,
];

const FILLER_PATTERNS = [
  /\bfeature\s+(?:one|two|three|1|2|3)\b/gi,
  /\blorem\s+ipsum\b/gi,
  /\bdolor\s+sit\s+amet\b/gi,
  /\bplaceholder\s+text\b/gi,
  /\bsample\s+content\b/gi,
];

const MARKETING_FILLER_PATTERN =
  /\b(?:unlock|supercharge[sd]?|seamless(?:ly)?|reimagine[sd]?|revolutioniz\w*|game[- ]chang\w*|transform\s+your\s+workflow)\b/gi;

const EXTERNAL_IMAGE_HOSTS = [
  "images.unsplash.com", "placehold.co", "placekitten.com",
  "via.placeholder.com", "picsum.photos", "loremflickr.com",
];

const DISPLAY_SANS_RE =
  /(?:h1|h2|h3|\.h-?(?:hero|xl|lg|md))[^{}]*\{[^}]*font-family\s*:\s*["']?(?:Inter|Roboto|Arial|-apple-system|system-ui|SF\s+Pro)\b/gi;

const ALL_CAPS_TRACKING_FLOOR_EM = 0.06;
const ROOT_FONT_PX = 16;

/* Finders return match indices into the text. */

function findAll(text, regex) {
  const out = [];
  regex.lastIndex = 0;
  let match;
  while ((match = regex.exec(text))) {
    out.push(match.index);
    if (match.index === regex.lastIndex) regex.lastIndex += 1;
  }
  return out;
}

function findAnyPattern(text, patterns) {
  return patterns.flatMap((pattern) => findAll(text, pattern));
}

function findSubstrings(text, needles) {
  const out = [];
  const lower = text.toLowerCase();
  for (const needle of needles) {
    const target = needle.toLowerCase();
    let index = lower.indexOf(target);
    while (index !== -1) {
      out.push(index);
      index = lower.indexOf(target, index + target.length);
    }
  }
  return out;
}

function findTrustGradients(text) {
  const out = [];
  const gradientRe = /(?:linear|radial|conic)-gradient\([^;{}]*\)/gi;
  let match;
  while ((match = gradientRe.exec(text))) {
    const gradient = match[0].toLowerCase();
    const purple = PURPLE_HEXES.some((hex) => gradient.includes(hex));
    const blue = TRUST_GRADIENT_BLUE_HEXES.some((hex) => gradient.includes(hex));
    const cyan = TRUST_GRADIENT_CYAN_HEXES.some((hex) => gradient.includes(hex));
    if (purple || (blue && cyan)) out.push(match.index);
  }
  const tailwindRe =
    /\bfrom-(?:blue|sky|indigo|violet|purple)-\d{2,3}\b[^"'`\n]{0,80}\bto-(?:purple|violet|fuchsia|indigo|cyan|sky|blue)-\d{2,3}\b/g;
  while ((match = tailwindRe.exec(text))) out.push(match.index);
  return out;
}

function findUntrackedAllCaps(text) {
  const out = [];
  const blockRe = /\{[^{}]*\}/g;
  let match;
  while ((match = blockRe.exec(text))) {
    const block = match[0];
    if (!/text-transform\s*:\s*uppercase/i.test(block)) continue;
    const spacing = block.match(/letter-spacing\s*:\s*(-?\d*\.?\d+)(em|rem|px)/i);
    if (!spacing) {
      out.push(match.index);
      continue;
    }
    const value = Number.parseFloat(spacing[1]);
    const unit = spacing[2].toLowerCase();
    const em = unit === "px" ? value / ROOT_FONT_PX : value;
    if (em < ALL_CAPS_TRACKING_FLOOR_EM) out.push(match.index);
  }
  return out;
}

function findHeavyShadows(text) {
  const out = [];
  const declRe = /box-shadow\s*:\s*[^;}]+/gi;
  let match;
  while ((match = declRe.exec(text))) {
    const blur = match[0].match(
      /-?\d+(?:\.\d+)?(?:px)?\s+-?\d+(?:\.\d+)?(?:px)?\s+(\d+(?:\.\d+)?)px/,
    );
    if (blur && Number.parseFloat(blur[1]) >= 16) out.push(match.index);
  }
  const tailwindRe = /\bshadow-(?:lg|xl|2xl)\b/g;
  while ((match = tailwindRe.exec(text))) out.push(match.index);
  return out.length >= 3 ? [out[0]] : [];
}

function findMultipleH1(text) {
  const indices = findAll(text, /<h1[\s>]/gi);
  return indices.length > 1 ? indices.slice(1) : [];
}

/**
 * Canonical machine-checkable rules. appliesTo: "markup" runs on markup
 * files only; "style" runs on anything that can carry CSS.
 */
export const RULES = [
  {
    id: "ai-default-indigo",
    severity: "blocker",
    appliesTo: "style",
    message: "default AI indigo or violet accent",
    suggestion:
      "Use the project's semantic accent token; the default Refrain accent is achromatic.",
    find: (text) => [
      ...findSubstrings(text, AI_DEFAULT_INDIGO),
      ...findAll(text, /\b(?:bg|text|from|to|via|border|ring)-(?:indigo|violet)-[3-9]00\b/g),
    ],
  },
  {
    id: "trust-gradient",
    severity: "blocker",
    appliesTo: "style",
    message: "purple or blue-cyan trust gradient",
    suggestion: "Remove the gradient; separate surfaces with borders and spacing.",
    find: findTrustGradients,
  },
  {
    id: "gradient-text",
    severity: "blocker",
    appliesTo: "style",
    message: "gradient-clipped text",
    suggestion:
      "Carry hierarchy with weight, scale, and tracking. If this is the one live running-state shimmer, add `refrain-allow: gradient-text` with the reason.",
    find: (text) =>
      findAll(text, /(?:-webkit-)?background-clip\s*:\s*text|\bbg-clip-text\b/gi),
  },
  {
    id: "emoji-icon",
    severity: "blocker",
    appliesTo: "markup",
    message: "emoji used as an icon or decoration",
    suggestion: "Use a monoline icon set with accessible labels, or plain text.",
    find: (text) => findSubstrings(text, SLOP_EMOJI),
  },
  {
    id: "invented-metric",
    severity: "blocker",
    appliesTo: "markup",
    message: "fabricated marketing metric",
    suggestion: "State what the product does; remove numbers without a source.",
    find: (text) => findAnyPattern(text, INVENTED_METRIC_PATTERNS),
  },
  {
    id: "filler-copy",
    severity: "blocker",
    appliesTo: "markup",
    message: "placeholder or filler copy",
    suggestion: "Write the real copy: concrete nouns and verbs from the product.",
    find: (text) => findAnyPattern(text, FILLER_PATTERNS),
  },
  {
    id: "marketing-filler",
    severity: "blocker",
    appliesTo: "markup",
    message: "hype copy (unlock, supercharge, seamless, ...)",
    suggestion: "Replace with a concrete command or statement of what happens.",
    find: (text) => findAll(text, MARKETING_FILLER_PATTERN),
  },
  {
    id: "icon-only-button-unlabeled",
    severity: "blocker",
    appliesTo: "markup",
    message: "icon-only button without an accessible name",
    suggestion: "Add aria-label (and a tooltip when meaning is not obvious).",
    find: (text) =>
      findAll(
        text,
        /<button\b(?![^>]*(?:aria-label|aria-labelledby|title)\s*=)[^>]*>\s*(?:<svg[\s\S]*?<\/svg>|<i\b[^>]*>\s*<\/i>)\s*<\/button>/gi,
      ),
  },
  {
    id: "external-placeholder-image",
    severity: "warning",
    appliesTo: "markup",
    message: "fragile external placeholder image host",
    suggestion: "Inline an asset, generate one, or design the empty state honestly.",
    find: (text) => findSubstrings(text, EXTERNAL_IMAGE_HOSTS),
  },
  {
    id: "hardcoded-display-sans",
    severity: "warning",
    appliesTo: "style",
    message: "generic sans hardcoded on display type",
    suggestion: "Use the design system's font tokens for display elements.",
    find: (text) => findAll(text, DISPLAY_SANS_RE),
  },
  {
    id: "untracked-all-caps",
    severity: "warning",
    appliesTo: "style",
    message: "ALL-CAPS text without sufficient tracking",
    suggestion: "Add letter-spacing of at least 0.06em to uppercase text.",
    find: findUntrackedAllCaps,
  },
  {
    id: "heavy-card-shadow",
    severity: "warning",
    appliesTo: "style",
    message: "shadow-heavy cards in the page plane",
    suggestion: "Separate in-page surfaces with 1px borders; keep shadow for overlays.",
    find: findHeavyShadows,
  },
  {
    id: "pure-black-surface",
    severity: "warning",
    appliesTo: "style",
    message: "pure black background surface",
    suggestion: "Use a near-black surface token; pure black reads harsh next to content.",
    find: (text) => [
      ...findAll(text, /background(?:-color)?\s*:\s*(?:#000000\b|#000\b|black\b)/gi),
      ...findAll(text, /\bbg-black\b/g),
    ],
  },
  {
    id: "positive-tabindex",
    severity: "warning",
    appliesTo: "markup",
    message: "positive tabindex breaks natural focus order",
    suggestion: "Use tabindex 0 or -1 and fix the DOM order instead.",
    find: (text) => findAll(text, /tabindex\s*=\s*["']?[1-9]/gi),
  },
  {
    id: "multiple-h1",
    severity: "warning",
    appliesTo: "markup",
    exts: [".html", ".htm"],
    message: "more than one h1 in the page",
    suggestion: "Keep one h1; demote the rest to h2 or lower.",
    find: findMultipleH1,
  },
  {
    id: "em-dash-copy",
    severity: "note",
    appliesTo: "markup",
    message: "em-dash (U+2014) in user-facing copy",
    suggestion: "Use a comma, colon, or parentheses instead.",
    find: (text) => findAll(text, /—/g),
  },
];

function lineOf(text, index) {
  let line = 1;
  for (let i = 0; i < index && i < text.length; i += 1) {
    if (text[i] === "\n") line += 1;
  }
  return line;
}

function excerpt(text, index) {
  const start = Math.max(0, index - 20);
  return text
    .slice(start, index + 60)
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

/** Lint one file's text. Returns findings sorted by position. */
export function lintText(text, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!LINT_EXTS.has(ext)) return [];

  const allowed = new Set();
  const allowRe = /refrain-allow:\s*([a-z0-9-]+)/gi;
  let match;
  while ((match = allowRe.exec(text))) allowed.add(match[1].toLowerCase());

  const findings = [];
  for (const rule of RULES) {
    if (rule.appliesTo === "markup" && !MARKUP_EXTS.has(ext)) continue;
    if (rule.appliesTo === "style" && !STYLE_EXTS.has(ext)) continue;
    if (rule.exts && !rule.exts.includes(ext)) continue;
    if (allowed.has(rule.id)) continue;
    for (const index of rule.find(text)) {
      findings.push({
        ruleId: rule.id,
        severity: rule.severity,
        message: rule.message,
        suggestion: rule.suggestion,
        file: filePath,
        line: lineOf(text, index),
        evidence: excerpt(text, index),
      });
    }
  }
  return findings.sort((a, b) => a.line - b.line);
}

/** Score: 100, minus 30 per blocker, 10 per warning, 3 per note. Floor 0. */
export function lintScore(findings) {
  let score = 100;
  for (const finding of findings) {
    if (finding.severity === "blocker") score -= 30;
    else if (finding.severity === "warning") score -= 10;
    else score -= 3;
  }
  return Math.max(0, score);
}

function collectFiles(target, out) {
  const info = statSync(target);
  if (info.isFile()) {
    if (LINT_EXTS.has(path.extname(target).toLowerCase())) out.push(target);
    return;
  }
  if (!info.isDirectory()) return;
  for (const entry of readdirSync(target, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      collectFiles(path.join(target, entry.name), out);
    } else if (LINT_EXTS.has(path.extname(entry.name).toLowerCase())) {
      out.push(path.join(target, entry.name));
    }
  }
}

function main(argv) {
  const asJson = argv.includes("--json");
  const targets = argv.filter((arg) => arg !== "--json");
  if (targets.length === 0) {
    console.error("usage: node anti-slop-lint.mjs <file-or-dir> [more paths] [--json]");
    process.exitCode = 2;
    return;
  }

  const files = [];
  for (const target of targets) collectFiles(target, files);

  const findings = files.flatMap((file) =>
    lintText(readFileSync(file, "utf8"), file),
  );
  const score = lintScore(findings);
  const counts = { blocker: 0, warning: 0, note: 0 };
  for (const finding of findings) counts[finding.severity] += 1;

  if (asJson) {
    console.log(JSON.stringify({ findings, counts, score }, null, 2));
  } else {
    for (const finding of findings) {
      console.log(
        `[${finding.severity}] ${finding.file}:${finding.line} ${finding.ruleId}: ${finding.message}`,
      );
      console.log(`  evidence: ${finding.evidence}`);
      console.log(`  fix: ${finding.suggestion}`);
    }
    const summary = `${counts.blocker} blockers, ${counts.warning} warnings, ${counts.note} notes. Score ${score}/100.`;
    console.log(findings.length === 0 ? `clean: no findings. Score 100/100.` : summary);
  }

  if (counts.blocker > 0) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === `file://${process.argv[1]}`) {
  main(process.argv.slice(2));
}
