import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  articleIdKey,
  notionPageId,
  unwrapSearchLink,
} from '../src/lib/article-links.ts'

const id = '3e18bb11e6ba8057bfdad82c4578c1c0'

test('Notion page URLs resolve to their page ID on every Notion host', () => {
  for (const url of [
    `https://app.notion.com/p/Burqa-ban-${id}`,
    `https://www.notion.so/Burqa-ban-${id}`,
    `https://www.notion.so/workspace/${id}?pvs=21`,
    `https://app.notion.com/p/${id}#block`,
    `https://ivs.notion.site/Burqa-ban-${id}/`,
    `https://www.notion.so/3e18bb11-e6ba-8057-bfda-d82c4578c1c0`,
    `https://www.notion.so/${id.toUpperCase()}`,
  ]) {
    assert.equal(notionPageId(url), id, url)
  }
  assert.equal(articleIdKey('3e18bb11-e6ba-8057-bfda-d82c4578c1c0'), id)
})

test('non-Notion and non-page URLs are left alone', () => {
  for (const url of [
    'https://www.pgdlisboa.pt/leis/lei_mostra_articulado.php?nid=948&tabela=leis',
    `https://example.com/${id}`,
    `https://notnotion.so/${id}`,
    'https://www.notion.so/pricing',
    '/articles/lei-das-burcas',
    '#heading',
  ]) {
    assert.equal(notionPageId(url), undefined, url)
  }
})

test('Google search wrappers around a URL link to the URL itself', () => {
  const source = 'https://diariodarepublica.pt/dr/detalhe/lei/6-2006-538965'
  assert.equal(
    unwrapSearchLink(`https://www.google.com/search?q=${source}`),
    source
  )
  assert.equal(
    unwrapSearchLink(
      `https://www.google.pt/search?q=${encodeURIComponent(source)}`
    ),
    source
  )
  for (const url of [
    'https://www.google.com/search?q=lei+do+arrendamento',
    'https://www.google.com/maps?q=https://example.com',
    `https://example.com/search?q=${source}`,
    '/articles/lei-das-burcas/',
  ]) {
    assert.equal(unwrapSearchLink(url), url, url)
  }
})
