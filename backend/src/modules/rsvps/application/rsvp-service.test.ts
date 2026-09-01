import { describe, expect, it, vi } from 'vitest'
import { RsvpService } from './rsvp-service'
import type { RsvpRepository } from './ports'

const actor = { kind: 'user' as const, userId: 'user-1', sessionId: 'session-1' }
const repository = (
  result: Awaited<ReturnType<RsvpRepository['listOwned']>>,
  overrides: Partial<RsvpRepository> = {},
): RsvpRepository => ({
  listOwned: vi.fn().mockResolvedValue(result),
  promoteToGuest: vi.fn(),
  linkGuest: vi.fn(),
  ...overrides,
})

describe('RsvpService', () => {
  it('lists owner-scoped RSVP data', async () => {
    const repo = repository({ items: [], nextCursor: null })
    await expect(new RsvpService(repo).list(actor, 'wedding-1', { limit: 50 })).resolves.toEqual({
      items: [],
      nextCursor: null,
    })
    expect(repo.listOwned).toHaveBeenCalledWith('user-1', 'wedding-1', { limit: 50 })
  })

  it('does not expose another wedding as an empty list', async () => {
    await expect(
      new RsvpService(repository(null)).list(actor, 'other-wedding', { limit: 50 }),
    ).rejects.toMatchObject({ code: 'WEDDING_NOT_FOUND', status: 404 })
  })

  it('promotes an anonymous RSVP through the repository', async () => {
    const promoteToGuest = vi
      .fn()
      .mockResolvedValue({ guest: { id: 'guest-1' }, invitationId: 'invitation-1' })
    const repo = repository(null, { promoteToGuest })
    await expect(
      new RsvpService(repo).promoteToGuest(actor, 'wedding-1', 'rsvp-1', { displayName: 'Guest' }),
    ).resolves.toEqual({ guest: { id: 'guest-1' }, invitationId: 'invitation-1' })
    expect(promoteToGuest).toHaveBeenCalledWith('user-1', 'wedding-1', 'rsvp-1', {
      displayName: 'Guest',
    })
  })

  it('rejects linking an RSVP to a different guest', async () => {
    const linkGuest = vi.fn().mockResolvedValue('conflict')
    await expect(
      new RsvpService(repository(null, { linkGuest })).linkGuest(
        actor,
        'wedding-1',
        'rsvp-1',
        'guest-2',
      ),
    ).rejects.toMatchObject({ code: 'RSVP_ALREADY_LINKED', status: 409 })
  })
})
