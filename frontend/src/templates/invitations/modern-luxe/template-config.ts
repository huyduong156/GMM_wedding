export const modernLuxeDisplayStyles = {
  gallery: [{ key: 'deck-3d', label: 'Slide 3D' }, { key: 'editorial-grid', label: 'Lưới editorial' }, { key: 'film-row', label: 'Dải ảnh ngang' }],
  activities: [{ key: 'activity-cards', label: 'Thẻ nổi' }, { key: 'activity-grid', label: 'Lưới ảnh' }, { key: 'activity-marquee', label: 'Dải chuyển động' }],
} as const

export const modernLuxeTemplateConfig = {
  templateKey: 'modern-luxe',
  displayName: 'Élan d’Amour',
  templateVersion: '2.3.0',
  templateConfigVersion: '1.0',
  contentSchemaVersion: '1.0',
  rendererApiVersion: '1.0',
  status: 'ready',
  type: 'invitation',
  palettes: [
    { key: 'champagne', label: 'Champagne', default: true },
    { key: 'midnight', label: 'Midnight' },
    { key: 'sage', label: 'Sage' },
  ],
  sections: [
    { sectionKey: 'cover', label: 'Bìa thiệp', required: true, canToggle: false, canReorder: false, fields: { brideName: { type: 'string', required: true, maxLength: 80 }, groomName: { type: 'string', required: true, maxLength: 80 }, weddingDate: { type: 'date', required: true }, eyebrow: { type: 'string', maxLength: 80 } } },
    { sectionKey: 'invitation', label: 'Lời mời', required: true, canToggle: false, canReorder: false, fields: { title: { type: 'string', maxLength: 120 }, message: { type: 'text', maxLength: 500 } } },
    { sectionKey: 'loveJourney', label: 'Hành trình tình yêu', canToggle: true, canReorder: true, fields: { milestones: { type: 'items', maxItems: 8 }, autoPlay: { type: 'boolean' } } },
    { sectionKey: 'families', label: 'Thông tin hai gia đình', required: true, canToggle: false, canReorder: false, fields: { brideFatherTitle: { type: 'string', maxLength: 30 }, brideFather: { type: 'string', maxLength: 80 }, brideMotherTitle: { type: 'string', maxLength: 30 }, brideMother: { type: 'string', maxLength: 80 }, groomFatherTitle: { type: 'string', maxLength: 30 }, groomFather: { type: 'string', maxLength: 80 }, groomMotherTitle: { type: 'string', maxLength: 30 }, groomMother: { type: 'string', maxLength: 80 } } },
    { sectionKey: 'eventDetails', label: 'Thời gian hôn lễ', canToggle: false, canReorder: false, fields: { ceremonyTime: { type: 'time' }, receptionTime: { type: 'time' } } },
    { sectionKey: 'countdown', label: 'Lịch cưới và đếm ngược', canToggle: true, canReorder: true, fields: {} },
    { sectionKey: 'timeline', label: 'Lịch trình trong ngày', canToggle: true, canReorder: true, fields: { items: { type: 'items', maxItems: 10, itemFields: { time: { type: 'time', required: true }, title: { type: 'string', required: true, maxLength: 80 }, detail: { type: 'text', maxLength: 240 } } } } },
    { sectionKey: 'venue', label: 'Địa điểm và bản đồ', canToggle: true, canReorder: true, fields: { venueName: { type: 'string', required: true }, venueAddress: { type: 'string', required: true }, mapUrl: { type: 'url' }, calendarUrl: { type: 'url' } } },
    { sectionKey: 'activities', label: 'Hoạt động trong tiệc', canToggle: true, canReorder: true, fields: { displayStyle: { type: 'select', options: modernLuxeDisplayStyles.activities }, items: { type: 'items', maxItems: 8, itemFields: { title: { type: 'string', required: true, maxLength: 80 }, image: { type: 'image', required: true } } } } },
    { sectionKey: 'gallery', label: 'Album ảnh', canToggle: true, canReorder: true, fields: { displayStyle: { type: 'select', options: modernLuxeDisplayStyles.gallery }, images: { type: 'images', maxItems: 12 } } },
    { sectionKey: 'rsvp', label: 'Xác nhận tham dự', canToggle: true, canReorder: true, fields: { deadline: { type: 'date' }, message: { type: 'string', maxLength: 180 } } },
    { sectionKey: 'guestbook', label: 'Sổ lưu bút', canToggle: true, canReorder: true, fields: {} },
    { sectionKey: 'gift', label: 'Thông tin mừng cưới', canToggle: true, canReorder: true, fields: { message: { type: 'text', maxLength: 300 } } },
    { sectionKey: 'music', label: 'Nhạc nền', canToggle: true, canReorder: false, fields: { audio: { type: 'audio', maxSizeMb: 15 }, name: { type: 'string', maxLength: 120 }, autoplay: { type: 'boolean', default: true } } },
  ],
} as const
