# 0006 - Xác thực bằng opaque server session

Status: Accepted
Date: 2026-08-04

## Context

Owner workspace và platform admin xử lý dữ liệu khách mời, publication và dữ liệu tài chính riêng tư. Backend cần một authentication boundary có thể revoke ngay, không đưa role/wedding permission lâu hạn vào client và hoạt động độc lập với frontend React/Vite.

Foundation đã có `User`, `Session`, `VerificationToken`, actor context, opaque-token primitive và cookie policy. Vertical slice đầu tiên cần khóa password hashing, session resolution, CSRF/origin, rate limiting và email verification trước khi route được đánh dấu implemented.

Node 20 đã hết vòng đời ngày 2026-03-24 và không còn nhận security fix. Auth implementation không được thêm native cryptography mới trên runtime đã EOL.

## Decision

- Nâng backend/Docker baseline lên Node 24 LTS trước khi merge password authentication. Node 20 không phải production fallback; nếu cần bridge ngắn hạn chỉ dùng trong development có expiry rõ ràng.
- Owner và platform admin dùng opaque server-managed session. Browser chỉ giữ raw token trong host-only cookie; PostgreSQL chỉ lưu SHA-256 hash. Session không chứa wedding role hoặc permission snapshot.
- Password dùng `argon2` hiện hành với biến thể Argon2id. Profile bắt đầu để benchmark là `m=64 MiB`, `t=3`, `p=4`, salt 128-bit và output 256-bit. Parameters cuối phải pass latency/memory test trong đúng Node Alpine runner image; mỗi replica giới hạn hash concurrency.
- Application lưu nguyên PHC string và rehash sau login khi policy mới mạnh hơn. Password hasher là platform port; identity application không import package crypto cụ thể.
- Unsafe browser request dùng nhiều lớp: exact `Origin` allowlist, reject `Sec-Fetch-Site: cross-site`, JSON-only, custom `X-CSRF-Protection: 1` header và explicit credentialed CORS cho đúng frontend origin. `SameSite=Lax` chỉ là defense-in-depth.
- Public auth endpoint rate-limit theo IP-derived key và normalized-email HMAC. Production dùng Redis atomic counter/sliding policy; test dùng deterministic in-memory fake. Khi production limiter unavailable, register/login/verify fail closed thay vì bỏ qua bảo vệ.
- Identity module phát email qua `EmailSender` port. Test dùng in-memory capture, local dùng Mailpit, production dùng authenticated TLS adapter/provider. Registration ghi delivery intent qua transactional outbox; raw verification token chỉ tồn tại tạm thời và phần cần retry phải được mã hóa bằng key riêng, không lưu plaintext trong outbox/log.
- Slice chức năng đầu là register -> verify-email -> login -> `GET /me` -> logout. Resend verification, password reset và session management là slice kế tiếp; route chưa đủ persistence, OpenAPI và test vẫn giữ `Planned`.
- MFA không nằm trong slice chức năng đầu để giữ transaction/session boundary nhỏ, vì vậy slice này chỉ được xem là local/staging-ready. Production release phải có MFA/step-up decision và implementation: bắt buộc cho platform admin; owner MFA và step-up cho export/gift-ledger phải qua product/security review, ưu tiên WebAuthn/passkey và có recovery được audit.

## Alternatives considered

- JWT chứa role/wedding permission: loại vì revoke khó và permission dễ stale.
- Auth.js quản lý toàn bộ domain: chưa chọn vì custom verification/outbox, actor boundary và authorization theo wedding vẫn cần application contract riêng. Có thể dùng adapter sau nếu không làm rò framework type vào module.
- Chỉ dựa vào `SameSite`: loại vì không đủ thay thế exact-origin/CSRF policy.
- Gửi email trong database transaction: loại vì giữ transaction khi gọi provider và tạo failure coupling.
- Bỏ Redis để rate-limit in-memory production: loại vì nhiều replica có thể bypass limit.
- Triển khai MFA cùng register/login đầu tiên: bảo mật mạnh hơn nhưng làm tăng mạnh schema, recovery và frontend scope trước khi session core được kiểm chứng. MFA vẫn là production gate, không phải post-MVP tùy chọn vô thời hạn.

## Consequences

- Auth branch phải nâng runtime, benchmark native Argon2 trong image thật và cập nhật Docker/CI trước khi code password adapter.
- Redis chuyển từ conditional chung thành dependency production của public auth abuse controls; local/test vẫn có adapter nhẹ.
- Email verification cần worker/outbox security boundary hoặc một delivery mechanism tương đương đã review; không được ghi raw token vào database/log.
- Frontend phải gửi credential, `Content-Type: application/json` và custom CSRF header; backend chỉ trả CORS credential cho origin đã cấu hình.
- Route handler chỉ parse/map cookie; identity use case sở hữu transaction và policy. Authorization wedding tiếp tục load membership tại use case tương ứng.
- ADR chuyển sang `Accepted` sau khi Node upgrade, Argon2 Alpine benchmark và CSRF/CORS integration test pass.

## Primary references

- [Node.js release status và EOL policy](https://nodejs.org/en/about/previous-releases)
- [`argon2` project và current runtime support](https://github.com/ranisalt/node-argon2)
- [RFC 9106 Argon2 profiles](https://www.rfc-editor.org/rfc/rfc9106.html)
- [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/CSRF_Prevention_Cheat_Sheet.html)
- [Next.js authentication guidance](https://nextjs.org/docs/app/guides/authentication)
- [Nodemailer testing và SMTP transports](https://nodemailer.com/usage/testing/)
- [OWASP Multifactor Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html)
