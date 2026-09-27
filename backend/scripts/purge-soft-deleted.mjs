import { PrismaClient } from '@prisma/client'

const RETENTION_DAYS = 14
const BATCH_SIZE = 500

const prisma = new PrismaClient()

async function purgeBatch(model, cutoff) {
  const where = { deletedAt: { lte: cutoff } }
  let total = 0

  while (true) {
    const rows = await model.findMany({
      where,
      select: { id: true },
      orderBy: { deletedAt: 'asc' },
      take: BATCH_SIZE,
    })

    if (rows.length === 0) return total

    const result = await model.deleteMany({
      where: { id: { in: rows.map((row) => row.id) }, ...where },
    })
    total += result.count

    if (rows.length < BATCH_SIZE) return total
  }
}

async function purgeCategories(cutoff) {
  let total = 0

  // GuestCategory has a restrictive self-reference. Delete leaves first so a
  // parent category is only removed after its deleted descendants are gone.
  while (true) {
    const candidates = await prisma.guestCategory.findMany({
      where: { deletedAt: { lte: cutoff } },
      select: { id: true },
      orderBy: { deletedAt: 'asc' },
      take: BATCH_SIZE,
    })
    if (candidates.length === 0) return total

    let progress = 0
    for (const candidate of candidates) {
      const children = await prisma.guestCategory.count({
        where: { parentId: candidate.id },
      })
      if (children > 0) continue

      const result = await prisma.guestCategory.deleteMany({
        where: { id: candidate.id, deletedAt: { lte: cutoff } },
      })
      total += result.count
      progress += result.count
    }

    // A recent child can legitimately keep an old parent alive. Avoid a hot
    // loop and leave that parent for a later run.
    if (progress === 0) return total
  }
}

export async function runPurge() {
  const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000)
  const lock = await prisma.$queryRaw`SELECT pg_try_advisory_lock(hashtextextended('gmm:retention:purge-soft-deleted', 0)) AS acquired`
  if (!lock[0]?.acquired) {
    console.log(JSON.stringify({ job: 'purge-soft-deleted', skipped: 'already-running' }))
    return
  }

  try {
  const [guests, groups, tasks, giftLedgerEntries, categories] = await Promise.all([
    purgeBatch(prisma.guest, cutoff),
    purgeBatch(prisma.guestGroup, cutoff),
    purgeBatch(prisma.weddingTask, cutoff),
    purgeBatch(prisma.giftLedgerEntry, cutoff),
    purgeCategories(cutoff),
  ])

  console.log(
    JSON.stringify({
      job: 'purge-soft-deleted',
      retentionDays: RETENTION_DAYS,
      cutoff: cutoff.toISOString(),
      deleted: { guests, guestGroups: groups, guestCategories: categories, weddingTasks: tasks, giftLedgerEntries },
    }),
  )
  } finally {
    await prisma.$queryRaw`SELECT pg_advisory_unlock(hashtextextended('gmm:retention:purge-soft-deleted', 0))`
  }
}

if (process.argv[1]?.endsWith('purge-soft-deleted.mjs')) {
  runPurge()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
}
