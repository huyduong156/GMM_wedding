import type { PageMetadata } from '../shared/lib/page-metadata'
import { adminRoutes, marketingRoutes, publicTemplateRoutes, studioRoutes } from '../shared/config/routes'

const descriptions = {
  marketing: 'Tạo thiệp cưới, website cưới và lưu giữ những khoảnh khắc đáng nhớ cùng Ourday.',
  studio: 'Không gian quản lý và chuẩn bị ngày cưới trên Ourday.',
  admin: 'Không gian quản trị nền tảng Ourday.',
}

const exactTitles: Record<string, string> = {
  [marketingRoutes.home]: 'Ourday | Ngày trọng đại, được chuẩn bị thật nhẹ nhàng',
  [marketingRoutes.invitationTemplates]: 'Mẫu thiệp cưới online | Ourday',
  [marketingRoutes.websiteTemplates]: 'Mẫu website cưới | Ourday',
  [marketingRoutes.recapTemplates]: 'Mẫu Wedding Recap | Ourday',
  [marketingRoutes.howItWorks]: 'Ourday hoạt động như thế nào?',
  [marketingRoutes.faq]: 'Câu hỏi thường gặp | Ourday',
  [marketingRoutes.login]: 'Đăng nhập | Ourday',
  [marketingRoutes.register]: 'Tạo tài khoản | Ourday',
  [marketingRoutes.verifyEmail]: 'Xác minh email | Ourday',
  [marketingRoutes.forgotPassword]: 'Quên mật khẩu | Ourday',
  [marketingRoutes.resetPassword]: 'Đặt lại mật khẩu | Ourday',
  [studioRoutes.home]: 'Tổng quan Wedding | Ourday',
  [studioRoutes.inviteThemes]: 'Kho mẫu thiệp cưới | Ourday',
  [studioRoutes.invites]: 'Thiệp cưới của bạn | Ourday',
  [studioRoutes.siteThemes]: 'Kho mẫu website cưới | Ourday',
  [studioRoutes.siteEditor]: 'Chỉnh sửa website cưới | Ourday',
  [studioRoutes.guests]: 'Danh sách khách mời | Ourday',
  [studioRoutes.guestCategories]: 'Nhóm khách mời | Ourday',
  [studioRoutes.rsvps]: 'Xác nhận tham dự | Ourday',
  [studioRoutes.wishes]: 'Lời chúc | Ourday',
  [studioRoutes.todos]: 'Công việc chuẩn bị | Ourday',
  [studioRoutes.giftLedger]: 'Sổ tiền mừng | Ourday',
  [studioRoutes.recap]: 'Wedding Recap | Ourday',
  [studioRoutes.recapThemes]: 'Kho mẫu Wedding Recap | Ourday',
  [studioRoutes.analytics]: 'Thống kê | Ourday',
  [studioRoutes.members]: 'Thành viên Wedding | Ourday',
  [studioRoutes.events]: 'Sự kiện cưới | Ourday',
  [studioRoutes.settings]: 'Cài đặt Wedding | Ourday',
  [studioRoutes.profile]: 'Hồ sơ cá nhân | Ourday',
  [studioRoutes.media]: 'Kho ảnh cưới | Ourday',
  [adminRoutes.home]: 'Tổng quan quản trị | Ourday',
  [adminRoutes.login]: 'Đăng nhập quản trị | Ourday',
  [adminRoutes.users]: 'Quản lý người dùng | Ourday',
  [adminRoutes.inviteLibrary]: 'Quản lý mẫu thiệp | Ourday',
  [adminRoutes.websiteLibrary]: 'Quản lý mẫu website | Ourday',
  [adminRoutes.recapLibrary]: 'Quản lý mẫu recap | Ourday',
  [adminRoutes.styles]: 'Quản lý phong cách | Ourday',
  [adminRoutes.music]: 'Quản lý nhạc cưới | Ourday',
  [publicTemplateRoutes.modernLuxePreview]: 'Élan d’Amour – Mẫu thiệp cưới | Ourday',
  [publicTemplateRoutes.verdantPromisePreview]: 'Verdant Promise – Mẫu thiệp cưới | Ourday',
  [publicTemplateRoutes.chibiDaydreamPreview]: 'Chibi Daydream – Mẫu thiệp cưới | Ourday',
  [publicTemplateRoutes.peonyVerandaPreview]: 'Peony Veranda – Mẫu thiệp cưới | Ourday',
  [publicTemplateRoutes.roseGardenPreview]: 'Rose Garden – Mẫu thiệp cưới | Ourday',
  [publicTemplateRoutes.astralVowPreview]: 'Astral Vow – Mẫu thiệp cưới | Ourday',
  [publicTemplateRoutes.vanHyPreview]: 'Vạn Hỷ – Mẫu thiệp cưới | Ourday',
  [publicTemplateRoutes.aureliaCourtPreview]: 'Aurelia Court – Mẫu thiệp cưới | Ourday',
}

export function routeMetadata(pathname: string): PageMetadata {
  if (/^\/workspace-access\//.test(pathname)) {
    return {
      title: 'Lời mời tham gia Wedding | Ourday',
      description: 'Bạn nhận được một lời mời cộng tác trong không gian Wedding trên Ourday.',
      robots: 'noindex,nofollow',
    }
  }
  const title = exactTitles[pathname]
  const description = pathname.startsWith(adminRoutes.home)
    ? descriptions.admin
    : pathname.startsWith('/studio')
      ? descriptions.studio
      : descriptions.marketing
  return {
    title: title ?? 'Ourday | Không gian cưới của riêng bạn',
    description,
    robots:
      pathname.startsWith(adminRoutes.home) || pathname.startsWith('/studio')
        ? 'noindex,nofollow'
        : 'index,follow',
  }
}
