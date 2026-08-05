// ---------------------------------------------------------------------------
// Services. Order in this array = order shown on the Services page.
// To reorder, add, or remove a service, edit this list.
// To swap a photo, drop a new file in /public/images and update `image`.
//
// This site is bilingual. Each text field is a { en, es } object.
// Edit the English under `en` and the Spanish under `es`.
// ---------------------------------------------------------------------------

import type { Localized } from './i18n/config'

export type Service = {
  slug: string
  title: Localized
  tagline: Localized
  description: Localized
  image: string
  alt: Localized
}

export const services: Service[] = [
  {
    slug: 'group-ceremonies',
    title: { en: 'Group Ceremonies', es: 'Ceremonias Grupales' },
    tagline: { en: 'Held in sacred circle', es: 'Sostenidas en círculo sagrado' },
    description: {
      en: 'Group ceremonies, with or without cacao. These gatherings begin with the channeled singing of Shipibo ikáros (chants) and transition into live medicine music. They are very well contained by experienced space holders, and all participants are thoroughly vetted for both mental and physical health prior to approval.',
      es: 'Ceremonias grupales, con o sin cacao. Estos encuentros comienzan con el canto canalizado de ikáros shipibo (cantos) y dan paso a música de medicina en vivo. Están muy bien contenidas por facilitadores con experiencia, y todos los participantes son cuidadosamente evaluados en su salud mental y física antes de ser aprobados.',
    },
    image: '/images/service-group.jpg',
    alt: {
      en: 'A group seated in a ceremonial circle with candles and live music',
      es: 'Un grupo sentado en círculo ceremonial con velas y música en vivo',
    },
  },
  {
    slug: 'one-on-one-ceremonies',
    title: { en: 'One-on-One Ceremonies', es: 'Ceremonias Individuales' },
    tagline: { en: 'Personalized & private', es: 'Personalizadas y privadas' },
    description: {
      en: 'A personalized medicine song session for opening the heart, clearing energetic and emotional blockages, aligning thoughts and energies, clearing unwanted energies, and connecting to light worlds. Offered in-person or online, and tailored entirely to you.',
      es: 'Una sesión personalizada de canto de medicina para abrir el corazón, liberar bloqueos energéticos y emocionales, alinear pensamientos y energías, limpiar energías no deseadas y conectar con mundos de luz. Se ofrece de forma presencial o en línea, y se adapta por completo a ti.',
    },
    image: '/images/service-oneonone.jpg',
    alt: {
      en: 'Ameyalli seated beside a participant during a one-on-one healing session',
      es: 'Ameyalli sentado junto a una participante durante una sesión individual de sanación',
    },
  },
  {
    slug: 'microdosing-coaching',
    title: { en: 'Microdosing Coaching', es: 'Acompañamiento de Microdosis' },
    tagline: { en: 'Guided & intentional', es: 'Guiado e intencional' },
    description: {
      en: 'Thoughtful, one-on-one guidance for those exploring a microdosing practice. Together we build a safe, intentional protocol with regular check-ins, integration support, and grounded coaching to help you track your process and stay aligned with your goals.',
      es: 'Acompañamiento individual y cuidadoso para quienes exploran una práctica de microdosis. Juntos construimos un protocolo seguro e intencional, con seguimientos regulares, apoyo de integración y acompañamiento con los pies en la tierra para ayudarte a observar tu proceso y mantenerte alineado con tus objetivos.',
    },
    image: '/images/service-microdosing.jpg',
    alt: {
      en: 'Measured mushroom powder, a grinder, and a small tin on a wooden table',
      es: 'Polvo de hongos medido, un molinillo y una lata pequeña sobre una mesa de madera',
    },
  },
  {
    slug: 'chinese-medicine',
    title: { en: 'Chinese Medicine', es: 'Medicina China' },
    tagline: { en: 'Body, mind & spirit', es: 'Cuerpo, mente y espíritu' },
    description: {
      en: 'Acupuncture, Chinese herbal medicine, and Qigong classes to help with both internal-medicine concerns and musculo-skeletal issues — complementing the sound-healing work with time-honored therapies for whole-body balance.',
      es: 'Acupuntura, herbolaria china y clases de Qigong para atender tanto temas de medicina interna como problemas músculo-esqueléticos — complementando el trabajo de sanación de sonido con terapias tradicionales para el equilibrio de todo el cuerpo.',
    },
    image: '/images/service-chinese-medicine.jpg',
    alt: {
      en: 'Chinese herbs, acupuncture needles, and a mortar and pestle on a wooden table',
      es: 'Hierbas chinas, agujas de acupuntura y un mortero sobre una mesa de madera',
    },
  },
]
