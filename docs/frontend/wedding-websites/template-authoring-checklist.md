# Checklist tạo template website cưới

## Trước khi code

- Hoàn thành `Docs compliance manifest` theo [Theme authoring compliance](../theme-authoring-compliance.md). Đọc đầy đủ required docs ở preflight; không bắt đầu code khi manifest/artifact còn thiếu và không dùng summary/trí nhớ thay cho lần đọc hiện tại.
- Với strong-subject theme như Winter, Sakura/Cherry Blossom, Forest hoặc Hydrangea, bắt buộc gọi `decor_image_agent` và tạo decor family riêng trước khi khóa composition. Theme dài cần tối thiểu 6 artwork ở ít nhất 4 vai trò, tuân thủ toàn bộ border/alpha/independence/family-bible/contact-sheet/provenance rule; không dùng ảnh user upload làm bằng chứng chủ đề.

- Kiểm thử nhận diện theme độc lập với media: thay toàn bộ hero, couple, story và gallery fixture bằng ảnh cưới trung tính hoặc ảnh không cùng art direction. Ảnh upload chỉ là nội dung ký ức, không được gánh nhận diện chính. Theme phải tiếp tục được nhận ra qua palette, typography, renderer-owned photo frame, ornament, divider, texture và ambient scene; framing không được che chủ thể trong ảnh người dùng.
- Viết `theme thesis`, `story spine` và `section-theme matrix` trước layout. Mỗi section phải nêu vai trò trong câu chuyện, cầu nối từ/đến section kế bên và ít nhất ba dấu hiệu renderer-owned gắn với theme khi user media bị bỏ hoặc thay bằng placeholder. Section generic chỉ đổi màu/ảnh không qua gate.
- Theme có art direction 3D mạnh phải có ít nhất hai spatial focal section khác vai trò. Mỗi focal section lập scene graph theo `far-background → background-depth → content-plane → midground-occluder → foreground-frame → atmosphere → interaction-plane`; tối thiểu bốn mặt phẳng nhìn thấy rõ gồm background, content, occluder và foreground/atmosphere. Theme editorial/minimal/typography-first không bắt buộc 3D.
- Mọi theme dài phải đạt `experience diversity gate`: chọn ít nhất ba loại trải nghiệm khác vai trò từ scroll/reveal choreography, gallery interaction, living-state ambient, material/light transition, typography motion, microinteraction hoặc spatial depth. Không dùng một hiệu ứng lặp cho mọi section và không thêm 3D trái art direction chỉ để đủ gate.
- Lập `section composition map`. Reject section chỉ có background + text overlay, trừ một nhịp nghỉ được giải thích rõ và vẫn có typography/material/decor/motion riêng. Mỗi section cần một primary composition và ít nhất một supporting layer; không quá một phần ba section dùng composition tối giản và không đặt hai section tối giản liên tiếp.
- Theme dài phải có ít nhất một composition kiểu split/sticky hoặc scroll-synced và ít nhất một media experience kiểu carousel/collage/gallery tương tác, trừ khi specification chứng minh pattern khác có độ phong phú tương đương. Auto-slide background phải có control/pause, contrast ổn định, static reduced-motion fallback và không thay user media thành theme identity.

- Chốt key kebab-case, display name, SemVer và art direction.
- Chọn layout, mobile/reduced-motion fallback cho mọi section.
- Chọn đúng một focal interaction; ghi performance budget và missing-media composition.
- Xác nhận asset/license và font có Vietnamese subset.
- Nếu template có chủ đề hình ảnh cụ thể, biến chủ đề đó thành nhận diện cấu trúc qua palette, typography, frame, ornament, divider hoặc texture. Theme phải vẫn được nhận ra rõ ràng khi chưa có media người dùng hoặc khi toàn bộ ảnh mẫu đã bị thay bằng ảnh upload không cùng art direction; không dùng nội dung ảnh của cô dâu/chú rể làm điểm nhận diện chủ đề duy nhất.
- Mỗi theme có chủ đề phải có ít nhất 3 artwork nhận diện khác vai trò (ví dụ hero frame/scene, corner ornament, wreath/garland/divider), không lặp một artwork ở mọi section. Bổ sung một nhóm prop artwork dùng chung hoặc tạo riêng như ly champagne, vows, nhẫn, nến, phong bì, signage hoặc vật phẩm phù hợp art direction để section có nhịp hình ảnh đa dạng; mọi asset phải có nguồn/license rõ và không được lấn át nội dung.
- Với decor cho section/body, brief qua `decor_image_agent` và skill `.agents/skills/generate-wedding-decor/`. Mặc định tạo cụm/vật thể độc lập có silhouette hoàn chỉnh, cạnh alpha sạch, chi tiết sắc nét và có thể đặt trên nhiều nền; không gen sẵn screenshot trang, card, căn phòng, landscape, khung hoặc cành cây chỉ để chống đỡ bố cục. Background/scene, frame, branch, wreath hoặc garland chỉ được tạo khi là vai trò asset đã chủ động chọn.
- Decor đặt giữa viewport hoặc giữa section tuyệt đối không có viền khung, mép giấy, rectangle crop, vignette biên, nền phẳng bao quanh hoặc đường bao nhân tạo. Chỉ giữ biên tự nhiên của chính vật thể/cụm hoa và alpha chuyển sạch; asset có frame/border chỉ được dùng ở vai trò frame/corner/edge đã chỉ định, không dùng làm floating center decor.
- Với một public theme dài, lập `asset usage map` trước khi code: tối thiểu 6 artwork decor khác nhau, phủ ít nhất 4 vai trò không gian; không đặt cùng một artwork nổi bật ở hai section kề nhau và không dùng nổi bật cùng một file quá 2 lần trên toàn trang. Biến thể chỉ scale/mirror/tint không được tính là artwork mới. Có thể giảm số lượng cho surface ngắn nếu specification giải thích rõ và vẫn không tạo cảm giác lặp.
- Chốt `motion map` cùng art direction: một signature interaction và 2–4 lớp motion hỗ trợ phân bố theo hành trình, trong đó theme dài phải có ít nhất một interaction chiều sâu hoặc scroll-driven phù hợp như 3D slide/carousel, layered parallax, pinned chapter, scroll reveal có choreography hoặc horizontal story. Không coi fade-in đồng loạt là motion direction hoàn chỉnh; smooth scroll chỉ dùng desktop/fine-pointer khi có mục đích và không được thay thế native accessibility.
- Chốt thêm `living-state motion map`: theme dài dùng 2–3 ambient motif đúng chủ đề để section vẫn sống động khi user dừng đọc, như hoa/cánh hoa rơi, sao rơi, bụi sáng, sương/nắng drift, decor breathing hoặc floating props. Phân bố theo chapter; một viewport tối đa 2 system đồng thời, chỉ một system có vật thể di chuyển rõ và phải giữ quiet zone quanh text/form/CTA.

## Cấu trúc file

```text
frontend/src/templates/websites/<template-key>/
├── <TemplateName>Website.tsx
├── template-config.ts
├── fixture.ts
├── content.ts
├── <template-key>.css
└── <TemplateName>Website.test.tsx
```

Preview route là `/templates/websites/<template-key>/preview`. Preview/editor/production dùng cùng renderer, chỉ khác data source và editor bridge.

## Renderer/editor

- Visual section có `data-editor-section` đúng key.
- Renderer nhận content/theme/section/event/media projection, không đọc fixture ngầm.
- Dùng shared first-load auto-scroll trên mobile public renderer: start chậm sau layout ổn định, dừng vĩnh viễn ngay khi có touch/drag/wheel/key/focus/control intent, không chạy lại trong mount, không chạy editor/desktop/reduced-motion/deep-link/restored-scroll và cleanup đầy đủ.
- Khi có music track, mặc định yêu cầu bật/phát với volume thấp `0.22` và cap khởi tạo `0.30`; dùng shared player, xử lý autoplay-blocked sau gesture và đặt control viewport góc trái dưới trên safe area. Không tạo audio instance/control riêng cho từng theme.
- Section tắt rời DOM; order không phá anchor; navigation sinh từ section bật.
- URL được validate; RSVP/lời chúc dùng adapter, không hard-code endpoint.
- Countdown dùng timestamp/timezone; nhạc có control và autoplay fallback.
- Form sinh từ config/schema; theme option chỉ hiện khi renderer có implementation.
- Focus field cuộn đúng section; iframe không reload theo input.
- Có dirty state, manual save, leave warning, revision conflict và tự mở card/tab validate lỗi đầu tiên.

## Accessibility/performance

- Kiểm tra riêng mọi điểm giao giữa hai section liên tiếp ở desktop và mobile. Màu nền, đường chân ảnh, texture, botanical foreground, ánh sáng và hướng chuyển động phải có continuity hợp lý; tránh hai background cùng chủ đề nhưng crop/đường biên tạo thành một đường cắt ngang rõ rệt. Ưu tiên shared foreground, gradient bridge, overlap có kiểm soát, mask/clip-path mềm hoặc một transition chapter có chủ đích. Fallback reduced-motion vẫn phải giữ seam tĩnh tự nhiên và không tạo khoảng trống.
- Lập `section seam map` cho toàn bộ thứ tự mặc định và mọi cặp section có thể trở thành hàng xóm khi user tắt/reorder. Màu kết thúc của section trước phải khớp hoặc chuyển có chủ đích sang màu mở đầu của section sau (ví dụ gradient kết ở tím thì section kế mở bằng cùng tím); che điểm nối bằng overlap/gradient bridge/shared foreground khi cần. Test ở scroll dừng đúng đường nối và cấm thấy hairline, hard band, mép ảnh hoặc bước nhảy màu ngoài chủ ý.
- Không hard-code seam theo thứ tự mặc định. Mỗi section khai báo `entryVisualState` và `exitVisualState` gồm color stop, light level, texture/motif, foreground density và transition capability; renderer/stylesheet chọn bridge theo cặp section đang kề nhau sau reorder/disable. Lập allowed-adjacency matrix và test mọi cặp có thể phát sinh, không chỉ các cặp trong fixture mặc định.
- Audit story continuity ngoài seam thị giác: mỗi chapter phải tiếp nhận một motif/mood/question từ chapter trước và phát triển nó trước khi chuyển tiếp. Khi optional section bị tắt/reorder, renderer phải chọn transition/motif fallback hợp lệ; không để câu chuyện nhảy từ opening sang RSVP như hai template ghép lại.

- Keyboard dùng được navigation, gallery/lightbox, accordion, RSVP, audio.
- Focus visible, dialog trap/restore, Escape hợp lý, contrast AA.
- Không overflow ở 375px; test 768px, 1280px và màn rộng.
- Reduced motion bỏ parallax/scrub/auto-pan nhưng giữ content/countdown.
- Smooth-scroll enhancement không chạy trên touch hoặc reduced motion, không phá anchor/focus/history, không khóa wheel/keyboard và phải cleanup khi đổi route. 3D slide/carousel có điều khiển trước/sau, trạng thái hiện tại, pause/autoplay policy, keyboard path và fallback 2D/static.
- Layered scene mặc định dùng DOM/CSS perspective, Motion hoặc GSAP để giữ semantic content và chi phí thấp. Chỉ dùng Three.js khi cần camera/mesh/lighting/material/occlusion/shader thật; tối đa một WebGL scene active mặc định, lazy-load, cap DPR, pause/dispose đúng lifecycle và có poster/DOM fallback.
- Living-state motion chỉ chạy khi section thực sự visible; pause khi section rời viewport, tab ẩn, modal/critical task mở hoặc component unmount. Không replay entrance reveal do dao động scroll nhỏ; không tạo nhiều RAF loop trùng nhau. Mobile giảm density/layer, reduced motion dùng composition tĩnh hoàn chỉnh.
- Lazy-load media, ảnh có dimensions, video có poster; tối đa một canvas/WebGL và dừng RAF khi hidden.

## Test/release gate

- Thực hiện postflight: đọc lại toàn bộ required docs đã ghi trong compliance manifest và gắn evidence thực tế cho từng quyết định. Không release nếu manifest thiếu recheck/evidence hoặc implementation lệch spec mà docs chưa được cập nhật.

- Config có integer versions, `previewPath`, capabilities, defaults, sections và field constraints.
- Fixture không PII; test long text, missing media, multiple events và section off.
- Fixture user-media slots dùng ảnh demo cô dâu/chú rể và đám cưới đúng vai trò; một theme giữ cùng cặp đôi hư cấu, giữa các theme đa dạng cặp đôi/pose/trang phục/bối cảnh. Cấm ảnh decor, phong cảnh/vật thể ngẫu nhiên hoặc media không liên quan trong hero/couple/story/gallery.
- Test mobile auto-scroll dừng ở mọi first intent, không resume; test music enabled-default ở autoplay-allowed/blocked, volume cap, safe-area control và interaction giữa music control với auto-scroll.
- Test schema, normalize section, countdown, URL validation, reduced motion.
- Test asset usage map, center-decor border rejection, mọi seam theo default/off/reorder state và motion map ở desktop/mobile/reduced motion.
- Test theme-independence theo từng section và story spine với optional section off/reorder. Với theme 3D mạnh, test ít nhất hai spatial focal section ở trạng thái user-media neutral, motion off, mobile và reduced motion; với theme khác, kiểm chứng experience diversity gate thay thế.
- Audit section composition map ở desktop/mobile/missing-media/reduced-motion; fail nếu fallback biến section phức tạp thành khoảng trống với text, nếu hai section tối giản trở thành hàng xóm sau reorder hoặc nếu auto-slide không có control/pause.
- Shuffle section theo ít nhất ba thứ tự hợp lệ, lần lượt tắt từng section optional và chụp đúng mọi seam mới phát sinh; không release nếu có cặp adjacency không có transition fallback hoặc làm đứt motif/story.
- Lập `decor family bible` trước khi gen/tải asset: khóa medium/realism, palette range, saturation/contrast, light direction và softness, camera/perspective, shadow treatment, edge/alpha quality, botanical/object anatomy và mức độ chi tiết. Review toàn bộ decor renderer-owned cạnh nhau trên cùng contact sheet và trong ít nhất ba section; reject asset đúng chủ đề nhưng khác medium, ánh sáng, perspective hoặc finish khiến nó lạc quẻ.
- Dừng 8–12 giây ở từng chapter quan trọng để review living-state: theme vẫn chuyển động tinh tế, không có khoảng chết dài, không che chữ/CTA, không hút mắt liên tục và không còn animation chạy sau khi section/tab bị ẩn.
- Test editor handshake/update/scroll, validation, dirty/manual save.
- Test save → preview → publish → public snapshot → unpublish.
- Test admin sync → pending → preview → release → user catalog → deprecate.
- Breaking schema/config tăng version và có migration deterministic.

Template chỉ hoàn thành khi config, fixture, renderer, preview route, editor schema, tests và release bundle cùng tồn tại. Demo hard-code dữ liệu hoặc thiếu fallback/publication flow chưa được xem là template hoàn chỉnh.
