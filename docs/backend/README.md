# Backend documentation

Tài liệu trong folder này thuộc ứng dụng Next.js API tại `backend/`.

## Đọc trước khi làm backend

1. [System architecture](../shared/architecture/system-architecture.md).
2. [Data model](./data-model.md).
3. [API design](./api-design.md).
4. [Security và operations](./security-and-operations.md).

## Boundary

- Ghi ở đây: API contract, validation, authorization, persistence, migration, jobs, rate limit, observability và runtime operations.
- Không mô tả component/layout/motion thuần frontend.
- Luồng xuyên hệ thống như publish snapshot, invite–RSVP và template versioning phải có source of truth ở shared architecture/ADR; backend docs mô tả phần thực thi phía server.

## Quy tắc tránh conflict với nhánh frontend

- Task hoặc branch chỉ làm backend không được sửa `frontend/`, `docs/frontend/` hoặc `design-system/`.
- Tài liệu implementation backend chỉ cập nhật trong `docs/backend/`.
- Chỉ sửa `docs/shared/` khi backend thực sự thay đổi contract FE–BE, end-to-end flow hoặc quyết định kiến trúc dài hạn; thay đổi phải nhỏ, rõ phạm vi và không kèm chỉnh sửa trình bày không liên quan.
- Nếu backend cần frontend thay đổi theo contract mới, ghi requirement/contract trong backend hoặc shared docs và để nhánh frontend triển khai phần UI riêng.

## Trạng thái

Backend hiện chưa được scaffold đầy đủ. Tài liệu là contract/foundation và không được hiểu là bằng chứng endpoint, migration hoặc security control đã được triển khai.
