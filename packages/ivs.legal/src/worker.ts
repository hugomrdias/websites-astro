import { handle } from '@astrojs/cloudflare/handler'
import { prefersMarkdown } from './lib/accept-markdown'

const markdownType = 'text/markdown; charset=utf-8'

function varyOnAccept(response: Response, headers: HeadersInit = {}) {
  const varied = new Response(response.body, response)
  for (const [name, value] of new Headers(headers))
    varied.headers.set(name, value)
  varied.headers.append('Vary', 'Accept')
  return varied
}

// Every page is a directory with an `index.md` twin (see lib/agent-markdown.ts).
// Agents that ask for Markdown get the twin, or `404.md`, at the page's URL;
// everything else goes to Astro, which serves prerendered pages from ASSETS.
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    const markdown =
      ['GET', 'HEAD'].includes(request.method) &&
      !url.pathname.startsWith('/api/') &&
      prefersMarkdown(request.headers.get('Accept'))

    // `/about` and `/about/` are the same page; `/llms.txt` is a file, not a page.
    const page = url.pathname.endsWith('/')
      ? url.pathname
      : !url.pathname.split('/').pop()?.includes('.') && `${url.pathname}/`
    if (markdown && page) {
      const twin = await env.ASSETS.fetch(new URL(`${page}index.md`, url), {
        method: request.method,
      })
      if (twin.ok) return varyOnAccept(twin, { 'Content-Type': markdownType })
    }

    const response = await handle(request, env, ctx)
    if (markdown && response.status === 404) {
      const notFound = await env.ASSETS.fetch(new URL('/404.md', url), {
        method: request.method,
      })
      if (notFound.ok)
        return varyOnAccept(
          new Response(notFound.body, {
            status: 404,
            headers: notFound.headers,
          }),
          { 'Content-Type': markdownType }
        )
    }
    const type = response.headers.get('Content-Type') ?? ''
    return type.startsWith('text/html') ? varyOnAccept(response) : response
  },
} satisfies ExportedHandler<Env>
