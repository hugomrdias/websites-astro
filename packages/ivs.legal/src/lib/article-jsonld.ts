import { SITE } from '../consts'
import { articleCategoryLabel } from './article-categories'
import type { Article } from './articles'
import { founderByName, founderNode, organizationId, siteUrl } from './jsonld'

export function buildArticleJsonLd(
  article: Article,
  canonicalUrl: string,
  image: string,
  translation?: { article: Article; url: string }
) {
  const data = article.data
  const publisher = {
    '@type': 'Organization',
    '@id': organizationId,
    name: SITE.NAME,
    url: siteUrl,
    logo: { '@type': 'ImageObject', url: SITE.LOGO },
  }
  const founder = founderByName(data.author)
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
    image,
    datePublished: data.publishedAt.toISOString(),
    dateModified: data.last_edited_time,
    // Founders link to their profile on the About page; other names stay plain.
    author:
      data.author === SITE.NAME
        ? publisher
        : founder
          ? founderNode(founder, data.lang)
          : { '@type': 'Person', name: data.author },
    publisher,
    mainEntityOfPage: { '@id': `${canonicalUrl}#webpage` },
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
