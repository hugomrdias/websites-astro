import assert from 'node:assert/strict'
import { test } from 'node:test'
import { groupPages, llmsFullTxt, llmsTxt } from '../src/lib/llms-txt.ts'

const page = (path: string, title: string) => ({
  path,
  title,
  description: `${title} description`,
  url: `https://hugodias.me${path}`,
  markdown: `# ${title}\n`,
})

const groups = groupPages([
  page('/projects/ucan/', 'UCAN'),
  page('/blog/introducing-filecoin-wallet/', 'Introducing Filecoin Wallet'),
  page('/work/', 'Work'),
  page('/', 'Home'),
  page('/blog/', 'Blog'),
  page('/elsewhere/', 'Elsewhere'),
])

test('llms.txt groups pages and uses absolute Markdown URLs', () => {
  assert.equal(
    llmsTxt(groups, {
      title: 'Hugo Dias',
      description: 'Software engineer',
      site: new URL('https://hugodias.me'),
    }),
    `# Hugo Dias

> Software engineer

Each page links to its Markdown version. The full text of every page is in https://hugodias.me/llms-full.txt.

## About

- [Home](https://hugodias.me/index.md): Home description
- [Work](https://hugodias.me/work/index.md): Work description

## Blog

- [Blog](https://hugodias.me/blog/index.md): Blog description
- [Introducing Filecoin Wallet](https://hugodias.me/blog/introducing-filecoin-wallet/index.md): Introducing Filecoin Wallet description

## Projects

- [UCAN](https://hugodias.me/projects/ucan/index.md): UCAN description

## Other

- [Elsewhere](https://hugodias.me/elsewhere/index.md): Elsewhere description
`
  )
})

test('llms-full.txt follows the llms.txt order', () => {
  assert.equal(
    llmsFullTxt(groups),
    ['Home', 'Work', 'Blog', 'Introducing Filecoin Wallet', 'UCAN', 'Elsewhere']
      .map((title) => `# ${title}\n`)
      .join('\n')
  )
})
