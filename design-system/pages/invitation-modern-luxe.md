# Invitation template — Modern Luxe

## Identity

- Key: `modern-luxe`; version `1.0.0`; trạng thái development.
- Phong cách: modern luxury/editorial, chữ sans lớn, hình học mảnh, khoảng trắng rộng.
- Renderer và template config nằm cùng folder `frontend/src/templates/invitations/modern-luxe/`.

## Sections

Trải nghiệm mở phong bì, hero, lời mời, ảnh cặp đôi, thông tin hôn lễ, địa điểm, RSVP và footer. Hero là section bắt buộc; các content section còn lại được config cho phép bật/tắt và đổi thứ tự ở editor tương lai. Cấu trúc cố ý ngắn và tập trung hành động để giữ đúng bản chất thiệp mời, không phát triển thành website kể chuyện.

## Data fallback

Renderer nhận partial data và merge lên fixture mặc định. Vì vậy preview không phụ thuộc login/API nhưng dữ liệu thực luôn thắng giá trị mẫu. Fixture không chứa PII thật.

## Color variants

Chỉ ba palette đã duyệt: Champagne, Midnight và Sage. Palette thay semantic CSS variables của toàn trang; không cho nhập mã màu tự do để giữ contrast và art direction của template.

## Responsive

Desktop dùng editorial split/asymmetric grid. Dưới 760px, tất cả section về một cột, CTA đạt touch target và preview toolbar thu gọn. Motion orbit/scroll cue bị loại khi user bật reduced motion.
