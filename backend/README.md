# GMM Wedding Backend

Next.js + TypeScript cung cấp API, auth, business logic và integrations.

Backend foundation đã được scaffold với Next.js 16, TypeScript strict, Prisma/PostgreSQL baseline, OpenAPI, health endpoints, test và Docker image riêng. Bắt đầu tại [backend documentation](../docs/backend/README.md), sau đó đối chiếu [system architecture chung](../docs/shared/architecture/system-architecture.md).

- [Tổng quan công nghệ và thành phần](../docs/backend/foundation/backend-system-overview.md)
- [Cài đặt và khởi động local](../docs/backend/getting-started/installation-and-local-startup.md)
- [Command automation và Makefile](../docs/backend/getting-started/command-automation.md)
- [Route catalog và Postman](../docs/backend/contracts/route-catalog.md)
- [Backend Docker guide](../docs/backend/operations/backend-docker.md)

Các business module/auth/migration đầu tiên chưa được triển khai. Database migration chạy bằng one-off container job, không tự chạy đồng thời trong mỗi replica.
