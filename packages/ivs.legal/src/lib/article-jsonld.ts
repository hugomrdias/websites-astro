import { SITE } from '../consts'
import { articleCategoryLabel } from './article-categories'
import type { Article } from './articles'

export function buildArticleJsonLd(
  article: Article,
  canonicalUrl: string,
  translation?: { article: Article; url: string }
) {
  const data = article.data
  const publisher = {
    '@type': 'Organization',
    '@id': `${SITE.URL}/#organization`,
    name: SITE.NAME,
    url: SITE.URL,
    logo: { '@type': 'ImageObject', url: SITE.LOGO },
  }
  const version = (entry: Article, url: string) => ({
    '@type': 'Article',
    '@id': `${url}#article`,
    url,
    headline: entry.data.title,
    inLanguage: entry.data.lang === 'pt' ? 'pt-PT' : 'en',
  })

  return {
    '@context': 'https://schema.org',
    ...version(article, canonicalUrl),
    description: data.description,
    datePublished: data.publishedAt.toISOString(),
    dateModified: data.last_edited_time,
    author:
      data.author === SITE.NAME
        ? publisher
        : { '@type': 'Person', name: data.author },
    publisher,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
    about: {
      '@type': 'Thing',
      name: articleCategoryLabel(data.category, data.lang),
    },
    // Group language versions without guessing which was the original.
    ...(translation && {
      exampleOfWork: {
        '@type': 'CreativeWork',
        '@id': `${SITE.URL}/#article-${encodeURIComponent(data.translationKey)}`,
        workExample: [
          version(article, canonicalUrl),
          version(translation.article, translation.url),
        ],
      },
    }),
  }
}
