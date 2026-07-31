# GMM Wedding - Tài liệu dự án

Đây là nguồn thông tin chính thức (source of truth) cho nền tảng tạo thiệp cưới và website cưới trực tuyến.

## Danh mục

0. [Trạng thái và mức độ hoàn thiện tài liệu](./00-document-status.md)
1. [Tổng quan sản phẩm](./01-product-overview.md)
2. [Danh sách chức năng](./02-feature-catalog.md)
3. [Kiến trúc và công nghệ](./03-system-architecture.md)
4. [Mô hình dữ liệu](./04-data-model.md)
5. [Thiết kế API](./05-api-design.md)
6. [Bảo mật và vận hành](./06-security-and-operations.md)
7. [Roadmap](./07-roadmap.md)
8. [Quy ước phát triển](./08-engineering-guidelines.md)
9. [Giao diện quản trị và editor](./09-admin-ui-ux.md)
10. [Quy trình web research](./10-web-research-workflow.md)
11. [Format chuẩn cho thiệp cưới online](./11-online-invitation-template-format.md)
12. [Font chữ cho thiệp cưới](./12-wedding-fonts.md)

Design system dùng khi triển khai UI: [`../design-system/MASTER.md`](../design-system/MASTER.md).

## Quyết định ban đầu

- Frontend: React + Vite + TypeScript tại `frontend/`.
- Backend API: Next.js App Router/Route Handlers + TypeScript tại `backend/`.
- PostgreSQL + Prisma; bắt đầu bằng modular monolith, chưa tách microservice.
- Website public đọc published snapshot theo slug; template được quản lý và version hóa.
- Frontend và backend được đóng gói thành hai Docker image độc lập; triển khai không phụ thuộc máy chủ cụ thể.

## Quy tắc cập nhật

- Thay đổi phạm vi, kiến trúc, dữ liệu hoặc API phải cập nhật tài liệu tương ứng.
- Quyết định dài hạn ghi thêm ADR trong `docs/adr/`.
- Không đưa secret, token hay dữ liệu khách mời thật vào tài liệu/mã nguồn.
