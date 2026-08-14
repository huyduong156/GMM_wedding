# 2.5D và Spatial Composition

## Định nghĩa

2.5D tạo cảm giác không gian bằng nhiều mặt phẳng 2D xếp theo trục Z. Hiệu quả đến từ chồng lớp, tỷ lệ, ánh sáng, occlusion, perspective và chuyển động tương đối; không bắt buộc dùng WebGL hoặc model 3D thật.

## Release gate: theme world, story spine và chiều sâu

2.5D không phải một lớp trang trí thêm sau khi section đã hoàn thành. Nó là cách dựng “thế giới” của theme để nội dung và media user cùng tồn tại bên trong một art direction thống nhất.

- Trước khi thiết kế section, viết một `theme thesis` một câu và một `story spine` từ opening → giới thiệu → câu chuyện → nghi lễ/sự kiện → kỷ niệm → RSVP/closing. Mỗi section phải đóng vai một chapter có đầu vào, nội dung chính và cầu nối sang chapter kế tiếp.
- Lập `section-theme matrix`. Với từng section, chỉ ra tối thiểu ba dấu hiệu renderer-owned chứng minh section thuộc theme mà không cần media user: palette/light, typography/material, spatial frame/ornament, texture, environmental layer, transition motif hoặc motion behavior.
- Thay toàn bộ ảnh user bằng khối trung tính và test lại. Nếu section trở thành card/layout chung có thể đặt vào bất kỳ theme nào, section thất bại dù hero vẫn đúng chủ đề.
- Duy trì motif có tiến triển thay vì copy-paste: một vật liệu, ánh sáng, hình khối hoặc botanical language quay lại dưới vai trò mới để tạo continuity. Không lặp nguyên một composition ở nhiều chapter.

## Layer stack bắt buộc cho spatial focal section

Theme có art direction 3D mạnh (`medium`/`high`, cinematic, fantasy, diorama, spatial-first) phải có ít nhất hai `spatial focal section` khác vai trò; một trong hai nên nằm ở opening/hero và một nằm ở story, gallery, event hoặc closing. Theme `none`/`light`, editorial, minimal hoặc typography-first không bắt buộc có spatial focal section; nếu chọn dùng thì vẫn phải tuân thủ scene graph. Mỗi focal section mô tả:

1. `far-background`: thế giới phía xa—rừng sâu, trời, glasshouse, paper field, ballroom hoặc gradient atmosphere;
2. `background-depth`: silhouette/texture/light layer tạo chiều sâu phía sau nội dung;
3. `content-plane`: tên cô dâu chú rể, copy, ảnh hoặc CTA có hierarchy rõ;
4. `midground-occluder`: một lớp đi qua một phần content frame để chứng minh quan hệ trước–sau nhưng không che khả năng đọc;
5. `foreground-frame`: tán cây, hoa, rèm, ribbon, cánh cửa hoặc vật thể crop khỏi viewport, gần camera nhất;
6. `atmosphere`: sương, bụi sáng, petal, shadow/light drift hoặc particle thưa;
7. `interaction-plane`: pointer/scroll/camera response có biên độ khác nhau theo độ sâu.

Ví dụ section rừng: dùng rừng xa làm `far-background`; haze và thân cây mờ làm `background-depth`; tên cặp đôi ở `content-plane`; một nhánh/tán nhỏ đi trước một phần khung tên ở `midground`; tán cây lớn crop hai mép viewport ở `foreground`; bụi sáng/sương ở `atmosphere`. Người dùng có cảm giác nhìn xuyên qua tán cây tới tên và khu rừng phía sau, thay vì nhìn một ảnh rừng phẳng có chữ đặt lên trên.

Không yêu cầu đủ bảy layer nếu art direction tối giản, nhưng spatial focal section phải có ít nhất bốn mặt phẳng nhìn thấy rõ: background, content, một occluder và foreground/atmosphere. Nếu bỏ layer, specification phải ghi lý do và cách khác tạo depth.

Theme không dùng 3D vẫn phải đạt `experience diversity gate`: chọn ít nhất ba loại trải nghiệm khác vai trò trong các nhóm scroll storytelling/reveal choreography, gallery interaction, living-state ambient motion, material/light transition, typography motion, responsive microinteraction hoặc spatial depth nhẹ. Không thêm 3D chỉ để đủ số lượng và không dùng một hiệu ứng lặp cho mọi section.

Không dùng “không cần 3D” làm lý do để tạo section phẳng và trống. Theme none/light vẫn cần composition có cấu trúc như sticky split, editorial collage, scroll-synced media, framed content surface, controlled background carousel hoặc typography/material system giàu chi tiết. Mỗi section cần một primary composition và một supporting layer; background + text đơn thuần chỉ hợp lệ như nhịp nghỉ hiếm, có chủ đích.

## Occlusion và khả năng đọc

- Cho foreground/midground che nhẹ khung hoặc khoảng trống quanh content; không che nét chữ quan trọng, CTA, focus ring hay khuôn mặt.
- Tạo depth bằng scale, blur rất nhẹ/baked, contrast, shadow, light direction và tốc độ parallax tương đối; không chỉ tăng `z-index`.
- Giữ cùng camera/light logic trong một chapter. Asset tiền cảnh không được có hướng sáng ngược với background.
- Trên mobile, giảm số layer nhưng giữ ít nhất background → content → foreground để ảo giác không gian còn nguyên. Không đơn giản hóa thành một ảnh nền phẳng nếu section là signature.
- Reduced motion tắt parallax/camera nhưng giữ occlusion và layer stack tĩnh hoàn chỉnh.

## Chọn renderer

- Dùng DOM/CSS `position`, `overflow`, `perspective`, `transform`, `translate3d`, Motion hoặc GSAP cho các plane ảnh/SVG, paper theatre, botanical foreground, photo stack và parallax. Đây là mặc định cho layered wedding scenes.
- Dùng CSS 3D/Motion cho card tilt, carousel/slide có perspective và số layer hữu hạn; giữ semantic content trong DOM.
- Chỉ dùng Three.js khi cần camera perspective thật, mesh/glTF, lighting/material, occlusion 3D, shader hoặc hàng trăm phần tử trong một scene graph. Không thêm WebGL chỉ để đặt ba PNG ở ba tốc độ khác nhau.
- Mỗi page tối đa một WebGL scene active mặc định; lazy-load, cap DPR, pause ngoài viewport/tab ẩn, dispose toàn bộ resource và có poster/DOM fallback.

## Spatial acceptance test

- Tắt user media: theme, chapter và depth vẫn nhận diện rõ.
- Tắt motion: quan hệ trước–sau vẫn đọc được từ occlusion, scale, light và composition.
- Chụp tại 375px, 768px và desktop: không mất foreground quan trọng, không che content và không lộ mép asset.
- Di chuyển pointer/scroll chậm: các layer phản ứng theo depth, không trượt cùng tốc độ như một ảnh phẳng.
- Tắt từng optional section: story spine và seam tự nối lại, không để motif hoặc foreground bị cụt.

## Mức độ áp dụng

| Mức | Phù hợp | Kỹ thuật |
|---|---|---|
| None | minimal, typography-first | mặt phẳng, grid, transition opacity |
| Light | botanical, watercolor, classic | foreground decor, shadow mềm, 2 lớp parallax rất ngắn |
| Medium | editorial, modern luxe, storybook | 3–5 lớp, photo stack, perspective card, z-axis reveal |
| High | cinematic, fantasy, 3D-first | paper theatre, spatial gallery, depth lighting, pointer parallax có giới hạn |

## Pattern catalog

```yaml
name: Layered Paper Theatre
category: 2.5d composition
mood: couture, ceremonial, tactile
depth: medium-high
layers: backdrop, paper frame, photo subject, vellum copy, metallic foreground
trigger: entrance or short pointer movement
mobile: collapse to three static planes
avoid:
  - more than 6 simultaneously moving planes
  - text on a strongly tilted plane
  - shadows without a shared light direction
implementation_hint: CSS perspective with translateZ and restrained rotateX/rotateY
fallback: ordered paper collage with static shadows
```

```yaml
name: Parallax Layer Stack
category: spatial motion
mood: cinematic, immersive
depth: light-medium
layers: far atmosphere, image, frame, foreground ornament
trigger: short scroll range or fine pointer
mobile: static or maximum 4px travel
avoid:
  - moving body copy
  - large background panning
  - gyroscope by default
implementation_hint: map one normalized input to 2px, 5px and 9px transform ranges
fallback: layered static composition
```

```yaml
name: Z-Axis Invitation Reveal
category: entrance
mood: surprising, premium
depth: medium
layers: cover, seal, inner card, hero
trigger: open invitation
mobile: scale and opacity without deep perspective
avoid:
  - content flying through the camera
  - duration longer than 1.4s
implementation_hint: preserve-3d stage; inner card advances while cover recedes
fallback: crossfade with matched geometry
```

```yaml
name: Floating Photo Deck
category: gallery
mood: editorial, collectible
depth: medium
layers: active photograph, previous card, next card, caption plate
trigger: gallery navigation
mobile: shallow stack with visible controls
avoid:
  - vertical swipe hijacking
  - inaccessible overlapping buttons
implementation_hint: active card at z0; side cards use scale, translate and rotate with pointer-events disabled
fallback: cross-dissolve slideshow
```

```yaml
name: Vellum Information Plane
category: content surface
mood: refined, soft, tactile
depth: light
layers: background photograph, translucent sheet, typography, embossed rule
trigger: static or entrance once
mobile: increase opacity for contrast
avoid:
  - low contrast over detailed imagery
  - backdrop-filter as the only fallback
implementation_hint: translucent color, inner highlight and hard-edged paper shadow
fallback: opaque paper card
```

```yaml
name: Depth Lighting Pass
category: cinematic lighting
mood: luminous, luxurious
depth: light-medium
layers: ambient shadow, rim light, reflection plane
trigger: once or very slow automatic
mobile: baked gradient
avoid:
  - animated heavy blur
  - multiple conflicting light directions
implementation_hint: translate a composited gradient across foreground surfaces only
fallback: static rim-light gradient
```

```yaml
name: Foreground Occlusion Frame
category: framing
mood: immersive, photographic
depth: light-medium
layers: subject photo and partial foreground frame
trigger: static
mobile: reduce frame coverage
avoid:
  - covering faces, names or CTA
  - symmetrical decoration around every section
implementation_hint: crop one or two decorative planes beyond the container edge
fallback: inset border
```

```yaml
name: Spatial Typography Lockup
category: typography
mood: fashion editorial, dramatic
depth: medium
layers: large display name, script accent, date plate, photo plane
trigger: hero entrance
mobile: flatten overlap while preserving reading order
avoid:
  - decorative text becoming unreadable
  - changing DOM order to achieve visual overlap
implementation_hint: semantic text order plus absolute visual positioning at large breakpoints
fallback: vertical typographic lockup
```

## Guardrail kỹ thuật

- Một viewport chỉ nên có một depth focal point; các section kế tiếp phải cho mắt nghỉ.
- Dùng `perspective` trên stage, không đặt perspective khác nhau tùy tiện trên từng child.
- Ưu tiên `transform`/`opacity`; shadow và blur chỉ tĩnh hoặc thay đổi rất ít.
- Pointer parallax chỉ dành cho `pointer: fine`; touch dùng composition tĩnh.
- Giới hạn góc tilt khoảng 1–4°, travel 2–12px và không transform input/form/map.
- `prefers-reduced-motion` loại bỏ translateZ/parallax/tilt nhưng giữ thứ tự lớp, border và shadow tĩnh.
- Kiểm tra clipping, stacking context, focus ring và text contrast ở cả ba palette.
