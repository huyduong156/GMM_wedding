export const verdantPromiseTemplateConfig = {
  templateKey: 'verdant-promise', displayName: 'Verdant Promise', templateVersion: '1.3.0', templateConfigVersion: '1.0', contentSchemaVersion: '1.0', rendererApiVersion: '1.0', status: 'development', type: 'invitation',
  palettes: [{ key: 'greenhouse', label: 'Vườn kính', default: true }],
  sections: [
    { sectionKey: 'cover', label: 'Bìa thiệp', required: true, canToggle: false, canReorder: false },
    { sectionKey: 'invitation', label: 'Lời mời', required: true, canToggle: false, canReorder: false },
    { sectionKey: 'families', label: 'Thông tin hai gia đình', required: true, canToggle: false, canReorder: true },
    { sectionKey: 'eventDetails', label: 'Ngày và giờ', required: true, canToggle: false, canReorder: false },
    { sectionKey: 'countdown', label: 'Đếm ngược', canToggle: true, canReorder: true },
    { sectionKey: 'timeline', label: 'Lịch trình', canToggle: true, canReorder: true },
    { sectionKey: 'venue', label: 'Địa điểm và bản đồ', canToggle: true, canReorder: true },
    { sectionKey: 'gallery', label: 'Album ảnh', canToggle: true, canReorder: true },
    { sectionKey: 'rsvp', label: 'Xác nhận tham dự', canToggle: true, canReorder: true },
    { sectionKey: 'guestbook', label: 'Sổ lưu bút', canToggle: true, canReorder: true },
    { sectionKey: 'gift', label: 'Thông tin mừng cưới', canToggle: true, canReorder: true },
  ],
} as const
