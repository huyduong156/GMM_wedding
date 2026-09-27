import { vi } from 'vitest'
import { adminTemplateApi } from './admin-templates'
import { resetCsrfTokenForTests } from './csrf'

describe('adminTemplateApi lifecycle mutations', () => {
  it('sends the CSRF header when releasing without a request body', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ csrfToken: 'test-csrf-token' }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ version: {} }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }))
    vi.stubGlobal('fetch', fetchMock)
    await adminTemplateApi.release('chibi-daydream', '1.1.0')
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/admin/templates/chibi-daydream/versions/1.1.0/release'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'content-type': 'application/json',
          'x-csrf-token': 'test-csrf-token',
        }),
      }),
    )
    vi.unstubAllGlobals()
    resetCsrfTokenForTests()
  })
})
