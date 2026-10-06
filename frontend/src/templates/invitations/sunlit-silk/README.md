# Nắng Trên Lụa — Authoring log

Technical key: `sunlit-silk`  
Product type: `ONLINE_INVITATION`

## Phase tracker

| Phase | Status | Evidence |
| --- | --- | --- |
| 0 — preview shell / spatial contract | Complete | Isolated renderer/CSS shell, direct preview route and focused route test. |
| 1 — product meaning / content system | Complete | Product meaning, theme brief, viewer journey, section/content matrix, fixture/editor plan and acceptance checklist below. |
| 2 — media contract / media independence | Complete | Per-section media matrix, ownership/editability, responsive crop/fallback rules, future config mapping and replacement tests below. |
| 2.5 — decor pre-production | Approved | Approved renderer-owned artwork set is recorded in [`PHASE-2.5.md`](./PHASE-2.5.md) and [`ASSET-MANIFEST.md`](./ASSET-MANIFEST.md). |
| 3 — section architecture | Rebuilt; code gate complete | All 16 anchors now map to real invitation layouts and editor fields instead of a shared placeholder card. The renderer includes family hierarchy, date ledger, calendar, timeline, venue, gallery and interaction surfaces. |
| 4 — motion / interaction | Rebuilt; code gate complete | The opening remains mounted through its exit choreography, section entrances use `motion/react`, atmosphere pauses with page visibility, and reduced-motion keeps content immediately available. |
| 5 — asset integration / release | Reopened; pending | The earlier Phase 5 claim was invalidated by browser review. Asset-size optimization and the complete 375/390/480/tablet/desktop visual gate remain open. |

## Phase 0 brief

Preview URL: `/templates/invitations/sunlit-silk/preview`

Phase 0 only locks the spatial foundation for a warm beige invitation called **Nắng Trên Lụa**. The quiet material direction is sunlit raw silk and linen, with antique-brass ink rather than the common beige/terracotta treatment. The diagonal translucent band is a temporary CSS spatial marker for the future ribbon signature; it is not final artwork or opening choreography.

The shell intentionally contains no invitation business section, API integration, content fixture, `template-config.ts`, user media, final artwork or Phase 1 content decisions.

## Spatial contract

- `.ss-page` owns the full viewport and desktop/tablet atmosphere. It clips horizontal overflow at the page boundary.
- `.ss-stage` is the only invitation canvas. It is fluid below `480px`, capped at `480px`, centered on wider screens and clips every renderer-owned layer. Its material background is shared by every invitation section; section wrappers stay transparent so the reading experience feels like one continuous sheet.
- Critical content and final decor must remain inside `.ss-stage`; desktop gutters never carry information or interactive controls.
- Mobile uses the full viewport width and at least `100dvh`; no fixed minimum width is allowed.
- From `600px`, a controlled `24px` top/bottom gutter separates the paper canvas from the surrounding atmosphere. The invitation never expands into a full-width website layout.
- The stage may grow vertically in later phases. Its horizontal overflow boundary remains owned by `.ss-stage`.
- The Phase 0 shell has no animation. Reduced-motion nevertheless forces future accidental transitions/animations inside this namespace to resolve immediately; later intentional motion must define its own semantic fallback.

## Phase 0 acceptance

- [x] Direct preview route is registered in `shared/config/routes.ts` and dispatched by `app/App.tsx`.
- [x] Renderer and stylesheet are isolated under `templates/invitations/sunlit-silk/` and the `ss-` namespace.
- [x] Content canvas is fluid at 375/390px and capped at 480px for tablet/desktop.
- [x] Page and stage own explicit horizontal overflow boundaries.
- [x] Desktop gutter is atmosphere-only.
- [x] Temporary ribbon marker is clipped by the invitation canvas.
- [x] No business sections, final artwork, template config, fixture or Phase 1 implementation were added.
- [x] Static reduced-motion behavior is documented and enforced.
- [x] Focused route smoke test and frontend typecheck pass.

Phase 1 must begin by rereading the shared theme-authoring and online-invitation contracts, then producing the full product/content brief for approval before section implementation.

## Phase 1 — Product meaning, chủ đề và content system

### Product meaning

`Nắng Trên Lụa` là một `ONLINE_INVITATION` mobile-first dành cho khách mời Việt Nam. Trải nghiệm phải giống nhận một tấm thiệp bọc lụa thật: khách tháo đai lụa, đọc lời báo hỷ trang trọng, nhận ra ngay hai gia đình và cặp đôi, rồi nhanh chóng biết ngày giờ, nghi lễ, tiệc, địa điểm và cách phản hồi.

Đây không phải Wedding Website kể chuyện dài theo nhiều chapter và không phải Wedding Recap nhìn lại sự kiện đã diễn ra. Mọi bố cục, chuyển động và CTA đều phục vụ hành vi nhận lời mời, đọc thông tin và phản hồi.

### Audience và viewer job

Audience chính là khách mời Việt Nam xem trên điện thoại 375–480px, bao gồm người lớn tuổi cần chữ rõ và khách trẻ cần thao tác RSVP/maps/calendar nhanh. Owner phù hợp là cặp đôi tổ chức lễ cưới biển, resort, sân vườn hoặc không gian đón nắng nhưng muốn sự tinh tế thay vì rustic/boho.

Viewer phải hoàn thành được các việc sau:

1. Cảm nhận nghi thức mở một tấm thiệp có chủ ý, không phải mở landing page.
2. Biết ai đang mời, ai kết hôn, vai vế và đại diện hai bên gia đình.
3. Đọc đúng ngày, giờ, nghi lễ, tiệc và địa điểm mà không phải tìm kiếm.
4. Mở bản đồ, lưu lịch và xác nhận tham dự bằng CTA rõ ràng.
5. Nếu muốn, xem album, gửi lời chúc và xem thông tin mừng cưới.

### Viewer journey

`đai lụa niêm thiệp → tháo lụa/mở thiệp → tên cặp đôi và ngày cưới → lời báo hỷ cá nhân hóa → hai gia đình → nghi lễ/tiệc và lịch trình → bản đồ/lưu lịch → RSVP → album/lời chúc/quà mừng tùy chọn → hai đầu lụa khép lại`

Thông tin cốt lõi xuất hiện sớm và có thể scan nhanh. Phần album, hoạt động và quà mừng không được chen trước lời mời, gia đình, sự kiện, địa điểm hoặc RSVP.

### Distinctness theo product type

- So với **Wedding Website**, canvas luôn là một tấm thiệp dọc cô đọng tối đa 480px; không có navigation nhiều chapter, hero desktop toàn màn hình, câu chuyện tình yêu dài hoặc các khối marketing.
- So với **Wedding Recap**, nội dung dùng thì hiện tại/tương lai và hành động tham dự; gallery chỉ hỗ trợ nhận diện cặp đôi, không dùng ngôn ngữ “nhìn lại”, “ký ức” hoặc album hậu sự kiện làm mục đích chính.
- Signature opening là nghi thức tháo đai lụa để nhận lời mời. Dải lụa không trở thành scroll-world vô tận hay hiệu ứng kể chuyện lấn át thông tin.

## Theme brief

| Dimension | Decision |
| --- | --- |
| Subject | Một bộ stationery cưới Việt Nam bọc lụa thô, đặt cạnh cửa sổ vào cuối chiều; dành cho khách mời cần đọc và phản hồi nhanh. |
| Single job | Trao một lời mời trang trọng, dễ đọc và dẫn khách tới RSVP/maps/calendar. |
| Visual metaphor | Dải lụa nối hai gia đình và thắt lại thành lời hẹn; đường may là trục dẫn mắt xuyên thiệp. |
| Emotion | Ấm, tĩnh, thanh lịch, gần gũi với chất liệu thủ công; sang nhưng không phô trương. |
| Layout principle | Một canvas giấy/lụa liên tục. Bố cục luân phiên giữa mép lụa lệch, giấy ép chìm và khoảng thở; không lặp card căn giữa cho mọi section. |
| Signature opening | Một đai lụa gấp chéo đang che một phần tên. Tap/Enter/Space tháo chốt kim loại nhỏ; dải lụa trượt và mở nếp để lộ tấm thiệp. Full motion là mặc định. Reduced motion đổi ngay sang trạng thái đai đã tháo, giữ dải lụa tĩnh và toàn bộ nội dung đọc được. |
| Material | Lụa thô, linen, giấy cotton ép chìm, chỉ may mảnh, đồng cũ; không marble, glassmorphism, pampas hay kraft rustic. |
| Decor direction | Renderer-owned ribbon, đường may, bóng nắng qua rèm và dấu ép chìm trừu tượng. Hoa nếu có chỉ là chi tiết phụ rất tiết chế, không phải hệ nhận diện. |
| Motion direction | Một choreography chính cho opening; sau đó dải lụa dịch chuyển có kiểm soát, semantic entrance bằng `motion/react`, list stagger cho item lặp, ambient light và lớp “lụa phấn” gồm các hạt bụi ánh nắng trôi rất chậm. Mobile/touch dùng native scroll. |
| Accessibility | Full motion là trải nghiệm mặc định nhưng không mang semantic state. `prefers-reduced-motion` bắt buộc tắt translate/scale/rotate/parallax, delay bằng 0, giữ state tức thời, focus và nội dung đầy đủ. |
| Language | Tiếng Việt là chính. Chỉ dùng tối đa **1** English tagline ngắn trong toàn thiệp; mặc định không cần English. |

### Named palette

| Token | Hex | Role |
| --- | --- | --- |
| Lụa ngà | `#F5EFE4` | Canvas chính và nền giấy sáng. |
| Cát sáng | `#E4D7C1` | Lớp linen, panel phụ và nếp lụa. |
| Be khoáng | `#C8B38E` | Dải lụa, divider và bề mặt trung gian. |
| Đồng cũ | `#9A8058` | Accent duy nhất cho đường may, dấu niêm và CTA. |
| Gỗ hun | `#584B3F` | Body ink, metadata đậm và outline. |
| Mực nâu đen | `#282521` | Heading, tên riêng và tương phản chính. |

Không thêm terracotta/cam đất. Màu trạng thái hệ thống phải đạt contrast và không chỉ dựa vào màu; chúng không thay đổi palette nhận diện.

### Typography đã có trong repository

- **Allura** qua package tự host `@fontsource/allura`: script accent cho title opening, tên cặp đôi trên cover, lời mời trọng tâm và closing title. Font có Vietnamese subset và SIL OFL 1.1; không faux-bold và không dùng cho body dài. Nguồn chọn font: [FontSpace](https://www.fontspace.com/allura-font-f13411), bản webfont/package: [Fontsource](https://fontsource.org/fonts/allura/about).
- **Cormorant Garamond GMM** qua `--font-wedding-display`: display serif cho ngày lớn và heading thông tin trang trọng; dùng từ khoảng 28px, không dùng cho body dài. Font đã self-host, có Vietnamese subset và SIL OFL 1.1 theo typography contract.
- **Be Vietnam Pro GMM** qua `--font-wedding-body`: body, địa chỉ, vai vế, form, nút và nội dung dài. Đây là font được thiết kế cho tiếng Việt, self-host và có SIL OFL 1.1.
- Không dùng script/accent font trong mặc định. Utility label dùng chính Be Vietnam Pro với chữ hoa nhỏ và tracking có kiểm soát, tránh tải thêm family chỉ để trang trí.

Chuỗi kiểm tra bắt buộc ở phase implementation: `Trân trọng kính mời`, `Nguyễn & Đỗ`, `Lễ Thành Hôn`, `Thứ Bảy`, `Địa điểm tổ chức`, tên dài và chữ hoa có dấu.

### Motion contract cho các phase sau

- Full motion là mặc định: tháo đai lụa 0.9–1.3s; entrance semantic theo local token có `duration`, `stagger`, `listStagger`, ease `[0.22, 1, 0.36, 1]`; ambient light và “lụa phấn” là lớp renderer-owned bounded, hạt thưa, không ảnh hưởng layout.
- Heading, copy, card, control và item lặp phải có target tường minh; decor/ribbon/ambient có motion owner riêng. Không dùng broad selector hoặc khôi phục `.reveal` legacy.
- CTA và thông tin không bị khóa quá 1.5s. Opening có thể bỏ qua và luôn mở bằng keyboard.
- Reduced motion là fallback bắt buộc: không smooth-scroll interception, parallax, scrub, rotate, scale hoặc ribbon travel; trạng thái mở xuất hiện tức thời, delay bằng 0, nội dung luôn visible. While the opening gate is active, `html` and `body` carry `ss-opening-lock` so the page cannot scroll behind the full-viewport ritual.
- Motion không truyền đạt RSVP success/error một mình; text, `aria-live` và focus management có trước decoration.

## Section inventory

### A. Core semantic — required và không toggle

`opening`, `cover`, `invitation`, `families`, `eventDetails`, `footer`.

- `cover` đồng thời đảm nhiệm **banner sau khi mở** và **couple identity**: tên hiển thị đầy đủ của cô dâu/chú rể nằm ở banner; vai vế và tên đầy đủ được nhắc lại trong `families`. Không tạo một section `couple` rỗng chỉ để đủ danh sách.
- `eventDetails` giữ toàn bộ **ngày/giờ chính, nghi lễ, tiệc, venue name và địa chỉ text canonical**. Vì vậy các presentation capability như countdown, calendar hoặc venue/map có thể tắt mà không xóa thông tin tham dự cốt lõi.
- `opening` luôn đầu, `cover` ngay sau opening, `footer` luôn cuối. `families` có thể đổi vị trí trong vùng core theo catalog nhưng không được tắt hoặc đẩy ra sau action/memory tail.

### B. Supported capability — default-on nhưng owner được toggle

`countdown`, `calendar`, `timeline`, `venue`, `gallery`, `rsvp`, `guestbook`.

Template bắt buộc phải thiết kế và triển khai các capability này ở phase sau. Owner có thể tắt từng section độc lập; section tắt phải rời DOM và seam tự nối lại. `calendar` là **visual calendar** riêng, không phải link thêm lịch; action Google Calendar/ICS vẫn được compose cạnh `eventDetails` hoặc `venue` khi URL hợp lệ. `venue` chỉ là map/presentation tăng cường: tắt nó không được xóa venue name/address text trong `eventDetails`.

### C. Default-off optional capability

`activities`, `gift`, `music`.

Các section này mặc định tắt nhưng template vẫn phải triển khai nếu khai báo hỗ trợ. Chúng phải tắt độc lập, biến mất khỏi DOM và không để khoảng trống. `activities` và các presentation section có layout option chỉ được expose option mà renderer thực sự triển khai ở Phase 3.

## Detailed section/content matrix

| Section key | Status | Content anchor | Content keys và dữ liệu mặc định tiếng Việt | Editor control | Empty/fallback | CTA/action | Toggle, reorder, repeatable, layout |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `opening` | Core required | Nghi thức mở thiệp | `opening.eyebrow`: `Trân trọng gửi lời mời`; `opening.title`: `Nắng Trên Lụa`; `opening.message`: `Chạm để mở tấm thiệp của Minh An và Thu Hà`; dùng tên/ngày từ couple/event summary | Chỉ message owner-specific nếu contract hiện hành cho phép; không expose chữ nút, chốt, ribbon hoặc motion | Luôn tồn tại; thiếu message dùng tên cặp đôi và ngày; reduced motion mở tức thời | Nút hệ thống `Mở thiệp`, keyboard Enter/Space | Fixed first; không toggle/reorder/repeat; một layout đai lụa |
| `cover` | Core required | Banner, couple identity và ngày cưới | `couple.brideName`: `Thu Hà`; `couple.groomName`: `Minh An`; `cover.eyebrow`: `Lễ Thành Hôn`; `event.weddingDate`: `2027-01-16`; `cover.tagline`: `Giữa một chiều đầy nắng, chúng mình chọn ở lại bên nhau.` | Tên, eyebrow, tagline và ngày; media để Phase 2 quyết định | Không có ảnh vẫn giữ typography, ribbon và ngày; tên/ngày không được rỗng khi publish | Không có CTA chính | Fixed sau opening; không toggle/repeat; layout typography trên giấy/lụa. Fulfill catalog `Banner` + `Cô dâu và chú rể`; vai vế đầy đủ tiếp tục ở `families` |
| `invitation` | Core required | Lời báo hỷ và kính mời đúng người nhận | `invitation.title`: `Trân trọng kính mời`; `invitation.message`: `{guestName} đến chung vui trong ngày thành hôn của chúng mình.`; `invitation.note`: `Sự hiện diện của quý khách là niềm vinh hạnh cho hai gia đình.` | Title, message, note; `{guestName}` là runtime token, không phải fixture PII | Thiếu `guestName` dùng `quý khách`; thiếu note thì bỏ note, không bỏ lời mời | Không CTA | Fixed trước families; không toggle/repeat; một layout giấy ép chìm |
| `families` | Core required | Hai bên gia đình, couple identity đầy đủ và vai vế | `families.bride.label`: `Nhà gái`; cha: title `Ông`, name `Nguyễn Văn Hải`; mẹ: title `Bà`, name `Trần Thu Lan`; personRole `Trưởng nữ`, personName `Thu Hà`; address `Quận 3, TP. Hồ Chí Minh`. Nhà trai tương ứng: `Ông` `Lê Minh Quang`, `Bà` `Phạm Ngọc Mai`, `Trưởng nam` `Minh An`, `Thành phố Thủ Đức, TP. Hồ Chí Minh`; `families.invitationLine`: `Hai gia đình chúng tôi trân trọng báo hỷ.` | Field riêng cho label, từng danh xưng, từng họ tên, vai vế, tên cô dâu/chú rể, địa chỉ và lời báo hỷ | Tên cha mẹ không được suy luận bằng parse chuỗi; field chưa có dùng fallback trung tính, không render dấu câu trống | Không CTA | Không toggle; có thể reorder có giới hạn trong vùng core theo catalog; hai family group không repeat tự do; mobile xếp dọc; tên người lớn hơn danh xưng/địa chỉ |
| `eventDetails` | Core required | Ngày/giờ chính, nghi lễ, tiệc và địa chỉ canonical | `eventDetails.title`: `Ngày chúng mình thành đôi`; ceremony: `Lễ Thành Hôn`, `09:00`, `Thứ Bảy, 16 tháng 01 năm 2027`, `The Coastal Garden`, `12 Đường Biển Xanh, TP. Hồ Chí Minh`; reception: `Tiệc Chung Vui`, `11:00`, cùng venue/address; `lunarDate`: `Nhằm ngày 09 tháng Chạp năm Bính Ngọ`; `dressCode`: `Trang phục màu trung tính` | Date/time, event labels, venue name/address text, lunar date và dress code; danh sách event theo canonical shape | Luôn giữ ít nhất một event hợp lệ với ngày/giờ/địa chỉ text; thiếu lunar/dress code thì ẩn đúng dòng. Tắt `venue` map presentation không ảnh hưởng dữ liệu này | `Lưu lịch` nếu calendar action hợp lệ | Không toggle; event item repeatable có giới hạn và reorder nội bộ; ceremony/reception composition có thể reorder theo catalog nhưng vẫn ở core information arc |
| `countdown` | Supported, default-on | Còn bao lâu đến ngày vui | Derived từ timestamp `2027-01-16T09:00:00+07:00`; labels `Ngày`, `Giờ`, `Phút`, `Giây`; title `Hẹn gặp nhau trong` | Không sửa số; title nếu là owner content; timestamp lấy từ event | Timestamp invalid hiển thị ngày cưới tĩnh; timer dừng ở 0; `aria-live="off"`; tắt section không ảnh hưởng date/time core | Không CTA bắt buộc | Owner toggle; reorder trong capability zone; không repeat; layout timer riêng, không dùng animation để tính giờ |
| `calendar` | Supported, default-on | Lịch tháng trực quan đánh dấu ngày cưới | `calendar.title`: `Tháng Một · 2027`; month grid January 2027; selected date `16`; weekday labels tiếng Việt | Title nếu là owner content; tháng/ngày derived từ event, không sửa hai nguồn độc lập | Ngày chọn nhận biết bằng shape + text, không chỉ màu; date invalid thì section rời DOM; tắt calendar không ảnh hưởng date text core | Có thể đặt `Lưu lịch`, nhưng visual calendar không đồng nghĩa external calendar action | Owner toggle; reorder cạnh `eventDetails`/`countdown`; không repeat; layout `linen-month-grid` dự kiến, Phase 3 xác nhận |
| `timeline` | Supported, default-on | Trình tự trong ngày | `timeline.title`: `Lịch trình ngày vui`; items: `08:30 · Đón khách`, `09:00 · Lễ Thành Hôn`, `10:00 · Chụp ảnh cùng gia đình`, `11:00 · Khai tiệc` với detail ngắn | Repeatable rows: time, title, detail; add/remove/reorder | Không có item hợp lệ thì section rời DOM; ceremony/reception time vẫn còn trong `eventDetails` | Không CTA | Owner toggle; reorder trong capability zone; repeatable 2–8; layout option chỉ từ renderer thật |
| `venue` | Supported, default-on | Map và presentation tăng cường cho địa điểm | `venue.title`: `Nơi chúng mình đón bạn`; `venue.name`: `The Coastal Garden`; `venue.address`: `12 Đường Biển Xanh, TP. Hồ Chí Minh`; `venue.note`: `Sảnh Lụa · Tầng trệt`; `mapUrl`, `calendarUrl` theo fixture giả hợp lệ ở Phase 3 | Name/address dùng cùng canonical event source hoặc mapping không gây divergence; note và map/calendar URL theo contract | URL/iframe lỗi vẫn có address text trong section và link fallback; khi owner tắt cả section, venue name/address canonical vẫn hiện ở `eventDetails` | `Xem bản đồ`, `Lưu lịch` | Owner toggle; reorder trong action/capability zone trước RSVP; không repeat trong v1; layout map + fabric tag |
| `activities` | Supported, default-off | Những hoạt động khách có thể tham gia | `activities.title`: `Một vài điều dành cho bạn`; items mặc định: `Góc ảnh nắng`, `Bàn viết lời chúc`, `Tiệc trà bên hiên`, mỗi item có detail ngắn | Title; repeatable item title/detail; media role để Phase 2 quyết định; select layout chỉ từ option renderer thật | 0 item hoặc owner tắt: section rời DOM; item thiếu title bị loại; media thiếu vẫn dùng text composition | Không CTA bắt buộc | Owner toggle; reorder trong optional zone sau venue hoặc gallery; repeatable 1–6; dự kiến `stitched-list`/`ticket-strip` cần Phase 3 xác nhận |
| `gallery` | Supported, default-on | Nhận diện cặp đôi trước ngày cưới | `gallery.title`: `Chúng mình, trong những ngày đầy nắng`; `gallery.caption`: `Một vài khoảnh khắc trước khi cùng bước sang chương mới.`; media để Phase 2 lập contract | Title/caption; image collection sau Phase 2; select layout từ renderer thật | 0 ảnh hoặc owner tắt: section rời DOM; ảnh lỗi bỏ riêng item, không phá width | Controls `Ảnh trước`, `Ảnh tiếp theo`; không dùng external album mặc định cho tới Phase 2 | Owner toggle; reorder trong memory zone sau core/action; repeatable media; dự kiến `linen-stack`/`contact-sheet`, Phase 3 xác nhận |
| `rsvp` | Supported, default-on | Xác nhận tham dự | `rsvp.title`: `Bạn sẽ đến chung vui cùng chúng mình chứ?`; `rsvp.message`: `Vui lòng phản hồi trước ngày 05 tháng 01 năm 2027.`; `rsvp.deadline`: `2027-01-05`; attendance/party-size/dietary fields theo flow chung | Chỉ owner content và deadline; không expose label nút, placeholder, validation/system copy | Có `guestName`: hiện tên đã xác định, không hỏi lại; thiếu mới hiện input tên; API error/offline giữ dữ liệu và cho thử lại; owner tắt thì form rời DOM | `Xác nhận tham dự` gọi RSVP API, có submitting/success/error rõ | Owner toggle; reorder trong action zone sau core event/address; party members repeat theo contract chứ không phải layout data |
| `guestbook` | Supported, default-on | Gửi lời chúc | `guestbook.title`: `Gửi chúng mình một lời chúc`; `guestbook.message`: `Mỗi lời nhắn sẽ được chúng mình trân trọng giữ lại.` | Owner title/message; wish body và fallback name là runtime form, không phải editable template copy | Có `guestName` thì không hỏi lại tên; danh sách trống vẫn giữ form; API/rate-limit/offline có recovery; owner tắt thì toàn section rời DOM | `Gửi lời chúc` gọi wishes API | Owner toggle; reorder trong memory/action tail; wish list repeat từ API, không cho layout làm mất moderation semantics |
| `gift` | Supported, default-off | Thông tin mừng cưới tế nhị | `gift.title`: `Gửi lời chúc từ xa`; `gift.message`: `Tình cảm và sự hiện diện của bạn đã là món quà quý giá.`; account holder `LÊ MINH AN`; bank metadata và QR giả chỉ được lập ở Phase 2/fixture sau | Owner message; bank/account fields và QR media theo contract sau; không expose text nút chung | Thiếu QR/account hoặc owner tắt thì transfer panel rời DOM; dữ liệu nhạy cảm không hard-code thật | Disclosure `Xem thông tin mừng cưới`, copy account nếu có | Owner toggle; reorder near tail; account rows repeat có giới hạn nếu canonical config hỗ trợ; không reorder trước core event/action zone |
| `music` | Supported, default-off | Nhạc nền do khách chủ động kiểm soát | `music.title`: `Nhạc của ngày vui`; track reference để Phase 3/contract quyết định; autoplay mặc định `false` | Chọn track/autoplay theo capability chung; không nhập URL tùy ý nếu catalog không cho phép | Không có track hoặc owner tắt thì không render player; lỗi phát giữ invitation hoạt động | `Phát nhạc` / `Tạm dừng` là system copy | Owner toggle; không phải visual section reorderable; single track/capability theo contract |
| `footer` | Core required | Khép lại lời mời | `footer.message`: `Hẹn gặp bạn trong ngày nắng dịu.`; couple summary `Minh An & Thu Hà`; date `16 · 01 · 2027`; optional single English tagline mặc định để trống | Message và summary derived/owner content; English tagline optional nhưng toàn thiệp tối đa 1 | Message rỗng dùng tên + ngày; không phụ thuộc ảnh | Không CTA chính; có thể có `Về đầu thiệp` là system action nếu cần | Fixed last; không toggle/repeat; hai đầu lụa gặp nhau thành nút tĩnh trong reduced motion |

## Content fixture plan — chưa triển khai

Phase 3 chỉ được tạo fixture sau khi Phase 2 khóa media contract. Fixture dự kiến:

- Dùng cặp đôi giả `Minh An` và `Thu Hà`, ngày tương lai `16/01/2027`, timezone `Asia/Ho_Chi_Minh`; không dùng PII thật.
- Tách dữ liệu thành các object theo canonical invitation section key; không tạo schema riêng cho theme.
- Giữ `guestName` ngoài fixture, truyền từ runtime interaction. Mọi chuỗi `{guestName}` có fallback `quý khách`.
- Bao gồm cả ceremony và reception để kiểm tra event/timeline/countdown; countdown tính từ timestamp thật, không hard-code số.
- Có đủ family titles/names/roles/address thành field riêng để kiểm tra hierarchy và Vietnamese diacritics.
- Optional data có sample an toàn để preview ở trạng thái bật, đồng thời test riêng trạng thái tắt/rỗng ở Phase 3–5.
- Media source, crop, alt, loading, QR và external/internal album tuyệt đối chưa được quyết định ở Phase 1; chúng thuộc Phase 2.
- Map/calendar URL dùng placeholder an toàn hoặc fixture URL đã được repo chấp nhận; không nhúng token hay secret.

## Editor field plan — chưa triển khai config

### Editable owner content

- Tên cặp đôi, tên hiển thị, ngày cưới, tagline và lời mở đầu owner-specific.
- Lời báo hỷ, lời kính mời, family labels, từng danh xưng, từng họ tên, vai vế và địa chỉ.
- Ceremony/reception date-time, tên nghi lễ, lunar date, dress code, timeline rows.
- Venue name/address/note và map/calendar URL.
- Nội dung thật sự thuộc owner ở RSVP, guestbook, gift và footer.
- Optional activities/gallery copy; media controls chỉ thêm sau Phase 2.
- Toggle/order/layout chỉ expose khi renderer thực sự hỗ trợ và không phá semantic order.

### Renderer/system-owned, không expose thành content field

- `Mở thiệp`, `Xác nhận tham dự`, `Gửi lời chúc`, `Xem bản đồ`, `Lưu lịch`, gallery controls, loading/success/error, placeholder và validation copy.
- Ribbon, đường may, bóng nắng, linen/paper texture, dấu niêm, divider và mọi renderer-owned decor.
- Motion duration/easing/stagger, scroll trigger, CSS namespace, ARIA labels kỹ thuật và reduced-motion behavior.
- Countdown numbers, current status, RSVP/wish API state và runtime `guestName`.

Mọi editor label/title phải là tiếng Việt đầy đủ. RSVP và guestbook bắt buộc kiểm tra `guestName` trước khi quyết định có render input tên, đồng thời vẫn giữ API flow tương ứng.

## Non-goals

- Không tạo long-form story, navigation chapter hoặc hero desktop như Wedding Website.
- Không dùng ngôn ngữ hậu sự kiện/hoài niệm như Wedding Recap.
- Không lấy ảnh cặp đôi làm nguồn nhận diện duy nhất; thay toàn bộ ảnh vẫn phải nhận ra theme qua ribbon, palette, type và material.
- Không dùng boho beige mặc định: terracotta, pampas, kraft paper, dried-flower arch hoặc script font tràn lan.
- Không hy sinh family roles, ngày giờ, venue, RSVP hoặc keyboard/reduced-motion vì art direction.
- Không đưa API, template config, fixture, media schema hoặc artwork vào Phase 1.

## Anti-patterns cần chặn ở các phase sau

- Mọi section đều là card căn giữa với cùng một fade-up.
- Dải lụa che text/CTA, thoát khỏi stage hoặc tạo horizontal scroll.
- Dùng animation để tính countdown, truyền đạt form success hoặc giữ nội dung hidden khi Motion lỗi.
- Smooth scroll/Lenis trên touch hoặc reduced motion; parallax/pinned sequence làm khách khó scan thông tin.
- Expose decor renderer-owned thành image input hoặc để ảnh user gánh theme identity.
- Gộp danh xưng và họ tên cha mẹ thành một string; làm địa chỉ nổi hơn tên người.
- Hỏi lại tên ở RSVP/guestbook khi runtime đã có `guestName`.
- Cho optional section tắt nhưng vẫn để gap, hoặc cho reorder làm gallery/gift đứng trước lời mời và thông tin cốt lõi.
- Tạo layout option trong config nhưng renderer không có composition khác biệt thật.
- Dùng quá một English tagline hoặc dùng tiếng Anh thay heading/action thiết yếu.

## Phase 1 acceptance checklist

- [x] Xác định đúng product meaning là interactive invitation, không phải Website/Recap.
- [x] Xác định audience, viewer job và journey ưu tiên mobile 375–480px.
- [x] Khóa visual metaphor, emotion, palette 6 màu, material, decor và typography từ font self-host của repo.
- [x] Chọn một signature opening có keyboard path và reduced-motion state rõ ràng.
- [x] Ghi rõ full motion là mặc định; reduced-motion bắt buộc, delay 0 và giữ toàn bộ nội dung/state.
- [x] Phân loại đúng core non-toggle, supported default-on toggleable và default-off optional theo section catalog.
- [x] Couple identity được compose rõ trong `cover` + `families`; visual calendar có capability `calendar` riêng, không thiếu catalog item.
- [x] Venue/map presentation có thể tắt nhưng canonical venue name/address vẫn còn trong core `eventDetails`.
- [x] Add-to-calendar capability được compose cạnh core event/venue actions và không bị nhầm với visual `calendar` section.
- [x] Content matrix ghi đủ key, status, anchor, concrete default data, editor control, empty/fallback, CTA và toggle/reorder/repeat/layout rule.
- [x] Family hierarchy tách danh xưng/họ tên và ưu tiên tên người.
- [x] `guestName` runtime cùng RSVP/guestbook API behavior được khóa trong brief.
- [x] Content fixture plan và editor field boundary đã được lập nhưng chưa code.
- [x] Tiếng Việt là chính; tối đa 1 English tagline, mặc định 0.
- [x] Non-goals và anti-patterns chặn beige/terracotta/boho mặc định và long-form storytelling.
- [x] Không tạo `template-config.ts`, fixture, renderer section, media contract, asset hoặc artwork final.

Phase 1 hoàn tất ở mức artifact. Phase 2 chỉ được bắt đầu sau khi brief này được duyệt; khi đó phải lập media matrix, ownership, crop/focal-point, alt/loading/error/empty behavior và media-independence test trước khi tạo bất kỳ asset nào.

## Phase 2 — Media contract và media independence

### Scope và nguyên tắc ownership

Media do owner cung cấp chỉ truyền tải **nội dung về cặp đôi, hoạt động, album và QR mừng cưới**. Chúng không chịu trách nhiệm tạo ra nhận diện `Nắng Trên Lụa`. Nhận diện phải tồn tại khi mọi ảnh user bị thay hoặc bỏ trống thông qua palette, typography, composition, ribbon, đường may, giấy/linen, bóng nắng và dấu ép chìm renderer-owned.

Phase này chỉ mô tả contract. Chưa có file artwork, asset manifest, prompt, preview sheet, media fixture, schema TypeScript hoặc `template-config.ts` nào được tạo.

### Media matrix theo từng section

| Section | Media role và owner | Required / count | Aspect, crop, focal point, fit | Placement và responsive behavior | Alt strategy | Loading và fallback |
| --- | --- | --- | --- | --- | --- | --- |
| `opening` | Không nhận user media. Ribbon band, paper grain, stitch và clasp tương lai là renderer-owned identity decor | User media: 0; decor count chốt ở Phase 2.5 | Không áp dụng cho user media; renderer decor phải nằm trong stage 480px và có safe zone quanh CTA | Mobile/tablet cùng composition, decor bị clip trong `.ss-stage`; không dùng ảnh background ngoài gutter | Decor thuần túy `aria-hidden="true"`; opening có accessible name từ text | Không chờ ảnh user để mở. Asset renderer lỗi phải rơi về CSS paper/ribbon tĩnh; reduced motion mở tức thời |
| `cover` | `hero` / ảnh cặp đôi user-upload; optional content media. Ribbon/light/frame là renderer-owned | 0–1 | Khuyến nghị 4:5; chấp nhận 3:4–16:9. Frame 4:5; `object-fit: cover`; focal mặc định `50% 35%`, editor dùng focal metadata nếu có; không crop khuôn mặt bằng auto rule | Mobile 375–480: ảnh trong frame tối đa chiều rộng canvas, không full-bleed dưới text. Tablet/desktop vẫn trong stage 480px. Ảnh ngang dùng crop 4:5 có focal; nếu crop xấu chuyển sang inset 3:2, không kéo giãn | Mặc định `Ảnh của Thu Hà và Minh An`; cho phép alt owner chỉnh nếu schema chung hỗ trợ, alt rỗng chỉ khi ảnh thực sự decorative (cover hero không decorative) | `eager`, `fetchpriority="high"`, width/height hoặc aspect-ratio cố định. Missing/broken: typography + monogram/paper frame. Low-quality: render inset nhỏ hơn, không blur/phóng lớn |
| `invitation` | Không user media; paper surface, emboss/ribbon junction renderer-owned | 0 | Không áp dụng | Text tự giãn; decor không được xâm phạm line length hoặc token `{guestName}` | Decor `aria-hidden`; semantic content là text | Không có media dependency; renderer decor lỗi để lại plain paper surface |
| `families` | Không user media trong v1; family seal/divider renderer-owned | 0 | Không áp dụng | Mobile xếp dọc; tablet vẫn trong 480px. Tên dài wrap tự nhiên; không dùng portrait để thay family fields | Decor `aria-hidden` | Không media dependency; missing family field ẩn riêng theo Phase 1 |
| `eventDetails` | Không user image; optional calendar/action icons là code-native hoặc renderer-owned | 0 | Không áp dụng | Event rows tự giãn theo nội dung; venue/address text không nằm trên ảnh | Icons decorative `aria-hidden` hoặc có accessible label ở control | Core ngày/giờ/địa chỉ luôn render bằng text, không phụ thuộc asset |
| `countdown` | Không user media; counters và stitch rail code/CSS renderer-owned | 0 | Không áp dụng | Bốn unit co về grid 2×2 nếu 375px cần; không dùng image digits | Không image alt; timer có semantic labels và `aria-live="off"` | Không media dependency; reduced motion vẫn cập nhật số, bỏ animation |
| `calendar` | Không user media; month grid code-native, selected-date marker renderer-owned | 0 | Không áp dụng | Grid co trong stage; weekday/text không rasterize. Ngày chọn dùng shape + text | Không image alt; calendar có accessible date label | Không media dependency; invalid date thì section rời DOM theo Phase 1 |
| `timeline` | Không user media trong v1; stitch line/dots renderer-owned | 0 | Không áp dụng | Long item copy wrap, không buộc horizontal scroll; mobile dùng vertical list | Decor rail/dots `aria-hidden`; item time/title là text | Không media dependency; empty/toggled section rời DOM |
| `venue` | `map` là external embed/data surface, không phải upload; optional illustrated pin/frame renderer-owned. Không nhận venue photo trong v1 | Upload: 0; map URL: 0–1 | Map viewport 4:3 mobile, 3:2 tablet within stage; không crop raster user media | Mobile map dưới address/action; tablet vẫn một column. Iframe không được mở rộng stage | Iframe title `Bản đồ đến {venueName}`; map link accessible name `Mở chỉ đường đến {venueName}` | Iframe `loading="lazy"`. Missing/invalid/blocked map: giữ canonical name/address + link nếu hợp lệ; tắt venue vẫn giữ address trong `eventDetails` |
| `activities` | `activity` / user-upload content image cho từng activity; renderer-owned stitched frame | Section default-off; 1–6 items; mỗi item 0–1 image, total 0–6 | Khuyến nghị 4:3 hoặc 1:1; card viewport 4:3; `object-fit: cover`; focal default `50% 50%`, editor focal metadata ưu tiên | Portrait ảnh dùng crop 4:3 theo focal; landscape giữ 4:3; nếu crop làm mất chủ thể dùng inset `contain` trên paper matte. Mobile list/controlled snap, tablet không vượt stage | `Ảnh minh họa cho {activity.title}`; alt owner override nếu ảnh cần mô tả cụ thể | First visible image lazy nhưng có width/height; phần còn lại lazy. Missing/broken: text-only stitched ticket. Low-quality: contain/inset, không scale vượt intrinsic target |
| `gallery` | `gallery` / user-upload content images; linen stack/frame renderer-owned | Section default-on toggleable; 3–12 khi bật; 0 ảnh thì section rời DOM | Mixed portrait/landscape accepted. Active frame 4:5; portrait `cover`, focal `50% 35%`; landscape ưu tiên inset 3:2 trên 4:5 matte thay vì crop cực đoan. Không stretch | Mobile dùng manual controlled stack/slider trong stage; tablet/desktop không tăng card vượt 480px. Orientation thay đổi không làm rail rộng hơn viewport | Mặc định `Khoảnh khắc {index} của Thu Hà và Minh An`; alt owner-provided được giữ; ảnh trùng/decorative không dùng để lặp thông tin | Ảnh đầu visible `eager` chỉ nếu xuất hiện sớm, mặc định gallery dưới fold nên tất cả `lazy`; reserve aspect ratio. Broken item bị loại riêng; còn <3 ảnh chuyển stack tĩnh 1–2 ảnh; 0 ảnh rời DOM |
| `rsvp` | Không user media; reply-card frame renderer-owned | 0 | Không áp dụng | Form luôn ưu tiên text/control; không có split photo để tránh ảnh lấn CTA trên 375px | Không image alt; control có accessible labels | Không media dependency; semantic API state không dựa animation/artwork |
| `guestbook` | Không user media/avatar trong v1; note cards và stitch marks renderer-owned | 0 | Không áp dụng | Long approved wish wrap/clamp theo rule Phase 3, có cách xem đầy đủ; không rasterize wish text | Decor `aria-hidden`; tên/wish là text | Không media dependency; empty giữ form nếu section bật; toggle rời DOM |
| `gift` | `gift-qr` / QR user-upload cho tài khoản được owner bật; bank metadata là text, không nằm trong ảnh | Default-off; 0–2 QR, mỗi account tối đa 1. QR optional cho section nhưng required để hiện QR panel của account đó | 1:1; không crop; `object-fit: contain`; focal cố định center; padding/safe quiet zone giữ nguyên | Mobile QR tối đa 192px; tablet không phóng quá intrinsic/256px. Không đặt QR làm background hoặc signature focal | `Mã QR mừng cưới cho {accountLabel}`; không nhúng số tài khoản vào alt nếu không cần | `lazy`; missing/broken QR ẩn riêng QR và giữ lời nhắn/account text được phép; low-quality/không đọc được phải cảnh báo editor và không tự sharpen |
| `music` | `background-audio` / track từ catalog hệ thống, không phải image và không cho user upload URL/file trực tiếp trong template | Default-off; 0–1 catalog track | Audio không crop; cover art catalog không render trong invitation v1 | Player dock nằm trong safe area, không phụ thuộc album art; mobile không autoplay trước gesture | Control có tên track và accessible `Phát/Tạm dừng`; audio không cần image alt | Metadata/audio chỉ tải khi section bật hoặc sau interaction theo player contract; lỗi track ẩn/disable player, không chặn thiệp |
| `footer` | Không user media trong v1; closing knot/ribbon ends renderer-owned identity | User media: 0 | Không áp dụng | Footer text tự giãn; knot nằm sau/ngoài text safe zone nhưng trong stage | Decor `aria-hidden` | CSS/text fallback nếu decor lỗi; reduced motion giữ knot tĩnh |

### Ownership và editability matrix

| Media/visual | Owner | Editor exposure | Theme identity responsibility | Notes |
| --- | --- | --- | --- | --- |
| `cover.heroMedia` | User-upload | Có: chọn/thay/xóa ảnh; focal point nếu media manager hỗ trợ | Không | Ảnh chỉ giúp nhận diện cặp đôi; cover vẫn hoàn chỉnh khi trống |
| `activities.items[].image` | User-upload | Có theo từng item; alt/focal dùng metadata chung | Không | Activity text vẫn phải hiểu được khi thiếu ảnh |
| `gallery.images[]` | User-upload | Có collection 3–12 khi section bật; reorder/remove; alt/focal từ media object | Không | Internal album only |
| `gift.accounts[].qrMedia` | User-upload | Có theo account; không log URL/token nhạy cảm | Không | QR là functional content, không phải decor |
| `music.trackId` | System catalog selection | Có select/toggle theo capability, không upload trực tiếp | Không | Playback logic dùng shared player |
| Map URL/embed | Owner-provided URL → external surface | Có URL field; validation trước render | Không | Address text vẫn canonical trong event data |
| Ribbon, stitch, clasp, paper/linen texture | Renderer-owned | Không expose image input | Có | Phase 2.5 mới quyết định file/CSS form, size và provenance |
| Sunlight/shadow atmosphere | Renderer-owned | Không expose | Có | Gồm dải sáng CSS và lớp hạt bụi “lụa phấn” bounded theo canvas; reduced motion giữ vài hạt tĩnh thưa |
| Emboss/seal/dividers/frames/mattes | Renderer-owned | Không expose | Có | Không được dùng user photo thay thế |
| System icons, calendar grid, countdown numerals | Code-native/system | Không expose như media | Hỗ trợ, không phải nguồn nhận diện duy nhất | Phải usable khi CSS/artwork lỗi |

### Theme identity assets và content media

Identity set dự kiến cho Phase 2.5 gồm ribbon system, stitch line, clasp/seal, paper/linen material, sunlight/shadow layer, emboss/divider và closing knot. Đây mới là **vai trò**, chưa phải asset được duyệt. Phase 2.5 phải quyết định role nào là CSS/code-native, role nào cần generated raster, kích thước, nền trong suốt, provenance và preview sheet.

Content media chỉ gồm cover couple photo, activity images, internal gallery, QR functional image và catalog audio. Không hard-code người mẫu/cặp đôi/sample photo vào renderer-owned background, mask hay opening.

## Responsive, orientation và long-content rules

| Scenario | Contract |
| --- | --- |
| Mobile 375/390px | Media luôn nằm trong `.ss-stage`; frame có `max-width: 100%`, aspect ratio được reserve, controls tối thiểu 44px, không dùng hover-only action hoặc horizontal page scroll. |
| Mobile 480px | Giữ cùng composition; chỉ tăng whitespace/frame có giới hạn, không đổi semantic order. |
| Tablet/desktop | Stage vẫn tối đa 480px. Gutter là atmosphere-only; không đưa ảnh, QR, gallery controls hoặc critical decor ra ngoài stage. |
| Portrait source | Cover/gallery ưu tiên focal `50% 35%`; activity `50% 50%`; crop theo viewport đã định, không tự zoom vượt mức làm mất mặt. |
| Landscape source | Cover chuyển inset 3:2 nếu crop 4:5 không an toàn; gallery dùng matte/inset; activity crop 4:3. Không kéo giãn. |
| Very wide/tall source | Dùng focal point nếu có; nếu safe crop không đạt, `contain` trên renderer-owned matte. Không letterbox bằng màu ngoài palette. |
| Missing media | Core semantics vẫn render. Optional item chuyển text-only; gallery 0 ảnh rời DOM; cover dùng typography/monogram; QR panel ẩn riêng. |
| Broken URL/decode | `onError` loại/hạ cấp đúng item, không lặp retry vô hạn, không hiển thị URL raw hoặc broken-image icon. |
| Low-quality image | Không upscale quá target hợp lý, không blur/stretch giả chất lượng; dùng inset/contain và cảnh báo editor khi validation hỗ trợ. |
| Bright/dark image | Matte/frame và overlay renderer-owned bảo đảm separation; critical text không đặt trực tiếp trên ảnh nên không cần phụ thuộc overlay để đọc. |
| Long names/copy | Media frame không giữ fixed height làm che text; text region tăng chiều cao độc lập. Tên/địa chỉ wrap, controls xuống hàng, media không absolute đè semantic content. |
| Reduced motion | Ảnh hiển thị ngay ở trạng thái cuối; không Ken Burns, parallax, autoplay carousel hoặc spatial crop transition. Gallery vẫn có controls thủ công và active item rõ ràng. |

## Album behavior

### Internal album

- Hỗ trợ album nội bộ qua `gallery.images[]`, 3–12 ảnh khi section bật.
- Reorder trong editor quyết định thứ tự public; không suy luận thứ tự từ filename/upload time.
- Gallery có previous/next, dots hoặc current index, keyboard/focus path và swipe chỉ khi có fallback button.
- Không autoplay dưới reduced motion. Nếu Phase 4 có autoplay ở full-motion, phải pause khi hover, focus, tab hidden và user interaction.
- 1–2 ảnh còn hợp lệ sau lỗi dùng stack tĩnh; 0 ảnh làm section rời DOM và seam tự nối.

### External album

**Not supported** trong `sunlit-silk` v1. Không có `externalAlbumUrl`, CTA redirect, new-tab behavior hoặc URL validation field trong future config. Nếu product quyết định hỗ trợ về sau, phải quay lại Phase 2 để xác định label, allowlist/validation, privacy, same/new-tab behavior và invalid/empty fallback trước khi thêm field.

## Future media field schema và mapping vào `template-config.ts`

Phase 3 phải giữ shape scanner/editor hiện có; không tạo schema riêng. Mapping dự kiến:

| Section | Future field | Shared field contract | `mediaRole` | Value/limits |
| --- | --- | --- | --- | --- |
| `cover` | `heroMedia` | `type: 'image'`, label tiếng Việt `Ảnh cặp đôi ở bìa`, content key theo content type đã duyệt | `hero` | `mediaValue: 'object'`; optional single; object phải giữ URL/src, alt và focal metadata khi platform hỗ trợ |
| `activities` | `items[].image` | Repeatable item child `type: 'image'`, label `Ảnh hoạt động` | `activity` | 0–1 per item; section max 6 items; media object, không URL string mới tùy tiện |
| `gallery` | `images` | `type: 'images'`, label `Ảnh trong album` | `gallery` | `mediaValue: 'object'`; maxItems 12; validation min 3 chỉ khi section bật, với graceful 1–2 fallback cho runtime lỗi |
| `gift` | `accounts[].qrMedia` | Repeatable account child `type: 'image'`, label `Mã QR mừng cưới` | `gift-qr` | 0–1 per account, max 2 accounts; 1:1 contain |
| `music` | `trackId` | Shared music/catalog selector, không khai báo `image`/`images` | `background-audio` capability | 0–1 catalog reference; autoplay default false |

Không tạo image field cho opening ribbon, paper/linen, sunlight, stitch, seal, divider, frame, map screenshot, countdown/calendar, family decor, RSVP, guestbook hoặc footer knot. Map/calendar URLs vẫn là URL/action fields, không phải media upload.

### Alt text strategy

- Content image alt ưu tiên dữ liệu owner cung cấp trong media object; thiếu thì renderer sinh alt tiếng Việt từ semantic context, không từ filename.
- Cover: tên hai người; activity: tên hoạt động; gallery: index + tên cặp đôi; QR: account label.
- Renderer-owned decor luôn `aria-hidden` và không có alt lặp nội dung.
- Không đưa guest PII, token, số tài khoản hoặc URL storage vào alt/log.

### Loading strategy

- Chỉ cover hero có thể `eager/high priority`; mọi ảnh dưới fold `lazy`.
- Luôn reserve width/height hoặc `aspect-ratio` để tránh CLS.
- Không preload toàn album, activity hoặc QR.
- Map iframe lazy; audio catalog lazy/interaction-aware.
- Asset renderer-owned ở Phase 2.5 phải có performance budget riêng; Phase 2 chưa phê duyệt preload nào.

## Fallback, error và empty-state matrix

| Failure/state | Public behavior | Editor/validation expectation |
| --- | --- | --- |
| Cover missing | Typography, date, ribbon/monogram composition đầy đủ | Không block publish nếu cover media optional |
| Cover broken | Thay bằng same-size paper fallback, bỏ broken node | Báo asset không tải được; cho chọn lại |
| Activity image missing/broken | Giữ text-only ticket/card; item không biến mất nếu title hợp lệ | Cảnh báo riêng item; không xóa text |
| Gallery 0 images | Section rời DOM | Khi owner bật, editor nhắc thêm tối thiểu 3; không tạo placeholder người mẫu |
| Gallery 1–2 valid images | Static stack, không render controls vô nghĩa | Cảnh báo chưa đạt recommended count nhưng runtime vẫn an toàn |
| Gallery item broken | Loại item riêng và cập nhật count/index | Hiển thị item lỗi để replace/remove |
| Map blocked/invalid | Giữ venue/address text; hiện link chỉ đường chỉ khi URL hợp lệ | URL validation tiếng Việt; không embed raw error |
| QR missing/broken | Ẩn QR của account, giữ lời nhắn và text owner cho phép | Cảnh báo QR không đọc/tải được; không log dữ liệu nhạy cảm |
| Audio unavailable | Disable/ẩn player với feedback ngắn, thiệp tiếp tục | Cho chọn track khác; không retry loop |
| Renderer asset missing | CSS color/paper/rule fallback; content/CTA không đổi vị trí | Block Phase 5 release nếu identity set thiếu provenance/approved fallback |
| Section toggled off | Xóa cả section khỏi DOM và nối seam | Preview/editor phản ánh đúng toggle |
| Reduced motion | Static final media state; manual controls giữ nguyên | Preview reduced-motion bắt buộc trước release |

## Media-independence test matrix

Các test dưới đây là acceptance bắt buộc ở Phase 3–5; Phase 2 chỉ khóa kịch bản:

| Test set | Replacement | Expected result |
| --- | --- | --- |
| Neutral studio | Thay cover/gallery/activity bằng ảnh studio nền trắng/xám, trang phục hiện đại | Vẫn nhận ra `Nắng Trên Lụa` qua ribbon, linen, palette đồng cũ, typography và stage; không giống catalog ảnh cưới trung tính |
| Alternate art direction | Ảnh cưới áo dài đỏ hoặc lễ truyền thống nhiều màu | Ảnh được matte/frame kiểm soát; theme không chuyển thành đỏ-truyền-thống và không đổi palette theo ảnh |
| Bright beach | Ảnh ngoài trời high-key/cát biển | Text vẫn tách khỏi ảnh; không mất viền/matte vào nền sáng |
| Dark ballroom | Ảnh low-key/ánh đèn tối | Không cần tăng overlay che mặt; frame giữ separation và body text vẫn trên paper |
| Mixed ratios | Trộn portrait 2:3, landscape 16:9, square 1:1 và ảnh rất rộng | Không stretch, không page overflow; focal crop/inset đúng rule; gallery controls ổn định |
| Face near edge | Chủ thể lệch trái/phải hoặc gần mép trên | Focal metadata bảo toàn mặt; nếu không đạt chuyển contain/inset thay vì crop mù |
| All media empty | Xóa cover, activities, gallery, gift QR và music | Core invitation, hierarchy, address/actions và identity vẫn hoàn chỉnh; optional section rời DOM; không có placeholder người mẫu |
| Partial failures | 1 ảnh gallery, 1 activity và map iframe lỗi | Chỉ item/surface lỗi hạ cấp; index/seam/CTA còn lại hoạt động |
| Low resolution | Ảnh nhỏ hơn target và QR khó đọc | Ảnh content không bị upscale/blur; QR bị cảnh báo/ẩn thay vì render giả đọc được |
| Long Vietnamese content | Tên dài, địa chỉ 3 dòng, activity caption dài cùng ảnh ngang | Text tăng chiều cao, media không đè nội dung, stage không horizontal scroll |
| Reduced motion | Chạy mọi test trên với preference reduce | Không parallax/Ken Burns/autoplay/spatial crop; media và controls hiện tức thời, semantics không đổi |

Pass condition: thay toàn bộ user media hoặc bỏ trống media không được làm mất tên cặp đôi, family hierarchy, ngày/giờ, venue/address canonical, CTA còn bật, keyboard/focus path hoặc nhận diện ribbon–lụa–nắng.

## Phase 2 acceptance checklist

- [x] Media matrix bao phủ mọi section Phase 1, kể cả section không nhận media.
- [x] Mỗi user media role có owner, required/optional, min/max, aspect, crop, focal, object-fit, placement, alt, loading và fallback.
- [x] Responsive rule bao phủ 375/390/480px, tablet/desktop, portrait/landscape/extreme ratio, long content và overflow.
- [x] Missing, broken, low-quality, bright/dark media và partial failure có fallback không làm mất core content.
- [x] Ownership/editability tách rõ content media với renderer-owned identity assets.
- [x] Internal album behavior được khóa; external album được ghi rõ **not supported**.
- [x] Future media fields map vào shared `image`/`images`/music selector contract, không tạo schema riêng.
- [x] Không expose ribbon, stitch, paper, sunlight, seal, divider, frame hoặc knot thành image field.
- [x] Alt text không lấy filename, không chứa PII/token/dữ liệu nhạy cảm; decor renderer-owned `aria-hidden`.
- [x] Loading strategy chống CLS và không preload album/map/audio không cần thiết.
- [x] Media-independence matrix kiểm tra neutral/alternate style, sáng/tối, mixed ratio, empty, failure, low quality, long content và reduced motion.
- [x] Full-motion vẫn là mặc định; reduced-motion bắt buộc giữ static media state, manual controls và semantics.
- [x] Chưa tạo `template-config.ts`, fixture, renderer section, asset, final artwork, prompt hoặc preview sheet.

Phase 2 hoàn tất ở mức contract. Phase 2.5 chỉ được bắt đầu sau khi owner duyệt media boundary này; mọi renderer-owned artwork sau đó phải có asset brief, role/section ownership, kích thước, transparent/safe zone, mobile variant, provenance, preview sheet và approval checklist riêng.
