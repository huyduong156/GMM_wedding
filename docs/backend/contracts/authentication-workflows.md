# Authentication workflows and implementation runbook

Tài liệu này mô tả luồng xử lý auth từ HTTP request đến database và cách kiểm chứng khi implementation bắt đầu. Security contract và permission policy xem [authentication and authorization](./authentication-and-authorization.md); schema field xem [database schema reference](../data/database-schema-reference.md).

## Trạng thái và phạm vi base branch

| Thành phần | Trạng thái |
|---|---|
| User/Account/Session/VerificationToken schema | Implemented |
| Actor context, opaque token và cookie policy primitives | Implemented |
| Register/login/logout/verify/reset route | Planned |
| Password hashing adapter | Planned; phải chọn/thử nghiệm thư viện trước implementation |
| Email delivery adapter | Planned |
| CSRF/origin middleware | Planned |
| Auth integration/security tests | Planned |

Base branch không tạo endpoint auth giả. Route catalog giữ `Planned` cho đến khi handler, OpenAPI, policy, persistence và test cùng tồn tại.

## Quyết định nền

- Owner và admin dùng server-managed opaque session, không dùng access JWT chứa role/wedding permission lâu hạn.
- Browser nhận raw session token qua cookie; database chỉ lưu SHA-256 hash trong `Session.sessionHash`.
- Token có 256-bit entropy; verification/reset/invitation token tối thiểu 128-bit và cũng chỉ lưu hash.
- Cookie production tên `__Host-gmm_session`, `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/`, không có `Domain`.
- Local HTTP dùng `gmm_session` vì cookie prefix `__Host-` bắt buộc HTTPS.
- Session có idle TTL 24 giờ và absolute TTL 30 ngày. Mỗi request hợp lệ kiểm tra cả hai; cập nhật `lastSeenAt` theo nhịp giới hạn, không write mọi request.
- Rotate session sau login, đổi password, nâng quyền hoặc security event. Logout/revoke đặt `revokedAt`, không hard-delete ngay vì cần audit.
- Password không bao giờ tự hash bằng SHA/bcrypt handwritten. Adapter phải dùng thư viện uy tín với Argon2id hoặc policy tương đương đã benchmark.
- Authentication xác định actor; authorization vẫn load membership/resource ở mỗi use case. Không đưa wedding role vào session như nguồn quyền lâu hạn.

Các giá trị nền nằm tại `backend/src/platform/auth/`; thay đổi TTL/cookie/token policy phải cập nhật tài liệu và test.

## Luồng request đã đăng nhập

```text
Cookie raw session token
  -> parse cookie, reject malformed/oversized value
  -> SHA-256 token
  -> query Session by sessionHash
  -> reject missing/revoked/absolute-expired/idle-expired
  -> load active User
  -> derive ActorContext
  -> origin/CSRF check cho mutation
  -> application use case
  -> resource + membership authorization
  -> response; refresh lastSeenAt có throttle
```

Không log cookie, raw token, password, password hash hoặc actor context đầy đủ. Log tối thiểu `requestId`, kết quả auth tổng quát và internal session ID khi policy cho phép.

## Đăng ký

Endpoint dự kiến: `POST /api/auth/register`.

1. Normalize email bằng trim + lowercase; validate password/display name.
2. Rate limit theo IP và email hash; chống enumeration trong response.
3. Hash password qua `PasswordHasher` adapter.
4. Transaction tạo `User(PENDING_VERIFICATION)` và `VerificationToken(purpose=emailVerification)`.
5. Outbox event yêu cầu gửi email sau commit.
6. Trả response trung tính; không trả password hash/token database.
7. Email link chứa raw token một lần; backend hash token để lookup.

Duplicate email trả response không tiết lộ tài khoản tồn tại nếu threat model yêu cầu. Nếu resend verification, revoke/expire token cũ theo policy.

## Xác minh email

Endpoint dự kiến: `POST /api/auth/verify-email`.

1. Hash token nhận được và lookup token đúng purpose.
2. Reject token missing, used hoặc expired bằng error không hỗ trợ enumeration.
3. Transaction đặt `User.emailVerifiedAt`, chuyển status sang `ACTIVE`, đặt `usedAt` và ghi audit/outbox.
4. Không tự login trừ khi flow product và threat review chấp nhận; mặc định yêu cầu login rõ ràng.

## Login

Endpoint dự kiến: `POST /api/auth/login`.

1. Validate payload và rate limit theo IP + email hash.
2. Query user bằng email lowercase; luôn chạy password verification có timing gần tương đương kể cả user không tồn tại.
3. Reject user chưa verify, suspended hoặc deleted bằng error policy phù hợp.
4. Revoke session tiền nhiệm nếu phát hiện fixation/security event.
5. Sinh raw token 256-bit; lưu hash, expiry, `lastSeenAt`, IP hash và user-agent đã giới hạn.
6. Set session cookie theo `getSessionCookiePolicy()`.
7. Cập nhật `lastLoginAt`, ghi audit; response không trả raw session token trong JSON.

Login thành công không nhúng membership role vào cookie. Platform admin cần policy MFA/step-up riêng trước production.

## Logout và quản lý session

Endpoint dự kiến: `POST /api/auth/logout`.

1. Authenticate session hiện tại.
2. Đặt `revokedAt` idempotently.
3. Xóa cookie bằng cùng name/path/security attributes.
4. Trả `204`; gọi lại vẫn thành công.

“Logout all devices” revoke toàn bộ active session của user trong transaction và giữ session record tới hết retention.

## Quên và đặt lại password

Endpoint dự kiến: `POST /api/auth/forgot-password` và `POST /api/auth/reset-password`.

Forgot password luôn trả response trung tính. Nếu user hợp lệ, tạo token purpose `passwordReset` có TTL ngắn và gửi qua outbox/email.

Reset password:

1. Hash và kiểm tra token một lần/expiry.
2. Validate password mới và hash qua adapter.
3. Transaction cập nhật `passwordHash`, đánh dấu token used, revoke mọi session và ghi audit.
4. Không tự đăng nhập; user đăng nhập lại để nhận session mới.

## Actor và authorization

`ActorContext` là discriminated union tại `backend/src/platform/auth/actor-context.ts`:

- `anonymous`: chưa xác thực.
- `invite`: invitation đã xác minh token, chỉ có scope đúng invitation/wedding.
- `user`: user/session hợp lệ.
- `platformAdmin`: admin hợp lệ cùng mức assurance.

Use case nhận actor từ composition layer, không nhận `userId`, `adminId` hoặc trusted role từ request body. Trình tự authorize:

1. Xác thực actor.
2. Load resource tối thiểu.
3. Chứng minh resource thuộc wedding.
4. Query active `WeddingMember` của actor.
5. Áp dụng policy/state transition.
6. Mutation trong transaction; audit khi nhạy cảm.

Platform admin không mặc định đọc gift ledger hoặc guest PII. Break-glass cần reason, step-up, expiry và audit riêng.

## CSRF, CORS và origin

- Cookie session khiến mutation phải kiểm tra `Origin`/`Host` theo allowlist `APP_ORIGIN`.
- `SameSite=Lax` là defense-in-depth, không thay origin/CSRF policy.
- Không bật wildcard credentialed CORS.
- Request không phải browser phải dùng contract credential riêng được review, không tái sử dụng cookie tùy tiện.
- GET/HEAD/OPTIONS không mutate state.

## Error contract

| Tình huống | HTTP/code đề xuất |
|---|---|
| Payload sai | `422 VALIDATION_ERROR` |
| Credential sai | `401 INVALID_CREDENTIALS` |
| Thiếu session | `401 AUTHENTICATION_REQUIRED` |
| Session hết hạn/revoke | `401 SESSION_EXPIRED` |
| Email chưa xác minh | `403 EMAIL_VERIFICATION_REQUIRED` |
| User suspended | `403 ACCOUNT_SUSPENDED` |
| Origin/CSRF sai | `403 REQUEST_ORIGIN_REJECTED` |
| Rate limit | `429 RATE_LIMITED` |

Message public không xác nhận email/token có tồn tại. Response không trả stack trace, Prisma error hoặc hash.

## Code boundary dự kiến

```text
src/
  app/api/auth/...                 HTTP adapters
  modules/identity/
    domain/                        user/session rules
    application/                   register/login/logout/verify/reset use cases
    infrastructure/                Prisma repositories
    interface/                     request/response schemas
    index.ts                       public module API
  platform/auth/
    actor-context.ts
    opaque-token.ts
    session-policy.ts
    password-hasher.ts             planned adapter contract
    request-authenticator.ts       planned composition
```

Route chỉ parse/validate, gọi use case, set/clear cookie và map response. Không query Prisma hoặc verify password trực tiếp trong route.

## Cách chạy và kiểm thử khi auth được triển khai

```powershell
docker compose -f .\backend\compose.yaml up -d postgres
npm --prefix .\backend ci
npm --prefix .\backend run db:migrate:deploy
npm --prefix .\backend run db:seed
npm --prefix .\backend run dev
```

Postman dùng `baseUrl=http://localhost:3000/api`, bật cookie jar và chạy theo thứ tự:

1. register;
2. verify email bằng token fixture/dev email adapter;
3. login và xác nhận cookie;
4. `GET /me`;
5. mutation wedding để kiểm tra session + origin;
6. logout;
7. gọi lại `/me` phải nhận 401.

Không lấy verification token/password thật từ log. Test environment dùng email adapter in-memory hoặc fixture có scope rõ.

## Test bắt buộc trước khi đổi route sang Implemented

- Register normalization, duplicate email và transaction rollback.
- Password verify đúng/sai với timing policy; hash không xuất hiện trong response/log.
- Verification/reset token missing, expired, used và wrong purpose.
- Session cookie attributes ở local/production.
- Session expiry, idle expiry, revoke, rotation và logout idempotent.
- CSRF/origin positive/negative.
- Role matrix và cross-tenant/nested-resource denial.
- Platform admin assurance và gift-ledger denial.
- Rate limit và generic response chống enumeration.

## Quyết định còn phải khóa trước auth implementation

Một PR/ADR auth riêng phải chọn và benchmark:

- Password hashing package và parameters trên production runtime.
- Email provider/dev email adapter.
- CSRF implementation cụ thể.
- Session cleanup/retention job.
- MFA/step-up provider cho platform admin.

Những quyết định này không ngăn base structure hoàn tất, nhưng là gate trước khi gọi auth là production-ready.
