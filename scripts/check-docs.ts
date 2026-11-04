#!/usr/bin/env bun
// Lints Markdown, parses every Mermaid diagram (Markdown and content JSON),
// and checks relative Markdown links. Mirrors CI and the pre-commit hook.
import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { $ } from 'bun'
import { parseHTML } from 'linkedom'
import { lint } from 'markdownlint/sync'
import type { Diagram } from '../src/docs/pages.ts'
import { toMermaid } from '../src/docs/rendering/mermaid.ts'

const root = (await $`git rev-parse --show-toplevel`.text()).trim()
process.chdir(root)
const list = async (...globs: string[]) =>
  (
    await $`git ls-files --cached --others --exclude-standard -- ${globs}`.text()
  )
    .split('\n')
    .filter((file) => file && existsSync(file))
const markdown = await list('*.md')
const errors: string[] = []

const results = lint({
  files: markdown,
  config: { default: true, MD013: false, MD033: false, MD041: true },
})
for (const [file, findings] of Object.entries(results))
  for (const finding of findings ?? [])
    errors.push(`${file}:${finding.lineNumber} ${finding.ruleNames.join('/')}`)

const diagrams: [string, string][] = []
for (const file of markdown) {
  const text = readFileSync(file, 'utf8')
  for (const match of text.matchAll(/^```mermaid\n([\s\S]*?)^```$/gm))
    diagrams.push([file, match[1] ?? ''])
  for (const match of text.matchAll(/\[[^\]]*\]\(([^)\s]+)[^)]*\)/g)) {
    const href = (match[1] ?? '').split('#')[0] ?? ''
    if (!href || /^([a-z]+:|\/)/i.test(href)) continue
    if (!existsSync(resolve(dirname(file), decodeURIComponent(href))))
      errors.push(`${file}: broken link ${href}`)
  }
}
for (const file of await list('content/*.json', 'content/**/*.json')) {
  const page = JSON.parse(readFileSync(file, 'utf8'))
  for (const section of page.sections as { diagram?: Diagram }[])
    if (section.diagram) diagrams.push([file, toMermaid(section.diagram)])
}

const { window } = parseHTML('<!doctype html><html><body></body></html>')
Object.assign(globalThis, {
  window,
  document: window.document,
  DOMPurify: {
    addHook() {},
    removeHook() {},
    sanitize: (html: string) => html,
  },
})
const mermaid = (await import('mermaid')).default
for (const [file, source] of diagrams)
  await mermaid.parse(source).catch((error: Error) => {
    errors.push(`${file}: invalid mermaid: ${error.message.split('\n')[0]}`)
  })

if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}
console.log(
  `docs ok: ${markdown.length} markdown files, ${diagrams.length} mermaid diagrams`,
)
