'use client'

import Image from 'next/image'
import { Mail } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { ContactForm } from '@/components/contact-form'
import { siteConfig } from '@/lib/site'
import { useLanguage } from '@/lib/i18n/context'

export function ContactContent() {
  const { t } = useLanguage()

  return (
    <>
      <PageHeader
        eyebrow={t.pageHeaders.contact.eyebrow}
        title={t.pageHeaders.contact.title}
        image="/images/contact-bg.jpg"
        alt="Blue-white mycelium spreading across dark wood"
      />

      <section className="bg-background pb-20 pt-10 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-10">
          <div>
            <p className="mb-4 text-xs uppercase tracking-luxe text-primary">{t.contact.eyebrow}</p>
            <h2 className="font-serif text-4xl font-light leading-tight text-balance sm:text-5xl">
              {t.contact.title}
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">{t.contact.text}</p>

            <div className="mt-10 space-y-6">
              <a
                href={`mailto:${siteConfig.email}`}
                className="group flex items-center gap-4 text-foreground/85 transition-colors hover:text-primary"
              >
                <span className="flex h-11 w-11 items-center justify-center border border-border/60 text-primary">
                  <Mail className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-xs uppercase tracking-[0.18em] text-primary">
                    {t.contact.emailLabel}
                  </span>
                  <span className="text-sm">{siteConfig.email}</span>
                </span>
              </a>
            </div>

            <div className="relative mt-10 hidden aspect-[4/3] w-full overflow-hidden border border-border/60 lg:block">
              <Image
                src="/images/hero-jungle.jpg"
                alt="A wide river reflecting dense green rainforest and sky"
                fill
                sizes="40vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="border border-border/60 bg-card p-7 sm:p-10">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  )
}
