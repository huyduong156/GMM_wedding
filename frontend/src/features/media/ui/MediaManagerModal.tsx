import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { Check, ImageSquare, X } from '@phosphor-icons/react'
import type { MediaAsset } from '../../../shared/api/weddings'
import './media-manager.css'

type MediaManagerModalProps = {
  open: boolean
  assets: MediaAsset[]
  selectedIds: Set<string>
  selectionMode?: 'single' | 'multiple'
  loading: boolean
  uploading: boolean
  error: string
  onClose: () => void
  onUpload: (files: FileList | null) => Promise<MediaAsset[]>
  onConfirm: (assets: MediaAsset[]) => void
}

const MediaAssetCard = memo(function MediaAssetCard({ asset, selected, onToggle }: { asset: MediaAsset; selected: boolean; onToggle: (asset: MediaAsset) => void }) { return <button type="button" className={'media-manager-asset' + (selected ? ' is-selected' : '')} onClick={() => onToggle(asset)} aria-pressed={selected}><img loading="lazy" decoding="async" src={asset.publicUrl} alt={asset.originalName ?? 'Image'} /><span className="media-manager-check">{selected ? <Check size={15} weight="bold" /> : null}</span><small>{asset.originalName ?? 'Image'}</small></button>})

export function MediaManagerModal({ open, assets, selectedIds, selectionMode = 'single', loading, uploading, error, onClose, onUpload, onConfirm }: MediaManagerModalProps) {
  const [draftIds, setDraftIds] = useState<Set<string>>(new Set(selectedIds))
  const closeRef = useRef<HTMLButtonElement>(null)
  const selectedKey = Array.from(selectedIds).sort().join('|')

  useEffect(() => {
    if (open) { setDraftIds(new Set(selectedIds)); closeRef.current?.focus() }
  }, [open, selectedKey])
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  const toggle = useCallback((asset: MediaAsset) => {
    setDraftIds((current) => {
      if (selectionMode === 'single') return new Set([asset.id])
      const next = new Set(current)
      if (next.has(asset.id)) next.delete(asset.id)
      else next.add(asset.id)
      return next
    })
  }, [selectionMode])

  if (!open) return null

  const confirm = () => onConfirm(assets.filter((asset) => draftIds.has(asset.id)))

  return <div className="media-manager-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <section className="media-manager-modal" role="dialog" aria-modal="true" aria-labelledby="media-manager-title">
      <header className="media-manager-header">
        <div><span className="media-manager-eyebrow">Kho ảnh của bạn</span><h3 id="media-manager-title">Chọn ảnh</h3><p>{selectionMode === 'multiple' ? 'Chọn một hoặc nhiều ảnh cho album.' : 'Chọn một ảnh để thay thế vị trí hiện tại.'}</p></div>
        <button type="button" ref={closeRef} className="media-manager-close" onClick={onClose} aria-label="Đóng"><X size={18} /></button>
      </header>
      <label className="media-manager-upload">
        <input type="file" accept="image/jpeg,image/png,image/webp" multiple={selectionMode === 'multiple'} disabled={uploading} onChange={async (event) => { const uploaded = await onUpload(event.target.files); if (uploaded.length) setDraftIds((current) => { const next = new Set(selectionMode === 'single' ? [] : current); uploaded.forEach((asset) => next.add(asset.id)); return next }); event.target.value = '' }} />
        <ImageSquare size={22} /><strong>{uploading ? 'Đang tải ảnh lên…' : 'Tải ảnh mới lên'}</strong><span>JPG, PNG hoặc WebP · tối đa 10MB mỗi ảnh</span>
      </label>
      {error ? <p className="media-manager-error" role="alert">{error}</p> : null}
      {loading ? <p className="media-manager-empty">Đang tải kho ảnh…</p> : assets.length ? <div className="media-manager-grid-scroll"><div className="media-manager-grid">{assets.map((asset) => <MediaAssetCard key={asset.id} asset={asset} selected={draftIds.has(asset.id)} onToggle={toggle} />)}</div></div> : <p className="media-manager-empty">Chưa có ảnh trong kho.</p>}
      <footer className="media-manager-footer"><button type="button" className="button button-secondary" onClick={onClose}>Hủy</button><button type="button" className="button button-primary" disabled={loading || uploading} onClick={confirm}>{draftIds.size ? (selectionMode === 'multiple' ? 'Chọn ảnh' : 'Dùng ảnh này') : 'Bỏ ảnh'}</button></footer>
    </section>
  </div>
}
