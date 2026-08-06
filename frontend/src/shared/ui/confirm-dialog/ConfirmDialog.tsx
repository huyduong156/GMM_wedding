import { useEffect, useRef } from 'react'
import { Trash, X } from '@phosphor-icons/react'

type ConfirmDialogProps = {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  busy?: boolean
  onConfirm: () => void | Promise<void>
  onCancel: () => void
}

export function ConfirmDialog({ open, title, description, confirmLabel = 'Xóa', cancelLabel = 'Hủy', busy = false, onConfirm, onCancel }: ConfirmDialogProps) {
  const confirmRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!open) return
    confirmRef.current?.focus()
    function handleKeyDown(event: KeyboardEvent) { if (event.key === 'Escape' && !busy) onCancel() }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [busy, onCancel, open])
  if (!open) return null
  return <div className="confirm-dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !busy) onCancel() }}>
    <section className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title" aria-describedby="confirm-dialog-description">
      <header><div className="confirm-dialog-icon"><Trash size={21} weight="bold" /></div><button type="button" className="confirm-dialog-close" aria-label="Đóng" onClick={onCancel} disabled={busy}><X size={18} /></button></header>
      <h2 id="confirm-dialog-title">{title}</h2><p id="confirm-dialog-description">{description}</p>
      <footer className="confirm-dialog-actions"><button type="button" className="button button-secondary" onClick={onCancel} disabled={busy}>{cancelLabel}</button><button type="button" className="button button-danger" ref={confirmRef} onClick={() => void onConfirm()} disabled={busy}>{busy ? 'Đang xóa…' : confirmLabel}</button></footer>
    </section>
  </div>
}
