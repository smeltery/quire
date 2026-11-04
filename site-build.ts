import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import type { Plugin } from 'vite'
import { brand, themeCss } from './src/brand.ts'

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')

/** Head tags for one page; every value comes from brand.json or page JSON. */
export function headTags(title: string, description: string) {
  const fullTitle = escapeHtml(`${title} — ${brand.name} docs`)
  const summary = escapeHtml(description)
  return [
    `<title>${fullTitle}</title>`,
    `<meta name="description" content="${summary}" />`,
    `<link rel="icon" type="image/svg+xml" href="${brand.logo}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escapeHtml(brand.name)}" />`,
    `<meta property="og:title" content="${fullTitle}" />`,
    `<meta property="og:description" content="${summary}" />`,
    `<meta property="og:image" content="${brand.ogImage}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<style>${themeCss(brand.theme)}</style>`,
  ].join('\n    ')
}

const marker = /<!-- %brand%.*?-->/

/** Injects brand head tags and prerenders one HTML entry per content page. */
export function siteBuild(): Plugin {
  return {
    name: 'quire-site-build',
    transformIndexHtml: (html) =>
      html.replace(marker, headTags('Overview', brand.description)),
    closeBundle() {
      const shell = readFileSync('dist/index.html', 'utf8')
      const head = /<title>[\s\S]*?<\/style>/
      writeFileSync(
        'dist/404.html',
        shell.replace(head, headTags('Not found', brand.description)),
      )
      for (const file of readdirSync('content', { recursive: true })) {
        if (!String(file).endsWith('.json')) continue
        const page = JSON.parse(
          readFileSync(join('content', String(file)), 'utf8'),
        ) as { path: string; title: string; description: string }
        const output = join('dist', page.path, 'index.html')
        mkdirSync(dirname(output), { recursive: true })
        writeFileSync(
          output,
          shell.replace(head, headTags(page.title, page.description)),
        )
      }
    },
  }
}
