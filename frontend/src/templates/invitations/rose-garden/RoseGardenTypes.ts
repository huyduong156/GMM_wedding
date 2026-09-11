export type RoseGardenSectionKey =
  | 'opening'
  | 'cover'
  | 'invitation'
  | 'families'
  | 'eventDetails'
  | 'countdown'
  | 'timeline'
  | 'venue'
  | 'gallery'
  | 'rsvp'
  | 'guestbook'
  | 'gift'
  | 'music'
  | 'footer'

export type RoseGardenSectionConfig = {
  enabled: RoseGardenSectionKey[]
  order: RoseGardenSectionKey[]
}

export type RoseGardenMedia = {
  src: string
  alt?: string
  mediaAssetId?: string
  role?: string
}

export type RoseGardenFamilySide = {
  label?: string
  father?: string
  mother?: string
  address?: string
}

export type RoseGardenTimelineItem = {
  time?: string
  title?: string
  description?: string
  image?: string | RoseGardenMedia
}

export type RoseGardenData = {
  couple?: { brideName?: string; groomName?: string }
  event?: {
    weddingDate?: string
    time?: string
    venueName?: string
    venueAddress?: string
    mapUrl?: string
  }
  opening?: { title?: string; message?: string }
  openingMediaBack?: RoseGardenMedia | null
  openingMediaFront?: RoseGardenMedia | null
  cover?: { eyebrow?: string; title?: string; message?: string }
  heroMedia?: RoseGardenMedia | null
  invitation?: { title?: string; message?: string }
  invitationMemoryImage1?: string | RoseGardenMedia
  invitationMemoryImage2?: string | RoseGardenMedia
  invitationMemoryImage3?: string | RoseGardenMedia
  families?: {
    title?: string
    subtitle?: string
    message?: string
    brideSide?: RoseGardenFamilySide
    groomSide?: RoseGardenFamilySide
  }
  eventDetails?: {
    title?: string
    date?: string
    time?: string
    calendarUrl?: string
    message?: string
  }
  eventDetailsMedia?: RoseGardenMedia | null
  countdown?: { enabled?: boolean }
  timeline?: { items?: RoseGardenTimelineItem[] }
  venue?: { title?: string; name?: string; address?: string; mapUrl?: string; message?: string }
  gallery?: { title?: string; message?: string; images?: Array<string | RoseGardenMedia> }
  galleryImages?: Array<string | RoseGardenMedia>
  rsvp?: {
    title?: string
    message?: string
    deadline?: string
    successMessage?: string
    attendingLabel?: string
    notAttendingLabel?: string
  }
  guestbook?: { title?: string; message?: string; successMessage?: string }
  gift?: { title?: string; message?: string; thankYouMessage?: string }
  giftQrMedia?: RoseGardenMedia | null
  music?: {
    backgroundMusicUrl?: string
    backgroundMusicName?: string
    backgroundMusicAutoplay?: boolean
  }
  footer?: { title?: string; message?: string }
  footerMedia?: RoseGardenMedia | null
}
