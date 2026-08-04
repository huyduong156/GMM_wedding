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
- Wedding: `GET|POST /weddings`, `GET|PATCH|DELETE /weddings/{id}`, slug availability, content/theme/events, publish/unpublish, preview token.
- Template/media: `GET /templates[...]`, upload intent/complete/list/delete.
- Guest: CRUD, group, import preview/commit, export, invitation create/rotate/revoke.
- Owner RSVP/wish: list/filter/update/export/moderate và analytics summary.
- Todo: `GET|POST /weddings/{id}/tasks`, `GET|PATCH|DELETE /weddings/{id}/tasks/{taskId}`, reorder/bulk status; `GET /task-checklist-templates`, `POST /weddings/{id}/tasks/apply-template`.
- Gift ledger (owner-only): `GET|POST /weddings/{id}/gift-ledger`, `GET|PATCH|DELETE /weddings/{id}/gift-ledger/{entryId}`, summary và export.
- Recap: `GET|PUT /weddings/{id}/recap`, media/wish selection, slug availability, preview token, publish/unpublish; public `GET /public/recaps/{slug}`.
- Public: `GET /public/weddings/{slug}`, `GET /public/invitations/{token}`, `PUT .../{token}/rsvp`, `POST .../{slug}/rsvps`, `POST|GET .../{slug}/wishes`.

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
