import type { NextRequest } from 'next/server'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { getTaskService } from '@/modules/tasks'
import { taskErrorResponse } from '@/modules/tasks/interface/task-http'
import { templateQuerySchema } from '@/modules/tasks/interface/task-schemas'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'
export const dynamic = 'force-dynamic'
export async function GET(request: NextRequest) { const requestId = getRequestId(request); try { await requireAuthenticatedUser(request); const query = templateQuerySchema.parse(Object.fromEntries(request.nextUrl.searchParams)); return jsonResponse({ items: await getTaskService().templates(query.locale) }) } catch (error) { return taskErrorResponse(error, requestId) } }
