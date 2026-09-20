import { ui } from '../i18n/ui.ts'

export const contactAreas = Object.keys(ui.pt['contact.form.subject.options'])
export const urgencyValues = ['normal', 'urgente', 'muito-urgente'] as const

export interface ContactSubmission {
  firstName: string
  lastName: string
  email: string
  phone: string
  area: string
  message: string
  privacy: true
  locale: 'pt' | 'en'
  urgency: (typeof urgencyValues)[number]
  token: string
}

export function validateContact(value: unknown): ContactSubmission | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const input = value as Record<string, unknown>
  const limits = {
    firstName: 100,
    lastName: 100,
    email: 254,
    phone: 50,
    message: 10000,
    token: 2048,
  }
  const fields: Record<string, string> = {}
  for (const [key, max] of Object.entries(limits)) {
    const raw = input[key] ?? (key === 'phone' ? '' : undefined)
    if (typeof raw !== 'string') return null
    const text = raw.trim()
    if ((key !== 'phone' && !text) || text.length > max) return null
    fields[key] = text
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) return null
  if (/[\r\n]/.test(fields.firstName + fields.lastName + fields.email))
    return null
  if (
    input.privacy !== true ||
    (input.locale !== 'pt' && input.locale !== 'en')
  )
    return null
  if (typeof input.area !== 'string' || !contactAreas.includes(input.area))
    return null
  const urgency = input.urgency ?? 'normal'
  if (!urgencyValues.some((value) => value === urgency)) return null
  return {
    firstName: fields.firstName,
    lastName: fields.lastName,
    email: fields.email,
    phone: fields.phone,
    message: fields.message,
    token: fields.token,
    privacy: true,
    locale: input.locale as 'pt' | 'en',
    area: input.area,
    urgency: urgency as ContactSubmission['urgency'],
  }
}

export function contactEmail(
  data: ContactSubmission,
  staging: boolean,
  timestamp: string
) {
  const text = [
    `Nome: ${data.firstName} ${data.lastName}`,
    `Email: ${data.email}`,
    `Telefone: ${data.phone || '—'}`,
    `Área: ${data.area}`,
    `Urgência: ${data.urgency}`,
    `Idioma: ${data.locale}`,
    `Data: ${timestamp}`,
    'Privacidade: aceite',
    '',
    data.message,
  ].join('\n')
  const escaped = text.replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ]!
  )
  return {
    to: 'geral@ivs.legal',
    from: { email: 'website@ivs.legal', name: 'IVS Legal' },
    replyTo: data.email,
    subject: `${staging ? '[STAGING] ' : ''}Novo Pedido de Consulta — ${data.urgency}`,
    text,
    html: `<div style="white-space: pre-wrap">${escaped}</div>`,
  }
}
