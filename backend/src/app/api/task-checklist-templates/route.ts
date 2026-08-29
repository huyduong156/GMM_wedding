import type { NextRequest } from 'next/server'
import { optionsResponse, withApiHeaders } from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { getTaskService } from '@/modules/tasks'
import { taskErrorResponse } from '@/modules/tasks/interface/task-http'
import { templateQuerySchema } from '@/modules/tasks/interface/task-schemas'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'
export const dynamic = 'force-dynamic'
export async function OPTIONS(request: NextRequest) { return optionsResponse(request) }
export async function GET(request: NextRequest) { const requestId = getRequestId(request); try { await requireAuthenticatedUser(request); const query = templateQuerySchema.parse(Object.fromEntries(request.nextUrl.searchParams)); return withApiHeaders(jsonResponse({ items: await getTaskService().templates(query.locale) }), requestId) } catch (error) { return taskErrorResponse(error, requestId) } }



