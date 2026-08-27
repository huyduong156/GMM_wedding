# Red Spider Lily Recap — Phase 1 Authoring Artifact

Last updated: 2026-08-26

Template key: `red-spider-lily-recap`
Renderer path: `frontend/src/templates/recaps/red-spider-lily/`
Preview path: `/templates/recaps/red-spider-lily/preview`
Product type: `WEDDING_RECAP`
Phase status: Phase 1 complete; Phase 2 remains a separate media-contract gate.

Preview rule: the theme preview must render all six required and all six optional sections so the owner can evaluate the complete design capability. Optional toggles apply to published recap/editor content after the theme is selected, not to the theme showcase preview.

## Theme Brief

`Dấu Son Bỉ Ngạn` là Wedding Recap dạng editorial album sau ngày cưới. Theme dùng hình tượng hoa bỉ ngạn đỏ như một sợi chỉ ký ức chạy qua từng chương: không kể lại lễ cưới như một website thông tin, mà gom các khoảnh khắc đã xảy ra thành một album cảm xúc để khách quay lại xem, nhớ và nhận album ảnh.

Viewer chính là khách mời sau đám cưới. Họ mở recap để nhận ra mình đã có mặt trong ngày hôm đó, xem lại câu chuyện của cặp đôi, tìm album ảnh và đọc lời cảm ơn. Owner chính là cặp đôi, cần một theme đủ sang, đủ cảm xúc, nhưng vẫn dễ thay ảnh, thay lời kể và không lệ thuộc vào ảnh mẫu.

Art direction: botanical editorial, vermilion paper, ink ivory, grain nhẹ, khung hoa bỉ ngạn, divider dạng cành mảnh, cảm giác như một album giấy được mở lại sau ngày cưới.

Signature moment ở Phase 1: một red-spider-lily thread nối các chương ký ức. Thread này là renderer-owned identity, không phụ thuộc ảnh upload.

## Product Meaning Statement

Wedding Recap là sản phẩm sau ngày cưới để lưu giữ, kể lại và trả ảnh; không phải thiệp mời và không phải website cưới trước sự kiện. `Dấu Son Bỉ Ngạn` phải giúp viewer đi từ nhận diện ngày cưới, cảm xúc chung, chuỗi chapter, nhóm khoảnh khắc, điểm tải/xem ảnh, rồi kết bằng lời cảm ơn.

Theme thành công khi thay toàn bộ ảnh user bằng ảnh trung tính hoặc bỏ trống media mà viewer vẫn nhận ra đây là một recap cưới botanical-red-spider-lily nhờ palette, typography, ornament, divider, texture và cấu trúc kể chuyện.

## Viewer Journey

1. Viewer mở `hero`, nhận ra cặp đôi, ngày cưới và lời mời xem lại album.
2. Viewer đọc `ourStory`, hiểu tông cảm xúc và lý do recap tồn tại.
3. Viewer đi qua `chapters`, xem các mốc theo trình tự thời gian.
4. Viewer xem `moments`, tìm các nhóm khoảnh khắc quen thuộc như bạn bè, gia đình, photobooth, tiệc tối.
5. Viewer tới `photoDelivery`, biết cách xem hoặc tải album đầy đủ qua internal album hoặc external album link.
6. Viewer kết ở `thankYou`, nhận lời cảm ơn và cảm giác khép album.

Optional journey khi owner bật thêm section: guestbook làm phần hồi âm, peopleBehindTheDay ghi nhận những người quan trọng, weddingFilm/soundtrack tăng lớp ký ức nghe-nhìn, behindTheScenes mở hậu trường, memoryCapsule nối sang chương tương lai.

## Difference From Other Product Types

Invitation khác recap vì invitation hướng đến hành động trước lễ cưới: mở thiệp, nắm lịch, địa điểm, RSVP. `Dấu Son Bỉ Ngạn` không có countdown, RSVP, dress code hoặc venue info bắt buộc.

Wedding Website khác recap vì website cưới là hub công khai trước và trong sự kiện: story, lịch trình, travel, FAQ, RSVP, guestbook. Recap là album sau sự kiện, ưu tiên ảnh/video, lời cảm ơn và photo delivery.

Recap không nên dùng giọng marketing hoặc landing page. CTA chính là xem album/xem kỷ niệm, không phải đăng ký/tham dự.

## Required Sections

| Section | Role in Story | Content Anchor | Editable Content | Repeat / Toggle / Reorder | Empty/Fallback |
|---|---|---|---|---|---|
| `hero` | Cover album, xác nhận đúng recap | Couple, date, place, tagline, CTA | Couple, date, place, tagline, CTA, hero media | Required, no toggle, no repeat, no reorder | Neutral placeholder giữ palette và CTA |
| `ourStory` | Lời dẫn cảm xúc | Eyebrow, title, body, optional quote | Eyebrow, title, body, quote, story media | Required, no toggle, no repeat, reorder allowed after hero only if config supports | Text-first layout khi thiếu ảnh |
| `chapters` | Timeline ký ức | Date label, title, description, cover, album CTA | Add/edit/remove chapter within item limits | Required, repeatable, reorder items, section can reorder within middle flow | Placeholder cover, giữ date/title/body |
| `moments` | Nhóm khoảnh khắc theo chủ đề | Moment title, description, cover, album CTA | Add/edit/remove moment within item limits | Required, repeatable, reorder items, section can reorder within middle flow | One-column text-first cards khi thiếu cover |
| `photoDelivery` | Chức năng trả ảnh | Eyebrow, title, body, CTA, album source | CTA, copy, internal album refs, external links | Required, no toggle, album list repeatable | Show unavailable/empty album message, keep copy visible |
| `thankYou` | Closing album | Title, body, signature, date, finale media | Title, body, signature, date, media | Required, no toggle, no repeat, no reorder after close | Text-first closing if media missing |

## Optional Sections

In this table, `Off` describes the default published-content/editor state, not the theme preview. The preview fixture enables every optional section so all supported compositions are visible before the owner chooses which sections to keep.

| Section | Role | Default | Editable Content | Empty/Fallback |
|---|---|---:|---|---|
| `guestbook` | Lời chúc đã duyệt được owner chọn | Preview on; publish toggle | Title, intro, selected wishes, optional media | Wish wall; keep approved wishes when media is empty |
| `peopleBehindTheDay` | Gia đình, bạn bè, team hỗ trợ | Preview on; publish toggle | People list, role, notes, portrait media | Portrait grid collapses to text-first list |
| `weddingFilm` | Highlight video hoặc external video | Preview on; publish toggle | Video source, poster, duration, title, body | Poster/play affordance without autoplay |
| `soundtrack` | Nhạc nền hoặc playlist ký ức | Preview on; publish toggle | Track, artist, duration, cover | Player remains usable without cover |
| `behindTheScenes` | Chuẩn bị và hậu trường | Preview on; publish toggle | Item list, captions, media | Staggered contact sheet becomes ordered list |
| `memoryCapsule` | Lời nhắn cho chương sau | Preview on; publish toggle | Title, body, date/label, optional media | Letter remains readable without media |

## Section Content Matrix

| Section | Heading Strategy | CTA Strategy | Metadata | Quote / Long Copy Rule | Layout Intent |
|---|---|---|---|---|---|
| `hero` | Large couple name, short Vietnamese tagline | `Mở album` scrolls into story/album flow | Date and optional place | One tagline only | Cinematic cover with botanical thread |
| `ourStory` | Emotional title, not generic "Our Story" only | No primary CTA unless linking to chapter | Optional eyebrow | One short quote max | Editorial text + supporting image |
| `chapters` | Each item has own title and date label | Optional `Xem kỷ niệm` per chapter | Date label per chapter | Description short, no essay | Vertical editorial timeline |
| `moments` | Thematic group titles | Optional album link per moment | Optional group number | Description short and scannable | Asymmetric moment grid |
| `photoDelivery` | Functional but warm title | Primary `Xem & tải ảnh` | Album labels/source | Body explains album access | Album portal / CTA block |
| `thankYou` | Closing title | No competing CTA except back/top/share outside section | Signature/date | Short thank-you body | Album back cover / finale |
| Optional sections | Title must name purpose | CTA only when useful | Depends on section | Copy short; avoid filler | Valid standalone insert between required sections |

## Content Fixture Plan

Fixture content must use realistic Vietnamese wedding recap copy, not lorem ipsum and not unlicensed couple imagery. Current fixture may keep media empty to prove placeholders and text-first fallback.

Minimum fixture set:

- `hero`: couple, date, place, tagline and CTA.
- `ourStory`: eyebrow, title, body, one optional quote, zero or more story media.
- `chapters`: at least three items: engagement/pre-wedding, ceremony/family moment, reception/celebration.
- `moments`: at least three thematic groups, for example photobooth, friends/family, celebration.
- `photoDelivery`: title/body/CTA with empty albums allowed for fallback state.
- `thankYou`: title/body/signature/date and optional media.
- `optional`: all six optional sections present in content schema and enabled in the theme preview fixture. Published recap content may disable each section independently after theme selection.

Fixture copy must avoid real PII, real guest names, real external album URLs and hard-coded sample model/couple media.

## Editor Field Plan

The editor should read section existence, required/toggle/reorder behavior and field capabilities from `template-config.ts`, not hard-code a recap-specific section list.

| Field Group | Owner Can Edit | Notes |
|---|---|---|
| Global recap metadata | Title, OG title/description/image, publish/share state | Belongs to recap draft, not visual identity |
| `hero` | Couple, date, place, tagline, CTA label, media/focal point | Media optional; theme identity must remain without it |
| `ourStory` | Eyebrow, title, body, quote, media list | Body length guard needed |
| `chapters` | Add/remove/reorder items; date label, title, description, cover, album source | Item count guard to protect layout |
| `moments` | Add/remove/reorder items; title, description, cover, album source | Item count guard and responsive fallback |
| `photoDelivery` | Eyebrow, title, body, CTA label, album list | Album source supports internal and external modes |
| `thankYou` | Title, body, signature, date, media | Finale must remain readable without media |
| Optional sections | Enable/disable, title/body, section-specific fields | Rendered in full theme preview; removed from published DOM when owner turns one off |
| Theme controls | Palette, motion level, gallery style if exposed | Only values declared by template |

Repeatable content rules:

- `peopleBehindTheDay` is a repeatable person/card collection. The owner can add, remove and reorder cards; each card has a cover image and a variable-size `gallery` for that person/group's moments.
- `behindTheScenes` is a repeatable preparation/moment collection. The owner can add, remove and reorder cards; each card has a cover image and a variable-size `gallery`.
- Both collections expose `Xem khoanh khac` in the public renderer. The action opens the selected item's gallery in a lightbox; it is not a single fixed image field.

## Language And Copy Rules

Primary language is Vietnamese. The theme may use English microcopy only for established wedding/album vocabulary or short labels, with a maximum of three English quote/tagline-like lines across the whole template. Do not split long Vietnamese paragraphs into per-character kinetic text.

Copy should be warm, restrained and post-wedding. Avoid invitation language such as "trân trọng kính mời", RSVP prompts, countdown urgency or venue logistics.

## Non-Goals

- No RSVP, attendance confirmation, dress code, countdown, gift registry or event logistics.
- No platform marketing copy inside the public recap.
- No public exposure of guest IDs, contact data, moderation metadata or private media not selected for publication.
- No dependency on sample couple/model images for theme identity.
- No forced external album provider branding.
- No autoplay audio/video.
- No decorative image that is actually required content.

## Anti-Patterns

- Reusing old section keys like `opening`, `filmstrip`, `quote`, `finale`.
- Making `chapters` and `moments` the same visual/content pattern.
- Hiding `photoDelivery` as a tiny footer CTA.
- Hard-coding five sections in owner editor while template config declares six.
- Using a fixed sample photo as the only theme background.
- Letting optional sections leave empty gaps or orphan dividers when disabled.
- Turning the recap into a long wedding website clone.

## Phase 1 Acceptance Checklist

- [x] Product type, product meaning, viewer job, audience, non-goals and experience arc are documented.
- [x] Theme, visual metaphor, emotion, palette, typography, material, decor direction, motion direction and signature moment are documented.
- [x] Differences from invitation and wedding website are documented.
- [x] Required and optional section lists are documented with roles.
- [x] Content anchor, heading, description, quote, CTA, metadata, empty state and fallback expectations are documented per section.
- [x] User-editable content, toggle, reorder and repeatable behavior are documented.
- [x] Primary language and English quote/tagline limit are documented.
- [x] Content fixture plan is documented.
- [x] Editor field plan is documented.
- [x] Non-goals and anti-patterns are documented.

Phase 1 is complete when this artifact, `template-config.ts`, `content.ts` and the renderer section keys agree.
