import {
  CONTACTS,
  FOUNDERS,
  SAME_AS,
  SITE,
  VCARD_PATH,
  type Founder,
} from '../consts'
import { ui } from '../i18n/ui'
import { translatePath } from '../i18n/utils'

type SiteLang = keyof typeof ui

export type PageType =
  | 'WebPage'
  | 'AboutPage'
  | 'ContactPage'
  | 'CollectionPage'

export interface Breadcrumb {
  name: string
  url: string
}

const PRACTICE_AREAS = [
  'civil',
  'commercial',
  'labor',
  'real-estate',
  'criminal',
  'tax',
] as const

type PracticeArea = (typeof PRACTICE_AREAS)[number]

export const siteUrl = `${SITE.URL}/`
export const organizationId = `${SITE.URL}/#organization`
const websiteId = `${SITE.URL}/#website`

export function inLanguage(lang: SiteLang) {
  return lang === 'pt' ? 'pt-PT' : 'en'
}

function practiceCopy(lang: SiteLang, area: PracticeArea) {
  const copy = ui[lang]
  const titleKey = `practice.${area}.title` as const
  const descriptionKey = `practice.${area}.description` as const

  return {
    name: copy[titleKey],
    description: copy[descriptionKey],
  }
}

export function founderNode(founder: Founder, lang: SiteLang) {
  return {
    '@type': 'Person' as const,
    // One identity across languages; `url` is the localized profile anchor.
    '@id': `${SITE.URL}/about/#${founder.id}`,
    name: founder.name,
    url: new URL(translatePath(lang, `about#${founder.id}`), SITE.URL).href,
    jobTitle: lang === 'pt' ? 'Advogada' : 'Lawyer',
    worksFor: { '@id': organizationId },
    identifier: {
      '@type': 'PropertyValue',
      propertyID: 'Cédula profissional (Ordem dos Advogados)',
      value: founder.cedula,
    },
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: lang === 'pt' ? 'Cédula profissional' : 'Bar licence',
      identifier: founder.cedula,
      recognizedBy: {
        '@type': 'Organization',
        name: 'Ordem dos Advogados',
        url: 'https://portal.oa.pt/',
      },
    },
  }
}

export function founderByName(name: string) {
  return FOUNDERS.find((founder) => founder.name === name)
}

function organizationNode(lang: SiteLang, image: string) {
  const copy = ui[lang]

  return {
    '@type': 'LegalService',
    '@id': organizationId,
    name: SITE.NAME,
    description: lang === 'pt' ? SITE.DESCRIPTION : SITE.DESCRIPTION_EN,
    url: siteUrl,
    image,
    logo: SITE.LOGO,
    email: CONTACTS.EMAIL,
    telephone: CONTACTS.PHONE,
    currenciesAccepted: 'EUR',
    areaServed: {
      '@type': 'Country',
      name: 'Portugal',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONTACTS.STREET,
      addressLocality: CONTACTS.LOCALITY,
      addressRegion: CONTACTS.REGION,
      postalCode: CONTACTS.POSTAL_CODE,
      addressCountry: CONTACTS.COUNTRY,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: CONTACTS.LATITUDE,
      longitude: CONTACTS.LONGITUDE,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: CONTACTS.PHONE,
      email: CONTACTS.EMAIL,
      availableLanguage: ['pt-PT', 'en'],
      // The vCard holds the same details in a machine-readable format.
      url: new URL(VCARD_PATH, SITE.URL).href,
    },
    sameAs: [...SAME_AS],
    founder: FOUNDERS.map((founder) => ({
      '@id': founderNode(founder, lang)['@id'],
    })),
    knowsLanguage: ['pt', 'en'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${copy['practice.title']} ${copy['practice.title.highlight']}`.trim(),
      itemListElement: PRACTICE_AREAS.map((area, index) => {
        const offer = practiceCopy(lang, area)

        return {
          '@type': 'Offer',
          position: index + 1,
          itemOffered: {
            '@type': 'Service',
            name: offer.name,
            description: offer.description,
            provider: { '@id': organizationId },
            areaServed: {
              '@type': 'Country',
              name: 'Portugal',
            },
          },
        }
      }),
    },
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

// Every page carries the firm, the site and its own WebPage, so an agent
// reading any single page gets the same entities, linked by `@id`.
export function buildPageJsonLd(options: {
  lang: SiteLang
  title: string
  description: string
  canonicalUrl: string
  image: string
  pageType?: PageType
  breadcrumbs?: Breadcrumb[]
  mainEntity?: Record<string, unknown>
}) {
  const {
    lang,
    title,
    description,
    canonicalUrl,
    image,
    pageType = 'WebPage',
    breadcrumbs,
    mainEntity,
  } = options
  const isFirmPage = pageType === 'AboutPage' || pageType === 'ContactPage'

  return {
    '@context': 'https://schema.org',
    '@graph': [
      organizationNode(lang, image),
      ...FOUNDERS.map((founder) => founderNode(founder, lang)),
      {
        '@type': 'WebSite',
        '@id': websiteId,
        name: SITE.NAME,
        url: siteUrl,
        description: lang === 'pt' ? SITE.DESCRIPTION : SITE.DESCRIPTION_EN,
        inLanguage: ['pt-PT', 'en'],
        publisher: { '@id': organizationId },
      },
      {
        '@type': pageType,
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: title,
        description,
        inLanguage: inLanguage(lang),
        isPartOf: { '@id': websiteId },
        about: { '@id': organizationId },
        primaryImageOfPage: image,
        ...(breadcrumbs && {
          breadcrumb: { '@id': `${canonicalUrl}#breadcrumb` },
        }),
        ...(mainEntity
          ? { mainEntity }
          : isFirmPage && { mainEntity: { '@id': organizationId } }),
      },
      ...(breadcrumbs ? [breadcrumbNode(canonicalUrl, breadcrumbs)] : []),
    ],
  }
}
