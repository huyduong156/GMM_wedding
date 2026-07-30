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

Frontend hiện là prototype điều hướng. Trước production cần secure session cookie, server-side guard, rate limit, MFA/recovery, audit login và thông báo lỗi không làm lộ sự tồn tại của tài khoản.
