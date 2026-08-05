# Security và privacy

Tài liệu này tập trung threat/control/privacy. Logging, metrics, SLO, backup và incident runbook xem [observability and recovery](./observability-and-recovery.md); runtime/container hardening xem [deployment and runtime](./deployment-and-runtime.md).

## Rủi ro ưu tiên

Account takeover, IDOR/cross-tenant, đoán slug/token, spam RSVP/wish, upload độc hại, XSS, PII trong log/analytics/backup và mất dữ liệu do migration/deploy.

## Kiểm soát bắt buộc

- Password hash theo auth library uy tín; email/reset token ngắn hạn một lần.
- Cookie `HttpOnly`, `Secure`, `SameSite`; CSRF/origin check.
- Authorization theo resource ở mọi endpoint/service; test cross-tenant bắt buộc.
- Invite token >=128-bit entropy, chỉ lưu hash.
- Rate limit theo IP + wedding/token; honeypot và CAPTCHA thích ứng.
- Escape/sanitize output, CSP nghiêm; user không được chạy script template.
- Xác minh MIME thực, giới hạn size/quota, server-generated filename, scan file khi khả thi.
- Secret trong secret manager/env; security headers và dependency audit.
- Container chạy non-root, filesystem read-only khi khả thi, drop Linux capabilities không cần thiết và không mount Docker socket.
- Base image được pin, scan CVE trong CI và rebuild định kỳ để nhận security patch.

## Quyền riêng tư

- Snapshot public không chứa phone/email/note/group/guest list.
- Gift ledger là dữ liệu tài chính cá nhân owner-only: không đưa vào public snapshot, analytics, search, notification hoặc application log; export cần re-authentication trước production.
- Recap snapshot chỉ chứa media/content và lời chúc approved đã được owner chọn; bỏ guestId, contact và moderation metadata.
- Invite API chỉ trả dữ liệu tối thiểu của đúng lời mời.
- Data minimization, export/delete và retention policy cho soft-delete/log/backup.
- Redact token/PII khỏi log; analytics/cookie có consent phù hợp.
- Trước production rà quy định pháp lý tại Việt Nam và thị trường phục vụ.

## Security production checklist

Threat model, auth/IDOR/token tests, abuse controls, privacy/terms, delete/export, restore/rollback drill, load test burst RSVP, accessibility và Core Web Vitals.

## API documentation exposure

Swagger UI `/api-docs` và raw contract `/api/openapi` cùng được khóa bằng server-side `API_DOCS_ENABLED`; khi tắt đều trả 404. Local Compose bật để phát triển, còn production mặc định không bật. Nếu cần mở ngoài local/internal network, phải đặt sau admin authentication hoặc network access control; feature flag không thay thế authorization. Swagger asset được self-host, external validator và “Try it out” bị tắt mặc định.
