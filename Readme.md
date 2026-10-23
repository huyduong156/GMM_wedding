# GMM Wedding

Nền tảng tạo thiệp cưới và website cưới trực tuyến, quản lý khách mời, RSVP và lời chúc qua đường dẫn riêng.

## Cấu trúc

- `frontend/` - React + Vite + TypeScript.
- `backend/` - Next.js + TypeScript API.
- `docs/` - tài liệu sản phẩm/kỹ thuật, bắt đầu tại [docs/README.md](docs/README.md).
- `assets/` - tài nguyên thiết kế dùng chung và bản nháp lưu trữ; ảnh frontend sử dụng nằm trong `frontend/public/assets/`.

Frontend và backend có source riêng; trạng thái triển khai và các gate phát hành được ghi trong tài liệu của từng vùng.

Template website cưới `A Beautiful Day`: xem [README mã nguồn](frontend/src/templates/websites/a-beautiful-day/README.md), [tài liệu artwork](docs/frontend/wedding-websites/a-beautiful-day/artwork-brief.md), [kết quả Phase 4](docs/frontend/wedding-websites/a-beautiful-day/phase-4-motion-experience.md) và [release review Phase 5](docs/frontend/wedding-websites/a-beautiful-day/phase-5-release-review.md). Bộ ảnh WebP đã duyệt nằm trong `frontend/public/assets/images/templates/a-beautiful-day/decor/`; PNG gốc được giữ tại `assets/templates/a-beautiful-day/originals/`, hai bản nháp cũ tại `assets/templates/a-beautiful-day/archive/`.

Hai ứng dụng sẽ được đóng gói thành Docker image độc lập; root Docker Compose sẽ cung cấp môi trường local/integration để dễ di chuyển và triển khai trên hạ tầng khác nhau.
