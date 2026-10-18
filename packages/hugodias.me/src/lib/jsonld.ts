import { CONTACTS, SAME_AS, SITE, VCARD_PATH } from '../consts'

export type PageType =
  | 'WebPage'
  | 'ProfilePage'
  | 'ContactPage'
  | 'CollectionPage'

export interface Breadcrumb {
  name: string
  url: string
}

// A blog post, or a project write-up about a piece of software.
export interface Article {
  type: 'BlogPosting' | 'CreativeWork'
  datePublished: Date
  dateModified?: Date
  repoURL?: string
  demoURL?: string
}

export const siteUrl = `${SITE.URL}/`
export const personId = `${SITE.URL}/#person`
const websiteId = `${SITE.URL}/#website`

function personNode() {
  return {
    '@type': 'Person',
    '@id': personId,
    name: SITE.NAME,
    url: siteUrl,
    image: SITE.IMAGE,
    jobTitle: SITE.JOB_TITLE,
    description: SITE.DESCRIPTION,
    email: `mailto:${SITE.EMAIL}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: CONTACTS.REGION,
      addressCountry: 'PT',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: SITE.EMAIL,
      // The vCard holds the same details in a machine-readable format.
      url: new URL(VCARD_PATH, SITE.URL).href,
    },
    sameAs: [...SAME_AS],
  }
}

export function breadcrumbNode(canonicalUrl: string, items: Breadcrumb[]) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${canonicalUrl}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

function articleNode(options: {
  article: Article
  title: string
  description: string
  canonicalUrl: string
  image: string
}) {
  const { article, title, description, canonicalUrl, image } = options
  return {
    '@type': article.type,
    '@id': `${canonicalUrl}#article`,
    url: canonicalUrl,
    headline: title,
    description,
    image,
    inLanguage: 'en',
    datePublished: article.datePublished.toISOString(),
    dateModified: (article.dateModified ?? article.datePublished).toISOString(),
    author: { '@id': personId },
    publisher: { '@id': personId },
    mainEntityOfPage: { '@id': `${canonicalUrl}#webpage` },
    isPartOf: { '@id': websiteId },
    ...((article.repoURL || article.demoURL) && {
      about: {
        '@type': 'SoftwareSourceCode',
        name: title,
        ...(article.repoURL && { codeRepository: article.repoURL }),
        ...(article.demoURL && { url: article.demoURL }),
        author: { '@id': personId },
      },
    }),
  }
}

// Every page carries the person, the site and its own WebPage, so an agent
// reading any single page gets the same entities, linked by `@id`.
export function buildPageJsonLd(options: {
  title: string
  description: string
  canonicalUrl: string
  image: string
  pageType?: PageType
  breadcrumbs?: Breadcrumb[]
  article?: Article
}) {
  const {
    title,
    description,
    canonicalUrl,
    image,
    pageType = 'WebPage',
    breadcrumbs,
    article,
  } = options
  const isPersonPage = pageType === 'ProfilePage' || pageType === 'ContactPage'

  return {
    '@context': 'https://schema.org',
    '@graph': [
      personNode(),
      {
        '@type': 'WebSite',
        '@id': websiteId,
        name: SITE.NAME,
        url: siteUrl,
        description: SITE.DESCRIPTION,
        inLanguage: 'en',
        publisher: { '@id': personId },
      },
      {
        '@type': pageType,
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: title,
        description,
        inLanguage: 'en',
        isPartOf: { '@id': websiteId },
        primaryImageOfPage: image,
        ...(breadcrumbs && {
          breadcrumb: { '@id': `${canonicalUrl}#breadcrumb` },
        }),
        ...(article
          ? { mainEntity: { '@id': `${canonicalUrl}#article` } }
          : isPersonPage && { mainEntity: { '@id': personId } }),
      },
      ...(article
        ? [articleNode({ article, title, description, canonicalUrl, image })]
        : []),
      ...(breadcrumbs ? [breadcrumbNode(canonicalUrl, breadcrumbs)] : []),
    ],
  }
}
