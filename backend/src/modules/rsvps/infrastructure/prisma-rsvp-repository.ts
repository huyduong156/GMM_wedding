import { Prisma, type PrismaClient } from "@prisma/client"
import { newGuestSlug } from "@/shared/domain/guest-slug"
import type { RsvpRepository, RsvpView } from "../application/ports"
import type { GuestView } from "@/modules/guests/application/ports"
import { RsvpError } from "../domain/rsvp-error"

const guestSelect = { id: true, weddingId: true, categoryId: true, groupId: true, name: true, slug: true, displayName: true, phone: true, email: true, note: true, tableName: true, maxPartySize: true, tags: true, createdAt: true, updatedAt: true } satisfies Prisma.GuestSelect
const encode = (x: { submittedAt: Date; id: string }) => Buffer.from(JSON.stringify([x.submittedAt.toISOString(), x.id])).toString("base64url")
const decode = (c?: string) => { if (!c) return undefined; try { const [d,id]=JSON.parse(Buffer.from(c,"base64url").toString()) as [string,string]; const date=new Date(d); return Number.isNaN(date.getTime()) ? undefined : { submittedAt: date, id } } catch { return undefined } }

export class PrismaRsvpRepository implements RsvpRepository {
  constructor(private readonly prisma: PrismaClient) {}
  private ownedWedding(userId: string, weddingId: string) { return { id: weddingId, createdById: userId, deletedAt: null } }
  private async owns(userId: string, weddingId: string) { return Boolean(await this.prisma.wedding.findFirst({ where: this.ownedWedding(userId,weddingId), select:{id:true} })) }
  async listOwned(userId: string, weddingId: string, filter: Parameters<RsvpRepository["listOwned"]>[2]) {
    if (!(await this.owns(userId,weddingId))) return null
    const cursor=decode(filter.cursor)
    const where: Prisma.RsvpResponseWhereInput={ weddingId, ...(filter.attendance?{attendance:filter.attendance}:{}), ...(filter.eventId?{eventSelections:{some:{weddingEventId:filter.eventId}}}:{}), ...(filter.categoryId?{guest:{categoryId:filter.categoryId}}:{}), ...(filter.groupId?{guest:{groupId:filter.groupId}}:{}), ...(filter.query?{guest:{OR:[{name:{contains:filter.query,mode:"insensitive"}},{displayName:{contains:filter.query,mode:"insensitive"}}]}}:{}), ...(filter.from||filter.to?{submittedAt:{...(filter.from?{gte:filter.from}:{}),...(filter.to?{lte:filter.to}:{})}}:{}), ...(cursor?{OR:[{submittedAt:{lt:cursor.submittedAt}},{submittedAt:cursor.submittedAt,id:{lt:cursor.id}}]}:{}) }
    const rows=await this.prisma.rsvpResponse.findMany({where,orderBy:[{submittedAt:"desc"},{id:"desc"}],take:filter.limit+1,select:{id:true,weddingId:true,guestId:true,attendance:true,partySize:true,mealPreference:true,specialRequest:true,message:true,submittedAt:true,updatedAt:true,revision:true,guest:{select:{id:true,name:true,displayName:true,phone:true,email:true,categoryId:true,groupId:true}},eventSelections:{select:{attending:true,weddingEvent:{select:{id:true,name:true}}},orderBy:{weddingEvent:{startsAt:"asc"}}},companions:{select:{id:true,displayName:true,mealPreference:true,sortOrder:true},orderBy:{sortOrder:"asc"}}}})
    const items=rows.slice(0,filter.limit).map((r):RsvpView=>({id:r.id,weddingId:r.weddingId,guestId:r.guestId,guestName:r.guest?(r.guest.displayName??r.guest.name):"Guest",guestPhone:r.guest?.phone??null,guestEmail:r.guest?.email??null,categoryId:r.guest?.categoryId??null,groupId:r.guest?.groupId??null,attendance:r.attendance,partySize:r.partySize,mealPreference:r.mealPreference,specialRequest:r.specialRequest,message:r.message,submittedAt:r.submittedAt,updatedAt:r.updatedAt,revision:r.revision,eventSelections:r.eventSelections.map(x=>({eventId:x.weddingEvent.id,eventName:x.weddingEvent.name,attending:x.attending})),companions:r.companions}))
    return {items,nextCursor:rows.length>filter.limit&&items.length?encode(items[items.length-1]!):null}
  }
  async promoteToGuest(userId:string,weddingId:string,rsvpId:string,data:{displayName?:string;categoryId?:string;groupId?:string}) {
    if (!(await this.owns(userId,weddingId))) return null
    return this.prisma.$transaction(async tx=>{ const response=await tx.rsvpResponse.findFirst({where:{id:rsvpId,weddingId},select:{guestId:true,partySize:true,message:true}}); if(!response)return null; if(response.guestId){const guest=await tx.guest.findFirst({where:{id:response.guestId,weddingId},select:guestSelect});return guest?{guest}:null}; const name=data.displayName??response.message;if(!name)throw new RsvpError("RSVP_GUEST_NAME_REQUIRED",400,"Guest name is required"); const guest=await tx.guest.create({data:{weddingId,slug:await newGuestSlug(name,async slug=>Boolean(await tx.guest.findFirst({where:{weddingId,slug},select:{id:true}}))),name,maxPartySize:Math.max(1,response.partySize),tags:[],...(data.categoryId?{categoryId:data.categoryId}:{}),...(data.groupId?{groupId:data.groupId}:{})},select:guestSelect});const linked=await tx.rsvpResponse.updateMany({where:{id:rsvpId,weddingId,guestId:null},data:{guestId:guest.id}});return linked.count?{guest}:"conflict" as const })
  }
  async linkGuest(userId:string,weddingId:string,rsvpId:string,guestId:string) {
    if (!(await this.owns(userId,weddingId))) return null
    return this.prisma.$transaction(async tx=>{const guest=await tx.guest.findFirst({where:{id:guestId,weddingId,deletedAt:null},select:guestSelect});if(!guest)return null;const response=await tx.rsvpResponse.findFirst({where:{id:rsvpId,weddingId},select:{guestId:true}});if(!response)return null;if(response.guestId===guestId)return {guest};if(response.guestId)return "conflict" as const;const linked=await tx.rsvpResponse.updateMany({where:{id:rsvpId,weddingId,guestId:null},data:{guestId}});return linked.count?{guest}:"conflict" as const})
  }
}