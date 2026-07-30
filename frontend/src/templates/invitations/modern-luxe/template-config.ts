export const modernLuxeTemplateConfig = {
  templateKey: 'modern-luxe',
  templateVersion: '1.0.0',
  templateConfigVersion: '1.0',
  contentSchemaVersion: '1.0',
  rendererApiVersion: '1.0',
  status: 'development',
  type: 'invitation',
  palettes: [
    { key: 'champagne', label: 'Champagne', default: true },
    { key: 'midnight', label: 'Midnight' },
    { key: 'sage', label: 'Sage' },
  ],
  sections: [
    { sectionKey: 'hero', label: 'Mở đầu', required: true, canToggle: false, canReorder: false, fields: { brideName: { type: 'string', required: true, maxLength: 80 }, groomName: { type: 'string', required: true, maxLength: 80 }, weddingDate: { type: 'date', required: true }, eyebrow: { type: 'string', maxLength: 80 } } },
    { sectionKey: 'invitation', label: 'Lời mời', canToggle: true, canReorder: true, fields: { title: { type: 'string', maxLength: 120 }, message: { type: 'text', maxLength: 500 } } },
    { sectionKey: 'photoMoment', label: 'Ảnh cặp đôi', canToggle: true, canReorder: true, fields: { image: { type: 'image', required: true } } },
    { sectionKey: 'schedule', label: 'Lịch trình', canToggle: true, canReorder: true, fields: { ceremonyTime: { type: 'time' }, receptionTime: { type: 'time' } } },
    { sectionKey: 'venue', label: 'Địa điểm', canToggle: true, canReorder: true, fields: { venueName: { type: 'string', required: true }, venueAddress: { type: 'string', required: true }, mapUrl: { type: 'url' } } },
    { sectionKey: 'rsvp', label: 'Xác nhận tham dự', canToggle: true, canReorder: true, fields: { deadline: { type: 'date' }, message: { type: 'string', maxLength: 180 } } },
  ],
} as const
