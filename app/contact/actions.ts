'use server'

import { siteConfig } from '@/lib/site'
import { verifyTurnstileToken } from '@/lib/turnstile'
import { renderEmailShell, renderRows, renderTextRows } from '@/lib/email-template'
import { normalizeLang } from '@/lib/i18n/config'
import { getUI } from '@/lib/i18n/ui'

// The UI is bilingual, so the action returns a stable `code` instead of a
// hard-coded sentence. The client (contact-form.tsx) maps the code to the
// message in the visitor's active language.
export type ContactCode =
  | 'success'
  | 'missing'
  | 'invalidEmail'
  | 'messageTooShort'
  | 'tooLong'
  | 'notConnected'
  | 'challenge'
  | 'generic'
  | ''

export type ContactState = {
  status: 'idle' | 'success' | 'error'
  code: ContactCode
}

type BrevoError = {
  code?: string
  message?: string
}

const CONTACT_LIMITS = {
  nameMax: 100,
  emailMax: 254,
  messageMin: 10,
  messageMax: 2000,
}

function isValidEmail(email: string): boolean {
  return email.length <= CONTACT_LIMITS.emailMax && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)
}

export async function sendContactMessage(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const firstName = String(formData.get('firstName') ?? '').trim()
  const lastName = String(formData.get('lastName') ?? '').trim()
  const name = [firstName, lastName].filter(Boolean).join(' ')
  const email = String(formData.get('email') ?? '').trim()
  const message = String(formData.get('message') ?? '').trim()
  const turnstileToken = String(formData.get('cf-turnstile-response') ?? '').trim()
  const lang = normalizeLang(String(formData.get('lang') ?? ''))
  const t = getUI(lang)

  // Honeypot field — bots fill this, humans don't.
  if (String(formData.get('company') ?? '').trim().length > 0) {
    return { status: 'success', code: 'success' }
  }

  if (!firstName || !email || !message) {
    return { status: 'error', code: 'missing' }
  }
  if (name.length > CONTACT_LIMITS.nameMax || message.length > CONTACT_LIMITS.messageMax) {
    return { status: 'error', code: 'tooLong' }
  }
  if (!isValidEmail(email)) {
    return { status: 'error', code: 'invalidEmail' }
  }
  if (message.length < CONTACT_LIMITS.messageMin) {
    return { status: 'error', code: 'messageTooShort' }
  }

  const apiKey = process.env.BREVO_API_KEY
  const senderEmail = process.env.BREVO_FROM_EMAIL
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY

  if (!turnstileSecret) {
    console.log('[v0] Contact form Turnstile secret (TURNSTILE_SECRET_KEY) is not configured on the server.')
    return { status: 'error', code: 'challenge' }
  }
  if (!turnstileToken) {
    console.log('[v0] Contact form submission missing a Turnstile token.')
    return { status: 'error', code: 'challenge' }
  }

  if (!apiKey || !senderEmail) {
    console.log('[v0] Contact form submission (Brevo env vars not set):', {
      hasBrevoApiKey: Boolean(apiKey),
      hasBrevoSenderEmail: Boolean(senderEmail),
      name,
      email,
      message,
    })
    return { status: 'error', code: 'notConnected' }
  }

  try {
    const challengePassed = await verifyTurnstileToken(turnstileToken)

    if (!challengePassed) {
      return { status: 'error', code: 'challenge' }
    }

    const rows = [
      { label: t.form.nameLabel, value: name },
      { label: t.form.emailLabel, value: email },
      { label: t.form.messageLabel, value: message },
    ]
    const bodyHtml = renderRows(rows)
    const htmlContent = renderEmailShell({
      preheader: message.slice(0, 140),
      heading: t.form.emailHeading,
      bodyHtml,
      footerText: `kawsayvida.com — ${lang.toUpperCase()}`,
    })
    const textContent = renderTextRows(rows)

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: 'kawsayvida.com Contact Form',
          email: senderEmail,
        },
        to: [...siteConfig.notificationEmails.map((email) => ({ email })), { email: siteConfig.email }],
        replyTo: {
          email,
          name,
        },
        subject: t.form.emailSubject.replace('{name}', name),
        htmlContent,
        textContent,
      }),
    })

    if (!response.ok) {
      const error = (await response.json().catch(() => ({}))) as BrevoError
      console.log('[v0] Brevo error:', response.status, error)
      return { status: 'error', code: 'generic' }
    }

    return { status: 'success', code: 'success' }
  } catch (err) {
    console.log('[v0] Contact send exception:', err)
    return { status: 'error', code: 'generic' }
  }
}
