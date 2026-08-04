# Authentication và authorization contract

## Authentication

- Owner/admin surface dùng server-managed session qua cookie `HttpOnly`, `Secure`, `SameSite` phù hợp.
- Session ID đủ entropy, lưu/hash theo thiết kế của library; rotate sau login, privilege change và security event.
- Password/reset/verification dùng library uy tín, token một lần và có expiry.
- Không nhận actorId, weddingId authorization claim hoặc role đáng tin từ request body.
- MFA và step-up authentication ưu tiên platform admin, export nhạy cảm và break-glass support.

Library/provider cụ thể cần ADR sau spike; contract security không phụ thuộc một vendor.

## Actor context

Application use case nhận context typed:

```ts
type ActorContext =
  | { kind: 'user'; userId: string; sessionId: string }
  | { kind: 'platformAdmin'; adminId: string; sessionId: string; assurance: 'base' | 'stepUp' }
  | { kind: 'invite'; invitationId: string; weddingId: string }
  | { kind: 'anonymous'; fingerprint?: string };
```

Đây là contract minh họa; schema thực phải được test và không serialize nguyên context vào log.

## Authorization order

1. Xác thực actor.
2. Load resource tối thiểu theo ID/token.
3. Xác định tenant/wedding ownership.
4. Áp dụng role + resource policy + state transition.
5. Thực thi query/mutation trong boundary đã authorize.
6. Ghi audit khi hành động nhạy cảm.

Không authorize chỉ bằng route prefix hoặc role toàn cục. Mọi nested resource phải chứng minh thuộc cùng wedding.

## Permission policy

- Policy là function/service có test matrix, không rải `if (role === ...)` ở route/repository.
- Deny by default.
- Query list luôn scope theo tenant trong chính query; không load toàn bộ rồi filter trong memory.
- Gift ledger owner-only trước mọi read/write/export.
- Platform admin không mặc định đọc dữ liệu riêng tư; break-glass cần reason, step-up, thời hạn và audit.

## Public token

- Invite token tối thiểu 128-bit entropy, truyền qua HTTPS, backend chỉ lưu hash.
- Token scope vào một invitation/wedding và có status/expiry/revocation policy.
- Response không làm lộ token hợp lệ/không hợp lệ qua detail hoặc timing rõ ràng hơn mức cần thiết.
- Không đưa raw token vào URL analytics, log, error tracking hoặc referrer bên thứ ba.

## Test bắt buộc

- Cross-tenant denial cho mọi resource family.
- Role matrix positive/negative.
- Nested ID mismatch.
- Revoked/expired token.
- Session fixation/rotation, CSRF/origin và logout invalidation.
- Gift ledger denial cho editor, guest manager, viewer, admin và public.
