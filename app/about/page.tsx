import type { Metadata } from 'next'
import { AboutContent } from '@/components/about-content'

const title = 'About Us | kawsayvida.com'
const ogImage = '/images/hero-retreats.jpg'

export const metadata: Metadata = {
  title,
  description:
    'German Virguez (Venezuela) and Lupita Castro (Mexico) walk a sacred path devoted to healing and the expansion of consciousness with master plants.',
  openGraph: {
    type: 'website',
    siteName: 'kawsayvida.com',
    title,
    description: title,
    images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description: title,
    images: [ogImage],
  },
}

export default function AboutPage() {
  return <AboutContent />
}
