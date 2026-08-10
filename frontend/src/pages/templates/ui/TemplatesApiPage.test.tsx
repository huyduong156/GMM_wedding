import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'

import { NavigationProvider } from '../../../app/providers/navigation/NavigationProvider'
import { WeddingContext } from '../../../entities/wedding/model/wedding-context'
import { weddingApi, type Wedding } from '../../../shared/api/weddings'
import { TemplatesApiPage } from './TemplatesApiPage'

const wedding: Wedding = {
  id: '11111111-1111-4111-8111-111111111111', name: 'Mai & Đức', status: 'DRAFT', visibility: 'PUBLIC',
  timezone: 'Asia/Ho_Chi_Minh', locale: 'vi-VN', primaryDate: null, revision: 1, publishedAt: null,
  archivedAt: null, createdAt: '2026-08-10T00:00:00Z', updatedAt: '2026-08-10T00:00:00Z',
}

describe('TemplatesApiPage', () => {
  it('loads the online invitation catalog and applies a template', async () => {
    vi.spyOn(weddingApi, 'templates').mockResolvedValue({ items: [{
      key: 'modern-luxe', name: 'Élan d’Amour', productType: 'ONLINE_INVITATION', status: 'ACTIVE', description: 'Thiệp couture',
      versions: [{ id: '22222222-2222-4222-8222-222222222222', version: '2.3.0', configHash: 'hash', templateConfigVersion: 1, contentSchemaVersion: 1, rendererApiVersion: 1, config: { sections: ['cover', 'invitation'] }, releasedAt: '2026-08-10T00:00:00Z', deprecatedAt: null }],
    }] })
    vi.spyOn(weddingApi, 'content').mockResolvedValue({ content: { content: {}, schemaVersion: 1, revision: 1, surface: 'ONLINE_INVITATION', themeConfig: {}, sectionConfig: { enabled: [], order: [] }, templateVersion: null } })
    const save = vi.spyOn(weddingApi, 'saveContent').mockResolvedValue({ content: { content: {}, schemaVersion: 1, revision: 2, surface: 'ONLINE_INVITATION', themeConfig: {}, sectionConfig: { enabled: ['cover', 'invitation'], order: ['cover', 'invitation'] }, templateVersion: { id: '22222222-2222-4222-8222-222222222222', key: 'modern-luxe', version: '2.3.0', config: {} } } })

    render(<NavigationProvider><WeddingContext.Provider value={{ weddings: [wedding], activeWedding: wedding, loading: false, error: null, selectWedding: vi.fn(), refresh: vi.fn(), addWedding: vi.fn(), replaceWedding: vi.fn(), removeWedding: vi.fn() }}><TemplatesApiPage kind="invitation" /></WeddingContext.Provider></NavigationProvider>)
    expect(await screen.findByRole('heading', { name: 'Élan d’Amour' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Dùng giao diện' }))
    await waitFor(() => expect(save).toHaveBeenCalledWith(wedding.id, expect.objectContaining({ surface: 'ONLINE_INVITATION', templateVersionId: '22222222-2222-4222-8222-222222222222', revision: 1 })))
    expect(await screen.findByText('Đã chọn giao diện Élan d’Amour.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Chỉnh sửa' })).toHaveAttribute('href', '/studio/invites')
  })
})
