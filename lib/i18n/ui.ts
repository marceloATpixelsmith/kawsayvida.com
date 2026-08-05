// ---------------------------------------------------------------------------
// UI chrome strings (buttons, labels, section eyebrows, etc.).
// Content like services/events/testimonials lives in the lib/*.ts data files.
// To edit wording, change the text below for the relevant language.
// ---------------------------------------------------------------------------

import type { Lang } from './config'

export const ui = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      services: 'Services',
      events: 'Events',
      contact: 'Contact',
    },
    language: { label: 'Language', en: 'EN', es: 'ES', english: 'English', spanish: 'Español' },
    hero: {
      exploreOfferings: 'Explore Offerings',
      upcomingEvents: 'Upcoming Events',
      prevSlide: 'Previous slide',
      nextSlide: 'Next slide',
      goToSlide: 'Go to slide',
    },
    home: {
      introEyebrow: 'Medicine Musician & Sound Healer',
      introTitle: 'Healing carried on the voice',
      introP1:
        'Ameyalli uses his voice and his connection to the master plants of the Amazon jungle to open the heart, clear energetic and emotional blockages, align thoughts and energies, and connect to light worlds.',
      introP2:
        'Accompanied by guitar, his medicine music is used in ceremony to soothe and nurture participants and to generate a gentle, profound emotional release.',
      readFullStory: 'Read the full story',
      offeringsEyebrow: 'Offerings',
      offeringsTitle: 'Ways to work together',
      viewAllServices: 'View all services',
      eventEyebrow: 'Upcoming Ceremony',
      eventDateLabel: 'Date',
      eventLocationLabel: 'Location',
      viewEventDetails: 'View Event Details',
      closingEyebrow: 'Begin',
      closingTitle: 'Ready to open the heart?',
      closingText:
        'Reach out to learn more, ask questions, or find the offering that meets you where you are.',
      getInTouch: 'Get in Touch',
    },
    about: {
      introP1:
        'Ameyalli is a medicine musician, sound healer, and Chinese Medicine practitioner. He uses his voice and his connection to the master plants of the Amazon jungle to open the heart, clear energetic and emotional blockages, align thoughts and energies, clear unwanted energies, and connect to light worlds.',
      introP2:
        'Ameyalli’s medicine music, accompanied by guitar, is used in ceremony to soothe and nurture participants and to generate a profound emotional release.',
      lineageEyebrow: 'The Lineage',
      lineageTitle: 'About Sama',
      lineageP1:
        'Ameyalli’s ability to channel healing via the voice has been honed in the Amazon jungle in an intense healing process called Sama. In Sama, the initiate works one-on-one with powerful plant spirits to heal their body, mind, and spirit.',
      lineageP2:
        'During this process, the initiate may also be taught to hold space and to channel the plant spirits’ energies through the singing of ikáros — a special type of medicine chant.',
      lineageP3:
        'Ameyalli complements his work as a sound healer with Chinese Medicine therapies like acupuncture, Chinese herbs, and Qigong.',
      portraitAlt: 'Portrait of Ameyalli smiling outdoors against a stone background',
      headerAlt: 'Ameyalli holding a smoking ceremonial pipe outdoors',
      samaAlt: 'Ameyalli and companions walking through dense Amazon jungle',
      cta: {
        title: 'Explore the offerings',
        text: 'From group ceremonies to one-on-one sessions, find the path that meets you.',
        button: 'View Services',
      },
    },
    services: {
      inquire: 'Inquire about this offering',
      cta: {
        title: 'Not sure where to begin?',
        text: "Every journey is different. Reach out and we'll help you find the right offering for where you are.",
        button: 'Contact Ameyalli',
      },
    },
    events: {
      none: 'There are no events scheduled at this time. Please check back soon.',
      guidedBy: 'Every Other Month - Guided by',
      whyTitle: 'Why choose to sit with us',
      dateLabel: 'Date',
      timeLabel: 'Time',
      locationLabel: 'Location',
      register: 'Register',
      infoPacket: 'Info Packet',
    },
    contact: {
      eyebrow: "Let's connect",
      title: 'Begin the conversation',
      text: "Whether you're curious about an upcoming ceremony, exploring one-on-one work, or simply want to stay in the loop, send a note and Ameyalli will get back to you personally.",
      emailLabel: 'Email',
    },
    form: {
      nameLabel: 'Name',
      namePlaceholder: 'Your name',
      emailLabel: 'Email',
      emailPlaceholder: 'you@email.com',
      messageLabel: 'Message',
      messagePlaceholder:
        'How can we support you? Questions, intentions, or which offering calls to you…',
      notify: 'Sign me up for notifications on new events and offerings.',
      send: 'Send Message',
      sending: 'Sending…',
      successTitle: 'Message received',
      // Errors returned from the server action (must match actions.ts keys).
      errors: {
        missing: 'Please fill in your name, email, and message.',
        nameRequired: 'Please enter your name.',
        nameTooLong: 'Please keep your name under 100 characters.',
        emailRequired: 'Please enter your email address.',
        invalidEmail: 'Please enter a valid email address.',
        messageRequired: 'Please enter a message.',
        messageTooShort: 'Please write at least 10 characters.',
        messageTooLong: 'Please keep your message under 2,000 characters.',
        tooLong: 'Please shorten your name or message and try again.',
        notConnected: 'The contact form is not connected yet. Please email {email} directly.',
        challenge: 'Please complete the security challenge before sending your message.',
        generic: 'Something went wrong. Please try again.',
      },
      success: 'Thank you — your message has been sent.',
    },
    footer: {
      tagline:
        'Mushroom Ceremonies (group and private), microdosing help, medicine music, sound healing, and Chinese Medicine — held with care, rooted in the lineage of the Amazon.',
      explore: 'Explore',
      connect: 'Connect',
      rights: 'Medicine of the Heart',
    },
    pageHeaders: {
      about: { eyebrow: 'Medicine Musician & Healer', title: 'About Ameyalli' },
      services: { eyebrow: 'Offerings', title: 'Services' },
      events: { eyebrow: 'Gather With Us', title: 'Events' },
      contact: { eyebrow: 'Reach Out', title: 'Contact' },
    },
    testimonials: {
      eyebrow: 'Reflections',
      title: 'Testimonials',
      text: 'Words from those who have shared in the medicine, the music, and the space.',
    },
  },

  es: {
    nav: {
      home: 'Inicio',
      about: 'Bio',
      services: 'Servicios',
      events: 'Eventos',
      contact: 'Contacto',
    },
    language: { label: 'Idioma', en: 'EN', es: 'ES', english: 'English', spanish: 'Español' },
    hero: {
      exploreOfferings: 'Ver Servicios',
      upcomingEvents: 'Próximos Eventos',
      prevSlide: 'Diapositiva anterior',
      nextSlide: 'Diapositiva siguiente',
      goToSlide: 'Ir a la diapositiva',
    },
    home: {
      introEyebrow: 'Músico Medicina y Sanador de Sonido',
      introTitle: 'Sanación llevada en la voz',
      introP1:
        'Ameyalli utiliza su voz y su conexión con las plantas maestras de la selva amazónica para abrir el corazón, liberar bloqueos energéticos y emocionales, alinear pensamientos y energías, y conectar con mundos de luz.',
      introP2:
        'Acompañada de guitarra, su música medicina se usa en ceremonia para calmar y nutrir a los participantes y para generar una liberación emocional suave y profunda.',
      readFullStory: 'Leer la historia completa',
      offeringsEyebrow: 'Servicios',
      offeringsTitle: 'Formas de trabajar juntos',
      viewAllServices: 'Ver todos los servicios',
      eventEyebrow: 'Próxima Ceremonia',
      eventDateLabel: 'Fecha',
      eventLocationLabel: 'Ubicación',
      viewEventDetails: 'Ver Detalles del Evento',
      closingEyebrow: 'Comienza',
      closingTitle: '¿List@ para abrir el corazón?',
      closingText:
        'Escríbenos para saber más, hacer preguntas o encontrar el servicio que se ajuste a donde te encuentras.',
      getInTouch: 'Contáctanos',
    },
    about: {
      introP1:
        'Ameyalli es músico de medicina, sanador de sonido y practicante de Medicina China. Utiliza su voz y su conexión con las plantas maestras de la selva amazónica para abrir el corazón, liberar bloqueos energéticos y emocionales, alinear pensamientos y energías, limpiar energías no deseadas y conectar con mundos de luz.',
      introP2:
        'La música de medicina de Ameyalli, acompañada de guitarra, se usa en ceremonia para calmar y nutrir a los participantes y para generar una profunda liberación emocional.',
      lineageEyebrow: 'El Linaje',
      lineageTitle: 'Acerca de Sama',
      lineageP1:
        'La capacidad de Ameyalli para canalizar la sanación a través de la voz ha sido cultivada en la selva amazónica en un intenso proceso de sanación llamado Sama. En Sama, el iniciado trabaja de forma individual con poderosos espíritus de plantas para sanar su cuerpo, mente y espíritu.',
      lineageP2:
        'Durante este proceso, al iniciado también se le puede enseñar a sostener el espacio y a canalizar las energías de los espíritus de las plantas a través del canto de ikáros — un tipo especial de canto de medicina.',
      lineageP3:
        'Ameyalli complementa su trabajo como sanador de sonido con terapias de Medicina China como la acupuntura, las hierbas chinas y el Qigong.',
      portraitAlt: 'Retrato de Ameyalli sonriendo al aire libre frente a un fondo de piedra',
      headerAlt: 'Ameyalli sosteniendo una pipa ceremonial humeante al aire libre',
      samaAlt: 'Ameyalli y acompañantes caminando por la densa selva amazónica',
      cta: {
        title: 'Explora los servicios',
        text: 'Desde ceremonias grupales hasta sesiones individuales, encuentra el camino que resuene contigo.',
        button: 'Ver Servicios',
      },
    },
    services: {
      inquire: 'Consultar sobre este servicio',
      cta: {
        title: '¿No sabes por dónde empezar?',
        text: 'Cada camino es diferente. Escríbenos y te ayudaremos a encontrar el servicio adecuado para donde te encuentras.',
        button: 'Contactar a Ameyalli',
      },
    },
    events: {
      none: 'No hay eventos programados en este momento. Vuelve a visitarnos pronto.',
      guidedBy: 'Cada otro mes - Guiado por',
      whyTitle: 'Por qué elegir sentarte con nosotros',
      dateLabel: 'Fecha',
      timeLabel: 'Hora',
      locationLabel: 'Ubicación',
      register: 'Registrarse',
      infoPacket: 'Información',
    },
    contact: {
      eyebrow: 'Conectemos',
      title: 'Comienza la conversación',
      text: 'Ya sea que tengas curiosidad por una próxima ceremonia, estés explorando el trabajo individual o simplemente quieras mantenerte al tanto, envía un mensaje y Ameyalli te responderá personalmente.',
      emailLabel: 'Correo',
    },
    form: {
      nameLabel: 'Nombre',
      namePlaceholder: 'Tu nombre',
      emailLabel: 'Correo',
      emailPlaceholder: 'tu@correo.com',
      messageLabel: 'Mensaje',
      messagePlaceholder:
        '¿Cómo podemos acompañarte? Preguntas, intenciones o qué servicio te llama…',
      notify: 'Quiero recibir notificaciones sobre nuevos eventos y servicios.',
      send: 'Enviar Mensaje',
      sending: 'Enviando…',
      successTitle: 'Mensaje recibido',
      errors: {
        missing: 'Por favor completa tu nombre, correo y mensaje.',
        nameRequired: 'Por favor ingresa tu nombre.',
        nameTooLong: 'Por favor usa un nombre de menos de 100 caracteres.',
        emailRequired: 'Por favor ingresa tu correo electrónico.',
        invalidEmail: 'Por favor ingresa un correo electrónico válido.',
        messageRequired: 'Por favor escribe un mensaje.',
        messageTooShort: 'Por favor escribe al menos 10 caracteres.',
        messageTooLong: 'Por favor usa un mensaje de menos de 2,000 caracteres.',
        tooLong: 'Por favor acorta tu nombre o mensaje e intenta de nuevo.',
        notConnected: 'El formulario aún no está conectado. Por favor escribe directamente a {email}.',
        challenge: 'Por favor completa el desafío de seguridad antes de enviar tu mensaje.',
        generic: 'Algo salió mal. Por favor intenta de nuevo.',
      },
      success: 'Gracias — tu mensaje ha sido enviado.',
    },
    footer: {
      tagline:
        'Música de medicina, sanación de sonido y Medicina China — sostenidas con cuidado, arraigadas en el linaje de la Amazonía.',
      explore: 'Explorar',
      connect: 'Conectar',
      rights: 'Medicina del Corazón',
    },
    pageHeaders: {
      about: { eyebrow: 'Músico de Medicina y Sanador', title: 'Acerca de Ameyalli' },
      services: { eyebrow: 'Servicios', title: 'Servicios' },
      events: { eyebrow: 'Reúnete con Nosotros', title: 'Eventos' },
      contact: { eyebrow: 'Escríbenos', title: 'Contacto' },
    },
    testimonials: {
      eyebrow: 'Reflexiones',
      title: 'Testimonios',
      text: 'Palabras de quienes han compartido en la medicina, la música y el espacio.',
    },
  },
}

export type UIStrings = (typeof ui)['en']

export function getUI(lang: Lang): UIStrings {
  return ui[lang]
}
