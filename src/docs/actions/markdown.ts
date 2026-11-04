import type { DocPage } from '../pages.ts'
import { toMermaid } from '../rendering/mermaid.ts'

const fence = (language: string, body: string) =>
  `\`\`\`${language}\n${body}\n\`\`\``

export function pageMarkdown(page: DocPage): string {
  const parts = [`# ${page.title}`, page.description]
  for (const section of page.sections) {
    parts.push(`## ${section.title}`)
    if (section.endpoint)
      parts.push(`\`${section.endpoint.method} ${section.endpoint.path}\``)
    parts.push(...section.paragraphs)
    if (section.notice) parts.push(`> ${section.notice}`)
    if (section.diagram)
      parts.push(fence('mermaid', toMermaid(section.diagram)))
    if (section.items)
      parts.push(section.items.map((item) => `- ${item}`).join('\n'))
    if (section.table) {
      const rows = section.table.map(
        (row) =>
          `| ${row.map((cell) => cell.replaceAll('|', '\\|')).join(' | ')} |`,
      )
      rows.splice(1, 0, `| ${section.table[0]?.map(() => '---').join(' | ')} |`)
      parts.push(rows.join('\n'))
    }
    if (section.code)
      parts.push(fence(section.language?.toLowerCase() ?? '', section.code))
    if (section.links)
      parts.push(
        section.links
          .map((link) => `- [${link.label}](${link.href})`)
          .join('\n'),
      )
  }
  return parts.join('\n\n')
}
