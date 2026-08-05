'use client'

import Link from 'next/link'
import { Mail } from 'lucide-react'
import { navItems, siteConfig } from '@/lib/site'
import { LogoMark } from '@/components/logo-mark'
import { useLanguage } from '@/lib/i18n/context'

export function SiteFooter() {
  const { t } = useLanguage()

  return (
    <footer className="border-t border-border/50 bg-card">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center text-foreground" aria-label="Ameyalli — home">
              <LogoMark className="h-10 w-auto" />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t.footer.tagline}
            </p>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.22em] text-primary">
              {t.footer.explore}
            </h3>
            <ul className="mt-5 space-y-3">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-foreground/80 transition-colors hover:text-primary"
                  >
                    {t.nav[item.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.22em] text-primary">
              {t.footer.connect}
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-2 text-foreground/80 transition-colors hover:text-primary"
                >
                  <Mail className="h-4 w-4" />
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.social.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="text-foreground/80 transition-colors hover:text-primary"
                >
                  facebook.com/ameyalli.space
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.social.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="text-foreground/80 transition-colors hover:text-primary"
                >
                  youtube.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-2 border-t border-border/40 pt-8 text-xs uppercase tracking-[0.18em] text-muted-foreground sm:flex-row">
          <span>© Ameyalli {new Date().getFullYear()}</span>
          <span>{t.footer.rights}</span>
        </div>
      </div>
    </footer>
  )
}
