export const articleSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function slugFromTitle(title: string) {
  return title
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function assertUniqueArticleTranslations(
  articles: Array<{
    id: string
    data: { lang: string; translationKey: string }
  }>
) {
  const seen = new Set<string>()
  for (const article of articles) {
    const key = `${article.data.lang}/${article.data.translationKey}`
    if (seen.has(key)) {
      throw new Error(
        `Duplicate article translation key "${key}". Each language can have only one article per translation key.`
      )
    }
    seen.add(key)
  }
}

export function assertUniqueArticleSlugs(
  articles: Array<{ id: string; data: { lang: string; slug: string } }>
) {
  const seen = new Map<string, string>()
  for (const article of articles) {
    const key = `${article.data.lang}/${article.data.slug}`
    const existingId = seen.get(key)
    if (existingId !== undefined) {
      throw new Error(
        `Duplicate article slug "${key}" in "${existingId}" and "${article.id}". Set a unique explicit slug for one of these articles.`
      )
    }
    seen.set(key, article.id)
  }
}
