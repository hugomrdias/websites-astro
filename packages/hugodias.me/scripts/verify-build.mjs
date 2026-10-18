import console from 'node:console'
import { URL } from 'node:url'
import { readdir, readFile, stat } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import assert from 'node:assert/strict'

// Inspect the static assets Cloudflare will serve, without modifying output.
const root = resolve('dist')

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
const sitemap = await readFile(join(root, 'sitemap-0.xml'), 'utf8')
const site = 'https://hugodias.me'

// Require a nonempty Markdown counterpart and index entry for every public page.
// The error page is excluded, and noindex pages stay out of the indexes.
for (const file of all.filter(
  (f) => f.endsWith('.html') && !f.endsWith('/404.html')
)) {
  const html = await readFile(file, 'utf8')
  const md = file.replace(/\.html$/, '.md')
  const url = `${site}${md.slice(root.length)}`
  const page = url.replace(/index\.md$/, '')
  // `_headers` advertises a twin for every page, including noindex ones.
  assert((await stat(md)).size > 0, `Missing Markdown: ${md}`)
  if (/<meta name="robots" content="noindex/i.test(html)) {
    assert(
      !sitemap.includes(`<loc>${page}</loc>`),
      `Noindex in sitemap: ${page}`
    )
    continue
  }
  assert(
    html.includes('<script type="application/ld+json">'),
    `Missing JSON-LD: ${file}`
  )
  assert(index.includes(`](${url})`), `Missing llms.txt entry: ${url}`)
  assert(full.includes(`url: "${page}"`), `Missing llms-full.txt entry: ${url}`)
}

// Check the index in the other direction: every link must resolve to a
// generated file, and error routes must not appear in the discovery index.
for (const [, url] of index.matchAll(/\]\(([^)]+)\)/g)) {
  const { origin, pathname } = new URL(url)
  assert.equal(origin, site, `External index entry: ${url}`)
  assert(!pathname.includes('404'), `Invalid index entry: ${url}`)
  assert(
    (await stat(join(root, pathname))).isFile(),
    `Broken Markdown link: ${url}`
  )
}

// Catch output-path regressions that would drop icons, the retired service
// worker, or the fallback page from the deployed static asset directory.
for (const name of [
  'sw.js',
  'favicon.ico',
  'apple-touch-icon.png',
  'manifest.webmanifest',
  '404.html',
  '_headers',
  '_redirects',
  'hugo-dias.vcf',
  '.well-known/security.txt',
])
  await stat(join(root, name))

// Only report success after every assertion above has passed.
console.log(
  'Verified Markdown, JSON-LD, llms.txt links and required asset availability.'
)
