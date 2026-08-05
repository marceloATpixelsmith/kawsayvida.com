import type { Metadata } from 'next'
import { RegistrationContent } from '@/components/registration-content'

const title = 'Registration | kawsayvida.com'
const ogImage = '/images/registration-header.jpg'

export const metadata: Metadata = {
  title,
  description:
    'Register for an Ayahuasca medicine retreat with kawsayvida.com — instructions, contraindications, and the full registration form.',
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

export default function RegistrationPage() {
  return <RegistrationContent />
}
