// Lightweight, PII-free diagnostic endpoint for the contact and registration
// forms. It exists so we can see when a visitor clicked submit but the
// browser blocked the request client-side (missing/invalid fields) before it
// ever reached a server action or the Brevo API — the most likely reason
// someone believes they submitted a form when they actually didn't.
//
// NEVER LOG FIELD VALUES HERE — THE REGISTRATION FORM COLLECTS HEALTH
// INFORMATION. ONLY FIELD NAMES ARE ACCEPTED, NEVER THEIR CONTENTS.
type FormLogPayload = {
  form: 'contact' | 'registration'
  outcome: string
  invalidFields?: string[]
  lang?: string
}

const MAX_OUTCOME_LENGTH = 60
const MAX_FIELD_NAME_LENGTH = 60
const MAX_FIELDS = 30

function isValidPayload(value: unknown): value is FormLogPayload {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>

  if (v.form !== 'contact' && v.form !== 'registration') return false
  if (typeof v.outcome !== 'string' || v.outcome.length === 0 || v.outcome.length > MAX_OUTCOME_LENGTH) return false
  if (v.lang !== undefined && typeof v.lang !== 'string') return false
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
  })

  return Response.json({ ok: true })
}
