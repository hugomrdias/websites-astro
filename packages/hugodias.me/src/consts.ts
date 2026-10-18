import type { Metadata, Site, Socials } from '@types'

export const SITE: Site = {
  NAME: 'Hugo Dias',
  EMAIL: 'hugomrdias@gmail.com',
  URL: 'https://hugodias.me',
  DESCRIPTION:
    'Hugo Dias is a software engineer in Porto, Portugal, writing open source code for Web3: Filecoin, IPFS, libp2p and UCAN.',
  JOB_TITLE: 'Software Engineer',
  IMAGE: 'https://hugodias.me/favicon.png',
  NUM_POSTS_ON_HOMEPAGE: 3,
  NUM_WORKS_ON_HOMEPAGE: 2,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
  NUM_TALKS_ON_HOMEPAGE: 2,
  YEAR: new Date().getFullYear(),
}

export const HOME: Metadata = {
  TITLE: 'Home',
  DESCRIPTION: 'Writing code for Web3.',
}

export const BLOG: Metadata = {
  TITLE: 'Blog',
  DESCRIPTION: 'A collection of articles on topics I am passionate about.',
}

export const WORK: Metadata = {
  TITLE: 'Work',
  DESCRIPTION: 'Where I have worked and what I have done.',
}

export const PROJECTS: Metadata = {
  TITLE: 'Projects',
  DESCRIPTION:
    'A collection of my projects, with links to repositories and demos.',
}

export const TALKS: Metadata = {
  TITLE: 'Talks',
  DESCRIPTION: 'A collection of my talks, with links to slides and videos.',
}

export const SOCIALS: Socials = [
  {
    NAME: 'twitter',
    HREF: 'https://twitter.com/hugomrdias',
  },
  {
    NAME: 'github',
    HREF: 'https://github.com/hugomrdias',
  },
  {
    NAME: 'linkedin',
    HREF: 'https://www.linkedin.com/in/hugomrdias',
  },
]

// Profiles that identify the same person, for the Person JSON-LD `sameAs`.
export const SAME_AS = [
  'https://github.com/hugomrdias',
  'https://x.com/hugomrdias',
  'https://www.linkedin.com/in/hugomrdias',
  'https://www.npmjs.com/~hugomrdias',
] as const

export const CONTACTS = {
  PHONE: '+351 932 219 810',
  STREET: 'Praça António Nogueira da Silva 104',
  LOCALITY: 'Leça da Palmeira',
  REGION: 'Porto',
  POSTAL_CODE: '4450-236',
  COUNTRY: 'Portugal',
} as const

export const VCARD_PATH = '/hugo-dias.vcf'
