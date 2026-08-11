import type { TemplateFieldConfig, TemplateSectionConfig } from '../../../shared/api/weddings'

export type EditorSectionDefinition = { sectionKey: string; label: string; required: boolean; canToggle: boolean; canReorder: boolean; fields: Record<string, TemplateFieldConfig> }
const text = (label: string, maxLength: number, required = false): TemplateFieldConfig => ({ type: 'string', label, maxLength, required })
const area = (label: string, maxLength: number, required = false): TemplateFieldConfig => ({ type: 'text', label, maxLength, required })

const canonical: Record<string, Omit<EditorSectionDefinition, 'sectionKey'>> = {
  cover: { label: 'Bìa thiệp', required: true, canToggle: false, canReorder: false, fields: { brideName: text('Tên cô dâu', 80, true), groomName: text('Tên chú rể', 80, true), weddingDate: text('Ngày cưới hiển thị', 80, true), eyebrow: text('Dòng mở đầu', 80) } },
  banner: { label: 'Banner cặp đôi', required: true, canToggle: false, canReorder: false, fields: { brideName: text('Tên cô dâu', 80, true), groomName: text('Tên chú rể', 80, true), weddingDate: text('Ngày cưới hiển thị', 80, true) } },
  invitation: { label: 'Lời mời', required: true, canToggle: false, canReorder: false, fields: { invitationTitle: text('Tiêu đề lời mời', 120, true), invitationMessage: area('Nội dung lời mời', 500, true) } },
  families: { label: 'Hai gia đình', required: true, canToggle: false, canReorder: false, fields: { brideFatherTitle: text('Danh xưng cha cô dâu', 30), brideFather: text('Họ tên cha cô dâu', 80), brideMotherTitle: text('Danh xưng mẹ cô dâu', 30), brideMother: text('Họ tên mẹ cô dâu', 80), groomFatherTitle: text('Danh xưng cha chú rể', 30), groomFather: text('Họ tên cha chú rể', 80), groomMotherTitle: text('Danh xưng mẹ chú rể', 30), groomMother: text('Họ tên mẹ chú rể', 80) } },
  eventDetails: { label: 'Thời gian hôn lễ', required: true, canToggle: false, canReorder: false, fields: { ceremonyTime: { type: 'time', label: 'Giờ làm lễ' }, receptionTime: { type: 'time', label: 'Giờ khai tiệc' } } },
  ceremony: { label: 'Lễ thành hôn', required: true, canToggle: false, canReorder: true, fields: { ceremonyTitle: text('Tiêu đề nghi lễ', 160, true), ceremonyTime: { type: 'time', label: 'Giờ làm lễ', required: true }, ceremonyDate: text('Ngày làm lễ', 80, true), ceremonyVenue: text('Địa điểm làm lễ', 200, true), ceremonyNote: area('Ghi chú', 300) } },
  reception: { label: 'Tiệc cưới', required: true, canToggle: false, canReorder: true, fields: { invitationTitle: text('Lời kính mời', 120, true), ceremonyTime: { type: 'time', label: 'Giờ đón khách' }, receptionTime: { type: 'time', label: 'Giờ khai tiệc', required: true }, venueName: text('Tên địa điểm', 200, true), venueAddress: area('Địa chỉ', 500, true) } },
  countdown: { label: 'Đếm ngược', required: false, canToggle: true, canReorder: true, fields: {} },
  calendar: { label: 'Lịch ngày cưới', required: false, canToggle: true, canReorder: true, fields: { weddingDate: text('Ngày cưới', 80, true), calendarUrl: { type: 'url', label: 'Link thêm vào lịch' } } },
  timeline: { label: 'Lịch trình', required: false, canToggle: true, canReorder: true, fields: { timelineItems: { type: 'items', label: 'Các mốc lịch trình', maxItems: 10, itemFields: { time: { type: 'time', label: 'Thời gian', required: true }, title: text('Tên hạng mục', 80, true), detail: area('Mô tả', 240) } } } },
  venue: { label: 'Địa điểm và bản đồ', required: false, canToggle: true, canReorder: true, fields: { venueName: text('Tên địa điểm', 200, true), venueAddress: area('Địa chỉ', 500, true), mapUrl: { type: 'url', label: 'Link Google Maps' }, calendarUrl: { type: 'url', label: 'Link thêm vào lịch' } } },
  map: { label: 'Bản đồ', required: false, canToggle: true, canReorder: true, fields: { venueName: text('Tên địa điểm', 200, true), venueAddress: area('Địa chỉ', 500, true), mapUrl: { type: 'url', label: 'Link Google Maps' } } },
  activities: { label: 'Hoạt động trong tiệc', required: false, canToggle: true, canReorder: true, fields: { activities: { type: 'items', label: 'Danh sách hoạt động', maxItems: 8, itemFields: { title: text('Tên hoạt động', 80, true) } } } },
  gallery: { label: 'Album ảnh', required: false, canToggle: true, canReorder: true, fields: {} }, rsvp: { label: 'Xác nhận tham dự', required: false, canToggle: true, canReorder: true, fields: { rsvpDeadline: text('Hạn phản hồi', 80), rsvpMessage: area('Lời nhắn RSVP', 180) } },
  guestbook: { label: 'Sổ lưu bút', required: false, canToggle: true, canReorder: true, fields: {} }, gift: { label: 'Thông tin mừng cưới', required: false, canToggle: true, canReorder: true, fields: { giftMessage: area('Lời nhắn mừng cưới', 300) } },
  thanks: { label: 'Lời cảm ơn', required: true, canToggle: false, canReorder: false, fields: { thanksMessage: area('Lời cảm ơn', 400, true) } }, loveJourney: { label: 'Hành trình tình yêu', required: false, canToggle: true, canReorder: true, fields: {} },
}
const aliases: Record<string, string> = { title: 'invitationTitle', message: 'invitationMessage', deadline: 'rsvpDeadline', items: 'timelineItems' }

function fields(sectionKey: string, configured?: Record<string, TemplateFieldConfig>) {
  const fallback = canonical[sectionKey]?.fields ?? {}
  if (!configured || !Object.keys(configured).length) return fallback
  return Object.fromEntries(Object.entries(configured).map(([key, field]) => { const contentKey = field.contentKey ?? (['invitation', 'rsvp', 'timeline'].includes(sectionKey) ? aliases[key] : undefined) ?? key; return [contentKey, { ...fallback[contentKey], ...field, contentKey }] }))
}

export function resolveEditorSections(config: Record<string, unknown> | null | undefined, storedOrder: string[]): EditorSectionDefinition[] {
  const raw = Array.isArray(config?.sections) ? config.sections as TemplateSectionConfig[] : storedOrder
  return raw.map((item) => typeof item === 'string' ? { sectionKey: item } : item).filter((item) => item.sectionKey && item.sectionKey !== 'music').map((item) => { const fallback = canonical[item.sectionKey]; return { sectionKey: item.sectionKey, label: item.label ?? fallback?.label ?? item.sectionKey, required: item.required ?? fallback?.required ?? false, canToggle: item.canToggle ?? fallback?.canToggle ?? true, canReorder: item.canReorder ?? fallback?.canReorder ?? true, fields: fields(item.sectionKey, item.fields) } })
}

export function validateSchemaContent(content: Record<string, unknown>, sections: EditorSectionDefinition[], enabled: string[]) {
  const errors: Record<string, string> = {}
  for (const section of sections) if (enabled.includes(section.sectionKey)) for (const [key, field] of Object.entries(section.fields)) {
    if (['image', 'images', 'audio'].includes(field.type)) continue
    const value = content[key]
    if (field.required && (value === undefined || value === null || String(value).trim() === '')) errors[key] = `Vui lòng nhập ${(field.label ?? key).toLowerCase()}.`
    else if (field.maxLength && typeof value === 'string' && value.trim().length > field.maxLength) errors[key] = `${field.label ?? key} không được vượt quá ${field.maxLength} ký tự.`
    else if (field.type === 'url' && typeof value === 'string' && value.trim()) { try { new URL(value) } catch { errors[key] = `${field.label ?? key} chưa đúng định dạng.` } }
    else if (field.type === 'items' && Array.isArray(value)) { if (field.maxItems && value.length > field.maxItems) errors[key] = `${field.label ?? key} chỉ được tối đa ${field.maxItems} mục.`; value.forEach((item, index) => { if (!item || typeof item !== 'object') return; for (const [itemKey, itemField] of Object.entries(field.itemFields ?? {})) { const itemValue = (item as Record<string, unknown>)[itemKey]; if (itemField.required && (itemValue === undefined || String(itemValue).trim() === '')) errors[`${key}.${index}.${itemKey}`] = `Vui lòng nhập ${(itemField.label ?? itemKey).toLowerCase()}.` } }) }
  }
  return errors
}
