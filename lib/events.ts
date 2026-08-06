import eventData from '@/data/registration-dates.json'
import type { Lang, Localized } from './i18n/config'

export type EventData = {
  id: string
  type: 'retreat' | 'ceremony'
  startDate: string
  endDate: string
  location: string
  retreatPage?: {
    image: string
    alt: Localized
    customBulletsHtml?: Localized<string[]>
  }
}

const ENGLISH_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const SPANISH_MONTHS = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
]

export const events = eventData as unknown as EventData[]

type DateParts = {
  year: number
  month: number
  day: number
}

//PARSE ISO DATES AS UTC SO DISPLAY AND CALCULATIONS DO NOT SHIFT WITH THE VISITOR'S TIME ZONE.
function parseIsoDate(value: string): DateParts {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)

  if (!match) {
    throw new Error(`Invalid event date: ${value}`)
  }

  const parts = {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  }
  const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day))

  if (
    date.getUTCFullYear() !== parts.year ||
    date.getUTCMonth() !== parts.month - 1 ||
    date.getUTCDate() !== parts.day
  ) {
    throw new Error(`Invalid event date: ${value}`)
  }

  return parts
}

function ordinal(day: number): string {
  const remainder100 = day % 100

  if (remainder100 >= 11 && remainder100 <= 13) {
    return `${day}th`
  }

  switch (day % 10) {
    case 1:
      return `${day}st`
    case 2:
      return `${day}nd`
    case 3:
      return `${day}rd`
    default:
      return `${day}th`
  }
}

function formatEnglishDateRange(start: DateParts, end: DateParts): string {
  const startMonth = ENGLISH_MONTHS[start.month - 1]
  const endMonth = ENGLISH_MONTHS[end.month - 1]

  if (start.year === end.year && start.month === end.month && start.day === end.day) {
    return `${startMonth} ${ordinal(start.day)}, ${start.year}`
  }

  if (start.year === end.year && start.month === end.month) {
    return `${startMonth} ${ordinal(start.day)} to ${ordinal(end.day)}, ${start.year}`
  }

  if (start.year === end.year) {
    return `${startMonth} ${ordinal(start.day)} to ${endMonth} ${ordinal(end.day)}, ${start.year}`
  }

  return `${startMonth} ${ordinal(start.day)}, ${start.year} to ${endMonth} ${ordinal(end.day)}, ${end.year}`
}

function formatSpanishDateRange(start: DateParts, end: DateParts): string {
  const startMonth = SPANISH_MONTHS[start.month - 1]
  const endMonth = SPANISH_MONTHS[end.month - 1]

  if (start.year === end.year && start.month === end.month && start.day === end.day) {
    return `${start.day} de ${startMonth}, ${start.year}`
  }

  if (start.year === end.year && start.month === end.month) {
    return `${start.day} al ${end.day} de ${startMonth}, ${start.year}`
  }

  if (start.year === end.year) {
    return `${start.day} de ${startMonth} al ${end.day} de ${endMonth}, ${start.year}`
  }

  return `${start.day} de ${startMonth}, ${start.year} al ${end.day} de ${endMonth}, ${end.year}`
}

export function formatEventDates(event: EventData, lang: Lang): string {
  const start = parseIsoDate(event.startDate)
  const end = parseIsoDate(event.endDate)

  return lang === 'es' ? formatSpanishDateRange(start, end) : formatEnglishDateRange(start, end)
}

export function eventRegistrationLabel(event: EventData, lang: Lang): string {
  const eventType =
    event.type === 'retreat'
      ? lang === 'es'
        ? 'Retiro'
        : 'Retreat'
      : lang === 'es'
        ? 'Ceremonia'
        : 'Ceremony'

  return `${eventType}: ${formatEventDates(event, lang)}, ${event.location}`
}

//REGISTRATION OPTIONS REMAIN VISIBLE THROUGH THE FULL DAY AFTER AN EVENT ENDS.
export function isEventRegistrationVisible(event: EventData, now = new Date()): boolean {
  const end = parseIsoDate(event.endDate)
  const hideAt = Date.UTC(end.year, end.month - 1, end.day + 2)

  return now.getTime() < hideAt
}
