import { ZodError } from 'zod'
import { apiError, getRequestId, type ApiErrorBody } from '@/shared/http/api-response'
import { MediaError } from '../application/media-manager'
export function mediaErrorResponse(error: unknown, requestId: string) {
  if (error instanceof MediaError) return apiError(requestId, error.code, error.message, error.status)
  if (error instanceof ZodError) return apiError(requestId, 'VALIDATION_ERROR', 'Request validation failed', 400, error.flatten().fieldErrors as Record<string, string[]>)
  return apiError(requestId, 'INTERNAL_ERROR', 'Internal server error', 500)
}
