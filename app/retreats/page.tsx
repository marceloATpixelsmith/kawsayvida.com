import type { Metadata } from 'next'
import { RetreatsContent } from '@/components/retreats-content'

const title = 'Retreats | kawsayvida.com'
const ogImage = '/images/retreats-header.jpg'

export const metadata: Metadata = {
  title,
  description:
    'Ayahuasca medicine retreats in the Sacred Valley, Perú and Valle de Bravo, México, guided by German Virguez and Lupita Castro.',
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

export default function RetreatsPage() {
  return <RetreatsContent />
}
