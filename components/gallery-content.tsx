'use client'

import Image from 'next/image'
import { PageHeader } from '@/components/page-header'
import { galleryPhotos } from '@/lib/gallery'
import { pick } from '@/lib/i18n/config'
import { useLanguage } from '@/lib/i18n/context'

export function GalleryContent() {
  const { lang, t } = useLanguage()

  return (
    <>
      <PageHeader
        eyebrow={t.pageHeaders.gallery.eyebrow}
        title={t.pageHeaders.gallery.title}
        image="/images/gallery-header.jpg"
        alt={t.gallery.text}
      />

      <section className="bg-background py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-10">
          <p className="text-muted-foreground leading-relaxed">{t.gallery.text}</p>
        </div>

        <div className="mx-auto mt-12 max-w-7xl columns-1 gap-4 px-6 sm:columns-2 lg:columns-3 lg:px-10">
          {galleryPhotos.map((photo, i) => (
            <div
              key={photo.image}
              className="mb-4 break-inside-avoid overflow-hidden border border-border/60 bg-card"
            >
              <div className="relative w-full">
                <Image
                  src={photo.image}
                  alt={pick(photo.alt, lang)}
                  width={640}
                  height={480}
                  sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 100vw"
                  className="h-auto w-full object-cover transition-transform duration-700 hover:scale-105"
                  loading={i < 6 ? 'eager' : 'lazy'}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
