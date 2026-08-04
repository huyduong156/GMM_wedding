# Scalability và reliability

## Nguyên tắc

- Đo trước khi scale; capacity planning dựa trên request rate, latency, DB connection, queue lag và storage throughput.
- Stateless web replica; session, media và job state nằm ngoài container.
- Scale database theo query/index/schema trước read replica hoặc partition.
- Degrade gracefully: provider email lỗi không làm RSVP thất bại nếu dữ liệu chính đã commit.

## Reliability patterns

| Vấn đề | Pattern |
|---|---|
| Client retry mutation | Idempotency key + stored result/window |
| Concurrent editor save | Revision/ETag + `409 Conflict` |
| Side effect sau transaction | Transactional outbox |
| Provider transient failure | Timeout + bounded retry + exponential backoff/jitter |
| Provider outage | Circuit breaker chỉ khi có metric/tuning; queue hoặc fail-fast |
| Duplicate job delivery | Idempotent processor + unique business key |
| Thundering herd | Cache jitter, request coalescing khi cần |
| Large import/export | Streaming/chunking + async job + signed download |
| Hot public page | Immutable snapshot + CDN/ETag/SWR |

## Database scale

- Index theo query thực; mọi index mới ghi query/use case hỗ trợ.
- List endpoint dùng cursor pagination ổn định, tránh offset lớn.
- Chặn N+1 bằng query review và integration test có query-count khi cần.
- Pool connection theo tổng replica và DB limit; readiness fail khi dependency bắt buộc không sẵn sàng.
- Partition/archive chỉ khi table size và query plan chứng minh lợi ích.

## Capacity gates

Không đưa Redis, queue hoặc read replica chỉ vì dự đoán. Mỗi thay đổi hạ tầng cần ghi:

- Metric/bottleneck hiện tại.
- Mục tiêu latency/throughput/reliability.
- Failure mode mới và chi phí vận hành.
- Rollback plan.

## SLO foundation

Trước beta, định nghĩa SLI cho API availability, p95 latency, publish success, RSVP success và queue processing. Error budget dùng để ưu tiên reliability so với feature. Giá trị SLO cụ thể phải dựa trên baseline/load test, không tự đặt số đẹp thiếu dữ liệu.

