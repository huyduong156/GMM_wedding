# Tổng quan sản phẩm

## Tầm nhìn

GMM Wedding là nền tảng SaaS giúp cặp đôi tự tạo, xuất bản và quản lý thiệp cưới/web cưới online. Mỗi wedding có URL riêng theo slug, template tùy biến, danh sách khách, RSVP và lời chúc tập trung trong dashboard.

## Người dùng

- Khách vãng lai: xem landing, template và bảng giá.
- Chủ thiệp/cặp đôi: tạo wedding, chỉnh nội dung, publish và quản lý phản hồi.
- Cộng tác viên: editor, quản lý khách hoặc chỉ xem.
- Khách mời: xem thiệp, RSVP, gửi lời chúc không cần tài khoản.
- Admin: quản lý user, template, nội dung và vận hành.

## Landing page công khai

- Route `/` giới thiệu luồng sản phẩm, các nhóm tính năng chính và giao diện mẫu trước khi người dùng đăng nhập.
- CTA dùng route thật của frontend để mở kho giao diện, bản xem trước Élan d’Amour, studio và trang đăng nhập; auth sẽ bổ sung guard và redirect sau.
- Nội dung dùng nền trắng, accent nâu đồng bộ logo; opening banner là section cuộn bình thường, page load có hoạt cảnh phong thư riêng và hero dùng các lớp ảnh nổi lệch pha. `HomeAmbient` chỉ dùng ảnh PNG vật phẩm cưới chân thật thay cho icon thư viện. Carousel 6 mẫu cover-flow 3D thay thế gallery template cũ, tự chuyển và có điều khiển thủ công; guest experience có cụm ảnh trang trí riêng. Mọi chuyển động có `prefers-reduced-motion`.

## MVP

Luồng bắt buộc: đăng ký -> tạo wedding -> chọn template -> điền nội dung -> preview -> publish slug -> chia sẻ -> khách RSVP/gửi lời chúc -> chủ thiệp quản lý phản hồi.

MVP gồm xác thực, nhiều wedding/user, editor theo section/form, slug duy nhất, draft/published, nhiều sự kiện, upload ảnh, khách/nhóm khách, import/export CSV, invite token cá nhân, RSVP public, moderation lời chúc, dashboard cơ bản và admin tối thiểu.

## Chưa làm trong MVP

- Page builder kéo-thả pixel-perfect.
- Marketplace designer, ứng dụng native, livestream.
- Custom domain, billing và gửi SMS/Zalo tự động.
- Hệ thống quản trị nhà hàng/tiệc cưới kiểu ERP.

## Chỉ số thành công

- Tỷ lệ đăng ký -> publish wedding đầu tiên.
- Thời gian trung vị đến lần publish đầu.
- Tỷ lệ RSVP hợp lệ và lỗi gửi RSVP.
- Core Web Vitals của trang public.
- Retention và conversion lên gói trả phí sau khi có billing.

## Giả định cần xác thực

- Thị trường đầu tiên là Việt Nam, mobile-first, tiếng Việt.
- Một wedding có thể gồm nhiều sự kiện (vu quy, thành hôn, tiệc).
- Khách mời không muốn đăng ký tài khoản.
- Editor theo schema đủ linh hoạt và an toàn cho giai đoạn đầu.
