import { CodeBlock } from './CodeBlock.tsx'
import { pages } from './content.ts'
import { DocCards } from './DocCards.tsx'
import type { DocPage, DocSection } from './pages.ts'
import { SequenceDiagram } from './rendering/SequenceDiagram.tsx'

function Heading({ page }: { page: DocPage }) {
  const { hero } = page
  if (!hero)
    return (
      <header className="doc-article-heading">
        <p className="eyebrow">{page.group}</p>
        <h1>{page.title}</h1>
        <p className="docs-lead">{page.description}</p>
      </header>
    )
  return (
    <section className="docs-hero">
      <p className="eyebrow">{hero.eyebrow}</p>
      <h1>
        {hero.title}
        <br />
        <em>{hero.emphasis}</em>
      </h1>
      <p className="docs-lead">{page.description}</p>
      {hero.notice && <div className="docs-notice">{hero.notice}</div>}
      {hero.base && (
        <div className="docs-base">
          <span>{hero.base.label}</span>
          <code>{hero.base.value}</code>
        </div>
      )}
    </section>
  )
}

function Table({ rows }: { rows: string[][] }) {
  return (
    <div className="docs-table">
      <table>
        <thead>
          <tr>
            {rows[0]?.map((cell) => (
              <th key={cell}>{cell}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(1).map((row) => (
            <tr key={row[0]}>
              {row.map((cell, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: cells are positional and may repeat.
                <td key={index}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Section({ section }: { section: DocSection }) {
  const { endpoint } = section
  return (
    <section
      id={section.id}
      className={endpoint ? 'endpoint-section' : undefined}
    >
      {endpoint ? (
        <>
          <div className="endpoint-title">
            <span className={`method method-${endpoint.method.toLowerCase()}`}>
              {endpoint.method}
            </span>
            <h2>{section.title}</h2>
          </div>
          <code className="endpoint-path">{endpoint.path}</code>
        </>
      ) : (
        <h2>{section.title}</h2>
      )}
      {section.paragraphs.map((text) => (
        <p key={text}>{text}</p>
      ))}
      {section.notice && <div className="docs-notice">{section.notice}</div>}
      {section.diagram && <SequenceDiagram diagram={section.diagram} />}
      {section.items && (
        <ul>
          {section.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
      {section.table && <Table rows={section.table} />}
      {section.code && (
        <CodeBlock label={section.language ?? 'Example'} code={section.code} />
      )}
      {section.links && <DocCards links={section.links} />}
    </section>
  )
}

export function DocArticle({ page }: { page: DocPage }) {
  const next = pages[pages.indexOf(page) + 1]
  return (
    <>
      <Heading page={page} />
      {page.sections.map((section) => (
        <Section key={section.id} section={section} />
      ))}
      {next && (
        <a className="doc-next" href={next.path}>
          <span>Continue reading</span>
          {next.title} →
        </a>
      )}
    </>
  )
}
