import type { PrismaClient } from '@prisma/client'
import { describe, expect, it, vi } from 'vitest'

import { PublicInteractionService } from './public-interaction-service'

function prismaMock(maxPartySize: number, upsert = vi.fn()) {
  return {
    invitation: {
      findFirst: vi.fn().mockResolvedValue({ id: 'invitation-1', guestId: null, maxPartySize, expiresAt: null }),
      findUniqueOrThrow: vi.fn().mockResolvedValue({ weddingId: 'wedding-1', maxPartySize }),
    },
    publishedWeddingSnapshot: { findFirst: vi.fn().mockResolvedValue({ wedding: { id: 'wedding-1' } }) },
    rsvpResponse: { upsert },
  } as unknown as PrismaClient
}

describe('PublicInteractionService', () => {
  it('rejects an RSVP above the invitation party-size limit', async () => {
    const prisma = prismaMock(2)
    await expect(new PublicInteractionService(prisma).submitPersonalRsvp('mai-duc', 'anh-an', {
      attendance: 'ATTENDING', partySize: 3,
    })).rejects.toMatchObject({ code: 'RSVP_PARTY_SIZE_INVALID', status: 400 })
    expect(prisma.rsvpResponse.upsert).not.toHaveBeenCalled()
  })

  it('upserts a valid personalized RSVP by invitation business key', async () => {
    const upsert = vi.fn().mockResolvedValue({ id: 'rsvp-1', invitationId: 'invitation-1', attendance: 'ATTENDING', partySize: 2, updatedAt: new Date() })
    const prisma = prismaMock(2, upsert)
    await new PublicInteractionService(prisma).submitPersonalRsvp('mai-duc', 'anh-an', { attendance: 'ATTENDING', partySize: 2 })
    expect(upsert).toHaveBeenCalledWith(expect.objectContaining({ where: { invitationId: 'invitation-1' } }))
  })
})
