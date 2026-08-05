# Authentication implementation design

## Mục tiêu và trạng thái

Tài liệu này biến authentication contract thành thiết kế triển khai cho nhánh `BE-project/Auth-system`. Source of truth quyết định dài hạn là [ADR 0006](../../shared/architecture/adr/0006-server-managed-session-authentication.md).

Trạng thái: design-ready, implementation chưa bắt đầu. Không đổi route catalog/OpenAPI sang `Implemented` cho đến khi code, migration, test và image smoke cùng tồn tại.

## Identity và role model

Theo [ADR 0007](../../shared/architecture/adr/0007-single-identity-and-platform-role-assignments.md), owner và platform admin dùng chung một `User` identity, credential và session. Không tạo hai bảng `User`/`Admin` độc lập.

Target schema trước production auth:

```text
User 1 ── * Session
User 1 ── * UserRole
User 1 ── * WeddingMember * ── 1 Wedding
Rank 1 ── * User
User 1 ── * Subscription
```

- `UserRole`: quyền hệ thống, có grant/revoke/expiry/audit; một user có thể có nhiều role.
- `WeddingMember`: role theo từng wedding; độc lập platform role.
- `Rank` + `User.rankId`: cấp bậc hiện tại; chỉ thêm `RankLog` nếu cần lịch sử và không dùng rank để cấp permission.
- `Subscription`: gói sản phẩm; không cấp admin permission trực tiếp.
- `PlatformAdminActor` dùng `userId`, không tạo namespace `adminId` thứ hai.
- Public register không bao giờ nhận platform role. Admin provisioning là audited command/use case riêng và production yêu cầu MFA/step-up.
- `User.platformRole` hiện tại là compatibility field của foundation; migration auth dùng expand-contract để thêm `UserRole`, chuyển read path rồi mới loại field này.

## Phạm vi vertical slice đầu tiên

| Method | Path | Kết quả thành công | Ghi chú |
|---|---|---|---|
| `POST` | `/api/auth/register` | `202` generic acknowledgment | Không lộ email mới/trùng |
| `POST` | `/api/auth/verify-email` | `204` | Token một lần, không auto-login |
| `POST` | `/api/auth/login` | `200` user DTO + `Set-Cookie` | Rotate bằng session mới |
| `POST` | `/api/auth/admin/login` | `200` user DTO + `Set-Cookie` | Credential chung; bắt buộc active `ADMIN` assignment |
| `GET` | `/api/me` | `200` user DTO | `Cache-Control: no-store` |
| `GET` | `/api/admin/me` | `200` user DTO + platform actor | Guard mẫu cho admin API |
| `POST` | `/api/auth/logout` | `204` + clear cookie | Idempotent |

Ngoài slice: resend verification, list/revoke sessions, OAuth, MFA UI và wedding authorization. Forgot/reset password cho user đã được bổ sung: response forgot luôn trung tính, token tồn tại 30 phút/dùng một lần, reset revoke toàn bộ session; active `ADMIN` assignment không được recovery qua flow public này.

Owner và admin login dùng chung credential verifier và session store nhưng có policy HTTP riêng. Login owner chấp nhận mọi `User ACTIVE`, kể cả người đồng thời có platform role; login admin chỉ tạo session sau khi kiểm tra active `UserRole.ADMIN`. Mọi API admin tiếp tục gọi `requirePlatformAdmin()`; URL login riêng không phải authorization boundary.

Local/test có thể đặt `AUTH_RATE_LIMIT_DRIVER=disabled` để test thủ công không bị giữ counter. Cấu hình này bị từ chối khi `APP_ENV` là `staging` hoặc `production`; production vẫn bắt buộc Redis.

## HTTP DTO

```ts
type RegisterRequest = {
  email: string
  password: string
  displayName?: string
}

type VerifyEmailRequest = { token: string }
type LoginRequest = { email: string; password: string }

type CurrentUserResponse = {
  user: {
    id: string
    email: string
    displayName: string | null
    emailVerified: boolean
    locale: string
    timezone: string
  }
}
```

Register luôn trả cùng public body/status cho email mới, email pending và email đã tồn tại. Login chỉ trả `INVALID_CREDENTIALS` cho unknown email/wrong password; trạng thái pending/suspended chỉ được trả sau khi credential đúng. Verification token missing/expired/used trả cùng public error.

Password không trim hoặc normalize âm thầm. `PasswordPolicy` chịu trách nhiệm length/deny-list policy và giới hạn input trước khi gọi Argon2; không dùng complexity regex. Email trim + lowercase trước validation và persistence.

## Module và dependency

```text
src/
  app/api/auth/{register,verify-email,login,logout}/route.ts
  app/api/me/route.ts
  modules/identity/
    domain/
      normalize-email.ts
      account-status.ts
      identity-errors.ts
    application/
      ports/{identity-repository,password-hasher,rate-limiter,email-delivery,clock}.ts
      register-user.ts
      verify-email.ts
      login-user.ts
      get-current-user.ts
      logout-session.ts
    infrastructure/
      prisma-identity-repository.ts
      prisma-user-role-repository.ts
      redis-auth-rate-limiter.ts
      email/
    interface/
      auth-schemas.ts
      auth-dto.ts
    index.ts
  platform/auth/
    request-authenticator.ts
    origin-guard.ts
    password-hasher.ts
    token-protector.ts
  composition/auth-container.ts
  tests/integration/auth/
```

Route không import Prisma/Argon2/Redis/provider. Composition root tạo concrete adapters và inject use case. Module khác chỉ import `modules/identity/index.ts`.

## Use case và transaction

### Register

1. Validate size/content type, exact origin, Fetch Metadata và rate limit trước expensive hash.
2. Normalize email; hash password ngoài transaction.
3. Sinh verification token 256-bit, lưu SHA-256 hash.
4. Trong một transaction: tạo `User(PENDING_VERIFICATION)`, revoke token pending cũ khi cần, tạo `VerificationToken`, audit record và outbox delivery intent.
5. Outbox chỉ chứa token ciphertext có key version/AEAD metadata; không chứa raw token hoặc password. Worker decrypt ngay trước khi render email và không log URL đầy đủ.
6. Unique-email race map về generic `202`, không trả Prisma error.

Verification link mở frontend route chuyên dụng với `Referrer-Policy: no-referrer`, không có third-party analytics/resource. Frontend lấy token một lần, xóa token khỏi address bar bằng `history.replaceState` rồi gửi trong JSON body đến backend; token không đi trong backend route path, analytics hoặc log.

### Verify email

1. Rate-limit, hash token và lookup đúng purpose.
2. Trong transaction dùng conditional update để token chỉ consume một lần; set `emailVerifiedAt`, `status=ACTIVE`, `usedAt` và audit.
3. Concurrent/replayed request chỉ một request thắng; các request còn lại nhận generic token error.

### Login

1. Origin/rate-limit trước Argon2; lookup normalized email.
2. Unknown email chạy verify với dummy PHC hash cùng policy để giảm timing oracle.
3. Verify credential; kiểm tra account status; opportunistic rehash ngoài transaction nếu policy cũ.
4. Sinh opaque session token 256-bit. Transaction tạo `Session` với hash, absolute expiry, metadata đã giới hạn; cập nhật `lastLoginAt` và audit.
5. Route set cookie sau commit, không đưa raw token vào JSON/log.

`Session.expiresAt` là absolute expiry. Idle expiry được tính bằng `lastSeenAt + 24h`; `lastSeenAt` chỉ update khi lần refresh trước cách hiện tại tối thiểu 5 phút bằng conditional update.

### Authenticate request và `/me`

1. Đọc đúng cookie theo environment; reject missing, oversized hoặc malformed token trước hash/query.
2. Query session hash cùng active user; reject revoked, absolute-expired, idle-expired hoặc inactive account.
3. Trả `ActorContext` tối thiểu. Không load wedding membership trong authenticator.
4. `/me` map explicit DTO, không serialize Prisma model.

### Logout

Authenticator có thể trả session hiện tại hoặc anonymous-expired state. Conditional update `revokedAt` chỉ khi chưa revoke; route luôn clear cookie bằng đúng name/path/security attributes và trả `204`.

## Security boundary

- Production cookie: `__Host-gmm_session`, `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/`, không `Domain`.
- Unsafe auth request phải có exact `Origin === APP_ORIGIN`, `Sec-Fetch-Site` không phải `cross-site`, `Content-Type: application/json` và `X-CSRF-Protection: 1`.
- CORS chỉ echo origin đã parse/so sánh chính xác, có `Access-Control-Allow-Credentials: true`, `Vary: Origin`; không wildcard.
- Email/IP rate-limit key dùng HMAC với secret riêng, không lưu/log raw email hoặc IP trong Redis key.
- Argon2 initial benchmark profile: 64 MiB, 3 iterations, parallelism 4, hash length 32. Default concurrency per replica là 2 cho tới khi benchmark memory/latency xác nhận mức khác.
- `AUTH_SECRET`, token-encryption key và rate-limit HMAC key là secret riêng, có version/rotation plan; không tái sử dụng một key cho nhiều mục đích.
- Auth log chỉ có request ID, operation, generic outcome, latency bucket và internal IDs khi cần; redact cookie, password, email/token raw và outbox ciphertext.

## Rate-limit baseline

Giá trị đầu là config có hard maximum và sẽ điều chỉnh theo metric:

- register: 5/IP/giờ và 3/email/giờ;
- verify: 10/IP/15 phút và 5/token-hash-prefix/15 phút;
- login: 10/IP/15 phút và 5/email/15 phút;
- limiter unavailable ở production: trả `503 SERVICE_UNAVAILABLE`, không fail-open;
- test dùng fake clock + in-memory adapter; không dùng sleep.

Redis là derived security state, không phải source of truth. Reset counter không được thay đổi account/session state.

## Data và migration review

Schema hiện tại đủ cho core slice nhưng migration auth phải review thêm:

- index phục vụ session lookup/revocation/cleanup (`sessionHash`, active sessions theo `userId`, expiry);
- bảng `UserRole` với active-role uniqueness, grant/revoke/expiry và audit metadata; backfill rồi loại `User.platformRole` theo expand-contract;
- constraint purpose/expiry/used state cho `VerificationToken`;
- token purpose chuyển từ free-text sang enum/check constraint hoặc application constant có database defense;
- outbox encrypted payload key version và retention;
- không sửa migration đã deploy; tạo migration mới theo expand-contract.

## Error mapping

| HTTP | Code | Dùng cho |
|---:|---|---|
| 401 | `INVALID_CREDENTIALS` | Unknown email/wrong password |
| 401 | `AUTHENTICATION_REQUIRED` | Không có session |
| 401 | `SESSION_EXPIRED` | Revoked/expired session |
| 403 | `EMAIL_VERIFICATION_REQUIRED` | Credential đúng nhưng pending |
| 403 | `ACCOUNT_SUSPENDED` | Credential đúng nhưng suspended |
| 403 | `REQUEST_ORIGIN_REJECTED` | Origin/Fetch Metadata/CSRF header sai |
| 422 | `VALIDATION_ERROR` | DTO/size/content sai |
| 429 | `RATE_LIMITED` | Có `Retry-After` |
| 503 | `SERVICE_UNAVAILABLE` | Security dependency fail-closed |

Unexpected/Prisma/provider error chỉ map thành stable internal error cùng request ID.

## Test matrix và acceptance

### Unit

- Email normalization, password policy và account state transition.
- Session absolute/idle expiry, refresh throttle và cookie policy.
- Origin/CORS guard exact match; suffix, scheme, port, missing origin và cross-site bị từ chối.
- Rate-limit key không chứa raw email/IP; token encryption round-trip và wrong-key failure.

### PostgreSQL integration

- Register transaction, duplicate race và rollback/outbox atomicity.
- Public register luôn tạo user không có platform assignment; grant/revoke role cần audited authorization riêng.
- Verification correct/wrong-purpose/expired/used/concurrent replay.
- Login success/failure/dummy verify/rehash/session persistence.
- Logout idempotent; revoked session không dùng lại được.
- Session cleanup query và indexes trên representative data.

### Route/contract

- Status/body/error/request ID, `Cache-Control: no-store`, cookie set/clear attributes.
- Credentialed CORS preflight và mutation CSRF positive/negative.
- OpenAPI matches runtime Zod DTO; no password/hash/token in response.

### Image/security gate

- Node 24 runner, current Argon2 package install/build trên Alpine.
- Benchmark p50/p95 latency, peak RSS và bounded concurrency trong image resource limit.
- Redis unavailable fails closed; PostgreSQL unavailable readiness/auth behavior đúng.
- End-to-end register -> captured email -> verify -> login -> `/me` -> logout -> `/me` 401.

## Thứ tự triển khai

1. Nâng Node 24/Docker/CI, wire environment fail-fast và benchmark Argon2; accept ADR 0006.
2. Tạo application ports, domain policy và unit tests.
3. Tạo migration/index/constraint auth cần thiết và Prisma repository integration tests.
4. Implement register + local/test email capture + encrypted outbox boundary.
5. Implement verify-email.
6. Implement login + request authenticator + `/me` + logout.
7. Implement Redis limiter, origin/CORS guard và negative security tests.
8. Cập nhật OpenAPI/route catalog sang Implemented chỉ sau full journey và image smoke xanh.
9. Slice kế tiếp: resend verification, reset password, session management, MFA/step-up và cleanup worker.
