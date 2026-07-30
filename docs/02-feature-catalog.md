# Danh sách chức năng

## Marketing và template

- Landing, gallery, demo, bảng giá, FAQ, điều khoản và chính sách riêng tư.
- Lọc template theo phong cách, màu, bố cục, miễn phí/trả phí.
- Preview mobile/desktop, SEO và Open Graph.

## Tài khoản và cộng tác

- Đăng ký/login/logout, xác minh email, quên/reset mật khẩu.
- Hồ sơ, locale/timezone, quản lý session, xóa/xuất dữ liệu.
- OAuth Google (Post-MVP).
- Vai trò: `owner`, `editor`, `guest_manager`, `viewer`.

## Wedding

- Tạo, nhân bản, lưu trữ, xóa mềm; một user sở hữu nhiều wedding.
- `draft`, `published`, `archived`; slug duy nhất.
- Public, mật khẩu chung hoặc invite-only.
- Nhiều sự kiện, địa điểm/bản đồ, timezone, thông tin cặp đôi/gia đình.

## Editor và template

- Template version bất biến; đổi template không làm mất nội dung tương thích.
- Section: hero, couple, story, events, gallery, countdown, map, RSVP, wishes, gift, footer.
- Bật/tắt/sắp xếp section; màu, font, nền và hiệu ứng được cho phép.
- Upload/crop/tối ưu ảnh, autosave, preview responsive, preview draft bằng token.
- Version history/custom CSS (Post-MVP). Không chạy HTML/JavaScript tùy ý từ user.

## Publish và chia sẻ

- Tách hai bề mặt sản phẩm trong owner workspace:
  - **Thiệp online:** nhiều đường dẫn/slug hoặc invite token theo khách và nhóm khách, nội dung ngắn gọn, ưu tiên gửi nhanh và theo dõi phản hồi.
  - **Website cưới:** một website cho mỗi wedding, phục vụ câu chuyện tình yêu, album, lịch trình, địa điểm, lời chúc và thông tin chung.

- URL theo slug, publish/unpublish, QR code, copy/share Zalo/Facebook.
- Tùy chỉnh OG title/image/description.
- Scheduled publish, custom domain, bỏ branding (Post-MVP).

## Khách mời

- CRUD khách/nhóm/tag/ghi chú/bàn; số người dự kiến.
- Danh mục khách mời dạng cây tối đa 3 cấp; tạo danh mục gốc/danh mục con, đổi tên, di chuyển và dùng làm bộ lọc. Không cho tạo chu kỳ hoặc cấp thứ 4.
- Import CSV có mapping/validate/preview; export CSV/XLSX.
- Link cá nhân với opaque token; rotate/revoke token.
- Email/SMS/Zalo provider, tracking và check-in QR (Post-MVP).

## RSVP không cần login

- Tham dự/từ chối/chưa chắc, số người đi cùng, sự kiện tham gia.
- Meal preference/yêu cầu đặc biệt/lời nhắn tùy cấu hình.
- Cập nhật qua invite token; public RSVP có rate limit/xác minh.
- Owner lọc, sửa thay, export và xem tổng hợp.
- Honeypot, rate limit, CAPTCHA thích ứng.

## Lời chúc

- Gửi không login; `pending`, `approved`, `rejected`, `spam`.
- Duyệt, ẩn, ghim, xóa; lọc nội dung và chống bot.
- Guestbook public/reaction (Post-MVP).

## Quà mừng

- Hiển thị QR/thông tin chuyển khoản do chủ thiệp bật/tắt.
- MVP không giữ tiền hoặc xử lý giao dịch.
- Payment gateway chỉ sau đánh giá pháp lý/đối soát.

## Dashboard, admin và billing

- Tổng khách, trạng thái RSVP, party size, lượt xem và nguồn truy cập phù hợp consent.
- Email/in-app notification và digest.
- Admin quản lý user, wedding, template/version, moderation, audit log/feature flag.
- Owner workspace và platform admin là hai navigation/permission scope riêng; platform admin dùng `/admin/*` và server-side guard.
- Platform admin có system health, moderation queue, template workflow/version/rollback, operations/jobs/webhooks và audit trail.
- Post-MVP: plan, entitlement, quota, subscription, invoice, coupon, webhook idempotent.

## Chất lượng sản phẩm

- WCAG 2.2 AA cho luồng chính, keyboard/focus/contrast/alt/reduced motion.
- Kiến trúc i18n từ đầu; lưu UTC và hiển thị theo timezone.
- Mobile-first, ảnh responsive và trang public tối ưu mạng chậm.
