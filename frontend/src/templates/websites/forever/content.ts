export type ForeverSectionKey = 'hero' | 'announcement' | 'couple' | 'story' | 'events' | 'countdown' | 'venues' | 'gallery' | 'schedule' | 'dressCode' | 'travel' | 'faq' | 'rsvp' | 'gift' | 'guestbook' | 'footer' | 'weddingParty' | 'music'
export type ForeverSectionConfig = { enabled: ForeverSectionKey[]; order: ForeverSectionKey[] }
export type ForeverData = {
  hero: { brideName: string; groomName: string; headline: string; date: string; time: string; location: string; image: string; imageAlt: string }
  announcement: { message: string; signature: string }
  couple: { image: string; imageAlt: string; bio: string }
  story: Array<{ year: string; title: string; body: string }>
  events: { summary: { weekday: string; date: string; hours: string; venue: string }; items: Array<{ type: string; title: string; time: string; date: string; venue: string; address: string; mapUrl: string }> }
  countdown: { message: string; dateLabel: string; time: string }
  venues: { image: string; imageAlt: string; heading: string; note: string; address: string; mapUrl: string }
  gallery: { heading: string; images: Array<{ src: string; alt: string }> }
  schedule: { heading: string; items: Array<{ time: string; title: string }> }
  weddingParty: { title?: string; groups: Array<{ id: string; title: string; members: Array<{ id: string; name: string; role?: string; biography?: string; mediaId: string | null; portraitUrl?: string | null }> }> }
  dressCode: { heading: string; message: string; colors: string[] }
  travel: { message: string; linkLabel: string; url: string }
  faq: { items: Array<{ question: string; answer: string }> }
  rsvp: { heading: string; message: string; deadline: string; note: string; actionLabel: string }
  gift: { message: string }
  guestbook: { heading: string; actionLabel: string }
  footer: { message: string; signature: string }
  music: { musicTrackId: string | null; autoplay: boolean; projection?: { src: string; title: string } | null }
}
