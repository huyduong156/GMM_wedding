# Frontend documentation

Tài liệu trong folder này thuộc ứng dụng React + Vite tại `frontend/`.

## Đọc trước khi làm frontend

1. [System architecture](../shared/architecture/system-architecture.md) để hiểu boundary FE–BE và publish snapshot.
2. [Engineering guidelines](../shared/engineering-guidelines.md) cho quy ước chung.
3. Tài liệu UI/template tương ứng bên dưới.

## Danh mục

- [Frontend authentication integration](./authentication-integration.md): API login, opaque session, route guard và logout cho owner/admin.
- Owner Wedding workspace đã nối Wedding base API: danh sách/chuyển wedding, onboarding tạo wedding đầu tiên, dashboard read model, CRUD lễ-tiệc tại `/studio/events` và cài đặt metadata/lifecycle tại `/studio/settings`. Wedding và event mutation gửi `revision`; conflict `409` yêu cầu tải lại dữ liệu thay vì ghi đè.
- Kho giao diện owner tại `/studio/invites/themes` và `/studio/site/themes` đã nối template catalog/content API theo wedding hiện hành: tải template theo product type, hiển thị version đang dùng và áp dụng template bằng optimistic revision. Loading, empty, error/retry và refresh khi revision conflict đã có.
- Khu vực public có trang chủ, thư viện giao diện theo ba loại, trang cách hoạt động và trang hỏi đáp tại `/faq`; trang hỏi đáp giới thiệu các tính năng người dùng được sử dụng và trả lời những câu hỏi phổ biến trước khi bắt đầu.
- Wedding workspace giữ role theo wedding (`OWNER`, `EDITOR`, `VIEWER`) trong context. Viewer chỉ thấy dữ liệu và action xem/preview; CTA tạo, sửa, xóa, kiểm duyệt, áp dụng giao diện và entry editor phải được ẩn ở frontend. Backend vẫn là lớp phân quyền cuối cùng.
- Editor thiệp tại `/studio/invites` có điều hướng trực tiếp từ theme đang dùng, sinh section/form từ template config, tải/lưu content, palette và section config qua Wedding Content API với manual save, dirty-state baseline, cảnh báo lưu khi rời trang và revision conflict protection. Renderer thật đồng bộ live trong iframe cùng origin không reload; full preview, publish/unpublish và kiểm tra slug dùng API thật. Upload ảnh và catalog nhạc được theo dõi như phạm vi triển khai riêng.
- Hồ sơ tài khoản owner tại `/studio/profile` dùng `GET/PATCH /api/me`, cho phép cập nhật tên hiển thị, số điện thoại, ảnh đại diện, ngôn ngữ và múi giờ; email chỉ đọc. Ảnh đại diện được chọn từ kho ảnh của wedding đang active qua media manager.
- Kho ảnh wedding tại `/studio/media` dùng các media endpoint hiện có để liệt kê, upload và xóa ảnh; khi đổi wedding, danh sách kho ảnh và phạm vi thao tác đổi theo wedding mới. Khi upload nhiều ảnh, kho ảnh và modal chọn ảnh hiển thị spinner cùng tiến độ `x/y` theo từng ảnh; cập nhật tiến độ chỉ render lại vùng upload, giữ lưới ảnh ổn định. Kho ảnh và modal chọn ảnh trong editor cùng có nút xem ảnh lớn, chuyển ảnh bằng nút/mũi tên bàn phím và chỉnh ảnh qua `react-filerobot-image-editor` (v4.9.1, chỉ bật tab Adjust và mở công cụ Crop mặc định). Ảnh đã chỉnh giữ độ phân giải canvas vùng crop; JPEG xuất ở chất lượng 95%, PNG giữ lossless. Ảnh WebP xuất thành PNG để giữ vùng trong suốt. Các công cụ nâng cao dùng cùng editor khi được bật sau này. Ảnh đã chỉnh được upload thành asset mới, giữ ảnh gốc; editor tự chọn asset mới. Quyền VIEWER chỉ được xem ảnh.
- Metadata trang được quản lý tập trung trong `src/shared/lib/page-metadata.ts`: route marketing/studio/admin có title và robots riêng; invitation, website và recap public tự sinh title, description, canonical URL và ảnh Open Graph/Twitter từ publication payload, có fallback logo. Khi deploy cPanel, `public/.htaccess` chuyển request của social crawler qua `public/share-meta.php` để bot không cần chạy JavaScript vẫn nhận đúng metadata.
- Frontend hỗ trợ cài đặt dạng PWA qua `public/manifest.webmanifest`, icon app và service worker tại scope `/`. Service worker chỉ nhận lifecycle để hỗ trợ standalone install, không cache request/API, nội dung thiệp, editor hay asset; HTTPS là điều kiện khi chạy production. Nginx luôn revalidate manifest/service worker để nhận release mới.
- Ngày hiển thị trong Wedding workspace dùng formatter chung `DD/MM/YYYY`; ngày-giờ dùng `DD/MM/YYYY · HH:mm`. Form tạo event bỏ các field optional để trống khỏi payload; chỉ gửi `null` khi update nhằm xóa giá trị đã tồn tại.

- [Admin và editor UI/UX](./admin-editor-ui-ux.md)
- [Nền live template editor dùng chung](./live-template-editor.md)
- [Nhạc nền cưới: admin catalog, owner editor và guest playback](./wedding-background-music.md)
- Trang preview template không có ngày cưới từ dữ liệu dùng mốc demo hiện tại + 69 ngày. Mọi phần ngày cưới hiển thị từ cùng trường dữ liệu (bao gồm lịch, thứ/ngày/tháng/năm và ngày âm được tính từ ngày dương) phải theo cùng mốc; preview có ngày cưới thật thì giữ nguyên ngày đó.
- [Thư viện hiệu ứng trải nghiệm cưới](./experience-effects-reference.md)
- [Common Theme Authoring Contract và quality gate cho mọi theme](./theme-authoring/README.md)
- [Catalog section và layout thiệp online](./online-invitations/section-layout-catalog.md)
- [Website cưới: section, content/config contract và authoring checklist](./wedding-websites/README.md)
- [Typography và font cưới](./online-invitations/typography-and-fonts.md)
- [Motion catalog](./online-invitations/motion/README.md)
- [Visual style catalog](./online-invitations/visual-styles/README.md)

Design system implementation vẫn dùng [`design-system/MASTER.md`](../../design-system/MASTER.md) và override tương ứng trong `design-system/pages/`.

- Todo checklist gợi ý trong MVP là preset static tại rontend/src/pages/todos/checklist-presets.ts; preview chạy ở FE và apply gửi bulk root tasks qua POST /api/weddings/{weddingId}/tasks/bulk. Không có template checklist persistence/admin management ở MVP.

Wedding Recap có contract riêng về semantic content, layout options, optional sections và media replacement tại [Wedding Recap docs](./wedding-recaps/README.md). Layout/art direction tiếp tục tái sử dụng nguyên tắc authoring của invitation và wedding website; code template recap hiện hành chỉ giữ `red-spider-lily` làm baseline theo contract mới.

## Boundary

- Modal chỉnh ảnh của kho media dùng bộ dịch tiếng Việt cho toàn bộ nhãn, tooltip và hộp xác nhận của `react-filerobot-image-editor`; khi bật thêm công cụ của package, tiếp tục giữ bộ dịch này đầy đủ.

- Countdown trong public template phải giữ state/timer ở component đồng hồ riêng (tối đa section countdown nhỏ), không đặt hook cập nhật mỗi giây trong renderer gốc. Tick không được render lại page, calendar, gallery hoặc form bên cạnh. Regression guard: `frontend/src/templates/countdown-render-boundary.test.ts`.

- Ghi ở đây: component contract, layout, state hiển thị, client navigation, accessibility UI, responsive và performance trình duyệt.
- Không định nghĩa lại DTO/API hoặc persistence schema.

## Quy tắc tránh conflict với nhánh backend

- Task hoặc branch chỉ làm frontend không được sửa `backend/` hoặc `docs/backend/`.
- Tài liệu implementation frontend chỉ cập nhật trong `docs/frontend/` và `design-system/` khi phù hợp.
- Chỉ sửa `docs/shared/` khi frontend thực sự thay đổi contract FE–BE, end-to-end flow hoặc quyết định kiến trúc dài hạn; diff phải nhỏ và rõ phạm vi.
- Nếu frontend cần API/contract mới, ghi yêu cầu trong frontend issue/spec hoặc shared contract tối thiểu và để nhánh backend triển khai phần server riêng.
