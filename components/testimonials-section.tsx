'use client'

import { Quote } from 'lucide-react'
import { videoTestimonials, writtenTestimonials } from '@/lib/testimonials'
import { pick } from '@/lib/i18n/config'
import { useLanguage } from '@/lib/i18n/context'

export function TestimonialsSection() {
  const { lang, t } = useLanguage()
  const videos = videoTestimonials.filter((v) => v.youTubeId.trim().length > 0)

  return (
    <section className="bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-xs uppercase tracking-luxe text-primary">
            {t.testimonials.eyebrow}
          </p>
          <h2 className="font-serif text-4xl font-light text-balance sm:text-5xl">
            {t.testimonials.title}
          </h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            {t.testimonials.text}
          </p>
        </div>

        {videos.length > 0 && (
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <div
                key={video.youTubeId}
                className="overflow-hidden border border-border/60 bg-card"
              >
                <div className="relative aspect-video w-full">
                  <iframe
                    className="absolute inset-0 h-full w-full"
                    src={`https://www.youtube.com/embed/${video.youTubeId}`}
                    title={video.name}
                    loading="lazy"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <p className="px-5 py-4 text-sm uppercase tracking-[0.18em] text-muted-foreground">
                  {video.name}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {writtenTestimonials.map((item) => (
            <figure
              key={item.author}
              className="flex flex-col border border-border/60 bg-card p-8"
            >
              <Quote className="h-8 w-8 text-primary/70" aria-hidden="true" />
              <blockquote className="mt-5 flex-1 text-sm leading-relaxed text-foreground/85">
                {pick(item.quote, lang)}
              </blockquote>
              <figcaption className="mt-6 font-serif text-lg text-primary">
                {item.author}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
