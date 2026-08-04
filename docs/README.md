# GMM Wedding - Tài liệu dự án

`docs/` là source of truth của dự án và được chia theo **ownership** để tránh nhầm lẫn khi triển khai hai ứng dụng độc lập.

## Chọn đúng vùng tài liệu

| Vùng | Dùng khi | Không đặt ở đây |
|---|---|---|
| [`frontend/`](./frontend/README.md) | React/Vite, UI/UX, routing phía client, template renderer, animation, accessibility giao diện | API contract, database schema, backend authorization |
| [`backend/`](./backend/README.md) | Next.js API, data model, auth/authorization, security, operations, persistence | Component/layout/motion thuần frontend |
| [`shared/`](./shared/README.md) | Product scope, end-to-end flow, contract FE–BE, system architecture, roadmap, ADR và workflow chung | Chi tiết implementation chỉ thuộc một app |

Quy tắc quyết định: nếu thay đổi buộc cả frontend và backend phải phối hợp hoặc cùng hiểu một contract, tài liệu gốc nằm ở `shared/` và tài liệu FE/BE chỉ dẫn chiếu hoặc mô tả implementation riêng.

## Bắt đầu nhanh

- Làm frontend: đọc [Frontend docs](./frontend/README.md), [system architecture](./shared/architecture/system-architecture.md) và tài liệu product liên quan.
- Làm backend: đọc [Backend docs](./backend/README.md), [system architecture](./shared/architecture/system-architecture.md), [data model](./backend/data-model.md) và [API design](./backend/api-design.md).
- Tạo template thiệp mới: bắt đầu tại [catalog section và layout](./frontend/online-invitations/section-layout-catalog.md).
- Thay đổi contract publish/template hoặc luồng xuyên hệ thống: đọc [system architecture](./shared/architecture/system-architecture.md) và [ADR](./shared/architecture/adr/README.md).
- Kiểm tra mức độ hoàn thiện: xem [documentation status](./shared/project/documentation-status.md).

## Cấu trúc

```text
docs/
  README.md
  frontend/
    README.md
    admin-editor-ui-ux.md
    experience-effects-reference.md
    online-invitations/
      section-layout-catalog.md
      typography-and-fonts.md
      motion/
      visual-styles/
  backend/
    README.md
    api-design.md
    data-model.md
    security-and-operations.md
  shared/
    README.md
    engineering-guidelines.md
    product/
    architecture/
      system-architecture.md
      adr/
    workflows/
    project/
```

## Quy tắc cập nhật

- Thay đổi code có ảnh hưởng sản phẩm phải cập nhật tài liệu liên quan trong cùng change.
- Contract request/response nằm ở backend API docs; ý nghĩa nghiệp vụ và end-to-end flow nằm ở shared docs.
- Frontend-only branch không sửa `backend/` hoặc `docs/backend/`; backend-only branch không sửa `frontend/`, `docs/frontend/` hoặc `design-system/`. Cả hai chỉ chạm `docs/shared/` khi contract xuyên hệ thống thực sự thay đổi.
- Quyết định kiến trúc dài hạn ghi tại `shared/architecture/adr/`.
- Khi đổi tên hoặc di chuyển file, cập nhật README của vùng, README root, `.agents/PROJECT_CONTEXT.md`, `AGENTS.md` và mọi liên kết chéo.
- Không đưa secret, token, dữ liệu khách mời thật, database dump hoặc asset không rõ quyền vào tài liệu/mã nguồn.
