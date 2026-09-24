# Smooth / inertia scrolling cho thiệp online

Smooth scroll trong public template là smooth/inertia scrolling bằng Lenis: wheel input được nội suy với `lerp` để trang chuyển động có quán tính nhẹ, thay vì nhảy cứng theo từng delta. Đây là lớp điều hướng nền, không phải hiệu ứng thay thế section reveal hoặc parallax. Profile chuẩn hiện tại được lấy từ Verdant Promise và phải dùng chung cho các template.

## Contract dùng chung

- Dùng `useSmoothTemplateScroll(enabled)` tại renderer khi opening đã hoàn tất.
- Hook dùng chung nằm ở `frontend/src/shared/lib/navigation/useSmoothInvitationScroll.ts`; không khởi tạo Lenis trực tiếp trong renderer.
- Điều hướng tới section bằng code phải dùng `smoothScrollTo` từ cùng module để đi qua Lenis khi active và fallback native khi cần.
- Chỉ khởi tạo trên desktop có fine pointer (`(pointer: fine) and (min-width: 701px)`).
- Mobile và touch giữ native vertical scroll, không hijack gesture.
- `prefers-reduced-motion: reduce` không khởi tạo Lenis.
- Dynamic import để không tải runtime khi opening chưa mở hoặc trên mobile.
- Profile chuẩn: `autoRaf: true`, `lerp: 0.085`, `smoothWheel: true`, `wheelMultiplier: 0.85`.
- Dừng khi document bị ẩn, huỷ instance và listener khi renderer unmount.
- Smooth scroll không được làm mất focus, anchor, wheel, keyboard hoặc nội dung semantic.
- Không chạy song song native `scroll-behavior: smooth` và Lenis cho cùng một runtime; khi Lenis active, Lenis là owner của wheel interpolation.

## Phối hợp với motion khác

Smooth scroll có thể dùng cùng section reveal, bounded parallax và ambient background, nhưng chỉ nên có một runtime scroll chính trong mỗi template. Parallax phải giới hạn khoảng dịch chuyển nhỏ và dùng `transform`; không tạo thêm `requestAnimationFrame` loop riêng cho từng section.

## Fallback và acceptance

- Nếu Lenis import lỗi, native scroll vẫn hoạt động bình thường.
- Reduced motion giữ composition tĩnh và tắt parallax/ambient runtime.
- Kiểm tra desktop fine pointer, mobile 375px, keyboard focus, tab hidden/visible và route unmount.
- Các template mới nên tái sử dụng `useSmoothTemplateScroll` từ `frontend/src/shared/lib/navigation/useSmoothInvitationScroll.ts` thay vì tự tạo instance Lenis.

## Migration và ownership

- Các template cũ có thể tiếp tục gọi alias `useSmoothInvitationScroll` trong thời gian migration, nhưng code mới phải dùng `useSmoothTemplateScroll`.
- Chỉ một smooth-scroll runtime được phép tồn tại trong mỗi public template.
- `motion/react` đọc scroll để làm reveal/parallax; Motion không thay thế Lenis và không được tự tạo thêm scroll loop.
