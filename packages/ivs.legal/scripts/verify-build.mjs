import console from 'node:console'
import { URL } from 'node:url'
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
const full = await readFile(join(root, 'llms-full.txt'), 'utf8')
const site = 'https://ivs.legal'

// Require a nonempty Markdown counterpart and index entry for every public page.
// The error page is excluded, and noindex pages stay out of the indexes.
for (const file of all.filter(
  (f) => f.endsWith('.html') && !f.endsWith('/404.html')
)) {
  const html = await readFile(file, 'utf8')
  // Notro renders an error box instead of failing when an article's MDX breaks.
  assert(
    !html.includes('[notro] MDX compilation error'),
    `Notion article failed to compile: ${file}`
  )
  const md = file.replace(/\.html$/, '.md')
  const url = `${site}${md.slice(root.length)}`
  // `_headers` advertises a twin for every page, including noindex ones.
  assert((await stat(md)).size > 0, `Missing Markdown: ${md}`)
  if (/<meta name="robots" content="noindex/i.test(html)) continue
  assert(index.includes(`](${url})`), `Missing llms.txt entry: ${url}`)
  assert(
    full.includes(`url: "${url.replace(/index\.md$/, '')}"`),
    `Missing llms-full.txt entry: ${url}`
  )
}

// Check the index in the other direction: every link must resolve to a
// generated file, and API/error routes must not appear in the discovery index.
for (const [, url] of index.matchAll(/\]\(([^)]+)\)/g)) {
  const { origin, pathname } = new URL(url)
  assert.equal(origin, site, `External index entry: ${url}`)
  assert(
    !pathname.includes('/api/') && !pathname.includes('404'),
    `Invalid index entry: ${url}`
  )
  assert(
    (await stat(join(root, pathname))).isFile(),
    `Broken Markdown link: ${url}`
  )
}

// Catch output-path regressions that would drop icons, PWA retirement assets,
// or the branded fallback page from the deployed static asset directory.
for (const name of [
  'sw.js',
  'favicon.ico',
  'favicon-16x16.png',
  'favicon-32x32.png',
  'favicon-48x48.png',
  'favicon.svg',
  'apple-touch-icon.png',
  'safari-pinned-tab.svg',
  'manifest.webmanifest',
  '404.html',
  'ivs-legal.vcf',
  '.well-known/security.txt',
])
  await stat(join(root, name))

// Only report success after every assertion above has passed.
console.log(
  'Verified Markdown, llms.txt links and required asset availability.'
)
