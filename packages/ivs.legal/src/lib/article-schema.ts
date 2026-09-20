import { z } from 'astro/zod'
import { articleCategoryIds } from './article-categories.ts'
import { articleSlugPattern, slugFromTitle } from './article-slug.ts'

export const articleMetadataSchema = z
  .object({
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
    slug: z.string().trim().nullish(),
    lang: z.enum(['pt', 'en']),
    translationKey: z.string().trim().min(1),
    category: z.enum(articleCategoryIds),
    publishedAt: z.coerce.date(),
    author: z.string().default('IVS Legal'),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    sample: z.boolean().default(false),
  })
  .transform((article) => ({
    ...article,
    slug: article.slug || slugFromTitle(article.title),
  }))
  .refine((article) => articleSlugPattern.test(article.slug), {
    path: ['slug'],
    message:
      'Provide a slug using lowercase letters, numbers and single hyphens, or a title that generates one.',
  })
