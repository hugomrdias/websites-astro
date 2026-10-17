export const CONTACTS = {
  NAME: 'IVS Legal',
  ADDRESS: 'Travessa Henrique Schreck 96, 4450-578 Matosinhos, Portugal',
  STREET: 'Travessa Henrique Schreck 96',
  LOCALITY: 'Matosinhos',
  REGION: 'Porto',
  POSTAL_CODE: '4450-578',
  COUNTRY: 'PT',
  PHONE: '+351 925 395 905',
  EMAIL: 'geral@ivs.legal',
  WEBSITE: 'https://ivs.legal',
  HOURS: 'Segunda a Sexta: 9:00 - 18:00',
  LATITUDE: 41.201019287109375,
  LONGITUDE: -8.706390380859375,
} as const

export const OFFICE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACTS.ADDRESS)}`

export const SITE = {
  NAME: 'IVS Legal',
  DESCRIPTION:
    'IVS Legal: escritório de advocacia em Matosinhos. Apoio jurídico em direito civil, trabalho, imobiliário, imigração, sociedades comerciais e direito penal.',
  DESCRIPTION_EN:
    'IVS Legal is a law firm in Matosinhos, Portugal, advising on civil, employment, real estate, immigration, corporate and criminal law.',
  URL: 'https://ivs.legal',
  LOGO: 'https://ivs.legal/favicon.png',
  KEYWORDS:
    'advocacia, advogados, direito, Portugal, consultoria jurídica, imigração',
} as const

export const SAME_AS = ['https://x.com/ivslegal'] as const

// `id` is the profile anchor on the About pages and the Person JSON-LD `@id`.
export const FOUNDERS = [
  { id: 'isabel-veiga', name: 'Isabel Veiga' },
  { id: 'luisa-pinho-de-sousa', name: 'Luísa Pinho de Sousa' },
] as const

export type Founder = (typeof FOUNDERS)[number]

export const VCARD_PATH = '/ivs-legal.vcf'
