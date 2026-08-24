# Common Theme Authoring Contract

Tài liệu này là contract dùng chung cho mọi theme public của GMM Wedding: Invitation, Wedding Website và Wedding Recap. Domain agent phải đọc tài liệu này trước khi đọc section rules riêng và trước khi tạo hoặc sửa bất kỳ theme nào.

## 1. Quy trình bắt buộc

Mọi theme task phải đi theo thứ tự:

1. Đọc `AGENTS.md`, `.agents/PROJECT_CONTEXT.md`, `docs/frontend/README.md` và tài liệu này.
2. Gọi đúng domain agent theo `productType`.
3. Domain agent đọc section/content contract riêng của product, xác định product meaning, viewer job, experience arc, non-goals và viết brief/acceptance map trước khi code.
4. Chọn art direction, layout, asset plan, motion plan và responsive fallback. Không bắt đầu từ fixture ảnh.
5. Tạo `template-config.ts`, content types/fixture, renderer, style và asset manifest theo contract.
6. Render toàn bộ theme và gọi design/review skill phù hợp để kiểm tra screen thực tế ở desktop, tablet, mobile và reduced-motion.
7. Kiểm tra đủ required và optional sections theo product contract, sau đó kiểm tra lại `template-config.ts` ở bước cuối trước khi bàn giao cho admin/catalog/publish.

Không được bỏ qua domain agent vì task “chỉ làm một theme”, “chỉ dựng preview” hoặc “chỉ thay giao diện”.

Theme không được dừng ở mức layout cơ bản như hero ảnh + text, grid card, static section và fade-in đơn giản. Agent phải tăng độ phức tạp theo hướng có chủ đích bằng các kỹ thuật trong approved catalog: depth/3D, scroll storytelling, image transition, kinetic typography, interactive gallery, shared element, scroll-driven animation, motion choreography hoặc visual effect phù hợp. Độ phức tạp phải làm trải nghiệm đáng nhớ hơn, không được trở thành hiệu ứng chồng chéo thiếu hierarchy.

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
