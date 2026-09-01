import { ZodError } from 'zod'
import { authErrorResponse, withApiHeaders } from '@/modules/identity/interface/auth-http'
import { apiError } from '@/shared/http/api-response'
import { MusicError } from '../application/music-service'

export function musicErrorResponse(error: unknown, requestId: string) {
  if (error instanceof ZodError)
    return withApiHeaders(
      apiError(
        requestId,
        'VALIDATION_ERROR',
        'Request validation failed',
        400,
        error.flatten().fieldErrors as Record<string, string[]>,
      ),
      requestId,
    )
  if (error instanceof MusicError)
    return withApiHeaders(apiError(requestId, error.code, error.message, error.status), requestId)
  return withApiHeaders(authErrorResponse(error, requestId), requestId)
}
