# Background jobs và transactional outbox

## Khi nào dùng job

Chuyển khỏi HTTP request khi operation chậm, có provider ngoài, cần retry/delay, chạy theo batch hoặc không cần hoàn tất trước response: media processing, email, import/export, cache purge, retention và notification.

Không dùng queue để che business transaction chưa rõ hoặc cho mutation nhỏ cần consistency tức thời.

## Job contract

Mỗi job định nghĩa:

- `jobType` và payload version.
- Stable business key/idempotency key.
- Tenant/resource reference tối thiểu.
- Attempt, createdAt và correlation/requestId.
- Timeout, retry class và retention.
- PII classification; payload tránh raw token và dữ liệu nhạy cảm.

## Transactional outbox

Mutation ghi business state và outbox record trong cùng PostgreSQL transaction. Dispatcher claim record bằng lease/`SKIP LOCKED`, publish/enqueue, rồi đánh dấu delivered. Consumer vẫn idempotent vì delivery có thể lặp.

Outbox không cần triển khai trước mọi feature. Bắt buộc khi mất side effect sau commit gây sai trạng thái đáng kể, ví dụ publish cache invalidation hoặc notification nghiệp vụ quan trọng.

## Retry policy

- Chỉ retry transient failure: timeout, 429, selected 5xx, connection reset.
- Exponential backoff + jitter, giới hạn attempt/thời gian tổng.
- Permanent failure như invalid recipient/payload chuyển failed/dead-letter ngay.
- Dead-letter có runbook inspect, redact-safe payload và replay có audit.

## Worker runtime

- Worker là process/container riêng dùng cùng codebase, không chạy loop trong web replica.
- Concurrency theo dependency capacity, không chỉ CPU.
- Graceful shutdown: ngừng claim, hoàn tất/abandon lease an toàn, flush telemetry.
- Heartbeat/lease để job được reclaim sau crash.
- Queue depth, oldest age, success/failure/retry duration là metric bắt buộc.

## Scheduled work

Scheduler chỉ enqueue command/job idempotent. Một scheduler leader hoặc external scheduler gọi endpoint/CLI được bảo vệ; không để mỗi replica tự chạy cron.

