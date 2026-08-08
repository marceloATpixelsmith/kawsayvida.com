import { createContactHandler } from '@pixelsmith/contact-form/server'
import { getContactFormConfig } from '@/lib/contact-fields'
import { siteConfig } from '@/lib/site'
import type { Lang } from '@/lib/i18n/config'

function submissionLanguage(payload: unknown): Lang {
  if (!payload || typeof payload !== 'object') return 'en'
  const fields = (payload as { fields?: unknown }).fields
  if (!fields || typeof fields !== 'object') return 'en'
  return (fields as Record<string, unknown>).lang === 'es' ? 'es' : 'en'
}

export async function POST(request: Request): Promise<Response> {
  const preview = await request.clone().json().catch(() => null)
  const lang = submissionLanguage(preview)
  const { fields, messages } = getContactFormConfig(lang)

  const handler = createContactHandler({
    fields,
    messages,
    to: siteConfig.email,
    fromName: 'Kawsay Vida Contact Form',
    replyToField: 'email',
    subject: (values) => {
      const fullName = `${String(values.firstName ?? '')} ${String(values.lastName ?? '')}`.trim()
      return `New Kawsay Vida message from ${fullName || 'Website visitor'}`
    },
  })

  return handler(request)
}
