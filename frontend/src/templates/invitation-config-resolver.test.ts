import { describe, expect, it } from 'vitest'
import { resolveInvitationTemplateSections } from './invitation-config-resolver'

describe('resolveInvitationTemplateSections', () => {
  it('restores sections missing from an older invitation template version', () => {
    const sections = resolveInvitationTemplateSections('astral-vow', {
      sections: ['opening', 'cover', 'invitation', 'families', 'countdown', 'music', 'footer'],
    })

    const keys = sections.map((section) =>
      typeof section === 'string' ? section : section.sectionKey,
    )

    expect(keys).toHaveLength(13)
    expect(keys).toEqual(expect.arrayContaining([
      'opening',
      'cover',
      'invitation',
      'families',
      'countdown',
      'timeline',
      'venue',
      'gallery',
      'rsvp',
      'guestbook',
      'gift',
      'music',
      'footer',
    ]))
  })
})
