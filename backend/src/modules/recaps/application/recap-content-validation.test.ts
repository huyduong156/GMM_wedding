import { describe, expect, it } from 'vitest'
import { validateRecapContent } from './recap-content-validation'

describe('recap content validation', () => {
  it('rejects overlong text and invalid repeatable card fields', () => {
    const issues = validateRecapContent('red-spider-lily-recap', {
      hero: {
        couple: 'A'.repeat(81),
        date: '20.08.2026',
        tagline: 'Ngay vui',
        ctaLabel: 'Mo album',
      },
      ourStory: { title: 'Loi dan', body: 'Noi dung' },
      photoDelivery: { title: 'Tra anh', body: 'Noi dung', ctaLabel: 'Xem album' },
      thankYou: { title: 'Cam on', body: 'Noi dung', signature: 'Minh & Anh', date: '20.08.2026' },
      chapters: [{ dateLabel: '01.01.2026', title: '', description: 'Mo ta' }],
      moments: [{ title: 'Khoanh khac', description: 'Mo ta' }],
      optional: { peopleBehindTheDay: { people: [] }, behindTheScenes: { items: [] } },
    })
    expect(issues).toEqual(
      expect.arrayContaining([
        { path: 'hero.couple', message: 'Must be at most 80 characters' },
        { path: 'chapters.0.title', message: 'Field is required' },
      ]),
    )
  })

  it('does not impose this template contract on another template', () => {
    expect(validateRecapContent('other-recap', { hero: { couple: 'A'.repeat(1000) } })).toEqual([])
  })
})
