import type { Metadata } from 'next'
import { AboutContent } from '@/components/about-content'

const title = 'About | Ameyalli'
const ogImage = '/images/hero-singing.jpg'

export const metadata: Metadata = {
  title,
  description:
    'Ameyalli is a medicine musician, sound healer, and Chinese Medicine practitioner trained in the Shipibo lineage of the Amazon jungle.',
  openGraph: {
    type: 'website',
    siteName: 'Ameyalli',
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
