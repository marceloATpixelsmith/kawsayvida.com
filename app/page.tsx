'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { HeroSlider } from '@/components/hero-slider'
import { TestimonialsSection } from '@/components/testimonials-section'
import { services } from '@/lib/services'
import { events } from '@/lib/events'
import { pick } from '@/lib/i18n/config'
import { useLanguage } from '@/lib/i18n/context'

export default function HomePage() {
  const { lang, t } = useLanguage()
  const featuredEvent = events[0]

  return (
    <>
      <HeroSlider />

      {/* Intro / philosophy */}
      <section className="bg-background py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2 lg:gap-20 lg:px-10">
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            <Image
              src="/images/about-portrait.jpg"
              alt={t.about.portraitAlt}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="mb-5 text-xs uppercase tracking-luxe text-primary">
              {t.home.introEyebrow}
            </p>
            <h2 className="font-serif text-4xl font-light leading-tight text-balance sm:text-5xl">
              {t.home.introTitle}
            </h2>
            <div className="mt-7 space-y-5 text-muted-foreground leading-relaxed">
              <p>{t.home.introP1}</p>
              <p>{t.home.introP2}</p>
            </div>
            <Link
              href="/about"
              className="group mt-9 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary"
            >
              {t.home.readFullStory}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section className="border-t border-border/50 bg-card py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-xl">
              <p className="mb-4 text-xs uppercase tracking-luxe text-primary">
                {t.home.offeringsEyebrow}
              </p>
              <h2 className="font-serif text-4xl font-light text-balance sm:text-5xl">
                {t.home.offeringsTitle}
              </h2>
            </div>
            <Link
              href="/services"
              className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary"
            >
              {t.home.viewAllServices}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <Link
                key={service.slug}
                href="/services"
                className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden border border-border/60"
              >
                <Image
                  src={service.image || '/placeholder.jpg'}
                  alt={pick(service.alt, lang)}
                  fill
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="relative z-10 p-6">
                  <p className="text-[0.65rem] uppercase tracking-[0.2em] text-primary">
                    {pick(service.tagline, lang)}
                  </p>
                  <h3 className="mt-2 font-serif text-2xl font-light leading-tight text-foreground">
                    {pick(service.title, lang)}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured event teaser */}
      {featuredEvent && (
        <section className="relative overflow-hidden bg-background py-24 lg:py-32">
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2 lg:px-10">
            <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden border border-border/60">
              <Image
                src={featuredEvent.image || '/placeholder.jpg'}
                alt={pick(featuredEvent.alt, lang)}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
            <div>
              <p className="mb-4 text-xs uppercase tracking-luxe text-primary">
                {t.home.eventEyebrow}
              </p>
              <h2 className="font-serif text-4xl font-light leading-tight text-balance sm:text-5xl">
                {pick(featuredEvent.title, lang)}
              </h2>
              <p className="mt-6 text-muted-foreground leading-relaxed">
                {pick(featuredEvent.intro, lang)}
              </p>
              <dl className="mt-8 grid grid-cols-2 gap-6 border-y border-border/50 py-6 text-sm">
                <div>
                  <dt className="text-xs uppercase tracking-[0.18em] text-primary">
                    {t.home.eventDateLabel}
                  </dt>
                  <dd className="mt-1 text-foreground/85">{pick(featuredEvent.date, lang)}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.18em] text-primary">
                    {t.home.eventLocationLabel}
                  </dt>
                  <dd className="mt-1 text-foreground/85">{pick(featuredEvent.location, lang)}</dd>
                </div>
              </dl>
              <Link
                href="/events"
                className="group mt-8 inline-flex items-center gap-2 bg-primary px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {t.home.viewEventDetails}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      <TestimonialsSection />

      {/* Closing CTA */}
      <section className="border-t border-border/50 bg-card py-24 text-center lg:py-28">
        <div className="mx-auto max-w-2xl px-6">
          <p className="mb-4 text-xs uppercase tracking-luxe text-primary">
            {t.home.closingEyebrow}
          </p>
          <h2 className="font-serif text-4xl font-light text-balance sm:text-5xl">
            {t.home.closingTitle}
          </h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            {t.home.closingText}
          </p>
          <Link
            href="/contact"
            className="mt-9 inline-flex items-center gap-2 bg-primary px-9 py-3.5 text-xs uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t.home.getInTouch}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  )
}
