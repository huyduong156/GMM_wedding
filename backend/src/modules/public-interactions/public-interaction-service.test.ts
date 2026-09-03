import type { PrismaClient } from "@prisma/client"
import { describe, expect, it, vi } from "vitest"
import { PublicInteractionService } from "./public-interaction-service"

function prismaMock(maxPartySize:number, upsert=vi.fn()) {
  return {
    publishedWeddingSnapshot: { findFirst: vi.fn().mockResolvedValue({ wedding: { id: "wedding-1" } }) },
    guest: { findFirst: vi.fn().mockResolvedValue({ id: "guest-1", slug: "guest-1", name: "Guest", displayName: null, maxPartySize }) },
    rsvpResponse: { upsert },
  } as unknown as PrismaClient
}
describe("PublicInteractionService",()=>{
  it("rejects an RSVP above the guest party-size limit",async()=>{
    const prisma=prismaMock(2)
    await expect(new PublicInteractionService(prisma).submitPersonalRsvp("mai-duc","guest-1",{attendance:"ATTENDING",partySize:3})).rejects.toMatchObject({code:"RSVP_PARTY_SIZE_INVALID",status:400})
  })
  it("upserts a valid personalized RSVP by wedding and guest",async()=>{
    const upsert=vi.fn().mockResolvedValue({id:"rsvp-1",guestId:"guest-1",attendance:"ATTENDING",partySize:2,updatedAt:new Date()})
    const prisma=prismaMock(2,upsert)
    await new PublicInteractionService(prisma).submitPersonalRsvp("mai-duc","guest-1",{attendance:"ATTENDING",partySize:2})
    expect(upsert).toHaveBeenCalledWith(expect.objectContaining({where:{weddingId_guestId:{weddingId:"wedding-1",guestId:"guest-1"}}}))
  })
})
