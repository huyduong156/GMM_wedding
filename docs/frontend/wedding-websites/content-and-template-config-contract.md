# Content và template config contract

## 1. Phân lớp

```text
content        semantic data/reference Wedding, Event, Media
themeConfig    presentation option renderer version hỗ trợ
sectionConfig  enabled + order theo required/canToggle/canReorder
```

Không lưu CSS, HTML, component name, script hoặc data URL trong content. Media/nhạc dùng ID backend.

## 2. Canonical content v1

```ts
type WeddingWebsiteContentV1 = {
  seo: { title: string; description: string; ogImageId: string | null }
  hero: { eyebrow?: string; brideName: string; groomName: string; headline?: string; primaryEventId: string; heroMediaId: string | null }
  announcement: { title?: string; message: string }
  couple: { bride: PersonProfile; groom: PersonProfile }
  story: { title?: string; introduction?: string; milestones: StoryMilestone[] }
  events: { title?: string; eventIds: string[]; introduction?: string }
  countdown: { eventId: string }
  venues: { title?: string; eventIds: string[]; travelNote?: string }
  gallery: { title?: string; introduction?: string; mediaIds: string[] }
  schedule: { title?: string; items: ScheduleItem[] }
  weddingParty: { title?: string; groups: PartyGroup[] }
  dressCode: { title?: string; message?: string; colors: Array<{ id: string; label: string; hex: string }> }
  travel: { title?: string; items: TravelItem[] }
  faq: { title?: string; items: Array<{ id: string; question: string; answer: string }> }
  rsvp: { title?: string; message?: string; deadline?: string; eventIds: string[] }
  guestbook: { title?: string; message?: string }
  gift: { title?: string; message?: string; accounts: GiftAccount[] }
  footer: { message: string; signature?: string }
  music: { musicTrackId: string | null; enabled: boolean; autoplayRequested: boolean; initialVolume: number }
}

type PersonProfile = { displayName: string; biography?: string; portraitMediaId: string | null; socialLinks?: Array<{ label: string; url: string }> }
type StoryMilestone = { id: string; date?: string; title: string; body: string; mediaId: string | null }
type ScheduleItem = { id: string; eventId: string; time: string; title: string; detail?: string }
type PartyGroup = { id: string; title: string; members: Array<{ id: string; name: string; role?: string; biography?: string; mediaId: string | null }> }
type TravelItem = { id: string; type: 'HOTEL' | 'TRANSPORT' | 'PARKING' | 'OTHER'; title: string; detail: string; url?: string }
type GiftAccount = { id: string; ownerLabel: string; bankName?: string; accountNumber?: string; qrMediaId: string | null }
```

Event reference phải cùng wedding và `isPublic=true`. Public renderer nhận projection trong snapshot, không tự gọi API bằng ID.

## 3. Validation baseline

- Tên `1..80`; SEO title `1..70`; description `1..180`.
- Announcement/footer tối đa `600`; biography/story body tối đa `1200` ký tự/item.
- Story tối đa `12`; gallery `40`; schedule `30`; FAQ/travel `20`; party tối đa `8` group × `20` member.
- URL chỉ nhận `https:`; cấm `javascript:`, data URL và embed HTML.
- Required section phải đủ content; optional section bật nhưng rỗng phải báo lỗi hoặc được tắt.
- Media/OG/QR thuộc wedding và READY; music ACTIVE hoặc đã được snapshot pin hợp lệ.

## 4. Section/theme config

```ts
type WeddingWebsiteSectionConfigV1 = { enabled: string[]; order: string[] }
type WeddingWebsiteThemeConfigV1 = {
  palette: string
  heroStyle: string
  storyStyle: string
  galleryStyle: string
  typographyScale?: 'COMPACT' | 'BALANCED' | 'AIRY'
  motionLevel?: 'SUBTLE' | 'BALANCED' | 'EXPRESSIVE'
}
```

Không key lạ/trùng; required luôn enabled; visual section xuất hiện đúng một lần trong order; `music` không nằm trong order; anchor giữ vị trí; đổi template phải normalize key.

## 5. `template-config.ts`

Đặt tại `frontend/src/templates/websites/<template-key>/template-config.ts`:

```ts
export const templateConfig = {
  templateKey: 'editorial-vows',
  displayName: 'Editorial Vows',
  productType: 'WEDDING_WEBSITE',
  templateVersion: '1.0.0',
  templateConfigVersion: 1,
  contentSchemaVersion: 1,
  rendererApiVersion: 1,
  previewPath: '/templates/websites/editorial-vows/preview',
  description: 'Website editorial với love-story chapters.',
  capabilities: { commonRsvp: true, guestbook: true, backgroundMusic: true, seo: true },
  theme: {
    palettes: ['ivory-copper', 'ink-rose'],
    heroStyles: ['full-bleed-editorial', 'split-portrait'],
    storyStyles: ['sticky-chapters', 'alternating-timeline'],
    galleryStyles: ['editorial-grid', 'contact-sheet'],
    default: { palette: 'ivory-copper', heroStyle: 'full-bleed-editorial', storyStyle: 'sticky-chapters', galleryStyle: 'editorial-grid', typographyScale: 'BALANCED', motionLevel: 'BALANCED' },
  },
  sections: [
    { sectionKey: 'navigation', label: 'Điều hướng', required: true, canToggle: false, canReorder: false },
    { sectionKey: 'hero', label: 'Trang mở đầu', required: true, canToggle: false, canReorder: false },
    { sectionKey: 'announcement', label: 'Lời báo tin', required: true, canToggle: false, canReorder: false },
    { sectionKey: 'couple', label: 'Cặp đôi', required: true, canToggle: false, canReorder: true },
    { sectionKey: 'story', label: 'Chuyện chúng mình', canToggle: true, canReorder: true },
    { sectionKey: 'events', label: 'Sự kiện', required: true, canToggle: false, canReorder: true },
    { sectionKey: 'countdown', label: 'Đếm ngược', canToggle: true, canReorder: true },
    { sectionKey: 'venues', label: 'Địa điểm', required: true, canToggle: false, canReorder: true },
    { sectionKey: 'gallery', label: 'Album ảnh', canToggle: true, canReorder: true },
    { sectionKey: 'schedule', label: 'Lịch trình', canToggle: true, canReorder: true },
    { sectionKey: 'weddingParty', label: 'Người đồng hành', canToggle: true, canReorder: true },
    { sectionKey: 'dressCode', label: 'Dress code', canToggle: true, canReorder: true },
    { sectionKey: 'travel', label: 'Di chuyển và lưu trú', canToggle: true, canReorder: true },
    { sectionKey: 'faq', label: 'FAQ', canToggle: true, canReorder: true },
    { sectionKey: 'rsvp', label: 'Xác nhận tham dự', canToggle: true, canReorder: true },
    { sectionKey: 'guestbook', label: 'Lời chúc', canToggle: true, canReorder: true },
    { sectionKey: 'gift', label: 'Mừng cưới', canToggle: true, canReorder: true },
    { sectionKey: 'footer', label: 'Kết trang', required: true, canToggle: false, canReorder: false },
    { sectionKey: 'music', label: 'Nhạc nền', canToggle: true, canReorder: false },
  ],
} as const
```

Implementation thật bổ sung field definitions/max item. `previewPath` phải là route nội bộ đã đăng ký và render đúng version.

## 6. Fixture và release

Mỗi template có `fixture.ts` gồm content v1, event/media projection, theme và section config. Dùng dữ liệu hư cấu, asset có nguồn/license và biến thể thiếu ảnh/tên dài/nhiều event/section tắt; không dùng fixture làm wedding thật. Media đại diện cho slot user upload phải dùng ảnh cưới/cặp đôi hợp lý: một fixture giữ cùng một cặp đôi hư cấu xuyên các chapter, còn toàn catalog đa dạng cặp đôi, dáng chụp, trang phục, bối cảnh và ánh sáng. Không dùng decor, phong cảnh/vật thể ngẫu nhiên hoặc ảnh không liên quan để lấp hero/couple/story/gallery.

Release bundle dùng `productType: 'WEDDING_WEBSITE'` và integer contract versions. Config JSON chứa `previewPath`, sections, theme options, capabilities. Cùng key/version nhưng đổi config phải thất bại; breaking change tăng version và có migration.

