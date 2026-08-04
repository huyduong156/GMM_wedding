import { describe, expect, it } from 'vitest'

import { GET } from './route'

describe('GET /api/health/live', () => {
  it('returns a healthy response and propagates the request id', async () => {
    const response = GET(
      new Request('http://localhost:3000/api/health/live', {
        headers: { 'x-request-id': 'req_test' },
      }),
    )

    expect(response.status).toBe(200)
    expect(response.headers.get('x-request-id')).toBe('req_test')
    await expect(response.json()).resolves.toEqual({
      status: 'ok',
      service: 'gmm-wedding-backend',
      requestId: 'req_test',
    })
  })
})
