import { useState } from 'react'
import FilerobotImageEditor, { TABS, TOOLS } from 'react-filerobot-image-editor'
import type { MediaAsset } from '../../../shared/api/weddings'
import { mediaEditorTranslations } from './media-editor-translations'

function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Không thể xuất ảnh đã chỉnh.')), mimeType, 0.95)
    } catch {
      reject(new Error('Nguồn ảnh không cho phép chỉnh trên trình duyệt này.'))
    }
  })
}

async function editedImageFile(source: HTMLCanvasElement | undefined, asset: MediaAsset): Promise<File> {
  if (!source) throw new Error('Công cụ chỉnh ảnh không trả về ảnh đã xử lý.')
  // JPEG has no alpha channel; preserve transparency from PNG and WebP sources by exporting PNG.
  const mimeType = asset.mimeType === 'image/jpeg' ? 'image/jpeg' : 'image/png'
  const blob = await canvasToBlob(source, mimeType)
  const baseName = (asset.originalName ?? 'anh').replace(/\.[^.]+$/, '')
  const extension = mimeType === 'image/jpeg' ? 'jpg' : 'png'
  return new File([blob], `${baseName}-chinh-sua.${extension}`, { type: mimeType })
}

export function MediaEditPanel({
  asset,
  saving,
  onCancel,
  onSave,
}: {
  asset: MediaAsset
  saving: boolean
  onCancel: () => void
  onSave: (file: File) => Promise<void>
}) {
  const [error, setError] = useState('')
  return (
    <div className="media-viewer-edit-panel" aria-busy={saving}>
      <FilerobotImageEditor
        source={asset.publicUrl}
        tabsIds={[TABS.ADJUST]}
        defaultTabId={TABS.ADJUST}
        defaultToolId={TOOLS.CROP}
        Crop={{ ratio: 'custom' }}
        defaultSavedImageName={(asset.originalName ?? 'anh').replace(/\.[^.]+$/, '') + '-chinh-sua'}
        defaultSavedImageType={asset.mimeType === 'image/jpeg' ? 'jpeg' : 'png'}
        translations={mediaEditorTranslations}
        previewPixelRatio={1}
        savingPixelRatio={1}
        onBeforeSave={() => false}
        onSave={async (imageData) => {
          setError('')
          try {
            await onSave(await editedImageFile(imageData.imageCanvas, asset))
          } catch (cause) {
            setError(cause instanceof Error ? cause.message : 'Không thể xuất ảnh đã chỉnh.')
          }
        }}
        onClose={() => { if (!saving) onCancel() }}
        avoidChangesNotSavedAlertOnLeave
      />
      {error ? <p className="media-viewer-edit-error" role="alert">{error}</p> : null}
    </div>
  )
}
