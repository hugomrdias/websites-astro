import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { handleContact } from '../../lib/contact-handler'

export const prerender = false
export const ALL: APIRoute = ({ request }) => handleContact(request, env)
