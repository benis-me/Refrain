import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const PLUGIN_ROOT = "plugins/refrain";
const SKILLS_ROOT = `${PLUGIN_ROOT}/skills`;

const REQUIRED_ROOT_FILES = [
  ".gitignore",
  "README.md",
  "AGENTS.md",
  "LICENSE",
  "package.json",
  ".claude-plugin/marketplace.json",
  ".agents/plugins/marketplace.json",
  `${PLUGIN_ROOT}/.claude-plugin/plugin.json`,
  `${PLUGIN_ROOT}/.codex-plugin/plugin.json`,
  `${PLUGIN_ROOT}/README.md`,
  `${PLUGIN_ROOT}/commands/new-project.md`,
  "scripts/validate-refrain.mjs",
  "scripts/check-plugin-manifest.mjs",
  "tests/validate-refrain.test.mjs",
  "tests/anti-slop-lint.test.mjs",
  "tests/fixtures/bad.html",
  "tests/fixtures/clean.html"
];

const FORBIDDEN_DIRS = [
  "docs",
  "skills",
  "templates",
  `${PLUGIN_ROOT}/references`,
  `${PLUGIN_ROOT}/blueprints`,
  `${PLUGIN_ROOT}/templates`
];

const REQUIRED_SKILLS = [
  "refrain-design",
  "refrain-engineering",
  "refrain-agent-runtime",
  "refrain-review"
];

const REQUIRED_SKILL_FILES = {
  "refrain-design": [
    "identity/DESIGN.md",
    "identity/tokens.css",
    "identity/manifest.json",
    "foundations/tokens.md",
    "foundations/typography.md",
    "foundations/surface.md",
    "foundations/motion.md",
    "controls/selectors.md",
    "controls/panes.md",
    "controls/toolbars.md",
    "controls/empty-error-states.md",
    "surfaces/creation-home.md",
    "surfaces/workspace.md",
    "surfaces/design-system-gallery.md",
    "surfaces/settings.md",
    "prompts/interface-generation.md",
    "prompts/design-review.md",
    "cases/good-case.md",
    "cases/bad-case.md"
  ],
  "refrain-engineering": ["reference/principles.md"],
  "refrain-agent-runtime": [
    "reference/contract.md",
    "reference/cli-cookbook.md",
    "scripts/fake-runner-example.mjs"
  ],
  "refrain-review": ["reference/rubric.md", "scripts/anti-slop-lint.mjs"]
};

const REQUIRED_SKILL_MARKERS = {
  "refrain-design": [
    "identity/tokens.css",
    "foundations/motion.md",
    "surfaces/workspace.md",
    "## Agent Output Contract",
    "## Anti-Patterns",
    "real surface"
  ],
  "refrain-engineering": [
    "reference/principles.md",
    "127.0.0.1",
    "vertical slice"
  ],
  "refrain-agent-runtime": [
    "reference/contract.md",
    "reference/cli-cookbook.md",
    "augmented PATH",
    "stdin"
  ],
  "refrain-review": [
    "reference/rubric.md",
    "scripts/anti-slop-lint.mjs",
    "Findings"
  ]
};

/* Files (relative to the plugin root) allowed to state motion durations. */
const MOTION_NUMBER_ALLOWLIST = new Set([
  "skills/refrain-design/foundations/motion.md",
  "skills/refrain-design/identity/tokens.css",
  "skills/refrain-design/identity/DESIGN.md"
]);

const SOURCE_PROJECT_NAME_PATTERN = new RegExp("\\bD" + "ezin\\b", "i");
const EM_DASH = "—";

function resolveRoot(rootUrl) {
  return rootUrl instanceof URL ? fileURLToPath(rootUrl) : String(rootUrl);
}

async function pathDetails(filePath) {
  try {
    return await stat(filePath);
  } catch {
    return null;
  }
}

async function isFile(filePath) {
  return (await pathDetails(filePath))?.isFile() ?? false;
}

async function isDirectory(filePath) {
  return (await pathDetails(filePath))?.isDirectory() ?? false;
}

async function readJson(filePath, errors) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch (error) {
    errors.push(`${filePath} is not valid JSON: ${error.message}`);
    return null;
  }
}

function parseFrontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    return null;
  }

  const fields = {};
  for (const line of match[1].split("\n")) {
    const field = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (field) {
      fields[field[1]] = field[2].replace(/^["']|["']$/g, "");
    }
  }
  return fields;
}

async function listFiles(dir) {
  const entries = await readdir(dir, { recursive: true, withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(entry.parentPath ?? entry.path, entry.name));
}

async function validatePackage(root, errors) {
  const packageJson = await readJson(path.join(root, "package.json"), errors);
  if (!packageJson) {
    return;
  }

  if (packageJson.scripts?.test !== "node --test tests/*.test.mjs") {
    errors.push("package.json test script must only run root validation tests");
  }

  const expectedVerify =
    "node scripts/validate-refrain.mjs && npm test && node scripts/check-plugin-manifest.mjs";
  if (packageJson.scripts?.verify !== expectedVerify) {
    errors.push(
      "package.json verify script must run validator, tests, then the plugin manifest check"
    );
  }
}

async function validateReadme(root, errors) {
  const source = await readFile(path.join(root, "README.md"), "utf8");
  if (SOURCE_PROJECT_NAME_PATTERN.test(source)) {
    errors.push("README must describe Refrain without referencing source projects");
  }
  if (!source.includes("/plugin marketplace add benis-me/Refrain")) {
    errors.push("README must lead with GitHub plugin marketplace installation");
  }
  if (source.includes("Use Without Installing")) {
    errors.push("README must not frame local path usage as the primary workflow");
  }
}

async function validateMarketplaces(root, errors) {
  const claudeMarketplace = await readJson(
    path.join(root, ".claude-plugin/marketplace.json"),
    errors
  );
  const codexMarketplace = await readJson(
    path.join(root, ".agents/plugins/marketplace.json"),
    errors
  );
  const claudeManifest = await readJson(
    path.join(root, `${PLUGIN_ROOT}/.claude-plugin/plugin.json`),
    errors
  );
  const codexManifest = await readJson(
    path.join(root, `${PLUGIN_ROOT}/.codex-plugin/plugin.json`),
    errors
  );

  if (claudeMarketplace?.name !== "refrain-marketplace") {
    errors.push("Claude marketplace name must be refrain-marketplace");
  }
  if (claudeMarketplace?.plugins?.[0]?.name !== "refrain") {
    errors.push("Claude marketplace must include the refrain plugin");
  }
  if (claudeMarketplace?.plugins?.[0]?.source !== "./plugins/refrain") {
    errors.push("Claude marketplace source must be ./plugins/refrain");
  }

  if (codexMarketplace?.name !== "refrain-marketplace") {
    errors.push("Codex marketplace name must be refrain-marketplace");
  }
  if (codexMarketplace?.plugins?.[0]?.name !== "refrain") {
    errors.push("Codex marketplace must include the refrain plugin");
  }
  if (codexMarketplace?.plugins?.[0]?.source?.path !== "./plugins/refrain") {
    errors.push("Codex marketplace path must be ./plugins/refrain");
  }

  if (claudeManifest?.name !== "refrain") {
    errors.push("Claude plugin manifest name must be refrain");
  }
  if (claudeManifest?.skills !== "./skills/") {
    errors.push("Claude plugin manifest must expose ./skills/");
  }
  if (claudeManifest?.commands !== "./commands/") {
    errors.push("Claude plugin manifest must expose ./commands/");
  }
  if (claudeManifest?.repository !== "https://github.com/benis-me/Refrain") {
    errors.push("Claude plugin manifest repository must target benis-me/Refrain");
  }
  if (codexManifest?.name !== "refrain") {
    errors.push("Codex plugin manifest name must be refrain");
  }
  if (codexManifest?.skills !== "./skills/") {
    errors.push("Codex plugin manifest must expose ./skills/");
  }
  if (codexManifest?.repository !== "https://github.com/benis-me/Refrain") {
    errors.push("Codex plugin manifest repository must target benis-me/Refrain");
  }
  if (codexManifest?.interface?.brandColor !== "#111827") {
    errors.push("Codex plugin interface brandColor must stay restrained");
  }

  const claudeVersion = claudeManifest?.version;
  const codexVersion = codexManifest?.version;
  const marketplaceVersion = claudeMarketplace?.plugins?.[0]?.version;
  if (!claudeVersion || claudeVersion !== codexVersion) {
    errors.push(
      `manifest versions must match: claude ${claudeVersion}, codex ${codexVersion}`
    );
  }
  if (marketplaceVersion && marketplaceVersion !== claudeVersion) {
    errors.push(
      `marketplace version ${marketplaceVersion} must match manifest version ${claudeVersion}`
    );
  }
}

async function validateSkill(root, skillName, errors) {
  const skillDir = path.join(root, SKILLS_ROOT, skillName);
  const relative = path.join(SKILLS_ROOT, skillName, "SKILL.md");
  const filePath = path.join(skillDir, "SKILL.md");

  if (!(await isFile(filePath))) {
    errors.push(`Missing skill: ${relative}`);
    return;
  }

  const source = await readFile(filePath, "utf8");
  const frontmatter = parseFrontmatter(source);
  if (!frontmatter) {
    errors.push(`${relative} is missing YAML frontmatter`);
    return;
  }

  if (frontmatter.name !== skillName) {
    errors.push(`${relative} name must be ${skillName}`);
  }
  if (!frontmatter.description?.startsWith("Use when ")) {
    errors.push(`${relative} description must start with "Use when"`);
  }
  if (frontmatter.description && frontmatter.description.length > 500) {
    errors.push(`${relative} description is too long`);
  }

  const forbiddenWorkflowHints = [
    "step-by-step",
    "workflow",
    "process:",
    "does the following"
  ];
  const lowerDescription = (frontmatter.description ?? "").toLowerCase();
  for (const hint of forbiddenWorkflowHints) {
    if (lowerDescription.includes(hint)) {
      errors.push(`${relative} description summarizes workflow with "${hint}"`);
    }
  }

  for (const section of ["## Start Here", "## Verification"]) {
    if (!source.includes(section)) {
      errors.push(`${relative} missing ${section}`);
    }
  }

  for (const marker of REQUIRED_SKILL_MARKERS[skillName] ?? []) {
    if (!source.includes(marker)) {
      errors.push(`${relative} missing marker: ${marker}`);
    }
  }

  for (const requiredFile of REQUIRED_SKILL_FILES[skillName] ?? []) {
    if (!(await isFile(path.join(skillDir, requiredFile)))) {
      errors.push(
        `Missing skill file: ${path.join(SKILLS_ROOT, skillName, requiredFile)}`
      );
    }
  }
}

/**
 * Every path-like reference written in a skill's markdown must resolve
 * inside that skill's directory, because installed skills only know their
 * own directory. This is what keeps routed files reachable at runtime.
 */
async function validateSkillLinks(root, skillName, errors) {
  const skillDir = path.join(root, SKILLS_ROOT, skillName);
  if (!(await isDirectory(skillDir))) {
    return;
  }

  const markdownFiles = (await listFiles(skillDir)).filter((file) =>
    file.endsWith(".md")
  );

  for (const file of markdownFiles) {
    const source = await readFile(file, "utf8");
    const candidates = new Set();

    for (const match of source.matchAll(/`([^`\n]+)`/g)) {
      candidates.add(match[1].trim());
    }
    for (const match of source.matchAll(/\]\(([^)#?\s]+)\)/g)) {
      candidates.add(match[1].trim());
    }

    for (const candidate of candidates) {
      if (!/^[\w./-]+\.(?:md|css|mjs|json)$/.test(candidate)) continue;
      if (!candidate.includes("/")) continue;
      if (candidate.startsWith("http") || candidate.startsWith("/")) continue;

      const fileRelative = path.relative(root, file);
      if (candidate.includes("..")) {
        errors.push(
          `${fileRelative} references ${candidate}, which escapes the skill directory`
        );
        continue;
      }
      if (candidate.startsWith("references/")) {
        errors.push(
          `${fileRelative} references removed plugin-root references/: ${candidate}`
        );
        continue;
      }

      const fromSkillRoot = path.join(skillDir, candidate);
      const fromFileDir = path.join(path.dirname(file), candidate);
      if (!(await isFile(fromSkillRoot)) && !(await isFile(fromFileDir))) {
        errors.push(`${fileRelative} has unreachable reference: ${candidate}`);
      }
    }
  }
}

async function validateCommand(root, errors) {
  const commandPath = path.join(root, PLUGIN_ROOT, "commands/new-project.md");
  if (!(await isFile(commandPath))) {
    return;
  }
  const source = await readFile(commandPath, "utf8");
  for (const match of source.matchAll(
    /\$\{CLAUDE_PLUGIN_ROOT\}\/([^\s`")\]]+)/g
  )) {
    const target = path.join(root, PLUGIN_ROOT, match[1]);
    if (!(await isFile(target))) {
      errors.push(
        `commands/new-project.md has unreachable plugin reference: ${match[1]}`
      );
    }
  }
}

/**
 * Portability and single-source bans across all plugin prose and styles:
 * no source-project names, no absolute user paths, no em-dashes, and no
 * motion durations outside the motion spec and identity files.
 */
async function validateContentBans(root, errors) {
  const pluginDir = path.join(root, PLUGIN_ROOT);
  const files = (await listFiles(pluginDir)).filter(
    (file) => file.endsWith(".md") || file.endsWith(".css")
  );

  for (const file of files) {
    const relative = path.relative(pluginDir, file);
    const source = await readFile(file, "utf8");

    if (SOURCE_PROJECT_NAME_PATTERN.test(source)) {
      errors.push(`portability: ${relative} references a source project by name`);
    }
    if (source.includes("/Users/")) {
      errors.push(`portability: ${relative} contains an absolute user path`);
    }
    if (source.includes(EM_DASH)) {
      errors.push(`em-dash: ${relative} contains U+2014; use commas or colons`);
    }
    if (source.includes("150-180ms")) {
      errors.push(
        `motion numbers: ${relative} uses the retired 150-180ms range; point at foundations/motion.md`
      );
    }
    if (/\d+ms\b/.test(source) && !MOTION_NUMBER_ALLOWLIST.has(relative)) {
      errors.push(
        `motion numbers: ${relative} states durations; only the motion spec and identity files may`
      );
    }
  }
}

/**
 * Drift checks: the linter's RULES table is the single source of truth for
 * machine-checkable blockers. The rubric tabulates it and the design skill
 * names every blocker id.
 */
async function validateDrift(root, errors) {
  const linterPath = path.join(
    root,
    SKILLS_ROOT,
    "refrain-review/scripts/anti-slop-lint.mjs"
  );
  if (!(await isFile(linterPath))) {
    errors.push("drift: anti-slop linter is missing");
    return;
  }

  let RULES;
  try {
    ({ RULES } = await import(pathToFileURL(linterPath).href));
  } catch (error) {
    errors.push(`drift: anti-slop linter failed to import: ${error.message}`);
    return;
  }

  const ids = RULES.map((rule) => rule.id);
  if (new Set(ids).size !== ids.length) {
    errors.push("drift: linter rule ids are not unique");
  }

  const rubric = await readFile(
    path.join(root, SKILLS_ROOT, "refrain-review/reference/rubric.md"),
    "utf8"
  );
  const designSkill = await readFile(
    path.join(root, SKILLS_ROOT, "refrain-design/SKILL.md"),
    "utf8"
  );

  for (const rule of RULES) {
    if (!rubric.includes(rule.id)) {
      errors.push(`drift: rubric.md does not list linter rule ${rule.id}`);
    }
    if (rule.severity === "blocker" && !designSkill.includes(rule.id)) {
      errors.push(
        `drift: refrain-design SKILL.md does not name blocker ${rule.id}`
      );
    }
  }

  const idSet = new Set(ids);
  for (const match of rubric.matchAll(/^\|\s*([a-z][a-z0-9-]*)\s*\|/gm)) {
    if (!idSet.has(match[1])) {
      errors.push(`drift: rubric.md lists unknown rule id ${match[1]}`);
    }
  }
}

async function validateLeanShape(root, errors) {
  for (const dir of FORBIDDEN_DIRS) {
    if (await isDirectory(path.join(root, dir))) {
      errors.push(`${dir}/ must not exist`);
    }
  }
}

async function countMarkdown(root, relativeDir) {
  const dir = path.join(root, relativeDir);
  if (!(await isDirectory(dir))) {
    return 0;
  }
  return (await listFiles(dir)).filter((file) => file.endsWith(".md")).length;
}

export async function validateWorkspace(rootUrl) {
  const root = resolveRoot(rootUrl);
  const errors = [];

  for (const relative of REQUIRED_ROOT_FILES) {
    if (!(await isFile(path.join(root, relative)))) {
      errors.push(`Missing required file: ${relative}`);
    }
  }

  await validatePackage(root, errors);
  await validateReadme(root, errors);
  await validateMarketplaces(root, errors);
  await validateLeanShape(root, errors);
  await validateCommand(root, errors);
  await validateContentBans(root, errors);
  await validateDrift(root, errors);

  for (const skillName of REQUIRED_SKILLS) {
    await validateSkill(root, skillName, errors);
    await validateSkillLinks(root, skillName, errors);
  }

  let ruleCount = 0;
  try {
    const { RULES } = await import(
      pathToFileURL(
        path.join(root, SKILLS_ROOT, "refrain-review/scripts/anti-slop-lint.mjs")
      ).href
    );
    ruleCount = RULES.length;
  } catch {
    // already reported by validateDrift
  }

  return {
    ok: errors.length === 0,
    errors,
    summary: {
      skills: REQUIRED_SKILLS.length,
      commands: await countMarkdown(root, `${PLUGIN_ROOT}/commands`),
      rules: ruleCount,
      plugin: true
    }
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = await validateWorkspace(new URL("../", import.meta.url));
  if (!result.ok) {
    console.error(result.errors.join("\n"));
    process.exitCode = 1;
  } else {
    console.log(`refrain validation passed: ${JSON.stringify(result.summary)}`);
  }
}
