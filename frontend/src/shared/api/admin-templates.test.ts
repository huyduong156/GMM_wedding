import { afterEach, describe, expect, it, vi } from 'vitest'
import { adminTemplateApi } from './admin-templates'

afterEach(() => vi.restoreAllMocks())

describe('adminTemplateApi', () => {
  it('loads templates with the platform admin session', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ pendingReviewCount: 0, items: [] }), { status: 200, headers: { 'content-type': 'application/json' } }))
    await adminTemplateApi.list('ONLINE_INVITATION')
    expect(fetchSpy).toHaveBeenCalledWith(expect.stringContaining('/admin/templates?productType=ONLINE_INVITATION'), expect.objectContaining({ credentials: 'include' }))
  })

  it('sends CSRF headers when releasing a version', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ version: {} }), { status: 200, headers: { 'content-type': 'application/json' } }))
    await adminTemplateApi.release('modern-luxe', '2.3.0')
    expect(fetchSpy).toHaveBeenCalledWith(expect.stringContaining('/modern-luxe/versions/2.3.0/release'), expect.objectContaining({ method: 'POST', credentials: 'include', headers: expect.objectContaining({ 'x-csrf-protection': '1' }) }))
  })
})
