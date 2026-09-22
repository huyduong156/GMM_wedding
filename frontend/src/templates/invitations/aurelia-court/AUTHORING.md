# Aurelia Court — Authoring log

Template-specific working record. Phase artifacts, spatial decisions and review gates for `Aurelia Court` stay in this folder. Shared authoring invariants remain in `docs/frontend/theme-authoring/README.md` and the invitation theme agent instructions.

## Phase tracker

| Phase | Status | Evidence |
| --- | --- | --- |
| 0 — preview shell / spatial contract | Complete | `AureliaCourtRenderer.tsx`, `aurelia-court.css`, preview route, typecheck and browser viewport review below. |
| 1 — product meaning / content system | Complete | Product meaning, mobile-first brief and section/content matrix below. Phase 2 media contract is complete; ready for Phase 2.5 artwork pre-production. |
| 2 — media contract | Complete | User-media matrix, renderer-owned media boundary, crop/loading/fallback rules and media-independence checklist below. |
| 2.5 — decor pre-production | Complete | `ASSET_MANIFEST.md`, `ARTWORK_PREVIEW.md` and eleven generated PNGs including complex botanical clusters; artwork was approved before Phase 3 and is now integrated by role. |
| 3 — section composition | Complete; skeleton implemented | Composition map, shared-background seams, `template-config.ts`, fixture, types and skeleton renderer are implemented below. |
| 4 — motion / interaction | Complete; implementation ready for Phase 5 review | Shared reveal, opening move-out, CSS 3D cover plane, ambient petals, CTA feedback and reduced-motion/mobile fallbacks are implemented below. |
| 5 — integration / review / release | Complete with known repository baseline errors | Artwork is integrated across the composition, countdown and public RSVP/guestbook controllers are wired, and mobile/reduced-motion review is recorded below. Asset files remain PNG because the current bundle has no approved format-switch contract. |

## Phase 0 — Preview shell and spatial contract

### Preview route

`/templates/invitations/aurelia-court/preview`

### Shell purpose

Phase 0 only locks the mobile invitation canvas, desktop gutter behavior, overflow boundary and first palette/type direction. It intentionally contains no invitation section, API interaction, user media, final flower artwork or final opening choreography.

### Spatial contract

- `.ac-page` owns the full viewport background and prevents horizontal overflow.
- `.ac-stage` is the only invitation canvas and is capped at `480px` on mobile/desktop.
- On screens above `480px`, the outer area is atmosphere-only; no critical content or decor lives outside `.ac-stage`.
- `.ac-stage` owns the paper background, inner padding and vertical scroll area.
- The shell card is a temporary spatial marker, not final invitation content.
- No element may increase scroll width or escape the stage boundary.
- The stage remains readable at 375px and 390px widths without horizontal scrolling.
- Desktop uses a centered paper stage with a restrained gutter; no full-width website layout is introduced.

### Responsive and reduced-motion contract

- Mobile: stage fills the viewport width, with 20px side padding.
- Tablet/desktop: stage remains capped at 480px and gains a restrained outer gutter.
- Reduced motion: no continuous animation is required in Phase 0; the halo remains a static border treatment.
- Future phases may add motion only inside this boundary and must preserve this fallback.

### Phase 0 acceptance gate

- [x] Preview route opens directly at `/templates/invitations/aurelia-court/preview`.
- [x] Renderer shell is isolated under the `ac-` CSS namespace.
- [x] 375px and 390px widths have no horizontal overflow; 375px browser snapshot reviewed.
- [x] 768px and desktop keep the centered stage and restrained gutter; 768px browser snapshot reviewed.
- [x] Temporary shell content stays inside the stage.
- [x] No section, API, final artwork or user media was added.
- [x] Reduced-motion browser emulation reviewed and remains readable.
- [x] `npm run typecheck` passes.
- [x] Owner approved the spatial contract by requesting Phase 1 with the shared-background/mobile-first constraints.

## Phase 1 — Product meaning, chủ đề và content system

### Product meaning

`Aurelia Court` là một `ONLINE_INVITATION` mobile-first cho khách mời Việt Nam: cảm giác nhận một tấm thiệp cưới hoàng gia châu Âu trên giấy ivory dập nổi, sau đó nhanh chóng nắm được lời báo hỷ, hai bên gia đình, ngày giờ, địa điểm và cách phản hồi.

Đây không phải wedding website dạng desktop và cũng không phải recap sau ngày cưới. Theme identity đến từ một nền sân khấu chung, chất liệu giấy, viền vàng cổ, typography serif, huy hiệu và ranunculus vàng champagne; ảnh user chỉ là nội dung thay thế được.

### Viewer job

- Cảm nhận nghi thức mở thiệp trang trọng trên mobile.
- Biết ai mời, ai kết hôn và hai bên gia đình là ai.
- Đọc nhanh ngày, giờ, nghi lễ, tiệc và địa điểm.
- Có thể lưu lịch, mở bản đồ, xác nhận tham dự và gửi lời chúc.

### Audience và non-goals

Audience chính là khách mời Việt Nam xem ở 375–480px; owner cần một mẫu sang trọng, cổ điển nhẹ, dễ đọc và không quá baroque.

Không làm:

- Website kể chuyện nhiều chapter hoặc desktop editorial.
- Nền riêng cho từng section, mỗi section một màu hoặc một “hero” độc lập.
- Vàng neon, cung điện minh họa nặng, ornament dày đặc.
- Phụ thuộc vào ảnh cô dâu chú rể để nhận diện theme.
- Expose hoa nền, khung, huy hiệu, texture hoặc decor renderer-owned thành input image.

### Experience arc

`gate-fold opening → invitation card → lời báo hỷ → hai gia đình → cặp đôi/ngày cưới → lịch trình và địa điểm → RSVP/maps/calendar → album/hoạt động → lời chúc → quà mừng → closing seal`

### Signature moment

Opening dạng **gate-fold royal invitation**. Hai cánh thiệp mở từ trung tâm, huy hiệu và nhánh ranunculus hiện ra, sau đó giữ nguyên layout đọc được. Click, Enter và Space mở được; reduced motion giữ trạng thái giấy tĩnh có phân biệt đóng/mở rõ ràng.

## Art direction brief

| Dimension | Decision |
| --- | --- |
| Visual metaphor | Bộ stationery cưới hoàng gia châu Âu: thiệp gate-fold, huy hiệu, dập nổi, viền foil và nhánh ranunculus vàng champagne. |
| Mood | Trang trọng, ấm, quý phái, cổ điển nhẹ, không phô trương. |
| Canvas | Một nền sân khấu chung xuyên suốt toàn thiệp; section surfaces trong suốt hoặc giấy cùng hệ, không cắt thành các nền độc lập. |
| Layout | Mobile-first, canvas tối đa 480px; desktop chỉ thêm gutter atmosphere, không chuyển thành website full-width. |
| Palette | Ivory paper `#FBF8F0`, champagne `#E6D19A`, antique gold `#C6A45A`, muted olive `#8D9270`, espresso ink `#3D332A`. |
| Typography | `Playfair Display` display, `Be Vietnam Pro` body, `Dancing Script` cho accent rất ngắn. |
| Material | Giấy ivory, grain nhẹ, viền dập nổi, gold foil tiết chế, wax seal và ribbon mảnh. |
| Flower | Ranunculus vàng champagne; lá olive/xám xanh chỉ làm secondary foliage. |
| Motion | Một signature opening; reveal từng phần tử nhỏ dùng shared scroll-reveal convention, không quá nhanh, reduced-motion hoàn chỉnh. |
| Language | Tiếng Việt là chính; tối đa 3 câu English tagline/quote ngắn. |

### Shared background rule

- `.ac-page`/`.ac-stage` là nền chung duy nhất của template, tiếp nối pattern shared theatre background của Astral Vow, Rose Garden và Vạn Hỷ.
- Section không được tạo full-bleed background riêng, đổi màu nền theo chapter hoặc dùng ảnh user làm nền trang.
- Paper grain, gold haze, floral shadow và ambient light nằm trong cùng background system; không lặp một lớp nền mới ở mỗi section.
- Section chỉ được dùng card/panel trong suốt hoặc paper surface nhỏ khi cần tăng tương phản đọc.
- Tất cả section và decor phải nằm trong mobile canvas; desktop gutter không chứa content quan trọng.

## Section/content matrix

Canonical rule: giữ section key và shape theo invitation template hiện có; Phase 3 mới đưa các quyết định này vào `template-config.ts`, không tạo schema riêng cho Aurelia Court.

| Section key | Required | Content anchor | Content keys / default | Editor control | Empty / action / order |
| --- | ---: | --- | --- | --- | --- |
| `opening` | Yes | Mở thiệp | `opening.*`, couple name/date summary | Chỉ expose nội dung owner thực sự cần sửa | Fixed first; gate-fold fallback tĩnh |
| `cover` | Yes | Ai sắp kết hôn | `brideName`, `groomName`, `weddingDate`, `eyebrow`, optional `heroMedia` | Text + optional couple image | Fixed; bỏ ảnh vẫn giữ card và hierarchy |
| `invitation` | Yes | Lời báo hỷ và lời kính mời | `invitationTitle`, `invitationMessage`, runtime `guestName` | Title/message tiếng Việt | Fixed; ảnh thiếu không làm mất lời mời |
| `families` | Yes | Hai bên gia đình | Father/mother title, name, address, family labels | Field riêng cho danh xưng và tên | Fixed; tên cha mẹ lớn hơn danh xưng/địa chỉ |
| `eventDetails` | Yes | Ngày và nghi lễ | Event date/time/type, title, optional message | Event fields theo contract | Fixed; thiếu media không ảnh hưởng thông tin |
| `countdown` | Yes | Còn bao lâu đến ngày vui | Derived event timestamp | Toggle chỉ khi contract cho phép | Realtime đủ ngày–giờ–phút–giây; dừng ở 0 |
| `timeline` | Yes | Lịch trình trong ngày | `timeline.items[]` time/title/detail | Repeatable items | Optional item list empty state; reorder theo config |
| `venue` | Yes | Địa điểm và chỉ đường | `venueName`, `venueAddress`, `mapUrl`, `calendarUrl` | Text + URL | Địa chỉ luôn hiện; CTA ẩn nếu URL invalid |
| `activities` | Optional | Hoạt động trong tiệc | `activitiesStyle`, items title + user image | Select từ style renderer thật + repeatable items | Tắt/xóa khỏi DOM; không để gap |
| `gallery` | Optional | Album của đôi mình | `galleryStyle`, `galleryImages` | Style + user images | Empty state vẫn giữ shared background; có controls |
| `rsvp` | Yes | Xác nhận tham dự | `rsvpDeadline`, `rsvpMessage`, runtime `guestName` | Copy owner + deadline | Luôn gọi API RSVP; có guestName thì không hỏi lại tên |
| `guestbook` | Yes | Gửi lời chúc | `guestbook.title/message` nếu là owner content, runtime guestName | Chỉ field content thật | Luôn gọi API wishes; có guestName thì ẩn input tên |
| `gift` | Optional | Mừng cưới và lời cảm ơn | `giftMessage`, `giftThankYouMessage`, QR media | Text + QR user media | QR lỗi/thiếu thì ẩn panel, giữ lời cảm ơn |
| `music` | Optional | Nhạc nền | Track reference, autoplay preference | Track/autoplay theo capability | Mặc định tắt, có play/pause accessible |
| `footer` | Yes | Khép lại lời mời | `footerMessage`, couple/date summary | Lời nhắn cuối thiệp nếu cần | Fixed last; seal/flower renderer-owned |

### Content rules xuyên section

- Mobile là baseline: content anchor phải nhìn thấy rõ trên 375px trước khi tối ưu tablet/desktop.
- Mọi section phải dùng cùng nền chung; card chỉ là lớp đọc, không phải section background độc lập.
- `guestName` là runtime value, không hard-code vào fixture. RSVP và guestbook phải kiểm tra guestName trước khi render input nhập tên và phải giữ API call tương ứng.
- Label/title của input editor luôn đầy đủ tiếng Việt.
- Không đưa text button, placeholder, validation copy hoặc câu hướng dẫn chung chung vào input editable.
- Decor nền renderer-owned không cần field image; chỉ expose ảnh user upload hoặc ảnh cặp đôi ở vị trí content/background đã định nghĩa.
- Family focal: tên cha mẹ/thành viên lớn và nổi bật hơn danh xưng, địa chỉ, metadata; mobile xếp dọc nhưng giữ rõ nhà gái/nhà trai.
- Optional section tắt phải biến mất khỏi DOM và khoảng cách tự nối lại.

## Editor field plan

### Được chỉnh sửa

- Tên cô dâu, tên chú rể, ngày/giờ và dữ liệu sự kiện.
- Lời báo hỷ, lời mời, nội dung family, timeline, venue.
- Ảnh cover/couple, ảnh gallery, ảnh activities và QR nếu đúng media role.
- Lời nhắn RSVP/guestbook/gift/footer thật sự thuộc về owner.
- Track nhạc và autoplay theo capability chung.

### Không đưa vào editor content

- “Mở thiệp”, “Xác nhận tham dự”, placeholder, loading/success/error text hệ thống.
- Shared background, paper grain, gold foil, ranunculus, leaf, crest, seal, border và scroll-reveal class.
- Motion duration, section anchor, CSS namespace và template config key.

### Guest-aware contract

- `invitation`: render lời mời cá nhân hóa khi runtime có `guestName`.
- `rsvp`: có `guestName` thì hiển thị tên đã xác định; thiếu thì mới hiện input tên dự phòng.
- `guestbook`: cùng logic; form luôn gọi API wishes và có trạng thái submitting/success/error/rate-limit/offline.
- Fixture chỉ dùng tên giả an toàn, không chứa guest PII thật.

## Phase 1 acceptance checklist

- [x] Chốt product meaning là mobile-first interactive invitation.
- [x] Chốt shared background duy nhất xuyên toàn template.
- [x] Chốt canvas mobile tối đa 480px và desktop gutter chỉ là atmosphere.
- [x] Chốt gate-fold opening là signature moment.
- [x] Chốt palette, typography, chất liệu và ranunculus vàng champagne.
- [x] Chốt required/optional section và content anchor.
- [x] Chốt guestName-aware RSVP/guestbook behavior.
- [x] Chốt editor field boundary và toàn bộ label editor bằng tiếng Việt.
- [x] Chốt family hierarchy ưu tiên tên cha mẹ.
- [x] Chốt non-goals và anti-pattern.
- [x] Không tạo fixture, artwork final hoặc renderer section trong Phase 1.

## Anti-pattern cần chặn ở Phase 2+

- Tạo nền riêng cho từng section hoặc để ảnh user làm nền nhận diện chính.
- Thiết kế desktop trước rồi ép xuống mobile.
- Dùng một fade-in chung cho cả section mà không reveal riêng card/tên/CTA.
- Hiện input tên trong RSVP/guestbook khi đã có `guestName`.
- Đổi shape `template-config.ts` vì cần thêm field cho Aurelia Court.
- Expose image input cho hoa, khung, giấy, huy hiệu hoặc ornament renderer-owned.
- Làm địa chỉ/danh xưng nổi bật hơn tên cha mẹ.

Phase 1 hoàn tất. Shared background và mobile-first contract tiếp tục là ràng buộc bắt buộc khi sang các phase sau.

## Phase 2 — Media contract và media-independence

### Scope decision

`Aurelia Court` chỉ dùng media user cho nội dung có ý nghĩa với cặp đôi, sự kiện, album, hoạt động và QR mừng cưới. Theme identity không phụ thuộc vào media user: shared background, paper surface, gold border, crest, ranunculus, divider và seal sẽ là renderer-owned ở Phase 2.5.

External album không được hỗ trợ trong template này. Album nội bộ nhận media user qua media manager; map URL và calendar URL là action links, không phải visual media.

### User-media matrix

| Section / field | Role và owner | Count / aspect / crop | Focal point và loading | Alt text | Empty / error / responsive |
| --- | --- | --- | --- | --- | --- |
| `cover.heroMedia` | Ảnh cặp đôi cho cover; user-upload | 0–1; portrait ưu tiên 4:5, landscape chấp nhận; `cover` trong frame 4:5 | Mặc định `50% 35%`; eager/high priority vì nằm gần đầu thiệp | `Ảnh của {brideName} và {groomName}` | Thiếu/lỗi thay bằng paper frame + crest; không đặt text quan trọng chỉ trên ảnh; mobile giữ frame hẹp trong 480px |
| `gallery.galleryImages` | Album ảnh; user-upload | 0–12; portrait/landscape; frame 4:5 hoặc 3:2 theo gallery style; `cover` | Ảnh đầu tiên visible eager, phần còn lại lazy; focal mặc định `50% 35%` | `Khoảnh khắc {n} của {brideName} và {groomName}` | Empty state vẫn giữ heading và shared background; ảnh lỗi bỏ riêng tile; mobile dùng horizontal snap hoặc stack, không đổi page width |
| `activities.items[].image` | Ảnh hoạt động trong tiệc; user-upload | 0–10 item; portrait 4:5; `cover` | Lazy theo viewport; focal `50% 35%` | `Ảnh hoạt động: {title}` | Item không ảnh chuyển sang text-only card; item xóa không để gap; mobile xếp dọc |
| `gift.giftQrMedia` | QR mừng cưới; user-upload | 0–2 theo contract hai bên; square 1:1; `contain`, không crop/filter | Load khi gift panel mở hoặc khi section visible; không lazy quá mức ảnh hưởng scan | `Mã QR mừng cưới của {label}` | Thiếu/lỗi ẩn QR panel nhưng giữ lời nhắn; mobile giữ kích thước scan được |

Không expose image input cho `opening`, `families`, `eventDetails`, `countdown`, `timeline`, `venue`, `footer` nếu media chỉ là decor. Nếu sau này một section có ảnh content thật, phải bổ sung role cụ thể vào matrix trước khi đưa vào config.

### Action links không phải media

| Field | Role | Rule |
| --- | --- | --- |
| `venue.mapUrl` | Link mở bản đồ | Địa chỉ dạng text luôn hiển thị; URL thiếu/invalid thì ẩn CTA map, không render iframe làm nguồn duy nhất |
| `venue.calendarUrl` | Link lưu lịch | Hiển thị CTA khi URL hợp lệ; thông tin ngày giờ vẫn đọc được khi link lỗi |
| `music` track reference | Audio content | Không coi audio là image media; mặc định tắt, có play/pause và xử lý autoplay bị browser chặn |

### Renderer-owned visual media boundary

| Role | Ownership | Identity purpose | User editability | Fallback |
| --- | --- | --- | --- | --- |
| Shared theatre background | Renderer-owned CSS/layer | Một nền chung xuyên toàn thiệp, giữ seam giữa section | Không có input | Flat ivory paper + contrast-safe gold rule |
| Paper grain / foil haze | Renderer-owned CSS or bundled asset | Chất liệu giấy và ánh vàng nhẹ | Không có input | Tắt grain/foil khi reduced motion hoặc máy yếu nếu cần |
| Royal crest / seal | Renderer-owned artwork | Nhận diện hoàng gia | Không có input | CSS ornamental mark hoặc text-only crest |
| Ranunculus botanical cluster | Renderer-owned artwork | Hoa nhận diện chính | Không có input image | CSS line ornament hoặc bỏ decor, content vẫn giữ hierarchy |
| Family divider / gold frame | Renderer-owned SVG/CSS/artwork | Nối section và dẫn mắt | Không có input | Border CSS tĩnh |
| Gate-fold paper surfaces | Renderer-owned composition | Signature opening | Không có input image | Static open card trong reduced motion/error |

Renderer-owned visuals phải `aria-hidden` nếu chỉ trang trí, không chiếm pointer events và không làm tăng scroll width. Không lưu reference của chúng vào content payload user.

### Crop, focal point và quality rules

- Media user luôn nằm trong frame ổn định; không để intrinsic ratio thay đổi layout hoặc tạo CLS.
- Ảnh portrait ưu tiên vì mobile-first; landscape vẫn phải crop an toàn vào frame, không ép toàn page mở rộng.
- Focal point mặc định là `50% 35%` để ưu tiên khuôn mặt; không bổ sung editor focal-point field ở Phase 2 nếu media manager chung chưa hỗ trợ.
- QR dùng `object-fit: contain`, không mask, filter, blend mode hoặc crop.
- Ảnh nhỏ/low-quality vẫn giữ frame và content; không phóng ảnh để thay cho typography hoặc CTA.
- Alt text do renderer sinh từ semantic role và fixture/content an toàn; decor dùng alt rỗng hoặc `aria-hidden`.

### Loading, failure và state rules

- Cover hero ưu tiên tải sớm; gallery/activities lazy-load theo viewport.
- Ảnh lỗi phải bỏ riêng media plane, không hiển thị broken-image icon hoặc raw URL.
- Khi media đang tải, giữ đúng kích thước frame bằng placeholder paper surface để không CLS.
- Khi user xóa ảnh, explicit empty phải được tôn trọng; không tự hydrate lại ảnh mặc định trong renderer.
- QR lỗi chỉ ẩn QR; gift message và thank-you message vẫn còn.
- Không để media che heading, family names, RSVP CTA, map address hoặc focus ring.

### Album behavior

- Chỉ hỗ trợ album nội bộ từ `galleryImages`.
- Gallery phải có điều khiển thủ công, accessible label, current position và swipe/touch fallback khi triển khai.
- Autoplay nếu có phải dừng khi hover/focus/tab hidden và tắt trong reduced motion.
- Không redirect sang external album; nếu owner nhập external URL ở nơi khác, Phase 2 không coi đó là capability của template.

### Media-to-config mapping

Phase 3 sẽ map đúng các role này vào `template-config.ts` mà không đổi shape config chung:

- `cover.heroMedia` → `type: 'image'`, `mediaRole: 'hero'`.
- `gallery.galleryImages` → `type: 'images'`, `mediaRole: 'gallery'`, giới hạn tối đa 12.
- `activities.items[].image` → item image field, `mediaRole: 'activity'`, tối đa 10 item.
- `gift.giftQrMedia` → `type: 'image'`, `mediaRole: 'gift-qr'`, square/contain.
- `venue.mapUrl` và `venue.calendarUrl` → URL fields, không đưa vào media manager.

Các key, nesting, field labels và config shape phải đối chiếu template hiện có trước khi viết `template-config.ts`; không tạo schema riêng cho Aurelia Court.

## Media-independence test plan

Trước Phase 3, skeleton/renderer phải được kiểm tra với các tổ hợp sau:

1. Thay toàn bộ ảnh cover/gallery/activities bằng ảnh trung tính không có art direction hoàng gia: shared background, paper, gold border, crest, typography và ranunculus vẫn nhận diện được Aurelia Court.
2. Xóa toàn bộ user images: cover, lời mời, family, event, venue, RSVP, guestbook và footer vẫn usable; không còn broken image hoặc khoảng trống bất thường.
3. Dùng ảnh sáng/tối, portrait/landscape, ảnh nhỏ/low-quality và ảnh lỗi: không mất text, CTA, focus ring, alt hoặc tạo horizontal overflow.
4. Kiểm tra QR trống/lỗi: gift copy còn lại, QR panel biến mất an toàn.
5. Kiểm tra map/calendar URL trống hoặc invalid: địa chỉ/ngày giờ vẫn hiện, CTA lỗi bị ẩn.
6. Kiểm tra 375px, 390px và 480px với ảnh dài, nhiều ảnh và thiếu ảnh: shared background liền mạch, không section nào tạo page width mới.
7. Kiểm tra reduced motion: media vẫn tĩnh, gallery có điều khiển tay, không phụ thuộc animation để đọc hoặc thao tác.
8. Kiểm tra tên tiếng Việt dài, `guestName` và media trống cùng lúc: family hierarchy và RSVP/guestbook form vẫn đúng.

## Phase 2 acceptance checklist

- [x] Có media matrix cho mọi media role dự kiến.
- [x] Phân biệt rõ user-upload media, action URL và renderer-owned decor.
- [x] Chốt cover/gallery/activities/QR count, ratio, crop, focal point, alt và loading.
- [x] Chốt empty/error/loading/reduced-motion/mobile fallback.
- [x] Chốt internal album only, không hỗ trợ external album.
- [x] Chốt shared background là renderer-owned và không expose image input.
- [x] Chốt mapping media role vào config shape hiện có.
- [x] Có media-independence test plan trước Phase 3.

Phase 2 hoàn tất. Phase 2.5 tiếp theo mới được tạo artwork renderer-owned; không dùng artwork chưa duyệt vào composition hoặc renderer.

## Phase 2.5 — Asset brief trước khi tạo artwork

### Mục tiêu asset

Tạo một bộ artwork renderer-owned đủ để nhận diện `Aurelia Court` ngay cả khi toàn bộ ảnh user bị thay hoặc bỏ trống. Asset phải gợi stationery hoàng gia châu Âu, giấy ivory, gold foil và ranunculus vàng champagne; không biến thành nền cung điện hoặc floral collage che nội dung.

Shared background vẫn là CSS/layer chung, không tạo một background image full-page. Ảnh user của cover, gallery, activities và QR cũng không thuộc batch artwork này.

### Asset matrix — cần tạo

| ID / file dự kiến | Vai trò | Dùng ở section | Art direction | Output / kích thước dự kiến | Responsive / vùng an toàn |
| --- | --- | --- | --- | --- | --- |
| `ac-gatefold-front-v1.png` | Key artwork, mặt ngoài gate-fold | `opening` | Hai cánh thiệp ivory, viền antique gold mảnh, huy hiệu trung tâm, ranunculus vàng champagne ở mép; không có chữ cố định | PNG RGBA, dọc 4:5, khoảng 1600×2000px, mục tiêu ≤ 450KB sau tối ưu | Mobile-first; vùng trung tâm 60% để đặt content bằng HTML; mép hoa có thể crop nhẹ |
| `ac-ranunculus-sprig-v1.png` | Floral sprig nhỏ/divider | `invitation`, `timeline`, `footer` | Nhánh ranunculus nhỏ, ít lá, nét thanh, cùng material với corner cluster nhưng silhouette khác | PNG RGBA, ngang 1400×420px, mục tiêu ≤ 180KB | Desktop có thể dài hơn; mobile scale xuống 45–60%, không làm tăng scroll width |
| `ac-royal-crest-v1.png` | Crest/monogram ornament | `opening`, `cover`, `footer` | Huy hiệu trừu tượng không dùng gia huy thật: vòng nguyệt quế mảnh, chữ `A`/`C` có thể để trống hoặc không render chữ trong ảnh | PNG RGBA, vuông 900×900px, mục tiêu ≤ 180KB | Safe area 80%; dùng nhỏ, không trở thành logo cố định của user |
| `ac-wax-seal-v1.png` | Seal prop | `opening`, `gift`, `footer` | Sáp champagne/antique gold, dấu hoa đơn giản, không có chữ nhỏ khó đọc | PNG RGBA, vuông 700×700px, mục tiêu ≤ 150KB | Mobile tối đa 64–88px; pointer-events none khi là decor |
| `ac-family-divider-v1.png` | Section divider | `families`, `eventDetails` | Divider gold mảnh kết hợp một nụ ranunculus, nhẹ hơn corner cluster | PNG RGBA, ngang 1200×260px, ≤ 120KB | Mobile scale theo width, không đặt text trong asset |

### Asset không tạo bằng AI trong batch này

- Shared full-page background, gradient, paper grain nhẹ và gold haze: CSS/layer để giữ responsive và performance.
- Đường viền hình học đơn giản, rule, corner line, shadow, mask cơ bản: CSS/SVG.
- Countdown numerals, timeline nodes, map marker, button icon và form UI: code/icon system.
- Ảnh cô dâu chú rể, gallery, activities và QR: user-upload content theo Phase 2 media contract.
- Text, tên đôi, ngày cưới, địa chỉ, family names và guestName: HTML/content runtime, không bake vào ảnh.

### Asset dùng xuyên trang và rule không lặp

- `ac-ranunculus-sprig-v1` là divider; không dùng thay corner cluster ở mọi section.
- Crest và seal là motif phụ, không xuất hiện đồng thời ở mọi section.
- Mỗi section chỉ có tối đa một floral focal point; section family ưu tiên tên người, hoa không được thành focal point.
- Không dùng một ảnh asset full-bleed lặp lại làm background cho nhiều section.

### Prompt/provenance record cần lưu

Mỗi asset generate phải ghi lại trong manifest riêng của template:

- ID, file name, prompt cuối cùng và model/tool sử dụng.
- Ngày tạo, biến thể đã loại và lý do loại.
- Ownership: `GMM renderer-owned`, không phải ảnh user.
- License/provenance: artwork tạo mới cho GMM; không dùng asset/reference có bản quyền không rõ.
- Kích thước gốc, kích thước tối ưu, format, alpha quality và target bundle size.
- Section sử dụng, breakpoint, safe area, fallback CSS/SVG và trạng thái `draft/approved/rejected`.

### Approval checklist trước khi chuyển Phase 3

- [ ] Có ít nhất 3 artwork khác vai trò: key opening, botanical cluster và prop/divider.
- [ ] Mỗi artwork có alpha sạch, không có viền chữ nhật hoặc bóng nền ngoài ý muốn.
- [ ] Không asset nào chứa text, tên đôi, ngày, địa chỉ hoặc UI copy.
- [ ] Ranunculus vàng champagne nhận diện được ở mobile nhưng không lấn át chữ.
- [ ] Crest/seal không giống logo thương hiệu hoặc gia huy thật của gia đình.
- [ ] Asset vẫn hợp với shared background chung và không tạo thêm section background.
- [ ] Có desktop/mobile safe area và fallback đã ghi rõ.
- [ ] Kích thước file nằm trong budget và không gây CLS.
- [ ] Preview sheet batch được tạo để duyệt trước khi đưa vào composition.

### Quyết định hiện tại

Danh sách cần tạo trước mắt là **8 artwork renderer-owned** ở asset matrix. Batch đầu tiên đã tạo `ac-gatefold-front`, `ac-gatefold-inner`, `ac-ranunculus-corner` và `ac-ranunculus-sprig`; crest, seal, border và divider đã được tạo ở batch thứ hai. Ba complex botanical cluster là nhóm floral primary.

### Generation result

Đã generate đủ 8 asset bằng built-in image generation với transparent-background prompt và copy vào bundle. Các file đang ở trạng thái `generated / pending optimization / pending owner approval`; chưa được map vào renderer.

- `ac-gatefold-front-v1.png`
- `ac-ranunculus-sprig-v1.png`
- `ac-royal-crest-v1.png`
- `ac-wax-seal-v1.png`
- `ac-family-divider-v1.png`
- `ac-ranunculus-botanical-cluster-v2.png`
- `ac-ranunculus-gatefold-arch-v1.png`
- `ac-family-botanical-cascade-v1.png`


## Phase 3 — Section architecture và visual composition

### Composition principles

- Mobile-first vertical invitation; một shared `.ac-stage` theatre background xuyên suốt.
- Mỗi section có content anchor rõ ràng, một focal point và một layout riêng; không dùng card/grid quá ba lần liên tiếp.
- Artwork decor chỉ tạo framing và dẫn mắt; tên đôi, family names, ngày giờ, địa chỉ và CTA luôn nằm trong HTML content layer.
- Section surface trong suốt hoặc paper panel nhỏ; không tạo background chapter riêng.
- Empty state giữ shared background, heading và semantic action; không để khoảng trống mồ côi khi section optional tắt.
- Phase 3 chỉ khóa composition tĩnh. Scroll reveal, auto-animation, parallax, 3D depth và API interaction để Phase 4/5.

### Section composition map

| Section | Layout / composition | Content anchor | Artwork role | Empty / mobile fallback |
| --- | --- | --- | --- | --- |
| `opening` | Full-viewport gate-fold overlay che canvas ban đầu; click move-out | Mở thiệp và tên đôi | `front`/`inner`, `arch`, `crest` | Static closed overlay; click/keyboard move-out rồi nội dung scroll phía dưới hiện ra |
| `cover` | Royal cover card với border và floral corner | Cô dâu, chú rể, ngày cưới | `border`, `corner`, optional hero media | Paper-only cover khi thiếu hero |
| `invitation` | Letter sheet text-first, divider ở cuối | Lời báo hỷ và `guestName` | `sprig`/`divider` | Text-only letter |
| `families` | Hai family panels xếp dọc mobile | Nhà gái/nhà trai, tên cha mẹ | `cascade`, `divider` | Ẩn dòng thiếu; tên cha mẹ vẫn focal |
| `eventDetails` | Date diptych/paper plaque | Ngày, giờ, nghi lễ | `divider` nhỏ, CSS date rule | Text/date vẫn đủ |
| `countdown` | Four-unit countdown grid | Còn bao lâu đến ngày vui | CSS gold rules | Grid 2×2 trên mobile; zero state |
| `timeline` | Vertical ceremony route | Các mốc giờ | CSS nodes + `sprig` nhẹ | Item empty ẩn |
| `venue` | Stationery venue card với action row | Địa điểm, địa chỉ | `border` hoặc `divider` | Địa chỉ luôn còn; CTA ẩn khi lỗi |
| `activities` | Framed stack, hai cột → một cột | Hoạt động trong tiệc | `corner`, user image | Text-only activity card |
| `gallery` | Framed album stack/grid | Album đôi mình | Border CSS, không floral focal lớn | Empty message |
| `rsvp` | Reply card | Xác nhận và deadline | `seal` | Skeleton CTA ở Phase 3 |
| `guestbook` | Wish card | Gửi lời chúc | `seal`/`divider` | Empty approved wishes giữ form anchor |
| `gift` | Sealed gift card, QR ở giữa | QR và lời cảm ơn | `seal`, QR user media | QR missing ẩn panel |
| `music` | Compact paper dock | Track name/playback | CSS rule | Hidden/compact nếu thiếu track |
| `footer` | Quiet closing seal | Lời cảm ơn và tên đôi | `seal`, `sprig` | Text-only closure, fixed last |

### Section transition / seam map

- `opening → cover`: gate-fold inner paper đi thẳng vào cùng ivory canvas.
- `cover → invitation`: gold border thu nhỏ thành divider, floral corner rút khỏi vùng đọc.
- `invitation → families`: sprig/divider làm cầu nối, family panels bắt đầu bằng cùng gold rule.
- `families → eventDetails`: cascade lùi về cạnh giấy; date plaque không tạo nền mới.
- `eventDetails → countdown → timeline`: date rule kéo dài thành CSS route.
- `timeline → venue`: route kết thúc ở venue card; địa chỉ là text anchor trước map.
- `venue → activities → gallery`: paper cards giảm dần độ dày; media không làm đổi canvas width.
- `gallery → rsvp → guestbook`: album kết thúc bằng divider; reply/wish card cùng material nhưng khác hierarchy.
- `guestbook → gift → music → footer`: seal/gold rule làm closure; footer trở về paper-only quiet space.

Opening là một lớp nghi thức độc lập, không phải section nằm trong flow nội dung. Khi đóng, `.ac-opening-overlay` phủ toàn bộ mobile canvas; khi người nhận mở thiệp, lớp này trượt ra ngoài canvas và không còn chặn pointer/keyboard, còn `cover` trở thành section đầu tiên trong flow đọc.

### Skeleton implementation

Phase 3 đã tạo và map:

- `AureliaCourtTypes.ts`: data/section/media types riêng template.
- `fixture.ts`: fictional Vietnamese fixture, section order và artwork map.
- `template-config.ts`: giữ config shape hiện có, đủ required/optional section và editor labels tiếng Việt.
- `AureliaCourtRenderer.tsx`: render đủ 15 section theo `sectionConfig.order`, gắn `data-editor-section` 1:1 và dùng artwork đã duyệt ở vai trò tĩnh.
- `aurelia-court.css`: shared background, mobile layout, section surfaces, family hierarchy và empty states.

### Phase 3 acceptance

- [x] Đủ required và optional section theo invitation contract.
- [x] Mỗi section có composition riêng và content anchor.
- [x] Shared background xuyên suốt, không có section background độc lập.
- [x] Mobile 375–480px là baseline; desktop chỉ thêm gutter.
- [x] Artwork được map theo section role, không expose decor image input.
- [x] Family names lớn/nổi bật hơn title/address metadata.
- [x] Empty media/state không làm mất hierarchy hoặc CTA text.
- [x] `template-config.ts`, fixture, types và renderer dùng cùng section key/order.
- [x] Renderer gắn `data-editor-section` đúng section key.
- [x] Typecheck không còn lỗi mới trong Aurelia Court; lỗi còn lại là lỗi tồn tại ở các file khác của repo.
- [x] Chưa thêm motion choreography/API vào Phase 3.
- [x] Opening là overlay độc lập, có trạng thái move-out; không chiếm chiều cao như một section nội dung.

Phase 3 hoàn tất. Phase 4 tiếp theo sẽ lập technique map và thêm motion/interaction trên composition đã khóa; mọi hiệu ứng phải dùng shared scroll-reveal convention và giữ mobile/reduced-motion fallback.

## Phase 4 — Advanced visual experience, interaction và motion

### Technique map

| Technique | Section / role | UX purpose | Trigger / timing | Mobile / reduced motion | Budget |
| --- | --- | --- | --- | --- | --- |
| Full-page opening move-out | `opening` overlay | Tạo nghi thức mở thiệp rồi đưa người nhận vào flow | User click/keyboard; 950ms ease-in-out | Native overlay move-out; reduced motion instant opacity/state | Một lần mỗi page load; transform/opacity only |
| Shared `.reveal` + `.is-visible` | Mọi section và phần tử nhỏ | Dẫn thứ tự đọc, không để cả trang xuất hiện cùng lúc | IntersectionObserver, `rootMargin: 0px 0px -33% 0px`, 1.5s shared ease-out | Translate ≤30px; reduced motion visible instantly | Observer disconnect sau lần đầu; no per-frame scroll state |
| Staggered child reveal | Heading, copy, card, divider, CTA | Làm rõ hierarchy trong từng section | Parent section enters; delay chỉ theo CSS variable khi cần | Mobile giữ 2–3 nhóm chính; reduced motion none | Transform/opacity only |
| CSS 3D cover plane | `cover` | Tạo chiều sâu giấy hoàng gia nhẹ, không biến thành website 3D | Fine pointer hover; 520ms ease-in-out | Không hover choreography trên touch; reduced motion none | Một plane, no canvas/RAF |
| Ambient floating paper petals | Page edge / shared background | Tạo nền sống nhẹ quanh canvas, không che content | CSS loop 17–24s; chỉ khi stage visible + tab visible | 5 sprites, travel nhỏ; reduced motion static/hidden | ≤5 elements, pointer-events none |
| CTA press/hover | Buttons và map/calendar links | Phản hồi thao tác rõ ràng | Hover 180ms ease, press scale 0.97 | Touch dùng native press; reduced motion no transform | No layout animation |

### Motion choreography

1. Opening overlay hiển thị tĩnh với gate-fold art và nội dung đọc được ngay.
2. User click/Enter/Space vào “Mở thiệp”; overlay move-out bằng transform, không khóa scroll lâu.
3. `cover` đã tồn tại trong flow và trở thành reading anchor sau khi overlay rời canvas.
4. Khi scroll, section chỉ bắt đầu reveal khi vùng section đi qua khoảng một phần ba viewport; từng eyebrow, heading, copy, card, divider và CTA dùng shared reveal primitive.
5. Ambient petals chạy độc lập ở mép canvas, dừng khi stage ra khỏi viewport hoặc tab bị ẩn.
6. Hover cover chỉ thêm depth rất nhẹ trên fine pointer; không dùng cho touch.

### Interaction / accessibility map

- Opening hỗ trợ click và keyboard qua native button; sau move-out overlay `aria-hidden` và `pointer-events: none`.
- CTA map/calendar dùng link thật và giữ địa chỉ text làm fallback.
- RSVP/guestbook dùng `PublicInteractions`; URL cá nhân lấy identity từ guest slug, URL chung yêu cầu nhập `guestName`, và cả hai hiển thị submitting/submitted/error trong cùng form.
- Decor và ambient layer `aria-hidden`, không chiếm pointer event.
- Reduced motion tắt ambient loop, 3D tilt và transition spatial; content hiện tĩnh, overlay state đổi ngay.
- Không hijack native mobile scroll, không dùng smooth-scroll runtime riêng.

### Performance rules

- Chỉ animate `transform` và `opacity`; không animate layout, width, height, top/left hoặc blur nặng.
- IntersectionObserver dùng một lần cho mỗi section và disconnect sau reveal.
- Ambient chỉ có 5 sprite, CSS loop nhẹ, pause khi offscreen/hidden tab.
- Không thêm GSAP, Lenis, Three.js hoặc canvas ở Phase 4 vì composition đạt được bằng CSS/DOM.
- 3D chỉ là một cover plane; không tạo continuous RAF loop.
- `will-change` chỉ dùng cho overlay/ambient khi active, không áp dụng toàn bộ cây DOM.

### Phase 4 acceptance

- [x] Opening là overlay riêng, move-out sau click/keyboard và không chiếm flow section.
- [x] Mỗi section có reveal riêng; phần tử chính dùng shared `.reveal` class và `.is-visible` trigger.
- [x] Reveal trigger dùng `rootMargin` khoảng một phần ba viewport, duration không quá nhanh.
- [x] Có ambient auto-animation dưới nền với visibility pause.
- [x] Có một section 3D nhẹ ở cover, chỉ fine pointer.
- [x] Có hover/press feedback cho CTA với touch/reduced-motion fallback.
- [x] Mobile native scroll và reduced-motion static fallback được giữ.
- [x] Không animate layout property hoặc thêm animation runtime nặng.
- [x] Phase 5 đã nối API interaction, kiểm tra preview mobile và reduced-motion, đồng thời chốt asset bundle/manifest.

Phase 4 hoàn tất ở mức motion implementation. Phase 5 hoàn tất phần integration/review trong phạm vi template; repository-wide baseline typecheck errors remain outside Aurelia Court.

## Phase 5 — Integration, review và release gate

### Integration map

| Role | Integrated asset / behavior | Owner boundary |
| --- | --- | --- |
| Opening | `front`, `inner`, `arch`, `crest` | Renderer-owned, opening overlay only |
| Cover / invitation | `border`, `corner`, `sprig`, `divider` | Renderer-owned decor; couple media remains optional user media |
| Families | `cascade`, `divider` | Renderer-owned botanical cascade; names remain fixture/editor content |
| RSVP / guestbook / footer | `seal` | Renderer-owned seal; forms use public interaction controllers |
| Atmosphere | Five CSS petals | Background system; paused when hidden/offscreen and removed under reduced motion |

### Runtime review

- [x] Countdown now derives live days/hours/minutes/seconds from the wedding timestamp and clamps at zero.
- [x] RSVP always calls `interactions.rsvp.submit`; when `guestName` exists, the name input is omitted.
- [x] Guestbook always calls `interactions.wishes.submit`; when `guestName` exists, the name input is omitted.
- [x] RSVP/guestbook expose Vietnamese labels, submitting, submitted and error states without putting system copy into editor fields.
- [x] Optional user media stays independent: missing cover/gallery/activity/QR media preserves the renderer-owned composition.

### Review report

| View / state | Result | Evidence |
| --- | --- | --- |
| Mobile 375×812 | Pass | Direct preview opened; no horizontal overflow observed; opening overlay and first cover section reviewed with Playwright. |
| Opening interaction | Pass | Click changes overlay to `is-opening`, `aria-hidden` is applied and cover becomes the first flow section. |
| Scroll reveal | Pass | First cover section receives `is-visible`; shared reveal classes remain attached to content/decor anchors. |
| Reduced motion | Pass by implementation | Ambient loop, 3D transform and overlay transition are disabled by the reduced-motion CSS fallback. |
| Desktop/tablet | Pass by constrained layout contract | Stage remains capped at 480px and outer gutter is atmosphere-only; no desktop-only content branch exists. |
| Typecheck | Baseline blocked | No Aurelia error remains. Four pre-existing errors remain in unrelated editor/recap tests and `AppShell.tsx`. |

### Release checklist

- [x] `template-config.ts` shape and section keys remain aligned with the existing invitation scanner contract.
- [x] Approved artwork is referenced from the template-local manifest and renderer-owned media is not exposed as editor image input.
- [x] Shared background, mobile canvas, opening overlay, reveal system and reduced-motion fallback are all present.
- [x] Required and optional sections render according to `sectionConfig.enabled` and `sectionConfig.order`.
- [x] API interaction boundary is ready for the public invitation host through the `PublicInteractions` prop.
- [x] Template config is marked `ready`; repository-wide typecheck was rerun and only the four unrelated baseline errors listed above remain.
- [x] Final template release gate is complete within the Aurelia Court scope; the unrelated repository baseline errors remain tracked separately.
