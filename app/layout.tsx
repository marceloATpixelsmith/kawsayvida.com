import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { LanguageProvider } from '@/lib/i18n/context'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-cormorant',
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-jost',
  display: 'swap',
})

const homeTitle = 'kawsayvida.com | Retiros de Medicina — Ayahuasca Retreats'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.kawsayvida.com'),
  title: homeTitle,
  description:
    'Germán Virguez and Lupita Castro guide Ayahuasca medicine retreats in the Sacred Valley, Perú and Valle de Bravo, México — ceremony, integration, and medicine music since 2007.',
  applicationName: 'kawsayvida.com',
  generator: 'v0.app',
  manifest: '/favicons/site.webmanifest',
  openGraph: {
    type: 'website',
    siteName: 'kawsayvida.com',
    title: homeTitle,
    description: homeTitle,
    images: [{ url: '/images/hero-retreats.jpg', width: 1200, height: 630, alt: homeTitle }],
  },
  twitter: {
    card: 'summary_large_image',
    title: homeTitle,
    description: homeTitle,
    images: ['/images/hero-retreats.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: [{ url: '/favicon.ico' }],
    apple: [{ url: '/favicons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  appleWebApp: {
    capable: true,
    title: 'kawsayvida.com',
    statusBarStyle: 'default',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#65bc7b',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`bg-background ${cormorant.variable} ${jost.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <LanguageProvider>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </LanguageProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
