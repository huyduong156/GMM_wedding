import type { NextRequest } from 'next/server'

import { getAuthService } from '../composition'
import { AuthError } from '../domain/auth-error'
import type { AuthenticatedUserActor, PlatformAdminActor } from '@/platform/auth/actor-context'
import { getSessionCookiePolicy } from '@/platform/auth/session-policy'
import { getServerEnv } from '@/platform/config/env'

function sessionToken(request: NextRequest) {
  const env = getServerEnv()
  const cookie = getSessionCookiePolicy(env.NODE_ENV, new URL(env.APP_ORIGIN).protocol === 'https:')
  return request.cookies.get(cookie.name)?.value
}

export async function requireAuthenticatedUser(request: NextRequest) {
  const identity = await getAuthService().authenticate(sessionToken(request))
  const actor: AuthenticatedUserActor = {
    kind: 'user',
    userId: identity.user.id,
    sessionId: identity.sessionId,
  }
  return { actor, user: identity.user }
}

export async function requirePlatformAdmin(request: NextRequest) {
  const identity = await getAuthService().authenticate(sessionToken(request))
  if (!identity.user.roles.includes('ADMIN')) {
    throw new AuthError('ADMIN_ACCESS_REQUIRED', 403, 'Platform administrator access is required')
  }
  const actor: PlatformAdminActor = {
    kind: 'platformAdmin',
    userId: identity.user.id,
    sessionId: identity.sessionId,
    assurance: 'base',
  }
  return { actor, user: identity.user }
}
