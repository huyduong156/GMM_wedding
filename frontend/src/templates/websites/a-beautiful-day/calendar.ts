import type { ABeautifulDayEventProjection } from './content'

const escape = (value: string) => value.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;')
/** UTC timestamps keep imported event times independent from the viewer's zone. */
export function eventCalendarUrl(event: ABeautifulDayEventProjection) {
  const date = new Date(event.startsAt)
  if (!event.isPublic || Number.isNaN(date.getTime())) return undefined
  const stamp = date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')
  const calendar = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//ourday//A Beautiful Day//VI', 'BEGIN:VEVENT', `UID:${escape(event.id)}@ourday`, `DTSTAMP:${stamp}`, `DTSTART:${stamp}`, `SUMMARY:${escape(event.name)}`, `LOCATION:${escape([event.venueName, event.addressLine].filter(Boolean).join(', '))}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n')
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(calendar)}`
}
