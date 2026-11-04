# quire

[![CI](https://github.com/smeltery/quire/actions/workflows/ci.yml/badge.svg)](https://github.com/smeltery/quire/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/smeltery/quire?sort=semver&logo=github)](https://github.com/smeltery/quire/releases)
[![License: PolyForm Shield 1.0.0](https://img.shields.io/badge/license-PolyForm%20Shield%201.0.0-blue.svg)](LICENSE)
[![Bun](https://img.shields.io/badge/bun-1.3-f9f1e1?logo=bun&logoColor=black)](https://bun.sh)
[![React 19](https://img.shields.io/badge/react-19-61dafb?logo=react&logoColor=black)](https://react.dev)
[![Vite 7](https://img.shields.io/badge/vite-7-646cff?logo=vite&logoColor=white)](https://vite.dev)
[![TypeScript](https://img.shields.io/badge/typescript-strict-3178c6?logo=typescript&logoColor=white)](tsconfig.json)
[![Biome](https://img.shields.io/badge/biome-checked-60a5fa?logo=biome&logoColor=white)](biome.json)
[![pre-commit](https://img.shields.io/badge/pre--commit-enabled-brightgreen?logo=pre-commit&logoColor=white)](.pre-commit-config.yaml)
[![Dev env: Flox](https://img.shields.io/badge/dev%20env-flox-7c3aed.svg)](https://flox.dev)

A documentation site template. Fork it for an application, set the brand in
one file, write pages as JSON, and ship a static, searchable docs site.

Out of the box: grouped sidebar, table of contents, ⌘K search with preview,
highlighted copyable code, SVG sequence diagrams, endpoint pages, Edit on GitHub,
Copy as Markdown, Open in chat, mobile navigation, and per-page prerendered HTML.

```bash
gh repo create my-app-docs --template smeltery/quire --public --clone
cd my-app-docs && flox activate
bun run dev   # http://localhost:5173/docs
```

Let an agent do it with the gated [`docs-site` skill](skills/docs-site/SKILL.md):
`/docs-site <app repo>`.

## Documentation

See [docs/](docs/README.md): [getting started](docs/getting-started.md),
[branding](docs/branding.md), [writing content](docs/content.md),
[architecture](docs/architecture.md), [CI and releases](docs/ci-and-releases.md),
and the [agent skill](docs/agent-skill.md).

## License

[PolyForm Shield 1.0.0](LICENSE)
