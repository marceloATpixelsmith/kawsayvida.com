'use client'

import Image from 'next/image'
import { Music } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { siteConfig } from '@/lib/site'
import { useLanguage } from '@/lib/i18n/context'

export function MedicineMusicContent() {
  const { t } = useLanguage()

  return (
    <>
      <PageHeader
        eyebrow={t.pageHeaders.medicineMusic.eyebrow}
        title={t.pageHeaders.medicineMusic.title}
        image="/images/medicine-music-header.jpg"
        alt={t.about.samaAlt}
      />

      <section className="bg-background pb-20 pt-10 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2 lg:gap-20 lg:px-10">
          <div>
            <p className="mb-4 text-xs uppercase tracking-luxe text-primary">
              {t.medicineMusic.eyebrow}
            </p>
            <h2 className="font-serif text-4xl font-light leading-tight text-balance sm:text-5xl">
              {t.medicineMusic.title}
            </h2>
            <div className="mt-7 space-y-5 text-muted-foreground leading-relaxed">
              <p>{t.medicineMusic.p1}</p>
              <p>{t.medicineMusic.p2}</p>
            </div>
          </div>
          <div className="relative aspect-[4/5] w-full overflow-hidden border border-border/60">
            <Image
              src="/images/medicine-music-shala.jpg"
              alt={t.about.samaAlt}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="border-t border-border/50 bg-card py-16 text-center lg:py-20">
        <div className="mx-auto max-w-xl px-6">
          <Music className="mx-auto h-8 w-8 text-primary" aria-hidden="true" />
          <h3 className="mt-5 font-serif text-2xl font-light text-foreground">
            {t.medicineMusic.listenTitle}
          </h3>
          <p className="mt-3 text-muted-foreground leading-relaxed">{t.medicineMusic.listenText}</p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
            <a
              href={siteConfig.social.soundcloud}
              target="_blank"
              rel="noreferrer"
              className="border border-foreground/40 px-6 py-3 text-xs uppercase tracking-[0.2em] text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Soundcloud
            </a>
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noreferrer"
              className="border border-foreground/40 px-6 py-3 text-xs uppercase tracking-[0.2em] text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Instagram
            </a>
            <a
              href={siteConfig.social.youtube}
              target="_blank"
              rel="noreferrer"
              className="border border-foreground/40 px-6 py-3 text-xs uppercase tracking-[0.2em] text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              YouTube
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
