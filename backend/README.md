# GMM Wedding Backend

Next.js + TypeScript cung cấp API, auth, business logic và integrations.

Backend foundation đã được scaffold với Next.js 16, TypeScript strict, Prisma/PostgreSQL baseline, OpenAPI, health endpoints, test và Docker image riêng. Bắt đầu tại [backend documentation](../docs/backend/README.md), sau đó đối chiếu [system architecture chung](../docs/shared/architecture/system-architecture.md).

- [Tổng quan công nghệ và thành phần](../docs/backend/foundation/backend-system-overview.md)
- [Cài đặt và khởi động local](../docs/backend/getting-started/installation-and-local-startup.md)
- [Command automation và Makefile](../docs/backend/getting-started/command-automation.md)
- [Route catalog và Postman](../docs/backend/contracts/route-catalog.md)
- [Backend Docker guide](../docs/backend/operations/backend-docker.md)

## Bật retention worker local

Worker dọn dữ liệu soft-delete quá 14 ngày, chạy lúc 00:00 sáng thứ 7 theo
`Asia/Ho_Chi_Minh`:

```powershell
docker compose -f .\backend\compose.yaml up -d backend-retention
docker compose -f .\backend\compose.yaml logs -f backend-retention
```

Worker chạy tách khỏi web backend. Chỉ chạy một instance worker trong môi trường
production. Có thể đổi timezone bằng biến `RETENTION_TIMEZONE`.

Các business module/auth/migration đầu tiên chưa được triển khai. Database migration chạy bằng one-off container job, không tự chạy đồng thời trong mỗi replica.
