# Danh sách chức năng

## Marketing và template

- Landing, gallery, demo, bảng giá, FAQ, điều khoản và chính sách riêng tư.
- Lọc template theo phong cách, màu, bố cục, miễn phí/trả phí.
- Preview mobile/desktop, SEO và Open Graph.

## Tài khoản và cộng tác

- Đăng ký/login/logout, xác minh email, quên/reset mật khẩu.
- Hồ sơ, locale/timezone, quản lý session, xóa/xuất dữ liệu.
- OAuth Google (Post-MVP).
- MVP dùng một owner cho mỗi wedding trong luồng sản phẩm. Cộng tác và các vai trò `editor`, `guest_manager`, `viewer` là Post-MVP; model dữ liệu hiện có chỉ được coi là điểm mở rộng, chưa yêu cầu UI/API quản trị thành viên.

## Wedding

- Wedding là hồ sơ gốc tối giản để liên kết thiệp online, website cưới, recap, khách, RSVP, lời chúc và media; không phải wedding planner.
- Tạo, xem danh sách, sửa, lưu trữ và xóa mềm; một user có thể sở hữu nhiều wedding.
- Thông tin MVP: tên wedding/cặp đôi, tên cô dâu/chú rể, ngày cưới chính, ảnh đại diện tùy chọn, locale, timezone và một số setting hiển thị cơ bản.
- `draft`, `published`, `archived`; slug/publication lifecycle thuộc từng surface công khai thay vì buộc Wedding phải là một trang public duy nhất.
- Wedding có thể có nhiều lễ/tiệc với tên/loại, ngày giờ, địa điểm/map, ghi chú ngắn, trạng thái hiển thị và thứ tự. Event chỉ là dữ liệu dùng lại bởi thiệp, website và RSVP; không có planning workflow riêng trong MVP.

## Editor và template

- Template version bất biến; đổi template không làm mất nội dung tương thích.
- Section: hero, couple, story, events, gallery, countdown, map, RSVP, wishes, gift, footer.
- Template cung cấp bố cục, section, theme và thứ tự mặc định ngay khi được chọn; user không phải cấu hình section trước bước chọn template.
- Sau khi chọn template, editor hiển thị trực tiếp preview để user bật/tắt và sắp xếp section, sửa nội dung, ảnh, màu/font/nền/hiệu ứng trong giới hạn template.
- Khi đổi template trong MVP, áp dụng cấu hình mặc định của template mới và giữ canonical content tương thích; không cố giữ bố cục tùy chỉnh của template cũ.
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
- Import CSV có mapping/validate/preview theo `categoryPath` tối đa 3 cấp; export CSV UTF-8 có section theo danh mục/nhóm (XLSX là bước mở rộng sau).
- Link cá nhân với opaque token; rotate/revoke token.
- Khách có hai cách định danh ở public surface: (1) URL chung của thiệp, người gửi RSVP/lời chúc tự nhập tên; (2) URL cá nhân dạng `/invitation/{weddingSlug}/{guestSlug}`, trong đó `guestSlug` được cấp khi tạo invitation và hệ thống tự gắn `guestId`/tên khách, không yêu cầu nhập lại tên. Hai mode dùng chung validation, rate limit và moderation; URL cá nhân không thay thế quyền truy cập owner.
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

## Chuẩn bị, tài chính cá nhân và sau ngày cưới

- Wedding Recap là publication surface ưu tiên sau thiệp/website: draft single-page gồm media sẵn sàng, lời chúc đã duyệt được chọn và lời cảm ơn; publish/unpublish bằng slug riêng, có OG metadata để chia sẻ và phục vụ SEO.
- Wedding Todo List là module trọng tâm: checklist cá nhân theo wedding, deadline, priority, category, trạng thái và reminder; template checklist giúp bắt đầu nhanh. Module được mở theo nhu cầu và không chặn onboarding/publish.
- Ngân sách cưới là module trọng tâm: hạng mục dự kiến/thực chi, số tiền theo minor unit + currency, trạng thái thanh toán và tổng hợp chênh lệch. Đây là sổ kế hoạch cá nhân, không phải kế toán hay quản lý hợp đồng nhà cung cấp.
- Sổ tiền mừng là module trọng tâm sau ngày cưới: owner ghi tiền/vàng/quà theo khách, ngày/hình thức nhận, ghi chú và trạng thái mừng lại. Đây là dữ liệu owner-only, không giữ tiền, không kết nối/suy diễn giao dịch ngân hàng và không đưa vào public surface.
- Todo, ngân sách và sổ tiền mừng có navigation riêng nhưng dùng progressive disclosure: dashboard không bắt user cấu hình chúng trước khi tạo/chọn/publish thiệp.

## Dashboard, admin và billing

- Tổng khách, trạng thái RSVP, party size, lượt xem và nguồn truy cập phù hợp consent.
- Email/in-app notification và digest.
- Admin quản lý user, wedding, template/version, moderation, audit log/feature flag.
- Owner workspace và platform admin là hai navigation/permission scope riêng; platform admin dùng `/gmm_admin/*` và server-side guard.
- Platform admin có system health, moderation queue, template workflow/version/rollback, operations/jobs/webhooks và audit trail.
- Post-MVP: plan, entitlement, quota, subscription, invoice, coupon, webhook idempotent.

## Chất lượng sản phẩm

- WCAG 2.2 AA cho luồng chính, keyboard/focus/contrast/alt/reduced motion.
- Kiến trúc i18n từ đầu; lưu UTC và hiển thị theo timezone.
- Mobile-first, ảnh responsive và trang public tối ưu mạng chậm.
