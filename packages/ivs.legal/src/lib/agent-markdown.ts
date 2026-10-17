import { readFile, writeFile } from 'node:fs/promises'
import { htmlToMarkdown } from '@puralex/astro-markdown-for-agents/html-to-markdown'
import type { AstroIntegration } from 'astro'

export interface AgentPage {
  path: string
  title: string
  description: string
  url: string
  lang: string
  markdown: string
}

const entities: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
}

function decode(text: string) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (match, entity: string) => {
    if (entity[0] !== '#') return entities[entity] ?? match
    const hex = entity[1] === 'x' || entity[1] === 'X'
    return String.fromCodePoint(
      parseInt(entity.slice(hex ? 2 : 1), hex ? 16 : 10)
    )
  })
}

function attribute(tag: string, name: string) {
  const value = tag.match(new RegExp(`\\s${name}="([^"]*)"`, 'i'))?.[1]
  return value === undefined ? undefined : decode(value)
}

function headTag(html: string, tag: string, name: string, value: string) {
  return html.match(
    new RegExp(`<${tag}\\b[^>]*\\s${name}="${value}"[^>]*>`, 'i')
  )?.[0]
}

// Remove page chrome marked `data-agent-skip` (search, filters, bylines),
// keeping same-name nested elements balanced.
export function stripSkipped(html: string) {
  const opening = /<([a-z][\w-]*)\b[^>]*\sdata-agent-skip(?:="[^"]*")?[^>]*>/gi
  let match: RegExpExecArray | null
  while ((match = opening.exec(html))) {
    const name = match[1].toLowerCase()
    const tags = new RegExp(`<(/?)${name}\\b[^>]*>`, 'gi')
    tags.lastIndex = match.index + match[0].length
    let depth = 1
    let end = tags.lastIndex
    if (!match[0].endsWith('/>')) {
      let tag: RegExpExecArray | null
      while (depth > 0 && (tag = tags.exec(html))) {
        if (tag[1]) depth--
        else if (!tag[0].endsWith('/>')) depth++
        end = tags.lastIndex
      }
    }
    html = html.slice(0, match.index) + html.slice(end)
    opening.lastIndex = match.index
  }
  return html
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

export function pageMarkdown(html: string, path: string): AgentPage {
  const title = decode(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? '')
  const description =
    attribute(headTag(html, 'meta', 'name', 'description') ?? '', 'content') ??
    ''
  const url =
    attribute(headTag(html, 'link', 'rel', 'canonical') ?? '', 'href') ?? path
  const lang = attribute(html.match(/<html\b[^>]*>/i)?.[0] ?? '', 'lang') ?? ''
  const article = [
    ...html.matchAll(
      /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g
    ),
  ]
    .map((match) => JSON.parse(match[1]))
    .find((data) => data['@type'] === 'Article')

  const body = htmlToMarkdown(stripSkipped(html))
    // Notion headings are often fully bold, which adds nothing in Markdown.
    .replace(/^(#{1,6}) \*\*(.+)\*\*$/gm, '$1 $2')

  return {
    path,
    title: pageTitle(article?.headline ?? title),
    description,
    url,
    lang,
    markdown:
      frontMatter({
        title: article?.headline ?? pageTitle(title),
        description,
        url,
        lang,
        ...(article && {
          category: article.about?.name,
          author: article.author?.name,
          datePublished: article.datePublished,
          dateModified: article.dateModified,
        }),
      }) + `${body}\n`,
  }
}

const sections: Array<{ name: string; test: (path: string) => boolean }> = [
  {
    name: 'Firm',
    test: (path) => /^\/(?:en\/)?(?:about\/|contact\/|vcard\/)?$/.test(path),
  },
  {
    name: 'Articles (Português)',
    test: (path) => path.startsWith('/articles/'),
  },
  {
    name: 'Articles (English)',
    test: (path) => path.startsWith('/en/articles/'),
  },
  {
    name: 'Legal',
    test: (path) => /^\/(?:en\/)?(?:privacy|terms)\/$/.test(path),
  },
]

function markdownUrl(page: AgentPage) {
  return new URL('index.md', page.url).href
}

export function llmsTxt(
  pages: AgentPage[],
  options: { title: string; description: string; site: URL }
) {
  const lines = [
    `# ${options.title}`,
    '',
    `> ${options.description}`,
    '',
    `Each page links to its Markdown version. The full text of every page is in ${new URL('llms-full.txt', options.site).href}.`,
  ]
  const listed = new Set<AgentPage>()
  for (const section of [...sections, { name: 'Other', test: () => true }]) {
    const entries = pages
      .filter((page) => !listed.has(page) && section.test(page.path))
      .sort(
        (a, b) =>
          Number(a.path.startsWith('/en/')) -
            Number(b.path.startsWith('/en/')) || a.path.localeCompare(b.path)
      )
    if (entries.length === 0) continue
    lines.push('', `## ${section.name}`, '')
    for (const page of entries) {
      listed.add(page)
      lines.push(
        `- [${page.title}](${markdownUrl(page)})${page.description ? `: ${page.description}` : ''}`
      )
    }
  }
  return `${lines.join('\n')}\n`
}

// Generates `index.md` twins, `llms.txt` and `llms-full.txt` from the built
// HTML. Replaces the plugin's own build step so pages get front matter, UI
// chrome is dropped and the index has titles, descriptions and sections.
export default function agentMarkdown(options: {
  title: string
  description: string
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
          const clean = pathname.replace(/^\/+|\/+$/g, '')
          if (clean === '404' || /\.[a-z0-9]+$/i.test(clean)) continue
          const file = new URL(`./${clean && `${clean}/`}index.html`, dir)
          let html: string
          try {
            html = await readFile(file, 'utf8')
          } catch {
            continue
          }
          const page = pageMarkdown(html, `/${clean && `${clean}/`}`)
          // Every page keeps a twin, since `_headers` advertises one for all
          // directories, but the indexes leave out pages hidden from search.
          await writeFile(new URL('index.md', file), page.markdown, 'utf8')
          if (!/<meta name="robots" content="noindex/i.test(html))
            pages.push(page)
        }
        const index = llmsTxt(pages, { ...options, site })
        await writeFile(new URL('llms.txt', dir), index, 'utf8')
        const order = [...index.matchAll(/\]\(([^)]+)\)/g)].map((m) => m[1])
        const full = pages
          .sort(
            (a, b) =>
              order.indexOf(markdownUrl(a)) - order.indexOf(markdownUrl(b))
          )
          .map((page) => page.markdown)
          .join('\n')
        await writeFile(new URL('llms-full.txt', dir), full, 'utf8')
      },
    },
  }
}
