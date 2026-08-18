# Guest service contract

## Phạm vi

Guest service quản lý danh sách khách của owner trong một Wedding, cấu trúc
category/group, invitation token và import/export. Guest data là owner-private;
platform admin và public snapshot không được đọc trực tiếp dữ liệu này.

## Owner boundary

- Mọi private route yêu cầu session owner và kiểm tra `Wedding.createdById`.
- Wedding không tồn tại, đã soft-delete hoặc không thuộc actor đều không được
  enumerate; trả lỗi not found.
- Raw invitation token chỉ trả đúng một lần khi create/rotate. Database chỉ lưu
  hash token.
- Guest, category, group và invitation ID luôn được bind với `weddingId`.
- Bulk delete là idempotent theo resource hiện tại: ID đã xóa hoặc không tồn tại
  không làm request thất bại và không bị enumerate; response trả `deletedCount`.
- Guest/category/group delete là soft-delete. Invitation revoke là terminal
  trong lifecycle hiện tại; rotate tạo raw token mới và vô hiệu token cũ.

## Private API

| Method | Path | Mục đích |
|---|---|---|
| GET/POST | `/weddings/{weddingId}/guests` | List/filter bằng cursor hoặc tạo guest |
| GET/PATCH/DELETE | `/weddings/{weddingId}/guests/{guestId}` | Đọc, cập nhật hoặc soft-delete guest |
| POST | `/weddings/{weddingId}/guests/bulk-delete` | Soft-delete tối đa 200 guest IDs trong một request |
| POST | `/weddings/{weddingId}/guests/bulk-assign-category` | Gắn hoặc gỡ tối đa 200 guest vào một category |
| GET/POST | `/weddings/{weddingId}/guest-categories` | Đọc/tạo cây category tối đa 3 cấp |
| PATCH/DELETE | `/weddings/{weddingId}/guest-categories/{categoryId}` | Đổi tên, di chuyển hoặc soft-delete category |
| POST | `/weddings/{weddingId}/guest-categories/bulk-delete` | Soft-delete tối đa 200 category IDs trong một request |
| GET/POST | `/weddings/{weddingId}/guest-groups` | Đọc/tạo group |
| PATCH/DELETE | `/weddings/{weddingId}/guest-groups/{groupId}` | Cập nhật hoặc soft-delete group |
| POST | `/weddings/{weddingId}/guests/import/preview` | Validate batch tối đa 5.000 dòng, chưa ghi database |
| POST | `/weddings/{weddingId}/guests/import/commit` | Ghi batch hợp lệ trong transaction |
| GET | `/weddings/{weddingId}/guests/export` | CSV UTF-8 BOM, không chứa raw token |
| GET | `/weddings/{weddingId}/invitations` | List invitation theo guest/status bằng cursor |
| GET/PATCH | `/weddings/{weddingId}/invitations/{invitationId}` | Đọc/cập nhật metadata invitation |
| POST | `/weddings/{weddingId}/invitations` | Tạo invitation và trả raw token một lần |
| POST | `/weddings/{weddingId}/invitations/{invitationId}/rotate` | Đổi token và trả raw token mới một lần |
| POST | `/weddings/{weddingId}/invitations/{invitationId}/revoke` | Revoke invitation đang active |

## Guest fields

Guest gồm `displayName`, phone/email, note, table name, `maxPartySize`, tags,
category và group. `maxPartySize` nằm trong khoảng 1–50. Query list hỗ trợ
`q`, `categoryId`, `groupId`, `limit` tối đa 100 và opaque cursor.

## Invitation fields

Invitation có thể gắn với một guest hoặc là invitation chung, có label,
`publicSlug`, `maxPartySize`, expiry và status `ACTIVE|REVOKED`. Metadata có thể
được sửa nhưng token hash/public slug không được client ghi trực tiếp.

## Import/export

Preview trả `validRows` và lỗi theo row/field. Commit từ chối toàn bộ batch nếu
còn lỗi và tạo category path/group còn thiếu trong cùng transaction. Export có
header tiếng Việt, BOM UTF-8 và chỉ chứa guest fields cần cho việc quản lý.

## Public boundary

Personalized invitation resolve, RSVP và wishes dùng public invitation boundary
riêng. Public response chỉ được suy ra từ token/slug hợp lệ và publication đã
publish; không trả guest phone, email, note, category/group hoặc guest list.
