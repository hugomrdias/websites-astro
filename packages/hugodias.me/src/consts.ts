import type { Metadata, Site, Socials } from '@types'

export const SITE: Site = {
  NAME: 'Hugo Dias',
  EMAIL: 'hugomrdias@gmail.com',
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
