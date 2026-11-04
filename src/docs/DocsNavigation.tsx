import { brand } from '../brand.ts'
import { pages } from './content.ts'
import { normalizePath } from './pages.ts'

export function DocsNavigation({ onNavigate }: { onNavigate?: () => void }) {
  const current = normalizePath(window.location.pathname)
  return (
    <>
      <nav aria-label="Documentation pages">
        {brand.groups.map((group) => (
          <div className="docs-nav-group" key={group}>
            <p>{group}</p>
            {pages
              .filter((page) => page.group === group)
              .map((page) => (
                <a
                  key={page.path}
                  href={page.path}
                  onClick={onNavigate}
                  aria-current={current === page.path ? 'page' : undefined}
                >
                  {page.title}
                </a>
              ))}
          </div>
        ))}
      </nav>
      <a onClick={onNavigate} className="docs-home" href={brand.homepage}>
        ← Back to {brand.name}
      </a>
    </>
  )
}
