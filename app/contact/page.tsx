import type { Metadata } from 'next'
import { ContactContent } from '@/components/contact-content'

const title = 'Contact Us | kawsayvida.com'
const ogImage = '/images/contact-bg.jpg'

export const metadata: Metadata = {
  title,
  description:
    'Reach out to kawsayvida.com with questions about an upcoming Ayahuasca medicine retreat.',
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

export default function ContactPage() {
  return <ContactContent />
}
