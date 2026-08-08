'use client'

import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { SiteMenu, type SiteMenuItem } from '@pixelsmith/site-menu'
import { navItems, siteConfig } from '@/lib/site'
import { LogoMark } from '@/components/logo-mark'
import { LanguageToggle } from '@/components/language-toggle'
import { useLanguage } from '@/lib/i18n/context'

export function SiteHeader() {
  const { t } = useLanguage()
  const items: SiteMenuItem[] = navItems.map((item) => ({
    id: item.key,
    href: item.href,
    label: t.nav[item.key],
    exact: item.href === '/',
    external: 'external' in item && item.external,
  }))

  return (
    <SiteMenu
      className="kawsayvida-site-menu"
      items={items}
      brand={<LogoMark className="h-12 w-auto sm:h-14 lg:h-16" />}
      brandLabel="kawsayvida.com — home"
      utility={<LanguageToggle />}
      mobileExtra={(
        <a href={`mailto:${siteConfig.email}`} className="pixelsmith-site-menu__mobile-link text-primary">
          {siteConfig.email}
        </a>
      )}
      mobileUtility={(
        <>
          <span className="text-xs uppercase tracking-[0.22em] text-foreground/60">{t.language.label}</span>
          <LanguageToggle direction="right" />
        </>
      )}
      renderDesktopItem={(menuItem, context) => {
        const source = navItems.find((item) => item.key === menuItem.id)
        if (!source || !('children' in source) || !source.children?.length) return undefined
        const active = context.pathname.startsWith(source.href) || source.children.some((child) => context.pathname.startsWith(child.href))

        return (
          <div className="group/dropdown relative py-2">
            <Link
              href={source.href}
              className={context.desktopLinkClassName}
              data-active={active ? 'true' : 'false'}
              aria-haspopup="true"
            >
              <span className="inline-flex items-center gap-1">
                {t.nav[source.key]}
                <ChevronDown className="h-3 w-3 transition-transform duration-200 group-hover/dropdown:rotate-180" />
              </span>
              <span className="pixelsmith-site-menu__underline" aria-hidden="true" />
            </Link>
            <div className="invisible absolute left-1/2 top-full -translate-x-1/2 pt-2 opacity-0 transition-[opacity,visibility] duration-150 group-hover/dropdown:visible group-hover/dropdown:opacity-100 group-focus-within/dropdown:visible group-focus-within/dropdown:opacity-100">
              <div className="min-w-[11rem] border border-border/60 bg-card/95 py-2 shadow-lg backdrop-blur-sm">
                {source.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={context.closeMenu}
                    className={`block whitespace-nowrap px-4 py-2.5 text-xs uppercase tracking-[0.16em] transition-colors ${
                      context.pathname.startsWith(child.href) ? 'text-primary' : 'text-foreground/80 hover:text-primary'
                    }`}
                  >
                    {t.nav[child.key]}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )
      }}
      renderMobileItem={(menuItem, context) => {
        const source = navItems.find((item) => item.key === menuItem.id)
        if (!source || !('children' in source) || !source.children?.length) return undefined
        return (
          <div className="border-b border-border/30">
            <Link
              href={source.href}
              onClick={context.closeMenu}
              className="block py-4 text-sm uppercase tracking-[0.22em] text-foreground/85 hover:text-primary"
            >
              {t.nav[source.key]}
            </Link>
            <div className="flex flex-col pb-3 pl-4">
              {source.children.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={context.closeMenu}
                  className="py-2 text-xs uppercase tracking-[0.2em] text-foreground/65 hover:text-primary"
                >
                  {t.nav[child.key]}
                </Link>
              ))}
            </div>
          </div>
        )
      }}
    />
  )
}
