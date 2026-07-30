# Bảo mật và vận hành

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

## Observability và recovery

- JSON log: requestId, route, status, duration; error tracking/tracing có release.
- Metrics: error rate, p95 latency, auth failure, reject/spam, queue lag, DB/storage.
- PostgreSQL backup + point-in-time recovery; object versioning; diễn tập restore.
- MVP mục tiêu ban đầu RPO <= 24h, RTO <= 8h; siết trước paid launch.
- Runbook: restore DB, compromised account, leaked secret, bad deploy, provider outage.
- Registry áp dụng immutable tags/retention; production deploy theo image digest để rollback đúng artifact.

## Production checklist

Threat model, auth/IDOR/token tests, abuse controls, privacy/terms, delete/export, restore/rollback drill, load test burst RSVP, accessibility và Core Web Vitals.
