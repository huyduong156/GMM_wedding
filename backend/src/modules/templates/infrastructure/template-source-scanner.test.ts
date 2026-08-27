import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { readSectionKeys } from './template-source-scanner'

const frontendTemplates = path.resolve(process.cwd(), '..', 'frontend', 'src', 'templates')
const source = (relativePath: string) => readFileSync(path.join(frontendTemplates, relativePath), 'utf8')
const keys = (value: ReturnType<typeof readSectionKeys>) => value.map((item) => item.sectionKey)

describe('readSectionKeys', () => {
  it('reads invitation configs with inline sectionKey objects', () => {
    expect(keys(readSectionKeys(source('invitations/verdant-promise/template-config.ts')))).toEqual([
      'cover', 'invitation', 'families', 'eventDetails', 'countdown', 'timeline', 'venue', 'gallery', 'rsvp', 'guestbook', 'gift',
    ])
  })

  it('reads website configs that map a tuple array into section objects', () => {
    expect(keys(readSectionKeys(source('websites/enchanted-forest/template-config.ts')))).toEqual([
      'navigation', 'hero', 'announcement', 'couple', 'story', 'events', 'countdown', 'venues', 'gallery', 'schedule', 'dressCode', 'faq', 'rsvp', 'guestbook', 'footer',
    ])
  })

  it('reads recap configs that map a string array into section objects', () => {
    expect(keys(readSectionKeys(source('recaps/red-spider-lily/template-config.ts')))).toEqual([
      'hero', 'ourStory', 'chapters', 'moments', 'photoDelivery', 'thankYou', 'guestbook', 'peopleBehindTheDay', 'weddingFilm', 'soundtrack', 'behindTheScenes', 'memoryCapsule',
    ])
  })

  it('supports sections mapped from a separately named key array', () => {
    expect(keys(readSectionKeys("const keys = ['one', 'two']; export const config = { sections: keys.map((sectionKey) => ({ sectionKey })) }"))).toEqual(['one', 'two'])
  })

  it('supports direct string and tuple section arrays', () => {
    expect(keys(readSectionKeys("export const config = { sections: ['one', 'two'] }"))).toEqual(['one', 'two'])
    expect(keys(readSectionKeys("export const config = { sections: [['one', 'One'], ['two', 'Two']] }"))).toEqual(['one', 'two'])
  })
})
