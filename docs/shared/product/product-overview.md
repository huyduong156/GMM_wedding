# Tổng quan sản phẩm

## Tầm nhìn

GMM Wedding là nền tảng SaaS wedding companion dành trực tiếp cho cô dâu/chú rể, lấy thiệp cưới online, website cưới và Wedding Recap làm trục xuất bản/chia sẻ/SEO. Sản phẩm đồng thời cung cấp các công cụ trọng tâm như Todo, ngân sách và sổ tiền mừng, nhưng áp dụng progressive disclosure để người không chuyên chỉ thấy tính năng khi cần. `Wedding` là hồ sơ gốc liên kết toàn bộ dữ liệu, không biến onboarding thành một quy trình wedding planner phức tạp.

## Người dùng

- Khách vãng lai: xem landing, template và bảng giá.
- Chủ thiệp/cặp đôi: tạo wedding, chỉnh nội dung, publish và quản lý phản hồi.
- Cộng tác viên: khả năng mở rộng sau MVP, không xuất hiện trong onboarding và luồng chính hiện tại.
- Khách mời: xem thiệp, RSVP, gửi lời chúc không cần tài khoản.
- Admin: quản lý user, template, nội dung và vận hành.

## Landing page công khai

- Route `/` giới thiệu luồng sản phẩm, các nhóm tính năng chính và giao diện mẫu trước khi người dùng đăng nhập.
- CTA dùng route thật của frontend để mở kho giao diện, bản xem trước Élan d’Amour, studio và trang đăng nhập; auth sẽ bổ sung guard và redirect sau.
- Nội dung dùng nền trắng, accent nâu đồng bộ logo; opening banner là section cuộn bình thường, page load có hoạt cảnh phong thư riêng và hero dùng các lớp ảnh nổi lệch pha. `HomeAmbient` chỉ dùng ảnh PNG vật phẩm cưới chân thật thay cho icon thư viện. Carousel 6 mẫu cover-flow 3D thay thế gallery template cũ, tự chuyển và có điều khiển thủ công; guest experience có cụm ảnh trang trí riêng. Mọi chuyển động có `prefers-reduced-motion`.

## MVP

Luồng bắt buộc: đăng ký -> tạo hồ sơ wedding tối thiểu -> chọn template -> nhập/chỉnh nội dung trực tiếp trên template -> preview -> publish slug -> chia sẻ -> khách RSVP/gửi lời chúc -> chủ thiệp quản lý phản hồi.

MVP nền tảng gồm xác thực, nhiều wedding/user, thông tin cặp đôi và ngày cưới cơ bản, danh sách lễ/tiệc gọn nhẹ, template/editor trực quan, slug duy nhất, draft/published, upload ảnh, khách/nhóm khách, invite token cá nhân, RSVP public, moderation lời chúc, dashboard cơ bản và admin tối thiểu. Thiệp online và website cưới là hai publication surface chính; Wedding Recap là surface ưu tiên tiếp theo. Todo, ngân sách và sổ tiền mừng vẫn thuộc bộ tính năng trọng tâm nhưng được triển khai thành module độc lập theo phase, không chặn luồng publish đầu tiên.

## Chưa làm trong MVP

- Page builder kéo-thả pixel-perfect.
- Marketplace designer, ứng dụng native, livestream.
- Custom domain, billing và gửi SMS/Zalo tự động.
- Hệ thống quản trị nhà hàng/tiệc cưới kiểu ERP.
- Wedding planner chuyên nghiệp/ERP: quản lý nhà cung cấp, hợp đồng, nhân sự vận hành và timeline điều phối phức tạp. Todo cá nhân, ngân sách và sổ tiền mừng cơ bản vẫn thuộc phạm vi sản phẩm.
- Cộng tác viên và phân quyền wedding nhiều cấp trên UI/API.

## Chỉ số thành công

- Tỷ lệ đăng ký -> publish wedding đầu tiên.
- Thời gian trung vị đến lần publish đầu.
- Tỷ lệ RSVP hợp lệ và lỗi gửi RSVP.
- Core Web Vitals của trang public.
- Retention và conversion lên gói trả phí sau khi có billing.

## Giả định cần xác thực

- Thị trường đầu tiên là Việt Nam, mobile-first, tiếng Việt.
- Một wedding có thể gồm nhiều lễ/tiệc (vu quy, thành hôn, tiệc), nhưng chúng chỉ là dữ liệu ngày giờ/địa điểm để các publication surface hiển thị và RSVP tham chiếu; không phải workspace vận hành riêng.
- Khách mời không muốn đăng ký tài khoản.
- Editor theo schema đủ linh hoạt và an toàn cho giai đoạn đầu.
