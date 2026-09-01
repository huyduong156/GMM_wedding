import Swal from 'sweetalert2'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { NavigationProvider } from '../../../app/providers/navigation/NavigationProvider'
import { WeddingContext } from '../../../entities/wedding/model/wedding-context'
import { WeddingApiError, weddingApi, type Wedding } from '../../../shared/api/weddings'
import { RecapThemesPage } from './RecapThemesPage'

const wedding: Wedding = { id: '11111111-1111-4111-8111-111111111111', slug: 'mai-duc', name: 'Mai & Đức', status: 'DRAFT', visibility: 'PUBLIC', timezone: 'Asia/Ho_Chi_Minh', locale: 'vi-VN', primaryDate: null, revision: 1, publishedAt: null, archivedAt: null, createdAt: '2026-08-10T00:00:00Z', updatedAt: '2026-08-10T00:00:00Z' }
const context = { weddings: [wedding], activeWedding: wedding, loading: false, error: null, selectWedding: vi.fn(), refresh: vi.fn(), addWedding: vi.fn(), replaceWedding: vi.fn(), removeWedding: vi.fn() }

describe('RecapThemesPage', () => {
  vi.spyOn(Swal, 'fire').mockResolvedValue({} as never)
  it('loads the recap catalog and creates a draft when starting from a theme', async () => {
    const templateVersionId = '22222222-2222-4222-8222-222222222222'
    const sections = ['hero', 'ourStory', 'chapters', 'moments', 'photoDelivery', 'thankYou']
    vi.spyOn(weddingApi, 'templates').mockResolvedValue({ items: [{ key: 'red-spider-lily-recap', name: 'Dấu Son Bỉ Ngạn', productType: 'RECAP', status: 'ACTIVE', description: 'Recap botanical editorial', versions: [{ id: templateVersionId, version: '0.1.0', configHash: 'hash', templateConfigVersion: 1, contentSchemaVersion: 1, rendererApiVersion: 1, config: { sections }, releasedAt: '2026-08-10T00:00:00Z', deprecatedAt: null }] }] })
    vi.spyOn(weddingApi, 'recap').mockRejectedValue(new WeddingApiError(404, 'RECAP_NOT_FOUND', 'not found'))
    const save = vi.spyOn(weddingApi, 'saveRecap').mockResolvedValue({ recap: { id: '33333333-3333-4333-8333-333333333333', weddingId: wedding.id, status: 'DRAFT', slug: null, title: 'Wedding Recap của Mai & Đức', thankYouMessage: null, ogTitle: null, ogDescription: null, ogImageUrl: null, content: {}, themeConfig: {}, sectionConfig: { enabled: sections, order: sections }, revision: 1, publishedAt: null, updatedAt: '2026-08-10T00:00:00Z', templateVersion: { id: templateVersionId, key: 'red-spider-lily-recap', version: '0.1.0', config: {} }, mediaItems: [], wishSelections: [] } })

    render(<NavigationProvider><WeddingContext.Provider value={context}><RecapThemesPage /></WeddingContext.Provider></NavigationProvider>)
    expect(await screen.findByRole('heading', { name: 'Dấu Son Bỉ Ngạn' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Bắt đầu với giao diện này' }))
    await waitFor(() => expect(save).toHaveBeenCalledWith(wedding.id, expect.objectContaining({ templateVersionId, revision: 1, sectionConfig: { enabled: sections, order: sections } })))
  })
})
