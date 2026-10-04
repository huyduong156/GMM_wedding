# ADR 0010: Template source lifecycle và preview access

- Status: Accepted
- Date: 2026-08-16
- Amended by: [ADR 0014](./0014-template-major-ui-and-mutable-revision.md) for mutable patch/minor revisions within one UI major.

## Context

Template source cần có giai đoạn development/review trước khi admin release, nhưng catalog/public preview không được làm lộ template chưa hoàn tất.

## Decision

Platform admin chủ động gọi template sync. Release bundle bỏ qua source `development`, sync `review`, `ready` và `deprecated`. Chỉ source `ready` mới được release. Theo amendment ADR 0014, patch/minor tương thích cập nhật cùng row đã release để user hiện hữu nhận bugfix; major UI mới mới tạo row mới.

Preview trước release là admin-only qua authenticated preview surface/token. Public preview chỉ được mở cho version released.

## Consequences

- Admin có thể xem và feedback template review mà không phát hành nhầm.
- Backend phải lưu source status trên TemplateVersion và enforce release gate.
- Preview route không được xem là public chỉ vì có `previewPath`; authorization phải nằm ở server/API.
- Legacy config không có status được coi là `review` trong giai đoạn chuyển tiếp.
