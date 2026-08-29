'use server'

import { headers } from 'next/headers'
import { siteConfig } from '@/lib/site'
import { verifyTurnstileToken } from '@/lib/turnstile'
import { renderEmailShell, renderSection, renderTextSection, type EmailRow } from '@/lib/email-template'
import { getUI, type UIStrings } from '@/lib/i18n/ui'
import { recordFormSubmission } from '@pixelsmith/contact-form/server'

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

// DELIBERATELY RECORDS FULL, UNREDACTED FIELD VALUES (INCLUDING HEALTH
// INFORMATION) TO POSTGRES, AT THE SITE OWNER'S EXPLICIT REQUEST, SO NO
// SUBMISSION IS EVER SILENTLY LOST. THE CONSOLE LOG LINE STAYS LIMITED TO
// THE SUBMITTER'S NAME/EMAIL AND OUTCOME CODE FOR QUICK HUMAN SCANNING.
async function logRegistrationAttempt(
  outcome: string,
  identity: { name: string; email: string },
  options: {
    complete: boolean
    validated?: boolean
    fields?: Record<string, unknown>
    notificationSent?: boolean
    notificationRecipients?: string[]
    notificationProviderId?: string
    extra?: Record<string, unknown>
  },
): Promise<void> {
  console.log('[v0] Registration form submission:', {
    outcome,
    name: identity.name || undefined,
    email: identity.email || undefined,
    ...options.extra,
  })

  const h = await headers()
  await recordFormSubmission({
    site: h.get('host') ?? 'unknown',
    form: 'registration',
    stage: 'server_processed',
    outcome,
    complete: options.complete,
    validated: options.validated,
    fields: options.fields,
    notificationSent: options.notificationSent,
    notificationRecipients: options.notificationRecipients,
    notificationProviderId: options.notificationProviderId,
    ip: h.get('x-forwarded-for')?.split(',')[0]?.trim(),
    userAgent: h.get('user-agent') ?? undefined,
    referer: h.get('referer') ?? undefined,
  })
}

export async function sendRegistration(
  _prev: RegistrationState,
  formData: FormData,
): Promise<RegistrationState> {
  const identity = {
    name: [str(formData, 'names'), str(formData, 'paternalLastName'), str(formData, 'maternalLastName')]
      .filter(Boolean)
      .join(' '),
    email: str(formData, 'email'),
  }

  // Raw values as submitted, whatever they are — captured before any
  // validation so an incomplete/invalid attempt is still fully recorded.
  const rawFields: Record<string, string> = {}
  for (const key of TEXT_FIELDS) rawFields[key] = str(formData, key)
  const rawLists: Record<string, string[]> = {}
  for (const key of LIST_FIELDS) rawLists[key] = list(formData, key)
  const allSubmittedFields = { ...rawFields, ...rawLists }

  const log = (outcome: string, options: Omit<Parameters<typeof logRegistrationAttempt>[2], 'fields'>) =>
    logRegistrationAttempt(outcome, identity, { fields: allSubmittedFields, ...options })

  // Honeypot — bots fill this, humans don't. A browser autofill tool
  // mistakenly filling this would also land here, which is exactly the kind
  // of silent near-miss this log line exists to catch.
  if (str(formData, 'company').length > 0) {
    await log('honeypot_triggered', { complete: true })
    return { status: 'success', code: 'success' }
  }

  // NOTIFICATION EMAILS ALWAYS USE SPANISH LABELS, REGARDLESS OF THE VISITOR'S SITE LANGUAGE.
  const tEmail = getUI('es')

  const fields = rawFields
  const lists = rawLists

  const turnstileToken = str(formData, 'cf-turnstile-response')

  const requiredFields: Array<[string, boolean]> = [
    ['retreatDate', !fields.retreatDate],
    ['paternalLastName', !fields.paternalLastName],
    ['names', !fields.names],
    ['dob', !fields.dob],
    ['placeOfBirth', !fields.placeOfBirth],
    ['address', !fields.address],
    ['phone', !fields.phone],
    ['maritalStatus', !fields.maritalStatus],
    ['occupation', !fields.occupation],
    ['emergencyName', !fields.emergencyName],
    ['emergencyPhone', !fields.emergencyPhone],
    ['substanceUse', !fields.substanceUse],
    ['difficultyStopping', !fields.difficultyStopping],
    ['readDeclaration', !fields.readDeclaration],
    ['signatureName', !fields.signatureName],
  ]
  const missingFields = requiredFields.filter(([, missing]) => missing).map(([key]) => key)

  if (missingFields.length > 0) {
    await log('missing_required_fields', { complete: false, validated: false, extra: { fields: missingFields } })
    return { status: 'error', code: 'missing' }
  }

  for (const key of TEXT_FIELDS) {
    const max = key === 'dob' ? 10 : LIMITS.longTextMax
    if (fields[key].length > max) {
      await log('field_too_long', { complete: false, validated: false, extra: { field: key } })
      return { status: 'error', code: 'generic' }
    }
  }

  if (fields.email && !isValidEmail(fields.email)) {
    await log('invalid_email', { complete: true, validated: false })
    return { status: 'error', code: 'invalidEmail' }
  }

  const age = ageFromDob(fields.dob)
  if (age === null) {
    await log('invalid_dob', { complete: true, validated: false })
    return { status: 'error', code: 'invalidDob' }
  }
  if (age < LIMITS.minAge) {
    await log('underage', { complete: true, validated: false })
    return { status: 'error', code: 'underage' }
  }

  if (fields.readDeclaration !== 'yes') {
    await log('declaration_not_accepted', { complete: true, validated: false })
    return { status: 'error', code: 'declarationRequired' }
  }

  const apiKey = process.env.BREVO_API_KEY
  const senderEmail = process.env.BREVO_FROM_EMAIL
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY

  if (!turnstileSecret) {
    await log('turnstile_secret_missing', { complete: true, validated: true })
    return { status: 'error', code: 'challenge' }
  }
  if (!turnstileToken) {
    await log('turnstile_token_missing', { complete: true, validated: false })
    return { status: 'error', code: 'challenge' }
  }

  if (!apiKey || !senderEmail) {
    await log('brevo_env_not_configured', {
      complete: true,
      validated: true,
      extra: {
        hasBrevoApiKey: Boolean(apiKey),
        hasBrevoSenderEmail: Boolean(senderEmail),
      },
    })
    return { status: 'error', code: 'notConnected' }
  }

  try {
    const challengePassed = await verifyTurnstileToken(turnstileToken)

    if (!challengePassed) {
      await log('turnstile_verification_failed', { complete: true, validated: false })
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
        to: siteConfig.notificationEmails.map((email) => ({ email })),
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
      await log('brevo_send_failed', {
        complete: true,
        validated: true,
        notificationSent: false,
        notificationRecipients: siteConfig.notificationEmails,
        extra: { status: response.status, error },
      })
      return { status: 'error', code: 'generic' }
    }

    // Brevo returns { messageId } on acceptance — this is the actual proof of
    // send, recorded alongside the submission so a "no notification arrived"
    // report can be checked against what Brevo itself confirmed.
    const sendResult = (await response.json().catch(() => ({}))) as { messageId?: string }

    await log('success', {
      complete: true,
      validated: true,
      notificationSent: true,
      notificationRecipients: siteConfig.notificationEmails,
      notificationProviderId: sendResult.messageId,
    })
    return { status: 'success', code: 'success' }
  } catch (err) {
    await log('exception', { complete: true, validated: false, extra: { error: String(err) } })
    return { status: 'error', code: 'generic' }
  }
}
