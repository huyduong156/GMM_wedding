import { ZodError } from 'zod'
import { authErrorResponse, withApiHeaders } from '@/modules/identity/interface/auth-http'
import { apiError } from '@/shared/http/api-response'
import { TaskError } from '../domain/task-error'
export function taskErrorResponse(error: unknown, requestId: string) {
  if (error instanceof TaskError)
    return withApiHeaders(apiError(requestId, error.code, error.message, error.status), requestId)
  if (error instanceof ZodError)
    return withApiHeaders(
      apiError(
        requestId,
        'VALIDATION_ERROR',
        'Request validation failed',
        400,
        error.flatten().fieldErrors as Record<string, string[]>,
      ),
      requestId,
    )
  return withApiHeaders(authErrorResponse(error, requestId), requestId)
}
