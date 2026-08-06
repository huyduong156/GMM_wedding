import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ConfirmDialog } from './ConfirmDialog'

describe('ConfirmDialog', () => {
  it('supports confirm, escape and backdrop cancellation', () => {
    const onConfirm = vi.fn(), onCancel = vi.fn()
    const { rerender } = render(<ConfirmDialog open title="Xóa?" description="Không thể hoàn tác." onConfirm={onConfirm} onCancel={onCancel} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Xóa' })).toHaveFocus()
    fireEvent.click(screen.getByRole('button', { name: 'Xóa' }))
    expect(onConfirm).toHaveBeenCalledOnce()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onCancel).toHaveBeenCalledOnce()
    fireEvent.mouseDown(screen.getByRole('presentation'))
    expect(onCancel).toHaveBeenCalledTimes(2)
    rerender(<ConfirmDialog open={false} title="Xóa?" description="" onConfirm={onConfirm} onCancel={onCancel} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('locks cancellation while busy', () => {
    const onConfirm = vi.fn(), onCancel = vi.fn()
    render(<ConfirmDialog open busy title="Xóa?" description="Đang xử lý" onConfirm={onConfirm} onCancel={onCancel} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    fireEvent.mouseDown(screen.getByRole('presentation'))
    fireEvent.click(screen.getByRole('button', { name: 'Đóng' }))
    expect(onCancel).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Đang xóa…' })).toBeDisabled()
  })
})
