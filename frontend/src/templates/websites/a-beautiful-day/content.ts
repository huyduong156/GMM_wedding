export type ABeautifulDaySectionKey =
  | 'navigation'
  | 'hero'
  | 'announcement'
  | 'couple'
  | 'story'
  | 'events'
  | 'countdown'
  | 'venues'
  | 'gallery'
  | 'schedule'
  | 'weddingParty'
  | 'dressCode'
  | 'travel'
  | 'faq'
  | 'rsvp'
  | 'guestbook'
  | 'gift'
  | 'footer'
  | 'music'

export type ABeautifulDaySectionConfig = {
  enabled: ABeautifulDaySectionKey[]
  order: Exclude<ABeautifulDaySectionKey, 'music'>[]
}

export type ABeautifulDayPerson = {
  displayName: string
  biography?: string
  portraitMediaId: ABeautifulDayMediaReference
  socialLinks?: Array<{ label: string; url: string }>
}

export type ABeautifulDayContentV1 = {
  seo: { title: string; description: string; ogImageId: ABeautifulDayMediaReference }
  hero: {
    eyebrow?: string
    brideName: string
    groomName: string
    headline?: string
    primaryEventId: string
    heroMediaId: ABeautifulDayMediaReference
  }
  announcement: { title?: string; message: string }
  couple: { bride: ABeautifulDayPerson; groom: ABeautifulDayPerson }
  story: {
    title?: string
    introduction?: string
    milestones: Array<{
      id: string
      date?: string
      title: string
      body: string
      mediaId: ABeautifulDayMediaReference
    }>
  }
  events: { title?: string; eventIds: ABeautifulDayEventReference[]; introduction?: string }
  countdown: { eventId: string }
  venues: { title?: string; eventIds: ABeautifulDayEventReference[]; travelNote?: string }
  gallery: { title?: string; introduction?: string; mediaIds: ABeautifulDayMediaReference[] }
  schedule: {
    title?: string
    items: Array<{ id: string; eventId: string; time: string; title: string; detail?: string }>
  }
  weddingParty: {
    title?: string
    groups: Array<{
      id: string
      title: string
      members: Array<{
        id: string
        name: string
        role?: string
        biography?: string
        mediaId: ABeautifulDayMediaReference
      }>
    }>
  }
  dressCode: {
    title?: string
    message?: string
    colors: Array<{ id: string; label: string; hex: string }>
  }
  travel: {
    title?: string
    items: Array<{
      id: string
      type: 'HOTEL' | 'TRANSPORT' | 'PARKING' | 'OTHER'
      title: string
      detail: string
      url?: string
    }>
  }
  faq: { title?: string; items: Array<{ id: string; question: string; answer: string }> }
  rsvp: { title?: string; message?: string; deadline?: string; eventIds: ABeautifulDayEventReference[] }
  guestbook: { title?: string; message?: string }
  gift: {
    title?: string
    message?: string
    accounts: Array<{
      id: string
      ownerLabel: string
      bankName?: string
      accountNumber?: string
      qrMediaId: ABeautifulDayMediaReference
    }>
  }
  footer: { message: string; signature?: string }
  music: { musicTrackId: string | null; musicTrackName?: string; autoplay: boolean }
}

/** Schema item controls use objects; published references may normalize to ID strings. */
export type ABeautifulDayEventReference = string | { eventId: string }

/** Editor media fields store a media object; published projections may normalize it to an ID. */
export type ABeautifulDayMediaReference =
  | string
  | { mediaAssetId?: string; src?: string; alt?: string; role?: string }
  | null

/** Public projections only. A public renderer must never resolve an ID by fetching it itself. */
export type ABeautifulDayEventProjection = {
  id: string
  name: string
  startsAt: string
  timezone: string
  venueName: string | null
  addressLine: string | null
  mapUrl: string | null
  isPublic: boolean
}

export type ABeautifulDayMediaProjection = {
  id: string
  publicUrl: string
  status: 'READY' | 'PROCESSING' | 'FAILED'
  altText: string | null
}

export type ABeautifulDayPreviewData = {
  content: ABeautifulDayContentV1
  events: ABeautifulDayEventProjection[]
  media: ABeautifulDayMediaProjection[]
  approvedWishes: Array<{ id: string; authorName: string; content: string }>
  guestName?: string | null
}
