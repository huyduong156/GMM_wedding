import { createHash, createHmac, randomBytes } from 'node:crypto'

import { prisma } from '@/platform/database/prisma'
import { createOpaqueToken, hashOpaqueToken } from './opaque-token'
import { getSessionCookiePolicy, SESSION_ABSOLUTE_TTL_SECONDS } from './session-policy'
import { getServerEnv } from '@/platform/config/env'
import { AuthError } from '@/modules/identity/domain/auth-error'

const STATE_COOKIE = 'gmm_google_state'
const VERIFIER_COOKIE = 'gmm_google_verifier'
const COOKIE_TTL = 10 * 60
const PROVIDER = 'google'

function secureCookies() {
  return new URL(getServerEnv().APP_ORIGIN).protocol === 'https:'
}

function getCookie(request: Request, name: string) {
  return request.headers.get('cookie')?.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`))?.[1]
}

function redirectTarget() {
  const env = getServerEnv()
  return env.GOOGLE_SUCCESS_REDIRECT ?? env.APP_ORIGIN
}

function providerConfig() {
  const env = getServerEnv()
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
    throw new AuthError('GOOGLE_LOGIN_UNAVAILABLE', 404, 'Google login is not configured')
  }
  const redirectUri = env.GOOGLE_REDIRECT_URI ?? new URL('/api/auth/google/callback', env.APP_ORIGIN).toString()
  return { clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET, redirectUri }
}

function base64Url(value: Buffer) {
  return value.toString('base64url')
}

function pkceChallenge(verifier: string) {
  return createHash('sha256').update(verifier).digest('base64url')
}

export function googleStart() {
  const config = providerConfig()
  const state = base64Url(randomBytes(32))
  const verifier = base64Url(randomBytes(32))
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  url.searchParams.set('client_id', config.clientId)
  url.searchParams.set('redirect_uri', config.redirectUri)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('scope', 'openid email profile')
  url.searchParams.set('state', state)
  url.searchParams.set('code_challenge', pkceChallenge(verifier))
  url.searchParams.set('code_challenge_method', 'S256')
  url.searchParams.set('access_type', 'online')

  const response = Response.redirect(url)
  const secure = secureCookies() ? '; Secure' : ''
  response.headers.append('set-cookie', `${STATE_COOKIE}=${state}; Max-Age=${COOKIE_TTL}; Path=/; HttpOnly; SameSite=Lax${secure}`)
  response.headers.append('set-cookie', `${VERIFIER_COOKIE}=${verifier}; Max-Age=${COOKIE_TTL}; Path=/; HttpOnly; SameSite=Lax${secure}`)
  return response
}

function clearCookie(name: string) {
  const secure = secureCookies() ? '; Secure' : ''
  return `${name}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax${secure}`
}

async function exchangeCode(code: string, verifier: string, config: ReturnType<typeof providerConfig>) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: config.redirectUri,
      grant_type: 'authorization_code',
      code_verifier: verifier,
    }),
  })
  if (!response.ok) throw new AuthError('GOOGLE_AUTH_FAILED', 401, 'Google authentication failed')
  const token = (await response.json()) as { access_token?: string }
  if (!token.access_token) throw new AuthError('GOOGLE_AUTH_FAILED', 401, 'Google authentication failed')
  return token.access_token
}

async function getGoogleProfile(accessToken: string) {
  const response = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: { authorization: `Bearer ${accessToken}` },
  })
  if (!response.ok) throw new AuthError('GOOGLE_AUTH_FAILED', 401, 'Google authentication failed')
  const profile = (await response.json()) as {
    sub?: string
    email?: string
    email_verified?: boolean
    name?: string
    picture?: string
  }
  if (!profile.sub || !profile.email || profile.email_verified !== true) {
    throw new AuthError('GOOGLE_EMAIL_UNVERIFIED', 403, 'Google email verification is required')
  }
  return {
    providerAccountId: profile.sub,
    email: profile.email.trim().toLowerCase(),
    displayName: profile.name?.trim() || null,
    avatarUrl: profile.picture || null,
  }
}

export async function googleCallback(request: Request) {
  const config = providerConfig()
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const savedState = getCookie(request, STATE_COOKIE)
  const verifier = getCookie(request, VERIFIER_COOKIE)
  if (!code || !state || !savedState || state !== savedState || !verifier) {
    throw new AuthError('GOOGLE_AUTH_FAILED', 401, 'Google authentication failed')
  }

  const profile = await getGoogleProfile(await exchangeCode(code, verifier, config))
  const user = await prisma.$transaction(async (tx) => {
    const linked = await tx.account.findUnique({
      where: { provider_providerAccountId: { provider: PROVIDER, providerAccountId: profile.providerAccountId } },
      select: { user: true },
    })
    if (linked?.user) return linked.user

    const existing = await tx.user.findUnique({ where: { email: profile.email } })
    if (existing?.deletedAt) throw new AuthError('ACCOUNT_SUSPENDED', 403, 'Account is not active')
    if (existing && existing.status !== 'ACTIVE' && existing.status !== 'PENDING_VERIFICATION') {
      throw new AuthError('ACCOUNT_SUSPENDED', 403, 'Account is not active')
    }
    const target = existing ?? (await tx.user.create({
      data: {
        email: profile.email,
        displayName: profile.displayName,
        avatarUrl: profile.avatarUrl,
        emailVerifiedAt: new Date(),
        status: 'ACTIVE',
      },
    }))
    if (!target.emailVerifiedAt || target.status === 'PENDING_VERIFICATION') {
      await tx.user.update({
        where: { id: target.id },
        data: { emailVerifiedAt: new Date(), status: 'ACTIVE' },
      })
    }
    await tx.account.create({
      data: { userId: target.id, provider: PROVIDER, providerAccountId: profile.providerAccountId, type: 'oauth' },
    })
    return target
  })

  if (user.status !== 'ACTIVE' && user.status !== 'PENDING_VERIFICATION') {
    throw new AuthError('ACCOUNT_SUSPENDED', 403, 'Account is not active')
  }
  const token = createOpaqueToken()
  const env = getServerEnv()
  const ip = request.headers.get('x-real-ip') ?? 'unknown'
  await prisma.$transaction(async (tx) => {
    await tx.session.create({
      data: {
        userId: user.id,
        sessionHash: hashOpaqueToken(token),
        expiresAt: new Date(Date.now() + SESSION_ABSOLUTE_TTL_SECONDS * 1_000),
        ipHash: createHmac('sha256', env.AUTH_RATE_LIMIT_SECRET).update(ip).digest('hex'),
        ...(request.headers.get('user-agent')
          ? { userAgent: request.headers.get('user-agent')!.slice(0, 512) }
          : {}),
      },
    })
    await tx.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } })
  })
  return { token, redirect: redirectTarget() }
}

export function applyGoogleCookies(response: Response, token: string) {
  const env = getServerEnv()
  const session = getSessionCookiePolicy(env.NODE_ENV, secureCookies())
  const secure = session.options.secure ? '; Secure' : ''
  response.headers.append('set-cookie', `${session.name}=${token}; Max-Age=${session.options.maxAge}; Path=/; HttpOnly; SameSite=Lax${secure}`)
  response.headers.append('set-cookie', clearCookie(STATE_COOKIE))
  response.headers.append('set-cookie', clearCookie(VERIFIER_COOKIE))
  return response
}

export function googleErrorRedirect() {
  const target = new URL(redirectTarget())
  target.searchParams.set('oauthError', 'google_auth_failed')
  return Response.redirect(target)
}
