# ADR 0010: Template source lifecycle và preview access

- Status: Accepted
- Date: 2026-08-16

## Context

Template source cần có giai đoạn development/review trước khi admin release, nhưng catalog/public preview không được làm lộ template chưa hoàn tất.

## Decision

Platform admin chủ động gọi template sync. Scanner bỏ qua source `development`, sync `review`, `ready` và `deprecated`. Chỉ source `ready` mới được release. Version sau khi released hoặc deprecated là immutable; chỉnh sửa tạo version mới.

Preview trước release là admin-only qua authenticated preview surface/token. Public preview chỉ được mở cho version released.

## Consequences

- Admin có thể xem và feedback template review mà không phát hành nhầm.
- Backend phải lưu source status trên TemplateVersion và enforce release gate.
- Preview route không được xem là public chỉ vì có `previewPath`; authorization phải nằm ở server/API.
- Legacy config không có status được coi là `review` trong giai đoạn chuyển tiếp.