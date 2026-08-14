# Catalog section và layout cho website cưới

## 1. Nguyên tắc

Website cưới là landing page dài, mobile-first. Nhịp đọc mặc định: cặp đôi → ngày cưới → câu chuyện → sự kiện/địa điểm → album → hướng dẫn khách → RSVP/lời chúc → kết trang. Template được đổi art direction và layout nhưng không đổi ý nghĩa semantic. Section tùy chọn khi tắt phải rời DOM và không để khoảng trống.

## 2. Section contract

| Key | Section | Default | Rule | Nội dung |
|---|---|---:|---|---|
| `navigation` | Điều hướng | Bật | Required, anchor đầu | Monogram, anchor section đang bật, CTA RSVP |
| `hero` | Hero | Bật | Required, anchor đầu | Tên, ngày cưới, địa điểm tóm tắt, key visual |
| `announcement` | Lời báo tin | Bật | Required, anchor đầu | Thông điệp chung, không cá nhân hóa khách |
| `couple` | Cặp đôi | Bật | Required, reorder | Profile, ảnh, giới thiệu, social link opt-in |
| `story` | Hành trình tình yêu | Bật | Optional, reorder | Chapter/milestone ngày, tiêu đề, nội dung, media |
| `events` | Sự kiện | Bật | Required, reorder | Event công khai, giờ, địa điểm, thêm lịch |
| `countdown` | Đếm ngược | Bật | Optional, reorder | Đếm tới primary event, không số âm |
| `venues` | Địa điểm | Bật | Required, reorder | Địa chỉ text, map link, hướng dẫn di chuyển |
| `gallery` | Album | Bật | Optional, reorder | Media READY, alt/focal point, lightbox/control |
| `schedule` | Chương trình | Bật | Optional, reorder | Đón khách, nghi lễ, khai tiệc và mốc tùy chỉnh |
| `weddingParty` | Người đồng hành | Tắt | Optional, reorder | Nhóm, vai trò, tên, ảnh; không lấy guest list |
| `dressCode` | Dress code | Tắt | Optional, reorder | Phong cách, palette, ghi chú |
| `travel` | Di chuyển/lưu trú | Tắt | Optional, reorder | Khách sạn, phương tiện, đậu xe, link ngoài |
| `faq` | FAQ | Tắt | Optional, reorder | Câu hỏi/trả lời vận hành ngày cưới |
| `rsvp` | RSVP | Bật | Optional nhưng phải hỗ trợ | Form common URL và đầy đủ trạng thái gửi |
| `guestbook` | Lời chúc | Bật | Optional nhưng phải hỗ trợ | Lời chúc đã duyệt và form public |
| `gift` | Mừng cưới | Tắt | Optional nhưng phải hỗ trợ | Nội dung/QR do user chủ động công khai |
| `footer` | Kết trang | Bật | Required, anchor cuối | Lời cảm ơn, monogram, ngày cưới |
| `music` | Nhạc nền | Tắt | Global, không reorder | `musicTrackId`, autoplay và control toàn cục |

`navigation`, `hero`, `announcement` giữ đầu; `footer` luôn cuối. Section khác không đi xuyên anchor. `music` có card editor nhưng không nằm trong `sectionConfig.order`.

## 3. Layout vocabulary

| Section | Option chuẩn |
|---|---|
| Navigation | `transparent-overlay`, `compact-sticky`, `editorial-index`, `bottom-mobile-dock` |
| Hero | `full-bleed-editorial`, `split-portrait`, `layered-memory`, `typographic-minimal`, `cinematic-poster` |
| Announcement | `centered-letter`, `editorial-lead`, `framed-note`, `split-quote` |
| Couple | `dual-portraits`, `overlapping-profiles`, `editorial-biography`, `monogram-no-photo` |
| Story | `alternating-timeline`, `sticky-chapters`, `chapter-cards`, `horizontal-memory-rail`, `map-journey` |
| Events | `event-cards`, `date-tabs`, `editorial-program`, `calendar-panels` |
| Countdown | `four-unit-grid`, `inline-editorial`, `flip-clock`, `circular-dials` |
| Venues | `map-split`, `venue-cards-over-map`, `multi-venue-tabs`, `illustrated-directions` |
| Gallery | `editorial-grid`, `masonry`, `contact-sheet`, `film-strip`, `horizontal-snap`, `lightbox-grid` |
| Schedule | `vertical-timeline`, `step-cards`, `horizontal-program`, `accordion-agenda` |
| Wedding party | `portrait-grid`, `role-groups`, `editorial-roster`, `stacked-cards` |
| Dress code | `palette-cards`, `editorial-note`, `fabric-swatches`, `minimal-rule` |
| Travel | `information-cards`, `map-and-stay`, `accordion-guide`, `editorial-directory` |
| FAQ | `accordion`, `two-column-list`, `topic-tabs` |
| RSVP | `single-card-form`, `split-form-photo`, `step-form`, `sticky-cta-sheet` |
| Guestbook | `featured-plus-list`, `message-grid`, `stacked-notes`, `controlled-carousel` |
| Gift | `accordion-private`, `modal-reveal`, `qr-cards`, `minimal-bank-card` |
| Footer | `closing-letter`, `full-bleed-farewell`, `monogram-footer`, `minimal-credits` |

Mỗi template specification phải chọn một option, lý do chọn và mobile/reduced-motion fallback cho từng section.

## 4. Motion, responsive và lỗi

- Chọn một focal interaction ở hero, story hoặc gallery; không chồng nhiều scroll effect mạnh.
- Sticky/parallax desktop chuyển thành vertical cards/native scroll trên mobile.
- Navigation chỉ sinh anchor đang bật; current state không chỉ dựa vào màu.
- Countdown vẫn chính xác dưới reduced motion nhưng bỏ animation.
- Map luôn có địa chỉ text và link khi embed lỗi.
- Test 375px, 768px, 1280px và màn rộng; không horizontal overflow.
- Thiếu ảnh dùng composition typography hoàn chỉnh; video có poster; tối đa một canvas/WebGL lazy-load.
- Test event đã qua, RSVP hết hạn, media chưa READY, section rỗng/tắt, rate limit/offline và autoplay bị chặn.

## 5. Privacy và SEO

- Snapshot không chứa guest list, invite token, contact riêng hoặc media chưa READY.
- Gift opt-in, không log dữ liệu tài khoản và không dùng dữ liệu thật trong fixture.
- Có title, description, canonical URL, OG image và đúng một `h1`.
- Ảnh có alt; decoration dùng alt rỗng; lời chúc public chỉ lấy bản đã duyệt.

