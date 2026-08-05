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
    image: '/images/hero-retreats.jpg',
    alt: {
      en: 'A path through the jungle leading toward a retreat house at dusk',
      es: 'Un camino en la selva que conduce hacia una casa de retiro al atardecer',
    },
    eyebrow: { en: 'Deep Healing — Ayahuasca Medicine', es: 'Sanación Profunda — Medicina Ayahuasca' },
    title: { en: 'Teacher Plant Retreats', es: 'Retiros de Plantas Maestras' },
    subtitle: {
      en: 'Ayahuasca ceremonies, group integration, meditation and Tibetan Yoga, held by German Virguez and Lupita Castro since 2007.',
      es: 'Ceremonias de Ayahuasca, integración grupal, meditación y yoga tibetano, sostenidos por German Virguez y Lupita Castro desde 2007.',
    },
  },
  {
    image: '/images/hero-sacred-sites.jpg',
    alt: {
      en: 'The Vilcanota river running through the Sacred Valley of Cusco, Perú',
      es: 'El río Vilcanota atravesando el Valle Sagrado de Cusco, Perú',
    },
    eyebrow: { en: 'Sacred Sites', es: 'Sitios Sagrados' },
    title: { en: 'Perú & México', es: 'Perú y México' },
    subtitle: {
      en: 'Retreats held in the Sacred Valley, Cusco, Perú and in Valle de Bravo, México.',
      es: 'Retiros realizados en el Valle Sagrado, Cusco, Perú y en Valle de Bravo, México.',
    },
  },
  {
    image: '/images/hero-ayahuapu.jpg',
    alt: {
      en: 'German and Lupita performing medicine music together in ceremony',
      es: 'German y Lupita interpretando música medicina juntos en ceremonia',
    },
    eyebrow: { en: 'Medicine Music', es: 'Música Medicina' },
    title: { en: 'Ayahuapu', es: 'Ayahuapu' },
    subtitle: {
      en: 'Original medicine music, blending the melodies of Amazon and Andes, East and West.',
      es: 'Música medicina original, que fusiona las melodías de la Amazonía y los Andes, Oriente y Occidente.',
    },
  },
]
