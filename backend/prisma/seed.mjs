import { Algorithm, hash as argonHash } from '@node-rs/argon2'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Local test fixtures are added below in the same idempotent seed.

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
  const passwordHash = await argonHash(seedPassword, { algorithm: Algorithm.Argon2id })

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

  const adminRole = await prisma.userRole.findFirst({
    where: { userId: user.id, role: 'ADMIN', revokedAt: null },
  })
  if (!adminRole) {
    await prisma.userRole.create({
      data: { id: ids.userRole, userId: user.id, role: 'ADMIN', reason: 'Local seed account' },
    })
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
    {
      authorName: 'Nguyễn Hoàng Nam',
      content: 'Chúc hai bạn luôn giữ được sự dịu dàng và tiếng cười trong hành trình mới.',
      status: 'PENDING',
      isPinned: false,
    },
    {
      authorName: 'Trần Thu Hà',
      content: 'Chúc Mai và Đức thật nhiều yêu thương, bình an và những chuyến đi đáng nhớ.',
      status: 'APPROVED',
      isPinned: true,
    },
    {
      authorName: 'Cô Lan',
      content: 'Chúc hai con trăm năm hạnh phúc, cùng nhau vun đắp một mái ấm bình yên.',
      status: 'APPROVED',
      isPinned: false,
    },
    {
      authorName: 'Khách ẩn danh',
      content: 'Chúc mừng ngày trọng đại của hai bạn.',
      status: 'HIDDEN',
      isPinned: false,
    },
  ]
  const targetWeddings = await prisma.wedding.findMany({
    where: { deletedAt: null },
    select: { id: true },
  })
  for (const target of targetWeddings) {
    for (const sample of wishSeed) {
      const exists = await prisma.wish.findFirst({
        where: { weddingId: target.id, authorName: sample.authorName, content: sample.content },
        select: { id: true },
      })
      if (!exists)
        await prisma.wish.create({
          data: { weddingId: target.id, ...sample, submittedAt: new Date() },
        })
    }
  }
  await seedTestFixtures({ prisma })
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
async function seedTestFixtures({ prisma }) {
  const password = process.env.SEED_TEST_PASSWORD ?? 'mytester123@'
  const passwordHash = await argonHash(password, { algorithm: Algorithm.Argon2id })
  const ids = {
    admin: 'a1000000-0000-4000-8000-000000000001',
    user: 'a1000000-0000-4000-8000-000000000002',
    extraUser: 'a1000000-0000-4000-8000-000000000003',
    wedding: 'a2000000-0000-4000-8000-000000000001',
    userMember: 'a3000000-0000-4000-8000-000000000001',
    adminMember: 'a3000000-0000-4000-8000-000000000002',
    extraUserMember: 'a3000000-0000-4000-8000-000000000003',
    ceremony: 'a4000000-0000-4000-8000-000000000001',
    reception: 'a4000000-0000-4000-8000-000000000002',
    categoryFamily: 'a5000000-0000-4000-8000-000000000001',
    categoryFriends: 'a5000000-0000-4000-8000-000000000002',
    groupFamily: 'a6000000-0000-4000-8000-000000000001',
    groupFriends: 'a6000000-0000-4000-8000-000000000002',
  }
  const upsert = async (model, id, data) =>
    prisma[model].upsert({ where: { id }, update: data, create: { id, ...data } })
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {
      passwordHash,
      emailVerifiedAt: new Date(),
      displayName: 'Local Test Admin',
      status: 'ACTIVE',
      platformRole: 'ADMIN',
    },
    create: {
      id: ids.admin,
      email: 'admin@gmail.com',
      passwordHash,
      emailVerifiedAt: new Date(),
      displayName: 'Local Test Admin',
      status: 'ACTIVE',
      platformRole: 'ADMIN',
    },
  })
  const user = await prisma.user.upsert({
    where: { email: 'user@gmail.com' },
    update: {
      passwordHash,
      emailVerifiedAt: new Date(),
      displayName: 'Local Test User',
      status: 'ACTIVE',
      platformRole: 'USER',
    },
    create: {
      id: ids.user,
      email: 'user@gmail.com',
      passwordHash,
      emailVerifiedAt: new Date(),
      displayName: 'Local Test User',
      status: 'ACTIVE',
      platformRole: 'USER',
    },
  })
  const extraUser = await prisma.user.upsert({
    where: { email: 'user2@gmail.com' },
    update: {
      passwordHash,
      emailVerifiedAt: new Date(),
      displayName: 'Local Test User 2',
      status: 'ACTIVE',
      platformRole: 'USER',
    },
    create: {
      id: ids.extraUser,
      email: 'user2@gmail.com',
      passwordHash,
      emailVerifiedAt: new Date(),
      displayName: 'Local Test User 2',
      status: 'ACTIVE',
      platformRole: 'USER',
    },
  })
  const existingAdminRole = await prisma.userRole.findFirst({
    where: { userId: admin.id, role: 'ADMIN', revokedAt: null },
  })
  if (!existingAdminRole)
    await prisma.userRole.create({
      data: { userId: admin.id, role: 'ADMIN', reason: 'Local test fixture' },
    })

  await upsert('wedding', ids.wedding, {
    createdById: user.id,
    name: 'Minh & An - Test Workspace',
    slug: 'minh-an-test-workspace',
    status: 'DRAFT',
    visibility: 'INVITE_ONLY',
    timezone: 'Asia/Ho_Chi_Minh',
    locale: 'vi-VN',
    primaryDate: new Date('2027-03-20T10:00:00+07:00'),
  })
  await upsert('weddingMember', ids.userMember, {
    weddingId: ids.wedding,
    userId: user.id,
    role: 'OWNER',
    status: 'ACTIVE',
    joinedAt: new Date(),
  })
  await upsert('weddingMember', ids.adminMember, {
    weddingId: ids.wedding,
    userId: admin.id,
    role: 'EDITOR',
    status: 'ACTIVE',
    joinedAt: new Date(),
  })
  await upsert('weddingMember', ids.extraUserMember, {
    weddingId: ids.wedding,
    userId: extraUser.id,
    role: 'VIEWER',
    status: 'ACTIVE',
    joinedAt: new Date(),
  })
  await upsert('weddingEvent', ids.ceremony, {
    weddingId: ids.wedding,
    name: 'Lễ gia tiên',
    eventType: 'ceremony',
    startsAt: new Date('2027-03-20T08:00:00+07:00'),
    endsAt: new Date('2027-03-20T09:30:00+07:00'),
    timezone: 'Asia/Ho_Chi_Minh',
    venueName: 'Tư gia nhà trai',
    addressLine: 'Quận 3, Thành phố Hồ Chí Minh',
    sortOrder: 1,
  })
  await upsert('weddingEvent', ids.reception, {
    weddingId: ids.wedding,
    name: 'Tiệc cưới',
    eventType: 'reception',
    startsAt: new Date('2027-03-20T17:30:00+07:00'),
    endsAt: new Date('2027-03-20T21:30:00+07:00'),
    timezone: 'Asia/Ho_Chi_Minh',
    venueName: 'The Test Garden',
    addressLine: 'Thành phố Thủ Đức, Thành phố Hồ Chí Minh',
    sortOrder: 2,
  })
  await upsert('weddingContent', 'a7000000-0000-4000-8000-000000000001', {
    weddingId: ids.wedding,
    content: {
      couple: { partnerOne: 'Minh', partnerTwo: 'An' },
      hero: { invitationText: 'Trân trọng kính mời' },
      families: { bride: 'Gia đình cô dâu', groom: 'Gia đình chú rể' },
    },
  })
  await upsert('weddingTheme', 'a8000000-0000-4000-8000-000000000001', {
    weddingId: ids.wedding,
    surface: 'WEDDING_WEBSITE',
    themeConfig: { colorScheme: 'champagne' },
    sectionConfig: { order: ['hero', 'events', 'rsvp', 'wishes'] },
  })

  await upsert('guestCategory', ids.categoryFamily, {
    weddingId: ids.wedding,
    name: 'Gia đình',
    depth: 1,
    sortOrder: 1,
  })
  await upsert('guestCategory', ids.categoryFriends, {
    weddingId: ids.wedding,
    name: 'Bạn bè',
    depth: 1,
    sortOrder: 2,
  })
  await upsert('guestGroup', ids.groupFamily, {
    weddingId: ids.wedding,
    name: 'Họ nhà trai',
    note: 'Fixture nhóm gia đình.',
  })
  await upsert('guestGroup', ids.groupFriends, {
    weddingId: ids.wedding,
    name: 'Bạn đại học',
    note: 'Fixture nhóm bạn.',
  })
  const guests = [
    {
      id: 'aa000000-0000-4000-8000-000000000001',
      displayName: 'Nguyễn Minh Khang',
      email: 'khang.guest@example.test',
      categoryId: ids.categoryFamily,
      groupId: ids.groupFamily,
      tableName: 'Bàn 01',
      maxPartySize: 2,
      tags: ['family', 'vip'],
    },
    {
      id: 'aa000000-0000-4000-8000-000000000002',
      displayName: 'Trần Ngọc Mai',
      email: 'mai.guest@example.test',
      categoryId: ids.categoryFamily,
      groupId: ids.groupFamily,
      tableName: 'Bàn 02',
      maxPartySize: 1,
      tags: ['family'],
    },
    {
      id: 'aa000000-0000-4000-8000-000000000003',
      displayName: 'Lê Hoàng Nam',
      email: 'nam.guest@example.test',
      categoryId: ids.categoryFriends,
      groupId: ids.groupFriends,
      tableName: 'Bàn 05',
      maxPartySize: 2,
      tags: ['friend'],
    },
    {
      id: 'aa000000-0000-4000-8000-000000000004',
      displayName: 'Phạm Thu Hà',
      email: 'ha.guest@example.test',
      categoryId: ids.categoryFriends,
      groupId: ids.groupFriends,
      tableName: 'Bàn 05',
      maxPartySize: 1,
      tags: ['friend', 'colleague'],
    },
    {
      id: 'aa000000-0000-4000-8000-000000000005',
      displayName: 'Đỗ Gia Bảo',
      email: 'bao.guest@example.test',
      categoryId: ids.categoryFriends,
      groupId: ids.groupFriends,
      tableName: null,
      maxPartySize: 1,
      tags: ['pending'],
    },
    ...Array.from({ length: 45 }, (_, index) => {
      const number = index + 6
      const isFamily = number % 2 === 0
      return {
        id: `aa000000-0000-4000-8000-${String(number).padStart(12, '0')}`,
        displayName: `Khách test ${String(number).padStart(2, '0')}`,
        email: `guest${String(number).padStart(2, '0')}@example.test`,
        categoryId: isFamily ? ids.categoryFamily : ids.categoryFriends,
        groupId: isFamily ? ids.groupFamily : ids.groupFriends,
        tableName: `Bàn ${String(((number - 1) % 12) + 1).padStart(2, '0')}`,
        maxPartySize: number % 5 === 0 ? 2 : 1,
        tags: isFamily ? ['family', 'generated'] : ['friend', 'generated'],
      }
    }),
  ]
  for (const guest of guests) await upsert('guest', guest.id, { weddingId: ids.wedding, ...guest })
  const invitations = guests.slice(0, 20).map((guest, index) => ({
    id: `ab000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`,
    guestId: guest.id,
    label: `Thiệp test ${index + 1}`,
    publicSlug: `minh-an-test-${index + 1}`,
    tokenHash: `seed-test-token-hash-${index + 1}`,
    status: 'ACTIVE',
    maxPartySize: guest.maxPartySize,
  }))
  for (const invitation of invitations)
    await upsert('invitation', invitation.id, { weddingId: ids.wedding, ...invitation })

  const rsvps = [
    {
      id: 'ac000000-0000-4000-8000-000000000001',
      invitationId: invitations[0].id,
      attendance: 'ATTENDING',
      partySize: 2,
      mealPreference: 'Không dị ứng',
      message: 'Rất vui được tham dự.',
      eventSelectionId: 'ac100000-0000-4000-8000-000000000001',
    },
    {
      id: 'ac000000-0000-4000-8000-000000000002',
      invitationId: invitations[1].id,
      attendance: 'DECLINED',
      partySize: 1,
      mealPreference: null,
      message: 'Hẹn dịp khác nhé.',
      eventSelectionId: 'ac100000-0000-4000-8000-000000000002',
    },
    {
      id: 'ac000000-0000-4000-8000-000000000003',
      invitationId: invitations[2].id,
      attendance: 'MAYBE',
      partySize: 1,
      mealPreference: 'Món chay',
      message: null,
      eventSelectionId: 'ac100000-0000-4000-8000-000000000003',
    },
  ]
  for (const rsvp of rsvps) {
    await upsert('rsvpResponse', rsvp.id, {
      weddingId: ids.wedding,
      invitationId: rsvp.invitationId,
      attendance: rsvp.attendance,
      partySize: rsvp.partySize,
      mealPreference: rsvp.mealPreference,
      message: rsvp.message,
    })
    await upsert('rsvpEventSelection', rsvp.eventSelectionId, {
      rsvpResponseId: rsvp.id,
      weddingEventId: ids.reception,
      attending: rsvp.attendance === 'ATTENDING',
    })
  }
  const wishes = [
    {
      id: 'ad000000-0000-4000-8000-000000000001',
      authorName: 'Nguyễn Hoàng Nam',
      content: 'Chúc hai bạn luôn giữ được sự dịu dàng và tiếng cười.',
      status: 'PENDING',
      isPinned: false,
      guestId: guests[2].id,
      invitationId: invitations[2].id,
    },
    {
      id: 'ad000000-0000-4000-8000-000000000002',
      authorName: 'Trần Thu Hà',
      content: 'Chúc Minh và An thật nhiều yêu thương và bình an.',
      status: 'APPROVED',
      isPinned: true,
      guestId: guests[3].id,
      invitationId: invitations[3].id,
    },
    {
      id: 'ad000000-0000-4000-8000-000000000003',
      authorName: 'Khách ẩn danh',
      content: 'Chúc mừng ngày trọng đại của hai bạn.',
      status: 'HIDDEN',
      isPinned: false,
      guestId: null,
      invitationId: null,
    },
  ]
  for (const wish of wishes) await upsert('wish', wish.id, { weddingId: ids.wedding, ...wish })

  const tasks = [
    {
      id: 'ae000000-0000-4000-8000-000000000001',
      title: 'Chốt danh sách khách mời',
      description: 'Rà lại nhóm gia đình và bạn bè.',
      dueAt: new Date('2026-11-15T16:00:00+07:00'),
      priority: 'HIGH',
      status: 'DONE',
      eventId: null,
      sortOrder: 1,
    },
    {
      id: 'ae000000-0000-4000-8000-000000000002',
      title: 'Gửi thiệp online',
      description: 'Gửi link thiệp cho các nhóm khách.',
      dueAt: new Date('2026-12-01T16:00:00+07:00'),
      priority: 'URGENT',
      status: 'IN_PROGRESS',
      eventId: ids.reception,
      sortOrder: 2,
    },
    {
      id: 'ae000000-0000-4000-8000-000000000003',
      title: 'Xác nhận menu với nhà hàng',
      description: 'Kiểm tra món chay và dị ứng.',
      dueAt: new Date('2027-02-20T16:00:00+07:00'),
      priority: 'MEDIUM',
      status: 'TODO',
      eventId: ids.reception,
      sortOrder: 3,
    },
    {
      id: 'ae000000-0000-4000-8000-000000000004',
      title: 'Chuẩn bị bảng tên bàn',
      description: 'Task con để test hierarchy.',
      dueAt: new Date('2027-03-10T16:00:00+07:00'),
      priority: 'LOW',
      status: 'TODO',
      eventId: ids.reception,
      parentTaskId: 'ae000000-0000-4000-8000-000000000003',
      sortOrder: 4,
    },
  ]
  for (const task of tasks)
    await upsert('weddingTask', task.id, {
      weddingId: ids.wedding,
      assigneeMemberId: ids.userMember,
      completedById: task.status === 'DONE' ? user.id : null,
      completedAt: task.status === 'DONE' ? new Date('2026-08-05T08:00:00Z') : null,
      sourceTemplateKey: 'local-test-checklist',
      sourceTemplateVersion: 1,
      ...task,
    })
  const gifts = [
    {
      id: 'af000000-0000-4000-8000-000000000001',
      guestId: guests[0].id,
      guestDisplayNameSnapshot: guests[0].displayName,
      giftType: 'MONEY',
      amountMinor: BigInt(3000000),
      currency: 'VND',
      receiveMethod: 'BANK_TRANSFER',
      receivedAt: new Date('2027-03-20T18:00:00+07:00'),
      giftDescription: 'Mừng cưới',
      reciprocityStatus: 'PENDING',
    },
    {
      id: 'af000000-0000-4000-8000-000000000002',
      guestId: guests[2].id,
      guestDisplayNameSnapshot: guests[2].displayName,
      giftType: 'GOLD',
      goldWeight: '0.5000',
      goldUnit: 'chi',
      goldType: '24K',
      receiveMethod: 'OTHER',
      receivedAt: new Date('2027-03-20T18:30:00+07:00'),
      giftDescription: 'Quà vàng mẫu',
      reciprocityStatus: 'NOT_APPLICABLE',
    },
    {
      id: 'af000000-0000-4000-8000-000000000003',
      guestId: guests[3].id,
      guestDisplayNameSnapshot: guests[3].displayName,
      giftType: 'PHYSICAL_GIFT',
      receiveMethod: 'PHYSICAL_GIFT',
      receivedAt: new Date('2027-03-20T19:00:00+07:00'),
      giftDescription: 'Bộ ly thủy tinh',
      reciprocityStatus: 'RETURNED',
      returnedAt: new Date('2027-04-01T08:00:00+07:00'),
    },
  ]
  for (const gift of gifts)
    await upsert('giftLedgerEntry', gift.id, { weddingId: ids.wedding, ...gift })
  console.log('Seeded test accounts: admin@gmail.com, user@gmail.com and user2@gmail.com')
}
