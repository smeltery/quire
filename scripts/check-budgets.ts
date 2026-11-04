#!/usr/bin/env bun
// LOC budgets: per-file line limits, a total code ceiling, and flat-directory
// file counts. Raise a budget only with a reason in the pull request.
import { existsSync, readFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { $ } from 'bun'

interface Budgets {
  default_lines: number
  files: Record<string, number>
  total_code_lines: number
  default_files: number
  directories: Record<string, number>
}
const root = (await $`git rev-parse --show-toplevel`.text()).trim()
process.chdir(root)
const budgets: Budgets = JSON.parse(
  readFileSync('scripts/budgets.json', 'utf8'),
)
const files = (
  await $`git ls-files --cached --others --exclude-standard`.text()
)
  .split('\n')
  .filter((file) => file && existsSync(file) && !file.startsWith('.flox/'))
const measured = /\.(ts|tsx|css|md|json|ya?ml|toml|sh)$/
const code = /^(src|scripts)\/.*\.(ts|tsx|css)$|^[^/]+\.ts$/
const errors: string[] = []
const counts = new Map<string, number>()
let total = 0

for (const file of files) {
  counts.set(dirname(file), (counts.get(dirname(file)) ?? 0) + 1)
  if (!measured.test(file) || file === 'bun.lock') continue
  const lines = readFileSync(file, 'utf8').trimEnd().split('\n').length
  const limit = budgets.files[file] ?? budgets.default_lines
  if (lines > limit) errors.push(`${file}: ${lines} lines > ${limit}`)
  if (code.test(file)) total += lines
}
if (total > budgets.total_code_lines)
  errors.push(`code total: ${total} lines > ${budgets.total_code_lines}`)
for (const [dir, count] of counts) {
  const limit = budgets.directories[dir] ?? budgets.default_files
  if (count > limit) errors.push(`${dir}/: ${count} files > ${limit}`)
}

if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}
console.log(
  `budgets ok: ${files.length} files, ${total}/${budgets.total_code_lines} code lines`,
)
