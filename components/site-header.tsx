'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Menu, X } from 'lucide-react'
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
        <Link href="/" className="flex items-center text-foreground" aria-label="kawsayvida.com — home">
          <LogoMark className="h-12 w-auto sm:h-14 lg:h-16" />
        </Link>

        <div className="hidden items-center lg:flex">
          <nav className="flex items-center gap-3.5 xl:gap-5">
            {navItems.map((item) => {
              const isExternal = 'external' in item && item.external
              const children = 'children' in item ? item.children : undefined
              const active = !isExternal && pathname.startsWith(item.href)
              const linkClasses = cn(
                'group relative flex items-center gap-1 text-[0.68rem] font-medium uppercase tracking-[0.16em] transition-colors whitespace-nowrap xl:text-xs xl:tracking-[0.2em]',
                active ? 'text-primary' : 'text-foreground/80 hover:text-primary',
              )
              const underline = (
                <span
                  className={cn(
                    'absolute -bottom-1.5 left-0 h-px bg-primary transition-all duration-300',
                    active ? 'w-full' : 'w-0 group-hover:w-full',
                  )}
                />
              )

              if (children && children.length > 0) {
                return (
                  <div key={item.href} className="group/dropdown relative py-2">
                    <Link href={item.href} className={linkClasses}>
                      {t.nav[item.key]}
                      <ChevronDown className="h-3 w-3 transition-transform duration-200 group-hover/dropdown:rotate-180" />
                      {underline}
                    </Link>
                    <div
                      className={cn(
                        'invisible absolute left-1/2 top-full -translate-x-1/2 pt-2 opacity-0 transition-[opacity,visibility] duration-150',
                        'group-hover/dropdown:visible group-hover/dropdown:opacity-100 group-focus-within/dropdown:visible group-focus-within/dropdown:opacity-100',
                      )}
                    >
                      <div className="min-w-[11rem] border border-border/60 bg-card/95 py-2 shadow-lg backdrop-blur-sm">
                        {children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              'block whitespace-nowrap px-4 py-2.5 text-[0.68rem] uppercase tracking-[0.16em] transition-colors xl:text-xs',
                              pathname.startsWith(child.href)
                                ? 'text-primary'
                                : 'text-foreground/80 hover:text-primary',
                            )}
                          >
                            {t.nav[child.key]}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              }

              if (isExternal) {
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className={linkClasses}
                  >
                    {t.nav[item.key]}
                    {underline}
                  </a>
                )
              }

              return (
                <Link key={item.href} href={item.href} className={linkClasses}>
                  {t.nav[item.key]}
                  {underline}
                </Link>
              )
            })}
          </nav>
          <span className="ml-5 h-4 w-px bg-border/60 xl:ml-7" aria-hidden="true" />
          <LanguageToggle className="ml-5 xl:ml-7" />
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center text-foreground lg:hidden"
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
          'overflow-y-auto bg-background/95 backdrop-blur-md transition-[max-height] duration-500 lg:hidden',
          open ? 'max-h-[calc(100svh-5.5rem)] border-t border-border/40' : 'max-h-0',
        )}
      >
        <nav className="flex flex-col px-6 py-4">
          {navItems.map((item) => {
            const isExternal = 'external' in item && item.external
            const children = 'children' in item ? item.children : undefined
            return (
              <div key={item.href} className="border-b border-border/30">
                {isExternal ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="block py-4 text-sm uppercase tracking-[0.22em] text-foreground/85 hover:text-primary"
                  >
                    {t.nav[item.key]}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className="block py-4 text-sm uppercase tracking-[0.22em] text-foreground/85 hover:text-primary"
                  >
                    {t.nav[item.key]}
                  </Link>
                )}
                {children && children.length > 0 && (
                  <div className="flex flex-col pb-3 pl-4">
                    {children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="py-2 text-xs uppercase tracking-[0.2em] text-foreground/65 hover:text-primary"
                      >
                        {t.nav[child.key]}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
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
