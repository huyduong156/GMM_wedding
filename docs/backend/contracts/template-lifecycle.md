# Template source lifecycle và release contract

## Source status

`template-config.ts` có thể khai báo `status`:

- `development`: backend chỉ dùng metadata để reconcile khi admin gọi sync, không tạo version/catalog mới. Preview draft không được public; preview admin phải đi qua admin authentication.
- `review`: được sync vào catalog để admin xem metadata/preview và ghi feedback. Chưa được release.
- `ready`: dev xác nhận hoàn tất; version được phép phát hành nếu compatibility hợp lệ.
- `deprecated`: source ngừng phân phối; sync ghi nhận trạng thái để admin đóng public preview và giữ lịch sử.

Nếu source chưa khai báo `status`, scanner tương thích legacy bằng cách coi là `review`.

## Sync

`POST /api/admin/templates/sync` là thao tác chủ động của platform admin. Backend scan metadata source để reconcile, nhưng bỏ qua `development` khi tạo/cập nhật catalog visible; không có background scan tự động.

Release bundle của mỗi template phải có `sourceStatus` là `REVIEW`, `READY` hoặc `DEPRECATED`. Backend lưu source status trên `TemplateVersion`.

## Release invariant

- Chỉ `READY` mới được gọi release.
- Config contract phải tương thích runtime.
- Version đã release/deprecated là immutable; thay đổi mới phải tạo version mới.
- `REVIEW` chỉ để xem/feedback và không được release.
- Source `DEPRECATED` không được release lại.

## Public preview

Preview draft/review/ready trước release không phải public surface; public renderer chỉ được mở khi version đã `RELEASED`. Admin preview phải yêu cầu platform-admin session/token và chạy sandbox. Việc mở preview URL không thay thế authorization ở backend.

## Error codes

- `TEMPLATE_SOURCE_NOT_READY` — source status chưa phải `READY`.
- `TEMPLATE_VERSION_IMMUTABLE` — cố thay đổi version đã immutable.
- `TEMPLATE_VERSION_INCOMPATIBLE` — config/contract không được runtime hỗ trợ.