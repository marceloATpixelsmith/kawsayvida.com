// ---------------------------------------------------------------------------
// Global site configuration: navigation + contact details.
// Edit the values here to update them everywhere (header, footer, contact page).
// ---------------------------------------------------------------------------

export const siteConfig = {
  name: 'kawsayvida.com',
  // Contact email used in the footer and contact page.
  email: 'info@kawsayvida.com',
  // Where contact + registration form submissions are actually delivered.
  notificationEmails: ['info@kawsayvida.com', 'cuentas.ayahuapu@gmail.com'],
  social: {
    facebook: 'https://www.facebook.com/yaru.virguezcastro',
    youtube: 'https://www.youtube.com/channel/UCI0XJvQ1Sb3Dn_dEMniSRTg',
    instagram: 'https://www.instagram.com/ayahuapuoficial',
    soundcloud: 'https://soundcloud.com/ayahuapu',
  },
}

// `key` maps to the localized label in lib/i18n/ui.ts (ui.<lang>.nav[key]).
// Order and labels match the original kawsayvida.com main menu. "Home" is
// dropped from the menu itself (the logo links home instead), and
// "Registration" is nested under "Retreats/Ceremonies" as a dropdown item,
// matching the original site's structure. "Medicine Music" points to the
// band's own site (ayahuapu.com) rather than a page on this site.
export const navItems = [
  { key: 'about', href: '/about' },
  {
    key: 'retreats',
    href: '/retreats',
    children: [{ key: 'registration', href: '/retreats/registration' }],
  },
  { key: 'medicineMusic', href: 'https://www.ayahuapu.com/', external: true },
  { key: 'gallery', href: '/gallery' },
  { key: 'contact', href: '/contact' },
] as const
