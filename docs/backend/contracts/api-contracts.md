# API contract và quy ước HTTP
Tài liệu này liệt kê surface API và convention tổng quát. Chi tiết authentication/authorization xem [authentication and authorization](./authentication-and-authorization.md); error, pagination, idempotency và concurrency xem [error and concurrency contract](./errors-pagination-and-concurrency.md).

## Quy ước

- Base `/api`, JSON `camelCase`, ISO 8601 UTC.
- Private API dùng secure cookie; mutation có CSRF/origin protection.
- Cursor pagination có limit trần; DTO riêng, không trả Prisma model.
- Editor dùng version/ETag để chống lost update; conflict trả `409`.

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dữ liệu không hợp lệ",
    "fieldErrors": { "slug": ["Slug đã được sử dụng"] },
    "requestId": "req_..."
  }
}
```

## Endpoint MVP

- Auth: `POST /auth/{register,login,logout,forgot-password,reset-password}`, `GET|PATCH /me`.
- Wedding base đã implement: `GET|POST /weddings`, `GET|PATCH|DELETE /weddings/{id}`, CRUD `/weddings/{id}/events`, `GET /weddings/{id}/dashboard` và `GET /weddings/{id}/analytics`; slug availability, surface-scoped content/theme, publish/unpublish và preview token đã có contract; recap dùng cùng Wedding.slug.
- Template/media: `GET /templates[...]`, upload intent/complete/list/delete.
- Nhạc nền: user đọc `GET /music-tracks`, upload/complete/retire personal track qua `/music-tracks[...]`; platform admin upload/complete/activate/retire system track qua `/admin/music-tracks[...]`. System track user chỉ được dùng, không được xóa; personal track chỉ owner được quản lý. Content lưu `musicTrackId` cùng revision.
- Guest: CRUD, group, import preview/commit, export, invitation create/rotate/revoke.
- Owner RSVP/wish: list/filter/update/moderate, liên kết anonymous interaction với Guest và analytics summary. Analytics trả tổng khách, khách xác nhận/tỷ lệ, tiến độ task theo status/priority và completedRate, 5 task hoàn thành gần nhất, khách đã gửi quà và thống kê lời chúc; không theo dõi lượt xem trong MVP.
- Todo: `GET|POST /weddings/{id}/tasks`, `POST /weddings/{id}/tasks/bulk`, `GET|PATCH|DELETE /weddings/{id}/tasks/{taskId}`, reorder/bulk status. Checklist gợi ý là static preset phía FE trong MVP; bulk payload chỉ nhận root task, không nhận `parentTaskId`. Task thủ công vẫn có thể gắn `eventId` hoặc `parentTaskId` tối đa một cấp; chưa có assignee/member ở MVP.
- Gift ledger (owner-only): `GET|POST /weddings/{id}/gift-ledger`, `GET|PATCH|DELETE /weddings/{id}/gift-ledger/{entryId}`, summary/export và promote/link/unlink Guest. Entry có thể được nhập nhanh bằng tên không cần Guest; Guest chỉ là liên kết tùy chọn và không cascade xóa ledger.
- Recap: `GET|PUT /weddings/{id}/recap` là compatibility facade trên `WeddingContent(surface=RECAP)`; media/wish selection và revision được lưu theo surface. Publish/unpublish dùng `POST /weddings/{id}/publish|unpublish` với `surface=RECAP`; public `GET /public/recaps/{weddingSlug}` dùng cùng Wedding.slug. Không có recap slug availability riêng.
- Public: `GET /public/weddings/{weddingSlug}`, `GET /public/websites/{weddingSlug}`, `GET /public/invitations/{token}`, `GET /public/invitations/{weddingSlug}/{guestSlug}`, `PUT .../{token}/rsvp`, `PUT .../{weddingSlug}/{guestSlug}/rsvp`, `POST .../{slug}/rsvps`, `POST|GET .../{slug}/wishes`. URL chung nhận `authorName`/tên khách; URL cá nhân lấy identity từ invitation slug và không yêu cầu nhập tên.

## Quyền

| Tác vụ | Owner | Editor | Guest manager | Viewer | Public |
|---|---:|---:|---:|---:|---:|
| Nội dung/theme | Có | Có | Không | Không | Không |
| Publish/member/billing | Có | Giới hạn | Không | Không | Không |
| Khách/RSVP | Có | Có | Có | Chỉ xem | Không |
| Xem trang published | Có | Có | Có | Có | Có |
| Gửi RSVP/lời chúc | Có | Có | Có | Có | Theo cấu hình |
| Todo list | Có | Có | Giới hạn | Chỉ xem | Không |
| Sổ tiền mừng | Có | Không | Không | Không | Không |
| Recap draft/publish | Có | Có/Giới hạn | Không | Chỉ xem draft | Chỉ bản publish |

Backend luôn authorize theo resource/wedding; không tin ID/role từ client.

Gift ledger phải authorize owner ở application service trước mọi read/write/export. Platform admin không có endpoint đọc nội dung ledger trong vận hành thường; support access nếu bổ sung phải là break-glass, có lý do, step-up authentication và audit.

## Cache và contract

- Public snapshot: CDN cache ngắn + stale-while-revalidate, purge khi publish/unpublish.
- Private dashboard: `no-store` hoặc private cache có chủ đích.
- Publish transaction: validate -> tăng version -> snapshot -> cập nhật trạng thái.
- Trước khi implement rộng, tạo `backend/openapi.yaml` hoặc sinh OpenAPI để tạo typed client và kiểm tra breaking change trong CI.

## OpenAPI ownership

- OpenAPI là machine-readable source cho HTTP contract đã implement; docs này giữ rationale và capability map.
- Operation ID ổn định và theo business action.
- CI lint schema, validate example và phát hiện breaking change so với base branch.
- DTO public/private tách rõ; schema không tham chiếu Prisma model.
- Security scheme, error response và pagination component tái sử dụng nhưng không che operation-specific permission.
