'use client'

import Image from 'next/image'
import { ArrowUpRight, Calendar, Clock, Download, MapPin } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { events } from '@/lib/events'
import { pick } from '@/lib/i18n/config'
import { useLanguage } from '@/lib/i18n/context'

export function EventsContent() {
  const { lang, t } = useLanguage()

  return (
    <>
      <PageHeader
        eyebrow={t.pageHeaders.events.eyebrow}
        title={t.pageHeaders.events.title}
        image="/images/hero-ceremony.jpg"
        alt="A group seated in a ceremonial circle with candles and live music"
      />

      <section className="bg-background pb-20 pt-10 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          {events.length === 0 ? (
            <p className="text-center text-lg text-muted-foreground">{t.events.none}</p>
          ) : (
            events.map((event, i) => (
              <article
                key={i}
                className="grid gap-12 lg:grid-cols-[0.85fr_1fr] lg:gap-16"
              >
                {/* Square event image — changes with each event */}
                <div className="lg:sticky lg:top-28 lg:self-start">
                  <div className="relative aspect-square w-full overflow-hidden border border-border/60">
                    <Image
                      src={event.image || '/placeholder.jpg'}
                      alt={pick(event.alt, lang)}
                      fill
                      sizes="(min-width: 1024px) 42vw, 100vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="mt-6 space-y-px border border-border/60 bg-card">
                    <Detail icon={<Calendar className="h-4 w-4" />} label={t.events.dateLabel} value={pick(event.date, lang)} />
                    <Detail icon={<Clock className="h-4 w-4" />} label={t.events.timeLabel} value={pick(event.time, lang)} />
                    <Detail icon={<MapPin className="h-4 w-4" />} label={t.events.locationLabel} value={pick(event.location, lang)} />
                  </div>

                  <div className="mt-6 border border-border/60 bg-card p-6 text-center">
                    <p className="font-serif text-4xl text-primary">{event.cost}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{pick(event.costNote, lang)}</p>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <a
                      href={event.registerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex flex-1 items-center justify-center gap-2 bg-primary px-6 py-3.5 text-xs uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      {t.events.register}
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                    <a
                      href={event.infoPacketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex flex-1 items-center justify-center gap-2 border border-foreground/40 px-6 py-3.5 text-xs uppercase tracking-[0.2em] text-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      <Download className="h-4 w-4" />
                      {t.events.infoPacket}
                    </a>
                  </div>
                </div>

                {/* Event details */}
                <div>
                  <h2 className="font-serif text-4xl font-light leading-tight text-balance sm:text-5xl">
                    {pick(event.title, lang)}
                  </h2>
                  <p className="mt-4 text-sm uppercase tracking-[0.18em] text-primary">
                    {t.events.guidedBy} {event.guidedBy}
                  </p>
                  <p className="mt-2 text-muted-foreground">{pick(event.supportedBy, lang)}</p>

                  <p className="mt-8 text-lg font-light leading-relaxed text-foreground/85">
                    {pick(event.intro, lang)}
                  </p>

                  <h3 className="mt-12 font-serif text-2xl font-light text-primary">
                    {t.events.whyTitle}
                  </h3>
                  <ul className="mt-6 space-y-4">
                    {pick(event.reasons, lang).map((reason, idx) => (
                      <li key={idx} className="flex gap-4 text-muted-foreground leading-relaxed">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </>
  )
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-4 border-b border-border/50 px-6 py-4 last:border-none">
      <span className="mt-0.5 text-primary">{icon}</span>
      <div>
        <p className="text-[0.65rem] uppercase tracking-[0.2em] text-primary">{label}</p>
        <p className="mt-0.5 text-sm text-foreground/85">{value}</p>
      </div>
    </div>
  )
}
