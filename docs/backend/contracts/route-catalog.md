# Backend route catalog và Postman testing

## Mục đích

File này là index dễ đọc của HTTP API để developer tìm route và lập test nhanh. Khi một route được tạo, đổi tên hoặc xóa, PR phải cập nhật:

1. Route handler.
2. OpenAPI operation/schema/example.
3. Route catalog này.
4. Test contract/integration tương ứng.

OpenAPI 3.1 tại `backend/openapi/openapi.yaml` là **machine-readable source of truth** sau khi scaffold. Không duy trì Postman collection thủ công nếu có thể import/generate từ OpenAPI, vì collection thủ công rất dễ drift.

## Base và environment

| Environment | Base URL đề xuất |
|---|---|
| Local | `http://localhost:3000/api` |
| Docker local | `http://localhost:${BACKEND_PORT:-3000}/api` |
| Staging | Cấu hình trong Postman environment, không hard-code vào collection |
| Production | Chỉ dùng environment được phê duyệt; không chạy destructive collection tùy tiện |

Postman variables tối thiểu:

```text
baseUrl
weddingId
guestId
invitationToken
recapSlug
revision
idempotencyKey
```

Secret, password, cookie và token thật chỉ lưu trong local/private Postman environment, không commit.

## Route conventions

- Prefix `/api`.
- JSON `camelCase`, timestamp ISO 8601 UTC.
- Private endpoint dùng session cookie và CSRF/origin policy.
- Public mutation áp dụng rate limit và idempotency khi phù hợp.
- Resource ID luôn được authorize theo wedding/tenant.
- Route chưa implement trong catalog được đánh dấu `Planned`; không hiểu là endpoint đang hoạt động.

## System và health

| Method | Path | Auth | Trạng thái | Mục đích |
|---|---|---|---|---|
| GET | `/health/live` | Không | Implemented | Process liveness |
| GET | `/health/ready` | Không | Implemented | Database readiness |
| GET | `/version` | Không | Implemented | Release/build metadata tối thiểu |

## Authentication và account

| Method | Path | Auth | Trạng thái | Mục đích |
|---|---|---|---|---|
| POST | `/auth/register` | Public | Planned | Đăng ký |
| POST | `/auth/verify-email` | Verification token | Planned | Xác minh email một lần |
| POST | `/auth/resend-verification` | Public | Planned | Gửi lại verification không lộ account |
| POST | `/auth/login` | Public | Planned | Tạo session |
| POST | `/auth/logout` | Session | Planned | Thu hồi session hiện tại |
| POST | `/auth/forgot-password` | Public | Planned | Gửi reset flow |
| POST | `/auth/reset-password` | Reset token | Planned | Đặt mật khẩu mới |
| GET | `/me` | Session | Planned | Lấy profile/actor hiện tại |
| PATCH | `/me` | Session | Planned | Cập nhật profile |
| GET | `/me/sessions` | Session | Planned | Liệt kê session của tài khoản |
| DELETE | `/me/sessions/{sessionId}` | Session | Planned | Thu hồi một session |
| POST | `/me/sessions/revoke-all` | Session | Planned | Thu hồi mọi session, trừ/bao gồm hiện tại theo request |

## Weddings, content và publish

| Method | Path | Auth | Trạng thái | Mục đích |
|---|---|---|---|---|
| GET | `/weddings` | Session | Planned | Danh sách wedding của actor |
| POST | `/weddings` | Session | Planned | Tạo wedding |
| GET | `/weddings/{weddingId}` | Member | Planned | Chi tiết wedding |
| PATCH | `/weddings/{weddingId}` | Owner/editor policy | Planned | Cập nhật metadata |
| DELETE | `/weddings/{weddingId}` | Owner | Planned | Soft delete/thu hồi public access |
| GET | `/weddings/{weddingId}/content` | Member | Planned | Lấy canonical content/theme |
| PUT | `/weddings/{weddingId}/content` | Owner/editor | Planned | Lưu content theo revision |
| POST | `/weddings/{weddingId}/publish` | Publish policy | Planned | Tạo immutable snapshot |
| POST | `/weddings/{weddingId}/unpublish` | Publish policy | Planned | Thu hồi public pointer |
| POST | `/weddings/{weddingId}/preview-token` | Owner/editor | Planned | Tạo draft preview token |
| GET | `/slugs/weddings/{slug}/availability` | Session | Planned | Kiểm tra slug |

## Templates và media

| Method | Path | Auth | Trạng thái | Mục đích |
|---|---|---|---|---|
| GET | `/templates` | Session/public catalog policy | Planned | Danh sách template/version khả dụng |
| GET | `/templates/{templateKey}/versions/{version}` | Session | Planned | Metadata/config version |
| POST | `/weddings/{weddingId}/media/upload-intents` | Member policy | Planned | Presigned upload intent |
| POST | `/weddings/{weddingId}/media/{mediaId}/complete` | Member policy | Planned | Xác nhận upload và enqueue verify |
| GET | `/weddings/{weddingId}/media` | Member | Planned | Danh sách media |
| DELETE | `/weddings/{weddingId}/media/{mediaId}` | Member policy | Planned | Xóa/retire media |

## Guests và invitations

| Method | Path | Auth | Trạng thái | Mục đích |
|---|---|---|---|---|
| GET | `/weddings/{weddingId}/guests` | Guest access policy | Planned | List/filter guest |
| POST | `/weddings/{weddingId}/guests` | Guest write policy | Planned | Tạo guest |
| GET | `/weddings/{weddingId}/guests/{guestId}` | Guest access policy | Planned | Chi tiết guest |
| PATCH | `/weddings/{weddingId}/guests/{guestId}` | Guest write policy | Planned | Cập nhật guest |
| DELETE | `/weddings/{weddingId}/guests/{guestId}` | Guest write policy | Planned | Soft delete guest |
| POST | `/weddings/{weddingId}/guests/import/preview` | Guest write policy | Planned | Validate/map import |
| POST | `/weddings/{weddingId}/guests/import/commit` | Guest write policy | Planned | Commit import idempotent |
| GET | `/weddings/{weddingId}/guests/export` | Guest access policy | Planned | Export sync/async theo size |
| POST | `/weddings/{weddingId}/invitations` | Guest write policy | Planned | Tạo invitation/token |
| POST | `/weddings/{weddingId}/invitations/{invitationId}/rotate` | Guest write policy | Planned | Rotate token |
| POST | `/weddings/{weddingId}/invitations/{invitationId}/revoke` | Guest write policy | Planned | Revoke token |

## RSVP và wishes

| Method | Path | Auth | Trạng thái | Mục đích |
|---|---|---|---|---|
| GET | `/weddings/{weddingId}/rsvps` | RSVP access policy | Planned | Owner list/filter RSVP |
| PATCH | `/weddings/{weddingId}/rsvps/{rsvpId}` | RSVP write policy | Planned | Owner correction |
| GET | `/weddings/{weddingId}/wishes` | Wish moderation policy | Planned | List moderation |
| PATCH | `/weddings/{weddingId}/wishes/{wishId}` | Wish moderation policy | Planned | Approve/reject/pin/hide |

## Planning, gift ledger và recap

| Method | Path | Auth | Trạng thái | Mục đích |
|---|---|---|---|---|
| GET/POST | `/weddings/{weddingId}/tasks` | Task policy | Planned | List/create task |
| PATCH/DELETE | `/weddings/{weddingId}/tasks/{taskId}` | Task policy | Planned | Update/delete task |
| GET/POST | `/weddings/{weddingId}/gift-ledger` | Owner only | Planned | List/create private entry |
| PATCH/DELETE | `/weddings/{weddingId}/gift-ledger/{entryId}` | Owner only | Planned | Update/delete private entry |
| GET | `/weddings/{weddingId}/gift-ledger/export` | Owner + step-up target | Planned | Export private ledger |
| GET/PUT | `/weddings/{weddingId}/recap` | Recap policy | Planned | Read/save recap draft |
| POST | `/weddings/{weddingId}/recap/publish` | Recap publish policy | Planned | Publish immutable recap snapshot |
| POST | `/weddings/{weddingId}/recap/unpublish` | Recap publish policy | Planned | Unpublish recap |

## Public API

| Method | Path | Auth | Trạng thái | Mục đích |
|---|---|---|---|---|
| GET | `/public/weddings/{slug}` | Public policy | Planned | Published wedding snapshot |
| GET | `/public/invitations/{invitationToken}` | Invite token | Planned | Minimal personalized invitation |
| PUT | `/public/invitations/{invitationToken}/rsvp` | Invite token | Planned | Submit/update RSVP |
| POST | `/public/weddings/{slug}/rsvps` | Public + abuse controls | Planned | Public RSVP nếu bật |
| GET | `/public/weddings/{slug}/wishes` | Public | Planned | Approved wishes |
| POST | `/public/weddings/{slug}/wishes` | Public + abuse controls | Planned | Submit wish |
| GET | `/public/recaps/{recapSlug}` | Public | Planned | Published recap snapshot |

## Postman workflow

1. Start backend theo [installation and local startup](../getting-started/installation-and-local-startup.md).
2. Import `backend/openapi/openapi.yaml` vào Postman sau khi file được scaffold.
3. Tạo local environment, đặt `baseUrl`; không commit secret value.
4. Chạy auth request và để Postman cookie jar giữ session.
5. Chạy collection theo thứ tự health -> auth -> wedding -> resource -> public flow.
6. Dùng unique `idempotencyKey` cho mutation retry-safe.
7. Collection smoke có thể export vào `backend/postman/` nếu CI thực sự chạy nó; nếu không, OpenAPI + integration tests vẫn là source chính.

## Checklist khi thêm route

- Operation ID và OpenAPI schema/example.
- Auth actor, role/resource policy và tenant scope.
- Request/response DTO, error codes và status.
- Pagination/filter/sort nếu là list.
- Revision/ETag hoặc idempotency nếu mutation cần.
- Rate limit/abuse control nếu public.
- Integration/contract test và Postman-import compatibility.
- Audit, log/metric và PII classification.
