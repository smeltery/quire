import { expect, test } from 'bun:test'
import { themeCss } from '../brand.ts'
import { pageMarkdown } from './actions/markdown.ts'
import { type DocPage, sortPages } from './pages.ts'
import { toMermaid } from './rendering/mermaid.ts'
import { searchPages } from './search/index.ts'

const page = (path: string, group: string, title: string): DocPage => ({
  path,
  group,
  title,
  description: `${title} description`,
  source: 'content/x.json',
  sections: [
    {
      id: 'setup',
      title: 'Setup',
      paragraphs: ['Install the widget toolkit.'],
      table: [
        ['Flag', 'Meaning'],
        ['--a|b', 'pipe'],
      ],
      diagram: {
        title: 'Flow',
        actors: ['Client', 'API'],
        steps: [
          [0, 1, 'Request'],
          [1, 0, 'Response'],
        ],
        caption: 'Round trip',
      },
    },
  ],
})
const pages = [page('/docs/b', 'Guides', 'Beta'), page('/docs', 'Start', 'A')]

test('sortPages orders by group then title', () => {
  const sorted = sortPages(pages, ['Start', 'Guides'])
  expect(sorted.map((item) => item.path)).toEqual(['/docs', '/docs/b'])
})

test('search ranks title matches and deep-links sections', () => {
  expect(searchPages(pages, 'beta')[0]?.href).toBe('/docs/b')
  expect(searchPages(pages, 'toolkit')[0]?.href).toContain('#setup')
  expect(searchPages(pages, '', ['/docs'])).toHaveLength(1)
  expect(searchPages(pages, 'nothing-matches')).toHaveLength(0)
})

test('markdown export escapes tables and emits mermaid', () => {
  const markdown = pageMarkdown(pages[0] as DocPage)
  expect(markdown).toContain('| --a\\|b | pipe |')
  expect(markdown).toContain('```mermaid\nsequenceDiagram')
})

test('toMermaid uses dashed arrows for replies', () => {
  const diagram = pages[0]?.sections[0]?.diagram
  if (!diagram) throw new Error('missing diagram')
  expect(toMermaid(diagram)).toContain('A1-->>A0: Response')
})

test('themeCss emits custom properties', () => {
  expect(themeCss({ ink: '#000' })).toBe(':root{--ink:#000}')
})
