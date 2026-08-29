// Diagnostic endpoint for the contact and registration forms. It exists so
// we can see when a visitor clicked submit but the browser blocked the
// request client-side (missing/invalid fields) before it ever reached a
// server action or the Brevo API — the most likely reason someone believes
// they submitted a form when they actually didn't — and who to follow up
// with when that happens.
//
// ONLY THE OUTCOME, INVALID FIELD NAMES, AND THE SUBMITTER'S OWN NAME/EMAIL
// ARE ACCEPTED HERE. NEVER ADD ANY OTHER FIELD'S VALUE — THE REGISTRATION
// FORM COLLECTS HEALTH INFORMATION THAT MUST NEVER REACH THESE LOGS.
type FormLogPayload = {
  form: 'contact' | 'registration'
  outcome: string
  invalidFields?: string[]
  lang?: string
  name?: string
  email?: string
}

const MAX_OUTCOME_LENGTH = 60
const MAX_FIELD_NAME_LENGTH = 60
const MAX_FIELDS = 30
const MAX_NAME_LENGTH = 200
const MAX_EMAIL_LENGTH = 254

function isValidPayload(value: unknown): value is FormLogPayload {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>

  if (v.form !== 'contact' && v.form !== 'registration') return false
  if (typeof v.outcome !== 'string' || v.outcome.length === 0 || v.outcome.length > MAX_OUTCOME_LENGTH) return false
  if (v.lang !== undefined && typeof v.lang !== 'string') return false
  if (v.name !== undefined && (typeof v.name !== 'string' || v.name.length > MAX_NAME_LENGTH)) return false
  if (v.email !== undefined && (typeof v.email !== 'string' || v.email.length > MAX_EMAIL_LENGTH)) return false
  if (v.invalidFields !== undefined) {
    if (!Array.isArray(v.invalidFields) || v.invalidFields.length > MAX_FIELDS) return false
    if (!v.invalidFields.every((f) => typeof f === 'string' && f.length <= MAX_FIELD_NAME_LENGTH)) return false
  }

  return true
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)

  if (!isValidPayload(body)) {
    return Response.json({ ok: false }, { status: 400 })
  }

  console.log('[v0] Form submit attempt:', {
    form: body.form,
    outcome: body.outcome,
    invalidFields: body.invalidFields ?? [],
    lang: body.lang,
    name: body.name || undefined,
    email: body.email || undefined,
  })

  return Response.json({ ok: true })
}
