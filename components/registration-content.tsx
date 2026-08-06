'use client'

import type { ReactNode } from 'react'
import { useActionState, useEffect, useRef, useState, type FormEvent } from 'react'
import { useFormStatus } from 'react-dom'
import { Check, Send } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { TurnstileWidget, type TurnstileWidgetHandle } from '@/components/turnstile-widget'
import { sendRegistration, type RegistrationState, type RegistrationCode } from '@/app/retreats/registration/actions'
import { cn } from '@/lib/utils'
import { siteConfig } from '@/lib/site'
import { useLanguage } from '@/lib/i18n/context'
import type { UIStrings } from '@/lib/i18n/ui'
import registrationDates from '@/data/registration-dates.json'

const initialState: RegistrationState = { status: 'idle', code: '' }

type RegistrationDate = {
  id: string
  startDate: string
  endDate: string
  type: 'retreat' | 'ceremony'
  location: {
    en: string
    es: string
  }
  label: {
    en: string
    es: string
  }
}

//REGISTRATION OPTIONS REMAIN VISIBLE THROUGH THE FULL DAY AFTER AN EVENT ENDS.
function isRegistrationDateVisible(event: RegistrationDate, now = new Date()): boolean {
  const endDateParts = event.endDate.split('-').map(Number)

  if (endDateParts.length !== 3 || endDateParts.some((part) => !Number.isInteger(part))) {
    return false
  }

  const [year, month, day] = endDateParts
  const hideAt = Date.UTC(year, month - 1, day + 2)

  return now.getTime() < hideAt
}


const LIMITS = {
  textMax: 200,
  longTextMax: 4000,
  emailMax: 254,
  minAge: 18,
}

type FieldKey =
  | 'retreatDate'
  | 'paternalLastName'
  | 'names'
  | 'dob'
  | 'placeOfBirth'
  | 'address'
  | 'phone'
  | 'email'
  | 'maritalStatus'
  | 'occupation'
  | 'emergencyName'
  | 'emergencyPhone'
  | 'substanceUse'
  | 'difficultyStopping'
  | 'readDeclaration'
  | 'signatureName'
  | 'challenge'

type ClientErrors = Partial<Record<FieldKey, string>>

function messageForCode(code: RegistrationCode, t: UIStrings): string {
  const errors = t.registration.formErrors
  switch (code) {
    case 'success':
      return errors.success
    case 'missing':
      return errors.missing
    case 'invalidEmail':
      return errors.invalidEmail
    case 'invalidDob':
      return errors.invalidDob
    case 'underage':
      return errors.underage
    case 'declarationRequired':
      return errors.declarationRequired
    case 'notConnected':
      return errors.notConnected.replace('{email}', siteConfig.email)
    case 'challenge':
      return errors.challenge
    case 'generic':
      return errors.generic
    default:
      return ''
  }
}

const fieldClasses =
  'w-full border border-input bg-background/40 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary'
const fieldErrorClasses = 'border-destructive focus:border-destructive'

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  children: ReactNode
}) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-primary">
        {label}
        {required ? <span className="text-muted-foreground"> *</span> : null}
      </label>
      {children}
      {error && (
        <p className="mt-2 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

function TextInput(props: {
  name: string
  required?: boolean
  type?: string
  error?: string
  maxLength?: number
}) {
  return (
    <input
      type={props.type ?? 'text'}
      name={props.name}
      required={props.required}
      maxLength={props.maxLength}
      aria-invalid={Boolean(props.error)}
      className={cn(fieldClasses, props.error && fieldErrorClasses)}
    />
  )
}

function TextArea({ name, rows = 3 }: { name: string; rows?: number }) {
  return <textarea name={name} rows={rows} maxLength={LIMITS.longTextMax} className={`${fieldClasses} resize-none`} />
}

function RadioRow({ name, options }: { name: string; options: string[] }) {
  return (
    <div className="flex flex-wrap gap-6">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-2 text-sm text-foreground/85">
          <input type="radio" name={name} value={opt} className="h-4 w-4 accent-primary" />
          {opt}
        </label>
      ))}
    </div>
  )
}

// Yes/No control with stable machine values ('yes' | 'no'), independent of
// the visible (localized) label — used wherever the server checks the value.
function YesNoRadio({ name, yesLabel, noLabel }: { name: string; yesLabel: string; noLabel: string }) {
  return (
    <div className="flex flex-wrap gap-6">
      <label className="flex items-center gap-2 text-sm text-foreground/85">
        <input type="radio" name={name} value="yes" className="h-4 w-4 accent-primary" />
        {yesLabel}
      </label>
      <label className="flex items-center gap-2 text-sm text-foreground/85">
        <input type="radio" name={name} value="no" className="h-4 w-4 accent-primary" />
        {noLabel}
      </label>
    </div>
  )
}

function CheckboxGrid({ name, options }: { name: string; options: string[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-2 text-sm text-foreground/85">
          <input type="checkbox" name={`${name}[]`} value={opt} className="h-4 w-4 accent-primary" />
          {opt}
        </label>
      ))}
    </div>
  )
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-serif text-3xl font-light leading-tight text-balance sm:text-4xl">
      {children}
    </h2>
  )
}

function SubmitButton({ label, sending }: { label: string; sending: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 bg-primary px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
    >
      {pending ? sending : label}
      <Send className="h-4 w-4" />
    </button>
  )
}

const isValidEmail = (email: string) =>
  email.length <= LIMITS.emailMax && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)

// Mirrors the server's ageFromDob() check in app/retreats/registration/actions.ts.
function ageFromDob(dob: string): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dob)
  if (!match) return null
  const [, y, m, d] = match
  const date = new Date(Number(y), Number(m) - 1, Number(d))
  if (date.getFullYear() !== Number(y) || date.getMonth() !== Number(m) - 1 || date.getDate() !== Number(d)) {
    return null
  }
  const now = new Date()
  if (date.getTime() > now.getTime()) return null
  let age = now.getFullYear() - date.getFullYear()
  const hadBirthdayThisYear =
    now.getMonth() > date.getMonth() || (now.getMonth() === date.getMonth() && now.getDate() >= date.getDate())
  if (!hadBirthdayThisYear) age -= 1
  return age
}

export function RegistrationContent() {
  const { t, lang } = useLanguage()
  const r = t.registration
  const [state, formAction] = useActionState(sendRegistration, initialState)
  const [clientErrors, setClientErrors] = useState<ClientErrors>({})
  const [turnstileToken, setTurnstileToken] = useState('')
  const [selectedEventId, setSelectedEventId] = useState('')
  const visibleRegistrationDates = (registrationDates as RegistrationDate[])
    .filter((event) => isRegistrationDateVisible(event))
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  const turnstileRef = useRef<TurnstileWidgetHandle>(null)

  //VALIDATE THE URL PARAMETER AGAINST THE CURRENTLY VISIBLE JSON EVENTS.
  useEffect(() => {
    const requestedEventId = new URLSearchParams(window.location.search).get('event') ?? ''
    const isValidEvent = visibleRegistrationDates.some((event) => event.id === requestedEventId)

    setSelectedEventId(isValidEvent ? requestedEventId : '')
  }, [])

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
    const fd = new FormData(event.currentTarget)
    const get = (key: string) => String(fd.get(key) ?? '').trim()
    const errors: ClientErrors = {}
    const fe = r.formErrors

    if (!get('retreatDate')) errors.retreatDate = fe.fieldRequired
    if (!get('paternalLastName')) errors.paternalLastName = fe.fieldRequired
    if (!get('names')) errors.names = fe.fieldRequired

    const dob = get('dob')
    if (!dob) {
      errors.dob = fe.fieldRequired
    } else {
      const age = ageFromDob(dob)
      if (age === null) errors.dob = fe.invalidDob
      else if (age < LIMITS.minAge) errors.dob = fe.underage
    }

    if (!get('placeOfBirth')) errors.placeOfBirth = fe.fieldRequired
    if (!get('address')) errors.address = fe.fieldRequired
    if (!get('phone')) errors.phone = fe.fieldRequired

    const email = get('email')
    if (email && !isValidEmail(email)) errors.email = fe.invalidEmail

    if (!get('maritalStatus')) errors.maritalStatus = fe.fieldRequired
    if (!get('occupation')) errors.occupation = fe.fieldRequired
    if (!get('emergencyName')) errors.emergencyName = fe.fieldRequired
    if (!get('emergencyPhone')) errors.emergencyPhone = fe.fieldRequired
    if (!get('substanceUse')) errors.substanceUse = fe.fieldRequired
    if (!get('difficultyStopping')) errors.difficultyStopping = fe.fieldRequired

    const readDeclaration = get('readDeclaration')
    if (!readDeclaration) errors.readDeclaration = fe.fieldRequired
    else if (readDeclaration !== 'yes') errors.readDeclaration = fe.declarationRequired

    if (!get('signatureName')) errors.signatureName = fe.fieldRequired

    if (turnstileSiteKey && !turnstileToken) errors.challenge = fe.challenge

    setClientErrors(errors)

    if (Object.keys(errors).length > 0) {
      event.preventDefault()
      // Bring the visitor to the first invalid field.
      const firstKey = Object.keys(errors)[0]
      if (firstKey && firstKey !== 'challenge') {
        document.querySelector<HTMLElement>(`[name="${firstKey}"]`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }
    }
  }

  if (state.status === 'success') {
    return (
      <>
        <PageHeader
          eyebrow={t.pageHeaders.registration.eyebrow}
          title={t.pageHeaders.registration.title}
          image="/images/registration-header.jpg"
          alt={t.about.headerAlt}
        />
        <section className="bg-background py-20 lg:py-28">
          <div className="mx-auto max-w-xl px-6 lg:px-10">
            <div className="flex flex-col items-center border border-primary/40 bg-primary/5 p-12 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Check className="h-7 w-7" />
              </span>
              <h3 className="mt-6 font-serif text-2xl font-light text-foreground">
                {r.formErrors.successTitle}
              </h3>
              <p className="mt-3 max-w-sm text-muted-foreground leading-relaxed">
                {messageForCode(state.code, t)}
              </p>
            </div>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <PageHeader
        eyebrow={t.pageHeaders.registration.eyebrow}
        title={t.pageHeaders.registration.title}
        image="/images/registration-header.jpg"
        alt={t.about.headerAlt}
      />

      {/* Instructions */}
      <section className="bg-background pb-16 pt-10 lg:py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <p className="mb-4 text-xs uppercase tracking-luxe text-primary">{r.instructionsTitle}</p>
          <SectionTitle>{r.contraindicationsTitle}</SectionTitle>
          <ul className="mt-6 space-y-4">
            {r.contraindications.map((line, i) => (
              <li key={i} className="flex gap-3 text-muted-foreground leading-relaxed">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{line}</span>
              </li>
            ))}
          </ul>

          <p className="mt-10 text-xs uppercase tracking-[0.18em] text-primary">{r.noteTitle}</p>
          <ul className="mt-4 space-y-4">
            {r.notes.map((line, i) => (
              <li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/60" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Form */}
      <section className="border-t border-border/50 bg-card py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <SectionTitle>{r.formTitle}</SectionTitle>

          <form action={formAction} onSubmit={validateForm} className="mt-10 space-y-14" noValidate>
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

            {/* Security check first, so a load failure is visible immediately
                — before the visitor invests time filling out this long form. */}
            {turnstileSiteKey && (
              <div>
                <TurnstileWidget
                  ref={turnstileRef}
                  siteKey={turnstileSiteKey}
                  action="registration"
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

            {/* Date of retreat */}
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.18em] text-primary">
                {r.dateOfRetreat} <span className="text-muted-foreground">*</span>
              </p>
              <div
                className={cn(
                  'space-y-3 border bg-background/40 p-6',
                  clientErrors.retreatDate ? 'border-destructive' : 'border-border/60',
                )}
              >
                {visibleRegistrationDates.map((event) => {
                  const label = event.label[lang]

                  return (
                    <label key={event.id} className="flex items-center gap-3 text-sm text-foreground/85">
                      <input
                        type="radio"
                        name="retreatDate"
                        value={label}
                        checked={selectedEventId === event.id}
                        onChange={() => setSelectedEventId(event.id)}
                        className="h-4 w-4 accent-primary"
                      />
                      {label}
                    </label>
                  )
                })}
              </div>
              {clientErrors.retreatDate && (
                <p className="text-sm text-destructive" role="alert">
                  {clientErrors.retreatDate}
                </p>
              )}
            </div>

            {/* Personal info */}
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.18em] text-primary">{r.personalInfoTitle}</p>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label={r.fields.paternalLastName} required error={clientErrors.paternalLastName}>
                  <TextInput name="paternalLastName" required maxLength={LIMITS.textMax} error={clientErrors.paternalLastName} />
                </Field>
                <Field label={r.fields.maternalLastName}>
                  <TextInput name="maternalLastName" maxLength={LIMITS.textMax} />
                </Field>
                <Field label={r.fields.names} required error={clientErrors.names}>
                  <TextInput name="names" required maxLength={LIMITS.textMax} error={clientErrors.names} />
                </Field>
                <Field label={r.fields.dob} required error={clientErrors.dob}>
                  <TextInput name="dob" type="date" required error={clientErrors.dob} />
                </Field>
                <Field label={r.fields.placeOfBirth} required error={clientErrors.placeOfBirth}>
                  <TextInput name="placeOfBirth" required maxLength={LIMITS.textMax} error={clientErrors.placeOfBirth} />
                </Field>
                <Field label={r.fields.phone} required error={clientErrors.phone}>
                  <TextInput name="phone" type="tel" required maxLength={LIMITS.textMax} error={clientErrors.phone} />
                </Field>
                <Field label={r.fields.email} error={clientErrors.email}>
                  <TextInput name="email" type="email" maxLength={LIMITS.emailMax} error={clientErrors.email} />
                </Field>
                <Field label={r.fields.passport}>
                  <TextInput name="passport" maxLength={LIMITS.textMax} />
                </Field>
                <Field label={r.fields.occupation} required error={clientErrors.occupation}>
                  <TextInput name="occupation" required maxLength={LIMITS.textMax} error={clientErrors.occupation} />
                </Field>
              </div>
              <Field label={r.fields.address} required error={clientErrors.address}>
                <TextInput name="address" required maxLength={LIMITS.longTextMax} error={clientErrors.address} />
              </Field>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-primary">
                  {r.fields.maritalStatus} <span className="text-muted-foreground">*</span>
                </label>
                <RadioRow
                  name="maritalStatus"
                  options={[r.fields.married, r.fields.single, r.fields.divorced]}
                />
                {clientErrors.maritalStatus && (
                  <p className="mt-2 text-sm text-destructive" role="alert">
                    {clientErrors.maritalStatus}
                  </p>
                )}
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label={r.fields.emergencyName} required error={clientErrors.emergencyName}>
                  <TextInput name="emergencyName" required maxLength={LIMITS.textMax} error={clientErrors.emergencyName} />
                </Field>
                <Field label={r.fields.emergencyPhone} required error={clientErrors.emergencyPhone}>
                  <TextInput name="emergencyPhone" type="tel" required maxLength={LIMITS.textMax} error={clientErrors.emergencyPhone} />
                </Field>
              </div>
            </div>

            {/* Health */}
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.18em] text-primary">{r.healthTitle}</p>
              <Field label={r.healthFields.currentIllness}>
                <TextArea name="currentIllness" />
              </Field>
              <Field label={r.healthFields.accidents}>
                <TextArea name="accidents" />
              </Field>
              <Field label={r.healthFields.recentSurgeries}>
                <TextArea name="recentSurgeries" />
              </Field>

              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.18em] text-primary">{r.conditionsLabel}</p>
                <CheckboxGrid name="conditions" options={r.conditions} />
              </div>

              <Field label={r.healthQuestions.psychiatricDisorders}>
                <TextInput name="psychiatricDisorders" maxLength={LIMITS.textMax} />
              </Field>
              <Field label={r.healthQuestions.allergies}>
                <TextInput name="allergies" maxLength={LIMITS.textMax} />
              </Field>
              <Field label={r.healthQuestions.otherDiseases}>
                <TextInput name="otherDiseases" maxLength={LIMITS.textMax} />
              </Field>
              <Field label={r.healthQuestions.currentTreatment}>
                <TextInput name="currentTreatment" maxLength={LIMITS.textMax} />
              </Field>
              <Field label={r.healthQuestions.medications}>
                <TextInput name="medications" maxLength={LIMITS.textMax} />
              </Field>

              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.18em] text-primary">
                  {r.healthQuestions.substanceUse} <span className="text-muted-foreground">*</span>
                </p>
                <RadioRow name="substanceUse" options={[r.healthQuestions.yes, r.healthQuestions.no]} />
                {clientErrors.substanceUse && (
                  <p className="mt-2 text-sm text-destructive" role="alert">
                    {clientErrors.substanceUse}
                  </p>
                )}
              </div>
              <Field label={r.healthQuestions.substanceFrequency}>
                <TextInput name="substanceFrequency" maxLength={LIMITS.textMax} />
              </Field>
              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.18em] text-primary">
                  {r.healthQuestions.difficultyStopping} <span className="text-muted-foreground">*</span>
                </p>
                <RadioRow
                  name="difficultyStopping"
                  options={[r.healthQuestions.yes, r.healthQuestions.no]}
                />
                {clientErrors.difficultyStopping && (
                  <p className="mt-2 text-sm text-destructive" role="alert">
                    {clientErrors.difficultyStopping}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.18em] text-primary">{r.experiencesTitle}</p>
                <CheckboxGrid name="experiences" options={r.experiences.slice(0, -1)} />
                <Field label={r.experiences[r.experiences.length - 1]}>
                  <TextInput name="experienceFrequency" maxLength={LIMITS.textMax} />
                </Field>
              </div>
            </div>

            {/* Experiences & intentions */}
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.18em] text-primary">{r.intentionsTitle}</p>
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.18em] text-primary">{r.ritualQuestion}</p>
                <CheckboxGrid name="ritual" options={r.ritualOptions} />
              </div>
              <Field label={r.ritualOtherLabel}>
                <TextInput name="ritualOther" maxLength={LIMITS.textMax} />
              </Field>
              <Field label={r.experienceQuestions.howWasIt}>
                <TextArea name="ritualExperience" />
              </Field>
              <Field label={r.experienceQuestions.spiritualExperience}>
                <TextArea name="spiritualExperience" />
              </Field>
              <Field label={r.experienceQuestions.intentions}>
                <TextArea name="intentions" />
              </Field>
            </div>

            {/* Declaration */}
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.18em] text-primary">{r.declarationTitle}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{r.declarationIntro}</p>
              <ol className="space-y-4">
                {r.declarationItems.map((item, i) => (
                  <li key={i} className="flex gap-4 text-sm text-muted-foreground leading-relaxed">
                    <span className="shrink-0 font-serif text-primary">{i + 1}.</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>

              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.18em] text-primary">
                  {r.readDeclaration} <span className="text-muted-foreground">*</span>
                </p>
                <YesNoRadio
                  name="readDeclaration"
                  yesLabel={r.healthQuestions.yes}
                  noLabel={r.healthQuestions.no}
                />
                {clientErrors.readDeclaration && (
                  <p className="mt-2 text-sm text-destructive" role="alert">
                    {clientErrors.readDeclaration}
                  </p>
                )}
              </div>

              <Field label={r.fullName} required error={clientErrors.signatureName}>
                <TextInput name="signatureName" required maxLength={LIMITS.textMax} error={clientErrors.signatureName} />
              </Field>
              <p className="text-sm text-muted-foreground">{r.signatureNote}</p>
            </div>

            {state.status === 'error' && (
              <p className="text-sm text-destructive" role="alert">
                {messageForCode(state.code, t)}
              </p>
            )}

            <div className="border-t border-border/50 pt-8">
              <SubmitButton label={r.submit} sending={r.sending} />
            </div>
          </form>
        </div>
      </section>
    </>
  )
}
