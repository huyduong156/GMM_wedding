import { ZodError } from 'zod'
import { authErrorResponse, withAuthHeaders } from '@/modules/identity/interface/auth-http'
import { apiError } from '@/shared/http/api-response'
import { GuestError } from '../domain/guest-error'
export function guestErrorResponse(error: unknown, requestId: string) {
  if (error instanceof GuestError) return withAuthHeaders(apiError(requestId, error.code, error.message, error.status), requestId)
  if (error instanceof ZodError) return withAuthHeaders(apiError(requestId, 'VALIDATION_ERROR', 'Request validation failed', 400, error.flatten().fieldErrors as Record<string, string[]>), requestId)
  return withAuthHeaders(authErrorResponse(error, requestId), requestId)
}
