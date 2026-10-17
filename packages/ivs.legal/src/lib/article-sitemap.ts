import { readFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import sitemap, { type LinkItem } from '@astrojs/sitemap'
import type { AstroIntegration } from 'astro'

export default function articleSitemap(): AstroIntegration {
  const modifiedDates = new Map<string, string>()
  const articleLinks = new Map<string, LinkItem[] | undefined>()
  const integration = sitemap({
    // Pairs pages that share a path after the locale prefix, so static pages
    // get hreflang alternates. Articles may reuse a slug across languages
    // without being translations, so they use the page's own hreflang links.
    i18n: { defaultLocale: 'pt', locales: { pt: 'pt-PT', en: 'en' } },
    serialize(item) {
      const path = new URL(item.url).pathname
      const lastmod = modifiedDates.get(path)
      if (!lastmod) return item
      return { ...item, lastmod, links: articleLinks.get(path) }
    },
  })
  const buildDone = integration.hooks['astro:build:done']!

  return {
    ...integration,
    hooks: {
      ...integration.hooks,
      'astro:build:done': async (options) => {
        modifiedDates.clear()
        articleLinks.clear()
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
          const links = [
            ...html.matchAll(
              /<link rel="alternate" hreflang="(pt-PT|en)" href="([^"]+)"/g
            ),
          ].map(([, lang, url]) => ({ lang, url }))
          articleLinks.set(path, links.length > 1 ? links : undefined)
        }
        await buildDone(options)
      },
    },
  }
}
