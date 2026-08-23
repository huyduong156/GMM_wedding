import { ZodError } from 'zod'
import { authErrorResponse, withAuthHeaders } from '@/modules/identity/interface/auth-http'
import { apiError } from '@/shared/http/api-response'
import { MusicError } from '../application/music-service'

export function musicErrorResponse(error: unknown, requestId: string) {
  if (error instanceof ZodError) return withAuthHeaders(apiError(requestId, 'VALIDATION_ERROR', 'Request validation failed', 400, error.flatten().fieldErrors as Record<string, string[]>), requestId)
  if (error instanceof MusicError) return withAuthHeaders(apiError(requestId, error.code, error.message, error.status), requestId)
  return withAuthHeaders(authErrorResponse(error, requestId), requestId)
}