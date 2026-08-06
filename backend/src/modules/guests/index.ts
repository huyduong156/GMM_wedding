import { prisma } from '@/platform/database/prisma'
import { GuestService } from './application/guest-service'
import { PrismaGuestRepository } from './infrastructure/prisma-guest-repository'
let service: GuestService | undefined
export function getGuestService() { service ??= new GuestService(new PrismaGuestRepository(prisma)); return service }
