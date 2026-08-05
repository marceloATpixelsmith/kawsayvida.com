// ---------------------------------------------------------------------------
// Internationalization (i18n) core config.
// This site is bilingual: English ("en") and Spanish ("es").
//
// HOW TRANSLATIONS WORK
// - UI chrome strings (buttons, labels, section titles) live in lib/i18n/ui.ts
// - Content (services, events, hero slides, testimonials, page copy) lives in
//   the lib/*.ts data files, where each translatable field is a `Localized`
//   object: { en: "...", es: "..." }
// - Use the `pick(value, lang)` helper to read the right language at render time.
// ---------------------------------------------------------------------------

export const LOCALES = ['en', 'es'] as const
export type Lang = (typeof LOCALES)[number]

export const DEFAULT_LANG: Lang = 'en'
export const LANG_COOKIE = 'kawsayvida_lang'

/** A string (or string array) that exists in both languages. */
export type Localized<T = string> = { en: T; es: T }

/** Read the value for the active language from a Localized object. */
export function pick<T>(value: Localized<T>, lang: Lang): T {
  return value[lang]
}

/** Normalize any incoming value (cookie, browser) to a supported Lang. */
export function normalizeLang(value: string | undefined | null): Lang {
  if (!value) return DEFAULT_LANG
  const lower = value.toLowerCase()
  if (lower.startsWith('es')) return 'es'
  if (lower.startsWith('en')) return 'en'
  return DEFAULT_LANG
}
