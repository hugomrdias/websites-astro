import assert from 'node:assert/strict'
import { test } from 'node:test'
import { pageMarkdown } from '../src/lib/agent-markdown.ts'

const person = {
  '@type': 'Person',
  '@id': 'https://hugodias.me/#person',
  name: 'Hugo Dias',
}
const graph = {
  '@context': 'https://schema.org',
  '@graph': [
    person,
    {
      '@type': 'CreativeWork',
      '@id': 'https://hugodias.me/projects/filsnap/#article',
      headline: 'Filsnap',
      datePublished: '2024-06-01T00:00:00.000Z',
      dateModified: '2024-07-01T00:00:00.000Z',
      author: { '@id': person['@id'] },
      about: {
        '@type': 'SoftwareSourceCode',
        codeRepository: 'https://github.com/filecoin-project/filsnap',
        url: 'https://filsnap.dev/',
      },
    },
  ],
}

const html = `<!doctype html><html lang="en"><head>
<link rel="canonical" href="https://hugodias.me/projects/filsnap/">
<title>Filsnap | Hugo Dias</title>
<meta name="description" content="Filecoin &amp; Metamask">
<script type="application/ld+json">${JSON.stringify(graph)}</script>
</head><body><header><nav><a href="/blog/">blog</a></nav></header><main>
<!-- <p>Commented-out draft</p> -->
<h1>Filsnap</h1>
<nav><a href="https://filsnap.dev/">website<svg></svg></a></nav>
<h2 id="usage">Usage<a class="header-anchor" href="#usage"><span aria-hidden="true">#</span></a></h2>
<p>Use <a href="https://ipfs.tech" title="IPFS | Long site title"><img src="/favicon.webp" alt="" aria-hidden="true"> IPFS</a>.</p>
<div class="expressive-code"><figure class="frame"><pre data-language="ts"><code><div class="ec-line"><div class="code"><span class="twoslash"><span class="twoslash-popup-container">const a: number</span>const</span> a = 1</div></div></code></pre><div class="copy"><button data-code="const a = 1\u007fconsole.log(a)"></button></div></figure></div>
<ul>
  <li>One</li>
  <li>Two</li>
</ul>
<button type="button">Share</button>
</main></body></html>`

test('project Markdown has front matter and only the readable content', () => {
  const page = pageMarkdown(html, '/projects/filsnap/')
  assert.equal(
    page.markdown,
    `---
title: "Filsnap"
description: "Filecoin & Metamask"
url: "https://hugodias.me/projects/filsnap/"
lang: "en"
author: "Hugo Dias"
datePublished: "2024-06-01T00:00:00.000Z"
dateModified: "2024-07-01T00:00:00.000Z"
repository: "https://github.com/filecoin-project/filsnap"
website: "https://filsnap.dev/"
---

# Filsnap

## Usage

Use [IPFS](https://ipfs.tech).

\`\`\`ts
const a = 1
console.log(a)
\`\`\`

- One
- Two
`
  )
  assert.equal(page.title, 'Filsnap')
  assert.equal(page.noindex, false)
})

test('pages without article data use the title without the site name', () => {
  const page = pageMarkdown(
    `<html lang="en"><head><title>Reference | Hugo Dias</title>
<meta name="robots" content="noindex, follow"></head>
<body><main><h1>Reference</h1></main></body></html>`,
    '/reference/'
  )
  assert.equal(page.title, 'Reference')
  assert.equal(page.url, '/reference/')
  assert.equal(page.noindex, true)
  assert.match(
    page.markdown,
    /^---\ntitle: "Reference"\nurl: "\/reference\/"\nlang: "en"\n---\n\n# Reference\n$/
  )
})
