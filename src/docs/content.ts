import { type DocPage, loadPages, normalizePath } from './pages.ts'

export const pages = loadPages(
  import.meta.glob<Omit<DocPage, 'source'>>('../../content/**/*.json', {
    eager: true,
    import: 'default',
  }),
)

export function findPage(path: string) {
  const normalized = normalizePath(path)
  return pages.find((page) => page.path === normalized)
}
