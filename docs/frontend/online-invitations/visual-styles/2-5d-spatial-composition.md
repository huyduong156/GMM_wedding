# 2.5D và Spatial Composition

## Định nghĩa

2.5D tạo cảm giác không gian bằng nhiều mặt phẳng 2D xếp theo trục Z. Hiệu quả đến từ chồng lớp, tỷ lệ, ánh sáng, occlusion, perspective và chuyển động tương đối; không bắt buộc dùng WebGL hoặc model 3D thật.

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
