// ---------------------------------------------------------------------------
// Testimonials (bilingual).
// Add/remove/modify objects in `writtenTestimonials`.
// Each text field is localized: { en: "...", es: "..." }.
// ---------------------------------------------------------------------------

import type { Localized } from '@/lib/i18n/config'

export type WrittenTestimonial = {
  quote: Localized
  author: string
}

export const writtenTestimonials: WrittenTestimonial[] = [
  {
    quote: {
      en: 'I have been participating for years in the ceremonies of Germán and Lupita. They are an exemplary couple, congruent and personally and spiritually accomplished. Their music and their songs are of a very high vibration that lead us to a very deep healing and unimaginable experiences!',
      es: 'He estado participando por años en las ceremonias de Germán y Lupita. Son una pareja ejemplar, congruente y realizada personal y espiritualmente. ¡Su música y sus cantos son de una vibración muy alta que nos llevan a una sanación muy profunda y experiencias inimaginables!',
    },
    author: 'Samuel',
  },
  {
    quote: {
      en: 'I am fortunate to have met Germán and Lupita more than 5 years ago. They have been an irreplaceable part of my path. Thanks to them internal issues came to light that probably would have taken me a long time to discover. I’m very grateful to them for all the healing.',
      es: 'Tengo la fortuna de haber conocido a Germán y Lupita hace más de 5 años. Han sido una parte insustituible de mi camino. Gracias a ellos salieron a la luz asuntos internos que probablemente me habría tomado mucho tiempo descubrir. Les estoy muy agradecido por toda la sanación.',
    },
    author: 'Alvaro',
  },
  {
    quote: {
      en: 'I have been in contact with the plant for 16 years with different lineages, ceremony designs and traditions. I can say that Germán and Lupita are the most congruent servers of medicine, impeccable and with a high vibration, with the clarity of crystal. I recommend them a lot because this path is becoming more travelled and very few people can contain space with the same love and strength.',
      es: 'He estado en contacto con la planta por 16 años con diferentes linajes, diseños de ceremonia y tradiciones. Puedo decir que Germán y Lupita son los servidores de medicina más congruentes, impecables y con una vibración alta, con la claridad del cristal. Los recomiendo mucho porque este camino se está transitando cada vez más y muy pocas personas pueden sostener el espacio con el mismo amor y fuerza.',
    },
    author: 'Andrea',
  },
  {
    quote: {
      en: 'The music of Germán and Lupita is sublime and there is no better element to accompany you in your work with Abuelita Ayahuasca.',
      es: 'La música de Germán y Lupita es sublime y no hay mejor elemento para acompañarte en tu trabajo con la Abuelita Ayahuasca.',
    },
    author: 'Marcelo',
  },
]

// No YouTube testimonial videos were found on the original site.
export type VideoTestimonial = { name: string; youTubeId: string }
export const videoTestimonials: VideoTestimonial[] = []
