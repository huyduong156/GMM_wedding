import type { PrismaClient } from '@prisma/client'
import { GuestError } from '@/modules/guests/domain/guest-error'

export type RsvpInput = {
  guestName?: string | undefined
  attendance: 'ATTENDING' | 'DECLINED' | 'MAYBE'
  partySize: number
  mealPreference?: string | undefined
  specialRequest?: string | undefined
  message?: string | undefined
}
export type WishInput = { guestName?: string | undefined; content: string }

export class PublicInteractionService {
  constructor(private readonly prisma: PrismaClient) {}

  private async publishedWedding(slug: string, requirePublic = true) {
    const snapshot = await this.prisma.publishedWeddingSnapshot.findFirst({
      where: {
        surface: 'ONLINE_INVITATION',
        unpublishedAt: null,
        wedding: {
          slug,
          status: 'PUBLISHED',
          deletedAt: null,
          ...(requirePublic ? { visibility: 'PUBLIC' as const } : {}),
        },
      },
      select: { wedding: { select: { id: true } } },
    })
    if (!snapshot)
      throw new GuestError('PUBLIC_WEDDING_NOT_FOUND', 404, 'Published wedding not found')
    return { id: snapshot.wedding.id, slug }
  }

  async approvedWishes(weddingSlug: string) {
    const wedding = await this.publishedWedding(weddingSlug, false)
    return {
      wishes: await this.prisma.wish.findMany({
        where: { weddingId: wedding.id, status: 'APPROVED', deletedAt: null },
        select: { id: true, authorName: true, content: true, submittedAt: true, isPinned: true },
        orderBy: [{ isPinned: 'desc' }, { submittedAt: 'desc' }],
        take: 100,
      }),
    }
  }

  private async personalGuest(weddingSlug: string, guestSlug: string) {
    const wedding = await this.publishedWedding(weddingSlug, false)
    const guest = await this.prisma.guest.findFirst({
      where: { weddingId: wedding.id, slug: guestSlug, deletedAt: null },
      select: { id: true, slug: true, name: true, displayName: true, maxPartySize: true },
    })
    if (!guest) throw new GuestError('PUBLIC_GUEST_NOT_FOUND', 404, 'Guest link not found')
    return { wedding, guest }
  }

  async submitRsvp(weddingSlug: string, input: RsvpInput) {
    if (!input.guestName)
      throw new GuestError('GUEST_NAME_REQUIRED', 400, 'Guest name is required for the common invitation URL')
    const wedding = await this.publishedWedding(weddingSlug, false)
    return this.saveRsvp(wedding.id, null, 50, input)
  }

  async submitPersonalRsvp(weddingSlug: string, guestSlug: string, input: RsvpInput) {
    const { wedding, guest } = await this.personalGuest(weddingSlug, guestSlug)
    return this.saveRsvp(wedding.id, guest.id, guest.maxPartySize, input)
  }

  private async saveRsvp(weddingId: string, guestId: string | null, maxPartySize: number, input: RsvpInput) {
    if (input.partySize < 1 || input.partySize > maxPartySize)
      throw new GuestError('RSVP_PARTY_SIZE_INVALID', 400, `Party size must be between 1 and ${maxPartySize}`)
    const optional = {
      ...(input.mealPreference !== undefined ? { mealPreference: input.mealPreference } : {}),
      ...(input.specialRequest !== undefined ? { specialRequest: input.specialRequest } : {}),
      ...(input.message !== undefined ? { message: input.message } : {}),
    }
    const response = guestId
      ? await this.prisma.rsvpResponse.upsert({
          where: { weddingId_guestId: { weddingId, guestId } },
          create: { weddingId, guestId, attendance: input.attendance, partySize: input.partySize, ...optional },
          update: { attendance: input.attendance, partySize: input.partySize, ...optional, revision: { increment: 1 } },
          select: { id: true, guestId: true, attendance: true, partySize: true, updatedAt: true },
        })
      : await this.prisma.rsvpResponse.create({
          data: { weddingId, guestId: null, attendance: input.attendance, partySize: input.partySize, ...optional },
          select: { id: true, guestId: true, attendance: true, partySize: true, updatedAt: true },
        })
    return { rsvp: response }
  }

  async submitWish(weddingSlug: string, input: WishInput) {
    if (!input.guestName)
      throw new GuestError('GUEST_NAME_REQUIRED', 400, 'Guest name is required for the common invitation URL')
    const wedding = await this.publishedWedding(weddingSlug, false)
    return {
      wish: await this.prisma.wish.create({
        data: { weddingId: wedding.id, guestId: null, authorName: input.guestName, content: input.content },
        select: { id: true, authorName: true, content: true, status: true, submittedAt: true },
      }),
    }
  }

  async submitPersonalWish(weddingSlug: string, guestSlug: string, input: WishInput) {
    const { wedding, guest } = await this.personalGuest(weddingSlug, guestSlug)
    return {
      wish: await this.prisma.wish.create({
        data: {
          weddingId: wedding.id,
          guestId: guest.id,
          authorName: guest.displayName ?? guest.name,
          content: input.content,
        },
        select: { id: true, authorName: true, content: true, status: true, submittedAt: true },
      }),
    }
  }
}