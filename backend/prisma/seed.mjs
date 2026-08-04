import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const ids = {
  user: '10000000-0000-4000-8000-000000000001',
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
  const user = await prisma.user.upsert({
    where: { email: 'owner.local@gmm.test' },
    update: {},
    create: {
      id: ids.user,
      email: 'owner.local@gmm.test',
      emailVerifiedAt: new Date(),
      displayName: 'GMM Local Owner',
      status: 'ACTIVE',
    },
  })

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
