import { createContactHandler } from '@pixelsmith/contact-form/server'
import { getContactFormConfig } from '@/lib/contact-fields'
import { siteConfig } from '@/lib/site'
import type { ContactFormPayload } from '@pixelsmith/contact-form'
import type { Lang } from '@/lib/i18n/config'

function submissionLanguage(payload: ContactFormPayload): Lang {
  return payload.fields.lang === 'es' ? 'es' : 'en'
}

export const POST = createContactHandler((payload) => {
  const lang = submissionLanguage(payload)
  const { fields, messages } = getContactFormConfig(lang)

  return {
    fields,
    messages,
    to: siteConfig.notificationEmail,
    fromName: 'Kawsay Vida Contact Form',
    replyToField: 'email',
    subject: (values: Record<string, string | boolean>) => {
      const fullName = `${String(values.firstName ?? '')} ${String(values.lastName ?? '')}`.trim()
      return `New Kawsay Vida message from ${fullName || 'Website visitor'}`
    },
  }
})
