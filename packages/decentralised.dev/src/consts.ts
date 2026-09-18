import type { Metadata, Site, Socials } from '@types'

export const SITE: Site = {
  NAME: 'Decentralised Experience',
  EMAIL: 'hello@decentralised.dev',
  NUM_POSTS_ON_HOMEPAGE: 3,
  NUM_WORKS_ON_HOMEPAGE: 2,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
  NUM_TALKS_ON_HOMEPAGE: 2,
  YEAR: new Date().getFullYear(),
}

export const HOME: Metadata = {
  TITLE: 'Home',
  DESCRIPTION:
    'Computer programming and computer consultancy. Provision of services in the field of information technologies.',
}

export const SOCIALS: Socials = [
  {
    NAME: 'linkedin',
    HREF: 'https://www.linkedin.com/company/decentralised-experience',
  },
]
