# Error, pagination, idempotency và concurrency

## Error model

API không trả stack trace, Prisma error hoặc provider message. Error response ổn định:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dữ liệu không hợp lệ",
    "fieldErrors": { "slug": ["Slug đã được sử dụng"] },
    "requestId": "req_..."
  }
}
```

Error code là machine-readable contract; message có thể localization. Mapping chuẩn:

| Nhóm | HTTP | Ví dụ |
|---|---:|---|
| Validation | 400 hoặc 422 theo convention đã khóa | `VALIDATION_ERROR` |
| Authentication | 401 | `AUTHENTICATION_REQUIRED` |
| Authorization | 403/404 theo anti-enumeration policy | `FORBIDDEN` |
| Not found | 404 | `RESOURCE_NOT_FOUND` |
| Conflict | 409 | `REVISION_CONFLICT`, `SLUG_TAKEN` |
| Rate limit | 429 | `RATE_LIMITED` + `Retry-After` |
| Dependency unavailable | 503 | `SERVICE_UNAVAILABLE` |
| Unexpected | 500 | `INTERNAL_ERROR` |

## Cursor pagination

- Cursor opaque, được ký hoặc encode từ stable sort key + unique tie-breaker.
- Sort order deterministic; mặc định `createdAt desc, id desc` khi phù hợp.
- `limit` có default và hard maximum.
- Response gồm `items`, `pageInfo.nextCursor`, `pageInfo.hasNextPage`; count chỉ trả khi use case cần và cost chấp nhận.
- Filter/sort change làm cursor cũ không hợp lệ hoặc cursor phải bind query fingerprint.

## Optimistic concurrency

- Editable aggregate có `revision` tăng đơn điệu hoặc ETag mạnh.
- Client gửi `If-Match`/revision cho mutation có nguy cơ lost update.
- Mismatch trả `409` hoặc `412` theo convention được khóa trong OpenAPI, kèm revision hiện tại tối thiểu nếu an toàn.
- Không dùng last-write-wins cho content/editor, publish state hoặc dữ liệu nhạy cảm.

## Idempotency

- Mutation public dễ retry như RSVP, publish, import commit và provider webhook có idempotency key/business key.
- Store scope gồm actor/route/key/request hash/status/result reference/expiry.
- Cùng key khác payload trả conflict.
- Worker và webhook consumer phải chịu at-least-once delivery.

## Timeout và cancellation

- Mọi network/provider call có timeout hữu hạn.
- Request abort được truyền xuống operation có thể cancel.
- Không retry lỗi validation, authorization hoặc business conflict.
- Retry phải bounded, có jitter và observability.

