import { ZodError } from 'zod'
import { authErrorResponse, withAuthHeaders } from './auth-http'
import { apiError } from '@/shared/http/api-response'
import { AdminUserError } from '../domain/admin-user-error'

export function adminUserErrorResponse(error: unknown, requestId: string) {
  if (error instanceof AdminUserError) return withAuthHeaders(apiError(requestId, error.code, error.message, error.status), requestId)
  if (error instanceof ZodError) return withAuthHeaders(apiError(requestId, 'VALIDATION_ERROR', 'Request validation failed', 400, error.flatten().fieldErrors as Record<string, string[]>), requestId)
  console.error('[admin-users]', requestId, error)
  return withAuthHeaders(authErrorResponse(error, requestId), requestId)
}
