import type { ABeautifulDayContentV1, ABeautifulDayPreviewData } from '../../../templates/websites/a-beautiful-day/content'

const record = (value: unknown): Record<string, unknown> => value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}
const list = (value: unknown): Record<string, unknown>[] => Array.isArray(value) ? value.map(record) : []
const safeUrl = (value: unknown) => typeof value === 'string' && /^(https:\/\/|\/(?!\/))/.test(value) ? value : ''

/** Adapt canonical content and authorized projections; never substitute demo wedding data. */
export function aBeautifulDayRenderData(value: unknown): ABeautifulDayPreviewData {
  const payload = record(value)
  const content = record(payload.content ?? payload)
  const defaults: ABeautifulDayContentV1 = {
    seo: { title: '', description: '', ogImageId: null },
    hero: { brideName: '', groomName: '', primaryEventId: '', heroMediaId: null },
    announcement: { message: '' },
    couple: { bride: { displayName: '', portraitMediaId: null }, groom: { displayName: '', portraitMediaId: null } },
    story: { milestones: [] }, events: { eventIds: [] }, countdown: { eventId: '' }, venues: { eventIds: [] },
    gallery: { mediaIds: [] }, schedule: { items: [] }, weddingParty: { groups: [] }, dressCode: { colors: [] },
    travel: { items: [] }, faq: { items: [] }, rsvp: { eventIds: [] }, guestbook: {}, gift: { accounts: [] },
    footer: { message: '' }, music: { musicTrackId: null, autoplay: false },
  }
  const normalized = Object.fromEntries(Object.entries(defaults).map(([key, fallback]) => [key, { ...fallback, ...record(content[key]) }])) as ABeautifulDayContentV1
  normalized.couple = {
    bride: { ...defaults.couple.bride, ...record(normalized.couple.bride) },
    groom: { ...defaults.couple.groom, ...record(normalized.couple.groom) },
  }
  const media = list(payload.media).filter(item => item.status === 'READY' && typeof item.id === 'string' && safeUrl(item.publicUrl)).map(item => ({ id: String(item.id), publicUrl: safeUrl(item.publicUrl), status: 'READY' as const, altText: typeof item.altText === 'string' ? item.altText : null }))
  // Owner media fields already contain an authorized URL and accessible description.
  const collect = (item: unknown): void => {
    if (Array.isArray(item)) { item.forEach(collect); return }
    const entry = record(item)
    if (typeof entry.mediaAssetId === 'string' && safeUrl(entry.src) && !media.some(image => image.id === entry.mediaAssetId)) media.push({ id: entry.mediaAssetId, publicUrl: safeUrl(entry.src), status: 'READY', altText: typeof entry.alt === 'string' ? entry.alt : null })
    Object.values(entry).forEach(child => { if (child && typeof child === 'object') collect(child) })
  }
  collect(content)
  return {
    content: normalized,
    // Published snapshots already contain only public events; tolerate their canonical projection,
    // which intentionally omits the isPublic flag. Explicitly private editor-preview rows stay out.
    events: list(payload.events).filter(item => item.isPublic !== false && typeof item.id === 'string' && typeof item.startsAt === 'string').map(item => ({ id: String(item.id), name: typeof item.name === 'string' ? item.name : '', startsAt: String(item.startsAt), timezone: typeof item.timezone === 'string' ? item.timezone : 'Asia/Ho_Chi_Minh', venueName: typeof item.venueName === 'string' ? item.venueName : null, addressLine: typeof item.addressLine === 'string' ? item.addressLine : null, mapUrl: safeUrl(item.mapUrl) || null, isPublic: true })),
    media,
    approvedWishes: list(payload.approvedWishes ?? payload.wishes).filter(item => typeof item.id === 'string' && typeof item.authorName === 'string' && typeof item.content === 'string') as ABeautifulDayPreviewData['approvedWishes'],
  }
}
