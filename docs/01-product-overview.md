# Tổng quan sản phẩm

## Tầm nhìn

GMM Wedding là nền tảng SaaS giúp cặp đôi tự tạo, xuất bản và quản lý thiệp cưới/web cưới online. Mỗi wedding có URL riêng theo slug, template tùy biến, danh sách khách, RSVP và lời chúc tập trung trong dashboard.

## Người dùng

- Khách vãng lai: xem landing, template và bảng giá.
- Chủ thiệp/cặp đôi: tạo wedding, chỉnh nội dung, publish và quản lý phản hồi.
- Cộng tác viên: editor, quản lý khách hoặc chỉ xem.
- Khách mời: xem thiệp, RSVP, gửi lời chúc không cần tài khoản.
- Admin: quản lý user, template, nội dung và vận hành.

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
