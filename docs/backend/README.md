# GMM Wedding backend documentation

Đây là entrypoint cho mọi công việc thuộc backend Next.js API. Tài liệu được tổ chức theo concern, không theo thứ tự số hoặc framework folder.

> Trạng thái hiện tại: backend foundation, auth, Wedding base và Guest core đã được scaffold/triển khai. Guest core gồm CRUD owner-scoped, category/group, invitation token lifecycle, personalized invitation slug và public RSVP/wish hai mode; import/export, rate limit/idempotency nâng cao và các publication API vẫn theo phase kế tiếp.

## Nguyên tắc kiến trúc đã xác định

- TypeScript strict trên Node.js >=20.9, Next.js 16 Route Handlers.
- Modular monolith stateless, deploy độc lập với frontend.
- PostgreSQL là source of truth; Prisma 6 đã được chọn cho baseline và sẽ tiếp tục được kiểm chứng với schema/query/migration thật.
- HTTP JSON API `/api`, OpenAPI 3.1, runtime validation tại boundary.
- Local CORS dùng `APP_ORIGINS` dạng danh sách phân tách bằng dấu phẩy; mặc định cho phép frontend host `8080` và Vite dev host `5173`, trong khi mutation vẫn yêu cầu exact origin nằm trong allowlist.
- Business rule và authorization ở application/domain, không nằm trong route hoặc ORM.
- Immutable public snapshot cho wedding/recap; canonical draft không được public đọc trực tiếp.
- Redis, BullMQ, read replica và service separation chỉ thêm khi metric/failure mode chứng minh nhu cầu.
- Container multi-stage, non-root, migration one-off, provider qua adapter.

## Đọc theo loại công việc

### Bắt đầu scaffold backend

1. [Backend system overview](./foundation/backend-system-overview.md)
2. [Installation và local startup](./getting-started/installation-and-local-startup.md)
3. [Command automation: npm scripts và Makefile](./getting-started/command-automation.md)
4. [Base branch readiness](./foundation/base-branch-readiness.md)
5. [Technology stack](./foundation/technology-stack.md)
6. [Backend architecture](./architecture/backend-architecture.md)
7. [Source code structure](./architecture/source-code-structure.md)
8. [Coding standards](./quality/coding-standards.md)
9. [Development workflow](./quality/development-workflow.md)
10. [Backend Docker guide](./operations/backend-docker.md)

### Làm endpoint hoặc business feature

1. [Module boundaries](./modules/module-boundaries.md)
2. [Route catalog và Postman](./contracts/route-catalog.md)
3. [API contracts](./contracts/api-contracts.md)
4. [Authentication và authorization](./contracts/authentication-and-authorization.md)
5. [Authentication workflows and implementation runbook](./contracts/authentication-workflows.md)
6. [Authentication implementation design](./contracts/authentication-implementation-design.md)
7. [Error, pagination, idempotency và concurrency](./contracts/errors-pagination-and-concurrency.md)
8. [Request và event flows](./architecture/request-and-event-flows.md)
9. Domain/data document tương ứng.

### Làm database hoặc migration

1. [Domain data model](./data/domain-data-model.md)
2. [Database và migration strategy](./data/database-and-migrations.md)
3. [Database schema reference](./data/database-schema-reference.md)
4. [Trang quản trị database local](./data/local-database-admin.md)
5. [Testing strategy](./quality/testing-strategy.md)

### Làm security hoặc production readiness

1. [Security và privacy](./operations/security-and-privacy.md)
2. [Observability và recovery](./operations/observability-and-recovery.md)
3. [Background jobs và outbox](./operations/background-jobs-and-outbox.md)
4. [Scalability và reliability](./architecture/scalability-and-reliability.md)
5. [Backend Docker guide](./operations/backend-docker.md)
6. [Deployment và runtime](./operations/deployment-and-runtime.md)

## Cây tài liệu

```text
docs/backend/
  README.md
  getting-started/
    installation-and-local-startup.md
    command-automation.md
  foundation/
    backend-system-overview.md
    base-branch-readiness.md
    technology-stack.md
  architecture/
    backend-architecture.md
    source-code-structure.md
    request-and-event-flows.md
    scalability-and-reliability.md
  modules/
    module-boundaries.md
  contracts/
    route-catalog.md
    api-contracts.md
    authentication-and-authorization.md
    authentication-workflows.md
    authentication-implementation-design.md
    errors-pagination-and-concurrency.md
  data/
    domain-data-model.md
    database-and-migrations.md
    database-schema-reference.md
    local-database-admin.md
  operations/
    backend-docker.md
    security-and-privacy.md
    background-jobs-and-outbox.md
    observability-and-recovery.md
    deployment-and-runtime.md
  quality/
    coding-standards.md
    testing-strategy.md
    development-workflow.md
```

## Trạng thái quyết định

| Nhãn | Ý nghĩa |
|---|---|
| Accepted | Đã là constraint của repository; thay đổi cần cập nhật shared architecture hoặc ADR khi phù hợp |
| Proposed | Hướng ưu tiên nhưng cần spike/benchmark trước khi khóa |
| Conditional | Chỉ triển khai khi có nhu cầu và metric cụ thể |
| Post-MVP | Không đưa vào foundation hiện tại |

Không biến đề xuất công cụ thành implementation fact. Khi spike hoàn tất, cập nhật status và ghi ADR nếu quyết định có ảnh hưởng dài hạn/xuyên hệ thống.

## Boundary và tránh conflict

- Backend branch chỉ sửa `backend/`, `docs/backend/` và backend-owned infrastructure files.
- Không sửa `frontend/`, `docs/frontend/` hoặc `design-system/`.
- Chỉ sửa `docs/shared/` khi contract FE–BE, end-to-end flow hoặc quyết định kiến trúc thật sự thay đổi; diff phải nhỏ và rõ phạm vi.
- Source of truth xuyên hệ thống: [system architecture](../shared/architecture/system-architecture.md) và [ADR](../shared/architecture/adr/README.md).

## Tiêu chuẩn hoàn thành tài liệu

Một feature backend quan trọng phải mô tả hoặc dẫn chiếu đủ: API contract, actor/permission, validation, invariant, data ownership, transaction/concurrency, idempotency, error, test, telemetry, migration và rollback/failure mode.
