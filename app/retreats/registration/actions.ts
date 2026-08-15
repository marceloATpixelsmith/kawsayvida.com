'use server'

import { siteConfig } from '@/lib/site'
import { verifyTurnstileToken } from '@/lib/turnstile'
import { renderEmailShell, renderSection, renderTextSection, type EmailRow } from '@/lib/email-template'
import { getUI, type UIStrings } from '@/lib/i18n/ui'

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

// Builds the notification email's sections/rows using labels from the
// visitor's own submission language, so the email reads in whichever
// language they filled out the form in.
function buildSections(
  t: UIStrings,
  fields: Record<string, string>,
  lists: Record<string, string[]>,
): Array<{ title: string; rows: EmailRow[] }> {
  const r = t.registration
  const joined = (key: string) => (lists[key] ?? []).join(', ')
  const declarationValue =
    fields.readDeclaration === 'yes'
      ? r.healthQuestions.yes
      : fields.readDeclaration === 'no'
        ? r.healthQuestions.no
        : ''

  return [
    {
      title: r.retreatSectionTitle,
      rows: [{ label: r.dateOfRetreat, value: fields.retreatDate }],
    },
    {
      title: r.personalInfoTitle,
      rows: [
        { label: r.fields.paternalLastName, value: fields.paternalLastName },
        { label: r.fields.maternalLastName, value: fields.maternalLastName },
        { label: r.fields.names, value: fields.names },
        { label: r.fields.dob, value: fields.dob },
        { label: r.fields.placeOfBirth, value: fields.placeOfBirth },
        { label: r.fields.address, value: fields.address },
        { label: r.fields.phone, value: fields.phone },
        { label: r.fields.email, value: fields.email },
        { label: r.fields.maritalStatus, value: fields.maritalStatus },
        { label: r.fields.passport, value: fields.passport },
        { label: r.fields.occupation, value: fields.occupation },
        { label: r.fields.emergencyName, value: fields.emergencyName },
        { label: r.fields.emergencyPhone, value: fields.emergencyPhone },
      ],
    },
    {
      title: r.healthTitle,
      rows: [
        { label: r.healthFields.currentIllness, value: fields.currentIllness },
        { label: r.healthFields.accidents, value: fields.accidents },
        { label: r.healthFields.recentSurgeries, value: fields.recentSurgeries },
        { label: r.conditionsLabel, value: joined('conditions') },
        { label: r.healthQuestions.psychiatricDisorders, value: fields.psychiatricDisorders },
        { label: r.healthQuestions.allergies, value: fields.allergies },
        { label: r.healthQuestions.otherDiseases, value: fields.otherDiseases },
        { label: r.healthQuestions.currentTreatment, value: fields.currentTreatment },
        { label: r.healthQuestions.medications, value: fields.medications },
        { label: r.healthQuestions.substanceUse, value: fields.substanceUse },
        { label: r.healthQuestions.substanceFrequency, value: fields.substanceFrequency },
        { label: r.healthQuestions.difficultyStopping, value: fields.difficultyStopping },
        { label: r.experiencesTitle, value: joined('experiences') },
        { label: r.experiences[r.experiences.length - 1], value: fields.experienceFrequency },
      ],
    },
    {
      title: r.intentionsTitle,
      rows: [
        { label: r.ritualQuestion, value: joined('ritual') },
        { label: r.ritualOtherLabel, value: fields.ritualOther },
        { label: r.experienceQuestions.howWasIt, value: fields.ritualExperience },
        { label: r.experienceQuestions.spiritualExperience, value: fields.spiritualExperience },
        { label: r.experienceQuestions.intentions, value: fields.intentions },
      ],
    },
    {
      title: r.declarationTitle,
      rows: [
        { label: r.readDeclaration, value: declarationValue },
        { label: r.fullName, value: fields.signatureName },
      ],
    },
  ]
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

  // NOTIFICATION EMAILS ALWAYS USE SPANISH LABELS, REGARDLESS OF THE VISITOR'S SITE LANGUAGE.
  const tEmail = getUI('es')

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

    const sections = buildSections(tEmail, fields, lists)
    const bodyHtml = sections.map((s) => renderSection(s.title, s.rows)).join('')
    const textContent = sections.map((s) => renderTextSection(s.title, s.rows)).join('')
    const htmlContent = renderEmailShell({
      preheader: `${fullName} — ${fields.retreatDate}`,
      heading: tEmail.registration.emailHeading,
      bodyHtml,
      footerText: `kawsayvida.com — ES`,
    })

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
        to: [...siteConfig.notificationEmails.map((email) => ({ email })), { email: siteConfig.email }],
        ...(fields.email && isValidEmail(fields.email)
          ? { replyTo: { email: fields.email, name: fullName } }
          : {}),
        subject: tEmail.registration.emailSubject.replace('{name}', fullName),
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
    console.log('[v0] Registration send exception:', err)
    return { status: 'error', code: 'generic' }
  }
}
