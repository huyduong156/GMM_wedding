import { ZodError } from 'zod'
import { apiError } from '@/shared/http/api-response'
import { RecapError } from '../application/recap-service'

export function recapErrorResponse(error: unknown, requestId: string) {
  if (error instanceof ZodError) return apiError(requestId, 'VALIDATION_ERROR', 'Request validation failed', 400, error.flatten().fieldErrors as Record<string, string[]>)
  if (error instanceof RecapError) return apiError(requestId, error.code, error.message, error.status)
  return apiError(requestId, 'INTERNAL_ERROR', 'Internal server error', 500)
}