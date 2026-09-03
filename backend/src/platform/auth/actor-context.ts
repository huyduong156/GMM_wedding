export type AuthenticatedUserActor = {
  kind: 'user'
  userId: string
  sessionId: string
}

export type PlatformAdminActor = {
  kind: 'platformAdmin'
  userId: string
  sessionId: string
  assurance: 'base' | 'stepUp'
}

export type AnonymousActor = {
  kind: 'anonymous'
  fingerprint?: string
}

export type ActorContext =
  AuthenticatedUserActor | PlatformAdminActor | AnonymousActor

export function isAuthenticatedActor(
  actor: ActorContext,
): actor is AuthenticatedUserActor | PlatformAdminActor {
  return actor.kind === 'user' || actor.kind === 'platformAdmin'
}
