// ---------------------------------------------------------------------------
// Global site configuration: navigation + contact details.
// Edit the values here to update them everywhere (header, footer, contact page).
// ---------------------------------------------------------------------------

export const siteConfig = {
  name: 'kawsayvida.com',
  // Contact email used in the footer and contact page.
  email: 'info@kawsayvida.com',
  social: {
    facebook: 'https://www.facebook.com/yaru.virguezcastro',
    youtube: 'https://www.youtube.com/channel/UCI0XJvQ1Sb3Dn_dEMniSRTg',
    instagram: 'https://www.instagram.com/ayahuapuoficial',
    soundcloud: 'https://soundcloud.com/ayahuapu',
  },
}

// `key` maps to the localized label in lib/i18n/ui.ts (ui.<lang>.nav[key]).
// Order and labels match the original kawsayvida.com main menu, with the
// "Registration" sub-item of "Retreats/Ceremonies" surfaced as its own entry.
export const navItems = [
  { key: 'home', href: '/' },
  { key: 'about', href: '/about' },
  { key: 'retreats', href: '/retreats' },
  { key: 'registration', href: '/retreats/registration' },
  { key: 'medicineMusic', href: '/medicine-music' },
  { key: 'gallery', href: '/gallery' },
  { key: 'contact', href: '/contact' },
] as const
