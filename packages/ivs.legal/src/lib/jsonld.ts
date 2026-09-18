import { CONTACTS, FOUNDERS, SAME_AS, SITE } from '../consts'
import { ui } from '../i18n/ui'

type SiteLang = keyof typeof ui

const PRACTICE_AREAS = [
  'civil',
  'commercial',
  'labor',
  'real-estate',
  'criminal',
  'tax',
] as const

type PracticeArea = (typeof PRACTICE_AREAS)[number]

function practiceCopy(lang: SiteLang, area: PracticeArea) {
  const copy = ui[lang]
  const titleKey = `practice.${area}.title` as const
  const descriptionKey = `practice.${area}.description` as const

  return {
    name: copy[titleKey],
    description: copy[descriptionKey],
  }
}

export function buildHomeJsonLd(options: {
  lang: SiteLang
  title: string
  description: string
  canonicalUrl: string
}) {
  const { lang, title, description, canonicalUrl } = options
  const copy = ui[lang]
  const organizationId = `${SITE.URL}/#organization`
  const websiteId = `${SITE.URL}/#website`
  const inLanguage = lang === 'pt' ? 'pt-PT' : 'en'

  const founders = FOUNDERS.map((name) => ({
    '@type': 'Person' as const,
    name,
    jobTitle: lang === 'pt' ? 'Advogada' : 'Lawyer',
    worksFor: { '@id': organizationId },
  }))

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LegalService',
        '@id': organizationId,
        name: SITE.NAME,
        description,
        url: SITE.URL,
        image: SITE.IMAGE,
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
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: 'Saturday',
            opens: '09:00',
            closes: '13:00',
          },
        ],
        sameAs: [...SAME_AS],
        founder: founders,
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
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        name: SITE.NAME,
        url: SITE.URL,
        description,
        inLanguage: ['pt-PT', 'en'],
        publisher: { '@id': organizationId },
      },
      {
        '@type': 'WebPage',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: title,
        description,
        inLanguage,
        isPartOf: { '@id': websiteId },
        about: { '@id': organizationId },
        primaryImageOfPage: SITE.IMAGE,
      },
    ],
  }
}
