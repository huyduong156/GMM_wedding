import { NextRequest } from 'next/server'
import { describe, expect, it, vi } from 'vitest'

const approvedWishes = vi.fn().mockResolvedValue([
  { id: 'wish_1', authorName: 'Khach moi', content: 'Tram nam hanh phuc' },
])

vi.mock('@/modules/public-interactions', () => ({
  getPublicInteractionService: () => ({ approvedWishes }),
}))

vi.mock('@/platform/config/env', () => ({
  getServerEnv: () => ({
    APP_ENV: 'production',
    APP_ORIGIN: 'https://ourday.asia',
    APP_ORIGINS: 'https://ourday.asia',
    ACCESS_LOGGING: false,
  }),
}))

import { GET } from './route'

describe('GET /api/public/weddings/:slug/wishes', () => {
  it('returns approved wishes with credentialed CORS headers', async () => {
    const response = await GET(
      new NextRequest('https://api.ourday.asia/api/public/weddings/huy-yen/wishes', {
        headers: {
          origin: 'https://ourday.asia',
          'x-request-id': 'req_public_wishes',
        },
      }),
      { params: Promise.resolve({ slug: 'huy-yen' }) },
    )

    expect(response.status).toBe(200)
    expect(response.headers.get('access-control-allow-origin')).toBe('https://ourday.asia')
    expect(response.headers.get('access-control-allow-credentials')).toBe('true')
    expect(response.headers.get('vary')).toContain('Origin')
    expect(response.headers.get('x-request-id')).toBe('req_public_wishes')
    await expect(response.json()).resolves.toEqual([
      { id: 'wish_1', authorName: 'Khach moi', content: 'Tram nam hanh phuc' },
    ])
    expect(approvedWishes).toHaveBeenCalledWith('huy-yen')
  })
})
