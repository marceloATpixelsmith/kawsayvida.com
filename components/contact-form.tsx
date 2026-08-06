'use client'

import { useActionState, useEffect, useRef, useState, type FormEvent } from 'react'
import { useFormStatus } from 'react-dom'
import { Check, Send } from 'lucide-react'
import { sendContactMessage, type ContactState, type ContactCode } from '@/app/contact/actions'
import { TurnstileWidget, type TurnstileWidgetHandle } from '@/components/turnstile-widget'
import { cn } from '@/lib/utils'
import { siteConfig } from '@/lib/site'
import { useLanguage } from '@/lib/i18n/context'
import type { UIStrings } from '@/lib/i18n/ui'

const initialState: ContactState = { status: 'idle', code: '' }
const fieldLimits = {
  nameMax: 100,
  emailMax: 254,
  messageMin: 10,
  messageMax: 2000,
}

type ClientErrors = Partial<Record<'name' | 'email' | 'message' | 'challenge', string>>

// Map a server-returned code to a localized message.
function messageForCode(code: ContactCode, t: UIStrings): string {
  switch (code) {
    case 'success':
      return t.form.success
    case 'missing':
      return t.form.errors.missing
    case 'invalidEmail':
      return t.form.errors.invalidEmail
    case 'messageTooShort':
      return t.form.errors.messageTooShort
    case 'tooLong':
      return t.form.errors.tooLong
    case 'notConnected':
      return t.form.errors.notConnected.replace('{email}', siteConfig.email)
    case 'challenge':
      return t.form.errors.challenge
    case 'generic':
      return t.form.errors.generic
    default:
      return ''
  }
}

function SubmitButton({ t }: { t: UIStrings }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="group inline-flex items-center justify-center gap-2 bg-primary px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
    >
      {pending ? t.form.sending : t.form.send}
      <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </button>
  )
}

const fieldClasses =
  'w-full border border-input bg-background/40 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary'
const fieldErrorClasses = 'border-destructive focus:border-destructive'

export function ContactForm() {
  const { t, lang } = useLanguage()
  const [state, formAction] = useActionState(sendContactMessage, initialState)
  const [clientErrors, setClientErrors] = useState<ClientErrors>({})
  const [turnstileToken, setTurnstileToken] = useState('')
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  const turnstileRef = useRef<TurnstileWidgetHandle>(null)

  // A 'challenge' error means the token was rejected outright. A 'generic'
  // error means the token passed Turnstile verification (which consumes it,
  // win or lose) but something failed afterwards (e.g. the Brevo send) — the
  // token is used up either way, so both cases need a fresh widget before
  // the visitor can retry.
  useEffect(() => {
    if (state.status === 'error' && (state.code === 'challenge' || state.code === 'generic')) {
      setTurnstileToken('')
      turnstileRef.current?.reset()
    }
  }, [state])

  function validateForm(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget)
    const firstName = String(formData.get('firstName') ?? '').trim()
    const lastName = String(formData.get('lastName') ?? '').trim()
    const email = String(formData.get('email') ?? '').trim()
    const message = String(formData.get('message') ?? '').trim()
    const nextErrors: ClientErrors = {}

    if (!firstName) {
      nextErrors.name = t.form.errors.nameRequired
    } else if (firstName.length + lastName.length > fieldLimits.nameMax) {
      nextErrors.name = t.form.errors.nameTooLong
    }

    if (!email) {
      nextErrors.email = t.form.errors.emailRequired
    } else if (email.length > fieldLimits.emailMax || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      nextErrors.email = t.form.errors.invalidEmail
    }

    if (!message) {
      nextErrors.message = t.form.errors.messageRequired
    } else if (message.length < fieldLimits.messageMin) {
      nextErrors.message = t.form.errors.messageTooShort
    } else if (message.length > fieldLimits.messageMax) {
      nextErrors.message = t.form.errors.messageTooLong
    }

    if (turnstileSiteKey && !turnstileToken) {
      nextErrors.challenge = t.form.errors.challenge
    }

    setClientErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      event.preventDefault()
    }
  }

  if (state.status === 'success') {
    return (
      <div className="flex flex-col items-center border border-primary/40 bg-primary/5 p-12 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Check className="h-7 w-7" />
        </span>
        <h3 className="mt-6 font-serif text-2xl font-light text-foreground">
          {t.form.successTitle}
        </h3>
        <p className="mt-3 max-w-sm text-muted-foreground leading-relaxed">
          {messageForCode(state.code, t)}
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} onSubmit={validateForm} className="space-y-5" noValidate>
      {/* Honeypot */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <input type="hidden" name="lang" value={lang} />

      {/* Security check first, so a load failure is visible immediately. */}
      {turnstileSiteKey && (
        <div>
          <TurnstileWidget
            ref={turnstileRef}
            siteKey={turnstileSiteKey}
            action="contact"
            onVerify={setTurnstileToken}
            onExpire={() => setTurnstileToken('')}
            label={t.security.label}
            loadingText={t.security.loading}
            loadErrorText={t.security.loadError}
          />
          {clientErrors.challenge && !turnstileToken && (
            <p className="mt-2 text-sm text-destructive" role="alert">
              {clientErrors.challenge}
            </p>
          )}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="mb-2 block text-xs uppercase tracking-[0.18em] text-primary">
            {t.form.nameLabel}
          </label>
          <input
            id="firstName"
            name="firstName"
            required
            maxLength={fieldLimits.nameMax}
            aria-invalid={Boolean(clientErrors.name)}
            aria-describedby={clientErrors.name ? 'name-error' : undefined}
            className={cn(fieldClasses, clientErrors.name && fieldErrorClasses)}
            placeholder={t.form.namePlaceholder}
          />
          {clientErrors.name && (
            <p id="name-error" className="mt-2 text-sm text-destructive" role="alert">
              {clientErrors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="lastName" className="mb-2 block text-xs uppercase tracking-[0.18em] text-primary">
            {t.form.lastNameLabel}
          </label>
          <input
            id="lastName"
            name="lastName"
            maxLength={fieldLimits.nameMax}
            className={fieldClasses}
            placeholder={t.form.lastNamePlaceholder}
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block text-xs uppercase tracking-[0.18em] text-primary">
          {t.form.emailLabel}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={fieldLimits.emailMax}
          aria-invalid={Boolean(clientErrors.email)}
          aria-describedby={clientErrors.email ? 'email-error' : undefined}
          className={cn(fieldClasses, clientErrors.email && fieldErrorClasses)}
          placeholder={t.form.emailPlaceholder}
        />
        {clientErrors.email && (
          <p id="email-error" className="mt-2 text-sm text-destructive" role="alert">
            {clientErrors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-xs uppercase tracking-[0.18em] text-primary">
          {t.form.messageLabel}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          minLength={fieldLimits.messageMin}
          maxLength={fieldLimits.messageMax}
          aria-invalid={Boolean(clientErrors.message)}
          aria-describedby={clientErrors.message ? 'message-error' : undefined}
          className={cn(fieldClasses, 'resize-none', clientErrors.message && fieldErrorClasses)}
          placeholder={t.form.messagePlaceholder}
        />
        {clientErrors.message && (
          <p id="message-error" className="mt-2 text-sm text-destructive" role="alert">
            {clientErrors.message}
          </p>
        )}
      </div>

      {state.status === 'error' && (
        <p className="text-sm text-destructive" role="alert">
          {messageForCode(state.code, t)}
        </p>
      )}

      <SubmitButton t={t} />
    </form>
  )
}
