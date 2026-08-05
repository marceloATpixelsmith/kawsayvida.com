'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { navItems, siteConfig } from '@/lib/site'
import { LogoMark } from '@/components/logo-mark'
import { LanguageToggle } from '@/components/language-toggle'
import { useLanguage } from '@/lib/i18n/context'

export function SiteHeader() {
  const pathname = usePathname()
  const { t } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-500',
        scrolled || open
          ? 'border-b border-border/60 bg-background/85 backdrop-blur-md'
          : 'bg-gradient-to-b from-background/70 to-transparent',
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-7 lg:px-10 lg:py-9">
        <Link href="/" className="flex items-center text-foreground" aria-label="Ameyalli — home">
          <LogoMark className="h-12 w-auto sm:h-14 lg:h-16" />
        </Link>

        <div className="hidden items-center md:flex">
          <nav className="flex items-center gap-8">
            {navItems.map((item) => {
              const active =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'group relative text-xs font-medium uppercase tracking-[0.22em] transition-colors',
                    active ? 'text-primary' : 'text-foreground/80 hover:text-primary',
                  )}
                >
                  {t.nav[item.key]}
                  <span
                    className={cn(
                      'absolute -bottom-1.5 left-0 h-px bg-primary transition-all duration-300',
                      active ? 'w-full' : 'w-0 group-hover:w-full',
                    )}
                  />
                </Link>
              )
            })}
          </nav>
          <span className="ml-8 h-4 w-px bg-border/60" aria-hidden="true" />
          <LanguageToggle className="ml-8" />
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center text-foreground md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <Menu className="hidden" /> : null}
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'overflow-hidden bg-background/95 backdrop-blur-md transition-[max-height] duration-500 md:hidden',
          open ? 'max-h-96 border-t border-border/40' : 'max-h-0',
        )}
      >
        <nav className="flex flex-col px-6 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="border-b border-border/30 py-4 text-sm uppercase tracking-[0.22em] text-foreground/85 hover:text-primary"
            >
              {t.nav[item.key]}
            </Link>
          ))}
          <a
            href={`mailto:${siteConfig.email}`}
            className="border-b border-border/30 py-4 text-sm uppercase tracking-[0.22em] text-primary"
          >
            {siteConfig.email}
          </a>
          <div className="flex items-center gap-3 py-4">
            <span className="text-xs uppercase tracking-[0.22em] text-foreground/60">
              {t.language.label}
            </span>
            <LanguageToggle direction="right" />
          </div>
        </nav>
      </div>
    </header>
  )
}
