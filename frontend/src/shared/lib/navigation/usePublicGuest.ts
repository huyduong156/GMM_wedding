import { useEffect, useState } from 'react'
import { WeddingApiError, weddingApi } from '../../api/weddings'

type Props = { weddingSlug: string; guestSlug?: string }

export type PublicGuestController = {
  guestName: string | null
  guestSlug: string | null
  maxPartySize: number | null
  loading: boolean
  notFound: boolean
  error: string
}

export function usePublicGuest({ weddingSlug, guestSlug }: Props): PublicGuestController {
  const [guestName, setGuestName] = useState<string | null>(null)
  const [maxPartySize, setMaxPartySize] = useState<number | null>(null)
  const [loading, setLoading] = useState(Boolean(guestSlug))
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setGuestName(null)
    setMaxPartySize(null)
    setNotFound(false)
    setError('')

    if (!guestSlug) {
      setLoading(false)
      return () => {
        active = false
      }
    }

    setLoading(true)
    void weddingApi
      .publicInvitationGuest(weddingSlug, guestSlug)
      .then((result) => {
        if (!active) return
        setGuestName(result.invitation.guestName)
        setMaxPartySize(result.invitation.maxPartySize)
      })
      .catch((cause) => {
        if (!active) return
        if (cause instanceof WeddingApiError && cause.status === 404) setNotFound(true)
        else setError(cause instanceof Error ? cause.message : 'Không thể tải thông tin khách mời.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [guestSlug, weddingSlug])

  return { guestName, guestSlug: guestSlug ?? null, maxPartySize, loading, notFound, error }
}
