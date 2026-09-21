import { readFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import sitemap from '@astrojs/sitemap'
import type { AstroIntegration } from 'astro'

export default function articleSitemap(): AstroIntegration {
  const modifiedDates = new Map<string, string>()
  const integration = sitemap({
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
        for (const { pathname } of options.pages) {
          const path = `/${pathname.replace(/^\/+|\/+$/g, '')}/`
          if (!/^\/(?:en\/)?articles\/[^/]+\/$/.test(path)) continue

          // Read this build's rendered metadata, avoiding another Notion fetch
          // or a separate cache that could disagree with the published page.
          const html = await readFile(
            new URL(`.${path}index.html`, options.dir),
            'utf8'
          )
          const articles = [
            ...html.matchAll(
              /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g
            ),
          ].map((match) => JSON.parse(match[1]))
          const article = articles.find((data) => data['@type'] === 'Article')
          assert(
            typeof article?.dateModified === 'string' &&
              Number.isFinite(Date.parse(article.dateModified)),
            `Missing or invalid article dateModified: ${path}`
          )
          modifiedDates.set(path, article.dateModified)
        }
        await buildDone(options)
      },
    },
  }
}
