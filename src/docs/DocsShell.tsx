import { brand } from '../brand.ts'
import { DocActions } from './actions/DocActions.tsx'
import { BrandIcon } from './BrandIcon.tsx'
import { findPage } from './content.ts'
import { DocArticle } from './DocArticle.tsx'
import { DocsNavigation } from './DocsNavigation.tsx'
import { MobileNavigation } from './MobileNavigation.tsx'
import { DocsSearch } from './search/DocsSearch.tsx'
import './docs.css'
import './docs-content.css'
import './docs-mobile.css'
import './actions/doc-actions.css'

export function DocsShell({ path }: { path: string }) {
  const page = findPage(path)
  const toc =
    page?.sections.map((section) => ({
      href: `#${section.id}`,
      title: section.title,
    })) ?? []
  return (
    <div className="docs-page">
      <header className="docs-header">
        <a className="skip-link" href="#docs-main">
          Skip to content
        </a>
        <MobileNavigation />
        <a className="brand" href="/docs">
          <img
            className="brand-mark"
            src={brand.logo}
            width="25"
            height="25"
            alt=""
          />
          {brand.wordmark}
        </a>
        <span className="docs-header-label">Documentation</span>
        <nav aria-label="Documentation">
          {brand.nav.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
          <a className="brand-heading" href={brand.repository}>
            <BrandIcon name="GitHub" size={16} />
            GitHub ↗
          </a>
        </nav>
        <DocsSearch />
      </header>
      <div className="docs-layout">
        <aside className="docs-sidebar">
          <DocsNavigation />
        </aside>
        <main className="docs-main" id="docs-main">
          {toc.length > 0 && (
            <details className="mobile-toc">
              <summary>On this page</summary>
              <nav aria-label="On this page">
                {toc.map((item) => (
                  <a key={item.href} href={item.href}>
                    {item.title}
                  </a>
                ))}
              </nav>
            </details>
          )}
          {page ? (
            <DocArticle page={page} />
          ) : (
            <section id="not-found">
              <p className="eyebrow">404</p>
              <h1>Page not found</h1>
              <p className="docs-lead">
                This page does not exist. Search the docs or{' '}
                <a className="text-link" href="/docs">
                  start from the overview →
                </a>
              </p>
            </section>
          )}
          <div className="mobile-doc-actions">
            <DocActions page={page} />
          </div>
          <footer className="docs-footer">
            <a href={brand.homepage}>← {brand.name} home</a>
            <a href={`${brand.repository}/tree/${brand.branch}/content`}>
              View documentation source ↗
            </a>
          </footer>
        </main>
        <aside className="docs-toc">
          <p>ON THIS PAGE</p>
          {toc.map((item) => (
            <a key={item.href} href={item.href}>
              {item.title}
            </a>
          ))}
          <DocActions page={page} />
        </aside>
      </div>
    </div>
  )
}
