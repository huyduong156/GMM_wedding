# Wedding base service contract

## Phạm vi

Vertical slice đầu tiên triển khai Wedding như hồ sơ gốc tối giản dành cho cô dâu/chú rể. Nó cung cấp workspace switcher, basic settings, lễ/tiệc dạng dữ liệu và dashboard read model; không triển khai membership UI/API, editor content, template selection hoặc publish command trong slice này.

## Owner boundary

- Session xác định `userId`; request không được truyền actor/owner đáng tin trong body.
- Wedding chỉ được đọc/ghi khi `Wedding.createdById` bằng actor và `deletedAt` là null.
- Resource không tồn tại và resource của user khác đều trả `404 WEDDING_NOT_FOUND` để không enumerate wedding ID.
- Khi tạo Wedding, transaction đồng thời tạo một `WeddingMember` active role `OWNER` để giữ invariant và tương thích mở rộng sau này. Route membership chưa được expose.
- Event query/mutation luôn bind cả `weddingId` và `eventId`; không update event chỉ theo ID.

## Basic Wedding

DTO hiện có `name`, `primaryDate?`, `timezone`, `locale`, `visibility`, lifecycle timestamps và `revision`. Frontend có thể dùng `name` làm `coupleName` trong active wedding contract. Publish là use case khác nên `PATCH` chỉ chấp nhận trạng thái `DRAFT|ARCHIVED`, không cho client tự đặt `PUBLISHED`.

Update gửi `revision` hiện hành. Repository update có compare-and-swap và tăng revision; mismatch trả `409 WEDDING_REVISION_CONFLICT`. Delete là soft delete, đặt archived và thu hồi `Wedding.slug`; publication snapshot cleanup/unpublish đầy đủ thuộc publication slice.

`ARCHIVED` là trạng thái nghiệp vụ có thể mở lại về `DRAFT`. Soft delete là terminal trong MVP: resource bị ẩn khỏi mọi owner query và chưa có restore API.

## Wedding event

Event là dữ liệu dùng lại bởi thiệp online, website cưới, countdown/map và RSVP, không phải planning workspace riêng. Dữ liệu gồm tên/loại, thời gian, timezone, địa điểm/map/toạ độ, thứ tự, `isPublic` và `revision`. `endsAt` không được trước `startsAt`; latitude/longitude phải đúng miền. Update dùng compare-and-swap theo `revision`; delete là soft delete.

## Dashboard read model

`GET /api/weddings/{weddingId}/dashboard` tổng hợp một lần cho dashboard FE:

- Wedding name/date/status/revision.
- Trạng thái cấu hình/publish, slug và template của thiệp online, website cưới và recap.
- Tổng guest, invitation/active invitation, RSVP `attending|declined|maybe|pending`, party size tham dự, companion và wish pending/approved.
- Event tương lai gần nhất.
- Số RSVP theo từng ngày trong 30 ngày UTC gần nhất.
- Tối đa 10 hoạt động RSVP/lời chúc mới nhất.

Không có bảng analytics/page-view trong schema hiện tại nên `views` trả `null`. Khi có tracking module, contract có thể điền số mà không đổi shape.

Dashboard là private `no-store` read model. Nó không trả contact/note của guest, raw invitation token, wish content, gift ledger hay dữ liệu ngân sách.

## Error contract

| Code | HTTP | Khi nào |
|---|---:|---|
| `VALIDATION_ERROR` | 400 | Body/UUID/date/time/toạ độ không hợp lệ |
| `AUTHENTICATION_REQUIRED` | 401 | Thiếu hoặc sai session |
| `REQUEST_ORIGIN_REJECTED` | 403 | Mutation không qua origin/CSRF/content-type policy |
| `WEDDING_NOT_FOUND` | 404 | Wedding thiếu, đã xóa hoặc không thuộc actor |
| `WEDDING_EVENT_NOT_FOUND` | 404 | Event thiếu/đã xóa/không thuộc wedding đã authorize |
| `WEDDING_EVENT_TIME_INVALID` | 400 | Thời gian kết thúc trước bắt đầu |
| `WEDDING_EVENT_REVISION_CONFLICT` | 409 | Client update event từ revision cũ |
| `WEDDING_REVISION_CONFLICT` | 409 | Client update từ revision cũ |
