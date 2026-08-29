import { ZodError } from 'zod'
import { apiError } from '@/shared/http/api-response'
import { AuthError } from '@/modules/identity/domain/auth-error'
import { RecapError } from '../application/recap-service'

export function recapErrorResponse(error: unknown, requestId: string) {
  if (error instanceof AuthError) return apiError(requestId, error.code, error.message, error.status, error.retryAfter ? { retryAfter: [String(error.retryAfter)] } : undefined)
  if (error instanceof ZodError) return apiError(requestId, 'VALIDATION_ERROR', 'Request validation failed', 400, error.flatten().fieldErrors as Record<string, string[]>)
  if (error instanceof RecapError) return apiError(requestId, error.code, error.message, error.status, error.fieldErrors)
  return apiError(requestId, 'INTERNAL_ERROR', 'Internal server error', 500, undefined, error)
}
