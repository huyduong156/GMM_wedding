# Cài đặt và khởi động backend local

## Trạng thái tài liệu

Backend foundation đã scaffold. Các command install/lint/typecheck/test/build, Prisma generate/validate và Docker build đã tồn tại; business migration/auth/module vẫn là bước tiếp theo.

## Yêu cầu máy phát triển

- Git.
- Node.js 20 LTS trở lên và npm tương thích lockfile.
- Docker Engine/Desktop với Docker Compose v2.
- PostgreSQL client là tùy chọn; database ưu tiên chạy qua Compose local.
- Postman là tùy chọn; có thể dùng curl/HTTP client khác.
- GNU Make là tùy chọn; npm scripts vẫn là interface portable bắt buộc.

Không cần cài PostgreSQL/Redis trực tiếp trên host nếu dùng Compose.

## Kiểm tra source hiện tại

```powershell
git branch --show-current
Get-Content .\docs\backend\README.md
Get-Content .\docs\backend\foundation\backend-system-overview.md
```

Xác nhận `backend/package.json`, `backend/package-lock.json` và `.env.example` tồn tại. Không chạy `npm install` ở repository root vì backend/frontend dùng package độc lập.

## Local workflow

### 1. Chuẩn bị environment

```powershell
Copy-Item .\backend\.env.example .\backend\.env
```

Điền giá trị local giả/an toàn. Không commit `.env`.

Biến môi trường dự kiến:

```text
NODE_ENV
PORT
DATABASE_URL
DIRECT_DATABASE_URL          # chỉ khi migration/provider cần
AUTH_SECRET
APP_ORIGIN
REDIS_URL                    # optional/conditional
S3_ENDPOINT
S3_REGION
S3_BUCKET
S3_ACCESS_KEY_ID
S3_SECRET_ACCESS_KEY
LOG_LEVEL
```

Danh sách thực tế phải được validate bằng Zod khi process start và đồng bộ với `.env.example`.

### 2. Cài dependency backend

```powershell
npm --prefix .\backend ci
```

Dùng `npm ci` khi lockfile tồn tại. Chỉ dùng `npm install` khi chủ động thay dependency và commit lockfile tương ứng.

Nếu máy có GNU Make, có thể dùng wrapper tương đương:

```powershell
Set-Location .\backend
make doctor
make install
```

Xem [command automation](./command-automation.md) để phân biệt `install`, `sync`, `outdated` và `update`.

### 3. Khởi động dependency local

Backend Compose hỗ trợ PostgreSQL và backend; Redis chỉ bật khi feature cần:

```powershell
docker compose -f .\backend\compose.yaml up -d postgres
```

Tên service cuối cùng phải khớp `compose.yaml`; cập nhật tài liệu nếu chọn tên khác.

### 4. Chạy migration

```powershell
npm --prefix .\backend run db:migrate
```

Migration là command riêng, không tự chạy trong mỗi backend replica. Seed local/test chạy riêng và không dùng dữ liệu thật.

Sau khi migration thành công, tạo dữ liệu mẫu local:

```powershell
npm --prefix .\backend run db:seed
```

### 5. Chạy development server

```powershell
npm --prefix .\backend run dev
```

Target mặc định: `http://localhost:3000`; health:

```text
GET http://localhost:3000/api/health/live
GET http://localhost:3000/api/health/ready
```

### 6. Kiểm tra chất lượng

```powershell
npm --prefix .\backend run lint
npm --prefix .\backend run typecheck
npm --prefix .\backend run test
npm --prefix .\backend run build
```

Script names là contract đề xuất; khi scaffold phải tạo hoặc cập nhật file này nếu tên thay đổi.

## Chạy toàn bộ backend bằng Docker

Backend Dockerfile và Compose service đã được triển khai:

```powershell
docker compose -f .\backend\compose.yaml up -d --build backend postgres
docker compose -f .\backend\compose.yaml ps
docker compose -f .\backend\compose.yaml logs backend
```

Compose project hiển thị với tên `gmm_wedding_BE`. Các container gồm `gmm_wedding_BE`, `gmm_wedding_BE_postgres`, `gmm_wedding_BE_migrate` và `gmm_wedding_BE_redis` (khi bật profile queue). URL API là `http://localhost:3000/api`.

Migration vẫn chạy one-off:

### Mở trang quản trị database

Nếu có GNU Make:

```powershell
Set-Location .\backend
make db-admin-up
```

Nếu không có Make:

```powershell
docker compose -f .\backend\compose.yaml --profile tools up -d postgres db-admin
```

Truy cập `http://localhost:8081`; chọn `PostgreSQL`, server `postgres`, username `gmm_wedding`, password `gmm_wedding_local`, database `gmm_wedding`. Trang này chỉ dành cho local development.

```powershell
docker compose -f .\backend\compose.yaml --profile tools run --rm backend-migrate
```

Chi tiết image, security và production flow xem [backend Docker guide](../operations/backend-docker.md).

## Reset local data

Database reset là destructive. Chỉ thực hiện với database local/test đã xác minh URL; không dùng command reset với staging/production. Quy trình reset cụ thể sẽ được thêm cùng Prisma scripts sau scaffold.

## Troubleshooting

| Triệu chứng | Kiểm tra |
|---|---|
| Backend không start | Node version, env validation, port conflict |
| Readiness fail | `DATABASE_URL`, container health, migration status |
| Migration fail | Schema drift, database permission, migration log |
| Cookie login không giữ | `APP_ORIGIN`, Secure/SameSite và Postman cookie jar |
| Upload fail | S3 endpoint/bucket/CORS/credential local |
| Job không chạy | Worker process, Redis/outbox state, queue metric |

## Onboarding checklist

- Đọc backend README và architecture.
- Chạy dependency install frozen.
- Khởi động PostgreSQL local.
- Apply migration từ empty database.
- Chạy health, auth và một test cross-tenant denial.
- Import OpenAPI vào Postman.
- Không sửa frontend/docs frontend trên branch backend-only.
