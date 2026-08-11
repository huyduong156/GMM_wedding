# Checklist tạo template website cưới

## Trước khi code

- Chốt key kebab-case, display name, SemVer và art direction.
- Chọn layout, mobile/reduced-motion fallback cho mọi section.
- Chọn đúng một focal interaction; ghi performance budget và missing-media composition.
- Xác nhận asset/license và font có Vietnamese subset.

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
- Section tắt rời DOM; order không phá anchor; navigation sinh từ section bật.
- URL được validate; RSVP/lời chúc dùng adapter, không hard-code endpoint.
- Countdown dùng timestamp/timezone; nhạc có control và autoplay fallback.
- Form sinh từ config/schema; theme option chỉ hiện khi renderer có implementation.
- Focus field cuộn đúng section; iframe không reload theo input.
- Có dirty state, manual save, leave warning, revision conflict và tự mở card/tab validate lỗi đầu tiên.

## Accessibility/performance

- Keyboard dùng được navigation, gallery/lightbox, accordion, RSVP, audio.
- Focus visible, dialog trap/restore, Escape hợp lý, contrast AA.
- Không overflow ở 375px; test 768px, 1280px và màn rộng.
- Reduced motion bỏ parallax/scrub/auto-pan nhưng giữ content/countdown.
- Lazy-load media, ảnh có dimensions, video có poster; tối đa một canvas/WebGL và dừng RAF khi hidden.

## Test/release gate

- Config có integer versions, `previewPath`, capabilities, defaults, sections và field constraints.
- Fixture không PII; test long text, missing media, multiple events và section off.
- Test schema, normalize section, countdown, URL validation, reduced motion.
- Test editor handshake/update/scroll, validation, dirty/manual save.
- Test save → preview → publish → public snapshot → unpublish.
- Test admin sync → pending → preview → release → user catalog → deprecate.
- Breaking schema/config tăng version và có migration deterministic.

Template chỉ hoàn thành khi config, fixture, renderer, preview route, editor schema, tests và release bundle cùng tồn tại. Demo hard-code dữ liệu hoặc thiếu fallback/publication flow chưa được xem là template hoàn chỉnh.

