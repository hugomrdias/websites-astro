import assert from 'node:assert/strict'
import { test } from 'node:test'
import { articleIdKey, notionPageId } from '../src/lib/article-links.ts'

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
