# A Beautiful Day

Website cưới nhẹ nhàng với nền trắng ngà và be, chữ nâu ấm, ảnh cưới làm trung tâm và floristry Phase 2.5 đã duyệt dùng tiết chế ở cuối trang. Renderer giữ tên, ngày cưới, sự kiện và các thao tác trong HTML.

- Trạng thái: `draft`, phiên bản `0.1.0`, `productType: WEDDING_WEBSITE`.
- Phase 1–5 đã hoàn tất ở mức triển khai; trạng thái vẫn draft để chờ media alt-text projection và phát hành template version qua backend.
- [Mở preview](http://localhost:5173/templates/websites/a-beautiful-day/preview).

## Mã nguồn

| File | Vai trò |
| --- | --- |
| `ABeautifulDayWebsite.tsx` | Renderer, section order/toggle, nội dung và fallback |
| `ABeautifulDayBotanical.tsx` | SVG botanical legacy, hiện không được renderer dùng |
| `ABeautifulDayGallery.tsx` | Lưới ảnh, lightbox, bàn phím và quản lý focus |
| `ABeautifulDayCountdown.tsx` | Countdown độc lập, dừng timer khi tab ẩn hoặc kết thúc |
| `ABeautifulDayForm.tsx` / `ABeautifulDayMusic.tsx` | RSVP/lời chúc qua public adapters và playback nhạc sau thao tác người dùng |
| `content.ts` / `fixture.ts` | Kiểu dữ liệu và dữ liệu minh họa |
| `template-config.ts` | Metadata, theme, section và editor fields |
| `motion.ts` | Motion token, entrance, scroll depth và lifecycle |
| `a-beautiful-day.css` | Bố cục, responsive, decor và hiệu ứng |
| `ABeautifulDayWebsite.test.tsx` / `motion.test.tsx` | Regression và lifecycle tests |
| `calendar.ts` | Tạo lịch sự kiện `.ics` theo RFC 5545 |

Renderer nhận `data`, `sectionConfig`, `themeConfig` và `editorMode`. Có 19 section keys, gồm 18 section trực quan và nhạc nền toàn trang. Editor, reduced motion và trình duyệt thiếu IntersectionObserver giữ nội dung tĩnh; mobile dùng cuộn tự nhiên.

## Ảnh và tài liệu

- Renderer dùng floral artwork v02, v03, v04, v05, v06, single blossom và ba lồng đèn đã duyệt ở Phase 2.5. Lồng đèn được ghim cố định trên mép đầu trang, opacity/blur phân lớp; rèm vẫn không dùng theo art direction hiện tại.
- [Hai bản nháp được lưu trữ](../../../../../assets/templates/a-beautiful-day/archive/); chúng không được renderer sử dụng.
- [Artwork brief và prompt](../../../../../docs/frontend/wedding-websites/a-beautiful-day/artwork-brief.md).
- [Preview bộ artwork đã duyệt](../../../../../docs/frontend/wedding-websites/a-beautiful-day/artwork-preview.md).
- [Asset manifest và provenance](../../../../../docs/frontend/wedding-websites/a-beautiful-day/asset-manifest.md).
- [Phase 1 — Theme brief](../../../../../docs/frontend/wedding-websites/a-beautiful-day/phase-1-theme-brief.md).
- [Phase 2 — Media contract](../../../../../docs/frontend/wedding-websites/a-beautiful-day/phase-2-media-contract.md).
- [Phase 3 — Section architecture](../../../../../docs/frontend/wedding-websites/a-beautiful-day/phase-3-section-architecture.md).
- [Phase 4 — Motion và kết quả kiểm chứng](../../../../../docs/frontend/wedding-websites/a-beautiful-day/phase-4-motion-experience.md).
- [Phase 5 — Release review](../../../../../docs/frontend/wedding-websites/a-beautiful-day/phase-5-release-review.md).

Thư mục source chỉ giữ mã nguồn, tests và README này. Ảnh reference MinIO phục vụ phân tích đã được xóa sau khi hoàn tất thiết kế; thông tin vai trò còn được ghi trong theme brief.

## Kiểm tra

Chạy từ thư mục gốc repository:

```powershell
npm --prefix frontend run test -- --run src/templates/websites/a-beautiful-day/ABeautifulDayWebsite.test.tsx src/templates/websites/a-beautiful-day/motion.test.tsx src/templates/countdown-render-boundary.test.ts
npm --prefix frontend run typecheck
npm --prefix frontend run lint
npm --prefix frontend run build
```

Kết quả Phase 4 ngày 23/10/2026: 19 template/lifecycle tests, 20 countdown ownership tests và 17 kịch bản trình duyệt đạt. Typecheck, lint và build đạt; build vẫn có cảnh báo bundle lớn đã ghi trong tài liệu Phase 4.

## Phần còn lại trước phát hành

Phase 5 đã nối RSVP/lời chúc qua public interaction hooks, music catalog playback sau thao tác người dùng, metadata SEO từ snapshot, lịch ICS và editor preview bridge. Artwork lossless WebP giảm 74.4%; alpha được đối chiếu chính xác và contact sheet đã rà trên nền sáng/tối. Release review còn ghi rõ các blocker media projection bên dưới.

## Visual revision — 2026-10-30

The current hero uses a clean double-line paper frame around the portrait, with both names over the lower image on a dark fade. Approved Phase 2.5 crescent (v04) and cascade (v06) floristry frame opposite corners.

Ngày 2026-10-30, toàn trang dùng một nền be ngà pha vàng phấn liên tục, các section trong suốt và không chia dải nền. Hero chỉ có tên cô dâu/chú rể và ảnh. Heading dùng Cormorant Garamond local, body dùng Nunito Sans local. Năm vị trí lồng đèn từ ba artwork Phase 2.5 được phóng lớn, có dây treo rõ và ghim phía trên; opacity/blur phân lớp tạo chiều sâu. Toàn bộ điểm nhấn theo sắc giấy ngà và vàng mật ong. Hoa đã duyệt tạo decor mỗi chapter; reduced-motion/editor giữ trạng thái tĩnh. Không tạo artwork mới. Chi tiết tại [Phase 5 visual review](../../../../../docs/frontend/wedding-websites/a-beautiful-day/phase-5-release-review.md).
