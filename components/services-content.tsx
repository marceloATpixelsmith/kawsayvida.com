'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { services } from '@/lib/services'
import { cn } from '@/lib/utils'
import { pick } from '@/lib/i18n/config'
import { useLanguage } from '@/lib/i18n/context'

export function ServicesContent() {
  const { lang, t } = useLanguage()

  return (
    <>
      <PageHeader
        eyebrow={t.pageHeaders.services.eyebrow}
        title={t.pageHeaders.services.title}
        image="/images/hero-services.jpg"
        alt="Acoustic guitar and violin decorated with flowers on a wooden floor"
      />

      <section className="bg-background">
        {services.map((service, i) => {
          const reversed = i % 2 === 1
          return (
            <div
              key={service.slug}
              className={cn(
                'border-b border-border/50',
                i % 2 === 1 ? 'bg-card' : 'bg-background',
              )}
            >
              <div
                className={cn(
                  'mx-auto grid max-w-7xl items-center gap-10 px-6 pb-16 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-24',
                  i === 0 ? 'pt-10 lg:pt-24' : 'pt-16',
                )}
              >
                <div
                  className={cn(
                    'relative aspect-[4/3] w-full overflow-hidden border border-border/60',
                    reversed ? 'lg:order-2' : 'lg:order-1',
                  )}
                >
                  <Image
                    src={service.image || '/placeholder.jpg'}
                    alt={pick(service.alt, lang)}
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
                      {pick(service.tagline, lang)}
                    </span>
                  </div>
                  <h2 className="mt-6 font-serif text-4xl font-light leading-tight text-balance sm:text-5xl">
                    {pick(service.title, lang)}
                  </h2>
                  <p className="mt-6 text-muted-foreground leading-relaxed">
                    {pick(service.description, lang)}
                  </p>
                  <Link
                    href="/contact"
                    className="group mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary"
                  >
                    {t.services.inquire}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
            {t.services.cta.title}
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">{t.services.cta.text}</p>
          <Link
            href="/contact"
            className="group mt-8 inline-flex items-center gap-2 bg-primary px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t.services.cta.button}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </>
  )
}
