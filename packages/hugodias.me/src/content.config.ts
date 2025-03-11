import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'
import GithubSlugger from 'github-slugger'
import { notionLoader } from 'notion-astro-loader'
import {
  notionPageSchema,
  propertySchema,
  transformedPropertySchema,
} from 'notion-astro-loader/schemas'

const blog = defineCollection({
  // type: "content",
  loader: glob({
    pattern: '**/[^_]*.{md,mdx}',
    base: './src/content/blog',
    generateId: ({ data }) => {
      const slugger = new GithubSlugger()
      return slugger.slug(data.title as string)
    },
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      draft: z.boolean().optional(),
      cover: image().optional(),
    }),
})

const work = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/work' }),
  schema: ({ image }) =>
    z.object({
      company: z.string(),
      role: z.string(),
      dateStart: z.coerce.date(),
      dateEnd: z.union([z.coerce.date(), z.string()]),
      images: z.array(image()).optional().default([]),
    }),
})

const projects = defineCollection({
  loader: glob({
    pattern: '**/[^_]*.{md,mdx}',
    base: './src/content/projects',
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      draft: z.boolean().optional(),
      demoURL: z.string().optional(),
      repoURL: z.string().optional(),
      cover: image().optional(),
    }),
})

const speaking = defineCollection({
  loader: notionLoader({
    auth: import.meta.env.NOTION_TOKEN,
    database_id: import.meta.env.NOTION_DATABASE_ID,
    // Use Notion sorting and filtering
    // filter: {
    //   property: 'Hidden',
    //   checkbox: { equals: false },
    // },
  }),
  schema: notionPageSchema({
    properties: z.object({
      Name: transformedPropertySchema.title,
      event: transformedPropertySchema.rich_text,
      date: transformedPropertySchema.date.transform((prop) => {
        return prop ? new Date(prop.start) : new Date()
      }),
      location: transformedPropertySchema.rich_text,
      url: transformedPropertySchema.url,
      images: propertySchema.files.transform(async (f) => {
        const imgs = []
        for (const file of f.files) {
          let url
          switch (file?.type) {
            case 'external':
              url = file.external.url
              break
            case 'file':
              url = file.file.url
              break
            default:
              url = undefined
          }
          if (!url) continue

          imgs.push(url)
        }
        return imgs
      }),
    }),
  }),
})
export const collections = { blog, work, projects, speaking }
