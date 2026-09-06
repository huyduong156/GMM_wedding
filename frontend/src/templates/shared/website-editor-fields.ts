import type { TemplateFieldConfig } from '../../shared/api/weddings'

export const weddingWebsiteEditorFields: Record<string, Record<string, TemplateFieldConfig>> = {
  hero: {
    eyebrow: {
      type: 'string',
      contentKey: 'hero.eyebrow',
      label: 'Dòng giới thiệu',
      maxLength: 100,
    },
    brideName: {
      type: 'string',
      contentKey: 'hero.brideName',
      label: 'Tên cô dâu',
      required: true,
      maxLength: 80,
    },
    groomName: {
      type: 'string',
      contentKey: 'hero.groomName',
      label: 'Tên chú rể',
      required: true,
      maxLength: 80,
    },
    headline: {
      type: 'string',
      contentKey: 'hero.headline',
      label: 'Tiêu đề chính',
      maxLength: 180,
    },
    date: { type: 'string', contentKey: 'hero.date', label: 'Ngày hiển thị', maxLength: 40 },
    venue: { type: 'string', contentKey: 'hero.venue', label: 'Địa điểm nổi bật', maxLength: 120 },
    image: { type: 'image', contentKey: 'hero.image', label: 'Ảnh mở đầu', mediaRole: 'hero' },
  },
  announcement: {
    title: { type: 'string', contentKey: 'announcement.title', label: 'Tiêu đề', maxLength: 120 },
    message: {
      type: 'text',
      contentKey: 'announcement.message',
      label: 'Lời báo tin',
      maxLength: 600,
    },
  },
  couple: {
    brideName: {
      type: 'string',
      contentKey: 'couple.bride.name',
      label: 'Tên cô dâu',
      required: true,
      maxLength: 80,
    },
    brideBio: {
      type: 'text',
      contentKey: 'couple.bride.bio',
      label: 'Giới thiệu cô dâu',
      maxLength: 600,
    },
    brideImage: {
      type: 'image',
      contentKey: 'couple.bride.image',
      label: 'Ảnh cô dâu',
      mediaRole: 'bride',
    },
    groomName: {
      type: 'string',
      contentKey: 'couple.groom.name',
      label: 'Tên chú rể',
      required: true,
      maxLength: 80,
    },
    groomBio: {
      type: 'text',
      contentKey: 'couple.groom.bio',
      label: 'Giới thiệu chú rể',
      maxLength: 600,
    },
    groomImage: {
      type: 'image',
      contentKey: 'couple.groom.image',
      label: 'Ảnh chú rể',
      mediaRole: 'groom',
    },
  },
  story: {
    items: {
      type: 'items',
      recommendedMinItems: 3,
      contentKey: 'story',
      label: 'Các cột mốc',
      maxItems: 12,
      itemFields: {
        year: { type: 'string', label: 'Năm', required: true },
        title: { type: 'string', label: 'Tiêu đề', required: true },
        body: { type: 'text', label: 'Nội dung' },
        image: { type: 'image', label: 'Ảnh cột mốc', mediaRole: 'story' },
      },
    },
  },
  events: {
    items: {
      type: 'items',
      recommendedMinItems: 3,
      contentKey: 'events',
      label: 'Các sự kiện',
      maxItems: 12,
      itemFields: {
        date: { type: 'string', label: 'Ngày' },
        time: { type: 'time', label: 'Thời gian' },
        title: { type: 'string', label: 'Tên sự kiện', required: true },
        venue: { type: 'string', label: 'Địa điểm' },
        address: { type: 'string', label: 'Địa chỉ' },
      },
    },
  },
  venues: {
    title: { type: 'string', contentKey: 'venues.title', label: 'Tiêu đề địa điểm' },
    address: { type: 'string', contentKey: 'venues.address', label: 'Địa chỉ' },
    mapUrl: { type: 'url', contentKey: 'venues.mapUrl', label: 'Đường dẫn bản đồ' },
  },
  gallery: {
    title: { type: 'string', contentKey: 'gallery.title', label: 'Tiêu đề album' },
    images: {
      type: 'images',
      contentKey: 'gallery',
      label: 'Ảnh trong album',
      maxItems: 40,
      mediaRole: 'gallery',
    },
  },
  schedule: {
    items: {
      type: 'items',
      recommendedMinItems: 3,
      contentKey: 'schedule',
      label: 'Lịch trình',
      maxItems: 30,
      itemFields: {
        time: { type: 'time', label: 'Thời gian' },
        title: { type: 'string', label: 'Tiêu đề', required: true },
        detail: { type: 'text', label: 'Chi tiết' },
      },
    },
  },
  dressCode: {
    title: { type: 'string', contentKey: 'dressCode.title', label: 'Tiêu đề dress code' },
    message: { type: 'text', contentKey: 'dressCode.message', label: 'Hướng dẫn trang phục' },
  },
  travel: {
    items: {
      type: 'items',
      recommendedMinItems: 3,
      contentKey: 'travel',
      label: 'Di chuyển và lưu trú',
      maxItems: 20,
      itemFields: {
        title: { type: 'string', label: 'Tiêu đề' },
        detail: { type: 'text', label: 'Chi tiết' },
        url: { type: 'url', label: 'Đường dẫn' },
      },
    },
  },
  faq: {
    items: {
      type: 'items',
      recommendedMinItems: 3,
      contentKey: 'faq',
      label: 'Câu hỏi thường gặp',
      maxItems: 20,
      itemFields: {
        question: { type: 'string', label: 'Câu hỏi', required: true },
        answer: { type: 'text', label: 'Câu trả lời', required: true },
      },
    },
  },
  rsvp: {
    title: { type: 'string', contentKey: 'rsvp.title', label: 'Tiêu đề RSVP' },
    message: { type: 'text', contentKey: 'rsvp.message', label: 'Lời nhắn RSVP' },
    deadline: { type: 'date', contentKey: 'rsvp.deadline', label: 'Hạn phản hồi' },
  },
  guestbook: {
    title: { type: 'string', contentKey: 'guestbook.title', label: 'Tiêu đề sổ lưu bút' },
    message: { type: 'text', contentKey: 'guestbook.message', label: 'Lời nhắn sổ lưu bút' },
  },
  gift: {
    title: { type: 'string', contentKey: 'gift.title', label: 'Tiêu đề mừng cưới' },
    message: { type: 'text', contentKey: 'gift.message', label: 'Lời nhắn mừng cưới' },
  },
  footer: {
    message: {
      type: 'text',
      contentKey: 'footer.message',
      label: 'Lời nhắn cuối trang',
      required: true,
      maxLength: 600,
    },
    signature: { type: 'string', contentKey: 'footer.signature', label: 'Chữ ký', maxLength: 120 },
  },
}
