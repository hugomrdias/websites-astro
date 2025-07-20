import { ui, defaultLang } from './ui'

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/')
  if (lang in ui) return lang as keyof typeof ui
  return defaultLang
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key]
  }
}

export function getRouteFromUrl(url: URL): string {
  const pathname = url.pathname
  const parts = pathname.split('/')
  const lang = parts[1]

  if (lang in ui) {
    return parts.slice(2).join('/') || '/'
  }
  return pathname
}

export function translatePath(
  lang: keyof typeof ui,
  path: string = ''
): string {
  return lang === defaultLang ? `/${path}` : `/${lang}/${path}`
}
