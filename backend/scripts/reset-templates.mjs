import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const protectedEnvironments = new Set(['production', 'staging'])

async function main() {
  const appEnv = (process.env.APP_ENV ?? 'local').toLowerCase()
  if (protectedEnvironments.has(appEnv)) {
    throw new Error(`Template reset is disabled when APP_ENV=${appEnv}`)
  }

  const result = await prisma.$transaction(async (tx) => {
    const publishedWeddingSnapshots = await tx.publishedWeddingSnapshot.deleteMany()
    const publishedRecapSnapshots = await tx.publishedRecapSnapshot.deleteMany()
    const contents = await tx.weddingContent.updateMany({
      where: { templateVersionId: { not: null } },
      data: { templateVersionId: null, status: 'DRAFT', publishedAt: null },
    })
    const versions = await tx.templateVersion.deleteMany()
    const templates = await tx.template.deleteMany()

    return {
      templates: templates.count,
      versions: versions.count,
      contents: contents.count,
      publishedWeddingSnapshots: publishedWeddingSnapshots.count,
      publishedRecapSnapshots: publishedRecapSnapshots.count,
    }
  })

  console.log('Template data reset completed.')
  console.table(result)
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
