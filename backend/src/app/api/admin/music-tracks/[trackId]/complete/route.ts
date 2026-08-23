import type { NextRequest } from 'next/server'
import { assertSafeMutation, optionsResponse, withAuthHeaders } from '@/modules/identity/interface/auth-http'
import { requirePlatformAdmin } from '@/modules/identity/interface/request-authenticator'
import { getMusicService } from '@/modules/music'
import { musicErrorResponse, musicIdSchema } from '@/modules/music/interface'
import { getRequestId, jsonResponse } from '@/shared/http/api-response'
type Context = { params: Promise<{ trackId: string }> }
export const dynamic = 'force-dynamic'
export const OPTIONS = optionsResponse
export async function POST(request: NextRequest, context: Context) { const requestId = getRequestId(request); try { assertSafeMutation(request); const { actor } = await requirePlatformAdmin(request); return withAuthHeaders(jsonResponse(await getMusicService().complete(actor.userId, musicIdSchema.parse((await context.params).trackId), 'SYSTEM')), requestId) } catch (error) { return musicErrorResponse(error, requestId) } }