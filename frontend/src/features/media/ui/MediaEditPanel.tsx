import { useState } from 'react'
import FilerobotImageEditor, { TABS, TOOLS } from 'react-filerobot-image-editor'
import type { MediaAsset } from '../../../shared/api/weddings'
import { mediaEditorTranslations } from './media-editor-translations'

const MAX_OUTPUT_SIDE = 1400

function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Không thể xuất ảnh đã chỉnh.')), mimeType, 0.9)
    } catch {
      reject(new Error('Nguồn ảnh không cho phép chỉnh trên trình duyệt này.'))
    }
  })
}

async function editedImageFile(source: HTMLCanvasElement | undefined, asset: MediaAsset): Promise<File> {
  if (!source) throw new Error('Công cụ chỉnh ảnh không trả về ảnh đã xử lý.')
  const scale = Math.min(1, MAX_OUTPUT_SIDE / Math.max(source.width, source.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(source.width * scale))
  canvas.height = Math.max(1, Math.round(source.height * scale))
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Trình duyệt không hỗ trợ xuất ảnh này.')
  context.drawImage(source, 0, 0, canvas.width, canvas.height)
  const mimeType = asset.mimeType === 'image/png' ? 'image/png' : 'image/jpeg'
  const blob = await canvasToBlob(canvas, mimeType)
  const baseName = (asset.originalName ?? 'anh').replace(/\.[^.]+$/, '')
  return new File([blob], `${baseName}-chinh-sua.${mimeType === 'image/png' ? 'png' : 'jpg'}`, { type: mimeType })
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
        defaultSavedImageType={asset.mimeType === 'image/png' ? 'png' : 'jpeg'}
        translations={mediaEditorTranslations}
        previewPixelRatio={1}
        savingPixelRatio={0.5}
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
