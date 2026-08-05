import type { Metadata } from 'next'
import { MedicineMusicContent } from '@/components/medicine-music-content'

const title = 'Medicine Music | kawsayvida.com'
const ogImage = '/images/medicine-music-header.jpg'

export const metadata: Metadata = {
  title,
  description:
    'Ayahuapu — the medicine music of German Virguez and Lupita Castro, blending the melodies of Amazon and Andes, East and West.',
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

export default function MedicineMusicPage() {
  return <MedicineMusicContent />
}
