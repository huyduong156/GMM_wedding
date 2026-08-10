import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { NavigationProvider } from '../../../app/providers/navigation/NavigationProvider'
import { InvitationEditorLivePage } from './InvitationEditorLivePage'

describe('InvitationEditorLivePage', () => {
  it('renders the live iframe editor, complete sections and image input', () => {
    render(<NavigationProvider><InvitationEditorLivePage /></NavigationProvider>)

    expect(screen.getByRole('heading', { name: /Chỉnh sửa thiệp/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Quay lại kho giao diện' })).toHaveAttribute('href', '/studio/invites/themes')
    expect(screen.getByRole('button', { name: 'Lưu' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Xem dạng điện thoại' })).toHaveAttribute('aria-pressed', 'true')

    const preview = screen.getByTitle('Bản xem trước thiệp Élan d’Amour')
    expect(screen.getByRole('status')).toHaveTextContent('Đang tải bản xem trước…')
    expect(preview).toHaveAttribute('src', '/templates/invitations/modern-luxe/preview?editor=1')
    expect(preview).toHaveStyle({ width: '550px', height: '950px' })
    fireEvent.click(screen.getByRole('button', { name: 'Xem dạng máy tính' }))
    expect(preview).toHaveStyle({ width: '1200px', height: '800px' })
    expect(screen.getByRole('button', { name: 'Mở rộng bản xem trước thiệp' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Đưa Bìa & cặp đôi xuống' })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: /^Album ảnh/ }))
    expect(screen.getByText('Thêm ảnh vào album')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Đưa Album ảnh lên' }))
    expect(screen.getByRole('button', { name: /^Album ảnh/ })).toBeInTheDocument()
  })

  it('advises mobile users without blocking the editor', () => {
    const matchMedia = vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true, media: '(max-width: 767px)', onchange: null, addListener: vi.fn(), removeListener: vi.fn(), addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn() } as MediaQueryList)
    render(<NavigationProvider><InvitationEditorLivePage /></NavigationProvider>)
    expect(screen.getByRole('dialog', { name: 'Chỉnh thiệp dễ hơn trên máy tính' })).toBeInTheDocument()
    expect(screen.getByTitle('Bản xem trước thiệp Élan d’Amour')).toHaveStyle({ width: '550px', height: '950px' })
    expect(screen.queryByRole('button', { name: 'Xem dạng máy tính' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Đã hiểu, tiếp tục' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    matchMedia.mockRestore()
  })
})
