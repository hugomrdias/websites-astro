import { defineCollection } from 'astro:content'
import { z } from 'astro/zod'
import { glob } from 'astro/loaders'
import { articleCategoryIds } from './lib/article-categories'
import { articleSlugPattern, slugFromTitle } from './lib/article-slug'

const articles = defineCollection({
  // Replace this loader with Notion while preserving the schema and rendered body.
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/articles',
    // Keep entry identity independent of the public URL and its language.
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z
    .object({
      title: z.string().trim().min(1),
      description: z.string(),
      slug: z.string().trim().nullish(),
      lang: z.enum(['pt', 'en']),
      translationKey: z.string(),
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
    }),
})

export const collections = { articles }
