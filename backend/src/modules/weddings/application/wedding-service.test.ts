import { describe, expect, it, vi } from 'vitest'

import type { AuthenticatedUserActor } from '@/platform/auth/actor-context'
import type { WeddingEventView, WeddingRepository, WeddingView } from './ports'
import { WeddingService } from './wedding-service'

const actor: AuthenticatedUserActor = { kind: 'user', userId: 'user-1', sessionId: 'session-1' }
const wedding: WeddingView = {
  id: 'wedding-1', name: 'Mai & Đức', status: 'DRAFT', visibility: 'PUBLIC', timezone: 'Asia/Ho_Chi_Minh', locale: 'vi-VN',
  primaryDate: null, revision: 1, publishedAt: null, archivedAt: null, createdAt: new Date('2026-08-01T00:00:00Z'), updatedAt: new Date('2026-08-01T00:00:00Z'),
}
const event: WeddingEventView = {
  id: 'event-1', weddingId: wedding.id, name: 'Lễ thành hôn', eventType: 'CEREMONY', startsAt: new Date('2026-12-12T10:00:00Z'),
  endsAt: null, timezone: 'Asia/Ho_Chi_Minh', venueName: null, addressLine: null, mapUrl: null, latitude: null, longitude: null,
  sortOrder: 0, isPublic: true, revision: 1, createdAt: new Date('2026-08-01T00:00:00Z'), updatedAt: new Date('2026-08-01T00:00:00Z'),
}

function repository(): WeddingRepository {
  return {
    create: vi.fn().mockResolvedValue(wedding), listOwned: vi.fn().mockResolvedValue([wedding]), findOwned: vi.fn().mockResolvedValue(wedding),
    updateOwned: vi.fn().mockResolvedValue(wedding), softDeleteOwned: vi.fn().mockResolvedValue(true), listEventsOwned: vi.fn().mockResolvedValue([]),
    createEventOwned: vi.fn(), findEventOwned: vi.fn(), updateEventOwned: vi.fn(), deleteEventOwned: vi.fn(), dashboardOwned: vi.fn(),
    listTemplates: vi.fn().mockResolvedValue([]), getTemplateVersion: vi.fn().mockResolvedValue(null), getContentOwned: vi.fn(), saveContentOwned: vi.fn(), publishOwned: vi.fn(), unpublishOwned: vi.fn(), slugAvailable: vi.fn(), getPublicSnapshot: vi.fn(), listWishesOwned: vi.fn(), moderateWishOwned: vi.fn(),
  }
}

describe('WeddingService', () => {
  it('scopes list queries to the authenticated user', async () => {
    const repo = repository()
    await new WeddingService(repo).list(actor)
    expect(repo.listOwned).toHaveBeenCalledWith('user-1')
  })

  it('maps optimistic concurrency failure to a stable conflict', async () => {
    const repo = repository()
    vi.mocked(repo.updateOwned).mockResolvedValue('conflict')
    await expect(new WeddingService(repo).update(actor, wedding.id, { revision: 1, name: 'Tên mới' }))
      .rejects.toMatchObject({ code: 'WEDDING_REVISION_CONFLICT', status: 409 })
  })

  it('rejects an event ending before it starts', async () => {
    const repo = repository()
    await expect(new WeddingService(repo).createEvent(actor, wedding.id, {
      name: 'Lễ thành hôn', eventType: 'CEREMONY', startsAt: new Date('2026-12-12T10:00:00Z'),
      endsAt: new Date('2026-12-12T09:00:00Z'), timezone: 'Asia/Ho_Chi_Minh', sortOrder: 0, isPublic: true,
    })).rejects.toMatchObject({ code: 'WEDDING_EVENT_TIME_INVALID', status: 400 })
    expect(repo.createEventOwned).not.toHaveBeenCalled()
  })

  it('does not reveal a wedding owned by another user', async () => {
    const repo = repository()
    vi.mocked(repo.findOwned).mockResolvedValue(null)
    await expect(new WeddingService(repo).get(actor, wedding.id)).rejects.toMatchObject({ code: 'WEDDING_NOT_FOUND', status: 404 })
  })

  it('maps stale event updates to a stable conflict', async () => {
    const repo = repository()
    vi.mocked(repo.findEventOwned).mockResolvedValue(event)
    vi.mocked(repo.updateEventOwned).mockResolvedValue('conflict')
    await expect(new WeddingService(repo).updateEvent(actor, wedding.id, event.id, { revision: 1, name: 'Tiệc cưới' }))
      .rejects.toMatchObject({ code: 'WEDDING_EVENT_REVISION_CONFLICT', status: 409 })
  })

  it('maps content revision conflicts and template validation errors', async () => {
    const repo = repository()
    vi.mocked(repo.saveContentOwned).mockResolvedValue('conflict')
    await expect(new WeddingService(repo).saveContent(actor, wedding.id, {
      surface: 'ONLINE_INVITATION', templateVersionId: 'template-version', content: {}, themeConfig: {}, sectionConfig: { enabled: ['cover'], order: ['cover'] }, revision: 1,
    })).rejects.toMatchObject({ code: 'WEDDING_CONTENT_REVISION_CONFLICT', status: 409 })
    vi.mocked(repo.saveContentOwned).mockResolvedValue('section-invalid')
    await expect(new WeddingService(repo).saveContent(actor, wedding.id, {
      surface: 'ONLINE_INVITATION', templateVersionId: 'template-version', content: {}, themeConfig: {}, sectionConfig: { enabled: ['qr'], order: ['qr'] }, revision: 1,
    })).rejects.toMatchObject({ code: 'WEDDING_SECTION_INVALID', status: 400 })
  })
})
