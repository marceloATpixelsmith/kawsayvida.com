import type { Metadata } from 'next'
import { ServicesContent } from '@/components/services-content'

const title = 'Services | Ameyalli'
const ogImage = '/images/hero-services.jpg'

export const metadata: Metadata = {
  title,
  description:
    'Group ceremonies, one-on-one ceremonies, microdosing coaching, and Chinese Medicine with Ameyalli.',
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

export default function ServicesPage() {
  return <ServicesContent />
}
