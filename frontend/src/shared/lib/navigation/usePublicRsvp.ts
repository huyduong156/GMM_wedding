import { useCallback, useEffect, useRef, useState } from 'react'
import { WeddingApiError, weddingApi } from '../../api/weddings'
import type { PublicRsvpController, PublicRsvpInput } from './public-interaction-types'

type Props = { weddingSlug: string; guestSlug?: string }
const messageFor = (error: unknown) =>
  error instanceof WeddingApiError
    ? error.message
    : 'Không thể gửi thông tin lúc này. Vui lòng thử lại.'

export function usePublicRsvp({ weddingSlug, guestSlug }: Props): PublicRsvpController {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const submissionLocked = useRef(false)
  useEffect(() => {
    submissionLocked.current = false
    setSubmitting(false)
    setSubmitted(false)
    setError('')
  }, [guestSlug, weddingSlug])
  const submit = useCallback(
    async (input: PublicRsvpInput) => {
      if (submissionLocked.current) return false
      submissionLocked.current = true
      setSubmitting(true)
      setError('')
      try {
        if (guestSlug) await weddingApi.publicPersonalRsvp(weddingSlug, guestSlug, input)
        else await weddingApi.publicRsvp(weddingSlug, input)
        setSubmitted(true)
        return true
      } catch (cause) {
        submissionLocked.current = false
        setError(messageFor(cause))
        return false
      } finally {
        setSubmitting(false)
      }
    },
    [guestSlug, weddingSlug],
  )
  return { isPersonalized: Boolean(guestSlug), submit, submitting, submitted, error }
}
