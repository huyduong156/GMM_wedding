# GMM Wedding

Nền tảng tạo thiệp cưới và website cưới trực tuyến, quản lý khách mời, RSVP và lời chúc qua đường dẫn riêng.

## Cấu trúc

- `frontend/` - React + Vite + TypeScript.
- `backend/` - Next.js + TypeScript API.
- `docs/` - tài liệu sản phẩm/kỹ thuật, bắt đầu tại [docs/README.md](docs/README.md).
- `assets/` - tài nguyên thiết kế dùng chung.

Repository hiện ở giai đoạn foundation: cấu trúc và tài liệu đã được chuẩn bị, source ứng dụng chưa scaffold.

Hai ứng dụng sẽ được đóng gói thành Docker image độc lập; root Docker Compose sẽ cung cấp môi trường local/integration để dễ di chuyển và triển khai trên hạ tầng khác nhau.
