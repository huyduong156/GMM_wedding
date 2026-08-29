import { ZodError } from 'zod'
import { authErrorResponse, withApiHeaders } from '@/modules/identity/interface/auth-http'
import { apiError } from '@/shared/http/api-response'
import { TemplateAdminError } from '../domain/template-admin-error'

export function templateAdminErrorResponse(error: unknown, requestId: string) {
  if (error instanceof TemplateAdminError) {
    console.error('[template-admin]', requestId, error.code, error.message)
    return withApiHeaders(apiError(requestId, error.code, error.message, error.status), requestId)
  }
  if (error instanceof ZodError) {
    console.error('[template-admin]', requestId, 'VALIDATION_ERROR', error.flatten())
    return withApiHeaders(apiError(requestId, 'VALIDATION_ERROR', 'Request validation failed', 400, error.flatten().fieldErrors as Record<string, string[]>), requestId)
  }
  console.error('[template-admin]', requestId, error)
  return withApiHeaders(authErrorResponse(error, requestId), requestId)
}