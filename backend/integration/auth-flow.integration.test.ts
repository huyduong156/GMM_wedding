import { describe, expect, it } from 'vitest'
import { PrismaClient } from '@prisma/client'

const apiBase = process.env.AUTH_INTEGRATION_BASE_URL ?? 'http://localhost:3000/api'
const mailpitBase = process.env.MAILPIT_BASE_URL ?? 'http://localhost:8025'
const appOrigin = process.env.AUTH_INTEGRATION_APP_ORIGIN ?? 'http://localhost:8080'
const mutationHeaders = {
  'content-type': 'application/json',
  origin: appOrigin,
  'x-csrf-protection': '1',
}

type MailpitMessage = { ID: string; Subject: string; To: Array<{ Address: string }> }
let firstOwnerWeddingId: string | undefined

async function capturedMessageFor(email: string, subject?: string, excludedToken?: string) {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const response = await fetch(`${mailpitBase}/api/v1/messages`)
    expect(response.ok).toBe(true)
    const inbox = await response.json() as { messages: MailpitMessage[] }
    const summaries = inbox.messages.filter((message) =>
      message.To.some((recipient) => recipient.Address === email) && (!subject || message.Subject === subject),
    )
    for (const summary of summaries) {
      const messageResponse = await fetch(`${mailpitBase}/api/v1/message/${summary.ID}`)
      expect(messageResponse.ok).toBe(true)
      const message = await messageResponse.json() as { Text: string }
      if (!excludedToken || !message.Text.includes(excludedToken)) return message
    }
    await new Promise((resolve) => setTimeout(resolve, 250))
  }
  throw new Error('Verification email was not captured by Mailpit')
}

describe.sequential('authentication journey', () => {
  it('registers, verifies, logs in, authenticates, and logs out', async () => {
    const email = `auth-integration-${Date.now()}@example.test`
    const password = 'Correct-Horse-Battery-42'
    const credentials = JSON.stringify({ email, password })

    const rejected = await fetch(`${apiBase}/auth/register`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: 'https://attacker.example' },
      body: credentials,
    })
    expect(rejected.status).toBe(403)

    const register = await fetch(`${apiBase}/auth/register`, {
      method: 'POST',
      headers: mutationHeaders,
      body: JSON.stringify({ email, password, displayName: 'Auth Integration' }),
    })
    expect(register.status).toBe(202)

    const duplicate = await fetch(`${apiBase}/auth/register`, {
      method: 'POST',
      headers: mutationHeaders,
      body: credentials,
    })
    expect(duplicate.status).toBe(202)

    const beforeVerification = await fetch(`${apiBase}/auth/login`, {
      method: 'POST',
      headers: mutationHeaders,
      body: credentials,
    })
    expect(beforeVerification.status).toBe(403)

    const message = await capturedMessageFor(email)
    const token = /token=([A-Za-z0-9_-]+)/.exec(message.Text)?.[1]
    expect(token).toBeTruthy()

    const resend = await fetch(`${apiBase}/auth/resend-verification`, {
      method: 'POST', headers: mutationHeaders, body: JSON.stringify({ email }),
    })
    expect(resend.status).toBe(202)
    const resentMessage = await capturedMessageFor(email, 'Xác minh email GMM Wedding', token)
    const resentToken = /token=([A-Za-z0-9_-]+)/.exec(resentMessage.Text)?.[1]
    expect(resentToken).toBeTruthy()

    const superseded = await fetch(`${apiBase}/auth/verify-email`, {
      method: 'POST',
      headers: mutationHeaders,
      body: JSON.stringify({ token }),
    })
    expect(superseded.status).toBe(400)

    const verify = await fetch(`${apiBase}/auth/verify-email`, {
      method: 'POST', headers: mutationHeaders, body: JSON.stringify({ token: resentToken }),
    })
    expect(verify.status).toBe(204)

    const replay = await fetch(`${apiBase}/auth/verify-email`, {
      method: 'POST',
      headers: mutationHeaders,
      body: JSON.stringify({ token: resentToken }),
    })
    expect(replay.status).toBe(400)

    expect((await fetch(`${apiBase}/auth/resend-verification`, {
      method: 'POST', headers: mutationHeaders, body: JSON.stringify({ email: `missing-${email}` }),
    })).status).toBe(202)

    const login = await fetch(`${apiBase}/auth/login`, {
      method: 'POST',
      headers: mutationHeaders,
      body: credentials,
    })
    expect(login.status).toBe(200)
    const setCookie = login.headers.get('set-cookie')
    expect(setCookie).toContain('HttpOnly')
    expect(setCookie).toContain('SameSite=lax')
    const cookie = setCookie?.split(';', 1)[0]
    expect(cookie).toBeTruthy()

    const me = await fetch(`${apiBase}/me`, { headers: { cookie: cookie as string } })
    expect(me.status).toBe(200)
    const meBody = await me.json() as { user: Record<string, unknown> }
    expect(meBody.user.email).toBe(email)
    expect(meBody.user.passwordHash).toBeUndefined()

    const createWedding = await fetch(`${apiBase}/weddings`, {
      method: 'POST', headers: { ...mutationHeaders, cookie: cookie as string },
      body: JSON.stringify({ name: 'Mai & Đức', primaryDate: '2099-12-12T09:00:00+07:00' }),
    })
    expect(createWedding.status).toBe(201)
    const createdWedding = await createWedding.json() as { wedding: { id: string; revision: number } }
    firstOwnerWeddingId = createdWedding.wedding.id

    const listWeddings = await fetch(`${apiBase}/weddings`, { headers: { cookie: cookie as string } })
    expect(listWeddings.status).toBe(200)
    expect((await listWeddings.json() as { items: Array<{ id: string }> }).items.some((item) => item.id === firstOwnerWeddingId)).toBe(true)

    const staleUpdate = await fetch(`${apiBase}/weddings/${firstOwnerWeddingId}`, {
      method: 'PATCH', headers: { ...mutationHeaders, cookie: cookie as string },
      body: JSON.stringify({ name: 'Tên stale', revision: createdWedding.wedding.revision + 1 }),
    })
    expect(staleUpdate.status).toBe(409)
    expect((await staleUpdate.json() as { error: { code: string } }).error.code).toBe('WEDDING_REVISION_CONFLICT')

    const createEvent = await fetch(`${apiBase}/weddings/${firstOwnerWeddingId}/events`, {
      method: 'POST', headers: { ...mutationHeaders, cookie: cookie as string },
      body: JSON.stringify({
        name: 'Lễ thành hôn', eventType: 'CEREMONY', startsAt: '2099-12-12T09:00:00+07:00',
        timezone: 'Asia/Ho_Chi_Minh', venueName: 'White Palace', isPublic: true,
      }),
    })
    expect(createEvent.status).toBe(201)

    const dashboard = await fetch(`${apiBase}/weddings/${firstOwnerWeddingId}/dashboard`, { headers: { cookie: cookie as string } })
    expect(dashboard.status).toBe(200)
    const dashboardBody = await dashboard.json() as { dashboard: { metrics: { guests: number; responses: number }; nextEvent: { name: string }; publication: { invitation: { views: null } } } }
    expect(dashboardBody.dashboard.metrics).toMatchObject({ guests: 0, responses: 0 })
    expect(dashboardBody.dashboard.nextEvent.name).toBe('Lễ thành hôn')
    expect(dashboardBody.dashboard.publication.invitation.views).toBeNull()

    const forgot = await fetch(`${apiBase}/auth/forgot-password`, {
      method: 'POST', headers: mutationHeaders, body: JSON.stringify({ email }),
    })
    expect(forgot.status).toBe(202)
    const resetMessage = await capturedMessageFor(email, 'Đặt lại mật khẩu GMM Wedding')
    const resetToken = /token=([A-Za-z0-9_-]+)/.exec(resetMessage.Text)?.[1]
    const newPassword = 'New-Correct-Horse-Battery-84'
    const reset = await fetch(`${apiBase}/auth/reset-password`, {
      method: 'POST', headers: mutationHeaders, body: JSON.stringify({ token: resetToken, password: newPassword }),
    })
    expect(reset.status).toBe(204)
    expect((await fetch(`${apiBase}/me`, { headers: { cookie: cookie as string } })).status).toBe(401)
    expect((await fetch(`${apiBase}/auth/reset-password`, {
      method: 'POST', headers: mutationHeaders, body: JSON.stringify({ token: resetToken, password: newPassword }),
    })).status).toBe(400)
    expect((await fetch(`${apiBase}/auth/login`, {
      method: 'POST', headers: mutationHeaders, body: credentials,
    })).status).toBe(401)
    const relogin = await fetch(`${apiBase}/auth/login`, {
      method: 'POST', headers: mutationHeaders, body: JSON.stringify({ email, password: newPassword }),
    })
    expect(relogin.status).toBe(200)
    const resetCookie = relogin.headers.get('set-cookie')?.split(';', 1)[0]

    const logout = await fetch(`${apiBase}/auth/logout`, {
      method: 'POST',
      headers: { ...mutationHeaders, cookie: resetCookie as string },
      body: '{}',
    })
    expect(logout.status).toBe(204)

    const afterLogout = await fetch(`${apiBase}/me`, { headers: { cookie: resetCookie as string } })
    expect(afterLogout.status).toBe(401)
  })

  it('separates the owner and platform-admin login surfaces', async () => {
    const prisma = new PrismaClient()
    const email = `admin-integration-${Date.now()}@example.test`
    const password = 'Correct-Horse-Admin-42'
    const credentials = JSON.stringify({ email, password })
    try {
      expect((await fetch(`${apiBase}/auth/register`, {
        method: 'POST', headers: mutationHeaders, body: credentials,
      })).status).toBe(202)
      const message = await capturedMessageFor(email)
      const token = /token=([A-Za-z0-9_-]+)/.exec(message.Text)?.[1]
      expect((await fetch(`${apiBase}/auth/verify-email`, {
        method: 'POST', headers: mutationHeaders, body: JSON.stringify({ token }),
      })).status).toBe(204)

      expect((await fetch(`${apiBase}/auth/resend-verification`, {
        method: 'POST', headers: mutationHeaders, body: JSON.stringify({ email }),
      })).status).toBe(202)
      expect(await prisma.verificationToken.count({
        where: { identifier: email, purpose: 'EMAIL_VERIFICATION', usedAt: null },
      })).toBe(0)

      const denied = await fetch(`${apiBase}/auth/admin/login`, {
        method: 'POST', headers: mutationHeaders, body: credentials,
      })
      expect(denied.status).toBe(403)
      expect((await denied.json() as { error: { code: string } }).error.code).toBe('ADMIN_ACCESS_REQUIRED')

      const user = await prisma.user.findUniqueOrThrow({ where: { email }, select: { id: true } })
      await prisma.userRole.create({
        data: { userId: user.id, role: 'ADMIN', reason: 'Auth integration test' },
      })

      const adminForgot = await fetch(`${apiBase}/auth/forgot-password`, {
        method: 'POST', headers: mutationHeaders, body: JSON.stringify({ email }),
      })
      expect(adminForgot.status).toBe(202)
      expect(await prisma.verificationToken.count({
        where: { identifier: email, purpose: 'PASSWORD_RESET' },
      })).toBe(0)

      const ownerLogin = await fetch(`${apiBase}/auth/login`, {
        method: 'POST', headers: mutationHeaders, body: credentials,
      })
      expect(ownerLogin.status).toBe(200)
      const ownerCookie = ownerLogin.headers.get('set-cookie')?.split(';', 1)[0]
      expect(firstOwnerWeddingId).toBeTruthy()
      expect((await fetch(`${apiBase}/weddings/${firstOwnerWeddingId}`, {
        headers: { cookie: ownerCookie as string },
      })).status).toBe(404)

      const adminLogin = await fetch(`${apiBase}/auth/admin/login`, {
        method: 'POST', headers: mutationHeaders, body: credentials,
      })
      expect(adminLogin.status).toBe(200)
      const cookie = adminLogin.headers.get('set-cookie')?.split(';', 1)[0]
      const adminMe = await fetch(`${apiBase}/admin/me`, { headers: { cookie: cookie as string } })
      expect(adminMe.status).toBe(200)
      const body = await adminMe.json() as { actor: { kind: string; assurance: string } }
      expect(body.actor).toMatchObject({ kind: 'platformAdmin', assurance: 'base' })
    } finally {
      await prisma.$disconnect()
    }
  })
})
