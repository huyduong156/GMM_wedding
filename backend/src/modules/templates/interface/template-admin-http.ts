import { ZodError } from 'zod'
import { authErrorResponse, withAuthHeaders } from '@/modules/identity/interface/auth-http'
import { apiError } from '@/shared/http/api-response'
import { TemplateAdminError } from '../domain/template-admin-error'

export function templateAdminErrorResponse(error: unknown, requestId: string) {
  if (error instanceof TemplateAdminError) {
    console.error('[template-admin]', requestId, error.code, error.message)
    return withAuthHeaders(apiError(requestId, error.code, error.message, error.status), requestId)
  }
  if (error instanceof ZodError) {
    console.error('[template-admin]', requestId, 'VALIDATION_ERROR', error.flatten())
    return withAuthHeaders(apiError(requestId, 'VALIDATION_ERROR', 'Request validation failed', 400, error.flatten().fieldErrors as Record<string, string[]>), requestId)
  }
  console.error('[template-admin]', requestId, error)
  return withAuthHeaders(authErrorResponse(error, requestId), requestId)
}