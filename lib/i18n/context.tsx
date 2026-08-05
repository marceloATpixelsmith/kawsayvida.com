'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { DEFAULT_LANG, LANG_COOKIE, normalizeLang, type Lang } from './config'
import { getUI, type UIStrings } from './ui'

type LanguageContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  /** UI chrome strings for the active language. */
  t: UIStrings
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
  return match ? decodeURIComponent(match[1]) : undefined
}

function writeCookie(name: string, value: string) {
  // 1 year, site-wide.
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=31536000;samesite=lax`
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG)

  // On first mount: honor saved cookie choice, otherwise auto-detect from browser.
  useEffect(() => {
    const saved = readCookie(LANG_COOKIE)
    if (saved === 'en' || saved === 'es') {
      setLangState(saved)
      return
    }
    const detected = normalizeLang(
      typeof navigator !== 'undefined' ? navigator.language : DEFAULT_LANG,
    )
    setLangState(detected)
    writeCookie(LANG_COOKIE, detected)
  }, [])

  // Keep <html lang> in sync for accessibility & SEO.
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang
    }
  }, [lang])

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    writeCookie(LANG_COOKIE, next)
  }, [])

  const value = useMemo<LanguageContextValue>(
    () => ({ lang, setLang, t: getUI(lang) }),
    [lang, setLang],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return ctx
}
