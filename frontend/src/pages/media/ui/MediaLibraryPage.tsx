import { memo, useCallback, useEffect, useState } from 'react'
import { ArrowsOut, Check, ImageSquare, Trash } from '@phosphor-icons/react'
import { useOptionalAuth } from '../../../features/auth/model/auth-context'
import { useOptionalWeddingWorkspace } from '../../../entities/wedding/model/wedding-context'
import { useMediaLibrary } from '../../../features/media/model/useMediaLibrary'
import type { MediaAsset } from '../../../shared/api/weddings'
import { MediaViewerDialog } from '../../../features/media/ui/MediaViewerDialog'
import { weddingApi } from '../../../shared/api/weddings'
import { ConfirmDialog } from '../../../shared/ui/confirm-dialog/ConfirmDialog'

const MediaLibraryUploadControl = memo(function MediaLibraryUploadControl({
  uploading,
  onUpload,
}: {
  uploading: boolean
  onUpload: (files: FileList | readonly File[] | null, onProgress?: (completed: number, total: number) => void) => Promise<MediaAsset[]>
}) {
  const [progress, setProgress] = useState<{ completed: number; total: number } | null>(null)

  return (
    <div className="media-library-upload-control">
      <label className="button button-primary media-library-upload">
        <ImageSquare size={17} /> {uploading ? 'Đang tải ảnh…' : 'Tải ảnh lên'}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          disabled={uploading}
          onChange={async (event) => {
            const input = event.currentTarget
            const files = input.files
            if (!files?.length) return
            setProgress({ completed: 0, total: files.length })
            try {
              await onUpload(files, (completed, total) => setProgress({ completed, total }))
            } finally {
              setProgress(null)
              input.value = ''
            }
          }}
        />
      </label>
      {uploading ? (
        <span className="media-library-upload-status" role="status" aria-live="polite">
          <span className="media-library-upload-spinner" aria-hidden="true" />
          {progress ? `Đang tải ảnh ${progress.completed}/${progress.total}…` : 'Đang tải ảnh lên…'}
        </span>
      ) : null}
    </div>
  )
})

const MediaLibraryCard = memo(function MediaLibraryCard({
  asset,
  selected,
  canManage,
  onToggle,
  onView,
  onDelete,
}: {
  asset: MediaAsset
  selected: boolean
  canManage: boolean
  onToggle: (mediaId: string) => void
  onView: (mediaId: string) => void
  onDelete: (mediaIds: string[]) => void
}) {
  return (
    <article className={`media-library-card${selected ? ' is-selected' : ''}`}>
      <img src={asset.publicUrl} alt={asset.originalName ?? 'Ảnh trong kho'} loading="lazy" />
      <button type="button" className="media-library-view" onClick={() => onView(asset.id)} aria-label={`Xem lớn ${asset.originalName ?? 'ảnh'}`} title="Xem ảnh lớn">
        <ArrowsOut size={14} />
      </button>
      <div className="media-library-card-footer">
        {canManage ? (
          <label className="media-library-select">
            <input
              type="checkbox"
              checked={selected}
              onChange={() => onToggle(asset.id)}
              aria-label={`Chọn ${asset.originalName ?? 'ảnh'}`}
            />
            <span>{selected ? <Check size={13} /> : null}</span>
          </label>
        ) : null}
        <span title={asset.originalName ?? undefined}>{asset.originalName ?? 'Ảnh không tên'}</span>
        {canManage ? (
          <button type="button" className="media-library-delete" onClick={() => onDelete([asset.id])} aria-label={`Xóa ${asset.originalName ?? 'ảnh'}`}>
            <Trash size={16} />
          </button>
        ) : null}
      </div>
    </article>
  )
})

export function MediaLibraryPage() {
  const workspace = useOptionalWeddingWorkspace()
  const auth = useOptionalAuth()
  const weddingId = workspace?.activeWedding?.id ?? null
  const canManage = workspace?.activeRole !== 'VIEWER'
  const media = useMediaLibrary({ weddingId })
  const setMediaError = media.setError
  const mediaAssets = media.assets
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [pendingDeleteIds, setPendingDeleteIds] = useState<Set<string>>(new Set())
  const [deleting, setDeleting] = useState(false)
  const [viewerAssetId, setViewerAssetId] = useState<string | null>(null)

  useEffect(() => {
    setSelectedIds(new Set())
    setPendingDeleteIds(new Set())
    setViewerAssetId(null)
    setMediaError('')
  }, [setMediaError, weddingId])

  const requestDelete = useCallback((ids: string[]) => {
    const assets = mediaAssets.filter((asset) => ids.includes(asset.id))
    if (assets.some((asset) => asset.publicUrl === auth?.user?.avatarUrl)) {
      setMediaError('Không thể xóa ảnh đang được dùng làm ảnh đại diện.')
      return
    }
    setPendingDeleteIds(new Set(ids))
  }, [auth?.user?.avatarUrl, mediaAssets, setMediaError])

  const confirmDelete = useCallback(async () => {
    if (!weddingId || !pendingDeleteIds.size) return
    setDeleting(true)
    try {
      await Promise.all([...pendingDeleteIds].map((mediaId) => weddingApi.removeMedia(weddingId, mediaId)))
      setPendingDeleteIds(new Set())
      setSelectedIds(new Set())
      await media.refresh()
    } catch (cause) {
      media.setError(cause instanceof Error ? cause.message : 'Không thể xóa ảnh khỏi kho.')
    } finally {
      setDeleting(false)
    }
  }, [media, pendingDeleteIds, weddingId])

  const toggleSelected = useCallback((mediaId: string) => {
    setSelectedIds((current) => {
      const next = new Set(current)
      if (next.has(mediaId)) next.delete(mediaId)
      else next.add(mediaId)
      return next
    })
  }, [])
  const viewAsset = useCallback((mediaId: string) => setViewerAssetId(mediaId), [])

  return (
    <div className="wedding-page media-library-page">
      <header className="workspace-page-heading media-library-heading">
        <div>
          <p className="eyebrow">Tài nguyên wedding</p>
          <h1>Kho ảnh</h1>
          <p>Quản lý ảnh dùng chung cho thiệp, website, recap và ảnh đại diện.</p>
        </div>
        {canManage ? (
          <div className="media-library-actions">
            {selectedIds.size ? (
              <button type="button" className="button button-danger" onClick={() => requestDelete([...selectedIds])}>
                <Trash size={16} /> Xóa {selectedIds.size} ảnh
              </button>
            ) : null}
            <MediaLibraryUploadControl uploading={media.uploading} onUpload={media.upload} />
          </div>
        ) : null}
      </header>
      {media.error ? <p className="media-library-error" role="alert">{media.error}</p> : null}
      {media.loading ? (
        <p className="media-library-state">Đang tải kho ảnh…</p>
      ) : media.assets.length ? (
        <div className="media-library-grid">
          {media.assets.map((asset) => (
            <MediaLibraryCard
              key={asset.id}
              asset={asset}
              selected={selectedIds.has(asset.id)}
              canManage={canManage}
              onToggle={toggleSelected}
              onView={viewAsset}
              onDelete={requestDelete}
            />
          ))}
        </div>
      ) : (
        <div className="media-library-empty">
          <ImageSquare size={28} />
          <strong>Kho ảnh đang trống</strong>
          <span>Tải ảnh lên để dùng trong các trình chỉnh sửa.</span>
        </div>
      )}
      <ConfirmDialog
        open={pendingDeleteIds.size > 0}
        title={pendingDeleteIds.size > 1 ? `Xóa ${pendingDeleteIds.size} ảnh?` : 'Xóa ảnh này?'}
        description="Ảnh sẽ bị gỡ khỏi kho wedding và không thể dùng lại trong các trình chỉnh sửa."
        confirmLabel={pendingDeleteIds.size > 1 ? 'Xóa các ảnh' : 'Xóa ảnh'}
        busy={deleting}
        onCancel={() => {
          if (!deleting) setPendingDeleteIds(new Set())
        }}
        onConfirm={confirmDelete}
      />
      {viewerAssetId ? (
        <MediaViewerDialog
          assets={media.assets}
          initialAssetId={viewerAssetId}
          onClose={() => setViewerAssetId(null)}
          onEdit={canManage ? async (file) => (await media.upload([file]))[0] ?? null : undefined}
        />
      ) : null}
    </div>
  )
}
