import { useCallback, useEffect, useState } from 'react'
import { WeddingApiError, weddingApi } from '../../api/weddings'
import type { PublicWish, PublicWishesController } from './public-interaction-types'

type Props = { weddingSlug: string; guestSlug?: string; enabled?: boolean }
const messageFor = (error: unknown) =>
  error instanceof WeddingApiError
    ? error.message
    : 'Không thể gửi thông tin lúc này. Vui lòng thử lại.'

export function usePublicWishes({
  weddingSlug,
  guestSlug,
  enabled = true,
}: Props): PublicWishesController {
  const [items, setItems] = useState<PublicWish[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    if (!enabled || !weddingSlug) return
    let active = true
    void weddingApi
      .publicWishes(weddingSlug)
      .then((result) => {
        if (active) setItems(result.wishes)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [enabled, weddingSlug])
  const submit = useCallback(
    async (input: { guestName?: string; content: string }) => {
      setSubmitting(true)
      setError('')
      try {
        if (guestSlug) await weddingApi.publicPersonalWish(weddingSlug, guestSlug, input)
        else await weddingApi.publicWish(weddingSlug, input)
        setSubmitted(true)
        return true
      } catch (cause) {
        setError(messageFor(cause))
        return false
      } finally {
        setSubmitting(false)
      }
    },
    [guestSlug, weddingSlug],
  )
  return { items, submit, submitting, submitted, error }
}
