import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { siteBuild } from './site-build.ts'

export default defineConfig({
  plugins: [react(), siteBuild()],
  server: { port: 5173 },
  build: { outDir: 'dist', emptyOutDir: true },
})
