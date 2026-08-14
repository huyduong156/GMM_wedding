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
- Editor thiệp tại `/studio/invites` có điều hướng trực tiếp từ theme đang dùng, sinh section/form từ template config, tải/lưu content, palette và section config qua Wedding Content API với manual save, dirty-state baseline, cảnh báo lưu khi rời trang và revision conflict protection. Renderer thật đồng bộ live trong iframe cùng origin không reload; full preview, publish/unpublish và kiểm tra slug dùng API thật. Upload ảnh và catalog nhạc được theo dõi như phạm vi triển khai riêng.
- Hồ sơ tài khoản owner tại `/studio/profile` dùng `GET/PATCH /api/me`, cho phép cập nhật tên hiển thị, số điện thoại, ảnh đại diện, ngôn ngữ và múi giờ; email chỉ đọc.
- Ngày hiển thị trong Wedding workspace dùng formatter chung `DD/MM/YYYY`; ngày-giờ dùng `DD/MM/YYYY · HH:mm`. Form tạo event bỏ các field optional để trống khỏi payload; chỉ gửi `null` khi update nhằm xóa giá trị đã tồn tại.

- [Admin và editor UI/UX](./admin-editor-ui-ux.md)
- [Nền live template editor dùng chung](./live-template-editor.md)
- [Nhạc nền cưới: admin catalog, owner editor và guest playback](./wedding-background-music.md)
- [Shared runtime cho public theme: mobile first-load auto-scroll, music control và fixture media](./public-theme-runtime-behaviors.md)
- [Theme authoring compliance: required-reading manifest, strong-subject decor gate và preflight/postflight](./theme-authoring-compliance.md)
- [Thư viện hiệu ứng trải nghiệm cưới](./experience-effects-reference.md)
- [Catalog section và layout thiệp online](./online-invitations/section-layout-catalog.md)
- [Website cưới: section, content/config contract và authoring checklist](./wedding-websites/README.md)
- [Typography và font cưới](./online-invitations/typography-and-fonts.md)
- [Motion catalog](./online-invitations/motion/README.md)
- [Visual style catalog](./online-invitations/visual-styles/README.md)

Design system implementation vẫn dùng [`design-system/MASTER.md`](../../design-system/MASTER.md) và override tương ứng trong `design-system/pages/`.

## Boundary

- Ghi ở đây: component contract, layout, state hiển thị, client navigation, accessibility UI, responsive và performance trình duyệt.
- Không định nghĩa lại DTO/API hoặc persistence schema.

## Quy tắc tránh conflict với nhánh backend

- Task hoặc branch chỉ làm frontend không được sửa `backend/` hoặc `docs/backend/`.
- Tài liệu implementation frontend chỉ cập nhật trong `docs/frontend/` và `design-system/` khi phù hợp.
- Chỉ sửa `docs/shared/` khi frontend thực sự thay đổi contract FE–BE, end-to-end flow hoặc quyết định kiến trúc dài hạn; diff phải nhỏ và rõ phạm vi.
- Nếu frontend cần API/contract mới, ghi yêu cầu trong frontend issue/spec hoặc shared contract tối thiểu và để nhánh backend triển khai phần server riêng.
