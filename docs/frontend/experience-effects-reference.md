# Thư viện tham khảo hiệu ứng cho trải nghiệm cưới online

Last reviewed: 2026-08-04

## Mục đích

Tài liệu này tổng hợp pattern UI/motion có thể tham khảo khi thiết kế:

- **Thiệp cưới online:** trải nghiệm mở thiệp, thông tin mời, RSVP và chia sẻ nhanh.
- **Website cưới:** câu chuyện dài hơn, hành trình tình yêu, album, lịch trình và thông tin chung.
- **Wedding Recap:** trải nghiệm sau ngày cưới thiên về ảnh/video, ký ức, lời chúc và lời cảm ơn.

Đây là tài liệu tham khảo nguyên lý, không phải thư viện để sao chép website đoạt giải. Khi làm template thiệp mới, vẫn phải bắt đầu từ [catalog section và layout](./online-invitations/section-layout-catalog.md), sau đó dùng tài liệu này để chọn tối đa một signature effect và các lớp hỗ trợ phù hợp.

## Nguyên tắc art direction

Khuyến nghị mặc định cho GMM Wedding là:

> Ảnh editorial + typography tiết chế + một signature moment + micro-motion hỗ trợ.

- Một trang chỉ có **một signature effect**; không biến mọi section thành một demo animation khác nhau.
- Motion phải dẫn thứ tự đọc, giải thích thay đổi trạng thái, tạo cảm xúc hoặc hỗ trợ storytelling.
- Ngày giờ, địa điểm, RSVP, lời mời và CTA luôn là HTML thật, đọc được khi JavaScript/canvas/video lỗi.
- Mobile-first không có nghĩa là thu nhỏ desktop effect. Hover, cursor và horizontal narrative phải có interaction khác phù hợp touch.
- Award score hoặc độ lạ không chứng minh accessibility, performance hay conversion.

## Ma trận cường độ theo sản phẩm

| Nhóm hiệu ứng | Thiệp online | Website cưới | Wedding Recap |
|---|---:|---:|---:|
| Texture, grain, light atmosphere | Cao | Cao | Cao |
| Opening/reveal mang tính nghi lễ | Signature | Trung bình | Nhẹ |
| Scroll storytelling dài | Thấp | Cao | Cao |
| Editorial photo layout | Trung bình | Cao | Signature |
| Cursor/hover interaction | Desktop-only | Desktop-only | Desktop-only |
| 3D/WebGL | Một scene tùy chọn | Một scene tùy chọn | Một finale tùy chọn |
| Particle | Thưa, theo concept | Thưa | Finale ngắn |
| Kinetic typography | Tên/ngày ngắn | Chapter title | Quote/credit ngắn |
| Form microinteraction | RSVP/lời chúc | RSVP/lời chúc | Lời chúc/chia sẻ |

`Signature` là điểm nhận diện chính của trải nghiệm, không đồng nghĩa phải dùng công nghệ nặng.

## Catalog pattern

Mỗi pattern bên dưới là **design inference của GMM** rút ra từ các nguồn showcase ở cuối tài liệu.

### 1. Nền cảm xúc

#### Living paper grain

- **Hình thức:** paper texture, film grain hoặc noise rất nhẹ trên nền tĩnh.
- **UX purpose:** tạo chất liệu thủ công/cinematic, nối các section khác nền màu.
- **Phù hợp:** cả ba sản phẩm; đặc biệt thiệp editorial, vintage và luxury.
- **Tránh:** noise dày trên body text, canvas noise chạy liên tục chỉ để trang trí.
- **Mobile/reduced motion:** texture tĩnh đã bake hoặc pseudo-element không chuyển động.

#### Aurora veil

- **Hình thức:** mesh gradient/aurora chuyển chậm phía sau key visual.
- **UX purpose:** tạo chiều sâu hiện đại cho theme tối, celestial hoặc futuristic romance.
- **Phù hợp:** website cưới và recap; dùng tiết chế ở opening thiệp.
- **Tránh:** blur lớn liên tục, gradient làm giảm tương phản hoặc gợi cảm giác SaaS landing page.
- **Fallback:** radial gradient tĩnh cùng palette.

#### Light leak and vignette

- **Hình thức:** light leak, dappled sunlight, vignette hoặc reflection pass một lần.
- **UX purpose:** dẫn mắt vào ảnh/chữ và tạo cảm giác máy phim.
- **Phù hợp:** hero, quote divider, album, recap.
- **Fallback:** baked overlay; không sweep vô hạn.

### 2. Scroll storytelling

#### Multi-plane memory parallax

- **Hình thức:** background, ảnh, khung giấy và foreground đi với biên độ khác nhau.
- **UX purpose:** tạo depth và nhấn chuyển chapter.
- **Phù hợp:** hero website cưới, một chapter hành trình, recap opening.
- **Ngân sách:** tối đa 3–4 layer; text chính đứng yên; desktop travel nhỏ.
- **Mobile:** 0–8px hoặc composition tĩnh. **Reduced motion:** tắt hoàn toàn parallax.

#### Sticky chapter crossfade

- **Hình thức:** ảnh/khung được pin ngắn, copy hoặc mốc thời gian thay đổi khi scroll.
- **UX purpose:** kể chuyện tuần tự mà vẫn giữ một visual anchor.
- **Phù hợp:** hành trình tình yêu và recap theo chapter.
- **Tránh:** pin toàn màn hình quá lâu, chặn native scroll hoặc giấu nội dung khi JS lỗi.
- **Mobile:** vertical cards hoặc ảnh xen kẽ; reduced motion render toàn bộ chapter theo document flow.

#### Cinematic mask reveal

- **Hình thức:** ảnh lộ qua oval, rèm, cánh hoa, khung phim hoặc typography mask.
- **UX purpose:** chuyển cảnh nghi lễ và giới thiệu ảnh chủ đạo.
- **Phù hợp:** opening thiệp, hero, chapter divider.
- **Mobile:** một mask đơn giản. **Fallback:** crossfade/cut tĩnh.

#### Scroll-scrub film strip

- **Hình thức:** contact sheet hoặc dải phim tiến theo scroll.
- **UX purpose:** nén chuỗi ký ức thành một dòng thời gian trực quan.
- **Phù hợp:** recap và album dài; không ưu tiên cho thiệp ngắn.
- **Mobile/reduced motion:** horizontal scroll-snap thủ công hoặc vertical contact sheet, không scrub.

#### Constellation of memories

- **Hình thức:** các mốc/ảnh trở thành điểm sáng và nối thành constellation ở finale.
- **UX purpose:** gom nhiều ký ức thành một closure giàu cảm xúc.
- **Phù hợp:** recap finale hoặc theme celestial.
- **Ngân sách:** một canvas duy nhất, lazy-load, dừng ngoài viewport; poster tĩnh khi fallback.

### 3. Photo-led editorial

#### Editorial asymmetry

- **Hình thức:** ảnh full-bleed xen ảnh nhỏ, caption lệch trục, khoảng trắng lớn và typography serif.
- **UX purpose:** làm ảnh cưới trở thành nội dung chính thay vì decoration.
- **Phù hợp:** website cưới, album và recap.
- **Mobile:** chuyển thành alternating vertical spreads, giữ thứ tự đọc DOM hợp lý.

#### Floating contact sheet

- **Hình thức:** lưới ảnh với một vài frame lệch nhẹ hoặc overlap có kiểm soát.
- **UX purpose:** tạo cảm giác bàn ảnh/ký ức nhưng vẫn quét nhanh.
- **Phù hợp:** album và recap.
- **Tránh:** overlap che mặt, caption hoặc control; không random vị trí mỗi render.
- **Mobile:** grid 2 cột hoặc stacked cards.

#### Horizontal editorial rail

- **Hình thức:** gallery/chapter chạy ngang có progress rõ ràng.
- **UX purpose:** tạo nhịp xem ảnh giống spread tạp chí.
- **Phù hợp:** desktop website/recap.
- **Mobile:** native horizontal snap cho gallery ngắn; nội dung dài chuyển vertical.

#### Then-and-now reveal

- **Hình thức:** hai ảnh “ngày ấy/bây giờ” qua slider hoặc tap toggle.
- **UX purpose:** so sánh một ký ức cụ thể, phù hợp storytelling.
- **Phù hợp:** website cưới và recap.
- **Accessibility:** có hai nhãn rõ ràng và nút toggle; không phụ thuộc kéo chính xác.

### 4. Interaction có chủ đích

#### RSVP magnetic halo

- **Hình thức:** CTA phản hồi rất nhẹ theo pointer kèm halo/focus state.
- **UX purpose:** tăng affordance cho hành động quan trọng.
- **Phù hợp:** desktop fine-pointer; magnetic travel tối đa vài pixel.
- **Mobile/reduced motion:** press state tiêu chuẩn; CTA không được di chuyển khỏi ngón tay/con trỏ.

#### Contextual cursor spotlight

- **Hình thức:** cursor halo chỉ xuất hiện trong gallery/hero tương tác và đổi nhãn `Xem`, `Kéo` hoặc `Mở`.
- **UX purpose:** giải thích interaction phi chuẩn.
- **Phù hợp:** desktop website/recap.
- **Tránh:** thay con trỏ hệ thống trên toàn trang, chạy trên form hoặc che focus ring.
- **Mobile/reduced motion:** bỏ hoàn toàn và dùng control hiển thị rõ.

#### Timeline hover preview

- **Hình thức:** hover/focus một mốc sẽ hiện thumbnail tương ứng gần vùng trống an toàn.
- **UX purpose:** preview ký ức mà chưa rời timeline.
- **Phù hợp:** hành trình tình yêu trên desktop.
- **Mobile:** thumbnail nằm trong card; keyboard focus có cùng nội dung như hover.

#### Tactile polaroid tilt

- **Hình thức:** tilt 2–4deg hoặc depth nhỏ khi hover/focus.
- **UX purpose:** tạo cảm giác vật thể cho ảnh kỷ niệm.
- **Phù hợp:** album/recap có art direction analog.
- **Mobile/reduced motion:** ảnh tĩnh; không dùng gyroscope mặc định.

### 5. Signature moment

#### Material invitation opening

- **Hình thức:** phong bì, gate-fold, book cover hoặc layered card mở 2.5D/3D.
- **UX purpose:** mô phỏng nghi thức nhận và mở thiệp thật.
- **Phù hợp:** thiệp online.
- **Ngân sách:** hoàn tất trong khoảng 600–1200ms; click/Enter/Space; khóa double activation.
- **Fallback:** dissolve trực tiếp vào banner, không chặn nội dung.

#### Memory portal

- **Hình thức:** một ảnh/video mở rộng thành chapter hoặc gallery thông qua shared-element transition.
- **UX purpose:** tạo bước chuyển rõ từ overview sang ký ức chi tiết.
- **Phù hợp:** website cưới và recap.
- **Fallback:** accessible dialog/page transition tức thì, focus được quản lý đúng.

#### Petal/confetti finale

- **Hình thức:** burst ngắn sau lời cảm ơn, RSVP thành công hoặc recap credit.
- **UX purpose:** feedback/closure mang tính kỷ niệm.
- **Tránh:** particle loop toàn trang hoặc particle trên form.
- **Mobile:** 4–8 sprite; reduced motion dùng icon/message tĩnh.

### 6. Typography và transition

#### Kinetic names

- **Hình thức:** tên cặp đôi reveal theo dòng/mask, ampersand flourish hoặc tracking settle.
- **UX purpose:** xây hierarchy mở đầu.
- **Phù hợp:** hero/opening; tối đa hai dòng ngắn.
- **Tránh:** split từng ký tự trong đoạn tiếng Việt dài.

#### Handwritten vow stroke

- **Hình thức:** SVG stroke draw nguyên bản cho một chữ ký hoặc câu cực ngắn.
- **UX purpose:** tạo điểm nhấn riêng tư.
- **Phù hợp:** lời thề, closing signature.
- **Fallback:** SVG hoàn chỉnh; asset phải do GMM tạo hoặc có license.

#### Soft page dissolve

- **Hình thức:** crossfade kết hợp grain/light continuity giữa các chapter/route.
- **UX purpose:** tránh chuyển trang cứng mà không tạo cảm giác app-like quá mức.
- **Phù hợp:** website và recap nhiều chapter.
- **Reduced motion:** cut hoặc opacity tối đa 150ms.

## Công thức phối gợi ý

### Thiệp online — “Ceremonial editorial”

- Signature: material invitation opening.
- Support: living paper grain + kinetic names + một gallery cross-dissolve.
- Interaction: RSVP confirmation ngắn.
- Không dùng: sticky scroll dài, custom cursor toàn trang, nhiều canvas.

### Website cưới — “Love story chapters”

- Signature: sticky chapter crossfade hoặc multi-plane memory parallax.
- Support: editorial asymmetry + timeline hover preview desktop.
- Interaction: memory portal cho album.
- Mobile: vertical chapter cards và native scroll.

### Wedding Recap — “Cinematic contact sheet”

- Signature: scroll-scrub film strip hoặc constellation finale, chỉ chọn một.
- Support: light leak + floating contact sheet + quote dissolve.
- Interaction: then-and-now reveal hoặc draggable filmstrip.
- Mobile: contact sheet/scroll-snap, poster tĩnh cho finale.

## Performance và accessibility guardrails

- Ưu tiên `transform` và `opacity`; tránh animate width/height/top/left, blur lớn và box-shadow liên tục.
- Tối đa một canvas/WebGL scene trên một page; lazy-load, giảm DPR/particle count và dừng RAF khi ngoài viewport hoặc tab ẩn.
- Video có poster, lazy-load source, `muted` và `playsinline`; âm thanh chỉ bật sau thao tác rõ ràng.
- Motion tự chạy quá 5 giây bên cạnh nội dung phải có pause/stop/hide.
- `prefers-reduced-motion: reduce` phải bỏ scroll scrub, parallax, auto-pan, cursor trail và particle; thay bằng bố cục tĩnh hoặc opacity ngắn.
- Horizontal scroll không được hijack thao tác dọc trên touch; luôn có progress/control và keyboard path khi dùng desktop.
- Test ít nhất ở 375px, 768px, desktop, thiết bị tiết kiệm dữ liệu và chế độ reduced motion.

## Quy tắc bản quyền và tham khảo

- Chỉ học nguyên lý composition, hierarchy, interaction và pacing.
- Không sao chép ảnh, video, shader, source code, layout nguyên khối, font, nhạc hoặc visual identity của website tham khảo.
- Không hotlink asset. Mọi asset/font/audio phải có nguồn và license được ghi tại `assets/ASSET_SOURCES.md` hoặc catalog tương ứng.
- Trang showcase có thể chỉ lưu screenshot/tag, không bảo đảm live interaction còn giống mô tả.
- Khi một pattern mới được dùng lặp lại, chuẩn hóa nó vào motion/visual catalog nội bộ thay vì tiếp tục liên kết trực tiếp tới website mẫu.

## Nguồn tham khảo

Truy cập ngày 2026-08-04. Các mô tả tag/capability dưới đây là thông tin từ trang showcase; cách áp dụng cho sản phẩm GMM là design inference nội bộ.

### Showcase và case study

- [Awwwards — Storytelling Websites](https://www.awwwards.com/websites/storytelling/): catalog các website storytelling; Awwwards cũng phân loại parallax, horizontal layout, microinteraction, 3D và WebGL.
- [Awwwards Inspiration — Priestess Storytelling Website](https://www.awwwards.com/inspiration/priestess-storytelling-website): scrolling, typography, gallery, storytelling, interaction design và hover image animation.
- [Awwwards — Live Presentation case-study PDF](https://assets.awwwards.com/assets/files/live-presentation.pdf): ví dụ scroll reveal, horizontal/vertical scroll, reactive cursor, microinteraction, scroll-trigger và WebGL.
- [Godly — Exo Ape](https://godly.website/website/exo-ape-726): big background image, scrolling animation, parallax, custom cursor và transitions.
- [Godly — Lusion](https://godly.website/website/lusion-realise-your-creative-ideas-989): long scrolling, transitions, 3D, WebGL và scrolling animation.
- [Godly — Datalands](https://godly.website/website/seed-333): gradient, long scrolling, scrolling animation và WebGL.
- [Godly — Matthew Fisher](https://godly.website/website/760-matthew-fisher): horizontal layout, WebGL, custom cursor và transitions.
- [CSS Design Awards — Willardson Wedding](https://www.cssdesignawards.com/sites/willardson-wedding/45858/): wedding one-page tối giản, thanh lịch và parallax; Special Kudos ngày 2024-07-04.
- [CSS Design Awards — Michelle & Tonye Wedding Day](https://www.cssdesignawards.com/sites/michelle-tonye-wedding-day/38727/): wedding site dùng photographic, parallax và scroll; Special Kudos ngày 2021-06-03.
- [CSS Design Awards — Calicanto Luxury Bags](https://www.cssdesignawards.com/sites/calicanto-luxury-bags/33107/): storytelling giàu ảnh/video theo art direction luxury-fashion.
- [CSS Design Awards — The Fabulous World of Dior](https://www.cssdesignawards.com/sites/the-fabulous-world-of-dior/42686/): animated scroll và WebGL cho hành trình khám phá di sản thương hiệu.
- [Land-book — Sarah Haywood: Luxury Wedding Planners](https://land-book.com/23d500ce73c8): tham khảo layout/visual cho dịch vụ wedding luxury.

### Accessibility và trình duyệt

- [W3C — Animation caused by user interaction](https://www.w3.org/WAI/GL/wiki/Animation_caused_by_user_interaction): parallax và chuyển động do interaction có thể gây khó chịu tiền đình.
- [WCAG 2.2 — Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html): yêu cầu kiểm soát nội dung tự chuyển động trong các điều kiện áp dụng.
- [MDN — prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion): cơ chế nhận biết lựa chọn giảm chuyển động của người dùng.
- [MDN — Autoplay guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay): giới hạn autoplay và yêu cầu interaction đối với media có âm thanh.
