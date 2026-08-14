# Wedding Recap section và layout catalog

Mỗi section phải có một primary composition và ít nhất một supporting layer (decor, material, ambient, transition, interaction hoặc secondary information plane). `background + text` chỉ là nhịp nghỉ hiếm và phải ghi lý do.

| Section | Layout options | Khi dùng |
|---|---|---|
| Opening / title | `cinematic-immersion`, `editorial-title-lockup`, `split-portrait-lead`, `layered-spatial-stage` | Mở thesis; luôn có tên, ngày hoặc CTA xem tiếp. |
| Atmosphere / location | `parallax-depth-scene`, `stable-copy-scroll-media`, `ambient-map-panel`, `material-transition` | Dẫn vào địa điểm, mùa hoặc chất liệu. |
| Memory chapters | `sticky-chapter-crossfade`, `scroll-scrub-filmstrip`, `split-stable-copy`, `vertical-chapter-stack` | Kể theo trình tự; pin/scrub phải có document-flow fallback. |
| Photo / video gallery | `editorial-grid`, `contact-sheet`, `coverflow-perspective`, `horizontal-snap`, `masonry-with-feature` | Xem nhanh nhiều media hoặc nhấn khoảnh khắc chủ đạo. Video cần poster, pause và captions khi cần. |
| Featured memory | `full-bleed-with-caption`, `photo-deck`, `image-and-letter`, `foreground-occlusion` | Một khoảnh khắc cần giữ lâu hơn gallery. |
| Wishes / reflection | `featured-plus-list`, `note-wall`, `stacked-notes`, `quote-carousel`, `quiet-editorial` | Chỉ hiển thị lời chúc đã duyệt; dừng khi focus/reduced motion. |
| Thank-you / finale | `closing-letter`, `spatial-farewell`, `signature-photo`, `light-fade-credits`, `minimal-monogram` | Khép story, không mở CTA cạnh tranh. |
| Share / credits | `compact-share-rail`, `inline-share-actions`, `monogram-credits` | Ghép vào finale nếu có thể; không tạo section trống chỉ chứa nút. |

## Quy tắc phối section

- Một signature interaction; các section khác hỗ trợ cùng nhịp chuyển động.
- Recap dài cần tối thiểu ba loại trải nghiệm khác vai trò: story scroll/reveal, gallery interaction, living-state ambient, material/light transition, spatial depth hoặc typography choreography.
- Không đặt hai section tối giản liên tiếp; không quá một phần ba section là composition tĩnh đơn giản.
- Không đặt hơn hai carousel/marquee/horizontal interaction liên tiếp.
- `memory chapters` có entry/exit state, cue đọc và fallback khi chapter bị tắt.
- Gallery có thao tác trước/sau hoặc scroll-snap, trạng thái hiện tại và keyboard path; không hijack vertical scroll trên mobile.
- Finale nối được từ mọi section optional bằng gradient/material/foreground bridge, không hard-code seam theo default order.

## Spatial và motion guardrails

Theme cinematic/spatial dùng tối thiểu hai focal section khác vai trò. Mỗi focal section mô tả `far-background → depth → content-plane → occluder → foreground/atmosphere`; text, mặt và CTA không bị che. DOM/CSS perspective hoặc Motion/GSAP là mặc định; WebGL chỉ khi cần camera/mesh/material/occlusion thật.

Living-state chọn 2–3 motif đúng chủ đề, tối đa hai system trong một viewport và chỉ một system có vật thể chuyển động rõ. Pause khi section/tab ẩn, modal mở hoặc route unmount; reduced motion giữ composition tĩnh hoàn chỉnh.

Mọi layout có desktop, mobile 375px, missing-media, long-content và reduced-motion state. Không được biến fallback thành vùng text trống.
