import assert from 'node:assert/strict'
import { test } from 'node:test'
import { pageMarkdown } from '../src/lib/agent-markdown.ts'

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
<!-- <p>Commented-out draft</p> -->
<h1>Burqa ban</h1>
<div data-agent-skip><span>IVS Legal</span><div><span>Published</span></div></div>
<aside><nav>In this article</nav></aside>
<h2><strong>What changed?</strong></h2>
<p>Text with <strong>bold</strong> words<span aria-hidden="true">↗</span>.</p>
<ul>
  <li>One</li>
  <li>Two</li>
</ul>
<div hidden><p>No results.</p></div>
<form><label>Name <input name="name"></label><button>Send</button></form>
</main></body></html>`

test('article Markdown has front matter and only the readable content', () => {
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

- One
- Two
`
  )
  assert.equal(page.title, 'Burqa ban')
  assert.equal(page.noindex, false)
})

test('pages without article data use the title without the site name', () => {
  const page = pageMarkdown(
    `<html lang="pt-PT"><head><title>Sobre Nós - IVS Legal</title>
<meta name="robots" content="noindex, follow"></head>
<body><main><h1>Sobre</h1></main></body></html>`,
    '/about/'
  )
  assert.equal(page.title, 'Sobre Nós')
  assert.equal(page.url, '/about/')
  assert.equal(page.noindex, true)
  assert.match(
    page.markdown,
    /^---\ntitle: "Sobre Nós"\nurl: "\/about\/"\nlang: "pt-PT"\n---\n\n# Sobre\n$/
  )
})
