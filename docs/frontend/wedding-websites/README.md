# Website cưới

Website cưới là một website công khai duy nhất cho mỗi wedding, dùng để kể câu chuyện của cặp đôi, giới thiệu lịch trình, địa điểm, album và cung cấp RSVP/lời chúc chung. Đây là publication surface riêng với `productType = WEDDING_WEBSITE`; không dùng template selection, slug hoặc snapshot của thiệp online.

Website cưới tái sử dụng template versioning, live-editor bridge và publication snapshot, nhưng có content schema và renderer riêng. Template là React code đã review; admin sync release bundle rồi kiểm duyệt/phát hành.

## Tài liệu

1. [Catalog section và layout](./section-layout-catalog.md) — blueprint bắt buộc cho mọi mẫu.
2. [Content và template config](./content-and-template-config-contract.md) — payload, validation, section/theme config và config mẫu.
3. [Checklist tạo template](./template-authoring-checklist.md) — authoring, test và release gate.
4. [Live template editor](../live-template-editor.md) — iframe bridge và preview device.
5. [Thư viện hiệu ứng](../experience-effects-reference.md) — motion/performance dùng chung.

## Ranh giới

| Bề mặt | Mục tiêu | Nội dung nổi bật |
|---|---|---|
| Thiệp online | Nhận và mở lời mời | Gia đình, nghi lễ, lời kính mời cá nhân |
| Website cưới | Website chung trước/trong lễ cưới | Story, album, lịch trình, RSVP chung và SEO |
| Wedding Recap | Kể lại sau sự kiện | Highlight, ảnh/video và lời chúc đã chọn |

Website cưới không bắt buộc opening phong bì và không chứa PII khách trong snapshot. Section key, content key và `data-editor-section` phải ánh xạ `1:1`; canonical content tách khỏi `themeConfig`/`sectionConfig`; event/media dùng reference được authorize; publish pin chính xác `templateVersionId` vào snapshot bất biến.

## Template hiện có

`Editorial Vows` v1.0.0 là mẫu đầu tiên tại `/templates/websites/editorial-vows/preview`. Art direction dùng porcelain/cobalt lạnh, hero split editorial, sticky-like story chapters, gallery contact sheet và motion phân bố xuyên trang. Reveal dùng vùng kích hoạt trễ gần giữa viewport để khách kịp nhìn chuyển động; mobile giảm cỡ chữ/section spacing, giữ mật độ thông tin vừa phải và chuyển mọi layout về native vertical scroll. Bộ decor nguyên bản gồm anthurium porcelain, ribbon cobalt, chrome bead, photo rail và geometric orbit; ambient animation chạy độc lập với reveal nhưng bị giảm/tắt theo mobile và `prefers-reduced-motion`.
