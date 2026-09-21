export {}
type AgentSubmitEvent = SubmitEvent & {
  agentInvoked?: boolean
  respondWith?: (response: Promise<unknown>) => void
}
interface Turnstile {
  render(
    container: HTMLElement,
    options: {
      sitekey: string
      action: string
      language: string
      size: 'normal' | 'compact'
      callback: (token: string) => void
      'expired-callback': () => void
      'error-callback': () => void
    }
  ): string
  reset(id: string): void
  remove(id: string): void
}
declare global {
  interface Window {
    turnstile?: Turnstile
    ivsTurnstileReady?: () => void
  }
}
let loader: Promise<Turnstile> | undefined
function loadTurnstile(): Promise<Turnstile> {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  if (loader) return loader
  loader = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    const timeout = window.setTimeout(() => {
      script.remove()
      loader = undefined
      reject(new Error('Turnstile timeout'))
    }, 15000)
    window.ivsTurnstileReady = () => {
      window.clearTimeout(timeout)
      resolve(window.turnstile!)
    }
    script.src =
      'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=ivsTurnstileReady'
    script.async = true
    script.onerror = () => {
      window.clearTimeout(timeout)
      script.remove()
      loader = undefined
      reject(new Error('Turnstile unavailable'))
    }
    document.head.appendChild(script)
  })
  return loader
}
let cleanup: (() => void) | undefined
async function initialize() {
  cleanup?.()
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]')
  if (!form) return
  const lang = form.dataset.locale === 'en' ? 'en' : 'pt'
  // Astro supplies only this form's localized messages from ui.ts.
  const messages = {
    sending: form.dataset.messageSending!,
    error: form.dataset.messageError!,
    token: form.dataset.messageToken!,
    rate: form.dataset.messageRate!,
  }
  const error = form.querySelector<HTMLElement>('[data-form-error]')!
  const errorMessage = form.querySelector<HTMLElement>(
    '[data-form-error-message]'
  )!
  const errorEmail = form.querySelector<HTMLElement>('[data-form-error-email]')!
  const button = form.querySelector<HTMLButtonElement>('button[type=submit]')!
  const label = button.textContent
  const success = document.getElementById('form-success')!
  const controller = new AbortController()
  let token = ''
  let widget: string | undefined
  let busy = false
  let sent = false
  function showError(message: string) {
    errorMessage.textContent = message
    if (message === messages.error) errorEmail.classList.remove('hidden')
    else errorEmail.classList.add('hidden')
    error.classList.remove('hidden')
    error.focus()
  }
  cleanup = () => {
    controller.abort()
    if (widget !== undefined) window.turnstile?.remove(widget)
  }
  const submit = async (agentInvoked: boolean) => {
    if (sent) return { ok: false, code: 'already_sent' }
    if (busy) return { ok: false, code: 'busy' }
    if (!form.reportValidity()) return { ok: false, code: 'invalid_fields' }
    if (!token) {
      showError(messages.token)
      return {
        ok: false,
        code: 'security_check_required',
        message: messages.token,
      }
    }
    busy = true
    button.disabled = true
    button.textContent = messages.sending
    error.classList.add('hidden')
    try {
      const fields = Object.fromEntries(new FormData(form))
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...fields,
          privacy: fields.privacy === 'on',
          locale: lang,
          token,
        }),
        signal: AbortSignal.any([
          controller.signal,
          AbortSignal.timeout(20000),
        ]),
      })
      const result = (await response.json()) as {
        ok?: boolean
        code?: string
        requestId?: string
      }
      if (response.ok && result.ok === true) {
        sent = true
        // Reset cancels an active declarative WebMCP invocation.
        if (!agentInvoked) form.reset()
        form.hidden = true
        success.classList.remove('hidden')
        success.focus()
        return { ok: true, code: 'sent', requestId: result.requestId }
      } else {
        const message =
          response.status === 429
            ? messages.rate
            : response.status === 403
              ? messages.token
              : messages.error
        showError(message)
        return { ok: false, code: result.code ?? 'submission_failed', message }
      }
    } catch {
      if (!controller.signal.aborted) showError(messages.error)
      return { ok: false, code: 'submission_unknown', message: messages.error }
    } finally {
      token = ''
      if (!controller.signal.aborted && widget !== undefined)
        window.turnstile?.reset(widget)
      busy = false
      button.disabled = false
      button.textContent = label
    }
  }
  form.addEventListener(
    'submit',
    (event: AgentSubmitEvent) => {
      event.preventDefault()
      const result = submit(event.agentInvoked === true)
      if (event.agentInvoked && typeof event.respondWith === 'function')
        event.respondWith(result)
    },
    { signal: controller.signal }
  )
  try {
    const turnstile = await loadTurnstile()
    if (controller.signal.aborted) return
    const container = form.querySelector<HTMLElement>('[data-turnstile]')!
    widget = turnstile.render(container, {
      sitekey: form.dataset.sitekey!,
      action: 'contact',
      language: lang,
      size: container.clientWidth < 300 ? 'compact' : 'normal',
      callback: (value) => {
        token = value
      },
      'expired-callback': () => {
        token = ''
      },
      'error-callback': () => {
        token = ''
        showError(messages.error)
      },
    })
  } catch {
    if (!controller.signal.aborted) showError(messages.error)
  }
}
document.addEventListener('astro:page-load', () => {
  void initialize()
})
document.addEventListener('astro:before-swap', () => {
  cleanup?.()
  cleanup = undefined
})
