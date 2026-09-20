import { contactEmail, validateContact } from './contact.ts'

type ContactBindings = Pick<
  Env,
  | 'EMAIL'
  | 'CONTACT_LIMITER'
  | 'CONTACT_ENV'
  | 'CONTACT_ORIGIN'
  | 'TURNSTILE_SECRET_KEY'
>

class PayloadTooLarge extends Error {}
async function readBody(request: Request) {
  const limit = 64 * 1024
  if (Number(request.headers.get('content-length')) > limit)
    throw new PayloadTooLarge()
  const reader = request.body?.getReader()
  if (!reader) return null
  let size = 0
  const chunks: Uint8Array[] = []
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > limit) {
        await reader.cancel()
        throw new PayloadTooLarge()
      }
      chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }
  const bytes = new Uint8Array(size)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.length
  }
  return JSON.parse(new TextDecoder().decode(bytes))
}

export async function handleContact(
  request: Request,
  env: ContactBindings,
  verifyFetch: typeof fetch = fetch
) {
  const requestId = crypto.randomUUID()
  function reply(
    status: number,
    code: string,
    extra: Record<string, string> = {}
  ) {
    console.info(JSON.stringify({ event: 'contact', requestId, code, status }))
    return Response.json(
      { ok: status === 200, code, requestId },
      { status, headers: { 'Cache-Control': 'no-store', ...extra } }
    )
  }
  if (request.method !== 'POST')
    return reply(405, 'method_not_allowed', { Allow: 'POST' })
  const url = new URL(request.url)
  if (
    request.headers.get('origin') !== url.origin ||
    (url.origin !== env.CONTACT_ORIGIN &&
      !['localhost', '127.0.0.1'].includes(url.hostname))
  )
    return reply(403, 'origin_rejected')
  if (
    request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !==
    'application/json'
  )
    return reply(415, 'unsupported_content_type')
  try {
    const ip = request.headers.get('CF-Connecting-IP') || 'local'
    if (!(await env.CONTACT_LIMITER.limit({ key: `contact:${ip}` })).success)
      return reply(429, 'rate_limited', { 'Retry-After': '60' })
    let input: unknown
    try {
      input = await readBody(request)
    } catch (error) {
      return error instanceof PayloadTooLarge
        ? reply(413, 'payload_too_large')
        : reply(400, 'invalid_request')
    }
    const data = validateContact(input)
    if (!data) return reply(400, 'invalid_fields')
    if (!env.TURNSTILE_SECRET_KEY) return reply(503, 'service_unavailable')
    const verification = await verifyFetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: env.TURNSTILE_SECRET_KEY,
          response: data.token,
          ...(ip === 'local' ? {} : { remoteip: ip }),
        }),
        signal: AbortSignal.timeout(10000),
      }
    )
    if (!verification.ok) return reply(503, 'service_unavailable')
    const result = (await verification.json()) as {
      success?: boolean
      hostname?: string
      action?: string
    }
    if (
      result.success !== true ||
      result.hostname !== url.hostname ||
      result.action !== 'contact'
    )
      return reply(403, 'verification_failed')
    const sent = await env.EMAIL.send(
      contactEmail(
        data,
        env.CONTACT_ENV !== 'production',
        new Date().toISOString()
      )
    )
    console.info(
      JSON.stringify({
        event: 'contact_email_accepted',
        requestId,
        messageId: sent.messageId,
      })
    )
    return reply(200, 'sent')
  } catch {
    return reply(503, 'service_unavailable')
  }
}
