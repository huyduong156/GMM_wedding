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
  it("accepts RSVP submissions for a common website publication",async()=>{
    const create=vi.fn().mockResolvedValue({id:"rsvp-1",guestId:null,attendance:"ATTENDING",partySize:1,updatedAt:new Date()})
    const findSnapshot=vi.fn().mockResolvedValue({ wedding: { id: "wedding-1" } })
    const prisma={
      publishedWeddingSnapshot: { findFirst: findSnapshot },
      rsvpResponse: { create },
    } as unknown as PrismaClient
    await new PublicInteractionService(prisma).submitRsvp("mai-duc",{guestName:"Nguyễn An",attendance:"ATTENDING",partySize:1})
    expect(create).toHaveBeenCalledWith(expect.objectContaining({data:expect.objectContaining({anonymousGuestName:"Nguyễn An"})}))
    expect(findSnapshot).toHaveBeenCalledWith(expect.objectContaining({where:expect.objectContaining({surface:{in:["ONLINE_INVITATION","WEDDING_WEBSITE"]}})}))
  })
  it("lists approved wishes for a website-only publication",async()=>{
    const findSnapshot=vi.fn().mockResolvedValue({ wedding: { id: "wedding-1" } })
    const findWishes=vi.fn().mockResolvedValue([])
    const prisma={
      publishedWeddingSnapshot: { findFirst: findSnapshot },
      wish: { findMany: findWishes },
    } as unknown as PrismaClient
    await new PublicInteractionService(prisma).approvedWishes("mai-duc")
    expect(findSnapshot).toHaveBeenCalledWith(expect.objectContaining({where:expect.objectContaining({surface:{in:["ONLINE_INVITATION","WEDDING_WEBSITE"]}})}))
  })
  it("accepts wishes for a website-only publication",async()=>{
    const findSnapshot=vi.fn().mockResolvedValue({ wedding: { id: "wedding-1" } })
    const createWish=vi.fn().mockResolvedValue({ id: "wish-1", authorName: "An", content: "Chúc mừng", status: "PENDING", submittedAt: new Date() })
    const prisma={
      publishedWeddingSnapshot: { findFirst: findSnapshot },
      wish: { create: createWish },
    } as unknown as PrismaClient
    await new PublicInteractionService(prisma).submitWish("mai-duc",{guestName:"An",content:"Chúc mừng"})
    expect(findSnapshot).toHaveBeenCalledWith(expect.objectContaining({where:expect.objectContaining({surface:{in:["ONLINE_INVITATION","WEDDING_WEBSITE"]}})}))
    expect(createWish).toHaveBeenCalledWith(expect.objectContaining({data:expect.objectContaining({weddingId:"wedding-1",authorName:"An",content:"Chúc mừng"})}))
  })
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
