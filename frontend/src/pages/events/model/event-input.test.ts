import { describe, expect, it } from 'vitest'
import { buildEventInput } from './event-input'
const form = { name: 'Lễ thành hôn', eventType: 'CEREMONY', startsAt: '2026-12-12T09:00', endsAt: '', venueName: '', addressLine: '', mapUrl: '', isPublic: true }
describe('event API input', () => {
  it('omits blank optional fields when creating', () => { const input = buildEventInput(form, 'Asia/Ho_Chi_Minh', false); expect(input).not.toHaveProperty('venueName'); expect(input).not.toHaveProperty('addressLine'); expect(input).not.toHaveProperty('mapUrl'); expect(input).not.toHaveProperty('endsAt') })
  it('sends null when an existing optional value is cleared', () => { expect(buildEventInput(form, 'Asia/Ho_Chi_Minh', true)).toMatchObject({ venueName: null, addressLine: null, mapUrl: null, endsAt: null }) })
  it('rejects an end time before the start time', () => { expect(() => buildEventInput({ ...form, endsAt: '2026-12-12T08:00' }, 'Asia/Ho_Chi_Minh', false)).toThrow(/kết thúc/i) })
})
