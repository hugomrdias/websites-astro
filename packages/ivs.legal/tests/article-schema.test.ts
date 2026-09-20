import assert from 'node:assert/strict'
import { test } from 'node:test'
import { articleMetadataSchema } from '../src/lib/article-schema.ts'
import {
  assertUniqueArticleSlugs,
  assertUniqueArticleTranslations,
} from '../src/lib/article-slug.ts'

const metadata = {
  title: 'Proteção de dados: o que muda?',
  description: 'Uma introdução.',
  lang: 'pt',
  translationKey: 'data',
  category: 'corporate-law',
  publishedAt: '2026-09-20',
}

test('blank slugs use the accented title and optional fields receive defaults', () => {
  for (const slug of [undefined, null, '', '  ']) {
    const article = articleMetadataSchema.parse({ ...metadata, slug })
    assert.equal(article.slug, 'protecao-de-dados-o-que-muda')
    assert.equal(article.author, 'IVS Legal')
    assert.equal(article.sample, false)
    assert.equal(article.publishedAt.toISOString(), '2026-09-20T00:00:00.000Z')
  }
})

test('explicit slugs preserve URLs and invalid metadata is rejected', () => {
  assert.equal(
    articleMetadataSchema.parse({ ...metadata, slug: 'existing-url' }).slug,
    'existing-url'
  )
  for (const invalid of [
    { category: 'digital-law' },
    { slug: '../invalid' },
    { translationKey: '' },
    { lang: 'fr' },
    { publishedAt: undefined },
  ]) {
    assert.equal(
      articleMetadataSchema.safeParse({ ...metadata, ...invalid }).success,
      false
    )
  }
})

test('translations can share slugs and keys across languages but not within one', () => {
  const pt = { id: 'pt', data: articleMetadataSchema.parse(metadata) }
  const en = {
    id: 'en',
    data: articleMetadataSchema.parse({ ...metadata, lang: 'en' }),
  }
  assert.doesNotThrow(() => assertUniqueArticleSlugs([pt, en]))
  assert.doesNotThrow(() => assertUniqueArticleTranslations([pt, en]))
  assert.throws(
    () => assertUniqueArticleSlugs([pt, { ...pt, id: 'duplicate' }]),
    /Duplicate article slug/
  )
  assert.throws(
    () => assertUniqueArticleTranslations([pt, { ...pt, id: 'duplicate' }]),
    /Duplicate article translation key/
  )
})
