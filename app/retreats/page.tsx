import type { Metadata } from 'next'
import { RetreatsContent } from '@/components/retreats-content'
import { retreats } from '@/lib/retreats'

// Retreats drop off the listing a full day after they end (see
// isEventRegistrationVisible in lib/events.ts). Revalidating periodically
// keeps that cutoff current without a full redeploy, and computing the list
// here (a Server Component) instead of in the client bundle means the
// visitor's browser never re-derives it against a different "now" during
// hydration.
export const revalidate = 3600

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
  return <RetreatsContent retreats={retreats} />
}
