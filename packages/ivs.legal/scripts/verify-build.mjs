import console from 'node:console'
import { readdir, readFile, stat, copyFile, rm } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import assert from 'node:assert/strict'
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
/** @param {string} dir @returns {Promise<string[]>} */
async function files(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  return (
    await Promise.all(
      entries.map((e) =>
        e.isDirectory() ? files(join(dir, e.name)) : join(dir, e.name)
      )
    )
  ).flat()
}
const all = await files(root)
const index = await readFile(join(root, 'llms.txt'), 'utf8')
for (const file of all.filter(
  (f) => f.endsWith('.html') && !f.endsWith('/404.html')
)) {
  const md = file.replace(/\.html$/, '.md')
  assert((await stat(md)).size > 0, `Missing Markdown: ${md}`)
  assert(index.includes(md.slice(root.length)), `Missing llms.txt entry: ${md}`)
}
for (const [, url] of index.matchAll(/\]\((\/[^)]+)\)/g)) {
  assert(
    !url.includes('/api/') && !url.includes('404'),
    `Invalid index entry: ${url}`
  )
  assert((await stat(join(root, url))).isFile(), `Broken Markdown link: ${url}`)
}
for (const name of [
  'sw.js',
  'favicon.ico',
  'apple-touch-icon-180x180.png',
  'manifest.webmanifest',
  '404.html',
])
  await stat(join(root, name))
const worker = await readFile(join(root, 'sw.js'), 'utf8')
assert(worker.includes('unregister()') && worker.includes('caches.delete'))
assert(!worker.includes('precacheAndRoute'))
for (const name of [
  'index.html',
  'en/index.html',
  'contacto/index.html',
  'en/contacto/index.html',
]) {
  const html = await readFile(join(root, name), 'utf8')
  assert(
    html.includes('data-contact-form') && html.includes('apple-touch-icon')
  )
  assert(!/web3forms|hcaptcha/i.test(html))
}
console.log(
  'Verified Markdown, llms.txt, contact forms, icons, 404 and retirement worker.'
)
