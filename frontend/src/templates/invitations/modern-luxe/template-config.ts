import type { TemplateConfig } from '../../template-config'
export const modernLuxeDisplayStyles = {
  gallery: [{ key: 'deck-3d', label: 'Slide 3D' }, { key: 'editorial-grid', label: 'Lưới editorial' }, { key: 'film-row', label: 'Dải ảnh ngang' }],
  activities: [{ key: 'activity-cards', label: 'Thẻ nổi' }, { key: 'activity-grid', label: 'Lưới ảnh' }, { key: 'activity-marquee', label: 'Dải chuyển động' }],
} as const

export const modernLuxeTemplateConfig = {
  templateKey: 'modern-luxe',
  displayName: 'Élan d’Amour',
  templateVersion: '2.3.1',
  templateConfigVersion: '1.0',
  contentSchemaVersion: '1.0',
  rendererApiVersion: '1.0',
  status: 'ready',
  previewPath: '/templates/invitations/modern-luxe/preview',
  quickEdit: [{ contentKey: 'brideName', label: 'Tên cô dâu' }, { contentKey: 'groomName', label: 'Tên chú rể' }],
  productType: 'ONLINE_INVITATION',
  type: 'invitation',
  palettes: [
    { key: 'champagne', label: 'Champagne', default: true },
    { key: 'midnight', label: 'Midnight' },
    { key: 'sage', label: 'Sage' },
  ],
  sections: [
    { sectionKey: 'cover', label: 'Bìa thiệp', required: true, canToggle: false, canReorder: false, fields: { brideName: { type: 'string', label: 'Tên cô dâu', required: true, maxLength: 80 }, groomName: { type: 'string', label: 'Tên chú rể', required: true, maxLength: 80 }, weddingDate: { type: 'date', label: 'Ngày cưới', required: true }, eyebrow: { type: 'string', label: 'Dòng giới thiệu', maxLength: 80 }, heroMedia: { type: 'image', label: 'Ảnh bìa thiệp', contentKey: 'heroMedia', mediaRole: 'hero' } } },
    { sectionKey: 'invitation', label: 'Lời mời', required: true, canToggle: false, canReorder: false, fields: { title: { type: 'string', contentKey: 'invitationTitle', label: 'Tiêu đề lời mời', maxLength: 120 }, message: { type: 'text', contentKey: 'invitationMessage', label: 'Nội dung lời mời', maxLength: 500 } } },
    { sectionKey: 'loveJourney', label: 'Hành trình tình yêu', canToggle: true, canReorder: true, fields: { milestones: { type: 'items', recommendedMinItems: 3, label: 'Các cột mốc', contentKey: 'loveJourney', maxItems: 8, itemFields: { year: { type: 'string', label: 'Năm', required: true, maxLength: 12 }, title: { type: 'string', label: 'Tên cột mốc', required: true, maxLength: 80 }, note: { type: 'text', label: 'Mô tả', maxLength: 180 }, image: { type: 'image', label: 'Ảnh cột mốc', mediaRole: 'journey' } } }, autoPlay: { type: 'boolean', label: 'Tự động chạy' } } },
    { sectionKey: 'families', label: 'Thông tin hai gia đình', required: true, canToggle: false, canReorder: false, fields: { brideFatherTitle: { type: 'string', label: 'Danh xưng bố cô dâu', maxLength: 30 }, brideFather: { type: 'string', label: 'Tên bố cô dâu', maxLength: 80 }, brideMotherTitle: { type: 'string', label: 'Danh xưng mẹ cô dâu', maxLength: 30 }, brideMother: { type: 'string', label: 'Tên mẹ cô dâu', maxLength: 80 }, groomFatherTitle: { type: 'string', label: 'Danh xưng bố chú rể', maxLength: 30 }, groomFather: { type: 'string', label: 'Tên bố chú rể', maxLength: 80 }, groomMotherTitle: { type: 'string', label: 'Danh xưng mẹ chú rể', maxLength: 30 }, groomMother: { type: 'string', label: 'Tên mẹ chú rể', maxLength: 80 } } },
    { sectionKey: 'eventDetails', label: 'Thời gian hôn lễ', canToggle: false, canReorder: false, fields: { ceremonyTime: { type: 'time', label: 'Thời gian làm lễ' }, receptionTime: { type: 'time', label: 'Thời gian đãi tiệc' }, dateMedia: { type: 'image', contentKey: 'eventDetailsMedia', label: 'Ảnh thời gian hôn lễ', mediaRole: 'event-details' } } },
    { sectionKey: 'countdown', label: 'Lịch cưới và đếm ngược', canToggle: true, canReorder: true, fields: {} },
    { sectionKey: 'timeline', label: 'Lịch trình trong ngày', canToggle: true, canReorder: true, fields: { items: { type: 'items', recommendedMinItems: 3, label: 'Các mốc thời gian', contentKey: 'timelineItems', maxItems: 10, itemFields: { time: { type: 'time', label: 'Thời gian', required: true }, title: { type: 'string', label: 'Tiêu đề', required: true, maxLength: 80 }, detail: { type: 'text', label: 'Mô tả chi tiết', maxLength: 240 } } } } },
    { sectionKey: 'venue', label: 'Địa điểm và bản đồ', canToggle: true, canReorder: true, fields: { venueName: { type: 'string', label: 'Tên địa điểm', required: true }, venueAddress: { type: 'string', label: 'Địa chỉ', required: true }, mapUrl: { type: 'url', label: 'Đường dẫn bản đồ' }, calendarUrl: { type: 'url', label: 'Đường dẫn thêm lịch' } } },
    { sectionKey: 'activities', label: 'Hoạt động trong tiệc', canToggle: true, canReorder: true, fields: { displayStyle: { type: 'select', contentKey: 'activitiesStyle', label: 'Kiểu hiển thị', options: modernLuxeDisplayStyles.activities }, items: { type: 'items', recommendedMinItems: 3, label: 'Các hoạt động', maxItems: 8, itemFields: { title: { type: 'string', label: 'Tiêu đề', required: true, maxLength: 80 }, image: { type: 'image', label: 'Ảnh hoạt động', required: true, mediaRole: 'activity', mediaValue: 'url' } } } } },
    { sectionKey: 'gallery', label: 'Album ảnh', canToggle: true, canReorder: true, fields: { displayStyle: { type: 'select', contentKey: 'galleryStyle', label: 'Kiểu hiển thị', options: modernLuxeDisplayStyles.gallery }, images: { type: 'images', contentKey: 'galleryImages', label: 'Ảnh trong album', mediaRole: 'gallery', maxItems: 12 } } },
    { sectionKey: 'rsvp', label: 'Xác nhận tham dự', canToggle: true, canReorder: true, fields: { deadline: { type: 'date', contentKey: 'rsvpDeadline', label: 'Hạn phản hồi' }, message: { type: 'string', contentKey: 'rsvpMessage', label: 'Lời nhắn RSVP', maxLength: 180 } } },
    { sectionKey: 'guestbook', label: 'Sổ lưu bút', canToggle: true, canReorder: true, fields: {} },
    { sectionKey: 'gift', label: 'Thông tin mừng cưới', canToggle: true, canReorder: true, fields: { message: { type: 'text', contentKey: 'giftMessage', label: 'Lời nhắn mừng cưới', maxLength: 300 }, qrMedia: { type: 'image', contentKey: 'giftQrMedia', label: 'Mã QR mừng cưới', mediaRole: 'gift-qr' } } },
    { sectionKey: 'music', label: 'Nhạc nền', canToggle: true, canReorder: false, fields: { audio: { type: 'audio', contentKey: 'backgroundMusicUrl', audioNameKey: 'backgroundMusicName', label: 'Nhạc nền' }, name: { type: 'string', contentKey: 'backgroundMusicName', label: 'Tên bản nhạc', maxLength: 120 }, autoplay: { type: 'boolean', contentKey: 'backgroundMusicAutoplay', label: 'Tự động phát', default: true } } },
    { sectionKey: 'footer', label: 'With love / Lời cảm ơn', required: true, canToggle: false, canReorder: false, fields: { message: { type: 'text', contentKey: 'footerMessage', label: 'Lời nhắn cuối thiệp', maxLength: 300 }, media: { type: 'image', contentKey: 'footerMedia', label: 'Ảnh cuối thiệp', mediaRole: 'footer' } } },
  ],
} as const satisfies TemplateConfig








