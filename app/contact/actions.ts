'use server'

import { siteConfig } from '@/lib/site'

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

type TurnstileResponse = {
  success: boolean
  'error-codes'?: string[]
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

async function verifyTurnstileToken(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY

  if (!secretKey) {
    console.log('[v0] Contact form Turnstile secret is not configured.')
    return false
  }

  const body = new URLSearchParams()
  body.append('secret', secretKey)
  body.append('response', token)

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    })

    if (!response.ok) {
      console.log('[v0] Turnstile verification request failed:', response.status)
      return false
    }

    const result = (await response.json()) as TurnstileResponse

    if (!result || typeof result.success !== 'boolean') {
      console.log('[v0] Turnstile verification returned malformed data.')
      return false
    }

    if (!result.success) {
      console.log('[v0] Turnstile verification failed:', result['error-codes'])
    }

    return result.success
  } catch (err) {
    console.log('[v0] Contact form Turnstile verification exception:', err)
    return false
  }
}

export async function sendContactMessage(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const message = String(formData.get('message') ?? '').trim()
  const notify = formData.get('notify') === 'on'
  const turnstileToken = String(formData.get('cf-turnstile-response') ?? '').trim()

  // Honeypot field — bots fill this, humans don't.
  if (String(formData.get('company') ?? '').trim().length > 0) {
    return { status: 'success', code: 'success' }
  }

  if (!name || !email || !message) {
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
      notify,
      message,
    })
    return { status: 'error', code: 'notConnected' }
  }

  try {
    const challengePassed = await verifyTurnstileToken(turnstileToken)

    if (!challengePassed) {
      return { status: 'error', code: 'challenge' }
    }

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: 'Ameyalli Contact Form',
          email: senderEmail,
        },
        to: [{ email: siteConfig.email }],
        replyTo: {
          email,
          name,
        },
        subject: `New message from ${name}${notify ? ' (wants event updates)' : ''}`,
        textContent:
          `Name: ${name}\n` +
          `Email: ${email}\n` +
          `Wants event notifications: ${notify ? 'Yes' : 'No'}\n\n` +
          `${message}\n`,
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
