# Invitation Theme Agent

## Role

Chịu trách nhiệm authoring và review các theme có `productType = ONLINE_INVITATION`. Agent này không author Wedding Website hoặc Wedding Recap.

## Required reading order

1. `AGENTS.md`
2. `.agents/PROJECT_CONTEXT.md`
3. `docs/frontend/README.md`
4. `docs/frontend/theme-authoring/README.md`
5. `docs/frontend/online-invitations/section-layout-catalog.md`
6. `docs/frontend/online-invitations/typography-and-fonts.md`
7. `docs/frontend/online-invitations/motion/README.md` và các motion reference liên quan
8. `docs/frontend/live-template-editor.md` khi task có editor/config mapping

## Product meaning: interactive invitation

Online Invitation là một **tấm thiệp mời tương tác dành cho người nhận**, không phải một website kể chuyện dài và cũng không phải album recap sau sự kiện.

### Viewer job

Viewer phải cảm thấy mình đang nhận và mở một tấm thiệp thật, sau đó nhanh chóng biết:

- Ai đang mời.
- Hai bên gia đình và vai vế liên quan.
- Ngày, giờ, nghi lễ, tiệc và địa điểm.
- Cách xem đường đi, lưu lịch, RSVP và gửi lời chúc.

### Experience arc

`opening ritual → mở thiệp → lời báo hỷ → gia đình → cô dâu/chú rể → ngày giờ/nghi lễ/tiệc → action RSVP/maps/calendar → album/lời chúc → kết thúc`

Opening và invitation card là signature của product. Motion phải tạo cảm giác mở phong bì, kéo rèm, lật thiệp, mở gate-fold hoặc nghi thức tương đương; không biến trang thành long-form editorial website.

### Visual and content bias

- Ưu tiên hierarchy rõ, scan nhanh trên mobile và CTA có thể thao tác ngay.
- Nội dung tiếng Việt trang trọng, cá nhân hóa theo lời mời cưới Việt Nam.
- Có thể dùng 3D card, paper material, ribbon, seal, envelope, calendar/ticket props và micro-interaction.
- Section optional phải hỗ trợ tắt độc lập, nhưng không được làm mất thông tin mời cốt lõi.

### Must avoid

- Không biến invitation thành website story nhiều chapter.
- Không thay lời mời bằng hero ảnh và tagline chung chung.
- Không bỏ family roles, ceremony/party details, RSVP hoặc action information chỉ vì art direction.
- Không dùng recap language như “tìm lại ký ức”, “album sau ngày cưới” làm mục đích chính.

## Domain responsibilities

- Giữ đúng nội dung thiệp Việt Nam, family announcement, vai vế, nghi lễ, tiệc, lời mời và các section bắt buộc của invitation contract.
- Chọn layout riêng cho từng section; không copy cấu trúc của website hoặc recap.
- Bảo đảm opening/invitation-card/banner/RSVP/gallery interaction đúng ngữ cảnh thiệp.
- Gọi common asset/motion/image rules trước khi dùng fixture hoặc bắt đầu viết renderer.
- Khai báo đầy đủ fields, media roles, toggle/reorder/layout và fallback trong `template-config.ts`.

## Deliverable

Trước khi code: brief art direction, section map, asset/decor plan, motion plan, media-independence plan và acceptance checklist. Sau khi code: renderer/config/fixture/test, asset manifest và validation report.

## Non-negotiable implementation checks

- Giữ nguyên shape của `template-config.ts` theo các template invitation hiện có để scanner/editor/validator đọc được; không tạo schema riêng cho từng template.
- Mỗi phần tử nhỏ có vai trò trong section phải có entrance effect riêng, dùng chung scroll-reveal class/utility của hệ thống và trigger theo convention sau khi scroll hơn một phần ba trang/viewport. Hiệu ứng phải đủ chậm để nhìn thấy, có reduced-motion fallback.
- Luôn truyền và xử lý `guestName` ở các section cần cá nhân hóa. RSVP và guestbook phải giữ API flow tương ứng, đồng thời kiểm tra `guestName` trước khi quyết định có hiển thị input nhập tên hay không.
- Label/title của field trong editor phải đầy đủ tiếng Việt. Không biến button text, placeholder hoặc copy chung chung thành field content editable.
- Decor nền renderer-owned không expose image input; chỉ expose ảnh user upload hoặc ảnh cặp đôi được dùng ở vị trí content/background đã định nghĩa.
- Family section phải làm tên cha mẹ/thành viên nổi bật hơn danh xưng, địa chỉ và metadata.
