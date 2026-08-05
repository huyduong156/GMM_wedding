# Admin login

## Route và mục tiêu

- Route: `/gmm_admin/login`.
- Là bề mặt riêng, không render sidebar/topbar của platform admin.
- Phân biệt rõ với `/login` dành cho owner/editor và nhấn mạnh đây là khu vực nội bộ.

## Bố cục

- Desktop: panel giới thiệu graphite bên trái, form sáng bên phải; form có chiều rộng tối đa 430px.
- Mobile/tablet: xếp dọc, rút gọn phần assurance để ưu tiên form.
- Logo dùng asset chính thức `/assets/logo/wedding_logo.png`.

## Trạng thái triển khai

Frontend đã gọi `POST /api/auth/admin/login`, bootstrap guard bằng `GET /api/admin/me`, hiển thị lỗi permission ổn định và logout qua session backend. Secure cookie, role guard và rate limit do backend thực thi; MFA/recovery và audit login vẫn là production gate.
