# Observability, SLO và recovery

## Ba tín hiệu chính

### Logs

Structured JSON gồm timestamp, level, service, environment, release, requestId/traceId, route template, status, duration và error code. Actor/resource ID chỉ log dạng cần thiết; không log password, cookie, raw invite token, QR/bank data hoặc request body mặc định.

### Metrics

- HTTP rate/error/duration theo route template, không theo raw URL.
- DB pool usage, query latency và transaction failure.
- Auth failure, rate-limit rejection và abuse signal.
- Publish/RSVP/wish success rate.
- Queue depth, oldest job age, retries và dead letters.
- Storage/email/provider latency và error.

### Traces

Trace request -> use case -> database/provider -> outbox/job bằng propagated context. Sampling theo môi trường và error/latency; attribute không chứa PII.

## Health endpoints

- **Liveness:** process/event loop còn sống; không phụ thuộc provider ngoài.
- **Readiness:** config hợp lệ và dependency bắt buộc như database sẵn sàng trong timeout ngắn.
- Không expose secret, version dependency chi tiết hoặc stack trace.

## SLI/SLO workflow

1. Chọn user journey: login, publish, public invitation, RSVP.
2. Định nghĩa good/total event và measurement point.
3. Thu baseline staging/load test và beta.
4. Đặt SLO thực tế, alert theo burn rate thay vì mọi lỗi đơn lẻ.
5. Review error budget và điều chỉnh capacity/reliability work.

## Recovery

- PostgreSQL backup + PITR; object storage versioning khi khả thi.
- Mục tiêu foundation ban đầu: RPO <= 24h, RTO <= 8h; phải review/siết trước paid launch.
- Restore drill có biên bản: thời gian, data loss window, lỗi và action item.
- Deploy dùng immutable image digest để rollback đúng artifact.
- Migration không tương thích cần roll-forward plan; rollback app chỉ an toàn khi schema còn backward-compatible.

## Runbook tối thiểu

- Database unavailable/restore.
- Bad deploy hoặc migration.
- Leaked secret/session compromise.
- Email/storage/cache provider outage.
- Queue backlog/dead letter tăng.
- Abuse spike trên RSVP/wishes.

Mỗi runbook nêu signal, impact, owner, containment, recovery, verification và post-incident follow-up.

