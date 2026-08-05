'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { heroSlides } from '@/lib/hero-slides'
import { pick } from '@/lib/i18n/config'
import { useLanguage } from '@/lib/i18n/context'

const AUTOPLAY_MS = 6500

export function HeroSlider() {
  const { lang, t } = useLanguage()
  const [index, setIndex] = useState(0)
  const count = heroSlides.length

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + count) % count),
    [count],
  )

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS)
    return () => clearInterval(id)
  }, [count])

  return (
    <section className="relative h-[100svh] min-h-[620px] w-full overflow-hidden">
      {heroSlides.map((slide, i) => (
        <div
          key={slide.image}
          className={cn(
            'absolute inset-0 transition-opacity duration-1000 ease-out',
            i === index ? 'opacity-100' : 'opacity-0',
          )}
          aria-hidden={i !== index}
        >
          <Image
            src={slide.image || '/placeholder.jpg'}
            alt={pick(slide.alt, lang)}
            fill
            priority={i === 0}
            sizes="100vw"
            className={cn(
              'object-cover transition-transform duration-[7000ms] ease-out',
              i === index ? 'scale-105' : 'scale-100',
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/32 to-background/28" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/42 to-transparent" />
        </div>
      ))}

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-6 lg:px-10">
        <div className="max-w-2xl">
          {heroSlides.map((slide, i) => (
            <div
              key={slide.image}
              className={cn(
                'transition-all duration-700',
                i === index
                  ? 'opacity-100 translate-y-0'
                  : 'pointer-events-none absolute opacity-0 translate-y-4',
              )}
              aria-hidden={i !== index}
            >
              {i === index && (
                <>
                  <p className="mb-5 text-xs uppercase tracking-luxe text-primary">
                    {pick(slide.eyebrow, lang)}
                  </p>
                  <h1 className="font-serif text-5xl font-light leading-[1.05] text-balance text-foreground sm:text-6xl lg:text-7xl">
                    {pick(slide.title, lang)}
                  </h1>
                  <p className="mt-6 max-w-xl text-lg font-light leading-relaxed text-foreground/85">
                    {pick(slide.subtitle, lang)}
                  </p>
                </>
              )}
            </div>
          ))}

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/retreats"
              className="group inline-flex items-center gap-2 bg-primary px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {t.hero.exploreOfferings}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/retreats/registration"
              className="inline-flex items-center gap-2 border border-foreground/40 px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {t.hero.upcomingEvents}
            </Link>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 left-0 right-0 z-10 mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
        <div className="flex gap-2.5">
          {heroSlides.map((slide, i) => (
            <button
              key={slide.image}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`${t.hero.goToSlide} ${i + 1}`}
              className={cn(
                'h-1 rounded-full transition-all duration-300',
                i === index ? 'w-10 bg-primary' : 'w-4 bg-foreground/30 hover:bg-foreground/60',
              )}
            />
          ))}
        </div>
        <div className="hidden gap-3 sm:flex">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label={t.hero.prevSlide}
            className="flex h-11 w-11 items-center justify-center border border-foreground/30 text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label={t.hero.nextSlide}
            className="flex h-11 w-11 items-center justify-center border border-foreground/30 text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
