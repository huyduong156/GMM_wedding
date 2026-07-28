# GMM Wedding Backend

Next.js + TypeScript cung cấp API, auth, business logic và integrations.

Source chưa được scaffold ở bước tài liệu. Xem [tài liệu dự án](../docs/README.md) trước khi khởi tạo.

Khi scaffold phải cấu hình Next.js `output: "standalone"`, multi-stage `Dockerfile`, `.dockerignore`, health/readiness endpoint và graceful shutdown. Database migration chạy bằng one-off container job, không tự chạy đồng thời trong mỗi replica.
