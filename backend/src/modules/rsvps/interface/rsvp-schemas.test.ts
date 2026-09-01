import { describe, expect, it } from 'vitest'
import { rsvpQuerySchema } from './rsvp-schemas'

describe('RSVP API schemas', () => {
  it('applies pagination defaults and parses date filters', () => {
    const result = rsvpQuerySchema.parse({
      from: '2026-08-01T00:00:00.000Z',
      to: '2026-08-31T23:59:59.000Z',
    })
    expect(result.limit).toBe(50)
    expect(result.from).toBeInstanceOf(Date)
  })

  it('rejects an invalid date range', () => {
    expect(() =>
      rsvpQuerySchema.parse({ from: '2026-09-01T00:00:00.000Z', to: '2026-08-01T00:00:00.000Z' }),
    ).toThrow()
  })
})
