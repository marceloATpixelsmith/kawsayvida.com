import type { Metadata } from 'next'
import { EventsContent } from '@/components/events-content'

const title = 'Events | Ameyalli'
const ogImage = '/images/event-poster-OG.jpg'

export const metadata: Metadata = {
  title,
  description:
    'Upcoming ceremonies and gatherings held by Ameyalli and a skilled team of space-holders and medicine musicians.',
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

export default function EventsPage() {
  return <EventsContent />
}
