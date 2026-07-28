# Thiết kế API

## Quy ước

- Base `/api/v1`, JSON `camelCase`, ISO 8601 UTC.
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
- Wedding: `GET|POST /weddings`, `GET|PATCH|DELETE /weddings/{id}`, slug availability, content/theme/events, publish/unpublish, preview token.
- Template/media: `GET /templates[...]`, upload intent/complete/list/delete.
- Guest: CRUD, group, import preview/commit, export, invitation create/rotate/revoke.
- Owner RSVP/wish: list/filter/update/export/moderate và analytics summary.
- Public: `GET /public/weddings/{slug}`, `GET /public/invitations/{token}`, `PUT .../{token}/rsvp`, `POST .../{slug}/rsvps`, `POST|GET .../{slug}/wishes`.

## Quyền

| Tác vụ | Owner | Editor | Guest manager | Viewer | Public |
|---|---:|---:|---:|---:|---:|
| Nội dung/theme | Có | Có | Không | Không | Không |
| Publish/member/billing | Có | Giới hạn | Không | Không | Không |
| Khách/RSVP | Có | Có | Có | Chỉ xem | Không |
| Xem trang published | Có | Có | Có | Có | Có |
| Gửi RSVP/lời chúc | Có | Có | Có | Có | Theo cấu hình |

Backend luôn authorize theo resource/wedding; không tin ID/role từ client.

## Cache và contract

- Public snapshot: CDN cache ngắn + stale-while-revalidate, purge khi publish/unpublish.
- Private dashboard: `no-store` hoặc private cache có chủ đích.
- Publish transaction: validate -> tăng version -> snapshot -> cập nhật trạng thái.
- Trước khi implement rộng, tạo `backend/openapi.yaml` hoặc sinh OpenAPI để tạo typed client và kiểm tra breaking change trong CI.
