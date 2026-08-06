'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { retreats } from '@/lib/retreats'
import { cn } from '@/lib/utils'
import { pick } from '@/lib/i18n/config'
import { useLanguage } from '@/lib/i18n/context'

export function RetreatsContent() {
  const { lang, t } = useLanguage()

  return (
    <>
      <PageHeader
        eyebrow={t.pageHeaders.retreats.eyebrow}
        title={t.pageHeaders.retreats.title}
        image="/images/retreats-header.jpg"
        alt={t.about.headerAlt}
      />

      {/* Intro */}
      <section className="bg-background pb-16 pt-10 lg:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-10">
          <h1 className="font-serif text-4xl font-light text-balance sm:text-5xl">
            {t.retreats.introTitle}
          </h1>
          <div className="mt-7 space-y-5 text-left text-muted-foreground leading-relaxed sm:text-center">
            <p>{t.retreats.introP1}</p>
            <p>{t.retreats.introP2}</p>
            <p>{t.retreats.introP3}</p>
          </div>
        </div>
      </section>

      <section className="border-t border-border/50 bg-card">
        <div className="mx-auto max-w-7xl px-6 pt-14 lg:px-10">
          <p className="text-xs uppercase tracking-luxe text-primary">{t.retreats.nextRetreats}</p>
        </div>
        {retreats.map((retreat, i) => {
          const reversed = i % 2 === 1
          return (
            <div key={retreat.slug} className="border-b border-border/50">
              <div
                className={cn(
                  'mx-auto grid max-w-7xl items-center gap-10 px-6 pb-16 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-16',
                  i === 0 ? 'pt-10 lg:pt-10' : 'pt-16',
                )}
              >
                <div
                  className={cn(
                    'relative aspect-[4/3] w-full overflow-hidden border border-border/60',
                    reversed ? 'lg:order-2' : 'lg:order-1',
                  )}
                >
                  <Image
                    src={retreat.image || '/placeholder.jpg'}
                    alt={pick(retreat.alt, lang)}
                    fill
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className={cn(reversed ? 'lg:order-1' : 'lg:order-2')}>
                  <div className="flex items-center gap-4">
                    <span className="font-serif text-2xl text-primary/70">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="h-px flex-1 bg-border" />
                    <span className="text-[0.65rem] uppercase tracking-[0.2em] text-primary">
                      {pick(retreat.location, lang)}
                    </span>
                  </div>
                  <h2 className="mt-6 font-serif text-4xl font-light leading-tight text-balance sm:text-5xl">
                    {pick(retreat.title, lang)}
                  </h2>
                  <p className="mt-3 text-sm uppercase tracking-[0.18em] text-muted-foreground">
                    {pick(retreat.dates, lang)}
                  </p>
                  <p className="mt-6 text-xs uppercase tracking-[0.18em] text-primary">
                    {t.retreats.includesLabel}
                  </p>
                  <ul className="mt-4 space-y-3">
                    {pick(retreat.includes, lang).map((bullet, idx) => (
                      <li key={idx} className="flex gap-3 text-muted-foreground leading-relaxed">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {bullet.html ? (
                          <span dangerouslySetInnerHTML={{ __html: bullet.content }} />
                        ) : (
                          <span>{bullet.content}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={{ pathname: '/retreats/registration', query: { event: retreat.slug } }}
                    className="group mt-8 inline-flex items-center gap-2 bg-primary px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    {t.retreats.inquire}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </section>

      {/* CTA */}
      <section className="bg-background py-20 text-center lg:py-24">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="font-serif text-3xl font-light text-balance sm:text-4xl">
            {t.retreats.cta.title}
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">{t.retreats.cta.text}</p>
          <Link
            href="/contact"
            className="group mt-8 inline-flex items-center gap-2 bg-primary px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t.retreats.cta.button}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </>
  )
}
