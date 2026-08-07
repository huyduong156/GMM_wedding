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
| GET | `/openapi` | `API_DOCS_ENABLED` | Implemented | OpenAPI YAML dùng bởi Swagger UI; trả 404 khi tắt |

Swagger UI nằm tại `/api-docs` (không nằm dưới API base `/api`). Compose local bật mặc định; môi trường khác phải chủ động đặt `API_DOCS_ENABLED=true`. UI self-host asset, tắt external validator và thao tác “Try it out” để tránh mutation ngoài ý muốn.

## Authentication và account

Core slice và security boundary được thiết kế tại [authentication implementation design](./authentication-implementation-design.md). Các route dưới đây chỉ đổi sang `Implemented` khi persistence, OpenAPI, integration/security test và image smoke cùng hoàn tất.

| Method | Path | Auth | Trạng thái | Mục đích |
|---|---|---|---|---|
| POST | `/auth/register` | Public | Implemented | Đăng ký |
| POST | `/auth/verify-email` | Verification token | Implemented | Xác minh email một lần |
| POST | `/auth/resend-verification` | Public pending account | Implemented | Gửi lại verification không lộ account; token cũ bị vô hiệu |
| POST | `/auth/login` | Public | Implemented | Tạo session |
| POST | `/auth/admin/login` | Public + active `ADMIN` role | Implemented | Tạo session cho bề mặt platform admin |
| POST | `/auth/logout` | Session | Implemented | Thu hồi session hiện tại |
| POST | `/auth/forgot-password` | Public user account | Implemented | Gửi reset flow trung tính; không áp dụng admin |
| POST | `/auth/reset-password` | Reset token | Implemented | Đặt mật khẩu mới, revoke toàn bộ session |
| GET | `/me` | Session | Implemented | Lấy profile/actor hiện tại |
| GET | `/admin/me` | Platform admin session | Implemented | Xác nhận actor và assurance cho admin shell |
| PATCH | `/me` | Session | Implemented | Cập nhật displayName, phone, avatarUrl, locale, timezone; cho phép xoá giá trị nullable |
| GET | `/me/sessions` | Session | Planned | Liệt kê session của tài khoản |
| DELETE | `/me/sessions/{sessionId}` | Session | Planned | Thu hồi một session |
| POST | `/me/sessions/revoke-all` | Session | Planned | Thu hồi mọi session, trừ/bao gồm hiện tại theo request |

## Weddings, content và publish

| Method | Path | Auth | Trạng thái | Mục đích |
|---|---|---|---|---|
| GET | `/weddings` | Session owner | Implemented | Danh sách wedding chưa xóa của actor, dùng cho workspace switcher |
| POST | `/weddings` | Session owner | Implemented | Tạo wedding tối giản và owner membership nội bộ |
| GET | `/weddings/{weddingId}` | Owner | Implemented | Chi tiết wedding; cross-owner trả 404 |
| PATCH | `/weddings/{weddingId}` | Owner | Implemented | Cập nhật metadata theo `revision`; conflict trả 409 |
| DELETE | `/weddings/{weddingId}` | Owner | Implemented | Soft delete, archive và thu hồi wedding slug |
| GET/POST | `/weddings/{weddingId}/events` | Owner | Implemented | List/tạo lễ hoặc tiệc dùng cho publication/RSVP |
| PATCH/DELETE | `/weddings/{weddingId}/events/{eventId}` | Owner | Implemented | Sửa theo event `revision`/xóa mềm lễ hoặc tiệc cùng wedding |
| GET | `/weddings/{weddingId}/dashboard` | Owner | Implemented | Read model dashboard: publication, guest/invite/RSVP/wish, trend, event và activity |
| GET | `/weddings/{weddingId}/content` | Member | Planned | Lấy canonical content/theme theo surface; handler đã scaffold, chờ integration/OpenAPI test |
| PUT | `/weddings/{weddingId}/content` | Owner/editor | Planned | Lưu content, template selection và section/theme config theo revision; handler đã scaffold, chờ integration/OpenAPI test |
| POST | `/weddings/{weddingId}/publish` | Publish policy | Planned | Tạo immutable snapshot; handler đã scaffold, chờ integration/OpenAPI test |
| POST | `/weddings/{weddingId}/unpublish` | Publish policy | Planned | Thu hồi public pointer; handler đã scaffold, chờ integration/OpenAPI test |
| POST | `/weddings/{weddingId}/preview-token` | Owner/editor | Planned | Tạo draft preview token |
| GET | `/slugs/weddings/{slug}/availability` | Session | Planned | Kiểm tra slug; handler đã scaffold, chờ integration/OpenAPI test |

Wedding base hiện owner-only theo ADR 0008. `WeddingMember` vẫn được tạo để giữ invariant dữ liệu nhưng chưa có API quản trị thành viên. Dashboard trả `views: null` cho từng publication surface cho đến khi analytics tracking được triển khai; không dùng số giả.

## Templates và media

| Method | Path | Auth | Trạng thái | Mục đích |
|---|---|---|---|---|
| GET | `/templates` | Session/public catalog policy | Planned | Danh sách template/version khả dụng; handler đã scaffold, chờ integration/OpenAPI test |
| GET | `/templates/{templateKey}/versions/{version}` | Session | Planned | Metadata/config version; handler đã scaffold, chờ integration/OpenAPI test |
| POST | `/weddings/{weddingId}/media/upload-intents` | Member policy | Planned | Presigned/fake upload intent; handler đã scaffold, chờ integration/OpenAPI test |
| POST | `/weddings/{weddingId}/media/{mediaId}/complete` | Member policy | Planned | Xác nhận upload và chuyển asset READY; handler đã scaffold, chờ integration/OpenAPI test |
| GET | `/weddings/{weddingId}/media` | Member | Planned | Danh sách media; handler đã scaffold, chờ integration/OpenAPI test |
| DELETE | `/weddings/{weddingId}/media/{mediaId}` | Member policy | Planned | Xóa/retire media; handler đã scaffold, chờ integration/OpenAPI test |

## Guests và invitations

| Method | Path | Auth | Trạng thái | Mục đích |
|---|---|---|---|---|
| GET | `/weddings/{weddingId}/guests` | Owner | Implemented | List/filter guest với cursor |
| POST | `/weddings/{weddingId}/guests` | Owner | Implemented | Tạo guest |
| GET | `/weddings/{weddingId}/guests/{guestId}` | Owner | Implemented | Chi tiết guest |
| PATCH | `/weddings/{weddingId}/guests/{guestId}` | Owner | Implemented | Cập nhật guest |
| DELETE | `/weddings/{weddingId}/guests/{guestId}` | Owner | Implemented | Soft delete guest |
| GET/POST | `/weddings/{weddingId}/guest-categories` | Owner | Implemented | Cây danh mục khách tối đa 3 cấp |
| PATCH | `/weddings/{weddingId}/guest-categories/{categoryId}` | Owner | Implemented | Đổi tên, di chuyển danh mục; chặn vòng lặp và cấp > 3 |
| DELETE | `/weddings/{weddingId}/guest-categories/{categoryId}` | Owner | Implemented | Soft delete danh mục |
| GET/POST | `/weddings/{weddingId}/guest-groups` | Owner | Implemented | Nhóm khách |
| DELETE | `/weddings/{weddingId}/guest-groups/{groupId}` | Owner | Implemented | Soft delete nhóm |
| POST | `/weddings/{weddingId}/guests/import/preview` | Guest write policy | Implemented | Nhận `{ rows }` sau khi FE parse CSV; validate và trả lỗi theo dòng |
| POST | `/weddings/{weddingId}/guests/import/commit` | Guest write policy | Implemented | Commit các dòng hợp lệ; tự tạo category path/group còn thiếu |
| GET | `/weddings/{weddingId}/guests/export` | Guest access policy | Implemented | CSV UTF-8 BOM, sort và chèn dòng section theo danh mục/nhóm |
| POST | `/weddings/{weddingId}/invitations` | Owner | Implemented | Tạo invitation/token; raw token chỉ trả một lần |
| POST | `/weddings/{weddingId}/invitations/{invitationId}/rotate` | Owner | Implemented | Rotate token |
| POST | `/weddings/{weddingId}/invitations/{invitationId}/revoke` | Owner | Implemented | Revoke token |

## RSVP và wishes

| Method | Path | Auth | Trạng thái | Mục đích |
|---|---|---|---|---|
| GET | `/weddings/{weddingId}/rsvps` | RSVP access policy | Planned | Owner list/filter RSVP |
| PATCH | `/weddings/{weddingId}/rsvps/{rsvpId}` | RSVP write policy | Planned | Owner correction |
| GET | `/weddings/{weddingId}/wishes` | Wish moderation policy | Planned | List moderation; handler đã scaffold, chờ integration/OpenAPI test |
| PATCH | `/weddings/{weddingId}/wishes/{wishId}` | Wish moderation policy | Planned | Approve/reject/pin/hide; handler đã scaffold, chờ integration/OpenAPI test |

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
| GET | `/public/weddings/{slug}` | Public policy | Planned | Published wedding snapshot; handler đã scaffold, chờ integration/OpenAPI test |
| GET | `/public/invitations/{invitationToken}` | Invite token | Planned | Minimal personalized invitation; handler đã scaffold, chờ integration/OpenAPI test |
| GET | `/public/invitations/{weddingSlug}/{guestSlug}` | Public invitation slug | Implemented | Resolve personalized invitation without entering name |
| PUT | `/public/invitations/{invitationToken}/rsvp` | Invite token | Planned | Submit/update RSVP; handler đã scaffold, chờ integration/OpenAPI test |
| POST | `/public/weddings/{slug}/rsvps` | Public + origin guard | Implemented | Common URL RSVP, bắt buộc guestName |
| POST | `/public/weddings/{slug}/wishes` | Public + origin guard | Implemented | Common URL wish, bắt buộc guestName |
| PUT | `/public/invitations/{weddingSlug}/{guestSlug}/rsvp` | Public invitation slug | Implemented | Personalized RSVP, tự lấy tên/guestId |
| POST | `/public/invitations/{weddingSlug}/{guestSlug}/wishes` | Public invitation slug | Implemented | Personalized wish, không nhập tên |
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
