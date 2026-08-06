import eventData from '@/data/registration-dates.json'
import type { Localized } from './i18n/config'

export type RetreatBullet = {
  content: string
  html: boolean
}

export type Retreat = {
  slug: string
  startDate: string
  title: Localized
  location: Localized
  dates: Localized
  image: string
  alt: Localized
  includes: Localized<RetreatBullet[]>
}

type RetreatEvent = {
  id: string
  type: 'retreat' | 'ceremony'
  startDate: string
  endDate: string
  location: Localized
  retreatPage?: {
    title: Localized
    dates: Localized
    image: string
    alt: Localized
    food: Localized
    customBulletsHtml: Localized<string[]>
  }
}

//CALCULATE THE INCLUSIVE NUMBER OF RETREAT DAYS FROM ISO CALENDAR DATES.
function retreatDuration(startDate: string, endDate: string): { days: number; nights: number } {
  const start = Date.parse(`${startDate}T00:00:00Z`)
  const end = Date.parse(`${endDate}T00:00:00Z`)
  const days = Math.floor((end - start) / 86_400_000) + 1

  if (!Number.isInteger(days) || days < 1) {
    throw new Error(`Invalid retreat date range: ${startDate} to ${endDate}`)
  }

  return { days, nights: days - 1 }
}

//FOUR- AND FIVE-DAY RETREATS HAVE TWO CEREMONIES; SIX- AND SEVEN-DAY RETREATS HAVE THREE.
function ceremonyCount(days: number): number {
  return days >= 6 ? 3 : 2
}

function standardBullets(event: RetreatEvent): Localized<RetreatBullet[]> {
  if (!event.retreatPage) {
    throw new Error(`Retreat page data is missing for ${event.id}`)
  }

  const { days, nights } = retreatDuration(event.startDate, event.endDate)
  const ceremonies = ceremonyCount(days)
  const nighttimeCeremonies = ceremonies - 1
  const custom = event.retreatPage.customBulletsHtml

  return {
    en: [
      { content: `Lodging (${nights} Nights, ${days} Days)`, html: false },
      { content: event.retreatPage.food.en, html: false },
      {
        content: `${ceremonies} Ayahuasca Ceremonies (${nighttimeCeremonies} nighttime and 1 daytime)`,
        html: false,
      },
      ...custom.en.map((content) => ({ content, html: true })),
      { content: 'Tibetan meditation and yoga practices', html: false },
      { content: 'Group integration', html: false },
      { content: 'Individual sessions with retreat guides (as needed)', html: false },
    ],
    es: [
      { content: `Hospedaje (${nights} Noches, ${days} días)`, html: false },
      { content: event.retreatPage.food.es, html: false },
      {
        content: `${ceremonies} Ceremonias de Ayahuasca (${nighttimeCeremonies} nocturna${nighttimeCeremonies === 1 ? '' : 's'} y 1 diurna)`,
        html: false,
      },
      ...custom.es.map((content) => ({ content, html: true })),
      { content: 'Prácticas de meditación y yoga tibetano', html: false },
      { content: 'Integraciones grupales', html: false },
      { content: 'Sesiones de uno a uno con los guías del retiro (si es necesario)', html: false },
    ],
  }
}

//ONLY EVENTS WITH RETREAT-PAGE CONTENT ARE LISTED, AND THE DATE CONTROLS THEIR ORDER.
export const retreats: Retreat[] = (eventData as RetreatEvent[])
  .filter((event) => event.type === 'retreat' && Boolean(event.retreatPage))
  .sort((a, b) => a.startDate.localeCompare(b.startDate))
  .map((event) => {
    const page = event.retreatPage

    if (!page) {
      throw new Error(`Retreat page data is missing for ${event.id}`)
    }

    return {
      slug: event.id,
      startDate: event.startDate,
      title: page.title,
      location: event.location,
      dates: page.dates,
      image: page.image,
      alt: page.alt,
      includes: standardBullets(event),
    }
  })
