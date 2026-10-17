import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  llmsTxt,
  pageMarkdown,
  stripSkipped,
} from '../src/lib/agent-markdown.ts'

const article = {
  '@type': 'Article',
  headline: 'Burqa ban',
  datePublished: '2026-08-24T00:00:00.000Z',
  dateModified: '2026-09-23T10:00:00.000Z',
  author: { '@type': 'Organization', name: 'IVS Legal' },
  about: { '@type': 'Thing', name: 'Civil Law' },
}

const html = `<!doctype html><html lang="en"><head>
<link rel="canonical" href="https://ivs.legal/en/articles/burqa-ban/">
<title>Burqa ban — IVS Legal</title>
<meta name="description" content="The new law &amp; its exceptions">
<script type="application/ld+json">${JSON.stringify(article)}</script>
</head><body><header><nav><a href="/en/">Home</a></nav></header><main>
<a href="/en/articles/" data-agent-skip>All articles</a>
<p data-agent-skip>Civil Law</p>
<h1>Burqa ban</h1>
<div data-agent-skip><span>IVS Legal</span><div><span>Published</span></div></div>
<h2><strong>What changed?</strong></h2>
<p>Text with <strong>bold</strong> words.</p>
</main></body></html>`

test('page chrome marked data-agent-skip is removed, nesting included', () => {
  assert.equal(
    stripSkipped(
      '<div data-agent-skip><div>a</div><div>b</div></div><p>keep</p><img data-agent-skip src="x" /><span data-agent-skip="true">x</span>end'
    ),
    '<p>keep</p>end'
  )
})

test('article Markdown starts with front matter and the title heading', () => {
  const page = pageMarkdown(html, '/en/articles/burqa-ban/')
  assert.equal(
    page.markdown,
    `---
title: "Burqa ban"
description: "The new law & its exceptions"
url: "https://ivs.legal/en/articles/burqa-ban/"
lang: "en"
category: "Civil Law"
author: "IVS Legal"
datePublished: "2026-08-24T00:00:00.000Z"
dateModified: "2026-09-23T10:00:00.000Z"
---

# Burqa ban

## What changed?

Text with **bold** words.
`
  )
  assert.equal(page.title, 'Burqa ban')
})

test('llms.txt groups pages and uses absolute Markdown URLs', () => {
  const page = (path: string, title: string) => ({
    path,
    title,
    description: `${title} description`,
    url: `https://ivs.legal${path}`,
    lang: path.startsWith('/en/') ? 'en' : 'pt-PT',
    markdown: '',
  })
  const index = llmsTxt(
    [
      page('/en/articles/burqa-ban/', 'Burqa ban'),
      page('/terms/', 'Termos'),
      page('/en/', 'IVS Legal'),
      page('/', 'IVS Legal'),
      page('/articles/', 'Artigos'),
    ],
    {
      title: 'IVS Legal',
      description: 'Legal information',
      site: new URL('https://ivs.legal'),
    }
  )
  assert.equal(
    index,
    `# IVS Legal

> Legal information

Each page links to its Markdown version. The full text of every page is in https://ivs.legal/llms-full.txt.

## Firm

- [IVS Legal](https://ivs.legal/index.md): IVS Legal description
- [IVS Legal](https://ivs.legal/en/index.md): IVS Legal description

## Articles (Português)

- [Artigos](https://ivs.legal/articles/index.md): Artigos description

## Articles (English)

- [Burqa ban](https://ivs.legal/en/articles/burqa-ban/index.md): Burqa ban description

## Legal

- [Termos](https://ivs.legal/terms/index.md): Termos description
`
  )
})
