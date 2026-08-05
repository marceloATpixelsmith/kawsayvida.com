import type { Metadata } from 'next'
import { GalleryContent } from '@/components/gallery-content'

const title = 'Gallery | kawsayvida.com'
const ogImage = '/images/gallery-header.jpg'

export const metadata: Metadata = {
  title,
  description:
    'Photos of the retreat centers, ceremonial spaces, and sacred sites of the Sacred Valley, Perú and Valle de Bravo, México.',
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

export default function GalleryPage() {
  return <GalleryContent />
}
