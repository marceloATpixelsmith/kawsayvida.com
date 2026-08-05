import type { Metadata } from 'next'
import { ContactContent } from '@/components/contact-content'

const title = 'Contact | Ameyalli'
const ogImage = '/images/contact-bg.jpg'

export const metadata: Metadata = {
  title,
  description:
    'Reach out to Ameyalli with questions, intentions, or to sign up for notifications on new events and offerings.',
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

export default function ContactPage() {
  return <ContactContent />
}
