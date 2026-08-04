# Admin template library

## Phạm vi

- `/gmm_admin/library/invites`: kho template thiệp online.
- `/gmm_admin/library/websites`: kho template website cưới.
- Hai trang dùng cùng component và visual grammar nhưng dữ liệu/lifecycle tách theo loại.

## Cấu trúc giao diện

1. Page heading và CTA `Thêm template`.
2. Summary strip: tổng số, đã xuất bản, chờ duyệt, bản nháp.
3. Thanh tìm theo tên/key/phong cách và lọc trạng thái.
4. Catalog card responsive: visual preview, trạng thái, name/key, version, style, usage, ngày cập nhật và thao tác xem trước/quản lý.

Preview trong card là hình mô phỏng nhẹ, không tải iframe/template runtime trong danh sách. Preview thật chỉ được mount khi người dùng chủ động mở để tránh chi phí render và rủi ro code template chưa duyệt.

## Responsive

- Desktop: 3 cột.
- Tablet: 2 cột.
- Mobile: 1 cột, summary 2x2, filter cuộn ngang.

## Trạng thái triển khai

Search/filter dùng mock data phía client. Create flow, config validation, sync/publish, version detail, usage metrics và preview sandbox chưa kết nối API.
