import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'

import { NavigationProvider } from '../../../app/providers/navigation/NavigationProvider'
import { WeddingContext } from '../../../entities/wedding/model/wedding-context'
import { weddingApi, type Wedding } from '../../../shared/api/weddings'
import { InvitationEditorLivePage } from './InvitationEditorLivePage'

const wedding: Wedding = { id: '00000000-0000-4000-8000-000000000001', name: 'Lan & Minh', status: 'DRAFT', visibility: 'PUBLIC', timezone: 'Asia/Ho_Chi_Minh', locale: 'vi-VN', primaryDate: null, revision: 1, publishedAt: null, archivedAt: null, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' }
const workspace = { weddings: [wedding], activeWedding: wedding, loading: false, error: null, selectWedding: vi.fn(), refresh: vi.fn(), addWedding: vi.fn(), replaceWedding: vi.fn(), removeWedding: vi.fn() }

describe('InvitationEditorLivePage', () => {
  it('renders the live iframe editor, complete sections and image input', () => {
    render(<NavigationProvider><InvitationEditorLivePage /></NavigationProvider>)

    expect(screen.getByRole('heading', { name: /Chỉnh sửa thiệp/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Quay lại kho giao diện' })).toHaveAttribute('href', '/studio/invites/themes')
    expect(screen.getByRole('button', { name: 'Lưu thiệp' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Xem dạng điện thoại' })).toHaveAttribute('aria-pressed', 'true')

    const preview = screen.getByTitle(/Bản xem trước thiệp/)
    expect(screen.getByRole('status')).toHaveTextContent('Đang tải bản xem trước…')
    expect(preview).toHaveAttribute('src', '/templates/invitations/modern-luxe/preview?editor=1')
    expect(preview).toHaveStyle({ width: '550px', height: '950px' })
    fireEvent.click(screen.getByRole('button', { name: 'Xem dạng máy tính' }))
    expect(preview).toHaveStyle({ width: '1200px', height: '800px' })
    expect(screen.getByRole('button', { name: 'Mở rộng bản xem trước thiệp' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Đưa Bìa thiệp xuống' })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: /^Album ảnh/ }))
    expect(screen.getByText('Thêm ảnh vào album')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Đưa Album ảnh lên' }))
    expect(screen.getByRole('button', { name: /^Album ảnh/ })).toBeInTheDocument()
  })

  it('advises mobile users without blocking the editor', () => {
    const matchMedia = vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true, media: '(max-width: 767px)', onchange: null, addListener: vi.fn(), removeListener: vi.fn(), addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn() } as MediaQueryList)
    render(<NavigationProvider><InvitationEditorLivePage /></NavigationProvider>)
    expect(screen.getByRole('dialog', { name: 'Chỉnh thiệp dễ hơn trên máy tính' })).toBeInTheDocument()
    expect(screen.getByTitle(/Bản xem trước thiệp/)).toHaveStyle({ width: '550px', height: '950px' })
    expect(screen.queryByRole('button', { name: 'Xem dạng máy tính' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Đã hiểu, tiếp tục' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    matchMedia.mockRestore()
  })

  it('loads and saves the active invitation through the content API', async () => {
    const loadContent = vi.spyOn(weddingApi, 'content').mockResolvedValue({ content: { content: { brideName: 'Lan', groomName: 'Minh' }, schemaVersion: 1, revision: 4, surface: 'ONLINE_INVITATION', themeConfig: { palette: 'sage' }, sectionConfig: { enabled: ['cover', 'invitation', 'families', 'eventDetails'], order: ['cover', 'invitation', 'families', 'eventDetails'] }, templateVersion: { id: '22222222-2222-4222-8222-222222222222', key: 'modern-luxe', version: '2.3.0', config: {} } } })
    const save = vi.spyOn(weddingApi, 'saveContent').mockResolvedValue({ content: { content: {}, schemaVersion: 1, revision: 5, surface: 'ONLINE_INVITATION', themeConfig: { palette: 'sage' }, sectionConfig: { enabled: ['cover', 'invitation', 'families', 'eventDetails'], order: ['cover', 'invitation', 'families', 'eventDetails'] }, templateVersion: { id: '22222222-2222-4222-8222-222222222222', key: 'modern-luxe', version: '2.3.0', config: {} } } })

    render(<NavigationProvider><WeddingContext.Provider value={workspace}><InvitationEditorLivePage /></WeddingContext.Provider></NavigationProvider>)
    const bride = (await screen.findAllByDisplayValue('Lan'))[0]
    await waitFor(() => expect(loadContent).toHaveBeenCalledTimes(1))
    fireEvent.change(bride, { target: { value: 'Lan Anh' } })
    fireEvent.click(screen.getByRole('button', { name: 'Lưu thiệp' }))

    await waitFor(() => expect(save).toHaveBeenCalledWith(wedding.id, expect.objectContaining({ revision: 4, templateVersionId: '22222222-2222-4222-8222-222222222222', content: expect.objectContaining({ brideName: 'Lan Anh' }), themeConfig: { palette: 'sage' } })))
    expect((await screen.findAllByText('Đã lưu thay đổi.')).length).toBeGreaterThan(0)
  })
})
