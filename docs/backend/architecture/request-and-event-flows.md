# Request, publish và event flows

## Authenticated request

```text
Client
  -> TLS / reverse proxy
  -> requestId + security headers
  -> session authentication
  -> DTO validation
  -> application use case
  -> resource authorization
  -> transaction/query
  -> audit/outbox intent
  -> response DTO
```

- Authentication chỉ xác định actor; authorization luôn kiểm tra actor với wedding/resource cụ thể.
- Validation error là `400/422`; unauthenticated `401`; không đủ quyền `403`; resource không tồn tại hoặc cần chống enumeration có thể trả `404` theo policy.
- RequestId đi xuyên log, trace, error response và job được enqueue.

## Public invitation và RSVP

```text
opaque invite token
  -> hash token
  -> lookup active invitation
  -> rate limit + abuse checks
  -> minimal public invitation DTO
  -> RSVP validation
  -> idempotent upsert/append policy
  -> audit-safe event
  -> response without private guest fields
```

- Không log raw token hoặc PII.
- Rotate/revoke phải vô hiệu token cũ ngay.
- Public RSVP có idempotency strategy để retry mạng không tạo phản hồi trùng.

## Publish wedding/recap

```text
authorize owner/editor policy
  -> acquire optimistic revision
  -> validate canonical content + media readiness
  -> resolve immutable template version
  -> build deterministic public DTO
  -> remove private fields
  -> transaction: snapshot + version + publication pointer + outbox
  -> after commit: cache purge / notification
```

- Draft không được đọc trực tiếp bởi public endpoint.
- Snapshot bất biến và có payload hash, schema version, template version.
- Retry cùng idempotency key không tạo nhiều publish version ngoài ý muốn.

## Media processing

```text
create upload intent
  -> validate quota/type/ownership
  -> presigned upload
  -> complete callback/command
  -> verify actual object + MIME + size
  -> enqueue scan/variants
  -> ready | rejected | failed
```

Chỉ media `ready` được publish. Worker phải idempotent và không tin metadata do client gửi.

## Background side effects

Use case ghi outbox record trong transaction. Dispatcher/worker claim event bằng lease, xử lý với retry/backoff, ghi attempt và đánh dấu complete. Event thất bại vĩnh viễn vào dead-letter state để vận hành có thể inspect/replay có kiểm soát.

