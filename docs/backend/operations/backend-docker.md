# Backend Docker guide

## Mục tiêu

Backend có image độc lập tại `backend/Dockerfile`. Image không phụ thuộc frontend image, root workspace install hoặc filesystem host. `backend/compose.yaml` phục vụ BE local/integration mà không gây conflict với nhánh frontend; root Compose có thể tích hợp sau ở nhánh integration riêng.

## Trạng thái hiện tại

- Multi-stage Dockerfile, standalone non-root runner, migration target và backend-owned Compose đã được triển khai.
- Compose project local có tên `gmm_wedding_BE`; các container dùng cùng prefix để dễ nhận diện. Quy ước tên cố định này chỉ dành cho local development; môi trường có nhiều replica không dùng `container_name` cố định.
- Runner image đã build qua quality gate và liveness smoke-test.
- PostgreSQL migration/readiness integration vẫn cần kiểm chứng khi có migration model đầu tiên.

## Dockerfile target

Multi-stage tối thiểu:

```text
base/deps     cài dependency từ backend lockfile
builder       generate Prisma client + build Next.js standalone
runner        copy standalone output/static/required runtime assets
```

Yêu cầu:

- Pin Node.js 20 LTS image bằng version/digest policy phù hợp.
- `npm ci`, không install dependency trôi nổi.
- Next.js `output: "standalone"`.
- Runtime non-root với UID/GID ổn định.
- Không copy `.env`, test fixture, docs, Git metadata hoặc secret.
- Chỉ copy Prisma engine/schema/migration artifact cần cho runtime/migration command.
- Có `NODE_ENV=production`, explicit port/host.
- Xử lý `SIGTERM` và shutdown graceful.
- Healthcheck không dùng tool không tồn tại trong runtime image.

## `.dockerignore`

Backend `.dockerignore` tối thiểu loại:

```text
node_modules
.next
coverage
test-results
*.log
.env
.env.*
!.env.example
.git
Dockerfile*
```

Nếu migration image cần Dockerfile hoặc asset cụ thể, điều chỉnh có chủ đích; không dùng ignore pattern làm build thiếu artifact âm thầm.

## Image roles

Ưu tiên một artifact build có thể chạy theo role:

- `web`: Next.js standalone API.
- `worker`: job processor, khi queue/outbox cần.
- `migration`: one-off Prisma migrate deploy.

Nếu worker có dependency/runtime khác đáng kể, có thể dùng target riêng nhưng vẫn phải pin cùng source revision.

## Compose local target

```text
services:
  backend:
    build: ./backend
    depends_on postgres healthy
    stateless
  postgres:
    named volume
    healthcheck
  redis:                         optional profile
    named volume
    healthcheck
  worker:                        optional profile
    same backend image/revision
```

- Chỉ publish port cần thiết ra host.
- PostgreSQL/Redis nằm trên internal network; production không dùng credential local.
- `depends_on` không thay readiness/retry trong application.
- Không bind-mount source trong production compose.

## Migration

## Trang quản trị database local

Adminer chạy trong container `gmm_wedding_BE_db_admin`, thuộc profile `tools` và chỉ bind vào `127.0.0.1`. Công cụ này chỉ dành cho local development, không được triển khai hoặc expose ra production.

```powershell
docker compose -f .\backend\compose.yaml --profile tools up -d postgres db-admin
```

Mở `http://localhost:8081` và đăng nhập:

| Trường | Giá trị local mặc định |
|---|---|
| System | `PostgreSQL` |
| Server | `postgres` |
| Username | `gmm_wedding` |
| Password | `gmm_wedding_local` |
| Database | `gmm_wedding` |

Có thể đổi cổng host bằng `DB_ADMIN_PORT`. Không commit credential thật hoặc sử dụng credential local cho môi trường khác.

Không chạy migration trong Docker entrypoint của mọi web replica. Dùng release job/one-off command từ đúng backend image:

```powershell
docker compose run --rm backend npm run db:migrate:deploy
```

Migration command phải fail non-zero, log migration ID và không in credential.

## Runtime hardening

- Non-root, read-only filesystem khi khả thi.
- `/tmp` riêng có size limit nếu framework/library cần.
- Drop Linux capabilities không cần; không privileged; không mount Docker socket.
- CPU/memory request/limit tại platform deployment.
- Secret inject runtime; không `ARG`/`ENV` secret trong image layer.
- S3/object storage cho upload; container không giữ media lâu dài.

## Build và test image

CI target:

```powershell
docker build -t gmm-wedding-backend:test .\backend
docker run --rm gmm-wedding-backend:test node --version
```

Sau đó chạy image smoke với PostgreSQL disposable, kiểm tra liveness/readiness, migration và shutdown. Scan image/dependency trước khi push.

## Tag và deploy

- Tag immutable theo Git SHA/release; production deploy theo image digest.
- Không dùng `latest` làm rollback reference.
- Registry có retention và CVE rebuild policy.
- Build `amd64`/`arm64` khi hạ tầng yêu cầu và smoke test đúng architecture.

## Docker acceptance checklist

- Build chỉ từ `backend/` context hoặc context tối thiểu được document.
- Không cần frontend source để build.
- Runtime chạy non-root và không chứa secret.
- Healthcheck hoạt động trong image thật.
- Migration one-off thành công từ empty DB và existing schema.
- Web scale nhiều replica không tạo migration/cron trùng.
- Worker retry/shutdown an toàn khi enabled.
- Image smoke, CVE scan và graceful shutdown nằm trong CI.
