# Smooth / inertia scrolling cho thiệp online

Smooth scroll trong Verdant Promise là smooth/inertia scrolling bằng Lenis: wheel input được nội suy với `lerp` để trang chuyển động có quán tính nhẹ, thay vì nhảy cứng theo từng delta. Đây là lớp điều hướng nền, không phải hiệu ứng thay thế section reveal hoặc parallax.

## Contract dùng chung

- Dùng `useSmoothInvitationScroll(opened)` tại renderer khi opening đã hoàn tất.
- Chỉ khởi tạo trên desktop có fine pointer (`(pointer: fine) and (min-width: 701px)`).
- Mobile và touch giữ native vertical scroll, không hijack gesture.
- `prefers-reduced-motion: reduce` không khởi tạo Lenis.
- Dynamic import để không tải runtime khi opening chưa mở hoặc trên mobile.
- Dừng khi document bị ẩn, huỷ instance và listener khi renderer unmount.
- Smooth scroll không được làm mất focus, anchor, wheel, keyboard hoặc nội dung semantic.

## Phối hợp với motion khác

Smooth scroll có thể dùng cùng section reveal, bounded parallax và ambient background, nhưng chỉ nên có một runtime scroll chính trong mỗi template. Parallax phải giới hạn khoảng dịch chuyển nhỏ và dùng `transform`; không tạo thêm `requestAnimationFrame` loop riêng cho từng section.

## Fallback và acceptance

- Nếu Lenis import lỗi, native scroll vẫn hoạt động bình thường.
- Reduced motion giữ composition tĩnh và tắt parallax/ambient runtime.
- Kiểm tra desktop fine pointer, mobile 375px, keyboard focus, tab hidden/visible và route unmount.
- Các template mới nên tái sử dụng `frontend/src/shared/lib/navigation/useSmoothInvitationScroll.ts` thay vì tự tạo instance Lenis.
