import type { Metadata } from 'next'
import { RegistrationContent } from '@/components/registration-content'
import { events, isEventRegistrationVisible } from '@/lib/events'

// Retreat dates drop off the form a full day after the retreat ends (see
// isEventRegistrationVisible in lib/events.ts). Revalidating periodically
// keeps that cutoff current without a full redeploy, and computing the list
// here (a Server Component) instead of in the client bundle means the
// visitor's browser never re-derives it against a different "now" during
// hydration.
export const revalidate = 3600

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
  const visibleRegistrationDates = events
    .filter((event) => isEventRegistrationVisible(event))
    .sort((a, b) => a.startDate.localeCompare(b.startDate))

  return <RegistrationContent visibleRegistrationDates={visibleRegistrationDates} />
}
