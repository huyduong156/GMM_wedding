import type { NextRequest } from 'next/server'
import { assertSafeMutation, optionsResponse, parseJson, withApiHeaders } from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { getTaskService } from '@/modules/tasks'
import { taskErrorResponse } from '@/modules/tasks/interface/task-http'
import { taskIdSchema, updateTaskSchema } from '@/modules/tasks/interface/task-schemas'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'
import { weddingIdSchema } from '@/modules/weddings/interface/wedding-schemas'
export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse
type Context = { params: Promise<{ weddingId: string; taskId: string }> }
async function ids(context: Context) { const params = await context.params; return { weddingId: weddingIdSchema.parse(params.weddingId), taskId: taskIdSchema.parse(params.taskId) } }
export async function GET(request: NextRequest, context: Context) { const requestId = getRequestId(request); try { const { actor } = await requireAuthenticatedUser(request); const params = await ids(context); return withApiHeaders(jsonResponse({ task: await getTaskService().find(actor, params.weddingId, params.taskId) }), requestId) } catch (error) { return taskErrorResponse(error, requestId) } }
export async function PATCH(request: NextRequest, context: Context) { const requestId = getRequestId(request); try { assertSafeMutation(request); const { actor } = await requireAuthenticatedUser(request); const params = await ids(context); return withApiHeaders(jsonResponse({ task: await getTaskService().update(actor, params.weddingId, params.taskId, await parseJson(request, updateTaskSchema)) }), requestId) } catch (error) { return taskErrorResponse(error, requestId) } }
export async function DELETE(request: NextRequest, context: Context) { const requestId = getRequestId(request); try { assertSafeMutation(request); const { actor } = await requireAuthenticatedUser(request); const params = await ids(context); await getTaskService().remove(actor, params.weddingId, params.taskId); return withApiHeaders(new Response(null, { status: 204 }), requestId) } catch (error) { return taskErrorResponse(error, requestId) } }
