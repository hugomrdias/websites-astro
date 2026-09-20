import { readdir, copyFile, rm } from 'node:fs/promises'
import { resolve, join } from 'node:path'

// Run from the package directory after Astro builds; Cloudflare serves this folder.
const root = resolve('dist/client')

// @vite-pwa/astro 1.x writes generated icons to dist for static output,
// while the Cloudflare adapter serves dist/client. Keep its generation pipeline.
// Copy only generated icon files, leaving Worker code and other output untouched.
// Remove this workaround when icon generation is decoupled in issue #16.
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
// Missing files are fine: not every build has local preview secrets to remove.
await rm('dist/server/.dev.vars', { force: true })
