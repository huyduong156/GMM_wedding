import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const MAX_SLUG_LENGTH = 64

function normalize(value) {
  const normalized = value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, MAX_SLUG_LENGTH)
    .replace(/-+$/g, '')
  return normalized || 'wedding'
}

function candidates(value) {
  const base = normalize(value)
  return [...new Set([base, `${base}-wedding`, `wedding-${base}`, `${base}-web-wedding`, `web-wedding-${base}`].map(normalize))]
}

async function nextSlug(name, weddingId) {
  const isTaken = async (slug) => Boolean(await prisma.wedding.findFirst({ where: { slug, NOT: { id: weddingId } }, select: { id: true } }))
  for (const candidate of candidates(name)) if (!await isTaken(candidate)) return candidate
  const base = normalize(name)
  for (let suffix = 1; ; suffix += 1) {
    const candidate = normalize(`${base}-wedding-${suffix}`)
    if (!await isTaken(candidate)) return candidate
  }
}

try {
  const weddings = await prisma.wedding.findMany({ where: { slug: null, deletedAt: null }, select: { id: true, name: true }, orderBy: { createdAt: 'asc' } })
  for (const wedding of weddings) {
    const slug = await nextSlug(wedding.name, wedding.id)
    await prisma.wedding.update({ where: { id: wedding.id }, data: { slug } })
    console.log(`${wedding.id}: ${slug}`)
  }
  const slugs = await prisma.wedding.findMany({ where: { slug: { not: null }, deletedAt: null }, select: { id: true, slug: true } })
  for (const wedding of slugs) {
    await prisma.weddingRecap.updateMany({ where: { weddingId: wedding.id }, data: { slug: wedding.slug } })
    await prisma.publishedRecapSnapshot.updateMany({ where: { recap: { weddingId: wedding.id } }, data: { slug: wedding.slug } })
  }
  console.log(`Backfilled ${weddings.length} wedding slug(s) and synchronized ${slugs.length} recap slug(s).`)
} finally {
  await prisma.$disconnect()
}
