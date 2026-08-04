# Backend system overview

## Mục đích

Đây là bản tóm tắt nhanh các thành phần của backend GMM Wedding. Dùng file này để onboarding và xác định công nghệ; tài liệu chi tiết trong từng folder vẫn là source of truth cho implementation.

## Trạng thái hiện tại

- Backend foundation đã được scaffold: Next.js 16/TypeScript strict, Prisma client baseline, OpenAPI skeleton, health/version routes, Vitest và Docker image standalone.
- Chưa có auth, business module, Prisma model/migration nghiệp vụ, Redis/worker hoặc provider integration.
- Các lựa chọn `Accepted` là constraint đã thống nhất; `Proposed` cần spike khi scaffold; `Conditional` chỉ thêm khi có nhu cầu đo được.

## Thành phần hệ thống

| Concern | Công nghệ/cách tiếp cận | Trạng thái | Vai trò |
|---|---|---|---|
| Ngôn ngữ | TypeScript strict | Accepted | Backend application và tooling |
| Runtime | Node.js >=20.9 | Accepted/implemented | Chạy API/worker |
| Server/API | Next.js 16 App Router, Route Handlers | Accepted/implemented | HTTP JSON API `/api` |
| Kiến trúc | Modular monolith stateless | Accepted | Module business rõ, deploy một backend image |
| Database | PostgreSQL | Accepted | Source of truth, transaction và constraint |
| ORM/migration | Prisma 6 | Accepted baseline | Client/schema baseline đã generate; migration thật chưa có |
| Validation | Zod | Accepted | Request, env, job/provider payload boundary |
| API specification | OpenAPI 3.1 | Accepted/implemented baseline | Health/version contract; mở rộng cùng route mới |
| Authentication | Server session, secure HTTP-only cookie | Accepted direction | User/admin authentication |
| Authorization | Actor + resource + wedding/tenant policy | Accepted | Chống IDOR/cross-tenant |
| Object storage | S3-compatible | Accepted abstraction | Ảnh/media, không ghi lâu dài vào container |
| Cache/rate limit | Redis | Conditional | Distributed cache/rate limit/multi-replica state |
| Background jobs | Worker riêng; BullMQ nếu Redis được chọn | Conditional | Media, email, import/export, retention |
| API docs/test | OpenAPI UI + Postman import | Accepted direction | Developer testing và contract review |
| Logging | Structured JSON | Accepted | RequestId, release, error và latency |
| Telemetry | OpenTelemetry + provider adapter | Proposed | Trace/metrics, giảm khóa vendor |
| Error tracking | Sentry hoặc tương đương | Proposed | Exception/release monitoring |
| Unit/integration test | Vitest; PostgreSQL integration tiếp theo | Partially implemented | Unit route test đã chạy; DB test chưa có |
| Container | Backend Docker image riêng, multi-stage/non-root | Accepted/implemented | Standalone image đã build và smoke-test |
| Local orchestration | `backend/compose.yaml` | Accepted/implemented baseline | Backend + PostgreSQL; Redis profile tùy chọn |

## Runtime topology mục tiêu

```text
Client / frontend
       |
       v
Backend web container (Next.js standalone)
       |-- PostgreSQL
       |-- S3-compatible storage
       |-- Redis (conditional)
       `-- email/telemetry providers

Backend worker container (khi có async jobs)
       |-- dùng cùng code/image hoặc target build tương thích
       |-- PostgreSQL/outbox
       `-- Redis/BullMQ (conditional)

Migration one-off job
       `-- chạy từ backend image, không chạy trong mọi web replica
```

## Source of truth theo concern

- Stack: [technology stack](./technology-stack.md)
- Architecture: [backend architecture](../architecture/backend-architecture.md)
- Module ownership: [module boundaries](../modules/module-boundaries.md)
- HTTP endpoints: [route catalog](../contracts/route-catalog.md) và OpenAPI khi được scaffold
- Data: [domain data model](../data/domain-data-model.md)
- Docker: [backend Docker guide](../operations/backend-docker.md)
- Setup: [installation and local startup](../getting-started/installation-and-local-startup.md)
