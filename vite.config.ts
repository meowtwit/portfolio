import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

declare const process: { env: Record<string, string | undefined> }

export default defineConfig({
  base: process.env.GHPAGES_BASE ?? '/',
  plugins: [react()],
  server: { port: 3006 },
  preview: { port: 3006 },
})
