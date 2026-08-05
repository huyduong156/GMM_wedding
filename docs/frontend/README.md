# Frontend documentation

Tài liệu trong folder này thuộc ứng dụng React + Vite tại `frontend/`.

## Đọc trước khi làm frontend

1. [System architecture](../shared/architecture/system-architecture.md) để hiểu boundary FE–BE và publish snapshot.
2. [Engineering guidelines](../shared/engineering-guidelines.md) cho quy ước chung.
3. Tài liệu UI/template tương ứng bên dưới.

## Danh mục

- [Frontend authentication integration](./authentication-integration.md): API login, opaque session, route guard và logout cho owner/admin.

- [Admin và editor UI/UX](./admin-editor-ui-ux.md)
- [Thư viện hiệu ứng trải nghiệm cưới](./experience-effects-reference.md)
- [Catalog section và layout thiệp online](./online-invitations/section-layout-catalog.md)
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
