import { ui, defaultLang } from './ui'

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/')
  if (lang in ui) return lang as keyof typeof ui
  return defaultLang
}

export function useTranslations(lang: keyof typeof ui) {
  return function t<K extends keyof (typeof ui)[typeof defaultLang]>(key: K) {
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

// Pages are served from directories, so link to the slashed URL directly
// instead of taking a redirect on every hop. A `#fragment` stays after it.
export function translatePath(
  lang: keyof typeof ui,
  path: string = ''
): string {
  const [, route, hash] = path.match(/^([^#]*)(.*)$/s)!
  const prefix = lang === defaultLang ? '/' : `/${lang}/`
  const slashed = route.replace(/^\/+|\/+$/g, '')
  return `${prefix}${slashed && `${slashed}/`}${hash}`
}
