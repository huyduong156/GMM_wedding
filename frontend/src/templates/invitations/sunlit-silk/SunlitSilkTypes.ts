export type SunlitSilkSectionKey =
  | 'opening'
  | 'cover'
  | 'invitation'
  | 'families'
  | 'eventDetails'
  | 'countdown'
  | 'calendar'
  | 'timeline'
  | 'venue'
  | 'activities'
  | 'gallery'
  | 'rsvp'
  | 'guestbook'
  | 'gift'
  | 'music'
  | 'footer'

export type SunlitSilkSectionConfig = {
  enabled: SunlitSilkSectionKey[]
  order: SunlitSilkSectionKey[]
}

export type SunlitSilkMedia = {
  src: string
  alt?: string
  mediaAssetId?: string
  role?: string
}

export type SunlitSilkFamilySide = {
  label?: string
  fatherTitle?: string
  father?: string
  motherTitle?: string
  mother?: string
  address?: string
}

export type SunlitSilkTimelineItem = {
  time?: string
  title?: string
  description?: string
}

export type SunlitSilkData = {
  couple?: {
    brideName?: string
    groomName?: string
    brideRole?: string
    groomRole?: string
    brideMedia?: SunlitSilkMedia | string | null
    groomMedia?: SunlitSilkMedia | string | null
  }
  event?: {
    weddingDate?: string
    time?: string
    venueName?: string
    venueAddress?: string
    mapUrl?: string
  }
  opening?: { title?: string; message?: string }
  cover?: { eyebrow?: string; message?: string }
  invitation?: { title?: string; message?: string }
  families?: {
    title?: string
    message?: string
    brideSide?: SunlitSilkFamilySide
    groomSide?: SunlitSilkFamilySide
  }
  eventDetails?: {
    title?: string
    ceremonyLabel?: string
    ceremonyTime?: string
    receptionLabel?: string
    receptionTime?: string
  }
  calendar?: { month?: string; year?: string; day?: number | string }
  timeline?: { title?: string; message?: string; items?: SunlitSilkTimelineItem[] }
  venue?: { title?: string; name?: string; address?: string; mapUrl?: string; message?: string }
  activities?: { title?: string; items?: Array<{ title?: string }> }
  gallery?: { title?: string; message?: string }
  galleryImages?: Array<string | SunlitSilkMedia>
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
  giftQrMedia?: SunlitSilkMedia | null
  music?: {
    backgroundMusicUrl?: string
    backgroundMusicName?: string
    backgroundMusicAutoplay?: boolean
  }
  footer?: { title?: string; message?: string }
}
