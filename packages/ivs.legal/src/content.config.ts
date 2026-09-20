import { defineCollection } from 'astro:content'
import { z } from 'astro/zod'
import { NOTION_TOKEN, NOTION_DATA_SOURCE_ID } from 'astro:env/server'
import {
  loader,
  pageWithMarkdownSchema,
  notroProperties,
  getPlainText,
} from 'notro-loader'
import { articleMetadataSchema } from './lib/article-schema'

const articles = defineCollection({
  loader: loader({
    clientOptions: { auth: NOTION_TOKEN },
    queryParameters: {
      data_source_id: NOTION_DATA_SOURCE_ID,
      filter: { property: 'draft', checkbox: { equals: false } },
    },
  }),
  schema: pageWithMarkdownSchema
    .extend({
      properties: z.object({
        title: notroProperties.title,
        description: notroProperties.richText,
        slug: notroProperties.richText.optional(),
        lang: notroProperties.select,
        translationKey: notroProperties.richText,
        category: notroProperties.select,
        publishedAt: notroProperties.date,
        author: notroProperties.richText.optional(),
        featured: notroProperties.checkbox.optional(),
        draft: notroProperties.checkbox,
        sample: notroProperties.checkbox.optional(),
      }),
    })
    .transform((page) => {
      const p = page.properties
      return {
        // Keep Notro's raw fields intact for its cache and image-expiry checks.
        ...page,
        ...articleMetadataSchema.parse({
          title: getPlainText(p.title),
          description: getPlainText(p.description),
          slug: p.slug ? getPlainText(p.slug) : undefined,
          lang: getPlainText(p.lang),
          translationKey: getPlainText(p.translationKey),
          category: getPlainText(p.category),
          publishedAt: getPlainText(p.publishedAt),
          author:
            (p.author ? getPlainText(p.author)?.trim() : undefined) ||
            undefined,
          featured: p.featured?.checkbox,
          draft: p.draft.checkbox,
          sample: p.sample?.checkbox,
        }),
      }
    }),
})

export const collections = { articles }
