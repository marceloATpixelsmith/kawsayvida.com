// ---------------------------------------------------------------------------
// Events.
// The `image` is the SQUARE event poster shown on the Events page.
// Swap it per event: drop a new square image in /public/images and update `image`.
// `infoPacketUrl` and `registerUrl` power the two buttons.
//
// This site is bilingual. Text fields are { en, es } objects.
// Shared values (image, date, time, cost, urls) are the same in both languages.
// ---------------------------------------------------------------------------

import type { Localized } from './i18n/config'

export type EventItem = {
  title: Localized
  guidedBy: string
  supportedBy: Localized
  // Square poster image — changes with each event.
  image: string
  alt: Localized
  intro: Localized
  reasons: Localized<string[]>
  date: Localized
  time: Localized
  location: Localized
  cost: string
  costNote: Localized
  infoPacketUrl: string
  registerUrl: string
}

export const events: EventItem[] = [
  {
    title: {
      en: 'Teonanácatl: Medicine of the Heart',
      es: 'Teonanácatl: Medicina del Corazón',
    },
    guidedBy: 'Ameyalli',
    supportedBy: {
      en: 'Supported by Ronin Rao and a dream-team of psychedelic practitioners and medicine musicians.',
      es: 'Con el apoyo de Ronin Rao y un equipo excepcional de practicantes psicodélicos y músicos de medicina.',
    },
    image: '/images/event-poster.jpg',
    alt: {
      en: 'Square event poster for Teonanácatl: Medicine of the Heart',
      es: 'Póster cuadrado del evento Teonanácatl: Medicina del Corazón',
    },
    intro: {
      en: 'Join us for a transformative journey with this sacred medicine, lovingly held with medicine chants and medicine music by a skilled team of space-holders and musicians. This late-afternoon/evening ceremony is an invitation to take the medicine inward, to open the heart, and to surrender and align with love.',
      es: 'Acompáñanos en un viaje transformador con esta medicina sagrada, sostenido con amor a través de cantos y música de medicina por un equipo experimentado de facilitadores y músicos. Esta ceremonia de tarde/noche es una invitación a llevar la medicina hacia adentro, abrir el corazón, entregarse y alinearse con el amor.',
    },
    reasons: {
      en: [
        'Ameyalli is years into training with a very well-respected lineage of wisdom keepers from the Shipibo community in the Amazon, and is a medical professional with extensive experience assessing participants’ health.',
        'The team includes talented apprentices in the same lineage, trauma-informed psychologists, and practitioners of psychedelic-assisted therapies and integration.',
        'A free online 1-on-1 “First Time with Ameyalli” session (45 mins) to meet face to face, go over questions and concerns, and help prepare you.',
        'A free 1-on-1 30-minute post-ceremony / integration check-in after ceremony.',
        'Free ongoing weekly online group integration sessions to support participants in a group setting.',
        'Musically supported by the finest medicine musicians the Bay Area has to offer.',
        'These events are very tightly held — safety and comfort are our priority.',
        'We are openly committed to a secure, welcoming, and friendly environment, free from all racism, sexism, homophobia, transphobia, sexual misconduct, violence, bullying, and any form of abuse.',
      ],
      es: [
        'Ameyalli lleva años formándose con un linaje muy respetado de guardianes de la sabiduría de la comunidad Shipibo en la Amazonía, y es un profesional de la salud con amplia experiencia evaluando la salud de los participantes.',
        'El equipo incluye talentosos aprendices del mismo linaje, psicólogos con formación en trauma y practicantes de terapias psicodélicas asistidas e integración.',
        'Una sesión individual en línea gratuita “Primera Vez con Ameyalli” (45 min) para conocerse cara a cara, revisar preguntas e inquietudes y ayudarte a prepararte.',
        'Una sesión individual gratuita de integración de 30 minutos después de la ceremonia.',
        'Sesiones grupales de integración semanales, gratuitas y continuas, en línea, para acompañar a los participantes en grupo.',
        'Con el apoyo musical de los mejores músicos de medicina del Área de la Bahía.',
        'Estos eventos se sostienen con mucho cuidado — la seguridad y la comodidad son nuestra prioridad.',
        'Estamos comprometidos abiertamente con un entorno seguro, acogedor y amigable, libre de todo racismo, sexismo, homofobia, transfobia, conducta sexual inapropiada, violencia, acoso y cualquier forma de abuso.',
      ],
    },
    date: { en: 'July 25th, 2026', es: '25 de julio de 2026' },
    time: { en: '3pm – 10pm (approximately)', es: '3pm – 10pm (aproximadamente)' },
    location: {
      en: 'Oakland (exact location in registration confirmation)',
      es: 'Oakland (ubicación exacta en la confirmación de registro)',
    },
    cost: '$325',
    costNote: {
      en: 'Register with a 50% deposit — need-based scholarships available.',
      es: 'Regístrate con un depósito del 50% — hay becas disponibles según necesidad.',
    },
    infoPacketUrl: 'https://www.ameyalli.space/pdf/Teonanacatl_Experience_Guide.pdf',
    registerUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSd5qFy_cjeFwkK0MXfqnMsQ6yulHB3sLYBj23V-9Vv_cY_UZQ/viewform?usp=sf_link',
  },
]
