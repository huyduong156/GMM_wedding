export type EnchantedForestSectionKey =
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
  | 'dressCode'
  | 'faq'
  | 'rsvp'
  | 'guestbook'
  | 'footer'
export type EnchantedForestSectionConfig = {
  enabled: EnchantedForestSectionKey[]
  order: EnchantedForestSectionKey[]
}
export type EnchantedForestData = {
  hero: { brideName: string; groomName: string; date: string; venue: string; image: string }
  announcement: { title: string; message: string }
  couple: {
    bride: { name: string; bio: string; image: string }
    groom: { name: string; bio: string; image: string }
  }
  story: Array<{ year: string; title: string; body: string; image: string }>
  events: Array<{ date: string; time: string; title: string; venue: string; address: string }>
  gallery: Array<{ src: string; alt: string }>
  schedule: Array<{ time: string; title: string; detail: string }>
  dressCode: { title: string; message: string; colors: string[] }
  faq: Array<{ question: string; answer: string }>
  guestbook: Array<{ author: string; message: string }>
  footer: { message: string; signature: string }
}
