export type AstralVowSectionKey =
  | 'opening' | 'cover' | 'invitation' | 'families' | 'countdown'
  | 'timeline' | 'venue' | 'gallery' | 'rsvp' | 'guestbook' | 'gift' | 'music' | 'footer'

export type AstralVowSectionConfig = {
  enabled: AstralVowSectionKey[]
  order: AstralVowSectionKey[]
}

export type AstralVowMedia = { src: string; alt?: string; mediaAssetId?: string; role?: string }
export type AstralVowFamilySide = { label?: string; fatherTitle?: string; father?: string; motherTitle?: string; mother?: string; address?: string }
export type AstralVowTimelineItem = { time?: string; title?: string; description?: string; image?: string | AstralVowMedia }
export type AstralVowEventDetailItem = { time?: string; title?: string }

export type AstralVowData = {
  couple?: { brideName?: string; groomName?: string }
  event?: { weddingDate?: string; time?: string; venueName?: string; venueAddress?: string; mapUrl?: string }
  opening?: { title?: string; message?: string }
  openingMediaBack?: AstralVowMedia | null
  openingMediaFront?: AstralVowMedia | null
  cover?: { eyebrow?: string; title?: string; message?: string }
  heroMedia?: AstralVowMedia | null
  invitation?: { title?: string; message?: string }
  invitationMemoryImage1?: string | AstralVowMedia
  invitationMemoryImage2?: string | AstralVowMedia
  invitationMemoryImage3?: string | AstralVowMedia
  families?: { title?: string; subtitle?: string; message?: string; brideSide?: AstralVowFamilySide; groomSide?: AstralVowFamilySide }
  countdown?: { enabled?: boolean }
  venue?: { title?: string; name?: string; address?: string; mapUrl?: string; message?: string }
  timeline?: { title?: string; message?: string; items?: AstralVowTimelineItem[] }
  gallery?: { title?: string; message?: string; images?: Array<string | AstralVowMedia> }
  galleryImages?: Array<string | AstralVowMedia>
  rsvp?: { title?: string; message?: string; deadline?: string; successMessage?: string; attendingLabel?: string; notAttendingLabel?: string }
  guestbook?: { title?: string; message?: string; successMessage?: string }
  gift?: { title?: string; message?: string; thankYouMessage?: string }
  giftQrMedia?: AstralVowMedia | null
  music?: { backgroundMusicUrl?: string; backgroundMusicName?: string; backgroundMusicAutoplay?: boolean }
  footer?: { title?: string; message?: string }
  footerMedia?: AstralVowMedia | null
}
