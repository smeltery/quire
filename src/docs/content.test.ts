import { describe, expect, test } from 'bun:test'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { brand } from '../brand.ts'
import type { DocPage } from './pages.ts'

const pageKeys = [
  'path',
  'title',
  'group',
  'description',
  'order',
  'hero',
  'sections',
]
const sectionKeys = [
  ...['id', 'title', 'paragraphs', 'endpoint', 'notice', 'diagram'],
  ...['items', 'code', 'language', 'table', 'links'],
]
const icons = ['terminal', 'shell', 'server', 'folder', 'copy', 'up', 'chat']
const files = readdirSync('content', { recursive: true })
  .map(String)
  .filter((file) => file.endsWith('.json'))
const pages = files.map((file) => ({
  file,
  page: JSON.parse(readFileSync(join('content', file), 'utf8')) as DocPage,
}))
const paths = new Set(pages.map(({ page }) => page.path))

describe.each(pages)('content/$file', ({ page }) => {
  test('uses only known fields and listed groups', () => {
    for (const key of Object.keys(page)) expect(pageKeys).toContain(key)
    for (const key of ['path', 'title', 'description'] as const)
      expect(page[key].length).toBeGreaterThan(0)
    expect(page.path).toMatch(/^\/docs(\/[a-z0-9-]+)*$/)
    expect(brand.groups).toContain(page.group)
  })
  test('has valid sections', () => {
    const ids = page.sections.map((section) => section.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const section of page.sections) {
      for (const key of Object.keys(section)) expect(sectionKeys).toContain(key)
      expect(Array.isArray(section.paragraphs)).toBe(true)
      for (const link of section.links ?? []) {
        expect(paths.has(link.href)).toBe(true)
        if (link.icon) expect([...icons, 'arrow']).toContain(link.icon)
      }
      for (const [from, to] of section.diagram?.steps ?? []) {
        expect(section.diagram?.actors[from]).toBeDefined()
        expect(section.diagram?.actors[to]).toBeDefined()
      }
    }
  })
})

test('page paths are unique and popular pages exist', () => {
  expect(paths.size).toBe(pages.length)
  for (const path of brand.popular) expect(paths.has(path)).toBe(true)
  expect(paths.has('/docs')).toBe(true)
})
