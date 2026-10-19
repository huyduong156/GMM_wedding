import { useCallback, useEffect, useState } from 'react'
import { MediaAsset, weddingApi } from '../../../shared/api/weddings'

const DEFAULT_MAX_BYTES = 10 * 1024 * 1024
const DEFAULT_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']

type UseMediaLibraryOptions = {
  weddingId: string | null
  maxBytes?: number
  acceptedMimeTypes?: string[]
}

type UploadProgressCallback = (completed: number, total: number) => void

export function useMediaLibrary({
  weddingId,
  maxBytes = DEFAULT_MAX_BYTES,
  acceptedMimeTypes = DEFAULT_MIME_TYPES,
}: UseMediaLibraryOptions) {
  const [assets, setAssets] = useState<MediaAsset[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    if (!weddingId) return
    setLoading(true)
    setError('')
    try {
      const result = await weddingApi.media(weddingId)
      setAssets(result.items.filter((asset) => asset.status === 'READY'))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Không thể tải kho media.')
    } finally {
      setLoading(false)
    }
  }, [weddingId])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const upload = useCallback(
    async (files: FileList | readonly File[] | null, onProgress?: UploadProgressCallback) => {
      if (!weddingId || !files?.length) return [] as MediaAsset[]
      const accepted = [...files].filter(
        (file) => acceptedMimeTypes.includes(file.type) && file.size <= maxBytes,
      )
      if (accepted.length !== files.length) {
        setError('Chỉ nhận ảnh JPG, PNG hoặc WebP, tối đa 10MB mỗi ảnh.')
      }
      if (!accepted.length) return [] as MediaAsset[]
      setUploading(true)
      try {
        let completed = 0
        const results = await Promise.allSettled(accepted.map(async (file) => {
          try {
            return await weddingApi.uploadMedia(weddingId, file)
          } finally {
            completed += 1
            onProgress?.(completed, accepted.length)
          }
        }))
        const uploaded = results.flatMap((result) => result.status === 'fulfilled' ? [result.value] : [])
        const failedCount = results.length - uploaded.length
        setAssets((current) => [
          ...uploaded,
          ...current.filter((asset) => !uploaded.some((next) => next.id === asset.id)),
        ])
        setError(failedCount
          ? `Không thể tải lên ${failedCount} ảnh. ${uploaded.length ? `${uploaded.length} ảnh đã tải thành công.` : ''}`.trim()
          : '')
        return uploaded
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : 'Không thể tải ảnh lên kho media.')
        return [] as MediaAsset[]
      } finally {
        setUploading(false)
      }
    },
    [acceptedMimeTypes, maxBytes, weddingId],
  )

  return { assets, loading, uploading, error, setError, refresh, upload }
}
