import { getCollection, type CollectionEntry } from 'astro:content'
import {
  assertUniqueArticleSlugs,
  assertUniqueArticleTranslations,
} from './article-slug'

export type Article = CollectionEntry<'articles'>
export type Language = Article['data']['lang']

export async function getArticles(lang?: Language) {
  const articles = await getCollection(
    'articles',
    ({ data }) => !data.draft && (!lang || data.lang === lang)
  )
  assertUniqueArticleSlugs(articles)
  assertUniqueArticleTranslations(articles)
  return articles.sort(
    (a, b) =>
      b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf() ||
      a.id.localeCompare(b.id)
  )
}

export function articleUrl(article: Article) {
  return `${articlesUrl(article.data.lang)}/${article.data.slug}`
}

export function articlesUrl(lang: Language) {
  return lang === 'en' ? '/en/articles' : '/articles'
}

export function articleDate(article: Article) {
  return new Intl.DateTimeFormat(
    article.data.lang === 'pt' ? 'pt-PT' : 'en-GB',
    { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }
  ).format(article.data.publishedAt)
}

export function readingTime(article: Article) {
  const words = article.body?.trim().split(/\s+/).length ?? 0
  return Math.max(1, Math.ceil(words / 200))
}

export const journalCopy = {
  pt: {
    label: 'Artigos da IVS Legal',
    title: 'Direito,',
    titleHighlight: 'com clareza.',
    intro:
      'Perspetivas sobre o direito que faz parte da sua vida. Para ler com tempo e decidir com confiança.',
    featured: 'Em destaque',
    read: 'Ler artigo',
    all: 'Todos os temas',
    articles: 'Todos os artigos',
    search: 'Pesquisar artigos',
    placeholder: 'O que procura?',
    more: 'Ver mais artigos',
    empty: 'Não encontrámos artigos.',
    emptyHint: 'Experimente outra pesquisa ou escolha um tema diferente.',
    reset: 'Limpar filtros',
    sample: 'Conteúdo de demonstração',
    sampleNote:
      'Estes textos ilustram a futura secção de artigos. Não constituem informação ou aconselhamento jurídico.',
    back: 'Todos os artigos',
    contents: 'Neste artigo',
    related: 'Continue a leitura',
    contactTitle: 'Cada situação tem o seu contexto.',
    contactText: 'Converse connosco sobre a sua questão.',
    contact: 'Entrar em contacto',
    minute: 'min de leitura',
  },
  en: {
    label: 'Articles by IVS Legal',
    title: 'Law,',
    titleHighlight: 'made clear.',
    intro:
      'Perspectives on the law that shapes your everyday life. Take time to read. Find clarity to move forward.',
    featured: 'In focus',
    read: 'Read article',
    all: 'All topics',
    articles: 'All articles',
    search: 'Search articles',
    placeholder: 'What are you looking for?',
    more: 'View more articles',
    empty: 'No articles found.',
    emptyHint: 'Try another search or choose a different topic.',
    reset: 'Clear filters',
    sample: 'Sample content',
    sampleNote:
      'These texts illustrate the future articles section. They do not provide legal information or advice.',
    back: 'All articles',
    contents: 'In this article',
    related: 'Continue reading',
    contactTitle: 'Every situation has its own context.',
    contactText: 'Talk to us about your question.',
    contact: 'Get in touch',
    minute: 'min read',
  },
} as const
