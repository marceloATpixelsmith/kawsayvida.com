import type { ContactFieldDefinition, ContactFormMessages } from '@pixelsmith/contact-form'
import type { Lang } from '@/lib/i18n/config'
import { getUI } from '@/lib/i18n/ui'

export function getContactFormConfig(lang: Lang): {
  fields: readonly ContactFieldDefinition[]
  messages: ContactFormMessages
} {
  const t = getUI(lang)

  return {
    fields: [
      { name: 'lang', label: 'Language', type: 'hidden', value: lang },
      {
        name: 'firstName',
        label: t.form.nameLabel,
        type: 'text',
        required: true,
        maxLength: 100,
        width: 'half',
        placeholder: t.form.namePlaceholder,
        validationMessages: {
          required: t.form.errors.nameRequired,
          maxLength: t.form.errors.nameTooLong,
        },
      },
      {
        name: 'lastName',
        label: t.form.lastNameLabel,
        type: 'text',
        maxLength: 100,
        width: 'half',
        placeholder: t.form.lastNamePlaceholder,
        validationMessages: { maxLength: t.form.errors.nameTooLong },
      },
      {
        name: 'email',
        label: t.form.emailLabel,
        type: 'email',
        required: true,
        maxLength: 254,
        autocomplete: 'email',
        placeholder: t.form.emailPlaceholder,
        validationMessages: {
          required: t.form.errors.emailRequired,
          invalid: t.form.errors.invalidEmail,
          maxLength: t.form.errors.invalidEmail,
        },
      },
      {
        name: 'message',
        label: t.form.messageLabel,
        type: 'textarea',
        required: true,
        minLength: 10,
        maxLength: 2000,
        rows: 5,
        placeholder: t.form.messagePlaceholder,
        validationMessages: {
          required: t.form.errors.messageRequired,
          minLength: t.form.errors.messageTooShort,
          maxLength: t.form.errors.messageTooLong,
        },
      },
    ],
    messages: {
      submitLabel: t.form.send,
      submittingLabel: t.form.sending,
      successMessage: t.form.success,
      errorMessage: t.form.errors.generic,
      turnstileMessage: t.form.errors.challenge,
    },
  }
}
