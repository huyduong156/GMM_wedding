# Backend coding standards

## TypeScript

- Bật `strict`; tránh `any`, non-null assertion và unchecked cast.
- `unknown` ở boundary rồi validate/narrow.
- Domain ID có branded type khi giúp ngăn nhầm resource.
- Exhaustive switch cho state/variant quan trọng.
- Time, random, ID và provider side effect qua injectable abstraction khi cần deterministic test.

## Function và module design

- Function/use case có một business purpose và dependency explicit.
- Không tạo `BaseService`, `BaseRepository` hoặc utility abstraction chỉ để giảm vài dòng.
- Prefer composition; inheritance chỉ khi có substitutability thật.
- Business vocabulary trong tên; tránh `processData`, `handleThing`, `commonUtils`.
- Guard clause cho invalid state; error typed, không dùng string matching.

## Boundary validation

- Validate HTTP input, env, provider payload, job payload và persisted JSON schema.
- DTO input/output tách ORM model.
- Normalize email/slug/phone theo policy trước uniqueness/query.
- Không tin MIME, filename, role hoặc tenant ID từ client.

## Data access

- Query scope tenant/resource ngay trong database condition.
- Chọn field cần thiết; không `include` graph lớn mặc định.
- Mutation multi-write có transaction tại application use case.
- Raw SQL parameterized và có test/query-plan review.
- Không catch rồi bỏ qua database error.

## Error và logging

- Throw/return error nội bộ có code/cause; map sang HTTP tại interface layer.
- Log một lỗi ở layer có đủ context, tránh log trùng ở mọi layer.
- Không log secret, token, cookie, PII hoặc full payload nhạy cảm.
- Expected business error không báo như crash 500.

## Review checklist

- Module ownership/dependency đúng.
- Authorization trước data exposure/mutation.
- Transaction/idempotency/concurrency được xem xét.
- Query/pagination/index hợp lý.
- Failure/timeout/retry của provider rõ.
- Test positive, negative, cross-tenant và edge state.
- Migration, telemetry, privacy và rollback được ghi khi liên quan.

