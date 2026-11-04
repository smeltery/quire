import { findPage } from './content.ts'
import { DocIcon } from './DocIcon.tsx'
import type { DocSection } from './pages.ts'

export function DocCards({
  links,
}: {
  links: NonNullable<DocSection['links']>
}) {
  return (
    <div className="doc-card-grid">
      {links.map((link) => (
        <a className="doc-card" key={link.href} href={link.href}>
          <DocIcon name={link.icon ?? 'terminal'} />
          <strong>{link.label}</strong>
          <p>{findPage(link.href)?.description}</p>
          <span className="doc-card-arrow" aria-hidden="true">
            ↗
          </span>
        </a>
      ))}
    </div>
  )
}
