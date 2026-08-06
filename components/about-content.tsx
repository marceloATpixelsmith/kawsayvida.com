'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { useLanguage } from '@/lib/i18n/context'

export function AboutContent() {
  const { t } = useLanguage()

  return (
    <>
      <PageHeader
        eyebrow={t.pageHeaders.about.eyebrow}
        title={t.pageHeaders.about.title}
        image="/images/about-portrait.jpg"
        alt={t.about.headerAlt}
      />

      <section className="bg-background pb-20 pt-10 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[1fr_0.8fr] lg:gap-20 lg:px-10">
          <div className="space-y-6 text-lg font-light leading-relaxed text-foreground/85">
            <p>{t.about.introP1}</p>
            <p>{t.about.introP2}</p>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden border border-border/60 lg:mx-0 lg:w-full lg:justify-self-end">
            <Image
              src="/images/about-embrace.jpg"
              alt={t.about.embraceAlt}
              fill
              sizes="(min-width: 1024px) 24vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Ayahuapu — Medicine Music */}
      <section className="border-t border-border/50 bg-card py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2 lg:gap-20 lg:px-10">
          <div className="relative order-2 aspect-[16/9] w-full overflow-hidden border border-border/60 lg:order-1">
            <Image
              src="/images/about-ayahuapu.jpg"
              alt={t.about.samaAlt}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="order-1 lg:order-2">
            <p className="mb-4 text-xs uppercase tracking-luxe text-primary">
              {t.about.lineageEyebrow}
            </p>
            <h2 className="font-serif text-4xl font-light leading-tight text-balance sm:text-5xl">
              {t.about.lineageTitle}
            </h2>
            <div className="mt-7 space-y-5 text-muted-foreground leading-relaxed">
              <p>{t.about.lineageP1}</p>
              <p>{t.about.lineageP2}</p>
              <p>{t.about.lineageP3}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-background py-20 text-center lg:py-24">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="font-serif text-3xl font-light text-balance sm:text-4xl">
            {t.about.cta.title}
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">{t.about.cta.text}</p>
          <Link
            href="/retreats"
            className="group mt-8 inline-flex items-center gap-2 bg-primary px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t.about.cta.button}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </>
  )
}
