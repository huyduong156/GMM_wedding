export type EditorialVowsSectionKey = 'navigation' | 'hero' | 'announcement' | 'couple' | 'story' | 'events' | 'countdown' | 'venues' | 'gallery' | 'schedule' | 'weddingParty' | 'dressCode' | 'travel' | 'faq' | 'rsvp' | 'guestbook' | 'gift' | 'footer'
export type EditorialVowsSectionConfig = { enabled: EditorialVowsSectionKey[]; order: EditorialVowsSectionKey[] }
export type EditorialVowsData = {
  hero: { brideName: string; groomName: string; eyebrow: string; headline: string; date: string; venue: string; image: string }
  announcement: { title: string; message: string }
  couple: { bride: { name: string; role: string; bio: string; image: string }; groom: { name: string; role: string; bio: string; image: string } }
  story: Array<{ year: string; title: string; body: string; image: string }>
  events: Array<{ date: string; time: string; title: string; venue: string; address: string }>
  gallery: Array<{ src: string; alt: string }>
  schedule: Array<{ time: string; title: string; detail: string }>
  weddingParty: Array<{ name: string; role: string }>
  dressCode: { title: string; message: string; colors: string[] }
  travel: Array<{ title: string; detail: string }>
  faq: Array<{ question: string; answer: string }>
  guestbook: Array<{ author: string; message: string }>
  footer: { message: string; signature: string }
}

