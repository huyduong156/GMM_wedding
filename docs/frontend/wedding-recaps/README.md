# Wedding Recap design blueprint

Start with the [product model](./product-model.md); the other catalogs define optional presentation treatments around that model.

## Product purpose (photo-first)

Wedding Recap is a post-wedding memory hub with two equal jobs: a warm, shareable thank-you publication for the couple, and a practical place where guests can revisit the day and find or retrieve photos of themselves. It is simpler than an invitation. Motion and decor support the memories; they must never compete with guest photos or make the page difficult to scan, share, or use on mobile.

The canonical story is:

`opening → thank-you → event chapters → ceremony highlights → closing → full album / photo link`

Event chapters are data-driven and optional: photobooth, fingerprint/signature station, reception, first look, cake cutting, games, dance, or any other real event. Empty chapters are hidden. The final album may be an in-page gallery, a download collection, or an external URL with a clear CTA and graceful missing/private-link state.

The visual style and section catalog below are implementation tools for this product model. A cinematic or 3D treatment is optional and must not displace the photo-finding and album-sharing tasks.

Wedding Recap là publication kể lại ký ức sau ngày cưới: ảnh/video, các chapter cảm xúc, lời chúc đã duyệt và lời cảm ơn. Đây không phải thiệp mời và không phải website cưới kéo dài vô hạn. Mỗi recap cần có một signature moment, một story spine rõ và nhịp xem phù hợp với media.

## Cách dùng

1. Đọc [Theme authoring compliance](../theme-authoring-compliance.md) và hoàn thành docs manifest.
2. Chốt một style lane trong [style và composition catalog](./style-and-composition-catalog.md).
3. Đi qua [section/layout catalog](./section-layout-catalog.md), chọn layout cho từng section và ghi mobile/reduced-motion fallback.
4. Dùng [content và template config contract](./content-and-template-config-contract.md), không tạo schema tùy tiện.
5. Hoàn thành [template authoring checklist](./template-authoring-checklist.md) trước preview/release.

Các section optional phải tắt/reorder được mà không làm gãy story, seam hoặc navigation. Media user là nội dung; theme identity phải tiếp tục nhận ra khi thay ảnh bằng placeholder trung tính.

## Story spine mặc định

`opening → atmosphere/lead → memory chapters → gallery/film → wishes or reflection → thank-you/finale → share/credits`

Có thể bỏ `atmosphere`, `wishes` hoặc `gallery` nếu specification giải thích lý do. `opening`, `memory` và `finale` là nhịp xương sống; không biến mọi section thành hero ảnh toàn màn hình.

## Cấu trúc folder

```text
frontend/src/templates/recaps/<template-key>/
├── <TemplateName>Recap.tsx
├── template-config.ts
├── fixture.ts
├── content.ts
├── <template-key>.css
└── <TemplateName>Recap.test.tsx
```

Renderer, preview và production dùng cùng component; fixture chỉ dành cho preview/test. Strong-subject theme bắt buộc có decor family renderer-owned theo `generate-wedding-decor`.
