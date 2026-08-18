import { describe, expect, it } from 'vitest'

import { linkWishGuestSchema, promoteWishSchema, saveWeddingContentSchema, wishQuerySchema } from './wedding-schemas'

describe('saveWeddingContentSchema', () => {
  it('accepts the editor content contract', () => {
    const result = saveWeddingContentSchema.parse({
      surface: 'ONLINE_INVITATION',
      templateVersionId: '11111111-1111-4111-8111-111111111111',
      content: {}, themeConfig: { palette: 'sage', typography: { display: 'Fraunces' } },
      sectionConfig: { enabled: ['hero', 'rsvp'], order: ['hero', 'rsvp'] },
      revision: 1,
    })
    expect(result.sectionConfig.order).toEqual(['hero', 'rsvp'])
    expect(result.themeConfig).toEqual({ palette: 'sage', typography: { display: 'Fraunces' } })
  })

  it('rejects themeConfig when the whole value is not an object', () => {
    const result = saveWeddingContentSchema.safeParse({
      surface: 'ONLINE_INVITATION',
      templateVersionId: '11111111-1111-4111-8111-111111111111',
      content: {}, themeConfig: 'sage',
      sectionConfig: { enabled: ['hero'], order: ['hero'] },
      revision: 1,
    })
    expect(result.success).toBe(false)
  })
})

describe('wish schemas', () => {
  it('normalizes owner wish filters and validates the date range', () => {
    const result = wishQuerySchema.parse({ status: 'PENDING', q: '  hoa  ', from: '2026-08-01T00:00:00.000Z', to: '2026-08-02T00:00:00.000Z' })
    expect(result).toMatchObject({ status: 'PENDING', q: 'hoa', limit: 50 })
    expect(result.from).toBeInstanceOf(Date)
  })

  it('accepts guest-link actions', () => {
    expect(promoteWishSchema.parse({ displayName: 'Nguyen Van A' })).toEqual({ displayName: 'Nguyen Van A' })
    expect(linkWishGuestSchema.parse({ guestId: '11111111-1111-4111-8111-111111111111' }).guestId).toBeTruthy()
  })
})
