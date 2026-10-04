# 0004 - Contract và versioning cho code template

Status: Accepted
Date: 2026-07-30
Amended by: [ADR 0014](./0014-template-major-ui-and-mutable-revision.md) for mutable patch/minor revisions within one UI major.

## Context

Thiệp online và website cưới dùng template React được review thay vì page builder cho phép chạy HTML/JavaScript tùy ý. Editor cần sinh form từ schema, hỗ trợ bật/tắt và sắp xếp section, đồng thời website đã publish phải tiếp tục render ổn định khi template mới được triển khai.

## Decision

- `Template` là identity/catalog metadata lâu dài; theo amendment ADR 0014, một `TemplateVersion` đại diện một UI major và giữ SemVer revision hiện tại của renderer/config đó.
- Template config là contract giữa editor, backend validator, migration và renderer. Nó version riêng `templateConfigVersion`, `contentSchemaVersion` và `rendererApiVersion`; patch/minor tương thích của `templateVersion` được cập nhật trên cùng row, major mới tạo row mới.
- Nội dung wedding dùng canonical semantic content, tách khỏi `sectionConfig` và theme presentation. Dữ liệu cần query/constraint như event, media và RSVP vẫn được chuẩn hóa.
- Wedding giữ UI major đã chọn và tự nhận patch/minor tương thích. Chuyển sang major khác là migration chủ động, deterministic, validate lại và preview trước khi user xác nhận; không tự động đổi snapshot live.
- **Gói phát hành template** (`template release bundle`) là contract đầu vào từ code template/config đã review sang backend. Sync gói này là idempotent reconciliation: version mới chỉ ở trạng thái chờ duyệt, admin chủ động phát hành sau khi xem config.
- Cùng `templateKey + version` nhưng khác config hash là lỗi; cùng key/major với SemVer cao hơn update cùng row. Major không còn phân phối được deprecate/retire, không tự động xóa. Backend không quét filesystem frontend khi admin mở trang.
- Publish tạo snapshot public bất biến, không chứa PII, gắn chính xác `templateVersionId`, schema/renderer version và payload hash.
- Thiệp online và website cưới có lifecycle/template selection riêng dưới cùng wedding; không dùng một `templateVersionId` duy nhất cho cả hai bề mặt.

## Consequences

- Bản deploy phải giữ renderer version còn được wedding/snapshot hỗ trợ; CI kiểm tra gói phát hành template, config, fixture, migration và renderer tương ứng.
- Database lưu template config snapshot/hash để audit và sync, nhưng admin không sửa contract render trực tiếp trong database.
- Đổi template giữ được canonical content tương thích; breaking change cần migration và version mới.
- Số bảng và quy trình release tăng, đổi lại có rollback, audit và khả năng duy trì trang đã publish lâu dài.
