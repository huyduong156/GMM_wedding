import { prisma } from '@/platform/database/prisma'
import { PublicInteractionService } from './public-interaction-service'
let service: PublicInteractionService | undefined
export function getPublicInteractionService() { service ??= new PublicInteractionService(prisma); return service }
