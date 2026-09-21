import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { stripTypeScriptTypes } from 'node:module'
import { runInNewContext } from 'node:vm'
import { test } from 'node:test'

const source = stripTypeScriptTypes(
  await readFile(new URL('../src/contact-form.ts', import.meta.url), 'utf8')
).replace(/export\s*\{\};?/, '')

async function setup() {
  const listeners = new Map<string, () => void>()
  let onSubmit: (event: object) => void
  let turnstile: { callback(token: string): void; 'expired-callback'(): void }
  let valid = true
  let requests = 0
  let resets = 0
  let status = 200
  const element = {
    classList: { add() {}, remove() {} },
    focus() {},
    textContent: 'Send',
    clientWidth: 400,
  }
  const form = {
    dataset: {
      locale: 'en',
      messageSending: 'Sending',
      messageError: 'Failed',
      messageToken: 'Security check required',
      messageRate: 'Rate limited',
    },
    querySelector: () => element,
    reportValidity: () => valid,
    reset: () => {
      resets++
    },
    addEventListener: (_: string, callback: typeof onSubmit) => {
      onSubmit = callback
    },
  }
  runInNewContext(source, {
    document: {
      querySelector: () => form,
      getElementById: () => element,
      addEventListener: (name: string, callback: () => void) =>
        listeners.set(name, callback),
    },
    window: {
      turnstile: {
        render: (_: object, options: typeof turnstile) => {
          turnstile = options
          return 'widget'
        },
        reset() {},
        remove() {},
      },
    },
    AbortController,
    AbortSignal,
    FormData: class {
      *[Symbol.iterator]() {
        yield ['privacy', 'on']
      }
    },
    fetch: async () => {
      requests++
      return {
        ok: status === 200,
        status,
        json: async () => ({
          ok: status === 200,
          code: status === 200 ? 'sent' : 'rate_limited',
          requestId: 'test-id',
        }),
      }
    },
  })
  listeners.get('astro:page-load')!()
  await Promise.resolve()
  return {
    token: () => turnstile.callback('test-token'),
    expire: () => turnstile['expired-callback'](),
    invalid: () => {
      valid = false
    },
    rateLimit: () => {
      status = 429
    },
    requests: () => requests,
    resets: () => resets,
    submit: () => {
      let result: Promise<{ ok: boolean; code: string; requestId?: string }>
      let prevented = false
      onSubmit({
        agentInvoked: true,
        preventDefault() {
          prevented = true
        },
        respondWith(value: typeof result) {
          assert(prevented)
          result = value
        },
      })
      assert(result!)
      return result!
    },
  }
}

test('WebMCP returns the actual success without resetting/cancelling the invocation or sending twice', async () => {
  const app = await setup()
  app.token()
  const pending = app.submit()
  assert.equal((await app.submit()).code, 'busy')
  const result = await pending
  assert.equal(result.ok, true)
  assert.equal(result.requestId, 'test-id')
  assert.equal(app.resets(), 0)
  assert.equal((await app.submit()).code, 'already_sent')
  assert.equal(app.requests(), 1)
})

test('missing/expired Turnstile tokens and invalid fields cannot submit', async () => {
  const app = await setup()
  assert.equal((await app.submit()).code, 'security_check_required')
  app.token()
  app.expire()
  assert.equal((await app.submit()).code, 'security_check_required')
  app.token()
  app.invalid()
  assert.equal((await app.submit()).code, 'invalid_fields')
  assert.equal(app.requests(), 0)
})

test('WebMCP returns server failures and requires a fresh security token for retry', async () => {
  const app = await setup()
  app.token()
  app.rateLimit()
  const result = await app.submit()
  assert.equal(result.ok, false)
  assert.equal(result.code, 'rate_limited')
  assert.equal((await app.submit()).code, 'security_check_required')
  assert.equal(app.requests(), 1)
})
