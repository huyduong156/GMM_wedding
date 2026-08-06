import { describe, expect, it } from 'vitest'
import { formatDate, formatDateTime } from './date-format'

describe('Vietnamese workspace date format', () => {
  it('uses DD/MM/YYYY consistently', () => {
    expect(formatDate('2026-12-09T05:00:00.000Z')).toBe('09/12/2026')
    expect(formatDateTime('2026-12-09T10:30:00.000Z')).toBe('09/12/2026 · 17:30')
  })
})
