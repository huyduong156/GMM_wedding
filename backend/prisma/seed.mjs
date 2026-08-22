import argon2 from 'argon2'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const ids = {
  user: '10000000-0000-4000-8000-000000000001',
  userRole: '11000000-0000-4000-8000-000000000001',
  wedding: '20000000-0000-4000-8000-000000000001',
  member: '30000000-0000-4000-8000-000000000001',
  event: '40000000-0000-4000-8000-000000000001',
  content: '50000000-0000-4000-8000-000000000001',
  theme: '60000000-0000-4000-8000-000000000001',
  template: '70000000-0000-4000-8000-000000000001',
  templateVersion: '80000000-0000-4000-8000-000000000001',
  website: '90000000-0000-4000-8000-000000000001',
}

async function main() {
  const seedPassword = process.env.SEED_OWNER_PASSWORD ?? 'LocalOwnerPassword123!'
  const passwordHash = await argon2.hash(seedPassword, { type: argon2.argon2id })

  const user = await prisma.user.upsert({
    where: { email: 'owner.local@gmm.test' },
    update: { passwordHash, emailVerifiedAt: new Date(), status: 'ACTIVE' },
    create: {
      id: ids.user,
      email: 'owner.local@gmm.test',
      passwordHash,
      emailVerifiedAt: new Date(),
      displayName: 'GMM Local Owner',
      status: 'ACTIVE',
    },
  })

  const adminRole = await prisma.userRole.findFirst({ where: { userId: user.id, role: 'ADMIN', revokedAt: null } })
  if (!adminRole) {
    await prisma.userRole.create({ data: { id: ids.userRole, userId: user.id, role: 'ADMIN', reason: 'Local seed account' } })
  }

  const template = await prisma.template.upsert({
    where: { key: 'local-wedding-website' },
    update: {},
    create: {
      id: ids.template,
      key: 'local-wedding-website',
      name: 'Local Wedding Website',
      productType: 'WEDDING_WEBSITE',
      status: 'ACTIVE',
    },
  })

  const templateVersion = await prisma.templateVersion.upsert({
    where: {
      templateId_version: {
        templateId: template.id,
        version: '1.0.0',
      },
    },
    update: {},
    create: {
      id: ids.templateVersion,
      templateId: template.id,
      version: '1.0.0',
      configHash: 'local-seed-v1',
      templateConfigVersion: 1,
      contentSchemaVersion: 1,
      rendererApiVersion: 1,
      codeRevision: 'local-seed',
      config: { sections: ['hero', 'events', 'rsvp', 'wishes'] },
      releasedAt: new Date(),
    },
  })

  const wedding = await prisma.wedding.upsert({
    where: { id: ids.wedding },
    update: {},
    create: {
      id: ids.wedding,
      createdById: user.id,
      name: 'Đám cưới mẫu local',
      slug: 'dam-cuoi-mau-local',
      timezone: 'Asia/Ho_Chi_Minh',
      locale: 'vi-VN',
      primaryDate: new Date('2027-01-16T10:00:00+07:00'),
    },
  })

  await prisma.weddingMember.upsert({
    where: { weddingId_userId: { weddingId: wedding.id, userId: user.id } },
    update: { role: 'OWNER', status: 'ACTIVE' },
    create: {
      id: ids.member,
      weddingId: wedding.id,
      userId: user.id,
      role: 'OWNER',
      status: 'ACTIVE',
      joinedAt: new Date(),
    },
  })

  await prisma.weddingEvent.upsert({
    where: { id: ids.event },
    update: {},
    create: {
      id: ids.event,
      weddingId: wedding.id,
      name: 'Tiệc cưới mẫu',
      eventType: 'reception',
      startsAt: new Date('2027-01-16T10:00:00+07:00'),
      timezone: 'Asia/Ho_Chi_Minh',
      venueName: 'Nhà hàng mẫu',
      addressLine: 'Thành phố Hồ Chí Minh',
    },
  })

  await prisma.weddingContent.upsert({
    where: { weddingId: wedding.id },
    update: {},
    create: {
      id: ids.content,
      weddingId: wedding.id,
      content: {
        couple: { partnerOne: 'Minh', partnerTwo: 'An' },
        hero: { invitationText: 'Trân trọng kính mời' },
      },
    },
  })

  await prisma.weddingTheme.upsert({
    where: { weddingId_surface: { weddingId: wedding.id, surface: 'WEDDING_WEBSITE' } },
    update: {},
    create: {
      id: ids.theme,
      weddingId: wedding.id,
      surface: 'WEDDING_WEBSITE',
      themeConfig: { colorScheme: 'champagne' },
      sectionConfig: { order: ['hero', 'events', 'rsvp', 'wishes'] },
    },
  })

  await prisma.weddingWebsite.upsert({
    where: { weddingId: wedding.id },
    update: {},
    create: {
      id: ids.website,
      weddingId: wedding.id,
      templateVersionId: templateVersion.id,
      slug: 'dam-cuoi-mau-local',
    },
  })
  const wishSeed = [
    { authorName: 'Nguyễn Hoàng Nam', content: 'Chúc hai bạn luôn giữ được sự dịu dàng và tiếng cười trong hành trình mới.', status: 'PENDING', isPinned: false },
    { authorName: 'Trần Thu Hà', content: 'Chúc Mai và Đức thật nhiều yêu thương, bình an và những chuyến đi đáng nhớ.', status: 'APPROVED', isPinned: true },
    { authorName: 'Cô Lan', content: 'Chúc hai con trăm năm hạnh phúc, cùng nhau vun đắp một mái ấm bình yên.', status: 'APPROVED', isPinned: false },
    { authorName: 'Khách ẩn danh', content: 'Chúc mừng ngày trọng đại của hai bạn.', status: 'HIDDEN', isPinned: false },
  ]
  const targetWeddings = await prisma.wedding.findMany({ where: { deletedAt: null }, select: { id: true } })
  for (const target of targetWeddings) {
    for (const sample of wishSeed) {
      const exists = await prisma.wish.findFirst({ where: { weddingId: target.id, authorName: sample.authorName, content: sample.content }, select: { id: true } })
      if (!exists) await prisma.wish.create({ data: { weddingId: target.id, ...sample, submittedAt: new Date() } })
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
