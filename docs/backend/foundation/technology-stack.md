# Backend technology stack

## Mục tiêu lựa chọn

Stack phải ưu tiên type safety, portability, khả năng kiểm thử, vận hành đơn giản và đường nâng cấp rõ ràng. Không thêm hạ tầng phân tán khi chưa có workload hoặc failure mode thực tế cần giải quyết.

## Ma trận quyết định

| Thành phần | Lựa chọn | Trạng thái | Lý do |
|---|---|---|---|
| Runtime | Node.js >=20.9 | Accepted/implemented | Next.js 16 requirement; Docker dùng Node 20 |
| Language | TypeScript strict | Accepted | Contract rõ, refactor an toàn, dùng chung type generation |
| API framework | Next.js 16 App Router/Route Handlers | Accepted/implemented | Standalone image đã build và smoke-test |
| Database | PostgreSQL | Accepted | Transaction, constraint, indexing và JSONB phù hợp domain |
| ORM/migration | Prisma 6 | Accepted baseline | Client/schema generate đã kiểm chứng; migration/query plan vẫn phải test cùng model thật |
| Runtime validation | Zod | Accepted | Validate input/env/config tại boundary |
| API description | OpenAPI 3.1 | Accepted | Source cho review contract, typed client và breaking-change check |
| Authentication | Secure server session qua HTTP-only cookie | Accepted direction | Provider/library cụ thể cần ADR sau spike |
| Cache/rate limit | Redis | Conditional | Chỉ thêm khi cần distributed state, cache hoặc rate limit nhiều replica |
| Queue | BullMQ trên Redis | Conditional | Chỉ thêm khi có job cần retry/delay/concurrency ngoài request lifecycle |
| Object storage | S3-compatible | Accepted abstraction | Provider chưa khóa; media không nằm trên filesystem container |
| Logging | Structured JSON logger | Accepted | Query theo requestId, route, actor và release |
| Tracing/metrics | OpenTelemetry + provider adapter | Proposed | Giảm khóa vendor; rollout theo nhu cầu quan sát |
| Error tracking | Sentry hoặc provider tương đương | Proposed | Provider chưa khóa |
| Unit/integration test | Vitest + PostgreSQL test database | Partially implemented | Vitest route test đã chạy; DB integration sẽ thêm cùng model/migration |
| API integration | Route/service tests + real PostgreSQL | Accepted direction | Test transaction, constraint và tenant isolation thật |
| Container | Multi-stage Docker, non-root, standalone output | Accepted | Portable, stateless và dễ scan |

## Quy tắc thêm dependency

- Chỉ thêm dependency khi platform/library chuẩn không giải quyết rõ ràng nhu cầu.
- Dependency production phải còn duy trì, license tương thích, không có advisory nghiêm trọng chưa xử lý và có bundle/runtime cost hợp lý.
- Wrapper cho provider ngoài phải nằm ở infrastructure adapter; domain/application không import SDK provider trực tiếp.
- Không dùng cả hai library có cùng trách nhiệm nếu chưa có migration plan.
- Lockfile phải commit; CI dùng frozen install.

## Những thứ chưa dùng mặc định

- Microservices, Kafka, service mesh, Kubernetes và event sourcing.
- GraphQL khi REST/OpenAPI đáp ứng được product flow.
- Repository abstraction chung chung cho mọi bảng; chỉ tạo port khi cần thay adapter, kiểm thử boundary hoặc giữ domain khỏi ORM.
- Redis như source of truth.
- Cron chạy trong mọi web replica.
