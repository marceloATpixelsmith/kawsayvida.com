// ---------------------------------------------------------------------------
// Gallery photos. Add/remove entries to change what's shown on /gallery.
// This site is bilingual — each `alt` is a { en, es } object.
// ---------------------------------------------------------------------------

import type { Localized } from './i18n/config'

export type GalleryPhoto = {
  image: string
  alt: Localized
}

export const galleryPhotos: GalleryPhoto[] = [
  {
    image: '/images/gallery/gallery-16-casa-retiro.jpg',
    alt: { en: 'Exterior view of the retreat house', es: 'Vista exterior de la casa de retiro' },
  },
  {
    image: '/images/gallery/gallery-14-centro-retiro.jpg',
    alt: { en: 'The retreat center surrounded by nature', es: 'El centro de retiro rodeado de naturaleza' },
  },
  {
    image: '/images/gallery/gallery-03-yoga-shala.jpg',
    alt: {
      en: 'The open-air yoga shala used for meditation and Tibetan yoga practice',
      es: 'El shala de yoga al aire libre usado para meditación y práctica de yoga tibetano',
    },
  },
  {
    image: '/images/gallery/gallery-04-shala-techo.jpg',
    alt: { en: 'The thatched roof of the ceremonial yoga shala', es: 'El techo de paja del shala ceremonial de yoga' },
  },
  {
    image: '/images/gallery/gallery-05-shala-interior.jpg',
    alt: {
      en: 'Interior of the shala where ceremonies and yoga practice are held',
      es: 'Interior del shala donde se realizan las ceremonias y la práctica de yoga',
    },
  },
  {
    image: '/images/gallery/gallery-25-altar-copal-rosas.jpg',
    alt: { en: 'A ceremonial altar with copal incense and roses', es: 'Un altar ceremonial con copal y rosas' },
  },
  {
    image: '/images/gallery/gallery-26-abuelita.jpeg',
    alt: {
      en: 'Grandmother Ayahuasca — the master plant medicine used in ceremony',
      es: 'Abuelita Ayahuasca — la medicina de planta maestra utilizada en ceremonia',
    },
  },
  {
    image: '/images/gallery/gallery-27-holy.jpg',
    alt: { en: 'A sacred ceremonial moment during a retreat', es: 'Un momento ceremonial sagrado durante un retiro' },
  },
  {
    image: '/images/gallery/gallery-08-meditacion-yoga.jpg',
    alt: {
      en: 'Participants in meditation and yoga practice during a retreat',
      es: 'Participantes en práctica de meditación y yoga durante un retiro',
    },
  },
  {
    image: '/images/gallery/gallery-01-suite-lux.jpg',
    alt: {
      en: 'A luxury suite at the retreat house with natural light',
      es: 'Una suite de lujo en la casa de retiro con luz natural',
    },
  },
  {
    image: '/images/gallery/gallery-02-suite.jpg',
    alt: { en: 'A guest suite at the retreat center', es: 'Una suite de huéspedes en el centro de retiro' },
  },
  {
    image: '/images/gallery/gallery-09-habitacion-triple.jpg',
    alt: { en: 'A triple room for retreat guests', es: 'Una habitación triple para los participantes del retiro' },
  },
  {
    image: '/images/gallery/gallery-10-habitacion-privada.jpg',
    alt: { en: 'A private room at the retreat center', es: 'Una habitación privada en el centro de retiro' },
  },
  {
    image: '/images/gallery/gallery-11-habitacion-doble.jpg',
    alt: { en: 'A double room for retreat guests', es: 'Una habitación doble para los participantes del retiro' },
  },
  {
    image: '/images/gallery/gallery-06-sauna.jpg',
    alt: { en: "The retreat center's traditional sauna", es: 'El sauna tradicional del centro de retiro' },
  },
  {
    image: '/images/gallery/gallery-07-sala-estar.jpg',
    alt: { en: 'A cozy living room at the retreat house', es: 'Una acogedora sala de estar en la casa de retiro' },
  },
  {
    image: '/images/gallery/gallery-15-casa-retiro-comedor.jpg',
    alt: { en: 'The dining area of the retreat house', es: 'El comedor de la casa de retiro' },
  },
  {
    image: '/images/gallery/gallery-12-comida-retreat.jpg',
    alt: {
      en: 'A vegetarian meal prepared for retreat participants',
      es: 'Una comida vegetariana preparada para los participantes del retiro',
    },
  },
  {
    image: '/images/gallery/gallery-13-comida-retiro.jpg',
    alt: { en: 'Food and beverages served during the retreat', es: 'Alimentos y bebidas servidos durante el retiro' },
  },
  {
    image: '/images/gallery/gallery-23-ausangate.jpg',
    alt: {
      en: 'Apu Ausangate, one of the most revered sacred mountains of the Andes',
      es: 'Apu Ausangate, una de las montañas sagradas más veneradas de los Andes',
    },
  },
  {
    image: '/images/gallery/gallery-24-pachatusan.jpg',
    alt: { en: 'Apu Pachatusan, a sacred mountain overlooking Cusco', es: 'Apu Pachatusan, una montaña sagrada con vista a Cusco' },
  },
  {
    image: '/images/gallery/gallery-18-apu-pitusiray.jpg',
    alt: {
      en: 'Apu Pitusiray, a sacred mountain in the Sacred Valley of Cusco',
      es: 'Apu Pitusiray, una montaña sagrada del Valle Sagrado de Cusco',
    },
  },
  {
    image: '/images/gallery/gallery-19-valle-sagrado-1.jpeg',
    alt: { en: 'The landscape of the Sacred Valley, Cusco, Perú', es: 'El paisaje del Valle Sagrado, Cusco, Perú' },
  },
  {
    image: '/images/gallery/gallery-20-valle-sagrado-5.jpeg',
    alt: { en: 'Terraced fields in the Sacred Valley, Cusco, Perú', es: 'Campos en terrazas en el Valle Sagrado, Cusco, Perú' },
  },
  {
    image: '/images/gallery/gallery-22-pisac.jpeg',
    alt: { en: 'The Pisac archaeological site in the Sacred Valley', es: 'El sitio arqueológico de Pisac en el Valle Sagrado' },
  },
  {
    image: '/images/gallery/gallery-21-lagunas.jpeg',
    alt: { en: 'High-altitude lagoons near a sacred site in Perú', es: 'Lagunas de altura cerca de un sitio sagrado en Perú' },
  },
  {
    image: '/images/gallery/gallery-28-naupa.jpg',
    alt: { en: 'Ñaupa Iglesia, a sacred site visited during retreats', es: 'Ñaupa Iglesia, un sitio sagrado visitado durante los retiros' },
  },
]
