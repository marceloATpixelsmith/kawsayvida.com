'use client'

import { Check, Send } from 'lucide-react'
import { ContactForm as SharedContactForm } from '@pixelsmith/contact-form'
import { useLanguage } from '@/lib/i18n/context'
import { getContactFormConfig } from '@/lib/contact-fields'

export function ContactForm() {
  const { lang, t } = useLanguage()
  const { fields, messages } = getContactFormConfig(lang)

  return (
    <SharedContactForm
      className="kawsayvida-contact-form"
      fields={fields}
      messages={messages}
      turnstilePlacement="top"
      submitAdornment={<Send className="h-4 w-4" />}
      successContent={(message) => (
        <div className="flex flex-col items-center border border-primary/40 bg-primary/5 p-12 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Check className="h-7 w-7" />
          </span>
          <h3 className="mt-6 font-serif text-2xl font-light text-foreground">{t.form.successTitle}</h3>
          <p className="mt-3 max-w-sm text-muted-foreground leading-relaxed">{message}</p>
        </div>
      )}
    />
  )
}
