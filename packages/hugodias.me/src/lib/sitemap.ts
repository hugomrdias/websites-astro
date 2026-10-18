import { readFile } from 'node:fs/promises'
import sitemap from '@astrojs/sitemap'
import type { AstroIntegration } from 'astro'

// @astrojs/sitemap, with `lastmod` from each article's JSON-LD dateModified
// and without noindex pages.
export default function pageSitemap(): AstroIntegration {
  const modifiedDates = new Map<string, string>()
  const noindex = new Set<string>()
  const integration = sitemap({
    filter: (page) => !noindex.has(new URL(page).pathname),
    serialize(item) {
      const lastmod = modifiedDates.get(new URL(item.url).pathname)
      return lastmod ? { ...item, lastmod } : item
    },
  })
  const buildDone = integration.hooks['astro:build:done']!

  return {
    ...integration,
    hooks: {
      ...integration.hooks,
      'astro:build:done': async (options) => {
        modifiedDates.clear()
        noindex.clear()
        for (const { pathname } of options.pages) {
          const path = `/${pathname.replace(/^\/+|\/+$/g, '')}/`.replace(
            '//',
            '/'
          )
          // Read this build's rendered metadata, so the sitemap always agrees
          // with the published page.
          const html = await readFile(
            new URL(`.${path}index.html`, options.dir),
            'utf8'
          ).catch(() => undefined)
          if (html === undefined) continue
          if (/<meta name="robots" content="noindex/.test(html)) {
            noindex.add(path)
            continue
          }
          const dateModified = html.match(/"dateModified":"([^"]+)"/)?.[1]
          if (dateModified) modifiedDates.set(path, dateModified)
        }
        await buildDone(options)
      },
    },
  }
}
