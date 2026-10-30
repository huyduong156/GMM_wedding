import { useMemo, useState } from 'react'

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

function cropCanvasAtNativeResolution(
  source: HTMLCanvasElement,
  width: number | undefined,
  height: number | undefined,
): HTMLCanvasElement {
  const targetWidth = Math.max(1, Math.round(width ?? source.width))
  const targetHeight = Math.max(1, Math.round(height ?? source.height))
  if (source.width === targetWidth && source.height === targetHeight) return source

  const canvas = document.createElement('canvas')
  canvas.width = targetWidth
  canvas.height = targetHeight
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Không thể chuẩn bị ảnh đã cắt.')
  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'
  context.drawImage(source, 0, 0, source.width, source.height, 0, 0, targetWidth, targetHeight)
  return canvas
}

async function editedImageFile(
  source: HTMLCanvasElement | undefined,
  asset: MediaAsset,
  width: number | undefined,
  height: number | undefined,
): Promise<File> {
  if (!source) throw new Error('Công cụ chỉnh ảnh không trả về ảnh đã xử lý.')
  const mimeType = 'image/webp'
  const blob = await canvasToBlob(cropCanvasAtNativeResolution(source, width, height), mimeType)
  const baseName = (asset.originalName ?? 'anh').replace(/\.[^.]+$/, '')
  return new File([blob], `${baseName}-chinh-sua.webp`, { type: mimeType })
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
  const editorSource = useMemo(() => {
    const url = new URL(asset.publicUrl, window.location.href)
    // Use a separate browser cache key from the regular image viewer URL.
    url.searchParams.set('_editor', '1')
    return url.toString()
  }, [asset.publicUrl])

  return (
    <div className="media-viewer-edit-panel" aria-busy={saving}>
      <FilerobotImageEditor
        source={editorSource}
        tabsIds={[TABS.ADJUST]}
        defaultTabId={TABS.ADJUST}
        defaultToolId={TOOLS.CROP}
        Crop={{ ratio: 'custom' }}
        defaultSavedImageName={(asset.originalName ?? 'anh').replace(/\.[^.]+$/, '') + '-chinh-sua'}
        defaultSavedImageType="webp"
        translations={mediaEditorTranslations}
        useBackendTranslations={false}
        previewPixelRatio={1}
        savingPixelRatio={4}
        onBeforeSave={() => false}
        onSave={async (imageData) => {
          setError('')
          try {
            const file = await editedImageFile(
              imageData.imageCanvas,
              asset,
              imageData.width,
              imageData.height,
            )
            await onSave(file)
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
