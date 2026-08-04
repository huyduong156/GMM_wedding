export const SESSION_TOKEN_BYTES = 32
export const SESSION_IDLE_TTL_SECONDS = 24 * 60 * 60
export const SESSION_ABSOLUTE_TTL_SECONDS = 30 * 24 * 60 * 60

export const LOCAL_SESSION_COOKIE_NAME = 'gmm_session'
export const SECURE_SESSION_COOKIE_NAME = '__Host-gmm_session'

export type SessionCookiePolicy = {
  name: string
  options: {
    httpOnly: true
    secure: boolean
    sameSite: 'lax'
    path: '/'
    maxAge: number
  }
}

export function getSessionCookiePolicy(
  nodeEnv: 'development' | 'test' | 'production',
): SessionCookiePolicy {
  const secure = nodeEnv === 'production'

  return {
    name: secure ? SECURE_SESSION_COOKIE_NAME : LOCAL_SESSION_COOKIE_NAME,
    options: {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_ABSOLUTE_TTL_SECONDS,
    },
  }
}
