export const articleCategoryIds = [
  'civil-law',
  'corporate-law',
  'employment-law',
  'real-estate-law',
  'criminal-law',
  'immigration-law',
] as const

export type ArticleCategory = (typeof articleCategoryIds)[number]

const labels = {
  pt: {
    'civil-law': 'Direito civil',
    'corporate-law': 'Sociedades comerciais',
    'employment-law': 'Direito do trabalho',
    'real-estate-law': 'Direito imobiliário',
    'criminal-law': 'Direito penal',
    'immigration-law': 'Imigração',
  },
  en: {
    'civil-law': 'Civil Law',
    'corporate-law': 'Corporate Law',
    'employment-law': 'Employment Law',
    'real-estate-law': 'Real Estate Law',
    'criminal-law': 'Criminal Law',
    'immigration-law': 'Immigration Law',
  },
} satisfies Record<'pt' | 'en', Record<ArticleCategory, string>>

export function articleCategoryLabel(
  category: ArticleCategory,
  lang: 'pt' | 'en'
) {
  return labels[lang][category]
}
