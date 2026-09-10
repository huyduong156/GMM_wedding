# Common Theme Authoring Contract

Tài liệu này là contract dùng chung cho mọi theme public của GMM Wedding: Invitation, Wedding Website và Wedding Recap. Domain agent phải đọc tài liệu này trước khi đọc section rules riêng và trước khi tạo hoặc sửa bất kỳ theme nào.

## 1. Quy trình bắt buộc

Mọi theme task phải đi theo thứ tự:

1. Đọc `AGENTS.md`, `.agents/PROJECT_CONTEXT.md`, `docs/frontend/README.md` và tài liệu này.
2. Gọi đúng domain agent theo `productType`.
3. Tạo Phase 0 preview shell để khóa route preview, spatial contract, viewport behavior và overflow trước khi thiết kế section.
4. Domain agent đọc section/content contract riêng của product, xác định product meaning, viewer job, experience arc, non-goals và viết brief/acceptance map trước khi code section.
5. Chọn art direction, layout, asset plan, motion plan và responsive fallback. Không bắt đầu từ fixture ảnh.
6. Tạo `template-config.ts`, content types/fixture, renderer, style và asset manifest theo contract.
7. Render toàn bộ theme và gọi design/review skill phù hợp để kiểm tra screen thực tế ở desktop, tablet, mobile và reduced-motion.
8. Kiểm tra đủ required và optional sections theo product contract, sau đó kiểm tra lại `template-config.ts` ở bước cuối trước khi bàn giao cho admin/catalog/publish.

Không được bỏ qua domain agent vì task “chỉ làm một theme”, “chỉ dựng preview” hoặc “chỉ thay giao diện”.

Theme không được dừng ở mức layout cơ bản như hero ảnh + text, grid card, static section và fade-in đơn giản. Agent phải tăng độ phức tạp theo hướng có chủ đích bằng các kỹ thuật trong approved catalog: depth/3D, scroll storytelling, image transition, kinetic typography, interactive gallery, shared element, scroll-driven animation, motion choreography hoặc visual effect phù hợp. Độ phức tạp phải làm trải nghiệm đáng nhớ hơn, không được trở thành hiệu ứng chồng chéo thiếu hierarchy.

## 1.1. Phased authoring flow bắt buộc cho mọi template

Mọi domain agent khi tạo hoặc sửa một template phải đi tuần tự qua bảy phase dưới đây. Agent phải đọc lại common contract và tài liệu domain liên quan ở mỗi phase, đối chiếu checklist trước khi chuyển phase tiếp theo. Không được gộp toàn bộ phase vào một lượt code, không được bắt đầu từ fixture hoặc asset, và không được đánh dấu hoàn tất nếu thiếu artifact của bất kỳ phase nào.

### Phase 0 — Preview shell và spatial contract

Trước khi tạo section hoặc artwork, theme phải có một preview route mở được và một renderer shell tối giản. Phase này không nhằm hoàn thiện giao diện; nó chỉ khóa các ràng buộc không gian để những phase sau không phải sửa lại toàn bộ layout.

Artifact bắt buộc:

- preview route trong `shared/config/routes.ts` và route dispatch trong `app/App.tsx`;
- renderer shell riêng của template và stylesheet namespace riêng;
- `max-width`, min-height, overflow, desktop gutter và mobile behavior;
- reduced-motion fallback cho atmosphere nếu shell đã có animation;
- preview link được ghi trong brief/template README để review thủ công.

Acceptance gate:

- route preview mở được bằng URL trực tiếp;
- nội dung không tạo horizontal scroll ở mobile hoặc desktop;
- decor không vượt khỏi vùng content đã chốt;
- desktop/tablet/mobile behavior được kiểm tra trước khi bắt đầu Phase 1.

Không thêm section nghiệp vụ, API hoặc artwork final vào Phase 0 nếu spatial contract chưa được duyệt.

### Phase 1 — Product meaning, chủ đề và content system

Đọc lại common contract, `docs/frontend/README.md`, tài liệu section/content của đúng product và domain agent instructions. Agent phải chốt:

- product type, product meaning, viewer job, audience, non-goals và experience arc;
- chủ đề, visual metaphor, cảm xúc, palette, typography, chất liệu, decor direction, motion direction và signature moment;
- điểm khác biệt với hai product type còn lại để tránh theme Invitation, Wedding Website và Wedding Recap bị giống nhau;
- required sections, optional sections và vai trò của từng section trong câu chuyện;
- content anchor, heading, mô tả, quote, CTA, metadata, empty state và fallback content của từng section;
- nội dung nào user được sửa, section nào được bật/tắt, thêm/xóa, reorder, repeatable hoặc chọn layout;
- ngôn ngữ chính và giới hạn English quote/tagline theo common contract.

Đầu ra bắt buộc: `theme brief`, product meaning statement, viewer journey, section/content matrix, required/optional section list, content fixture plan, editor field plan, acceptance checklist, non-goals và anti-pattern. Chưa được generate image, decor hoặc viết renderer trước khi phase này đạt checklist.

Phase 1 phải có content matrix cụ thể theo từng section. Mỗi dòng tối thiểu ghi: section key, required/optional, content anchor, content keys, default data, editor control, empty behavior, CTA/action và section toggle/reorder rule.

### Phase 2 — Media contract và bảo vệ main content

Đọc lại phần media-independence, asset generation, responsive và `template-config` trong common contract cùng section rules của domain. Agent phải lập media matrix cho từng section, ghi rõ:

- media role: hero, story, chapter, moment, gallery, background, video;
- user-upload hay renderer-owned; bắt buộc hay tùy chọn; số lượng min/max;
- tỉ lệ, crop, focal point, object-fit, vị trí, alt text, loading và fallback;
- mobile/tablet behavior, ảnh dọc/ngang, ảnh thiếu, ảnh lỗi, ảnh chất lượng thấp và nội dung dài;
- media nào chỉ là content và asset nào chịu trách nhiệm giữ theme identity;
- album nội bộ hoặc external album: URL field, CTA, redirect behavior, tab behavior, invalid/empty state.

Phải kiểm tra bằng ảnh neutral hoặc khác art direction: thay toàn bộ ảnh mẫu, thay ảnh sáng/tối, thay tỉ lệ ảnh và bỏ trống media mà theme vẫn giữ hierarchy, semantic content, CTA và nhận diện. Không được hard-code couple/model/sample photo làm nền tảng cho theme.

Đầu ra bắt buộc: media matrix, upload/editability matrix, crop/focal-point rules, fallback/error/empty states, external album behavior, media field schema, media-independence checklist và mapping media vào `template-config.ts`.

Nếu theme không dùng external album, artifact phải ghi rõ `not supported` thay vì để behavior không xác định. Media matrix cũng phải ghi alt text strategy, loading strategy và behavior với ảnh lỗi/chất lượng thấp.

### Quy tắc rút ra từ các template đã author

Modern Luxe và Verdant Promise có chất lượng thị giác tốt hơn vì art direction, section composition, renderer và decor được phát triển như một hệ thống thống nhất. Các template về sau phát sinh lỗi khi quy trình bị rút ngắn thành renderer trước, config/editor sau hoặc copy fixture/layout từ template khác.

Các quality gate sau là bắt buộc để tránh lặp lại:

- Mỗi template phải có fixture và content type riêng; không dùng fixture của Modern Luxe làm mặc định cho template khác.
- Không đăng ký template `review` như một template đã sẵn sàng publish nếu chưa vượt screenshot/review gate.
- Không coi test mount hoặc test click là visual approval. Phải có review ở 375px, 390px, 480px, tablet, desktop và reduced motion.
- Không để renderer hardcode text/media mà `template-config.ts` lại expose field tương ứng.
- Không tạo decor trước khi chốt media role, owner, crop, section ownership và overflow boundary.
- Không dùng số lượng dòng code, animation hoặc asset count làm thước đo chất lượng; mọi complexity phải có UX purpose và fallback.
- Mỗi template phải có ít nhất một signature interaction, một hệ thống artwork nhận diện và section layouts đa dạng nhưng vẫn scan nhanh trên mobile.
- Sau mỗi phase phải có artifact và acceptance gate; không gộp toàn bộ phase vào một lượt code rồi sửa theo triệu chứng.


### Phase 2.5 — Decor asset pre-production và duyệt artwork

Đây là bước tạo asset riêng trước khi bắt đầu thiết kế section hoặc viết renderer. Chỉ tạo artwork renderer-owned/decor; không tạo hoặc xử lý ảnh content của user thay cho media contract.

Agent phải lập asset brief và asset matrix, trong đó ghi rõ:

- vai trò: key artwork, corner decoration, divider, frame/mask, background, overlay, watermark, cluster, floating element hoặc standalone prop;
- visual metaphor, palette, chất liệu, ánh sáng, phong cách và mối liên hệ với theme brief;
- kích thước, tỉ lệ, nền trong suốt, vùng an toàn, breakpoint và biến thể desktop/mobile;
- tên file, thư mục bundle, format, kích thước file dự kiến và cách tối ưu;
- asset nào đi cùng section nào, asset nào dùng xuyên trang và asset nào không được lặp;
- prompt/provenance/license và tiêu chí đạt để review.

Artwork được tạo theo batch và phải có preview sheet để duyệt trước. Không được đưa asset chưa duyệt vào composition chính hoặc renderer. Nếu asset bị từ chối, sửa/generate lại trong phase này trước khi chuyển sang Phase 3.

Đầu ra bắt buộc: asset brief, asset matrix, preview sheet, asset manifest/provenance, prompt record, desktop/mobile variants nếu cần và approval checklist. Sau khi duyệt, asset set được xem là đầu vào đã khóa cho các phase tiếp theo; thay đổi lớn về art direction phải quay lại phase này.


### Phase 3 — Section architecture và visual composition

Đọc lại section catalog/domain rules và đối chiếu section/content matrix của Phase 1. Agent phải thiết kế bộ xương của theme trước khi thêm motion:

- Xác định thiết kế đủ tất cả section gồm required và optional;
- chọn layout phù hợp cho từng section, không ép mọi section thành cùng một slide/card/grid;
- xác định cách trình bày của từng setion tránh cùng 1 layout sử dụng quá 3 lần;
- ưu tiên sử dụng các kĩ thuật slide hiện đại cho các section mà user có thể thêm nhiều mục;
- nếu contract cho phép, khai báo nhiều layout option để user lựa chọn;
- xác định tỉ lệ text, ảnh, whitespace, decor, content anchor và visual focal point;
- xác định section transition, responsive composition, empty state và fallback;
- render đủ required sections và các optional sections được theme hỗ trợ;
- cập nhật `template-config.ts`, content schema và fixture để khớp cấu trúc.

Đầu ra bắt buộc: section composition map, layout/transition map và skeleton renderer/config đã map đúng section key. Không dùng animation để che một bố cục chưa đạt.

### Phase 4 — Advanced visual experience, interaction và motion
Đây là pharse quan trọng nhất bắt buộc áp dụng mọi hiệu ứng có thể vào template
- sử dụng bộ artwork đã được duyệt ở Phase 2.5 và sắp xếp hợp lý dựa theo ý nghĩa/vị trí của từng loại ảnh decor
- thêm các hiệu ứng auto animation cho các artwork hoặc các thành phần nhỏ trong template
- thêm các hiệu ứng xuất hiện khi scroll tới section
- tăng độ nhận diện bằng cách sử dụng các css sáng tạo và hiệu ứng 3D
- Tăng trải nghiệm người xem bằng các hiệu ứng thị giác mạnh như paralax scroll hoặc các hiệu ứng thị giác nổi bật khác
- Thêm các hiệu ứng dưới nền để cho background thành background động chứ tránh sử dụng background tĩnh.

Đọc lại approved technique catalog, animation/motion rules, responsive/reduced-motion rules và các skill cần thiết. Agent phải lập technique map cho từng section, ưu tiên kỹ thuật hiện đại có purpose:

- 3D slide, 3D card, 3D photo stack, 3D carousel, CSS perspective;
- parallax, sticky storytelling, horizontal scroll, scale scroll, scroll snapping;
- image masking, image reveal, cinematic image transition, blur-to-sharp, blend mode;
- kinetic typography, text reveal, variable/fluid typography;
- interactive gallery, hover/focus/press, magnetic, drag hoặc gesture khi phù hợp.

Mỗi technique phải ghi UX purpose, trigger, duration/easing hoặc spring, desktop/mobile behavior, touch/keyboard fallback, reduced-motion fallback, browser fallback và performance budget. Mỗi section phải có motion/interaction có chủ đích nhưng không được lạm dụng cùng một pattern cho toàn trang.

Đầu ra bắt buộc: technique map, motion choreography, interaction map, responsive/reduced-motion map và implementation plan trước khi code effect, các hiệu ứng và animation
=> Luôn ưu tiên độ mooth cho toàn bộ trang nên cần hiệu ứng chuyển giao giữa các thao tác, hover, section....

### Phase 5 — Asset integration, atmosphere, system effects, review và release

Đọc lại asset/provenance, motion performance, accessibility và quality gate trong common contract. Sau khi content/layout đã ổn định, agent mới:

- tích hợp bộ artwork renderer-owned đã được duyệt ở Phase 2.5; chỉ tạo bổ sung nếu review phát hiện thiếu asset và phải quay lại approval gate của Phase 2.5;
- bố trí asset theo composition, z-index, crop, density, breakpoint; không che content/CTA;
- thêm background atmosphere như lá/petal bay, dust, mist, ambient particle hoặc light movement;
- thêm entrance/reveal, auto-animation khi section vào viewport, hover/focus/press và interaction fallback;
- kiểm tra visibility pause, density, CPU/GPU, asset size, mobile và reduced-motion.
- cập nhật asset manifest/provenance sau khi asset được tích hợp và xác nhận mọi asset trong bundle đúng với approval checklist.

Sau đó bắt buộc render/review toàn bộ screen bằng design review skill/agent ở desktop, tablet, mobile và reduced-motion. Kiểm tra toàn bộ required/optional sections, toggle, reorder, repeatable, empty/loading/error, internal/external media, section seam, overflow, accessibility và media independence. Chạy typecheck, lint, test, build; cuối cùng audit `template-config.ts` với renderer, editor, catalog, preview path và admin publish/sync.

Đầu ra bắt buộc: asset manifest/provenance, decor map, background-motion map, review report, validation result và release checklist. Chỉ sau phase này template mới được coi là hoàn chỉnh.

Sau khi kết thúc pharse 5 cần liệt kê ra để chắc chắn:
- Tất cả section đều có hiệu ứng xuất hiện cho từng thành phần trong nó
- Cần có ít nhất 3 artwork phụ trang trí xung quanh trang và có hiệu ứng auto animation cho nó
- Cần chắc chắn background có ít nhất 1 hiệu ứng: lá bay ngang, phong thư, hoa rơi, sao rơi,...
- Cần chắc chắn phải có hiệu ứng động khi user dừng ở bát cứ section nào
- Cần đảm bảo phải có ít nhất 1 section 3D
- Cần đảm bảo template phải được bao gồm nhiều loại hiệu ứng

Rule bo sung cho preview dai: voi preview dai tu 12 section tro len, can toi thieu 6 artwork/decor role rieng biet va phai map ro artwork nao di cung section nao de khi user reorder/xoa section thi decor van theo dung section.

## 2. Theme identity không được phụ thuộc media upload

Ảnh/video của couple, chapter, gallery, story, hero và finale là content do user thay đổi. Renderer không được dùng các media này làm nguồn duy nhất để nhận diện theme.

Mỗi theme phải vẫn nhận diện được khi thay toàn bộ ảnh bằng ảnh neutral hoặc ảnh thuộc art direction khác, nhờ:

- palette và typography riêng;
- layout/composition và spacing;
- ít nhất 3 artwork nhận diện khác vai trò;
- nhóm props/decor cùng art direction;
- frame, mask, ornament, divider, texture hoặc ambient scene;
- motion system và transition có chủ đích.

Artwork nhận diện tối thiểu gồm một key/decor artwork chính, một ornament/frame/mask và một texture/light/divider artwork. Nhóm props có thể gồm stationery, ticket, ribbon, flower, candle, ring, film object hoặc vật phẩm đúng chủ đề.

Asset phải nằm trong bundle, có provenance/license trong `assets/ASSET_SOURCES.md` hoặc manifest tương ứng, không hotlink và không chứa couple/model mẫu ở vị trí content.

## 3. Quy tắc tạo/generate hình ảnh

- Ưu tiên asset được tạo riêng cho theme bằng image generation tool hoặc vector artwork nội bộ phù hợp với art direction.
- Khi cần raster artwork, phải yêu cầu rõ mục đích sử dụng, tỷ lệ, nền trong suốt nếu cần, palette, lighting, không người/không chữ nếu asset là decor và yêu cầu không gắn với couple cụ thể.
- Asset generated phải được đưa vào đúng thư mục bundle của theme, đặt tên theo vai trò, có bản preview và ghi nguồn/prompt/license.
- Không dùng ảnh demo couple làm decor, không lấy ảnh content rồi crop thành ornament, không dùng một asset lặp xuyên mọi section nếu asset đó làm theme mất chiều sâu.
- Content media và decor media phải tách field/path rõ ràng trong code và config.

## 4. Motion và hiệu ứng tối thiểu

Mỗi theme phải có một signature effect phù hợp product và các lớp hỗ trợ:

- Hero choreography theo thứ tự đọc: visual/atmosphere → headline → supporting content → CTA.
- Entrance reveal hoặc image reveal cho section/card theo viewport, không để toàn trang xuất hiện đồng thời.
- Ít nhất một ambient auto-animation có mục đích, ví dụ light drift, grain, mist, floating prop, marquee, particle hoặc subtle parallax.
- Hover/focus/press feedback cho CTA và interactive media khi layout cần; touch/keyboard phải có đường tương tác tương đương.
- Transition giữa các section phải liền mạch về background, crop, divider, texture, decor và ánh sáng.

Motion phải dùng transform/opacity khi có thể, có duration/easing nhất quán, không chạy canvas/particle vô hạn khi section ngoài viewport và phải cleanup khi unmount.

`prefers-reduced-motion: reduce` bắt buộc:

- tắt scroll scrub, parallax, cursor trail, auto-pan và particle động;
- giữ toàn bộ content, CTA và hierarchy;
- thay bằng composition tĩnh hoặc opacity transition ngắn;
- không hijack native vertical scroll trên mobile.

## 4.1. Section clarity, ngôn ngữ và scroll experience

Mỗi section phải tự giải thích được mục đích của chính nó. Khi viewer vừa scroll tới section, họ phải nhận ra section đang nói về story, chapter, moment, album, lời cảm ơn hoặc nội dung tương ứng; không được chỉ nhìn thấy một ảnh đẹp nhưng không biết nội dung là gì.

- Mỗi section phải có content anchor rõ ràng: heading/title, eyebrow/label, caption, metadata hoặc CTA phù hợp. Text phải hỗ trợ hiểu nội dung, không dùng typography/decor để che mất semantic purpose.
- Nội dung chính ưu tiên tiếng Việt. Có thể dùng quote/tagline tiếng Anh theo art direction, nhưng tối đa 3 câu ngắn trong toàn theme. Theme cũng có thể không dùng tiếng Anh nếu chủ đề phù hợp hơn với tiếng Việt.
- Khi viewer scroll tới bất kỳ section nào, section đó phải có auto-animation hoặc ambient motion có chủ đích để tránh cảm giác màn hình tĩnh. Motion không được che content, gây nhấp nháy hoặc chạy vô hạn thiếu kiểm soát.
- Tất cả section phải có hiệu ứng xuất hiện/reveal theo thứ tự đọc. Content phải vẫn hiển thị nếu JavaScript hoặc motion bị lỗi.
- Ưu tiên composition có chiều sâu và cảm giác 3D, đặc biệt với slide/card/gallery 3D: layered depth, perspective, controlled tilt, shared-element transition hoặc spatial parallax. 3D phải có 2D/mobile fallback.
- Smooth scroll được ưu tiên cho desktop nhưng phải respect native scroll, reduced motion, touch và keyboard. Không được khóa người dùng trong một scene.
- Ưu tiên Parallax Scroll, Horizontal Scroll, Sticky Storytelling, Scale Scroll và scroll-linked section transition khi phù hợp. Mỗi pattern phải có UX purpose, breakpoint, performance budget và fallback.
- Ưu tiên kỹ thuật hiện đại như CSS Scroll-driven Animation, View Transitions API, Shared Element Transition, Kinetic Typography, Magnetic Button, Blur to Sharp Image, SVG Morphing, Lottie, Image Blend Mode và Interactive Gallery.
- Không dùng kỹ thuật hiện đại chỉ để phô diễn. Không xếp quá nhiều pattern cạnh nhau và vẫn phải giữ một signature effect chính cho toàn theme.

Các API chưa đồng đều như View Transitions API, CSS Scroll-driven Animation, Lottie hoặc Shared Element Transition phải có feature detection và fallback tĩnh/CSS/DOM tương đương. Mọi technique vẫn phải tuân thủ reduced-motion, accessibility, cleanup và performance rules.

## 4.2. Approved frontend technique catalog

Các kỹ thuật dưới đây được phép và nên được cân nhắc khi thiết kế theme. Agent phải chọn theo art direction, nội dung, breakpoint và performance budget; không bắt buộc nhồi tất cả kỹ thuật vào một theme.

### 1. Animation & Motion

- Motion Design.
- Scroll-driven Animation.
- Kinetic Typography.
- Micro-interactions.
- Spring Animation.

### 2. Image / Visual

- Image Masking.
- Image Reveal.
- Image Parallax.
- Cinematic Image Transition.
- Image Distortion.

### 3. 3D / Depth

- CSS 3D.
- 3D Parallax.
- 3D Card Interaction.
- 3D Photo Stack.
- 3D Carousel.

Nhóm 3D/depth này có thể triển khai bằng CSS, DOM, Motion hoặc SVG; chưa cần Three.js/WebGL. Three.js/WebGL chỉ được dùng khi brief thật sự cần spatial scene, shader hoặc số lượng layer vượt khả năng CSS/DOM và phải có 2D fallback.

### 4. Scroll / Navigation

- Smooth / Inertia Scrolling.
- Sticky Scrolling.
- Horizontal Scrolling.
- Scroll Snapping.
- Parallax Scrolling.

### 5. UI Interaction

- Magnetic Interaction.
- Custom Cursor.
- Hover Interaction.
- Drag Interaction.
- Gesture Interaction.

Custom cursor, hover và magnetic interaction chỉ dành cho thiết bị có fine pointer; touch/keyboard phải có control hiển thị và feedback tương đương. Drag/gesture không được khóa native scroll.

### 6. Visual Effects

- Noise / Grain.
- Blur Transition.
- Blend Modes.
- Mesh Gradient.
- Backdrop Filter.

### 7. Typography

- Kinetic Typography.
- Text Reveal.
- Text Splitting.
- Variable Font Animation.
- Fluid Typography.

Text splitting chỉ áp dụng cho heading/câu ngắn, không tách từng ký tự trong đoạn văn dài hoặc nội dung tiếng Việt dài gây khó đọc/accessibility.

### 8. Animation Libraries / Rendering

- GSAP.
- GSAP ScrollTrigger.
- Lottie.
- Rive.
- Web Animations API.

Chỉ chọn một motion runtime chính cho một theme khi có thể. GSAP/ScrollTrigger phải cleanup khi route thay đổi; Lottie/Rive phải có poster/static fallback và giới hạn kích thước tải.

### 9. Web Platform hiện đại

- View Transitions API.
- Shared Element Transitions.
- CSS Scroll-driven Animations.
- Container Queries.
- CSS Anchor Positioning.

Các API này phải có feature detection hoặc progressive enhancement. Browser không hỗ trợ vẫn phải render đúng content, layout và CTA bằng CSS/DOM cơ bản.

Mỗi theme phải ghi trong pre-code brief: kỹ thuật được chọn, section áp dụng, UX purpose, trigger, duration/easing, desktop/mobile behavior, reduced-motion fallback, browser fallback và performance budget.

## 5. File structure tối thiểu

Mỗi theme phải có cấu trúc tương đương:

```text
<theme-key>/
  template-config.ts
  content.ts
  fixture.ts
  <ThemeRenderer>.tsx
  <theme-key>.css
  <ThemeRenderer>.test.tsx
```

Asset theme-owned nằm trong bundle public tương ứng và có manifest/source record. Renderer nhận content qua props; không hard-code couple/model content vào component.

## 6. Template config bắt buộc

`template-config.ts` là nguồn dữ liệu cho catalog, editor, validator, migration và renderer. Không hard-code section/field/layout riêng trong editor nếu đã thuộc config.

Config phải khai báo tối thiểu:

- `templateKey`, display name, product type, version, status, preview path;
- capabilities và theme metadata;
- section key, label, default order;
- `required`, `canToggle`, `canReorder`, repeatable/item limit;
- layout options và default layout;
- field schema/content role;
- media role/source, internal/external source nếu product hỗ trợ;
- mobile fallback và reduced-motion fallback;
- motion level, gallery/media behavior và asset/decor manifest reference nếu contract hỗ trợ.

Renderer phải map đúng `sectionKey`, render đủ required sections, hỗ trợ optional toggle/empty state và không tạo semantic section ngoài config.

## 7. Quality gate trước khi hoàn thành

- [ ] Theme có độ phức tạp đủ để tạo ấn tượng, không chỉ là layout cơ bản + static image + fade-in; complexity có hierarchy và UX purpose.
- [ ] Đã render/review toàn bộ screen bằng design review skill/agent hoặc skill kiểm tra UI phù hợp; đã kiểm tra desktop, tablet, mobile và reduced-motion.
- [ ] Đã kiểm tra đủ toàn bộ required sections và toàn bộ optional sections theo domain contract, bao gồm trạng thái bật/tắt và empty state.
- [ ] `template-config.ts` đã được kiểm tra lại ở bước cuối: section key, order, required/optional, field schema, layout, media role, capability và preview path đều khớp renderer/editor trước khi admin publish/sync.

- [ ] Mỗi section có content anchor rõ ràng để viewer nhận biết section đang nói về gì.
- [ ] Mỗi section có entrance effect và auto-animation/ambient motion khi đi vào viewport.
- [ ] Nội dung chính là tiếng Việt; tổng số quote/tagline tiếng Anh không vượt quá 3 câu ngắn hoặc theme đã chủ động chọn không dùng tiếng Anh.
- [ ] Có smooth-scroll strategy và fallback; đã cân nhắc Parallax, Horizontal Scroll, Sticky Storytelling, Scale Scroll hoặc pattern tương đương.
- [ ] Đã đánh giá 3D/depth cho slide/card/gallery phù hợp, có mobile/2D fallback.
- [ ] Đã chọn kỹ thuật frontend hiện đại phù hợp; mỗi kỹ thuật có UX purpose, feature fallback và performance budget.
- [ ] Đã đánh giá approved technique catalog và ghi rõ kỹ thuật được chọn, section áp dụng, trigger, fallback và giới hạn hiệu năng trong pre-code brief.

- [ ] Đã gọi đúng domain agent và agent đã đọc common docs + section docs riêng.
- [ ] Đủ required sections theo product contract.
- [ ] Optional sections có config, toggle, empty state và fallback.
- [ ] Có tối thiểu 3 artwork nhận diện + nhóm props/decor.
- [ ] Có asset source/provenance/license rõ ràng.
- [ ] Theme vẫn nhận diện khi thay toàn bộ content media.
- [ ] Có hero choreography, entrance reveal và ambient auto-motion.
- [ ] Có signature effect với UX purpose, performance budget và reduced-motion fallback.
- [ ] Mobile 375px/390px/768px và desktop được kiểm tra.
- [ ] Đã kiểm tra focus, keyboard, touch, contrast, alt text, loading/empty/error.
- [ ] Đã audit seam giữa các section liền kề.
- [ ] `template-config.ts`, fixture, renderer và editor mapping nhất quán.
- [ ] Typecheck, lint, test và build đã chạy; blocker phải được ghi rõ, không đánh dấu hoàn thành khi quality gate chưa đạt.
