import { readdir, copyFile, rm } from 'node:fs/promises'
import { resolve, join } from 'node:path'

const root = resolve('dist/client')
// @vite-pwa/astro 1.x writes generated icons to dist for static output,
// while the Cloudflare adapter serves dist/client. Keep its generation pipeline.
for (const name of await readdir('dist')) {
  if (
    /^(favicon\.ico|apple-touch-icon-.*\.png|(?:pwa|maskable-icon)-.*\.png)$/.test(
      name
    )
  ) {
    await copyFile(join('dist', name), join(root, name))
  }
}
// Vite creates a local preview secrets file; it must never enter CI artifacts.
await rm('dist/server/.dev.vars', { force: true })
