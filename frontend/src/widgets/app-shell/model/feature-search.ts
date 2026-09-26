import { studioRoutes } from '../../../shared/config/routes'

export type SearchFeature = { label: string; to: string; group?: string }

// Labels and URLs come from the visible sidebar; only synonyms live here.
const keywords: Record<string, string[]> = {
  [studioRoutes.home]: ['dashboard', 'tổng hợp'],
  [studioRoutes.inviteThemes]: ['mẫu thiệp', 'giao diện thiệp'],
  [studioRoutes.invites]: ['chỉnh sửa thiệp', 'editor thiệp', 'thiệp online'],
  [studioRoutes.siteThemes]: ['mẫu website', 'giao diện website'],
  [studioRoutes.site]: ['chỉnh sửa website', 'website cưới'],
  [studioRoutes.recapThemes]: ['mẫu recap', 'giao diện recap'],
  [studioRoutes.recap]: ['kỷ niệm', 'chỉnh sửa recap'],
  [studioRoutes.guests]: ['danh sách khách', 'quản lý khách'],
  [studioRoutes.guestCategories]: ['nhóm khách', 'phân loại khách'],
  [studioRoutes.rsvps]: ['rsvp', 'phản hồi', 'đi dự'],
  [studioRoutes.wishes]: ['guestbook', 'chúc mừng'],
  [studioRoutes.events]: ['sự kiện', 'lịch cưới', 'địa điểm'],
  [studioRoutes.todos]: ['công việc', 'checklist', 'việc cần làm'],
  [studioRoutes.giftLedger]: ['quà tặng', 'phong bì'],
  [studioRoutes.analytics]: ['báo cáo', 'phân tích'],
  [studioRoutes.members]: ['cộng tác viên', 'phân quyền'],
  [studioRoutes.settings]: ['thiết lập', 'thông tin đám cưới'],
  [studioRoutes.profile]: ['tài khoản', 'hồ sơ', 'thông tin cá nhân'],
}

export function normalizeFeatureQuery(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
}

export function searchFeatures(features: SearchFeature[], query: string): SearchFeature[] {
  const normalized = normalizeFeatureQuery(query)
  if (!normalized) return features
  const tokens = normalized.split(' ')
  return features
    .map((feature) => {
      const label = normalizeFeatureQuery(feature.label)
      const terms = [label, ...(keywords[feature.to] ?? []).map(normalizeFeatureQuery)]
      const matches = tokens.every((token) => terms.some((term) => term.includes(token)))
      const rank =
        label === normalized
          ? 0
          : label.startsWith(normalized)
            ? 1
            : label.includes(normalized)
              ? 2
              : 3
      return { feature, matches, rank }
    })
    .filter((item) => item.matches)
    .sort((a, b) => a.rank - b.rank)
    .map((item) => item.feature)
}
