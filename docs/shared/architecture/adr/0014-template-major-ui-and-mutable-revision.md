# ADR 0014: Major template UI và SemVer revision cập nhật tại chỗ

- Status: Accepted
- Date: 2026-10-04
- Supersedes: phần immutable `TemplateVersion` trong ADR 0004 và ADR 0010

## Context

Frontend hiện đóng gói một renderer React cho mỗi folder template. Tăng patch/minor để phát hành bugfix cho cùng renderer mà tạo thêm row `TemplateVersion` khiến nhiều row vẫn trỏ về cùng một UI, gây conflict Sync và không phản ánh lựa chọn thực của user. Chủ đích sản phẩm là bugfix được áp dụng ngay cho mọi wedding đang dùng UI đó; chỉ một folder/renderer mới mới trở thành lựa chọn catalog mới.

## Decision

- `Template` tiếp tục là family/catalog identity lâu dài.
- Một row `TemplateVersion` đại diện một UI major của family. Major SemVer là identity của UI; minor/patch là revision hiện tại của UI đó.
- Sync cùng `templateKey + major` cập nhật tại chỗ row hiện có, giữ nguyên `TemplateVersion.id`, kể cả row đã release. Vì vậy wedding đang tham chiếu row đó tự động nhận bugfix tương thích.
- Sync major chưa tồn tại tạo row mới. Source của major mới phải có renderer/folder riêng trước khi được đưa vào catalog.
- Revision không được giảm. Thay đổi config/contract trên đúng cùng SemVer bị từ chối ở staging/production; local development có thể override để thử nhanh. Thay đổi lifecycle không buộc tăng version.
- Bundle không được chứa hai source entry cùng `templateKey + major`. Source `development` không đi vào release bundle.
- Publish snapshot vẫn bất biến về payload. Renderer code của cùng major có thể nhận bugfix tương thích; thay đổi content contract không tương thích phải có migration hoặc major mới.
- Giai đoạn hiện tại, catalog user chỉ chọn revision mới nhất của mỗi template family. Khi product mở nhiều major, frontend phải hiển thị từng released major và resolve renderer bằng `templateKey + major`.

## Consequences

- Không cần đổi Prisma schema: `version`, `configHash`, `codeRevision`, `config` và audit log đã đủ cho revision hiện tại.
- Backend phải enforce một row cho mỗi `templateId + major` trong transaction. Khi có nhiều writer/automation, cân nhắc database constraint hoặc cột major riêng.
- Audit của update phải lưu version/hash trước và sau để giữ lịch sử dù row catalog được cập nhật tại chỗ.
- CI phải kiểm tra backward compatibility cho patch/minor. Renderer major cũ phải được giữ khi major mới được phát hành và vẫn còn wedding sử dụng.
