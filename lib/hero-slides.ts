// ---------------------------------------------------------------------------
// Home page hero slider.
// To swap a photo: drop a new image in /public/images and update `image` below.
// You can add or remove slides freely — the slider adapts automatically.
//
// This site is bilingual. Each text field is a { en, es } object.
// ---------------------------------------------------------------------------

import type { Localized } from './i18n/config'

export type HeroSlide = {
  image: string
  alt: Localized
  eyebrow: Localized
  title: Localized
  subtitle: Localized
}

export const heroSlides: HeroSlide[] = [
  {
    image: '/images/hero-ceremony.jpg',
    alt: {
      en: 'A group seated in a ceremonial circle with candles and live music',
      es: 'Un grupo sentado en círculo ceremonial con velas y música en vivo',
    },
    eyebrow: { en: 'Sacred Space', es: 'Espacio Sagrado' },
    title: {
      en: 'Group & One-on-One Ceremonies',
      es: 'Ceremonias Grupales e Individuales',
    },
    subtitle: {
      en: 'Carefully held containers woven with Shipibo ikáros and live medicine song — in circle or one-on-one.',
      es: 'Espacios cuidadosamente sostenidos, tejidos con ikáros shipibo y canto de medicina en vivo — en círculo o de forma individual.',
    },
  },
  {
    image: '/images/hero-microdosing.jpg',
    alt: {
      en: 'A hand holding a tiny mushroom in a forest setting',
      es: 'Una mano sosteniendo un hongo pequeño en un entorno de bosque',
    },
    eyebrow: { en: 'Guided Path', es: 'Camino Guiado' },
    title: { en: 'Microdosing Program', es: 'Programa de Microdosis' },
    subtitle: {
      en: 'A structured, supported protocol to work gently and intentionally over time.',
      es: 'Un protocolo estructurado y acompañado para trabajar de forma suave e intencional a lo largo del tiempo.',
    },
  },
  {
    image: '/images/hero-jungle.jpg',
    alt: {
      en: 'A wide river reflecting dense green rainforest and sky',
      es: 'Un río ancho que refleja la selva verde y el cielo',
    },
    eyebrow: { en: 'Lineage & Roots', es: 'Linaje y Raíces' },
    title: { en: 'Rooted in the Amazon', es: 'Arraigado en la Amazonía' },
    subtitle: {
      en: 'A path honed one-on-one with the master plants and wisdom keepers of the jungle.',
      es: 'Un camino forjado de forma individual con las plantas maestras y los guardianes de la sabiduría de la selva.',
    },
  },
  {
    image: '/images/hero-chinese.jpg',
    alt: {
      en: 'Herbs, a mortar and pestle, and an acupuncture model on a wooden table',
      es: 'Hierbas, un mortero y un modelo de acupuntura sobre una mesa de madera',
    },
    eyebrow: { en: 'Ancient Wisdom', es: 'Sabiduría Ancestral' },
    title: { en: 'Chinese Medicine', es: 'Medicina China' },
    subtitle: {
      en: 'Acupuncture and herbal medicine to restore balance and support the whole body.',
      es: 'Acupuntura y herbolaria para restaurar el equilibrio y apoyar todo el cuerpo.',
    },
  },
]
