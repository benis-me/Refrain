import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REQUIRED_ROOT_FILES = [
  ".gitignore",
  "README.md",
  "AGENTS.md",
  "LICENSE",
  "package.json",
  ".claude-plugin/marketplace.json",
  ".agents/plugins/marketplace.json",
  "plugins/refrain/.claude-plugin/plugin.json",
  "plugins/refrain/.codex-plugin/plugin.json",
  "plugins/refrain/README.md",
  "plugins/refrain/blueprints/new-project.md",
  "scripts/validate-refrain.mjs",
  "tests/validate-refrain.test.mjs"
];

const FORBIDDEN_ROOT_DIRS = [
  "docs",
  "skills",
  "templates"
];

const FORBIDDEN_PLUGIN_DIRS = [
  "plugins/refrain/templates"
];

const REQUIRED_REFERENCES = [
  "agent-runtime-contract.md",
  "distilled-charter.md",
  "distribution.md",
  "engineering-principles.md",
  "interface-design.md",
  "polish-rubric.md",
  "product-shell-guidelines.md",
  "quality-kernel.md",
  "verification-standard.md"
];

const REQUIRED_SKILLS = [
  "refrain-interface-design",
  "refrain-product-style",
  "refrain-engineering-kernel",
  "refrain-agent-runtime",
  "refrain-product-review"
];

const REQUIRED_INTERFACE_DESIGN_FILES = [
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
];

const SOURCE_PROJECT_NAME_PATTERN = /\bD[e]zin\b/i;

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

async function countMarkdown(root, relativeDir) {
  const dir = path.join(root, relativeDir);
  const entries = await readdir(dir, { recursive: true, withFileTypes: true });
  return entries.filter((entry) => entry.isFile() && entry.name.endsWith(".md")).length;
}

async function validatePackage(root, errors) {
  const packageJson = await readJson(path.join(root, "package.json"), errors);
  if (!packageJson) {
    return;
  }

  if (packageJson.scripts?.test !== "node --test tests/*.test.mjs") {
    errors.push("package.json test script must only run root validation tests");
  }

  if (packageJson.scripts?.verify !== "node scripts/validate-refrain.mjs && npm test") {
    errors.push("package.json verify script must run validator before tests");
  }

  if ("sync:plugin" in (packageJson.scripts ?? {})) {
    errors.push("package.json must not keep sync:plugin after plugin becomes canonical");
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
  const claudeMarketplace = await readJson(path.join(root, ".claude-plugin/marketplace.json"), errors);
  const codexMarketplace = await readJson(path.join(root, ".agents/plugins/marketplace.json"), errors);
  const claudeManifest = await readJson(path.join(root, "plugins/refrain/.claude-plugin/plugin.json"), errors);
  const codexManifest = await readJson(path.join(root, "plugins/refrain/.codex-plugin/plugin.json"), errors);

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
}

async function validateSkill(root, skillName, errors) {
  const relative = path.join("plugins/refrain/skills", skillName, "SKILL.md");
  const filePath = path.join(root, relative);

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
}

async function validateReferences(root, errors) {
  for (const reference of REQUIRED_REFERENCES) {
    const relative = path.join("plugins/refrain/references", reference);
    if (!(await isFile(path.join(root, relative)))) {
      errors.push(`Missing reference: ${relative}`);
    }
  }
}

async function validateInterfaceDesign(root, errors) {
  const skillRelative = "plugins/refrain/skills/refrain-interface-design/SKILL.md";
  const referenceRelative = "plugins/refrain/references/interface-design.md";
  const skillPath = path.join(root, skillRelative);
  const referencePath = path.join(root, referenceRelative);

  if (!(await isFile(skillPath)) || !(await isFile(referencePath))) {
    return;
  }

  const skillSource = await readFile(skillPath, "utf8");
  const referenceSource = await readFile(referencePath, "utf8");
  const requiredSkillMarkers = [
    "foundations/tokens.md",
    "controls/selectors.md",
    "surfaces/workspace.md",
    "prompts/interface-generation.md",
    "cases/good-case.md",
    "## Agent Output Contract",
    "operational",
    "design-system",
    "real surface"
  ];
  const requiredReferenceMarkers = [
    "## Screen Archetypes",
    "## Verification On The Surface",
    "Creation home",
    "Selector popover",
    "empty, loading/running"
  ];

  for (const marker of requiredSkillMarkers) {
    if (!skillSource.includes(marker)) {
      errors.push(`${skillRelative} missing interface-design marker: ${marker}`);
    }
  }

  for (const marker of requiredReferenceMarkers) {
    if (!referenceSource.includes(marker)) {
      errors.push(`${referenceRelative} missing interface-design marker: ${marker}`);
    }
  }

  for (const relativeFile of REQUIRED_INTERFACE_DESIGN_FILES) {
    const relative = path.join("plugins/refrain/skills/refrain-interface-design", relativeFile);
    if (!(await isFile(path.join(root, relative)))) {
      errors.push(`Missing interface design route file: ${relative}`);
    }
  }
}

async function validateLeanShape(root, errors) {
  for (const dir of FORBIDDEN_ROOT_DIRS) {
    if (await isDirectory(path.join(root, dir))) {
      errors.push(`duplicated root ${dir}/ must not exist`);
    }
  }

  for (const dir of FORBIDDEN_PLUGIN_DIRS) {
    if (await isDirectory(path.join(root, dir))) {
      errors.push(`${dir}/ must not exist; use blueprints instead`);
    }
  }
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
  await validateReferences(root, errors);
  await validateLeanShape(root, errors);
  await validateInterfaceDesign(root, errors);

  for (const skillName of REQUIRED_SKILLS) {
    await validateSkill(root, skillName, errors);
  }

  return {
    ok: errors.length === 0,
    errors,
    summary: {
      skills: REQUIRED_SKILLS.length,
      references: await countMarkdown(root, "plugins/refrain/references"),
      blueprints: await countMarkdown(root, "plugins/refrain/blueprints"),
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
