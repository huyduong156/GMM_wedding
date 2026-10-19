import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { CaretLeft, CaretRight, Crop, X } from '@phosphor-icons/react'
import type { MediaAsset } from '../../../shared/api/weddings'
import './media-viewer.css'

const MediaEditPanel = lazy(() => import('./MediaEditPanel').then((module) => ({ default: module.MediaEditPanel })))

export function MediaViewerDialog({
  assets,
  initialAssetId,
  onClose,
  onEdit,
}: {
  assets: readonly MediaAsset[]
  initialAssetId: string
  onClose: () => void
  onEdit?: (file: File) => Promise<MediaAsset | null>
}) {
  const [assetId, setAssetId] = useState(initialAssetId)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const dialogRef = useRef<HTMLElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const index = assets.findIndex((asset) => asset.id === assetId)
  const asset = assets[index]

  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus()
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        if (saving) return
        if (editing) setEditing(false)
        else onClose()
      }
      if (!editing && assets.length > 1 && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
        const direction = event.key === 'ArrowRight' ? 1 : -1
        setAssetId(assets[(index + direction + assets.length) % assets.length].id)
      }
      if (event.key === 'Tab' && dialogRef.current) {
        const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled])')]
        if (!focusable.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKeyDown, true)
    return () => window.removeEventListener('keydown', onKeyDown, true)
  }, [assets, editing, index, onClose, saving])

  if (!asset) return null

  const move = (direction: number) => {
    setAssetId(assets[(index + direction + assets.length) % assets.length].id)
    setError('')
  }
  const saveEdit = async (file: File) => {
    if (!onEdit) return
    setSaving(true)
    setError('')
    try {
      const created = await onEdit(file)
      if (!created) throw new Error('Không thể tải ảnh đã cắt lên kho.')
      setAssetId(created.id)
      setEditing(false)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Không thể lưu ảnh đã cắt.')
    } finally {
      setSaving(false)
    }
  }

  return createPortal(
    <div className="media-viewer-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget && !saving) onClose()
    }}>
      <section ref={dialogRef} className="media-viewer-dialog" role="dialog" aria-modal="true" aria-label={`Xem ảnh ${asset.originalName ?? ''}`}>
        <header className="media-viewer-header">
          <div>
            <strong title={asset.originalName ?? undefined}>{asset.originalName ?? 'Ảnh trong kho'}</strong>
            <span>{index + 1} / {assets.length}</span>
          </div>
          <button ref={closeRef} type="button" className="media-viewer-icon-button" onClick={onClose} disabled={saving} aria-label="Đóng ảnh"><X size={20} /></button>
        </header>
        {editing && onEdit ? (
          <Suspense fallback={<p className="media-viewer-loading">Đang mở công cụ chỉnh ảnh…</p>}>
            <MediaEditPanel key={asset.id} asset={asset} saving={saving} onCancel={() => setEditing(false)} onSave={saveEdit} />
          </Suspense>
        ) : (
          <>
            <div className="media-viewer-image-wrap">
              {assets.length > 1 ? <button type="button" className="media-viewer-icon-button media-viewer-prev" onClick={() => move(-1)} aria-label="Ảnh trước"><CaretLeft size={24} /></button> : null}
              <img src={asset.publicUrl} alt={asset.originalName ?? 'Ảnh trong kho'} />
              {assets.length > 1 ? <button type="button" className="media-viewer-icon-button media-viewer-next" onClick={() => move(1)} aria-label="Ảnh tiếp theo"><CaretRight size={24} /></button> : null}
            </div>
            <footer className="media-viewer-footer">
              {error ? <p role="alert" className="media-viewer-error">{error}</p> : null}
              {onEdit ? <button type="button" className="button button-secondary" onClick={() => setEditing(true)}><Crop size={18} /> Chỉnh ảnh</button> : null}
            </footer>
          </>
        )}
        {editing && error ? <p role="alert" className="media-viewer-error">{error}</p> : null}
      </section>
    </div>,
    document.body,
  )
}
