import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { brand } from './brand.ts'
import { findPage } from './docs/content.ts'
import { DocsShell } from './docs/DocsShell.tsx'
import './base.css'

const path = window.location.pathname
const page = findPage(path)
document.title = `${page?.title ?? 'Not found'} — ${brand.name} docs`

const root = document.getElementById('root')
if (!root) throw new Error('missing #root')

createRoot(root).render(
  <StrictMode>
    <DocsShell path={path} />
  </StrictMode>,
)
