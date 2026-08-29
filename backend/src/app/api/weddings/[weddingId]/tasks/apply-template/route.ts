import type { NextRequest } from 'next/server'
import { assertSafeMutation, optionsResponse, parseJson, withApiHeaders } from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { getTaskService } from '@/modules/tasks'
import { taskErrorResponse } from '@/modules/tasks/interface/task-http'
import { applyTemplateSchema } from '@/modules/tasks/interface/task-schemas'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'
import { weddingIdSchema } from '@/modules/weddings/interface/wedding-schemas'
export const dynamic = 'force-dynamic'; export const OPTIONS = optionsResponse
type Context = { params: Promise<{ weddingId: string }> }
export async function POST(request: NextRequest, context: Context) { const requestId = getRequestId(request); try { assertSafeMutation(request); const { actor } = await requireAuthenticatedUser(request); return withApiHeaders(jsonResponse({ items: await getTaskService().applyTemplate(actor, weddingIdSchema.parse((await context.params).weddingId), await parseJson(request, applyTemplateSchema)) }, { status: 201 }), requestId) } catch (error) { return taskErrorResponse(error, requestId) } }
