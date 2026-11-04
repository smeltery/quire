# quire agent instructions

quire is a docs-site template: React and Vite, data in `brand.json` and
`content/**/*.json`, static output in `dist/`.

## Rules

- Branding and copy are data. Never hardcode a product name, URL, or brand
  color in `src/`; add a `brand.json` key or a theme token instead.
- Page content follows the schema in `src/docs/pages.ts`. Update
  `src/docs/content.test.ts` and `content/reference/page-schema.json` when the
  schema changes.
- Keep pure logic (`pages.ts`, `search/index.ts`, `actions/markdown.ts`,
  `rendering/mermaid.ts`) free of React and Vite APIs so `bun test` covers it.
- Honor `scripts/budgets.json`: 200 lines per file, 15 files per directory, and
  the total code ceiling. Split files rather than raising limits.
- Use Bun and the root scripts. Prefer `flox activate`.
- Pre-commit mirrors CI. Fix failures; never skip hooks.
- User-facing docs live in `docs/` with Mermaid diagrams; keep the README slim.
- `skills/docs-site` is mirrored in smeltery/skills. Change both together.

## Verify

```bash
bun run ci
```

For UI changes, also check `bun run preview` at desktop and mobile widths.
