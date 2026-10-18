import type { APIRoute } from 'astro'
import { vCard } from '../lib/vcard'

// Prerendered; public/_headers sets the deployed Content-Type.
export const GET: APIRoute = () => {
  return new Response(vCard, {
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
    },
  })
}
