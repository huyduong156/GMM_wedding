# 0004 - Contract và versioning cho code template

Status: Accepted
Date: 2026-07-30

## Context

Thiệp online và website cưới dùng template React được review thay vì page builder cho phép chạy HTML/JavaScript tùy ý. Editor cần sinh form từ schema, hỗ trợ bật/tắt và sắp xếp section, đồng thời website đã publish phải tiếp tục render ổn định khi template mới được triển khai.

## Decision

- `Template` là identity/catalog metadata lâu dài; immutable `TemplateVersion` đại diện chính xác một renderer và template config đã phát hành.
- Template config là contract giữa editor, backend validator, migration và renderer. Nó version riêng `templateConfigVersion`, `contentSchemaVersion` và `rendererApiVersion`; `templateVersion` dùng SemVer nhưng không bị ghi đè sau khi phát hành.
- Nội dung wedding dùng canonical semantic content, tách khỏi `sectionConfig` và theme presentation. Dữ liệu cần query/constraint như event, media và RSVP vẫn được chuẩn hóa.
- Wedding cũ pin version cũ. Upgrade là migration chủ động, deterministic, validate lại và preview trước khi user xác nhận; không tự động đổi snapshot live.
- Sync template là idempotent reconciliation. Cùng `templateKey + version` nhưng khác config hash là lỗi; version không còn phân phối được deprecate/retire, không tự động xóa.
- Publish tạo snapshot public bất biến, không chứa PII, gắn chính xác `templateVersionId`, schema/renderer version và payload hash.
- Thiệp online và website cưới có lifecycle/template selection riêng dưới cùng wedding; không dùng một `templateVersionId` duy nhất cho cả hai bề mặt.

## Consequences

- Artifact deploy phải giữ renderer version còn được wedding/snapshot hỗ trợ; CI kiểm tra registry, template config, fixture, migration và renderer tương ứng.
- Database lưu template config snapshot/hash để audit và sync, nhưng admin không sửa contract render trực tiếp trong database.
- Đổi template giữ được canonical content tương thích; breaking change cần migration và version mới.
- Số bảng và quy trình release tăng, đổi lại có rollback, audit và khả năng duy trì trang đã publish lâu dài.
