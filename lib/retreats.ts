// ---------------------------------------------------------------------------
// Retreats. Order in this array = order shown on the Retreats page.
// To reorder, add, or remove a retreat, edit this list.
// To swap a photo, drop a new file in /public/images and update `image`.
//
// This site is bilingual. Each text field is a { en, es } object.
// Edit the English under `en` and the Spanish under `es`.
// ---------------------------------------------------------------------------

import type { Localized } from './i18n/config'

export type Retreat = {
  slug: string
  title: Localized
  location: Localized
  dates: Localized
  image: string
  alt: Localized
  includes: Localized<string[]>
}

export const retreats: Retreat[] = [
  {
    slug: 'sacred-valley-peru-august-2026',
    title: { en: 'Offering to the Heart', es: 'Ofrenda al Corazón' },
    location: { en: 'Sacred Valley, Perú', es: 'Valle Sagrado, Perú' },
    dates: { en: 'August 1st to 7th, 2026', es: '1 al 7 de agosto, 2026' },
    image: '/images/retreat-sacred-valley.jpg',
    alt: {
      en: 'A stone terrace overlooking the Sacred Valley near Cusco, Perú',
      es: 'Una terraza de piedra con vista al Valle Sagrado cerca de Cusco, Perú',
    },
    includes: {
      en: [
        'Lodging (6 Nights, 7 Days)',
        'All meals and beverages (Vegetarian)',
        '3 Ayahuasca Ceremonies (2 nighttime and 1 daytime)',
        'Offering Ceremony (Guided by a Quero priest)',
        'Group integration, Tibetan meditation and yoga practices',
        'Individual sessions with retreat guides (as needed)',
      ],
      es: [
        'Hospedaje (6 Noches, 7 días)',
        'Todos los alimentos y bebidas (Dieta vegetariana)',
        '3 Ceremonias de Ayahuasca (2 Nocturna y 1 Diurna)',
        'Ceremonia de ofrenda (Guiada por sacerdote Quero)',
        'Integraciones grupales, prácticas de meditación y yoga tibetano',
        'Sesiones de uno a uno con los guías del retiro (si es necesario)',
      ],
    },
  },
  {
    slug: 'valle-de-bravo-october-2026',
    title: { en: 'Offering to the Heart', es: 'Ofrenda al Corazón' },
    location: { en: 'Espacio Khungi, Valle de Bravo', es: 'Espacio Khungi, Valle de Bravo' },
    dates: { en: 'October 15th to 18th, 2026', es: '15 al 18 de octubre, 2026' },
    image: '/images/retreat-valle-de-bravo-oct.jpg',
    alt: {
      en: 'A ceremonial retreat house in Valle de Bravo, México, surrounded by pines',
      es: 'Una casa de retiro ceremonial en Valle de Bravo, México, rodeada de pinos',
    },
    includes: {
      en: [
        'Lodging (3 Nights, 4 Days)',
        'All meals and beverages (Organic vegetarian)',
        '2 Ayahuasca Ceremonies (1 nighttime and 1 daytime)',
        'Tibetan meditation and yoga practices',
        'Group integration',
        'Individual sessions with retreat guides (as needed)',
      ],
      es: [
        'Hospedaje (3 Noches, 4 días)',
        'Todos los alimentos y bebidas (Dieta vegetariana orgánica)',
        '2 ceremonias de Ayahuasca (1 nocturna y 1 diurna)',
        'Práctica de meditación y yoga tibetano',
        'Integraciones grupales',
        'Sesiones de uno a uno con los guías del retiro (si es necesario)',
      ],
    },
  },
  {
    slug: 'valle-de-bravo-december-2026',
    title: { en: 'Offering to the Heart', es: 'Ofrenda al Corazón' },
    location: { en: 'Espacio Khungi, Valle de Bravo', es: 'Espacio Khungi, Valle de Bravo' },
    dates: { en: 'December 12th to 17th, 2026', es: '12 al 17 de diciembre, 2026' },
    image: '/images/retreat-valle-de-bravo-dec.jpg',
    alt: {
      en: 'Candlelight and offerings arranged for an Ayahuasca ceremony',
      es: 'Velas y ofrendas dispuestas para una ceremonia de Ayahuasca',
    },
    includes: {
      en: [
        'Lodging (4 Nights, 5 Days)',
        'All meals and beverages (Organic vegetarian)',
        '3 Ayahuasca Ceremonies (2 nighttime and 1 daytime)',
        'Tibetan meditation and yoga practices',
        'Group integration',
        'Individual sessions with retreat guides (as needed)',
      ],
      es: [
        'Hospedaje (4 Noches, 5 días)',
        'Todos los alimentos y bebidas (Dieta vegetariana orgánica)',
        '2 ceremonias de Ayahuasca (1 nocturna y 1 diurna)',
        'Práctica de meditación y yoga tibetano',
        'Integraciones grupales',
        'Sesiones de uno a uno con los guías del retiro (si es necesario)',
      ],
    },
  },
]
