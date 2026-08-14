# Website cưới

Media người dùng là lớp nội dung và có thể hoàn toàn không chứa hình ảnh theo chủ đề. Vì vậy nhận diện của mỗi theme phải do renderer sở hữu thông qua palette, typography, photo frame, ornament, section divider, texture và ambient scene; cần thử thay toàn bộ fixture bằng ảnh trung tính trước khi release.

Khi authoring theme, cần thiết kế cả phần chuyển tiếp giữa các section chứ không chỉ từng section riêng lẻ. Hai chapter liên tiếp phải được audit như một composition chung: crop ảnh, nền, ánh sáng, texture và decor tại seam cần nối tự nhiên; không để đường cắt ngang làm mất cảm giác liền mạch của trải nghiệm scroll.

`Cherry Blossom Garden Wedding` v1.0.0 tại `/templates/websites/cherry-blossom-garden/preview` là theme khu vườn anh đào điện ảnh: hero full-screen nhiều lớp, cành hoa mở màn, petal field, sương, tia nắng và parallax foreground/background. Bảng màu sakura, ivory, kem và xanh non tiếp tục qua couple, story, event, gallery và RSVP; mobile giảm lớp trang trí, còn reduced motion giữ một composition tĩnh hoàn chỉnh.

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

`Green Hydrangea Wedding` v1.0.0 tại `/templates/websites/green-hydrangea/preview` dùng sage/olive pastel, nền giấy kem và watercolor hydrangea. Hero layered-memory, portrait đôi tách biệt, story alternating, gallery ba nhịp và botanical corner tạo cảm giác vườn cưới nhẹ nhàng nhưng không thưa nội dung. Motion chỉ gồm reveal, hover scale nhẹ và cánh hoa thưa; mobile giảm lớp trang trí, reduced motion tắt toàn bộ chuyển động tự chạy.

Với mọi website template có chủ đề cụ thể, media do user upload chỉ là content và không được gánh nhận diện chính. Theme phải giữ signature rõ khi ảnh trống hoặc bị thay hoàn toàn, thông qua hệ màu, type, botanical/ornament frame, section divider, texture và composition thuộc renderer.

`Enchanted Forest Wedding` v1.0.0 tại `/templates/websites/enchanted-forest/preview` dùng forest/moss/olive/wood/ivory và hero diorama 2.5D. Nhận diện độc lập với media user gồm scene rừng, cổ thụ tiền cảnh, canopy garland, vine wreath, fern sprites, sương, tia nắng và hạt bụi; champagne/vows props tạo nhịp section. Hero dùng memory portal dạng vòm với các lớp ảnh ở nhiều trục Z; album dùng carousel 3D có điều khiển trước/sau và pause, tự chuyển mỗi 5 giây. Parallax chỉ tập trung ở hero, các motion hỗ trợ dùng transform/opacity và chuyển thành bố cục tĩnh theo reduced motion.

Ba preview website hiện dùng cùng section metadata contract; countdown của từng theme cập nhật theo thời gian thực và mọi artwork được kiểm tra tồn tại trong asset bundle trước khi phát hành.
