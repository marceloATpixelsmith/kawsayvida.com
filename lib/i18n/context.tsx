'use client'

import {
  LanguageProvider as CoreLanguageProvider,
  useLanguage as useCoreLanguage,
  type LocalizationConfig,
} from '@pixelsmith/localization'
import { DEFAULT_LANG, LANG_COOKIE, type Lang } from './config'
import { getUI, type UIStrings } from './ui'

const localizationConfig: LocalizationConfig = {
  locales: [
    { code: 'en', label: 'English', shortLabel: 'EN', htmlLang: 'en' },
    { code: 'es', label: 'Español', shortLabel: 'ES', htmlLang: 'es' },
  ],
  defaultLocale: DEFAULT_LANG,
  cookieName: LANG_COOKIE,
}

type LanguageContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  t: UIStrings
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  return <CoreLanguageProvider config={localizationConfig}>{children}</CoreLanguageProvider>
}

export function useLanguage(): LanguageContextValue {
  const { lang, setLang } = useCoreLanguage()
  const typedLang = lang as Lang
  return {
    lang: typedLang,
    setLang: (next: Lang) => setLang(next),
    t: getUI(typedLang),
  }
}
