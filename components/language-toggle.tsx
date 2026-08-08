'use client'

import { LanguageToggle as CoreLanguageToggle } from '@pixelsmith/localization'
import { useLanguage } from '@/lib/i18n/context'

export function LanguageToggle({
  className,
  direction = 'down',
}: {
  className?: string
  direction?: 'down' | 'right'
}) {
  const { t } = useLanguage()
  return (
    <CoreLanguageToggle
      className={className}
      direction={direction}
      ariaLabel={t.language.label}
      reloadOnChange
    />
  )
}
