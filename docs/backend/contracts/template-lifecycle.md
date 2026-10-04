# Template source lifecycle và release contract

## Source status

`template-config.ts` có thể khai báo `status`:

- `development`: không tạo version/catalog mới. Preview draft không được public; preview admin phải đi qua admin authentication.
- `review`: được sync vào catalog để admin xem metadata/preview và ghi feedback. Chưa được release.
- `ready`: dev xác nhận hoàn tất; version được phép phát hành nếu compatibility hợp lệ.
- `deprecated`: source ngừng phân phối; sync ghi nhận trạng thái để admin đóng public preview và giữ lịch sử.

Nếu source chưa khai báo `status`, generator tương thích legacy bằng cách coi là `review`.

## Sync

`POST /api/admin/templates/sync` là thao tác chủ động của platform admin. Frontend build sinh `template-release-bundle.json` từ source template đang deploy; admin UI tải bundle cùng origin và gửi toàn bộ payload sang backend để validate/reconcile. Backend không đọc filesystem frontend, vì hai app được deploy độc lập.

Request body bắt buộc phải là release bundle hợp lệ. Body rỗng, `{}` hoặc JSON lỗi trả `400 VALIDATION_ERROR`; dependency/runtime bất ngờ mới trả `500 INTERNAL_ERROR`. Admin UI tải bundle với `cache: no-store` để không sync nhầm artifact của bản deploy cũ.

`template-release-bundle.json` là artifact public của frontend. Bundle chỉ được chứa metadata catalog, version/status, section key, preview path, đường dẫn source tương đối và hash một chiều; không được chứa secret, credential, dữ liệu khách mời hoặc nội dung quản trị riêng. Quyền ghi database vẫn nằm ở API Sync có admin session và CSRF, không nằm ở quyền đọc bundle.

Release bundle của mỗi template phải có `sourceStatus` là `REVIEW`, `READY` hoặc `DEPRECATED`. Backend lưu source status trên `TemplateVersion`.

## Release invariant

- Chỉ `READY` mới được gọi release.
- Config contract phải tương thích runtime.
- Một row `TemplateVersion` đại diện một UI major. Sync cùng `templateKey + major` cập nhật patch/minor vào chính row hiện có và giữ nguyên ID; major mới mới tạo row mới.
- Patch/minor đã release được cập nhật tại chỗ để mọi wedding đang dùng UI major đó nhận bugfix tương thích. Sync ghi audit `template.version_updated` với version trước/sau.
- Patch/minor của row đang release chỉ được áp dụng khi source là `READY` và contract vẫn tương thích runtime; `REVIEW` không được đè renderer đang phục vụ user.
- Revision không được giảm. `1.0.2 → 1.0.1` trả `409 TEMPLATE_VERSION_DOWNGRADE`.
- Cùng `templateKey + templateVersion` nhưng content hoặc contract thay đổi trả `409 TEMPLATE_VERSION_HASH_CONFLICT`; dev phải tăng patch/minor. Riêng chuyển source lifecycle `review` → `ready` không được coi là thay đổi content.
- Ngoại lệ chỉ dành cho backend có đồng thời `APP_ENV=local` và `NODE_ENV=development`: cùng SemVer vẫn được cập nhật tại chỗ để developer thử nhanh, có audit `template.version_synced_local_override`.
- Bundle không được có hai source entry cùng `templateKey + major`; duplicate trong bundle trả `400 VALIDATION_ERROR`. Catalog đã có nhiều row cùng major trả `409 TEMPLATE_MAJOR_VERSION_CONFLICT` để tránh chọn nhầm row.
- Lần sync đầu sau khi chuyển từ filesystem scanner sẽ bổ sung `sourceContentHash` cho row cũ nếu các trường contract không đổi. Đây là nâng cấp fingerprint một chiều; các lần sau vẫn chặn thay đổi content thật trên cùng version.
- `REVIEW` chỉ để xem/feedback và không được release.
- Source `DEPRECATED` không được release lại.

## Public preview

Preview draft/review/ready trước release không phải public surface; public renderer chỉ được mở khi version đã `RELEASED`. Admin preview phải yêu cầu platform-admin session/token và chạy sandbox. Việc mở preview URL không thay thế authorization ở backend.

## Error codes

- `TEMPLATE_SOURCE_NOT_READY` — source status chưa phải `READY`.
- `TEMPLATE_VERSION_HASH_CONFLICT` — content đã đổi nhưng `templateVersion` chưa tăng.
- `TEMPLATE_VERSION_DOWNGRADE` — revision mới thấp hơn revision đang lưu trong cùng major.
- `TEMPLATE_MAJOR_VERSION_CONFLICT` — catalog có nhiều row cùng `templateKey + major`.
- `TEMPLATE_SYNC_CONFLICT` — transaction sync đụng unique/serialization race sau các lần retry giới hạn.
- `TEMPLATE_SYNC_DATABASE_TIMEOUT` — transaction ghi database vẫn quá hạn sau một lần retry; API trả `503` thay vì `500` chung chung.
- `TEMPLATE_VERSION_INCOMPATIBLE` — config/contract không được runtime hỗ trợ.
