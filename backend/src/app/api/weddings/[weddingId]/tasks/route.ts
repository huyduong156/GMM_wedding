import type { NextRequest } from 'next/server'
import {
  assertSafeMutation,
  optionsResponse,
  parseJson,
  withApiHeaders,
} from '@/modules/identity/interface/auth-http'
import { requireAuthenticatedUser } from '@/modules/identity/interface/request-authenticator'
import { getTaskService } from '@/modules/tasks'
import { taskErrorResponse } from '@/modules/tasks/interface/task-http'
import { createTaskSchema, taskQuerySchema } from '@/modules/tasks/interface/task-schemas'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'
import { weddingIdSchema } from '@/modules/weddings/interface/wedding-schemas'
export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse
type Context = { params: Promise<{ weddingId: string }> }
async function id(context: Context) {
  return weddingIdSchema.parse((await context.params).weddingId)
}
export async function GET(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    const { actor } = await requireAuthenticatedUser(request)
    const query = taskQuerySchema.parse(Object.fromEntries(request.nextUrl.searchParams))
    return withApiHeaders(
      jsonResponse(
        await getTaskService().list(actor, await id(context), {
          limit: query.limit,
          ...(query.q !== undefined ? { query: query.q } : {}),
          ...(query.status !== undefined ? { status: query.status } : {}),
          ...(query.priority !== undefined ? { priority: query.priority } : {}),
          ...(query.eventId !== undefined ? { eventId: query.eventId } : {}),
          ...(query.withoutEvent !== undefined ? { withoutEvent: query.withoutEvent } : {}),
          ...(query.parentTaskId !== undefined ? { parentTaskId: query.parentTaskId } : {}),
          ...(query.withoutParent !== undefined ? { withoutParent: query.withoutParent } : {}),
          ...(query.from !== undefined ? { from: query.from } : {}),
          ...(query.to !== undefined ? { to: query.to } : {}),
          ...(query.cursor !== undefined ? { cursor: query.cursor } : {}),
        }),
      ),
      requestId,
    )
  } catch (error) {
    return taskErrorResponse(error, requestId)
  }
}
export async function POST(request: NextRequest, context: Context) {
  const requestId = getRequestId(request)
  try {
    assertSafeMutation(request)
    const { actor } = await requireAuthenticatedUser(request)
    return withApiHeaders(
      jsonResponse(
        {
          task: await getTaskService().create(
            actor,
            await id(context),
            await parseJson(request, createTaskSchema),
          ),
        },
        { status: 201 },
      ),
      requestId,
    )
  } catch (error) {
    return taskErrorResponse(error, requestId)
  }
}
