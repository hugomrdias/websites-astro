import { readFile, writeFile } from 'node:fs/promises'
import type { AstroIntegration } from 'astro'
import type { Element, Root } from 'hast'
import type { Nodes } from 'mdast'
import { fromHtml } from 'hast-util-from-html'
import { select, selectAll } from 'hast-util-select'
import { toMdast } from 'hast-util-to-mdast'
import { toString as hastToString } from 'hast-util-to-string'
import { gfmStrikethroughToMarkdown } from 'mdast-util-gfm-strikethrough'
import { gfmTableToMarkdown } from 'mdast-util-gfm-table'
import { toMarkdown } from 'mdast-util-to-markdown'
import { groupPages, llmsFullTxt, llmsTxt, type AgentPage } from './llms-txt.ts'

// Browser-only UI: controls, decoration and page chrome.
const dropped = new Set(['aside', 'button', 'form', 'nav', 'svg'])

function isDropped(node: Element) {
  const { properties } = node
  return (
    dropped.has(node.tagName) ||
    properties.hidden !== undefined ||
    properties.ariaHidden === 'true' ||
    // Marks chrome that is visible but means nothing out of the browser.
    properties.dataAgentSkip !== undefined
  )
}

function prune(node: Root | Element) {
  node.children = node.children.filter(
    (child) =>
      child.type !== 'comment' &&
      (child.type !== 'element' || !isDropped(child))
  ) as typeof node.children
  for (const child of node.children) {
    if (child.type !== 'element') continue
    prune(child)
    // Notion headings are often fully bold, which adds nothing in Markdown.
    const [only] = child.children
    if (
      /^h[1-6]$/.test(child.tagName) &&
      child.children.length === 1 &&
      only.type === 'element' &&
      only.tagName === 'strong'
    )
      child.children = only.children
  }
}

// Rendered lists put whitespace between items, which reads as loose lists.
function tighten(node: Nodes) {
  if ('spread' in node) node.spread = false
  if ('children' in node) node.children.forEach(tighten)
}

function property(tree: Root, selector: string, name: string) {
  const value = select(selector, tree)?.properties[name]
  if (value === undefined || value === null) return undefined
  return Array.isArray(value) ? value.join(' ') : String(value)
}

function frontMatter(fields: Record<string, string | undefined>) {
  const lines = Object.entries(fields)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
  return `---\n${lines.join('\n')}\n---\n\n`
}

export function pageTitle(title: string) {
  return title.replace(/\s+[-—|]\s+IVS Legal$/, '')
}

export function pageMarkdown(html: string, path: string) {
  const tree = fromHtml(html)
  const article = selectAll('script[type="application/ld+json"]', tree)
    .map((script) => JSON.parse(hastToString(script)))
    .find((data) => data['@type'] === 'Article')
  const title =
    article?.headline ?? pageTitle(hastToString(select('title', tree)!))
  const description =
    property(tree, 'meta[name="description"]', 'content') ?? ''
  const url = property(tree, 'link[rel="canonical"]', 'href') ?? path
  const main = select('main', tree) ?? tree
  prune(main)
  const mdast = toMdast(main)
  tighten(mdast)
  const body = toMarkdown(mdast, {
    bullet: '-',
    // Not all of GFM: its autolink rules would escape plain URLs in text.
    extensions: [gfmTableToMarkdown(), gfmStrikethroughToMarkdown()],
  })

  return {
    path,
    title,
    description,
    url,
    noindex: !!property(tree, 'meta[name="robots"]', 'content')?.includes(
      'noindex'
    ),
    markdown:
      frontMatter({
        title,
        description,
        url,
        lang: property(tree, 'html', 'lang'),
        ...(article && {
          category: article.about?.name,
          author: article.author?.name,
          datePublished: article.datePublished,
          dateModified: article.dateModified,
        }),
      }) + body,
  }
}

// Writes an `index.md` twin next to every built page, then `llms.txt` and
// `llms-full.txt` from the pages that are not noindex.
export default function agentMarkdown(options: {
  title: string
  description: string
  whenToUse?: string[]
}): AstroIntegration {
  let site: URL
  return {
    name: 'ivs-agent-markdown',
    hooks: {
      'astro:config:done': ({ config }) => {
        site = new URL(config.site!)
      },
      'astro:build:done': async ({ dir, pages: built }) => {
        const pages: AgentPage[] = []
        for (const { pathname } of built) {
          const path = `/${pathname.replace(/^\/+|\/+$/g, '')}/`.replace(
            '//',
            '/'
          )
          if (path === '/404/' || /\.[a-z0-9]+\/$/i.test(path)) continue
          const file = new URL(`.${path}index.html`, dir)
          // Routes without an HTML page, such as redirects, have nothing to convert.
          const html = await readFile(file, 'utf8').catch(() => undefined)
          if (html === undefined) continue
          const page = pageMarkdown(html, path)
          await writeFile(new URL('index.md', file), page.markdown, 'utf8')
          if (!page.noindex) pages.push(page)
        }
        // The Markdown 404 that src/worker.ts serves to agents for missing pages.
        const notFound = pageMarkdown(
          await readFile(new URL('404.html', dir), 'utf8'),
          '/404/'
        )
        await writeFile(
          new URL('404.md', dir),
          `${notFound.markdown}\nFind every page in ${new URL('llms.txt', site).href} or ${new URL('sitemap-index.xml', site).href}.\n`,
          'utf8'
        )
        const groups = groupPages(pages)
        await writeFile(
          new URL('llms.txt', dir),
          llmsTxt(groups, { ...options, site })
        )
        await writeFile(new URL('llms-full.txt', dir), llmsFullTxt(groups))
      },
    },
  }
}
