import { ZodError } from 'zod'
import { authErrorResponse, withApiHeaders } from './auth-http'
import { apiError } from '@/shared/http/api-response'
import { AdminUserError } from '../domain/admin-user-error'
export function userSecurityErrorResponse(error: unknown, requestId: string) {
  if (error instanceof AdminUserError) return withApiHeaders(apiError(requestId, error.code, error.message, error.status), requestId)
  if (error instanceof ZodError) return withApiHeaders(apiError(requestId, 'VALIDATION_ERROR', 'Request validation failed', 400, error.flatten().fieldErrors as Record<string, string[]>), requestId)
  return withApiHeaders(authErrorResponse(error, requestId), requestId)
}
