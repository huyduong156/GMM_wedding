import { ZodError } from 'zod'

import { authErrorResponse, withAuthHeaders } from '@/modules/identity/interface/auth-http'
import { WeddingError } from '../domain/wedding-error'
import { apiError } from '@/shared/http/api-response'

export function weddingErrorResponse(error: unknown, requestId: string) {
  if (error instanceof WeddingError) return withAuthHeaders(apiError(requestId, error.code, error.message, error.status), requestId)
  if (error instanceof ZodError) {
    const fieldErrors = error.flatten().fieldErrors as Record<string, string[]>
    return withAuthHeaders(apiError(requestId, 'VALIDATION_ERROR', 'Request validation failed', 400, fieldErrors), requestId)
  }
  return withAuthHeaders(authErrorResponse(error, requestId), requestId)
}
