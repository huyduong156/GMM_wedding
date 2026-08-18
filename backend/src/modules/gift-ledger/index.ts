import { prisma } from '@/platform/database/prisma'
import { GiftLedgerService } from './application/gift-ledger-service'
import { PrismaGiftLedgerRepository } from './infrastructure/prisma-gift-ledger-repository'
let service: GiftLedgerService | undefined
export function getGiftLedgerService() { service ??= new GiftLedgerService(new PrismaGiftLedgerRepository(prisma)); return service }
