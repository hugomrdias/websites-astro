import assert from 'node:assert/strict'
import { test } from 'node:test'
import { handleContact } from '../src/lib/contact-handler.ts'
import { contactEmail, validateContact } from '../src/lib/contact.ts'

const valid = {
  firstName: 'Ana',
  lastName: 'Silva',
  email: 'visitor@example.com',
  phone: '',
  area: 'direito-civil',
  message: '<script>alert("x")</script>',
  privacy: true,
  locale: 'pt',
  token: 'test-token',
}
function harness() {
  const sent: unknown[] = []
  let limited = false
  let sendFails = false
  let verifyCalls = 0
  let verification: Record<string, unknown> = {
    success: true,
    hostname: 'ivs.legal',
    action: 'contact',
  }
  let verifyFails = false
  const bindings = {
    CONTACT_ENV: 'production',
    CONTACT_ORIGIN: 'https://ivs.legal',
    TURNSTILE_SECRET_KEY: 'test-secret',
    CONTACT_LIMITER: { limit: async () => ({ success: !limited }) },
    EMAIL: {
      send: async (message: unknown) => {
        if (sendFails) throw new Error('upstream')
        sent.push(message)
        return { messageId: 'test-id' }
      },
    },
  } satisfies Parameters<typeof handleContact>[1]
  const verify: typeof fetch = async () => {
    verifyCalls++
    if (verifyFails) throw new Error('timeout')
    return Response.json(verification)
  }
  return {
    sent,
    bindings,
    verify,
    limited: () => {
      limited = true
    },
    sendFails: () => {
      sendFails = true
    },
    verifyFails: () => {
      verifyFails = true
    },
    verification: (value: Record<string, unknown>) => {
      verification = value
    },
    verifyCalls: () => verifyCalls,
    run: (
      body: unknown = valid,
      headers: Record<string, string> = {},
      method = 'POST'
    ) =>
      handleContact(
        new Request('https://ivs.legal/api/contact', {
          method,
          headers: {
            Origin: 'https://ivs.legal',
            'Content-Type': 'application/json',
            ...headers,
          },
          ...(method === 'GET' ? {} : { body: JSON.stringify(body) }),
        }),
        bindings,
        verify
      ),
  }
}
test('valid contact sends only to the configured inbox, escaping HTML and preserving Reply-To', async () => {
  const h = harness()
  const response = await h.run({
    ...valid,
    to: 'attacker@example.com',
    from: 'attacker@example.com',
  })
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('cache-control'), 'no-store')
  assert.equal(h.sent.length, 1)
  const email = contactEmail(validateContact(valid)!, false, '2026-09-20')
  assert.equal(email.to, 'geral@ivs.legal')
  assert.equal(email.from.email, 'website@ivs.legal')
  assert.equal(email.replyTo, valid.email)
  assert(!email.html.includes('<script>'))
  assert(email.text.includes('<script>'))
  assert(email.subject.endsWith('normal'))
  assert(
    contactEmail(validateContact(valid)!, true, 'date').subject.startsWith(
      '[STAGING]'
    )
  )
})
test('rejects invalid fields before verification or sending', async () => {
  for (const input of [
    null,
    [],
    { ...valid, firstName: ' ' },
    { ...valid, firstName: 'x'.repeat(101) },
    { ...valid, lastName: 'a\nb' },
    { ...valid, email: 'invalid' },
    { ...valid, phone: '1'.repeat(51) },
    { ...valid, message: 'x'.repeat(10001) },
    { ...valid, privacy: false },
    { ...valid, locale: 'es' },
    { ...valid, locale: ['pt'] },
    { ...valid, area: 'invalid' },
    { ...valid, urgency: 'now' },
    { ...valid, token: '' },
  ]) {
    const h = harness()
    assert.equal((await h.run(input)).status, 400)
    assert.equal(h.verifyCalls(), 0)
    assert.equal(h.sent.length, 0)
  }
})
test('enforces origin, content type, method, size and rate limit', async () => {
  const h = harness()
  assert.equal(
    (await h.run(valid, { Origin: 'https://attacker.example' })).status,
    403
  )
  assert.equal(
    (await h.run(valid, { 'Content-Type': 'text/plain' })).status,
    415
  )
  assert.equal((await h.run(valid, {}, 'GET')).status, 405)
  assert.equal(
    (await h.run({ ...valid, message: 'x'.repeat(65536) })).status,
    413
  )
  h.limited()
  const limited = await h.run()
  assert.equal(limited.status, 429)
  assert.equal(limited.headers.get('retry-after'), '60')
  assert.equal(h.sent.length, 0)
})
test('forged, expired, replayed, wrong-host and wrong-action tokens cannot send', async () => {
  for (const verification of [
    { success: false },
    { success: 'true', hostname: 'ivs.legal', action: 'contact' },
    { success: false, 'error-codes': ['timeout-or-duplicate'] },
    { success: true, hostname: 'attacker.example', action: 'contact' },
    { success: true, hostname: 'ivs.legal', action: 'login' },
  ]) {
    const h = harness()
    h.verification(verification)
    assert.equal((await h.run()).status, 403)
    assert.equal(h.sent.length, 0)
  }
})
test('verification and email failures return 503 without retrying or claiming success', async () => {
  const verify = harness()
  verify.verifyFails()
  assert.equal((await verify.run()).status, 503)
  assert.equal(verify.sent.length, 0)
  const send = harness()
  send.sendFails()
  assert.equal((await send.run()).status, 503)
  assert.equal(send.verifyCalls(), 1)
})
test('streamed oversized body is rejected even without Content-Length', async () => {
  const h = harness()
  const request = new Request('https://ivs.legal/api/contact', {
    method: 'POST',
    headers: {
      Origin: 'https://ivs.legal',
      'Content-Type': 'application/json',
    },
    body: 'x'.repeat(65537),
  })
  assert.equal((await handleContact(request, h.bindings, h.verify)).status, 413)
  assert.equal(h.verifyCalls(), 0)
})
