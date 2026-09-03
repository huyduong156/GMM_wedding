# Guest service contract

## Phạm vi

Guest service quản lý danh sách khách của owner trong một Wedding, cấu trúc
category/group, guest-slug và import/export. Guest data là owner-private;
platform admin và public snapshot không được đọc trực tiếp dữ liệu này.

## Owner boundary

- Mọi private route yêu cầu session owner và kiểm tra `Wedding.createdById`.
- Wedding không tồn tại, đã soft-delete hoặc không thuộc actor đều không được
  enumerate; trả lỗi not found.
- Guest slug được server sinh từ name, chuẩn hóa lowercase và unique trong phạm vi Wedding và được trả trong
  các guest response để FE tạo link cá nhân.
- Guest, category và group luôn được bind với `weddingId`.
- Bulk delete là idempotent theo resource hiện tại: ID đã xóa hoặc không tồn tại
  không làm request thất bại và không bị enumerate; response trả `deletedCount`.
- Guest/category/group delete là soft-delete. Guest slug của guest đã xóa không được
  resolve public.

## Private API

| Method | Path | Mục đích |
|---|---|---|
| GET/POST | `/weddings/{weddingId}/guests` | List/filter bằng cursor hoặc tạo guest |
| GET/PATCH/DELETE | `/weddings/{weddingId}/guests/{guestId}` | Đọc, cập nhật hoặc soft-delete guest |
| POST | `/weddings/{weddingId}/guests/bulk-delete` | Soft-delete tối đa 200 guest IDs |
| POST | `/weddings/{weddingId}/guests/bulk-assign-category` | Gắn hoặc gỡ category cho tối đa 200 guest |
| GET/POST | `/weddings/{weddingId}/guest-categories` | Đọc/tạo cây category tối đa 3 cấp |
| PATCH/DELETE | `/weddings/{weddingId}/guest-categories/{categoryId}` | Đổi tên, di chuyển hoặc soft-delete category |
| POST/DELETE | `/weddings/{weddingId}/guest-categories/bulk-delete` | Soft-delete nhiều category |
| GET/POST | `/weddings/{weddingId}/guest-groups` | Đọc/tạo group |
| PATCH/DELETE | `/weddings/{weddingId}/guest-groups/{groupId}` | Cập nhật hoặc soft-delete group |
| POST | `/weddings/{weddingId}/guests/import/preview` | Validate batch, chưa ghi database |
| POST | `/weddings/{weddingId}/guests/import/commit` | Ghi batch hợp lệ trong transaction |
| GET | `/weddings/{weddingId}/guests/export` | CSV UTF-8 BOM, không chứa dữ liệu public private |

Không có owner CRUD hoặc token lifecycle cho `Invitation`. Guest link cá nhân chỉ dùng `Guest.slug`.

## Guest fields

Guest gồm `id`, `weddingId`, `slug`, `name` bắt buộc và `displayName` tùy chọn (nullable), cùng phone/email, note, table name, `maxPartySize`, tags, category và group. `slug` được sinh server-side từ `name` sau khi normalize (lowercase, bỏ dấu và ký tự đặc biệt), ổn định sau khi tạo và unique theo `(weddingId, slug)`; nếu trùng, hệ thống thêm hậu tố số `-1`, `-2`, ... . `maxPartySize` nằm trong khoảng 1–50. Query list hỗ trợ `q`, `categoryId`, `groupId`, `limit` tối đa 100 và opaque cursor.

## Public guest link

`GET /public/invitations/{weddingSlug}/{guestSlug}` dùng tên route tương thích, nhưng resolve trực tiếp `Wedding.slug` + `Guest.slug`; không đọc `Invitation`. Response chỉ gồm guestName (`displayName ?? name`), guestSlug, weddingSlug và maxPartySize. Wedding phải published, guest chưa bị soft-delete.

## Import/export

Preview trả `validRows` và lỗi theo row/field. Commit từ chối toàn bộ batch nếu
còn lỗi và tạo category path/group còn thiếu trong cùng transaction. Export có
header tiếng Việt, BOM UTF-8 và chỉ chứa guest fields cần cho việc quản lý.

## Public boundary

Personalized resolve, RSVP và wishes dùng `weddingSlug + guestSlug`. Public response chỉ được suy ra từ guest hợp lệ và publication đã publish; `guestName` được resolve bằng `Guest.displayName ?? Guest.name`; không trả guest phone, email, note, category/group hoặc guest list.
