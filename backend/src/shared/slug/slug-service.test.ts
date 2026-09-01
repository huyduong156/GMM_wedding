import { describe, expect, it, vi } from 'vitest'
import { SlugService } from './slug-service'

describe('SlugService', () => {
  it('normalizes Vietnamese wedding names', () => {
    expect(new SlugService().normalize('Huy & Yến')).toBe('huy-yen')
  })

  it('uses the preferred readable candidates before numeric suffixes', async () => {
    const service = new SlugService()
    const taken = new Set([
      'huy-yen',
      'huy-yen-wedding',
      'wedding-huy-yen',
      'huy-yen-web-wedding',
      'web-wedding-huy-yen',
    ])
    const isTaken = vi.fn(async (slug: string) => taken.has(slug))

    await expect(service.unique('Huy & Yến', isTaken)).resolves.toBe('huy-yen-wedding-1')
    expect(isTaken).toHaveBeenCalledWith('huy-yen')
    expect(isTaken).toHaveBeenCalledWith('web-wedding-huy-yen')
  })

  it('returns the first available preferred candidate', async () => {
    await expect(
      new SlugService().unique('Huy & Yến', async (slug) => slug === 'huy-yen'),
    ).resolves.toBe('huy-yen-wedding')
  })
})
