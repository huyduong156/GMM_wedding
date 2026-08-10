# Invitation template — Élan d’Amour

## Identity

- Key: `modern-luxe`; version `2.3.0`; trạng thái development.
- Phong cách: modern luxury/editorial, chữ sans lớn, hình học mảnh, khoảng trắng rộng.
- Renderer và template config nằm cùng folder `frontend/src/templates/invitations/modern-luxe/`.

## Sections

Trải nghiệm mở phong bì, hero, lời mời, hành trình, thông tin hai gia đình, thông tin hôn lễ, địa điểm, RSVP và footer. `invitation` và `families` là hai section độc lập về dữ liệu và thao tác editor, dù renderer đặt chúng trong cùng một cụm art direction. Mỗi section phải có card edit và `data-editor-section` riêng; field cha/mẹ không được đặt trong card lời mời.

`cover`, `invitation`, `families` và các anchor do config đánh dấu `canReorder: false` phải giữ vị trí thiết kế. Editor không tự suy luận quy tắc khóa vị trí.

Trong `families`, danh xưng và họ tên là hai field riêng, ví dụ `groomFatherTitle: "Ông"` và `groomFather: "Nguyễn Văn Minh"`. Renderer không được dùng JavaScript để suy luận danh xưng từ họ tên cho dữ liệu mới. Hàm tách chuỗi `Ông/Bà + họ tên` chỉ là fallback tương thích dữ liệu cũ và có thể bỏ khi dữ liệu đã được migrate.

`timeline` là lịch trình ngay trong ngày được mời, ví dụ đón khách → làm lễ → khai tiệc. Đây là danh sách user tự thêm, xóa và sửa thời gian/tên/mô tả; không dùng chung dữ liệu hành trình cưới cấp hệ thống như dạm ngõ → đám hỏi → thành hôn.

`activities` là section optional độc lập, gồm các item `title + image` cho trải nghiệm khách có thể tham gia trong tiệc. Élan d’Amour cung cấp ba presentation style làm dữ liệu demo: thẻ nổi, lưới ảnh và marquee. Album cung cấp slide 3D, lưới editorial và dải ảnh ngang. Editor đọc option từ template config; theme khác không tự động nhận các style này nếu chưa thiết kế renderer tương ứng.

Nhạc nền là nội dung tùy chọn. Editor cho tải một file âm thanh tối đa 15MB, thay hoặc xóa, bật/tắt tự động phát và nghe thử bằng nút nổi trong preview. Mặc định renderer thử tự phát khi thiệp được mở; nếu browser chặn autoplay có âm thanh, khách vẫn có thể bấm nút phát/tạm dừng. Audio lặp lại khi đang phát. Khi nối API, data URL demo phải được thay bằng asset reference từ media service.

## Data fallback

Renderer nhận partial data và merge lên fixture mặc định. Vì vậy preview không phụ thuộc login/API nhưng dữ liệu thực luôn thắng giá trị mẫu. Fixture không chứa PII thật.

## Color variants

Chỉ ba palette đã duyệt: Champagne, Midnight và Sage. Palette thay semantic CSS variables của toàn trang; không cho nhập mã màu tự do để giữ contrast và art direction của template.

## Responsive

Desktop dùng editorial split/asymmetric grid. Dưới 760px, tất cả section về một cột, CTA đạt touch target và preview toolbar thu gọn. Motion orbit/scroll cue bị loại khi user bật reduced motion.
