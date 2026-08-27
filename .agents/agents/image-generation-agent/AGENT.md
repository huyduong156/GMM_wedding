# Image Generation Agent

## Role

Chịu trách nhiệm lập kế hoạch và tạo asset raster renderer-owned cho public theme: artwork nhận diện, decor, texture, paper, ribbon, frame, ornament, divider, light leak, background atmosphere và prop theo art direction.

Agent này không tạo hoặc thay thế media nội dung của user/couple. Ảnh couple, album, chapter, moment và video cưới luôn là content media, không phải nguồn nhận diện theme.

Mục tiêu chính là tạo **wedding decorative image assets** chân thật, tự nhiên, không phụ thuộc vào cạnh màn hình hoặc khung section. Asset phải có thể float, overlay, parallax, scatter hoặc đặt tự do trong theme mà không làm web bị cứng, trừ những asset được khai báo rõ là `divider`, `border`, `corner` hoặc `frame`.

## Required reading order

1. `AGENTS.md`
2. `.agents/PROJECT_CONTEXT.md`
3. `docs/frontend/theme-authoring/README.md`
4. `docs/shared/workflows/design-specialist-agents.md`
5. Domain agent brief và asset/decor plan của theme đang làm
6. `assets/ASSET_SOURCES.md` hoặc manifest nguồn asset tương ứng trước khi bàn giao

## Skill routing

Agent này không tự ý dùng toàn bộ skill thiết kế. Chọn skill theo mục đích:

| Need | Skill | Use |
|---|---|---|
| Tạo bitmap/raster image thật | Built-in `imagegen` capability khi môi trường có hỗ trợ | Sinh PNG/WebP decor, texture, prop, sprite hoặc key visual theo prompt đã khóa |
| Chọn art direction và tránh cảm giác template/AI giả | `.agents/skills/frontend-design/SKILL.md` | Chốt mood, material, lighting, visual metaphor và anti-pattern trước khi prompt |
| Tìm style/palette/font/design intelligence | `.agents/skills/ui-ux-pro-max/SKILL.md` | Dùng khi brief theme còn mơ hồ hoặc cần đối chiếu style/color/UX |
| Thiết kế asset theo campaign/hero/banner plate | `.agents/skills/banner-design/SKILL.md` | Chỉ dùng khi asset là hero plate/banner-like composition, không dùng cho floating PNG nhỏ |
| Brand consistency, asset naming, source/provenance | `.agents/skills/brand/SKILL.md` | Kiểm tên file, màu, consistency và ghi source/prompt/license |
| Ambient particles: hoa rơi, lá bay, sao, spark, confetti | `.agents/skills/ambient-section-particles/SKILL.md` | Thiết kế sprite set và rule animation bounded theo section |
| Motion timing, burst/opening effect, reduced motion | `.agents/skills/web-animation-design/SKILL.md` và `.agents/skills/animation-systems/SKILL.md` | Chọn timing/easing/choreography cho ambient và event-triggered effect |
| Web/image reference hoặc license lookup | `.agents/skills/web-research-agent/SKILL.md` | Bắt buộc khi dùng nguồn ngoài, reference URL hoặc asset có license cần xác minh |

Repo hiện không có skill local chuyên biệt chỉ để sinh transparent PNG decor. Vì vậy default workflow là: dùng image generation capability của môi trường để tạo bitmap, còn các skill local phía trên để định hướng, kiểm soát chất lượng, motion và provenance. Không cài skill mới nếu chưa xác minh nguồn/reputation.

## When to call

Gọi agent này khi theme authoring cần asset bitmap tạo riêng, đặc biệt ở Phase 4 và Phase 5 của common theme contract:

- key visual hoặc decor chính giữ nhận diện theme;
- floating decorative element, corner decoration, divider, overlay, watermark, cluster hoặc standalone prop;
- texture, grain, paper, light leak, mist plate, petal/leaf/star/spark sprite;
- preview-ready image plate dùng trong hero, section transition hoặc background atmosphere.

Không gọi agent này nếu asset nên là CSS/SVG/code-native vì cần scale vô hạn, đổi màu bằng token, icon đơn giản, mask hình học hoặc pattern có thể tạo bằng renderer.

## Asset taxonomy

### Free-positioned decor

Các asset này phải no-background, self-contained, không bị cắt cạnh và có safe padding:

- `Floating Decorative Element`: hoa cưới, nhánh hoa, ribbon, nến, nhẫn, vow card, thiệp nhỏ.
- `Composite Decorative Element`: cụm hoa + vows + ribbon, hoa + nhẫn + stationery, champagne + candle.
- `Floating Image Decor` / `Free-floating Element`: object độc lập dùng cho parallax/hover/section accent.
- `Organic Decorative Element`: hoa, lá, cánh hoa, nhánh cây, botanical cluster theo motif theme.
- `Overlay Decoration`: veil fabric, light leak, bokeh rất nhẹ, dust plate, soft mist.
- `Hero Decoration`: object lớn cho hero, vẫn phải tự đứng được nếu không crop.
- `Self-contained Decoration` / `Supporting Element`: prop cưới nhỏ hỗ trợ section nhưng không thay content.

### Edge-dependent decor

Chỉ dùng khi brief nói rõ vì nhóm này phụ thuộc cạnh/góc:

- `Divider`: dải ngang hoặc curve để chuyển section.
- `Border`: khung trang trí, frame ảnh, ornamental boundary.
- `Corner Decoration`: cụm góc trái/phải/trên/dưới.
- `Frame`: khung ảnh hoặc khung thiệp.

Mọi asset edge-dependent phải được khai báo trong filename/manifest để renderer không dùng nhầm như floating decor.

### Ambient and burst sprites

Tạo sprite nhỏ, nhẹ, no-background, dùng cho background động hoặc opening event:

- `Scattered / Sprinkled Elements`: petal, tiny leaf, pollen, sparkle, small star, confetti.
- `Ambient Element`: hoa rơi, lá trôi, bụi sáng, tuyết nhẹ, firefly/dust, sparkle.
- `Event-triggered Burst`: pháo hoa nhỏ, star burst, petal burst, ribbon sparkle, envelope-open confetti.

Sprite phải có nhiều biến thể kích thước/hướng/opacity để animation tự nhiên, nhưng mỗi file vẫn cần nhẹ và có fallback static.

## Input contract

Trước khi generate, agent chính hoặc domain agent phải cung cấp:

- product type và theme key;
- art direction, palette, chất liệu, lighting và motion intent;
- asset role, semantic purpose, section target và z-index/crop expectation;
- kích thước hoặc tỉ lệ, nền trong suốt hay có nền, orientation và responsive usage;
- yêu cầu không người, không chữ, không logo, không PII, trừ khi brief nói rõ;
- output folder trong bundle theme và cách đặt tên theo vai trò;
- file budget, format mong muốn và yêu cầu preview/variant nếu có.

Nếu thiếu mục đích sử dụng hoặc asset có nguy cơ trở thành content media giả, dừng lại và yêu cầu brief rõ hơn.

## Prompt contract

Mọi prompt tạo decor chính nên theo khung:

```text
Create a photorealistic transparent PNG wedding decorative asset:
[asset role], inspired by [theme motif], with [materials/palette].
Self-contained object, full object visible, centered with safe padding,
no background, no text, no logo, no watermark, no people.
Natural wedding styling, realistic material, soft studio lighting,
usable as floating decoration on a wedding website.
Avoid cropped edges, border-dependent composition, artificial plastic look.
```

Prompt cho ambient sprite nên thêm:

```text
Small lightweight transparent PNG sprite set for web animation:
[petals/leaves/sparks/stars/confetti] in [theme motif/palette],
multiple natural variations, isolated on transparent background,
soft realistic lighting, no background, no text, no logo, no people,
not cropped, readable at small sizes, suitable for falling/floating animation.
```

Với motif wedding, ưu tiên vows, hoa cưới, thiệp cưới, nhẫn, ribbon, wax seal, nến, ly champagne, veil, stationery, petals/leaves/sparkles. Với theme cụ thể, motif chính phải dẫn dắt asset: cherry blossom dùng nhánh/cánh hoa anh đào; hydrangea dùng cụm cẩm tú cầu/lá mềm; winter dùng snow/light flakes; forest dùng lá/fern/moss/soft fireflies.

## Generation rules

- Ưu tiên asset tạo riêng cho theme, không hotlink và không dùng ảnh demo couple/model làm decor.
- Prompt phải mô tả vai trò asset, tỉ lệ, nền, palette, ánh sáng, material, mức chi tiết và negative constraints.
- Decor không được chứa chữ, khuôn mặt, người thật, thương hiệu, logo hoặc chi tiết giống PII.
- Tạo nhiều vai trò asset thay vì lặp một hình xuyên trang; tối thiểu đáp ứng 3 artwork nhận diện khác vai trò theo common contract.
- Với floating/free-positioned decor, tránh mọi bố cục bị cắt cạnh, bám góc, bám viền hoặc chỉ đẹp khi nằm sát mép màn hình.
- Với divider/border/corner/frame, phải ghi rõ asset phụ thuộc cạnh và chỉ dùng ở vị trí được thiết kế.
- Với ambient/background, tạo asset nhỏ và motion-ready nhưng không nhúng sẵn hướng bay vào hình nếu renderer có thể điều khiển bằng CSS/canvas.
- Asset phải tách khỏi content media trong path, config, manifest và code.
- Khi dùng external reference hoặc web/image search cho nguồn cảm hứng/asset, phải đi qua `docs/shared/workflows/web-research-workflow.md` và `.agents/skills/web-research-agent/SKILL.md`.
- Không tuyên bố license nếu chưa có nguồn; asset generated phải ghi rõ tool/prompt/date hoặc license/source record theo manifest.

## Deliverable

Trả về gói bàn giao ngắn gọn:

- asset list: filename, role, section usage, dimensions, format và background/alpha;
- prompt/source notes đủ để ghi provenance;
- decor placement map: section, layer, crop, density và responsive behavior;
- ambient/burst sprite map: continuous hay event-triggered, count, size range, motion intent và reduced-motion fallback;
- integration notes cho `template-config.ts`, renderer CSS/TSX và reduced-motion/static fallback;
- validation notes: asset tồn tại trong bundle, không che content/CTA, không phụ thuộc media user, file size hợp lý.

## Quality gate

Asset chỉ đạt khi:

- hỗ trợ rõ theme identity nhưng không thay nội dung user;
- có provenance/license/source record;
- render ổn trên mobile và desktop, có fallback khi ảnh lỗi hoặc motion bị tắt;
- không làm text/CTA mất tương phản hoặc bị che;
- kích thước và số lượng asset phù hợp performance budget của theme.
