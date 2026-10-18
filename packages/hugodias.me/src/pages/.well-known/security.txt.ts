import type { APIRoute } from 'astro'
import { SITE } from '../../consts'

// RFC 9116 requires an expiry under a year away; every deploy renews it.
const expires = new Date(Date.now() + 360 * 24 * 60 * 60 * 1000)

const securityTxt = `
Contact: mailto:${SITE.EMAIL}
Expires: ${expires.toISOString().replace(/\.\d{3}Z$/, 'Z')}
Preferred-Languages: en, pt
Canonical: ${new URL('.well-known/security.txt', import.meta.env.SITE).href}
`.trimStart()

export const GET: APIRoute = () => {
  return new Response(securityTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
