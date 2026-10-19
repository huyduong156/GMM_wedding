import { fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { MediaAsset } from '../../../shared/api/weddings'
import { MediaManagerModal } from './MediaManagerModal'
import { MediaViewerDialog } from './MediaViewerDialog'

const assets: MediaAsset[] = [
  { id: 'first', status: 'READY', mimeType: 'image/jpeg', sizeBytes: 1, publicUrl: '/first.jpg', originalName: 'Ảnh đầu.jpg' },
  { id: 'second', status: 'READY', mimeType: 'image/jpeg', sizeBytes: 1, publicUrl: '/second.jpg', originalName: 'Ảnh sau.jpg' },
]

afterEach(() => {
  document.body.style.overflow = ''
})

describe('MediaViewerDialog', () => {
  it('shows the full image and moves between assets with buttons and arrow keys', () => {
    const onClose = vi.fn()
    render(<MediaViewerDialog assets={assets} initialAssetId="first" onClose={onClose} />)
    expect(screen.getByRole('img', { name: 'Ảnh đầu.jpg' })).toHaveAttribute('src', '/first.jpg')
    fireEvent.click(screen.getByRole('button', { name: 'Ảnh tiếp theo' }))
    expect(screen.getByRole('img', { name: 'Ảnh sau.jpg' })).toHaveAttribute('src', '/second.jpg')
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(screen.getByRole('img', { name: 'Ảnh đầu.jpg' })).toBeInTheDocument()
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('does not offer cropping without edit permission', () => {
    render(<MediaViewerDialog assets={assets} initialAssetId="first" onClose={vi.fn()} />)
    expect(screen.queryByRole('button', { name: 'Chỉnh ảnh' })).not.toBeInTheDocument()
  })
})

describe('MediaManagerModal viewer', () => {
  it('keeps the image selection unchanged while browsing full images', () => {
    const onConfirm = vi.fn()
    render(
      <MediaManagerModal
        open
        assets={assets}
        selectedIds={['first']}
        loading={false}
        uploading={false}
        error=""
        onClose={vi.fn()}
        onUpload={vi.fn(async () => [])}
        onConfirm={onConfirm}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Xem lớn Ảnh đầu.jpg' }))
    fireEvent.click(screen.getByRole('button', { name: 'Ảnh tiếp theo' }))
    expect(within(screen.getByRole('dialog', { name: 'Xem ảnh Ảnh sau.jpg' })).getByRole('img', { name: 'Ảnh sau.jpg' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Đóng ảnh' }))
    fireEvent.click(screen.getByRole('button', { name: 'Dùng ảnh này' }))
    expect(onConfirm).toHaveBeenCalledWith([assets[0]])
  })
})
