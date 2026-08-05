'use client'

import { LANG_COOKIE, LOCALES, type Lang } from '@/lib/i18n/config'
import { useLanguage } from '@/lib/i18n/context'
import { cn } from '@/lib/utils'

export function LanguageToggle({
  className,
  direction = 'down',
}: {
  className?: string
  direction?: 'down' | 'right'
}) {
  const { lang, t } = useLanguage()
  const alternateLanguage = LOCALES.find((code) => code !== lang) ?? 'en'

  const selectLanguage = (code: Lang) => {
    if (code === lang) return
    document.cookie = `${LANG_COOKIE}=${encodeURIComponent(code)};path=/;max-age=31536000;samesite=lax`
    window.location.reload()
  }

  return (
    <div
      className={cn('group relative flex items-center', className)}
      role="group"
      aria-label={t.language.label}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-label={`${t.language.label}: ${t.language[lang]}`}
        className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-foreground/[0.025] pl-[0.22em] text-xs font-medium uppercase tracking-[0.22em] text-primary transition-[color,background-color] duration-200"
      >
        {t.language[lang]}
      </button>

      <div
        className={cn(
          'invisible absolute z-20 opacity-0 transition-[opacity,visibility] duration-150',
          direction === 'right'
            ? 'left-full top-1/2 -translate-y-1/2 pl-1'
            : 'left-1/2 top-full -translate-x-1/2 pt-1',
          'group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100',
        )}
      >
        <div className="rounded-full bg-card/95 shadow-md ring-1 ring-border backdrop-blur-sm">
          <button
            type="button"
            onClick={() => selectLanguage(alternateLanguage)}
            aria-label={`${t.language.label}: ${t.language[alternateLanguage]}`}
            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full pl-[0.22em] text-xs font-medium uppercase tracking-[0.22em] text-foreground/75 transition-colors hover:text-primary focus-visible:text-primary"
          >
            {t.language[alternateLanguage]}
          </button>
        </div>
      </div>
    </div>
  )
}
