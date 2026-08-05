// ---------------------------------------------------------------------------
// Global site configuration: navigation + contact details.
// Edit the values here to update them everywhere (header, footer, contact page).
// ---------------------------------------------------------------------------

export const siteConfig = {
  name: 'Ameyalli',
  // Contact email used in the footer and contact page.
  email: 'ameyalli@ameyalli.space',
  social: {
    facebook: 'https://facebook.com/ameyalli.space',
    youtube: 'https://www.youtube.com/@ameyallifrecuencia/playlists',
  },
}

// `key` maps to the localized label in lib/i18n/ui.ts (ui.<lang>.nav[key]).
export const navItems = [
  { key: 'home', href: '/' },
  { key: 'about', href: '/about' },
  { key: 'services', href: '/services' },
  { key: 'events', href: '/events' },
  { key: 'contact', href: '/contact' },
] as const
