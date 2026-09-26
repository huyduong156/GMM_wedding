import { useCallback, useState } from 'react'
import { Check, ImageSquare, Trash } from '@phosphor-icons/react'
import { useOptionalAuth } from '../../../features/auth/model/auth-context'
import { useOptionalWeddingWorkspace } from '../../../entities/wedding/model/wedding-context'
import { useMediaLibrary } from '../../../features/media/model/useMediaLibrary'
import { weddingApi } from '../../../shared/api/weddings'
import { ConfirmDialog } from '../../../shared/ui/confirm-dialog/ConfirmDialog'

export function MediaLibraryPage() {
  const workspace = useOptionalWeddingWorkspace()
  const auth = useOptionalAuth()
  const weddingId = workspace?.activeWedding?.id ?? null
  const canManage = workspace?.activeRole !== 'VIEWER'
  const media = useMediaLibrary({ weddingId })
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [pendingDeleteIds, setPendingDeleteIds] = useState<Set<string>>(new Set())
  const [deleting, setDeleting] = useState(false)

  const requestDelete = useCallback((ids: string[]) => {
    const assets = media.assets.filter((asset) => ids.includes(asset.id))
    if (assets.some((asset) => asset.publicUrl === auth?.user?.avatarUrl)) {
      media.setError('Không thể xóa ảnh đang được dùng làm ảnh đại diện.')
      return
    }
    setPendingDeleteIds(new Set(ids))
  }, [auth?.user?.avatarUrl, media])

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

  const toggleSelected = (mediaId: string) => {
    setSelectedIds((current) => {
      const next = new Set(current)
      if (next.has(mediaId)) next.delete(mediaId)
      else next.add(mediaId)
      return next
    })
  }

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
            <label className="button button-primary media-library-upload">
              <ImageSquare size={17} /> Tải ảnh lên
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                disabled={media.uploading}
                onChange={async (event) => {
                  await media.upload(event.target.files)
                  event.target.value = ''
                }}
              />
            </label>
          </div>
        ) : null}
      </header>
      {media.error ? <p className="media-library-error" role="alert">{media.error}</p> : null}
      {media.loading || media.uploading ? (
        <p className="media-library-state">{media.uploading ? 'Đang tải ảnh lên…' : 'Đang tải kho ảnh…'}</p>
      ) : media.assets.length ? (
        <div className="media-library-grid">
          {media.assets.map((asset) => (
            <article className={`media-library-card${selectedIds.has(asset.id) ? ' is-selected' : ''}`} key={asset.id}>
              <img src={asset.publicUrl} alt={asset.originalName ?? 'Ảnh trong kho'} loading="lazy" />
              <div className="media-library-card-footer">
                {canManage ? (
                  <label className="media-library-select">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(asset.id)}
                      onChange={() => toggleSelected(asset.id)}
                      aria-label={`Chọn ${asset.originalName ?? 'ảnh'}`}
                    />
                    <span>{selectedIds.has(asset.id) ? <Check size={13} /> : null}</span>
                  </label>
                ) : null}
                <span title={asset.originalName ?? undefined}>{asset.originalName ?? 'Ảnh không tên'}</span>
                {canManage ? (
                  <button type="button" className="media-library-delete" onClick={() => requestDelete([asset.id])} aria-label={`Xóa ${asset.originalName ?? 'ảnh'}`}>
                    <Trash size={16} />
                  </button>
                ) : null}
              </div>
            </article>
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
    </div>
  )
}
