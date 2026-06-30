# Distribution

Refrain is an installable plugin marketplace. The plugin package is the
canonical content source.

## Source Of Truth

Canonical content lives inside:

- `plugins/refrain/skills/`
- `plugins/refrain/references/`
- `plugins/refrain/blueprints/`

The repository root only contains marketplace descriptors, validation scripts,
and contributor instructions. Do not keep duplicate root copies of skills,
references, or starter templates.

## Claude Code Marketplace

Claude Code expects a marketplace catalog at:

```txt
.claude-plugin/marketplace.json
```

The same-repository plugin entry uses:

```json
{
  "name": "refrain",
  "source": "./plugins/refrain"
}
```

After the repository is published, users can add and install it:

```sh
/plugin marketplace add benis-me/Refrain
/plugin install refrain@refrain-marketplace
```

The installed skill namespace is plugin-prefixed, for example:

```sh
/refrain:refrain-product-style
```

## Codex Marketplace

Codex-compatible metadata lives at:

```txt
.agents/plugins/marketplace.json
plugins/refrain/.codex-plugin/plugin.json
```

During local development, load the repo marketplace directly. For public
distribution, publish the same `plugins/refrain` package through a compatible
Codex marketplace source.

## Release Checklist

1. Update canonical skills, docs, or template.
2. Run `npm run verify`.
3. When Claude Code is installed, run
   `claude plugin validate plugins/refrain --strict`.
4. Bump `plugins/refrain/.claude-plugin/plugin.json` and
   `plugins/refrain/.codex-plugin/plugin.json` versions when publishing a
   versioned release.
5. Publish the repository or tag.
