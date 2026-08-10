import { describe, expect, it } from 'vitest'

import { saveWeddingContentSchema } from './wedding-schemas'

describe('saveWeddingContentSchema', () => {
  it('accepts the editor content contract', () => {
    const result = saveWeddingContentSchema.parse({
      surface: 'ONLINE_INVITATION',
      templateVersionId: '11111111-1111-4111-8111-111111111111',
      content: {}, themeConfig: {},
      sectionConfig: { enabled: ['hero', 'rsvp'], order: ['hero', 'rsvp'] },
      revision: 1,
    })
    expect(result.sectionConfig.order).toEqual(['hero', 'rsvp'])
  })
})
