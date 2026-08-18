import { prisma } from '@/platform/database/prisma'
import { RsvpService } from './application/rsvp-service'
import { PrismaRsvpRepository } from './infrastructure/prisma-rsvp-repository'

let service: RsvpService | undefined
export function getRsvpService() {
  service ??= new RsvpService(new PrismaRsvpRepository(prisma))
  return service
}
