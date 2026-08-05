// ---------------------------------------------------------------------------
// Testimonials (bilingual).
// - Written testimonials: add/remove/modify objects in `writtenTestimonials`.
//   Each text field is localized: { en: "...", es: "..." }.
// - Video testimonials: add/remove YouTube IDs in `videoTestimonials`.
//   The `youTubeId` is the part after "watch?v=" or "youtu.be/" in a URL.
// ---------------------------------------------------------------------------

import type { Localized } from '@/lib/i18n/config'

export type WrittenTestimonial = {
  quote: Localized
  author: string
}

export type VideoTestimonial = {
  name: string
  youTubeId: string
}

export const writtenTestimonials: WrittenTestimonial[] = [
  {
    quote: {
      en: "He is patient, focused and attentive to addressing physical and mental obstacles. This healing music that comes through Ameyalli's singing cleared the mental clutter that clung to the back of my mind in such a short time. The songs are beautiful and the results are hard to believe. This freedom — from my mind — allowed me the clarity to be present. It's a wonderful experience!",
      es: 'Es paciente, concentrado y atento para abordar los obstáculos físicos y mentales. Esta música sanadora que llega a través del canto de Ameyalli despejó en muy poco tiempo el desorden mental que se aferraba al fondo de mi mente. Las canciones son hermosas y los resultados son difíciles de creer. Esta libertad — de mi propia mente — me dio la claridad para estar presente. ¡Es una experiencia maravillosa!',
    },
    author: 'Fiona C.',
  },
  {
    quote: {
      en: 'Ameyalli creates a genuinely safe and nurturing space for healing! Before, during, and after the ceremony his thoughtfulness, professionalism, and care are apparent — and he is an exceptional guide. Deep gratitude, Ameyalli!',
      es: '¡Ameyalli crea un espacio verdaderamente seguro y acogedor para la sanación! Antes, durante y después de la ceremonia, su atención, profesionalismo y cuidado son evidentes — y es un guía excepcional. ¡Profunda gratitud, Ameyalli!',
    },
    author: 'Sherry M.',
  },
  {
    quote: {
      en: "This was my first group ceremony with plant medicine and it exceeded my expectations. Set-up was comfortable, enjoyed combining medicine with cacao. Really enjoyed Ameyalli's beautiful singing and musical instrument live. It was magical and I highly recommend!!",
      es: 'Esta fue mi primera ceremonia grupal con medicina de plantas y superó mis expectativas. El espacio era cómodo, disfruté combinar la medicina con el cacao. Disfruté muchísimo el hermoso canto de Ameyalli y su instrumento en vivo. Fue mágico y lo recomiendo mucho.',
    },
    author: 'J. Han',
  },
]

// Replace these placeholder IDs with your real YouTube testimonial video IDs.
export const videoTestimonials: VideoTestimonial[] = [
  { name: 'S. Manis', youTubeId: '' },
  { name: 'The Anointer', youTubeId: '' },
  { name: 'Stefan T.', youTubeId: '' },
]
