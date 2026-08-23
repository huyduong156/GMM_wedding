import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import Swal from 'sweetalert2'
import { NavigationProvider } from '../../../app/providers/navigation/NavigationProvider'
import { WeddingContext } from '../../../entities/wedding/model/wedding-context'
import { WeddingApiError, weddingApi, type Wedding } from '../../../shared/api/weddings'
import { RecapThemesPage } from './RecapThemesPage'

const wedding: Wedding = { id: '11111111-1111-4111-8111-111111111111', name: 'Mai & Đức', status: 'DRAFT', visibility: 'PUBLIC', timezone: 'Asia/Ho_Chi_Minh', locale: 'vi-VN', primaryDate: null, revision: 1, publishedAt: null, archivedAt: null, createdAt: '2026-08-10T00:00:00Z', updatedAt: '2026-08-10T00:00:00Z' }
const context = { weddings: [wedding], activeWedding: wedding, loading: false, error: null, selectWedding: vi.fn(), refresh: vi.fn(), addWedding: vi.fn(), replaceWedding: vi.fn(), removeWedding: vi.fn() }

describe('RecapThemesPage', () => {
  vi.spyOn(Swal, 'fire').mockResolvedValue({} as never)
  it('loads the recap catalog and creates a draft when starting from a theme', async () => {
    const templateVersionId = '22222222-2222-4222-8222-222222222222'
    vi.spyOn(weddingApi, 'templates').mockResolvedValue({ items: [{ key: 'winter-wedding-recap', name: 'Winter Wedding Recap', productType: 'RECAP', status: 'ACTIVE', description: 'Recap điện ảnh', versions: [{ id: templateVersionId, version: '1.0.0', configHash: 'hash', templateConfigVersion: 1, contentSchemaVersion: 1, rendererApiVersion: 1, config: { sections: ['opening', 'chapters', 'filmstrip', 'quote', 'finale'] }, releasedAt: '2026-08-10T00:00:00Z', deprecatedAt: null }] }] })
    vi.spyOn(weddingApi, 'recap').mockRejectedValue(new WeddingApiError(404, 'RECAP_NOT_FOUND', 'not found'))
    const save = vi.spyOn(weddingApi, 'saveRecap').mockResolvedValue({ recap: { id: '33333333-3333-4333-8333-333333333333', weddingId: wedding.id, status: 'DRAFT', slug: null, title: 'Wedding Recap của Mai & Đức', thankYouMessage: null, ogTitle: null, ogDescription: null, ogImageUrl: null, content: {}, themeConfig: {}, sectionConfig: { enabled: ['opening', 'chapters', 'filmstrip', 'quote', 'finale'], order: ['opening', 'chapters', 'filmstrip', 'quote', 'finale'] }, revision: 1, publishedAt: null, updatedAt: '2026-08-10T00:00:00Z', templateVersion: { id: templateVersionId, key: 'winter-wedding-recap', version: '1.0.0', config: {} }, mediaItems: [], wishSelections: [] } })

    render(<NavigationProvider><WeddingContext.Provider value={context}><RecapThemesPage /></WeddingContext.Provider></NavigationProvider>)
    expect(await screen.findByRole('heading', { name: 'Winter Wedding Recap' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Bắt đầu với giao diện này' }))
    await waitFor(() => expect(save).toHaveBeenCalledWith(wedding.id, expect.objectContaining({ templateVersionId, revision: 1, sectionConfig: { enabled: ['opening', 'chapters', 'filmstrip', 'quote', 'finale'], order: ['opening', 'chapters', 'filmstrip', 'quote', 'finale'] } })))
  })
})