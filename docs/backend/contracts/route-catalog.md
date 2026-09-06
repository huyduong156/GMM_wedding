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
| Docker local | `http://localhost:3000/api` |
| Staging | Cấu hình trong Postman environment, không hard-code vào collection |
| Production | Chỉ dùng environment được phê duyệt; không chạy destructive collection tùy tiện |

Postman variables tối thiểu:

```text
baseUrl
weddingId
guestId
guestSlug
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
| GET | `/admin/users` | Platform admin session | Implemented | Danh sách user, tìm kiếm/lọc/phân trang và summary trạng thái |
| GET | `/admin/users/{userId}` | Platform admin session | Implemented | Chi tiết user và system roles đang hiệu lực |
| PATCH | `/admin/users/{userId}` | Platform admin + CSRF | Implemented | Cập nhật trạng thái user hoặc tập system role; ghi audit và bảo vệ admin cuối cùng |
| POST | `/admin/users/invite` | Platform admin + CSRF | Implemented | Tạo tài khoản và gửi password setup invite |
| POST | `/admin/users/bulk-status` | Platform admin + CSRF | Implemented | Cập nhật trạng thái cho nhiều user và ghi audit |
| POST | `/admin/users/{userId}/resend-verification` | Platform admin + CSRF | Implemented | Gửi lại email xác minh cho user pending |
| GET | `/admin/users/{userId}/audit-logs` | Platform admin | Implemented | Lịch sử audit của user |
| POST | `/admin/users/{userId}/sessions/revoke-all` | Platform admin + CSRF | Implemented | Thu hồi toàn bộ session của user |
| PATCH | `/me` | Session | Implemented | Cập nhật displayName, phone, avatarUrl, locale, timezone; cho phép xoá giá trị nullable |
| POST | `/me/password` | Session + CSRF | Implemented | Đổi mật khẩu và thu hồi các session khác |
| GET | `/me/sessions` | Session | Implemented | Liệt kê session của tài khoản |
| DELETE | `/me/sessions/{sessionId}` | Session + CSRF | Implemented | Thu hồi một session |
| POST | `/me/sessions/revoke-all` | Session + CSRF | Implemented | Thu hồi mọi session, trừ/bao gồm hiện tại theo request |

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
| GET | `/weddings/{weddingId}/content` | Owner | Implemented | Lấy canonical content và theme/section config theo surface |
| PUT | `/weddings/{weddingId}/content` | Owner | Implemented | Lưu canonical content, template selection và section/theme config theo revision; nếu surface đang public thì chuyển về draft và thu hồi snapshot live, không tạo publication version mới |
| POST | `/weddings/{weddingId}/publish` | Owner | Implemented | Validate config/media rồi tạo immutable snapshot; retry cùng payload trả snapshot live |
| POST | `/weddings/{weddingId}/unpublish` | Owner | Implemented | Thu hồi public pointer của đúng surface |
| POST | `/weddings/{weddingId}/preview-token` | Owner/editor | Planned | Tạo draft preview token |
| GET | `/slugs/weddings/{slug}/availability` | Session | Implemented | Kiểm tra slug đang được một publication live sử dụng |

Wedding base hiện owner-only theo ADR 0008. `WeddingMember` vẫn được tạo để giữ invariant dữ liệu nhưng chưa có API quản trị thành viên. Dashboard trả `views: null` cho từng publication surface cho đến khi analytics tracking được triển khai; không dùng số giả.

## Templates và media

| Method | Path | Auth | Trạng thái | Mục đích |
|---|---|---|---|---|
| GET | `/templates` | Session | Implemented | Danh sách template/version khả dụng |
| GET | `/templates/{templateKey}/versions/{version}` | Session | Implemented | Metadata/config immutable của một version |
| GET | `/admin/templates` | Platform admin | Implemented | Danh sách template/version, `pendingReviewCount`, usage theo selection, compatibility và tối đa 10 audit event/version |
| POST | `/admin/templates/sync` | Platform admin + CSRF | Implemented | Đồng bộ gói phát hành template; tạo version chờ duyệt, idempotent theo hash |
| GET | `/admin/templates/{templateKey}/versions/{version}` | Platform admin | Implemented | Chi tiết config và trạng thái duyệt của version |
| POST | `/admin/templates/{templateKey}/versions/{version}/release` | Platform admin + CSRF | Implemented | Phát hành version cho catalog user; từ chối `TEMPLATE_VERSION_INCOMPATIBLE` khi contract version/config không được runtime hỗ trợ |
| POST | `/admin/templates/{templateKey}/versions/{version}/deprecate` | Platform admin + CSRF | Implemented | Ngừng phân phối version, không xóa tham chiếu cũ |
| POST | `/weddings/{weddingId}/media/upload-intents` | Owner | Implemented | Tạo presigned/fake upload intent có giới hạn MIME/size |
| PUT | `/weddings/{weddingId}/media/{mediaId}/upload` | Owner, local fake storage | Implemented | Upload bytes cho fake storage local |
| POST | `/weddings/{weddingId}/media/{mediaId}/complete` | Owner | Implemented | Xác minh object/size/MIME khả dụng rồi chuyển asset READY |
| GET | `/weddings/{weddingId}/media` | Owner | Implemented | Danh sách media |
| DELETE | `/weddings/{weddingId}/media/{mediaId}` | Owner | Implemented | Xóa/retire media |

## Nhạc nền dùng chung

| Method | Path | Auth | Trạng thái | Mục đích |
|---|---|---|---|---|
| GET | `/music-tracks` | Session + content permission | Planned | Catalog track `ACTIVE` cho editor |
| GET | `/music-tracks/{trackId}` | Session + content permission | Planned | Metadata/preview track khả dụng |
| GET | `/admin/music-tracks` | Platform admin | Planned | Quản lý mọi trạng thái và usage summary |
| POST | `/admin/music-tracks/upload-intents` | Platform admin | Planned | Tạo audio upload intent và draft track |
| POST | `/admin/music-tracks/{trackId}/complete` | Platform admin | Planned | Xác minh object/metadata, hoàn tất xử lý |
| PATCH | `/admin/music-tracks/{trackId}` | Platform admin | Planned | Sửa metadata/license theo revision |
| POST | `/admin/music-tracks/{trackId}/activate` | Platform admin | Planned | Phân phối track đã READY và đủ license |
| POST | `/admin/music-tracks/{trackId}/retire` | Platform admin | Planned | Ngừng phân phối nhưng giữ snapshot live |

Contract chi tiết, invariant và test gate xem [backend nhạc nền cưới](../modules/background-music.md).

## Guests và guest links

| Method | Path | Auth | Trạng thái | Mục đích |
|---|---|---|---|---|
| GET/POST | `/weddings/{weddingId}/guests` | Owner | Implemented | List/filter hoặc tạo guest; response có guest slug |
| GET/PATCH/DELETE | `/weddings/{weddingId}/guests/{guestId}` | Owner | Implemented | Đọc/cập nhật/soft-delete guest |
| POST | `/weddings/{weddingId}/guests/bulk-delete` | Owner | Implemented | Soft-delete nhiều guest |
| POST | `/weddings/{weddingId}/guests/bulk-assign-category` | Owner | Implemented | Gắn/gỡ category nhiều guest |
| GET/POST | `/weddings/{weddingId}/guest-categories` | Owner | Implemented | Cây danh mục khách |
| PATCH/DELETE | `/weddings/{weddingId}/guest-categories/{categoryId}` | Owner | Implemented | Sửa/xóa danh mục |
| GET/POST | `/weddings/{weddingId}/guest-groups` | Owner | Implemented | Đọc/tạo group khách |
| PATCH/DELETE | `/weddings/{weddingId}/guest-groups/{groupId}` | Owner | Implemented | Sửa/xóa group khách |
| POST | `/weddings/{weddingId}/guests/import/preview` | Guest write policy | Implemented | Validate import |
| POST | `/weddings/{weddingId}/guests/import/commit` | Guest write policy | Implemented | Commit import và sinh slug |
| GET | `/weddings/{weddingId}/guests/export` | Guest access policy | Implemented | Export guest fields |

Không có route Invitation. Link cá nhân sử dụng `Guest.slug`; guest slug do BE sinh và ổn định sau khi tạo.

## Planning, gift ledger và recap

| Method | Path | Auth | Trạng thái | Mục đích |
|---|---|---|---|---|
| GET/POST | `/weddings/{weddingId}/tasks` | Owner | Implemented | List/filter hoặc tạo task, có thể gắn event và parent task |
| GET/PATCH/DELETE | `/weddings/{weddingId}/tasks/{taskId}` | Owner | Implemented | Đọc/cập nhật/xóa mềm task với revision |
| POST | `/weddings/{weddingId}/tasks/reorder` | Owner | Implemented | Reorder tối đa 200 task |
| POST | `/weddings/{weddingId}/tasks/bulk-status` | Owner | Implemented | Đổi status tối đa 200 task |
| POST | `/weddings/{weddingId}/tasks/bulk` | Owner | Implemented | Tạo atomic nhiều root task từ FE checklist preset |
| — | Checklist preset | FE source | MVP | Preset static, không có API catalog/admin management |
| GET/POST | `/weddings/{weddingId}/gift-ledger` | Owner only | Implemented | List/filter hoặc ghi nhanh entry riêng tư; guestId tùy chọn |
| GET/PATCH/DELETE | `/weddings/{weddingId}/gift-ledger/{entryId}` | Owner only | Implemented | Đọc/sửa theo revision/xóa mềm entry |
| GET | `/weddings/{weddingId}/gift-ledger/summary` | Owner only | Implemented | Tổng hợp tiền theo currency, vàng theo unit/type, quà và trạng thái |
| GET | `/weddings/{weddingId}/gift-ledger/export` | Owner only | Implemented | Export CSV riêng tư |
| POST | `/weddings/{weddingId}/gift-ledger/{entryId}/promote-to-guest` | Owner only | Implemented | Tạo Guest từ tên nhập nhanh và liên kết entry |
| POST | `/weddings/{weddingId}/gift-ledger/{entryId}/link-guest` | Owner only | Implemented | Liên kết entry với Guest có sẵn |
| POST | `/weddings/{weddingId}/gift-ledger/{entryId}/unlink-guest` | Owner only | Implemented | Gỡ liên kết, giữ nguyên entry |
| GET/PUT | `/weddings/{weddingId}/recap` | Recap policy | Implemented | Read/save recap draft with revision |

## Public API

| Method | Path | Auth | Trạng thái | Mục đích |
|---|---|---|---|---|
| GET | `/public/invitations/{weddingSlug}` | Public | Implemented | Snapshot thiệp online theo Wedding slug |
| GET | `/public/invitations/{weddingSlug}/{guestSlug}` | Public | Implemented | Resolve trực tiếp Guest theo Wedding + guest slug |
| POST | `/public/weddings/{slug}/rsvps` | Public + origin guard | Implemented | RSVP URL chung, guestId null |
| POST | `/public/weddings/{slug}/wishes` | Public + origin guard | Implemented | Wish URL chung, guestId null |
| PUT | `/public/invitations/{weddingSlug}/{guestSlug}/rsvp` | Public | Implemented | RSVP cá nhân, lưu guestId trực tiếp |
| POST | `/public/invitations/{weddingSlug}/{guestSlug}/wishes` | Public | Implemented | Wish cá nhân, lưu guestId trực tiếp |
| GET | `/public/recaps/{weddingSlug}` | Public | Implemented | Published recap snapshot |

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
| GET/POST | `/admin/template-styles` | Platform admin; POST + CSRF | Planned | Liệt kê/tạo danh mục phong cách dùng chung cho invitation, website và recap |
| PATCH/DELETE | `/admin/template-styles/{styleId}` | Platform admin + CSRF | Planned | Sửa hoặc archive danh mục phong cách; không xóa cứng khi còn template sử dụng |
| GET | `/admin/templates/{templateKey}/styles` | Platform admin | Planned | Lấy các danh mục phong cách đang gán cho template |
| PUT | `/admin/templates/{templateKey}/styles` | Platform admin + CSRF | Planned | Thay toàn bộ danh sách style của một template trong một transaction; hỗ trợ gán nhiều style một lần |
| POST/DELETE | `/admin/templates/{templateKey}/styles/{styleId}` | Platform admin + CSRF | Planned | Gán thêm hoặc gỡ một danh mục phong cách khỏi template |
