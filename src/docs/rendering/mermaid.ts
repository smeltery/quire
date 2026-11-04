import type { Diagram } from '../pages.ts'

/** Mermaid source for a page diagram, used by Markdown export and CI. */
export function toMermaid(diagram: Diagram) {
  const ids = diagram.actors.map((_, index) => `A${index}`)
  const lines = diagram.actors.map(
    (actor, index) => `  participant ${ids[index]} as ${actor}`,
  )
  for (const [from, to, label] of diagram.steps) {
    const arrow = to < from ? '-->>' : '->>'
    lines.push(
      `  ${ids[from]}${arrow}${ids[to]}: ${label.replaceAll(';', ',')}`,
    )
  }
  return `sequenceDiagram\n${lines.join('\n')}`
}
