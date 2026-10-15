import assert from 'node:assert/strict'
import { test } from 'node:test'
import { normalizeArticleMarkdown } from '../src/lib/article-markdown.ts'

test('void tags from Notion are self-closed for MDX', () => {
  assert.equal(
    normalizeArticleMarkdown('**Lei n.º 1/2024<br>Artigo 2.º**'),
    '**Lei n.º 1/2024<br />Artigo 2.º**'
  )
  assert.equal(normalizeArticleMarkdown('a<br>b<BR >c'), 'a<br />b<BR />c')
  assert.equal(
    normalizeArticleMarkdown('<img src="a.png" alt="x">'),
    '<img src="a.png" alt="x" />'
  )
})

test('already self-closed tags are left alone', () => {
  for (const md of ['a<br/>b', 'a<br />b', '<img src="a.png" />']) {
    assert.equal(normalizeArticleMarkdown(md), md)
  }
})

test('code is left verbatim', () => {
  for (const md of [
    'Use `<br>` for breaks',
    '```html\n<br>\n```',
    '```\n<br>\n',
  ]) {
    assert.equal(normalizeArticleMarkdown(md), md)
  }
  assert.equal(
    normalizeArticleMarkdown('```\n<br>\n```\nafter<br>'),
    '```\n<br>\n```\nafter<br />'
  )
})
