# Backend architecture

## Quyết định nền tảng

Backend là **modular monolith** chạy stateless. Một deployable chứa nhiều business module độc lập về ownership và dependency, dùng chung PostgreSQL nhưng không truy cập bảng của nhau tùy tiện.

```text
HTTP / job / CLI entry point
          |
     interface layer
  parse, validate, auth context
          |
    application layer
 use case, policy, transaction
          |
      domain layer
 invariant, entity/value logic
          |
  infrastructure adapters
 PostgreSQL, Redis, S3, email
```

## Layer responsibilities

### Interface

- Next.js route handler, job processor và CLI command.
- Parse request, validate DTO, lấy authenticated actor, gọi đúng use case và map response/error.
- Không chứa business rule, query Prisma hoặc orchestration nhiều repository.

### Application

- Một use case biểu diễn một hành động nghiệp vụ: `PublishWedding`, `SubmitRsvp`, `RotateInvitationToken`.
- Authorize theo actor + resource, điều phối transaction, repository port, domain service và side-effect intent.
- Không phụ thuộc HTTP, React hoặc provider SDK.

### Domain

- Invariant, state transition, policy thuần và value object có giá trị khi complexity đủ lớn.
- Không ép mọi CRUD thành entity/class; logic đơn giản có thể là function/module typed.
- Không import Prisma, Next.js, Redis hoặc SDK ngoài.

### Infrastructure

- Prisma repository/query, Redis, S3, email, telemetry và clock/id generator implementation.
- Chuyển lỗi provider thành lỗi nội bộ ổn định.
- Không quyết định policy nghiệp vụ.

## Dependency rule

Dependency đi từ ngoài vào trong: `interface -> application -> domain`. Infrastructure implement port do application/domain sở hữu và được inject tại composition root.

Module không import file private của module khác. Giao tiếp qua public API/application contract hoặc domain event. Query read-only xuyên module chỉ được phép qua query service được module sở hữu công khai.

## Transaction boundary

- Một use case mutation sở hữu transaction boundary.
- Không giữ database transaction khi gọi email, S3 hoặc API ngoài.
- Ghi state + outbox event trong cùng transaction; worker xử lý side effect sau commit khi cần độ tin cậy.
- Retry transaction chỉ với lỗi transient được phân loại và operation idempotent.

## Consistency model

- Strong consistency cho invariant trong một aggregate/module và publish snapshot.
- Eventual consistency cho email, media processing, analytics, cache invalidation và notification.
- API phải cho client biết trạng thái async như `pending|processing|ready|failed`, không giả vờ hoàn tất.

## Đường scale

1. Tối ưu query/index và đo bottleneck.
2. Scale web replica ngang vì runtime stateless.
3. Tách worker process từ cùng codebase khi có queue.
4. Thêm Redis/CDN/read replica khi metric chứng minh nhu cầu.
5. Chỉ tách service khi module có ownership, tải hoặc failure isolation khác biệt rõ và chi phí vận hành được chấp nhận.

Xem thêm [scalability and reliability](./scalability-and-reliability.md) và [module boundaries](../modules/module-boundaries.md).

