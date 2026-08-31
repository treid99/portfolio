import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * GitHub Pages serves this repo at https://treid99.github.io/portfolio/,
 * so every asset URL needs the /portfolio/ prefix.
 */
const BASE = '/portfolio/'

/**
 * Pages has no server-side rewrite, so a deep link like /portfolio/projects/foo
 * would 404 before React Router ever loads. Shipping a 404.html that is a byte
 * copy of index.html makes Pages hand those URLs back to the SPA.
 */
function spaFallback() {
  return {
    name: 'spa-404-fallback',
    closeBundle() {
      const dist = resolve(__dirname, 'dist')
      copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'))
    },
  }
}

export default defineConfig({
  base: BASE,
  plugins: [react(), spaFallback()],
  build: {
    target: 'es2020',
    sourcemap: false,
  },
})
