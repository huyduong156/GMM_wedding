# Backend base branch readiness

## Mục đích

File này xác định nhánh base code structure đã có gì, chưa có gì và điều kiện để merge. Foundation hoàn chỉnh không đồng nghĩa business feature đã triển khai.

## Đã có trong foundation

- Next.js 16, TypeScript strict, ESLint, Vitest và path alias.
- API response/request ID primitive; liveness, readiness và version routes.
- Zod environment validation và Prisma singleton.
- PostgreSQL/Prisma schema MVP, reviewed migration, local seed.
- Docker multi-stage non-root runner, migration target và Compose.
- PostgreSQL, optional Redis và Adminer dev-only.
- OpenAPI skeleton, route catalog và Postman workflow.
- Actor context, opaque token hashing/generation và cookie/session policy primitives.
- Backend docs theo foundation/architecture/contracts/data/operations/quality.
- `npm run check` và Docker build quality gate.

## Cố ý chưa triển khai trong base branch

- Register/login/logout/verify/reset endpoints.
- Password hashing/email/CSRF concrete adapters.
- Wedding/guest/RSVP business repositories và use cases.
- Object storage, Redis rate limiter, queue worker và providers.
- Production CI/CD, telemetry vendor và managed infrastructure.

Không đánh dấu planned route là implemented và không thêm mock handler trả thành công giả.

## Acceptance gate của base branch

- Clean install từ lockfile chạy được bằng Node 20/Docker.
- Prisma validate/generate thành công; migration deploy được từ empty database.
- Seed local chạy idempotent và không chứa secret/PII thật.
- `lint`, `typecheck`, `test`, production build đều xanh.
- Liveness/readiness hoạt động với PostgreSQL.
- Adminer chỉ bind localhost và không nằm trong production topology.
- Auth flow, actor boundary, token/cookie policy và test matrix được document.
- Source/docs frontend không bị sửa trên nhánh backend-only.

## Bước sau base branch

Vertical slice đầu tiên là identity/auth: chọn adapter qua ADR, triển khai register → verify → login → `/me` → logout cùng integration tests. Sau đó triển khai wedding CRUD và membership authorization trước các module guest/invitation/RSVP.
