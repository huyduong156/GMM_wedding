import { randomBytes } from 'node:crypto'

import { PrismaClient } from '@prisma/client'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { hashOpaqueToken } from '../src/platform/auth/opaque-token'

const prisma = new PrismaClient()
const apiBase = process.env.AUTH_INTEGRATION_BASE_URL ?? 'http://localhost:3000/api'
const appOrigin = process.env.AUTH_INTEGRATION_APP_ORIGIN ?? 'http://localhost:8080'
const mutationHeaders = { 'content-type': 'application/json', origin: appOrigin, 'x-csrf-protection': '1' }

type TestActor = { userId: string; cookie: string }
type ApiBody = {
  wedding: { id: string; revision: number; status: string; archivedAt: string | null }
  event: { id: string; revision: number; name: string }
  error: { code: string }
  dashboard: {
    metrics: Record<string, number>
    responseTrend: Array<{ count: number }>
    recentActivity: Array<{ type: string }>
  }
}
let owner: TestActor
let otherOwner: TestActor
let weddingId: string
let eventId: string

async function actor(label: string): Promise<TestActor> {
  const token = randomBytes(32).toString('base64url')
  const user = await prisma.user.create({
    data: {
      email: `wedding-${label}-${Date.now()}-${randomBytes(4).toString('hex')}@example.test`,
      displayName: `Wedding ${label}`, emailVerifiedAt: new Date(), status: 'ACTIVE',
    },
  })
  await prisma.session.create({
    data: { userId: user.id, sessionHash: hashOpaqueToken(token), expiresAt: new Date(Date.now() + 3_600_000) },
  })
  return { userId: user.id, cookie: `gmm_session=${token}` }
}

async function body(response: Response) { return response.json() as Promise<ApiBody> }

describe.sequential('wedding API contract and persistence', () => {
  beforeAll(async () => {
    owner = await actor('owner')
    otherOwner = await actor('other-owner')
  })

  afterAll(async () => {
    if (owner?.userId || otherOwner?.userId) {
      const userIds = [owner?.userId, otherOwner?.userId].filter(Boolean) as string[]
      await prisma.wedding.deleteMany({ where: { createdById: { in: userIds } } })
      await prisma.session.deleteMany({ where: { userId: { in: userIds } } })
      await prisma.user.deleteMany({ where: { id: { in: userIds } } })
    }
    await prisma.$disconnect()
  })

  it('enforces authentication, origin policy, validation, and transactional owner membership', async () => {
    expect((await fetch(`${apiBase}/weddings`)).status).toBe(401)
    expect((await fetch(`${apiBase}/weddings`, {
      method: 'POST', headers: { ...mutationHeaders, origin: 'https://attacker.example', cookie: owner.cookie },
      body: JSON.stringify({ name: 'Blocked wedding' }),
    })).status).toBe(403)
    expect((await fetch(`${apiBase}/weddings`, {
      method: 'POST', headers: { ...mutationHeaders, cookie: owner.cookie }, body: JSON.stringify({ name: '' }),
    })).status).toBe(400)

    const create = await fetch(`${apiBase}/weddings`, {
      method: 'POST', headers: { ...mutationHeaders, cookie: owner.cookie },
      body: JSON.stringify({ name: 'Mai & Đức', primaryDate: '2099-12-12T09:00:00+07:00' }),
    })
    expect(create.status).toBe(201)
    const created = await body(create)
    weddingId = created.wedding.id
    expect(created.wedding).toMatchObject({ revision: 1, status: 'DRAFT' })
    expect(await prisma.weddingMember.count({
      where: { weddingId, userId: owner.userId, role: 'OWNER', status: 'ACTIVE' },
    })).toBe(1)
  })

  it('prevents cross-owner access and supports reversible archive with wedding CAS', async () => {
    expect((await fetch(`${apiBase}/weddings/${weddingId}`, { headers: { cookie: otherOwner.cookie } })).status).toBe(404)

    const archive = await fetch(`${apiBase}/weddings/${weddingId}`, {
      method: 'PATCH', headers: { ...mutationHeaders, cookie: owner.cookie },
      body: JSON.stringify({ status: 'ARCHIVED', revision: 1 }),
    })
    expect(archive.status).toBe(200)
    expect((await body(archive)).wedding).toMatchObject({ status: 'ARCHIVED', revision: 2 })

    const stale = await fetch(`${apiBase}/weddings/${weddingId}`, {
      method: 'PATCH', headers: { ...mutationHeaders, cookie: owner.cookie },
      body: JSON.stringify({ name: 'Stale', revision: 1 }),
    })
    expect(stale.status).toBe(409)
    expect((await body(stale)).error.code).toBe('WEDDING_REVISION_CONFLICT')

    const reopen = await fetch(`${apiBase}/weddings/${weddingId}`, {
      method: 'PATCH', headers: { ...mutationHeaders, cookie: owner.cookie },
      body: JSON.stringify({ status: 'DRAFT', revision: 2 }),
    })
    expect(reopen.status).toBe(200)
    expect((await body(reopen)).wedding).toMatchObject({ status: 'DRAFT', archivedAt: null, revision: 3 })
  })

  it('validates event time, scopes event mutations, and rejects stale event revisions', async () => {
    const invalid = await fetch(`${apiBase}/weddings/${weddingId}/events`, {
      method: 'POST', headers: { ...mutationHeaders, cookie: owner.cookie },
      body: JSON.stringify({
        name: 'Invalid', eventType: 'CEREMONY', startsAt: '2099-12-12T10:00:00+07:00',
        endsAt: '2099-12-12T09:00:00+07:00', timezone: 'Asia/Ho_Chi_Minh',
      }),
    })
    expect(invalid.status).toBe(400)
    expect((await body(invalid)).error.code).toBe('WEDDING_EVENT_TIME_INVALID')

    const create = await fetch(`${apiBase}/weddings/${weddingId}/events`, {
      method: 'POST', headers: { ...mutationHeaders, cookie: owner.cookie },
      body: JSON.stringify({
        name: 'Lễ thành hôn', eventType: 'CEREMONY', startsAt: '2099-12-12T09:00:00+07:00',
        timezone: 'Asia/Ho_Chi_Minh', venueName: 'White Palace',
      }),
    })
    expect(create.status).toBe(201)
    const created = await body(create)
    eventId = created.event.id
    expect(created.event.revision).toBe(1)

    expect((await fetch(`${apiBase}/weddings/${weddingId}/events/${eventId}`, {
      method: 'PATCH', headers: { ...mutationHeaders, cookie: otherOwner.cookie },
      body: JSON.stringify({ name: 'Forbidden', revision: 1 }),
    })).status).toBe(404)

    const update = await fetch(`${apiBase}/weddings/${weddingId}/events/${eventId}`, {
      method: 'PATCH', headers: { ...mutationHeaders, cookie: owner.cookie },
      body: JSON.stringify({ name: 'Tiệc thành hôn', revision: 1 }),
    })
    expect(update.status).toBe(200)
    expect((await body(update)).event).toMatchObject({ name: 'Tiệc thành hôn', revision: 2 })

    const stale = await fetch(`${apiBase}/weddings/${weddingId}/events/${eventId}`, {
      method: 'PATCH', headers: { ...mutationHeaders, cookie: owner.cookie },
      body: JSON.stringify({ name: 'Stale event', revision: 1 }),
    })
    expect(stale.status).toBe(409)
    expect((await body(stale)).error.code).toBe('WEDDING_EVENT_REVISION_CONFLICT')
  })

  it('excludes revoked invitations from all current dashboard RSVP metrics and activity', async () => {
    const active = await prisma.invitation.create({ data: { weddingId, label: 'Active guest', tokenHash: `active-${randomBytes(16).toString('hex')}` } })
    const revoked = await prisma.invitation.create({ data: {
      weddingId, label: 'Revoked guest', tokenHash: `revoked-${randomBytes(16).toString('hex')}`, status: 'REVOKED', revokedAt: new Date(),
    } })
    const activeResponse = await prisma.rsvpResponse.create({
      data: { weddingId, invitationId: active.id, attendance: 'ATTENDING', partySize: 2 },
    })
    const revokedResponse = await prisma.rsvpResponse.create({
      data: { weddingId, invitationId: revoked.id, attendance: 'DECLINED', partySize: 1 },
    })
    await prisma.rsvpCompanion.createMany({ data: [
      { rsvpResponseId: activeResponse.id, displayName: 'Active companion' },
      { rsvpResponseId: revokedResponse.id, displayName: 'Revoked companion' },
    ] })

    const dashboard = await fetch(`${apiBase}/weddings/${weddingId}/dashboard`, { headers: { cookie: owner.cookie } })
    expect(dashboard.status).toBe(200)
    const result = (await body(dashboard)).dashboard
    expect(result.metrics).toMatchObject({
      invitations: 2, activeInvitations: 1, responses: 1, attending: 1, declined: 0,
      pendingResponses: 0, attendingPartySize: 2, companions: 1,
    })
    expect(result.responseTrend.reduce((sum: number, item: { count: number }) => sum + item.count, 0)).toBe(1)
    expect(result.recentActivity.filter((item: { type: string }) => item.type === 'RSVP_SUBMITTED')).toHaveLength(1)
  })

  it('soft-delete is terminal and prevents subsequent reads and event creation', async () => {
    const remove = await fetch(`${apiBase}/weddings/${weddingId}`, {
      method: 'DELETE', headers: { ...mutationHeaders, cookie: owner.cookie },
    })
    expect(remove.status).toBe(204)
    expect((await fetch(`${apiBase}/weddings/${weddingId}`, { headers: { cookie: owner.cookie } })).status).toBe(404)
    expect((await fetch(`${apiBase}/weddings/${weddingId}/events`, {
      method: 'POST', headers: { ...mutationHeaders, cookie: owner.cookie },
      body: JSON.stringify({
        name: 'After delete', eventType: 'CEREMONY', startsAt: '2099-12-12T09:00:00+07:00', timezone: 'Asia/Ho_Chi_Minh',
      }),
    })).status).toBe(404)
  })
})
