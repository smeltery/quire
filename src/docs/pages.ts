import { brand } from '../brand.ts'

export interface Diagram {
  title: string
  actors: string[]
  /** [fromActor, toActor, label]; a self-step is from === to. */
  steps: [number, number, string][]
  caption: string
}
export interface DocSection {
  id: string
  title: string
  paragraphs: string[]
  endpoint?: { method: string; path: string }
  notice?: string
  diagram?: Diagram
  items?: string[]
  code?: string
  language?: string
  table?: string[][]
  links?: { label: string; href: string; icon?: string }[]
}
export interface DocHero {
  eyebrow: string
  title: string
  emphasis: string
  notice?: string
  base?: { label: string; value: string }
}
export interface DocPage {
  path: string
  title: string
  group: string
  description: string
  order?: number
  hero?: DocHero
  sections: DocSection[]
  /** Repository-relative source file, filled in at load time. */
  source: string
}

export function sortPages(list: DocPage[], groups = brand.groups) {
  return [...list].sort(
    (a, b) =>
      groups.indexOf(a.group) - groups.indexOf(b.group) ||
      (a.order ?? 99) - (b.order ?? 99) ||
      a.title.localeCompare(b.title),
  )
}

/** `/docs/x/` and `/docs/x` are the same page; `/` is the overview. */
export function normalizePath(path: string) {
  return path.replace(/\/$/, '') || '/docs'
}

export function loadPages(modules: Record<string, Omit<DocPage, 'source'>>) {
  return sortPages(
    Object.entries(modules).map(([file, page]) => ({
      ...page,
      source: file.replace(/^(\.\.\/)+/, ''),
    })),
  )
}
