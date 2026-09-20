import console from 'node:console'
import { readdir, readFile, stat } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import assert from 'node:assert/strict'

// Inspect the prepared assets Cloudflare will serve, without modifying output.
const root = resolve('dist/client')

// Include nested routes, such as English pages and individual Notion articles.
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

// The Markdown plugin can log generation failures without failing Astro's build.
// Require a nonempty Markdown counterpart and index entry for every public page.
// The error page is intentionally excluded from agent-facing content.
for (const file of all.filter(
  (f) => f.endsWith('.html') && !f.endsWith('/404.html')
)) {
  const md = file.replace(/\.html$/, '.md')
  assert((await stat(md)).size > 0, `Missing Markdown: ${md}`)
  assert(index.includes(md.slice(root.length)), `Missing llms.txt entry: ${md}`)
}

// Check the index in the other direction: every local link must resolve to a
// generated file, and API/error routes must not appear in the discovery index.
for (const [, url] of index.matchAll(/\]\((\/[^)]+)\)/g)) {
  assert(
    !url.includes('/api/') && !url.includes('404'),
    `Invalid index entry: ${url}`
  )
  assert((await stat(join(root, url))).isFile(), `Broken Markdown link: ${url}`)
}

// Catch output-path regressions that would drop icons, PWA retirement assets,
// or the branded fallback page from the deployed static asset directory.
for (const name of [
  'sw.js',
  'favicon.ico',
  'apple-touch-icon-180x180.png',
  'manifest.webmanifest',
  '404.html',
])
  await stat(join(root, name))

// Only report success after every assertion above has passed.
console.log(
  'Verified Markdown, llms.txt links and required asset availability.'
)
