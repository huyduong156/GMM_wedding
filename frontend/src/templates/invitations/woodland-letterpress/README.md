# Woodland Letterpress

Pre-code brief riêng của template invitation `woodland-letterpress`.

## Trạng thái

- Product type: `ONLINE_INVITATION`
- Giai đoạn: Phase 3 composition/config/artwork placement đã chốt; skeleton renderer và fixture còn thiếu, chưa chuyển Phase 4
- Presentation mode: mobile canvas tối đa `450px`
- Chưa tạo renderer hoặc fixture; approved artwork đã sẵn sàng làm input sau khi hoàn tất skeleton UI

## Product meaning

Woodland Letterpress là một thiệp cưới online có cảm giác như tấm thiệp giấy thủ công được ép chữ và đặt trong không gian rừng gỗ ấm. Người nhận mở thiệp, đọc nhanh lời mời và thông tin ngày làm lễ, sau đó có thể xem địa điểm, xác nhận tham dự và thực hiện các hành động liên quan.

Đây là interactive invitation, không phải wedding website kể chuyện dài và không phải album recap.

### Audience

- Khách mời Việt Nam, chủ yếu xem bằng điện thoại.
- Người nhận có thể mở thiệp từ link cá nhân hóa hoặc link chung.
- Người dùng cần đọc nhanh thông tin chính trong một lần cuộn, không cần hiểu quy ước thiết kế trước.

### Emotional direction

Ấm áp, gần gũi, trang trọng vừa đủ và có cảm giác nhận một vật phẩm thủ công. Woodland được thể hiện qua chất liệu giấy, dấu ép, vân gỗ và botanical mark, không qua một câu chuyện phiêu lưu trong rừng.

Experience arc: `mở bìa thiệp → banner → thư mời và gia đình → ngày làm lễ + countdown → lịch → địa điểm → nội dung tùy chọn → lời cảm ơn`.

## Art direction

### Woodland Letterpress

- Thiệp giấy thủ công, letterpress và pressed botanical.
- Giấy birch sáng làm nền chính, kết hợp xanh thông và nâu gỗ.
- Khung, đường chia và texture gợi vân gỗ nhưng không biến thành rustic wedding phổ thông.
- Họa tiết lá, cành và hạt rừng dạng in khắc, là renderer-owned artwork.
- Card nội dung giống mảnh giấy, tag gỗ, phiếu hồi đáp hoặc trang thư.
- Ảnh user upload chỉ là content; theme identity đến từ palette, typography, texture, frame, ornament và motion.

### Palette

| Token | Hex | Vai trò |
|---|---|---|
| `woodland-pine` | `#20352C` | Nền sâu, CTA chính, opening |
| `cedar-bark` | `#5A3D2E` | Khung gỗ và heading phụ |
| `moss` | `#78815C` | Họa tiết lá và điểm nhấn |
| `birch-paper` | `#E8DDCB` | Nền canvas và surface |
| `terracotta` | `#B9785D` | Accent ấm và dấu ngày |
| `ink-brown` | `#261F1A` | Nội dung chữ chính |
| `desktop-gutter` | `#D4C5AF` | Nền ngoài canvas |

Không dùng toàn bộ page bằng nâu đậm; nội dung chính phải giữ tương phản rõ trên nền giấy.

### Typography

- Display: `Lora GMM`, weight `600–700`, cho tên cặp đôi, heading và ngày lớn. Lora được chốt vì có độ ấm, nét serif rõ và cảm giác letterpress/thư tay.
- Body/UI: `Be Vietnam Pro GMM`, weight `400–600`, cho lời mời, địa chỉ, form, CTA và metadata; ưu tiên khả năng đọc tiếng Việt trên mobile.
- Accent: `Dancing Script GMM`, weight `500–600`, chỉ cho cụm ngắn như `With love` hoặc dấu nối tên.
- Font pairing đã chốt: `Lora + Be Vietnam Pro + Dancing Script`. Không dùng accent cho body, địa chỉ, button hoặc nội dung dài.
- Nội dung chính ưu tiên tiếng Việt.

## Presentation mode

Template chỉ có một composition mobile hoàn chỉnh.

- Canvas: `width: min(100%, 450px)`.
- Mobile: canvas chiếm toàn bộ chiều rộng khả dụng.
- Tablet/desktop: canvas căn giữa; phần dư dùng `desktop-gutter` hoặc màu nền đơn giản cùng palette.
- Không tạo layout desktop riêng.
- Layout ngang chỉ tồn tại bên trong canvas và phải có fallback xếp dọc hoặc scroll-snap.
- Kiểm tra ở `375px`, `390px`, `430px` và canvas tối đa `450px`.
- Toàn trang dùng smooth-scroll strategy đã có trong `Verdant Promise` để tránh cảm giác cuộn cứng.
- Smooth scroll là progressive enhancement: chỉ khởi tạo trên desktop hoặc thiết bị có fine pointer; mobile/touch giữ native scroll.

## Section map

### Core sections

| Key | Vai trò | Composition |
|---|---|---|
| `cover` | Mở thiệp | Woodland folio hoặc bìa giấy có seal; luôn ở đầu, không reorder |
| `banner` | Nhận diện cặp đôi | Tên cô dâu, chú rể và ngày cưới trên nền giấy có botanical frame |
| `invitation-letter` | Lời mời chính | Một composition liên tục gồm lời báo hỷ, hai gia đình và lời mời cá nhân hóa |
| `event-countdown` | Thời gian chính | Ngày cưới, ngày/giờ làm lễ và countdown bốn đơn vị |
| `calendar` | Tra cứu ngày | Lịch tháng, đánh dấu ngày cưới bằng vòng gỗ hoặc dấu lá |
| `venue` | Địa điểm | Tên địa điểm, địa chỉ, nút mở Google Maps và fallback text |
| `footer` | Kết thúc | Lời cảm ơn, monogram và chi tiết cành cây; luôn ở cuối |

`invitation-letter` là một khối hình ảnh liên tục để giảm chiều dài. Về dữ liệu và editor, các nhóm semantic `invitation`, `families` và `reception` vẫn phải có field mapping rõ ràng; không được làm mất vai vế, họ tên, tư gia hoặc lời mời cá nhân hóa.

### Optional sections

| Key | Vai trò | Composition |
|---|---|---|
| `timeline` | Mốc trong ngày | Vertical parallax, gồm giờ đón khách, giờ làm lễ, giờ khai tiệc và mốc phụ |
| `activities` | Hoạt động trong tiệc | Vertical parallax với composition khác timeline |
| `gallery` | Album ảnh | 3D slide/perspective; fallback 2D slider hoặc horizontal scroll-snap |
| `rsvp` | Xác nhận tham dự | Phiếu hồi đáp bằng giấy, form và trạng thái gửi rõ ràng |
| `guestbook` | Lời chúc | Note giấy hoặc thẻ treo trên nhánh cây |
| `gift` | Quà mừng | QR/card riêng, mặc định tắt |

Khi user tắt optional section, section đó rời DOM và không tự động chuyển dữ liệu sang section khác. `timeline` là optional hoàn toàn; khi tắt, giờ đón khách, giờ khai tiệc và các mốc phụ không hiển thị. `event-countdown` chỉ giữ ngày cưới, ngày/giờ làm lễ và countdown.

## Content system

### Core content

- Couple: tên hiển thị, tên đầy đủ, monogram và vai vế nếu có.
- Invitation: tiêu đề, lời báo hỷ, lời mời và câu kết.
- Guest personalization: `{guestName}`, fallback là `Quý khách`.
- Families: nhà trai/nhà gái, danh xưng, họ tên cha mẹ/người đại diện, tư gia hoặc quê quán.
- Event: ngày cưới và ngày/giờ làm lễ.
- Calendar: tháng/năm và ngày được đánh dấu.
- Venue: tên địa điểm, địa chỉ, map URL.
- Footer: lời cảm ơn và monogram.

### Optional content

- Timeline items: thời gian, tiêu đề, mô tả và địa điểm tùy chọn.
- Activities: tiêu đề và ảnh cho từng hoạt động.
- Gallery: 3–12 ảnh, alt text và focal point.
- RSVP: deadline, message và field theo invitation interaction contract.
- Guestbook: chỉ hiển thị lời chúc đã được duyệt.
- Gift: message và QR media riêng.

## Content anchor matrix

Mỗi khối phải tự giải thích được mục đích bằng label, heading, caption, metadata hoặc CTA. Các anchor dưới đây là kế hoạch nội dung cho fixture và renderer.

| Khối | Content anchor | CTA/metadata | Empty hoặc fallback |
|---|---|---|---|
| `cover` | Tên cặp đôi, ngày cưới | `Mở thiệp` | Vẫn mở được bằng nút text nếu artwork hoặc motion lỗi |
| `banner` | Tên cặp đôi, ngày cưới | Dòng giới thiệu ngắn tùy chọn | Hiển thị typography trên nền giấy nếu thiếu ảnh |
| `invitation-letter` | Lời báo hỷ, nhà trai/nhà gái, danh xưng, họ tên, tư gia, lời mời | `{guestName}` hoặc `Quý khách` | Ẩn độc lập người hoặc địa chỉ thiếu; giữ nhãn gia đình và lời mời |
| `event-countdown` | Ngày cưới, ngày/giờ làm lễ | Countdown `Ngày / Giờ / Phút / Giây` | Nếu ngày đã qua, hiển thị `Đã diễn ra`; nếu thiếu ngày thì không render countdown |
| `calendar` | Tháng/năm và ngày được đánh dấu | Liên kết tới thao tác thêm lịch nếu có | Hiển thị ngày dạng text nếu calendar không thể dựng |
| `venue` | Tên địa điểm, địa chỉ | `Mở Google Maps` | Giữ địa chỉ text nếu map URL hoặc iframe lỗi |
| `timeline` | Lịch trình và các mốc trong ngày | Giờ, địa điểm tùy chọn | Không có item thì section bị ẩn hoặc user tắt section |
| `activities` | Tên hoạt động và ảnh | Caption ngắn tùy chọn | Bỏ item thiếu dữ liệu; không tạo card rỗng |
| `gallery` | Album ngày vui | Điều khiển ảnh trước/sau | Thiếu ảnh thì dùng layout 2D; section có thể tắt |
| `rsvp` | Câu hỏi xác nhận tham dự | `Gửi xác nhận` | Hiển thị trạng thái lỗi/thành công bằng text và aria-live |
| `guestbook` | Lời chúc đã duyệt | `Gửi lời chúc` | Hiển thị empty state hướng dẫn gửi lời chúc |
| `gift` | Lời nhắn quà mừng và QR | Nút mở QR nếu cần | Mặc định ẩn; thiếu QR thì chỉ hiển thị lời nhắn |
| `footer` | Lời cảm ơn, monogram | Không có CTA cạnh tranh | Dùng lời cảm ơn mặc định nếu thiếu nội dung tùy chỉnh |

## Fixture plan

Fixture Phase 1 phải là dữ liệu giả lập, không chứa PII thật, thông tin tài khoản thật hoặc asset couple thật. Fixture chuẩn cần bao phủ:

- Tên tiếng Việt có dấu và tên dài.
- Hai bên gia đình có danh xưng, vai vế, tư gia và một member bị thiếu.
- Ngày/giờ làm lễ để kiểm tra countdown.
- Timeline có giờ đón khách, giờ làm lễ và giờ khai tiệc.
- Venue có địa chỉ dài và map URL mẫu.
- Gallery 3 ảnh mẫu cùng một số item optional.
- `guestName` cá nhân hóa và fallback `Quý khách`.
- Trạng thái optional bật đầy đủ để preview được toàn bộ template.

Fixture biến thể cần bao phủ: timeline tắt, toàn bộ optional section tắt, thiếu media, thiếu family member, tên hoặc địa chỉ dài và ngày cưới đã qua.

## Editor field plan

Các field dưới đây là kế hoạch cấp Phase 1; tên field cuối cùng phải được chuẩn hóa khi tạo `template-config.ts`.

| Nhóm | Field chính | Kiểu | Quyền chỉnh sửa |
|---|---|---|---|
| Couple | `brideName`, `groomName`, `monogram` | text | Owner chỉnh sửa |
| Cover/banner | `eyebrow`, `weddingDate`, `heroMedia` | text/date/image | Owner chỉnh sửa |
| Invitation | `invitationTitle`, `invitationMessage`, `guestGreeting` | text/textarea | Owner chỉnh sửa |
| Families | label, title, name, address cho từng bên | text/textarea | Owner chỉnh sửa từng field |
| Event | `ceremonyDate`, `ceremonyTime` | date/time | Owner chỉnh sửa |
| Calendar | display mode nếu template hỗ trợ | select | Chỉ chọn option đã triển khai |
| Timeline | `timelineItems[]` gồm time/title/detail/venue | repeatable items | Owner thêm, sửa, xóa, reorder |
| Activities | `activityItems[]` gồm title/image | repeatable items | Owner thêm, sửa, xóa |
| Gallery | `galleryImages[]` | images | Owner upload, reorder, xóa |
| RSVP | `rsvpDeadline`, `rsvpMessage` | date/textarea | Owner chỉnh sửa |
| Guestbook | display toggle và presentation option | boolean/select | Owner bật/tắt, chọn option |
| Gift | `giftMessage`, `giftQrMedia` | textarea/image | Owner chỉnh sửa, mặc định tắt |
| Footer | `footerMessage`, `footerMedia` | textarea/image | Owner chỉnh sửa |

Section `timeline`, `activities`, `gallery`, `rsvp`, `guestbook` và `gift` có toggle độc lập. `cover`, `banner`, `invitation-letter`, `event-countdown`, `calendar`, `venue` và `footer` là core section theo brief này.

### Editor behavior

- `cover` và `banner` không reorder.
- `invitation-letter`, `event-countdown`, `calendar`, `venue` và `footer` là anchor chính.
- `timeline`, `activities`, `gallery`, `rsvp`, `guestbook` và `gift` có toggle độc lập.
- Các section optional có thể reorder khi được khai báo trong config.
- Long names, long addresses, thiếu family member và missing media phải có fallback rõ ràng.
- Field, section, layout và media role phải được khai báo trong `template-config.ts`.

## Motion direction

### Signature effect

Opening là woodland folio: bìa xanh thông/nâu gỗ mở ra, seal và cành lá chuyển nhẹ, sau đó focus vào nội dung lời mời.

### Section motion

- `cover`: opening transition khi click, tap hoặc keyboard vào CTA.
- `banner`: paper reveal và name reveal theo thứ tự đọc.
- `invitation-letter`: các lớp nội dung giấy xuất hiện tuần tự; family block giữ hierarchy cao.
- `event-countdown`: reveal nhẹ; countdown cập nhật chính xác nhưng không gây nhiễu.
- `timeline`: vertical parallax theo các điểm dừng trong rừng.
- `activities`: vertical parallax theo các thẻ hoạt động, khác nhịp với timeline.
- `gallery`: 3D slide là visual signature của section, có control thủ công.
- `rsvp`, `guestbook`, `gift`: reveal, focus và state transition nhẹ.

Motion ưu tiên transform/opacity, chỉ chạy khi section gần viewport và phải cleanup khi unmount.

### Smooth-scroll implementation reference

Tái sử dụng pattern tích hợp hiện có của `Verdant Promise`: dynamic import `lenis`, khởi tạo một runtime cho invitation root, dùng `autoRaf`, `smoothWheel`, `wheelMultiplier` và `lerp` ở mức tương đương, đồng thời destroy runtime khi component unmount hoặc khi điều kiện thiết bị không còn phù hợp. Không tạo thêm một smooth-scroll runtime riêng cho từng section.

- Không khởi tạo Lenis trên mobile/touch-first.
- Không khởi tạo Lenis khi `prefers-reduced-motion: reduce`.
- Không khóa native vertical scroll, keyboard scroll hoặc focus navigation.
- Giữ native scroll-snap cho các vùng gallery/horizontal content.
- Nếu Lenis load lỗi, trang vẫn render và cuộn bằng native browser scroll.

Các phần tử nhỏ nhưng quan trọng trong từng section cũng phải có animation xuất hiện theo thứ tự đọc hoặc thứ tự thao tác phù hợp. Phạm vi này gồm label, heading, tên, vai vế, metadata, mốc thời gian, địa chỉ, CTA, card con, control album và trạng thái form. Có thể dùng fade in, slide in, scale nhẹ hoặc reveal theo nhóm; không animate mọi ký tự hoặc tạo chuyển động gây nhiễu. Nội dung vẫn phải hiển thị đầy đủ nếu animation lỗi.

### Reduced motion

- Folio hiển thị ở trạng thái mở hoặc chuyển tức thời.
- Tắt parallax, perspective tilt, auto-pan, spin và ambient particle động.
- Gallery chuyển sang 2D static hoặc scroll-snap.
- Content, CTA, form state và countdown vẫn hiển thị đầy đủ.
- Giữ native vertical scroll.

## Music control

Music không phải section riêng.

- Nút tròn cố định ở góc dưới bên phải canvas.
- Icon nốt nhạc ở giữa, vòng ngoài mô phỏng đĩa nhạc.
- Khi phát, đĩa xoay nhẹ và có CSS wave/ripple kín đáo.
- Khi dừng, đĩa đứng yên và label/icon thể hiện trạng thái.
- Trên tablet/desktop, nút bám theo mép phải canvas 450px, không trôi ra vùng gutter.
- Có accessible name cho play/pause và fallback khi autoplay bị từ chối.
- Reduced motion tắt xoay/wave nhưng giữ trạng thái semantic.

## Media và artwork plan

### User content media

- Couple, gallery, activity và footer image là media user có thể thay thế.
- Mỗi ảnh cần alt text, crop/focal point và fallback khi thiếu hoặc lỗi.
- Không để ảnh upload quyết định theme identity.

### Renderer-owned artwork

Tối thiểu cần các vai trò riêng biệt:

- Woodland folio/cover artwork.
- Pressed botanical frame hoặc branch ornament.
- Seal/medallion cho opening hoặc ngày cưới.
- Paper grain/letterpress texture.
- Divider hoặc woodcut mark.
- Nhóm lá/hạt rừng cho ambient và section edge.

Asset phải nằm trong bundle của template, có provenance/license hoặc manifest tương ứng, không hotlink và không chứa couple mẫu ở vị trí content.

## Non-goals

- Không biến template thành wedding website nhiều chapter.
- Không dùng background ảnh rừng lớn cho mọi section.
- Không dùng toàn bộ palette bằng nâu đậm.
- Không để decor che chữ, form hoặc CTA.
- Không chuyển dữ liệu từ section bị tắt sang section khác.
- Không dùng cùng một card giấy cho toàn bộ section.
- Không phụ thuộc hover; mọi interaction phải có touch và keyboard path.

## Acceptance checklist trước khi code

- [ ] Canvas mobile tối đa `450px`, desktop/tablet chỉ có gutter background.
- [ ] Cover là CTA mở thiệp, có fallback khi animation lỗi.
- [ ] Lời báo hỷ, family information và lời mời `{guestName}` nằm trong cùng visual letter composition.
- [ ] `event-countdown` chỉ có ngày cưới, ngày/giờ làm lễ và countdown.
- [ ] `timeline` optional hoàn toàn; tắt section không làm phát sinh fallback sang section khác.
- [ ] `activities` dùng vertical parallax riêng.
- [ ] `gallery` dùng 3D slide và có fallback 2D.
- [ ] Có core/optional section map rõ ràng.
- [ ] Family roles, danh xưng, tư gia và họ tên là field độc lập.
- [ ] Có palette, typography và material identity không phụ thuộc ảnh upload.
- [ ] Có ít nhất ba nhóm artwork renderer-owned khác vai trò.
- [ ] Các phần tử nhỏ nhưng quan trọng trong mỗi section đều có entrance animation hợp lý như fade in, slide in hoặc reveal theo thứ tự đọc.
- [ ] Toàn trang có smooth-scroll strategy dựa trên pattern Verdant Promise, với native/mobile/reduced-motion/error fallback.
- [ ] Music control cố định, accessible và có reduced-motion fallback.
- [ ] Nội dung tiếng Việt là chính, English tagline tối đa ba câu ngắn.
- [ ] Có kế hoạch kiểm tra long content, missing media, toggle, keyboard, focus, contrast và overflow.

## Phase 2: Media contract

Phase 2 xác định media trước khi tạo composition và renderer. Media user upload chỉ cung cấp nội dung; artwork renderer-owned phải chịu trách nhiệm giữ nhận diện Woodland khi ảnh bị thay thế hoặc bỏ trống.

### Media matrix

| Section | Media role | Source | Required | Số lượng | Tỉ lệ/crop | Fallback |
|---|---|---|---:|---:|---|---|
| `cover` | folio, seal, botanical ornament | Renderer-owned | Có | 1 nhóm asset | Theo canvas, không crop nội dung | Bìa giấy CSS tĩnh và CTA text |
| `banner` | hero/couple image | User upload | Không | 0–1 | Portrait ưu tiên, `cover`, focal center | Typography trên nền giấy, giữ tên và ngày |
| `invitation-letter` | family/couple image nếu concept dùng | User upload | Không | 0–2 | Portrait hoặc square, `cover`/`contain` tùy slot | Monogram, frame và text-only family block |
| `event-countdown` | paper/calendar ornament | Renderer-owned | Có | 1 nhóm asset | Transparent hoặc full-bleed theo slot | CSS paper surface, không mất ngày/giờ |
| `calendar` | woodcut mark/divider | Renderer-owned | Có | 1–2 | Transparent, không crop | CSS ring/mark đánh dấu ngày |
| `venue` | venue image/map preview | User upload hoặc external map | Không | 0–1 | Landscape hoặc square, `cover` | Địa chỉ text và nút mở Google Maps |
| `timeline` | milestone image | User upload | Không | 0–1/item | Portrait/square, focal center | Mốc dạng text trên trail |
| `activities` | activity image | User upload | Có khi item tồn tại | 1/item | Square hoặc landscape, `cover` | Bỏ item lỗi/thiếu, không tạo card rỗng |
| `gallery` | gallery image | User upload | Không | 3–12 | Giữ focal point, slide frame kiểm soát crop | 2D slider; section có thể tắt |
| `rsvp` | paper/response ornament | Renderer-owned | Có | 1 nhóm asset | Transparent | CSS paper form |
| `guestbook` | note/branch ornament | Renderer-owned hoặc user upload | Không | 0–1 nhóm + lời chúc | Không crop text hoặc QR | Note CSS và empty state |
| `gift` | gift QR | User upload | Có khi gift bật | 0–2 | Square, `contain`, không crop | Hiển thị message, ẩn QR nếu thiếu |
| `footer` | closing image | User upload | Không | 0–1 | Portrait/square, `cover` | Monogram và branch artwork |
| Toàn trang | grain, branch, divider, seal, ambient leaf | Renderer-owned | Có | Nhiều asset theo role | Transparent hoặc texture repeat có kiểm soát | CSS gradient/shape tĩnh |

### Renderer-owned identity assets

Các asset sau không được lấy từ ảnh user upload:

- Woodland folio/cover artwork.
- Pressed botanical frame hoặc branch ornament.
- Seal/medallion cho opening hoặc ngày cưới.
- Paper grain/letterpress texture.
- Divider hoặc woodcut mark.
- Nhóm lá/hạt rừng cho ambient và section edge.

Mỗi asset phải có tên theo role, nằm trong bundle template, có preview và ghi provenance/license trong manifest của template trước khi dùng trong renderer.

### Upload và editability matrix

| Media | Owner upload | Thay thế | Reorder | Xóa | Alt text | Focal point |
|---|---:|---:|---:|---:|---:|---:|
| Banner image | Có | Có | Không | Có | Bắt buộc khi có ảnh | Có |
| Invitation/family image | Có | Có | Không | Có | Bắt buộc khi có ảnh | Có |
| Venue image | Có | Có | Không | Có | Bắt buộc khi có ảnh | Có |
| Timeline image | Có | Có | Theo item | Có | Bắt buộc khi có ảnh | Có |
| Activity image | Có | Có | Theo item | Có | Bắt buộc | Có |
| Gallery images | Có | Có | Có | Có | Bắt buộc từng ảnh | Có |
| Gift QR | Có | Có | Theo bên nhận | Có | Bắt buộc, không đọc dữ liệu QR trong alt | Không, dùng `contain` |
| Footer image | Có | Có | Không | Có | Bắt buộc khi có ảnh | Có |
| Renderer-owned artwork | Không | Không trong owner editor | Không | Không | `alt=""` nếu trang trí | Không |

Owner editor chỉ được chọn presentation option đã có renderer thật, mobile fallback và reduced-motion fallback. Không expose artwork renderer-owned như media upload.

### Crop, focal point và responsive rules

- Canvas luôn giới hạn 450px; media không được tạo horizontal overflow.
- Portrait couple/banner ưu tiên `object-position: 50% 40%`; focal point từ user override được tôn trọng.
- Gallery và activity dùng `object-fit: cover`, nhưng giữ focal point cho mặt người hoặc chủ thể chính.
- QR dùng `object-fit: contain`, nền tương phản và không được cắt.
- Logo, seal, line art, frame và ornament trong suốt không dùng `cover`; giữ toàn bộ asset bằng `contain`.
- Ảnh landscape trong slot portrait được crop có kiểm soát hoặc chuyển sang layout có surface giấy; không kéo méo ảnh.
- Ảnh thiếu focal point dùng center crop an toàn; không suy luận focal point từ tên file.
- Ảnh lỗi, loading hoặc kích thước thấp không được làm mất heading, metadata, CTA hoặc semantic content.
- Ảnh lazy-load khi nằm ngoài vùng gần viewport; cover/banner ưu tiên tải sớm.

### Missing, error và empty states

- Thiếu banner image: hiển thị typography, paper texture và botanical frame.
- Thiếu family/couple image: giữ text, vai vế, monogram và layout hoàn chỉnh.
- Thiếu venue image hoặc map iframe lỗi: giữ địa chỉ text và nút mở Google Maps.
- Timeline không có item: nếu section đang bật thì hiển thị empty state có hướng dẫn; nếu user tắt thì rời DOM.
- Activities có item thiếu ảnh: giữ title nếu contract cho phép, hoặc bỏ item đó; không render placeholder giả như nội dung thật.
- Gallery có dưới 3 ảnh: dùng layout 2D phù hợp hoặc empty state; không hiển thị 3D deck rỗng.
- Gift bật nhưng thiếu QR: giữ message, ẩn vùng QR và không tạo QR giả.
- Lỗi media runtime không được chặn mở thiệp, đọc nội dung hoặc thao tác CTA.

### External album behavior

Woodland Phase 2 không dùng external album làm nguồn chính cho gallery. Nếu contract sau này bổ sung external album:

- URL phải là field riêng, validate ở boundary và có accessible name.
- CTA phải nói rõ hành động mở album ngoài thiệp.
- Mở tab mới chỉ khi có thông báo phù hợp; không nhúng nguồn không đáng tin vào canvas.
- URL lỗi hoặc rỗng phải fallback về gallery nội bộ hoặc ẩn CTA.
- External album không được thay thế album nội bộ trong fixture mặc định.

### Media field mapping dự kiến

Các role dưới đây sẽ được đưa vào `template-config.ts` khi sang Phase 3 và không được hard-code khác giữa editor và renderer:

```ts
type WoodlandMediaRole =
  | 'hero'
  | 'invitation'
  | 'venue'
  | 'timeline'
  | 'activity'
  | 'gallery'
  | 'gift-qr'
  | 'footer'
```

`cover`, `event-countdown`, `calendar`, `rsvp` và các decor/texture identity dùng renderer-owned asset manifest, không nhận upload tùy ý từ owner.

### Media-independence checklist

- [ ] Thay toàn bộ ảnh user bằng ảnh trung tính vẫn nhận ra Woodland Letterpress.
- [ ] Thử ảnh sáng, ảnh tối, portrait, landscape và crop không lý tưởng.
- [ ] Thử bỏ banner, family image, venue image, activity image, gallery và footer image.
- [ ] Text, family role, ngày/giờ, địa chỉ, CTA và hierarchy vẫn đọc được.
- [ ] Renderer-owned artwork không phụ thuộc couple/model/sample photo.
- [ ] Không có asset hotlink hoặc asset không rõ provenance/license.
- [ ] User upload và renderer-owned artwork có field/path tách biệt.
- [ ] QR không bị crop, không đưa dữ liệu tài khoản thật vào fixture hoặc log.

## Phase 2 completion

- [x] Media matrix cho toàn bộ section.
- [x] Upload/editability matrix.
- [x] Crop, focal point và responsive media rules.
- [x] Missing, error và empty state rules.
- [x] External album behavior.
- [x] Media field roles và mapping dự kiến vào `template-config.ts`.
- [x] Media-independence checklist.

## Bước tiếp theo

Composition map, layout/transition map, config skeleton và approved decor input đã có. Phase 3 chỉ hoàn tất sau khi có skeleton renderer, fixture và test mapping; chưa bắt đầu Phase 4.
