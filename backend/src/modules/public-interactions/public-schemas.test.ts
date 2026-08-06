import { describe, expect, it } from 'vitest'
import { rsvpSchema, wishSchema } from './public-schemas'
describe('public interaction schemas', () => {
  it('requires a valid attendance and bounded party size', () => {
    expect(rsvpSchema.parse({ attendance: 'ATTENDING', partySize: 2 })).toMatchObject({ attendance: 'ATTENDING', partySize: 2 })
    expect(() => rsvpSchema.parse({ attendance: 'ATTENDING', partySize: 0 })).toThrow()
  })
  it('requires non-empty wishes', () => { expect(() => wishSchema.parse({ content: '   ' })).toThrow() })
})
