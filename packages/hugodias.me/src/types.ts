export type Site = {
  NAME: string
  EMAIL: string
  URL: string
  DESCRIPTION: string
  JOB_TITLE: string
  IMAGE: string
  NUM_POSTS_ON_HOMEPAGE: number
  NUM_WORKS_ON_HOMEPAGE: number
  NUM_PROJECTS_ON_HOMEPAGE: number
  NUM_TALKS_ON_HOMEPAGE: number
  YEAR: number
}

export type Metadata = {
  TITLE: string
  DESCRIPTION: string
}

export type Socials = {
  NAME: string
  HREF: string
}[]

export type ImageMetadata = {
  src: string
  width: number
  height: number
  format: 'png' | 'jpg' | 'jpeg' | 'tiff' | 'webp' | 'gif' | 'svg' | 'avif'
}
