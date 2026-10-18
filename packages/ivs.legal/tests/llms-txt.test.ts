import assert from 'node:assert/strict'
import { test } from 'node:test'
import { groupPages, llmsFullTxt, llmsTxt } from '../src/lib/llms-txt.ts'

const page = (path: string, title: string) => ({
  path,
  title,
  description: `${title} description`,
  url: `https://ivs.legal${path}`,
  markdown: `# ${title}\n`,
})

const groups = groupPages([
  page('/en/articles/burqa-ban/', 'Burqa ban'),
  page('/terms/', 'Termos'),
  page('/en/', 'IVS Legal EN'),
  page('/', 'IVS Legal'),
  page('/articles/', 'Artigos'),
  page('/ivs-legal/', 'Elsewhere'),
])

test('llms.txt groups pages and uses absolute Markdown URLs', () => {
  assert.equal(
    llmsTxt(groups, {
      title: 'IVS Legal',
      description: 'Legal information',
      site: new URL('https://ivs.legal'),
    }),
    `# IVS Legal

> Legal information

Each page links to its Markdown version. The full text of every page is in https://ivs.legal/llms-full.txt.

## Firm

- [IVS Legal](https://ivs.legal/index.md): IVS Legal description
- [IVS Legal EN](https://ivs.legal/en/index.md): IVS Legal EN description

## Articles (Português)

- [Artigos](https://ivs.legal/articles/index.md): Artigos description

## Articles (English)

- [Burqa ban](https://ivs.legal/en/articles/burqa-ban/index.md): Burqa ban description

## Legal

- [Termos](https://ivs.legal/terms/index.md): Termos description

## Other

- [Elsewhere](https://ivs.legal/ivs-legal/index.md): Elsewhere description
`
  )
})

test('llms-full.txt follows the llms.txt order', () => {
  assert.equal(
    llmsFullTxt(groups),
    ['IVS Legal', 'IVS Legal EN', 'Artigos', 'Burqa ban', 'Termos', 'Elsewhere']
      .map((title) => `# ${title}\n`)
      .join('\n')
  )
})

test('llms.txt lists when-to-use guidance before the pages', () => {
  const text = llmsTxt(groups.slice(0, 1), {
    title: 'IVS Legal',
    description: 'Legal information',
    site: new URL('https://ivs.legal'),
    whenToUse: ['Someone needs a lawyer.', 'Someone wants information.'],
  })
  assert.match(
    text,
    /llms-full\.txt\.\n\n## When to use\n\n- Someone needs a lawyer\.\n- Someone wants information\.\n\n## Firm\n/
  )
})
