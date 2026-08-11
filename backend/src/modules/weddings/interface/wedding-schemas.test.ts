import { describe, expect, it } from 'vitest'

import { saveWeddingContentSchema } from './wedding-schemas'

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
