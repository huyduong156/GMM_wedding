import { vi } from 'vitest'
import { adminTemplateApi } from './admin-templates'
import { resetCsrfTokenForTests } from './csrf'

describe('adminTemplateApi lifecycle mutations', () => {
  it('sends the CSRF header when releasing without a request body', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ csrfToken: 'test-csrf-token' }), { status: 200 }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ version: {} }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        }),
      )
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

  it('loads the release bundle from the frontend build before syncing', async () => {
    resetCsrfTokenForTests()
    const bundle = {
      bundleVersion: 1 as const,
      generatedAt: '2026-10-03T00:00:00.000Z',
      sourceRevision: 'revision',
      templates: [
        {
          templateKey: 'modern-luxe',
          displayName: 'Modern Luxe',
          productType: 'ONLINE_INVITATION' as const,
          templateVersion: '1.0.0',
          sourceStatus: 'READY' as const,
          templateConfigVersion: 1,
          contentSchemaVersion: 1,
          rendererApiVersion: 1,
          config: { sections: [{ sectionKey: 'hero' }] },
        },
      ],
    }
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify(bundle), { status: 200 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ csrfToken: 'test-csrf-token' }), { status: 200 }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ created: 1, updated: 0, unchanged: 0, results: [] }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        }),
      )
    vi.stubGlobal('fetch', fetchMock)

    await adminTemplateApi.sync()

    expect(fetchMock).toHaveBeenNthCalledWith(1, '/template-release-bundle.json', {
      cache: 'no-store',
    })
    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      expect.stringContaining('/admin/templates/sync'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(bundle),
      }),
    )
    vi.unstubAllGlobals()
    resetCsrfTokenForTests()
  })
})
