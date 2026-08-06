'use server'

import { siteConfig } from '@/lib/site'
import { verifyTurnstileToken } from '@/lib/turnstile'

// The UI is bilingual, so the action returns a stable `code` instead of a
// hard-coded sentence. The client (registration-content.tsx) maps the code
// to the message in the visitor's active language.
export type RegistrationCode =
  | 'success'
  | 'missing'
  | 'invalidEmail'
  | 'invalidDob'
  | 'underage'
  | 'declarationRequired'
  | 'notConnected'
  | 'challenge'
  | 'generic'
  | ''

export type RegistrationState = {
  status: 'idle' | 'success' | 'error'
  code: RegistrationCode
}

type BrevoError = {
  code?: string
  message?: string
}

const LIMITS = {
  textMax: 200,
  longTextMax: 4000,
  emailMax: 254,
  minAge: 18,
}

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? '').trim()
}

function list(formData: FormData, key: string): string[] {
  return formData
    .getAll(`${key}[]`)
    .map((v) => String(v).trim())
    .filter(Boolean)
}

function isValidEmail(email: string): boolean {
  return email.length <= LIMITS.emailMax && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)
}

// Returns the age in years for a "YYYY-MM-DD" date string, or null if the
// string isn't a valid, non-future date.
function ageFromDob(dob: string): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dob)
  if (!match) return null

  const [, y, m, d] = match
  const date = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)))
  if (
    date.getUTCFullYear() !== Number(y) ||
    date.getUTCMonth() !== Number(m) - 1 ||
    date.getUTCDate() !== Number(d)
  ) {
    return null
  }

  const now = new Date()
  if (date.getTime() > now.getTime()) return null

  let age = now.getUTCFullYear() - date.getUTCFullYear()
  const hadBirthdayThisYear =
    now.getUTCMonth() > date.getUTCMonth() ||
    (now.getUTCMonth() === date.getUTCMonth() && now.getUTCDate() >= date.getUTCDate())
  if (!hadBirthdayThisYear) age -= 1

  return age
}

function line(label: string, value: string): string {
  return value ? `${label}: ${value}\n` : ''
}

function composeEmailBody(fields: Record<string, string>, lists: Record<string, string[]>): string {
  const l = (label: string, key: string) => line(label, fields[key] ?? '')
  const a = (label: string, key: string) => (lists[key]?.length ? `${label}: ${lists[key].join(', ')}\n` : '')

  return (
    `RETREAT / DATE\n` +
    l('Retreat date', 'retreatDate') +
    `\nPERSONAL INFO\n` +
    l('Paternal last name', 'paternalLastName') +
    l('Maternal last name', 'maternalLastName') +
    l('Names', 'names') +
    l('Date of birth', 'dob') +
    l('Place of birth', 'placeOfBirth') +
    l('Address', 'address') +
    l('Phone', 'phone') +
    l('Email', 'email') +
    l('Marital status', 'maritalStatus') +
    l('Passport number', 'passport') +
    l('Occupation', 'occupation') +
    l('Emergency contact name', 'emergencyName') +
    l('Emergency contact phone', 'emergencyPhone') +
    `\nHEALTH\n` +
    l('Current or past illness', 'currentIllness') +
    l('Accidents', 'accidents') +
    l('Recent surgeries', 'recentSurgeries') +
    a('Conditions', 'conditions') +
    l('Psychiatric disorders', 'psychiatricDisorders') +
    l('Allergies', 'allergies') +
    l('Other diseases', 'otherDiseases') +
    l('Current treatment', 'currentTreatment') +
    l('Medications', 'medications') +
    l('Alcohol/drug use', 'substanceUse') +
    l('Frequency', 'substanceFrequency') +
    l('Difficulty stopping use', 'difficultyStopping') +
    a('Experiences (suicidal thoughts, panic attacks, etc.)', 'experiences') +
    l('Frequency of above experiences', 'experienceFrequency') +
    `\nEXPERIENCES & INTENTIONS\n` +
    a('Ancestral medicine ritual experience', 'ritual') +
    l('Other ritual', 'ritualOther') +
    l('How was the experience', 'ritualExperience') +
    l('Spiritual experience', 'spiritualExperience') +
    l('Intentions', 'intentions') +
    `\nDECLARATION\n` +
    l('Read the declaration', 'readDeclaration') +
    l('Signature (full name)', 'signatureName')
  )
}

const TEXT_FIELDS = [
  'retreatDate',
  'paternalLastName',
  'maternalLastName',
  'names',
  'dob',
  'placeOfBirth',
  'address',
  'phone',
  'email',
  'maritalStatus',
  'passport',
  'occupation',
  'emergencyName',
  'emergencyPhone',
  'currentIllness',
  'accidents',
  'recentSurgeries',
  'psychiatricDisorders',
  'allergies',
  'otherDiseases',
  'currentTreatment',
  'medications',
  'substanceUse',
  'substanceFrequency',
  'difficultyStopping',
  'experienceFrequency',
  'ritualOther',
  'ritualExperience',
  'spiritualExperience',
  'intentions',
  'readDeclaration',
  'signatureName',
] as const

const LIST_FIELDS = ['conditions', 'experiences', 'ritual'] as const

export async function sendRegistration(
  _prev: RegistrationState,
  formData: FormData,
): Promise<RegistrationState> {
  // Honeypot — bots fill this, humans don't.
  if (str(formData, 'company').length > 0) {
    return { status: 'success', code: 'success' }
  }

  const fields: Record<string, string> = {}
  for (const key of TEXT_FIELDS) fields[key] = str(formData, key)

  const lists: Record<string, string[]> = {}
  for (const key of LIST_FIELDS) lists[key] = list(formData, key)

  const turnstileToken = str(formData, 'cf-turnstile-response')

  const requiredMissing =
    !fields.retreatDate ||
    !fields.paternalLastName ||
    !fields.names ||
    !fields.dob ||
    !fields.placeOfBirth ||
    !fields.address ||
    !fields.phone ||
    !fields.maritalStatus ||
    !fields.occupation ||
    !fields.emergencyName ||
    !fields.emergencyPhone ||
    !fields.substanceUse ||
    !fields.difficultyStopping ||
    !fields.readDeclaration ||
    !fields.signatureName

  if (requiredMissing) {
    return { status: 'error', code: 'missing' }
  }

  for (const key of TEXT_FIELDS) {
    const max = key === 'dob' ? 10 : LIMITS.longTextMax
    if (fields[key].length > max) {
      return { status: 'error', code: 'generic' }
    }
  }

  if (fields.email && !isValidEmail(fields.email)) {
    return { status: 'error', code: 'invalidEmail' }
  }

  const age = ageFromDob(fields.dob)
  if (age === null) {
    return { status: 'error', code: 'invalidDob' }
  }
  if (age < LIMITS.minAge) {
    return { status: 'error', code: 'underage' }
  }

  if (fields.readDeclaration !== 'yes') {
    return { status: 'error', code: 'declarationRequired' }
  }

  const apiKey = process.env.BREVO_API_KEY
  const senderEmail = process.env.BREVO_FROM_EMAIL
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY

  if (!turnstileSecret) {
    console.log('[v0] Registration form Turnstile secret (TURNSTILE_SECRET_KEY) is not configured on the server.')
    return { status: 'error', code: 'challenge' }
  }
  if (!turnstileToken) {
    console.log('[v0] Registration form submission missing a Turnstile token.')
    return { status: 'error', code: 'challenge' }
  }

  if (!apiKey || !senderEmail) {
    console.log('[v0] Registration form submission (Brevo env vars not set):', {
      hasBrevoApiKey: Boolean(apiKey),
      hasBrevoSenderEmail: Boolean(senderEmail),
      names: fields.names,
      paternalLastName: fields.paternalLastName,
    })
    return { status: 'error', code: 'notConnected' }
  }

  try {
    const challengePassed = await verifyTurnstileToken(turnstileToken)

    if (!challengePassed) {
      return { status: 'error', code: 'challenge' }
    }

    const fullName = [fields.names, fields.paternalLastName, fields.maternalLastName]
      .filter(Boolean)
      .join(' ')

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: 'kawsayvida.com Registration Form',
          email: senderEmail,
        },
        to: [{ email: siteConfig.notificationEmail }],
        ...(fields.email && isValidEmail(fields.email)
          ? { replyTo: { email: fields.email, name: fullName } }
          : {}),
        subject: `New retreat registration from ${fullName}`,
        textContent: composeEmailBody(fields, lists),
      }),
    })

    if (!response.ok) {
      const error = (await response.json().catch(() => ({}))) as BrevoError
      console.log('[v0] Brevo error:', response.status, error)
      return { status: 'error', code: 'generic' }
    }

    return { status: 'success', code: 'success' }
  } catch (err) {
    console.log('[v0] Registration send exception:', err)
    return { status: 'error', code: 'generic' }
  }
}
