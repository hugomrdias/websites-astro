export interface AgentPage {
  path: string
  title: string
  description: string
  url: string
  markdown: string
}

export interface Section {
  name: string
  pages: AgentPage[]
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
  { name: 'Other', test: () => true },
]

// Portuguese pages first, then English, each in path order.
const byLanguageThenPath = (a: AgentPage, b: AgentPage) =>
  Number(a.path.startsWith('/en/')) - Number(b.path.startsWith('/en/')) ||
  a.path.localeCompare(b.path)

export function groupPages(pages: AgentPage[]): Section[] {
  // Each page goes in the first section that matches it.
  const remaining = new Set([...pages].sort(byLanguageThenPath))
  return sections.flatMap(({ name, test }) => {
    const matched = [...remaining].filter((page) => test(page.path))
    for (const page of matched) remaining.delete(page)
    return matched.length > 0 ? [{ name, pages: matched }] : []
  })
}

export function markdownUrl(page: AgentPage) {
  return new URL('index.md', page.url).href
}

export function llmsTxt(
  groups: Section[],
  options: {
    title: string
    description: string
    site: URL
    // Tells agents which jobs the site is for and how to act on them.
    whenToUse?: string[]
  }
) {
  const lines = [
    `# ${options.title}`,
    '',
    `> ${options.description}`,
    '',
    `Each page links to its Markdown version. The full text of every page is in ${new URL('llms-full.txt', options.site).href}.`,
  ]
  if (options.whenToUse) {
    lines.push('', '## When to use', '')
    for (const item of options.whenToUse) lines.push(`- ${item}`)
  }
  for (const { name, pages } of groups) {
    lines.push('', `## ${name}`, '')
    for (const page of pages) {
      const description = page.description ? `: ${page.description}` : ''
      lines.push(`- [${page.title}](${markdownUrl(page)})${description}`)
    }
  }
  return `${lines.join('\n')}\n`
}

export function llmsFullTxt(groups: Section[]) {
  return groups
    .flatMap(({ pages }) => pages)
    .map((page) => page.markdown)
    .join('\n')
}
