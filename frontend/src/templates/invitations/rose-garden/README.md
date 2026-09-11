# Rose Garden Invitation

## Phase 0 preview shell

Preview URL: `/templates/invitations/rose-garden/preview`

The first implementation intentionally contains only the spatial foundation. `.rg-page` owns the full viewport background, while `.rg-invitation` owns the mobile invitation and is capped at 480px. All invitation decor is clipped by that container. Desktop gutter effects are atmosphere-only and contain no critical content or renderer-owned botanical artwork.

## Phase 1 brief

Rose Garden là một thiệp cưới mobile-first mang cảm giác khu vườn hồng được ép trên giấy thủ công: lãng mạn, riêng tư và có chiều sâu thị giác. Đây là một tấm thiệp tương tác dành cho khách mời, không phải một wedding website dạng desktop.

### Product meaning

Khách mời có cảm giác đang mở một tấm thiệp hoa thật. Sau opening, họ nhanh chóng nắm được lời báo hỷ, hai bên gia đình, ngày giờ, địa điểm và các hành động RSVP, xem bản đồ, gửi lời chúc và xem QR mừng cưới.

### Design read

Mobile invitation cho khách mời Việt Nam, với ngôn ngữ editorial botanical couture, chất liệu giấy ép hoa, typography lãng mạn nhưng hiện đại và chuyển động nhẹ như ánh sáng trong khu vườn.

### Design dials

- `DESIGN_VARIANCE`: 8. Mỗi section có một composition riêng, tránh lặp card/grid.
- `MOTION_INTENSITY`: 5. Opening là signature moment; các section còn lại dùng reveal, drift và micro-interaction có chủ đích.
- `VISUAL_DENSITY`: 4. Nhiều khoảng thở, nội dung dễ quét trên mobile.

## Spatial contract

- `.rg-page` phủ toàn viewport và chịu trách nhiệm background desktop.
- `.rg-invitation` là vùng thiệp duy nhất, `width: min(100%, 480px)`.
- Mọi botanical decor thuộc `.rg-invitation`, không được đặt ở viewport layer.
- `.rg-invitation` luôn `overflow: hidden`; decor bị cắt trong vùng 480px.
- Trên màn hình lớn hơn 480px, phần dư chỉ có nền, glow và hạt sáng nhẹ.
- Dưới hoặc bằng 480px, background desktop bị ẩn và thiệp chiếm toàn bộ viewport.
- Không để bất kỳ decor nào làm tăng scroll width hoặc che CTA/content.

## Art direction

- Base: blush paper, dusty rose, muted mauve và rosewood ink.
- Accent: một rose accent thống nhất, không dùng nhiều màu nổi cạnh tranh.
- Material: giấy ép hoa, dấu sáp, ribbon mảnh, botanical engraving, kính mờ nhẹ.
- Typography: display serif cho tên và tiêu đề, sans dễ đọc cho nội dung, script chỉ dùng cho ampersand/chữ ký ngắn.
- Decor: rose branch, petal, seal, pressed-flower divider và soft light grain.
- Không dùng ảnh couple mẫu làm nguồn nhận diện duy nhất của theme.

## Section composition map

| Section | Composition | Signature purpose |
| --- | --- | --- |
| Opening | Layered mobile invitation card | Nghi thức mở thiệp, rose seal và ánh sáng dịu |
| Cover | Editorial portrait with botanical frame | Giới thiệu cặp đôi, giữ hierarchy rõ |
| Invitation | Letter sheet with pressed-flower divider | Lời báo hỷ và lời mời chính |
| Families | Symmetric garden arch | Hai bên gia đình là nội dung trung tâm |
| Event details | Pressed-paper calendar | Ngày, nghi lễ và nút thêm lịch |
| Love journey | Horizontal rose timeline | Kể hành trình bằng nhịp chuyển ngắn |
| Venue | Map card with botanical marker | Địa điểm và CTA chỉ đường |
| Gallery | Floating photo frames | Album có nhịp editorial, không phải grid đều |
| RSVP | Response card | Xác nhận tham dự, guestName và trạng thái khóa form |
| Guestbook | Rose note stack | Lời chúc đã duyệt và form gửi lời chúc |
| Gift | QR reveal card | QR ẩn sau nút, lời cảm ơn nằm dưới QR |
| Footer | Closing garden composition | Lời cảm ơn và closure nhẹ |

## Content/editor contract

- Tên cô dâu, chú rể, ngày, nội dung lời mời, gia đình, lịch trình, địa điểm, album, RSVP, guestbook, QR và nhạc nền đều phải đi qua config/content contract.
- Default data phải được hiển thị trong editor lần đầu và được lưu vào database khi user lưu.
- Chuỗi rỗng sau khi user chủ động xóa phải được tôn trọng; không fallback lại trong renderer.
- GuestName được lấy từ public guest context. Khi có guestName, ẩn input tên trong RSVP và guestbook.
- RSVP và guestbook phải khóa sau khi submit thành công.
- Optional section bị tắt phải biến mất hoàn toàn, không để lại khoảng trống bất thường.

## Motion direction

- Opening: layered card reveal, 700–1000ms, ease-out, có reduced-motion fallback.
- Desktop backdrop: glow và khoảng 20 hạt sáng nhỏ, chỉ để tạo atmosphere.
- Section reveal: opacity + translate nhỏ, stagger theo phần tử con.
- Decor: drift nhẹ trong vùng thiệp, không chạy theo toàn viewport.
- Gallery: một interaction chính, không thêm nhiều carousel cạnh tranh.
- Reduced motion: giữ decor tĩnh, tắt particle/drift/parallax và giữ nguyên hierarchy.

## Phase 1 acceptance checklist

- [ ] Thiệp được nhận diện là Rose Garden ngay cả khi thay toàn bộ ảnh user upload.
- [ ] Vùng nội dung không vượt quá 480px trên desktop.
- [ ] Decor không tràn khỏi `.rg-invitation`.
- [ ] Mỗi section có composition riêng và không lặp một layout quá ba lần.
- [ ] Nội dung tiếng Việt là primary; English chỉ dùng làm accent ngắn.
- [ ] Có đủ required/optional section theo invitation contract.
- [ ] Editor field, default data và renderer dùng cùng content key.
- [ ] Có mobile, desktop gutter và reduced-motion behavior rõ ràng.
- [ ] Có ít nhất một signature opening trước khi thêm các motion phụ.

The full Phase 0–2 authoring plan, content matrix and media schema are kept in this file so the template has one source of truth.

## Phase 1 content matrix

Canonical naming rule: `timeline` is the only section key for the rose journey. The same key must be used by `template-config.ts`, fixture, editor and renderer; do not introduce `loveJourney` as a second section key.

| Section key | Required | Content anchor | Editable content | Default/empty rule | Toggle/reorder |
| --- | --- | --- | --- | --- | --- |
| `opening` | Yes | Mở thiệp, tên đôi, ngày | Names, date, opening media | Defaults appear in editor and save on first save | Fixed first |
| `cover` | Yes | Tên đôi và lời mời ngắn | Eyebrow, title, message, hero media | Text remains; neutral hero fallback | Fixed |
| `invitation` | Yes | Lời báo hỷ và lời mời chính | Title, message, three fixed memory slots | Missing images remove only image layer | Fixed |
| `families` | Yes | Hai bên gia đình | Parent fields, family title/subtitle | Empty optional address hides only address line | Fixed |
| `eventDetails` | Yes | Ngày hôn lễ và thêm lịch | Date, calendar URL, optional media | Date remains; media falls back | Fixed |
| `countdown` | Optional | Đếm ngược ngày vui | Derived from wedding date | Hides when disabled | Toggle/reorder |
| `timeline` | Optional | Lịch trình trong ngày | Repeatable timeline items | Empty list hides the list | Toggle/reorder |
| `venue` | Optional | Địa điểm và chỉ đường | Venue name, address, map URL | Address remains; CTA hides without URL | Toggle/reorder |
| `gallery` | Optional | Album ảnh | Gallery images and style | Designed empty state, max 12 | Toggle/reorder |
| `rsvp` | Optional | Xác nhận tham dự | Deadline, message, guestName-aware form | Missing name shows validation | Toggle/reorder |
| `guestbook` | Optional | Lời chúc đã duyệt | API list and guestName-aware submit | Approved-list empty state | Toggle/reorder |
| `gift` | Optional | QR mừng cưới | QR, gift message, thank-you message | QR opens from button; thank-you below QR | Toggle/reorder |
| `music` | Optional | Nhạc nền | URL, name, autoplay | Shared player; hidden without track | Toggle, fixed order |
| `footer` | Yes | Lời cảm ơn/closure | Footer message and optional media | Text-only botanical closure | Fixed last |

### Fixture and persistence plan

The section composition label “Love journey” refers to the canonical `timeline` section. The media field must therefore be `timeline.items[].image`, not `loveJourney[].image`.

Rose Garden must have its own fixture. It must not reuse Modern Luxe, Verdant Promise or another template fixture. The fixture contains safe Vietnamese values for required fields, three timeline examples, empty gallery slots, RSVP/guestbook copy, gift QR contract and music defaults.

Template defaults seed a new or empty editor record and are saved on first save. A missing key on a legacy record may be hydrated from `defaultData`; an explicit empty string must remain empty. Optional content must hide or show its designed empty state without leaving orphaned labels or gaps.

### Phase 1 acceptance

- Rose Garden remains recognizable with neutral replacement photos.
- Content never exceeds 480px on desktop.
- Decor never escapes `.rg-invitation`.
- No layout family repeats more than three times.
- Vietnamese content is primary; English is short accent copy only.
- Editor fields, defaults and renderer use the same keys.
- Required/optional toggles, guestName, RSVP, guestbook and empty states are defined.

## Phase 2 media contract

### Canonical field mapping

The section matrix is paired with this field map so editor, fixture and renderer cannot drift:

| Section | Canonical content keys | Editor/default rule | Empty state / CTA |
| --- | --- | --- | --- |
| `opening` | `couple.brideName`, `couple.groomName`, `event.weddingDate`, `opening.title`, `opening.message`, `openingMediaBack`, `openingMediaFront` | Seed defaults in editor and save them on first save | Couple/date remain; opening CTA opens invitation |
| `cover` | `cover.eyebrow`, `cover.title`, `cover.message`, `heroMedia` | Text fields plus one image field | Neutral hero fallback; text remains |
| `invitation` | `invitation.title`, `invitation.message`, `invitationMemoryImage1`, `invitationMemoryImage2`, `invitationMemoryImage3` | Three independent image fields | Missing image removes only its image layer |
| `families` | `families.title`, `families.subtitle`, `families.brideSide`, `families.groomSide`, `families.message` | Family text groups with editable defaults | Empty optional address hides only its line |
| `eventDetails` | `eventDetails.title`, `eventDetails.date`, `eventDetails.time`, `eventDetails.calendarUrl`, `eventDetails.message`, `eventDetailsMedia` | Text/date/time/URL fields plus optional image | Calendar CTA hides without URL; date/time remain |
| `countdown` | `countdown.enabled`, derived `event.weddingDate` | Toggle plus derived value | Hidden when disabled or date is invalid |
| `timeline` | `timeline.items[].time`, `timeline.items[].title`, `timeline.items[].description`, `timeline.items[].image` | Repeatable items; fixture contains three examples | Empty list hides content and heading |
| `venue` | `venue.title`, `venue.name`, `venue.address`, `venue.mapUrl`, `venue.message` | Text fields plus map URL | Address remains; map CTA hides without URL |
| `gallery` | `gallery.title`, `gallery.message`, `galleryImages` | Repeatable images, max 12 | Designed empty state; no broken frame |
| `rsvp` | `rsvp.title`, `rsvp.message`, `rsvp.deadline`, `rsvp.successMessage`, `rsvp.attendingLabel`, `rsvp.notAttendingLabel` | Shared RSVP form; guestName from public context | Missing name validates; success locks form |
| `guestbook` | `guestbook.title`, `guestbook.message`, `guestbook.successMessage` | Shared approved-list/form component | Approved-list empty state; success locks form |
| `gift` | `gift.title`, `gift.message`, `gift.thankYouMessage`, `giftQrMedia` | QR image field plus text fields | QR opens from button; thank-you only when non-empty |
| `music` | Shared music capability keys | Shared music editor/player only | Hidden without track; no duplicate player |
| `footer` | `footer.title`, `footer.message`, `footerMedia` | Text fields plus optional image | Text-only botanical closure |

### Ownership and section media

| Section | Key/role | Owner | Count | Crop/value | Fallback |
| --- | --- | --- | --- | --- | --- |
| Opening | `openingMediaBack` / opening-back | User | 0–1 | Portrait, `cover`, focal center | Fixed opening inner-card artwork |
| Opening | `openingMediaFront` / opening-front | User | 0–1 | Portrait, `contain` or mask | Fixed opening front-frame artwork |
| Cover | `heroMedia` / hero | User | 0–1 | 4:5 portrait, `cover`, focal center-top | Neutral empty media frame; envelope is separate decor |
| Invitation | `invitationMemoryImage1..3` / memory | User | 0–3 | Portrait/editorial, `cover` | Paper and typography |
| Event | `eventDetailsMedia` / event-details | User | 0–1 | Portrait/square, `cover` | Renderer-owned pressed-flower divider |
| Timeline | `timeline.items[].image` / timeline | User | 0–10 | Portrait, `cover` | Text-only markers |
| Venue | `mapUrl` | User/data | 0–1 | External CTA | Address text |
| Gallery | `galleryImages` / gallery | User | 0–12 | Fixed frames, preserve focal point | Editorial empty state |
| Gift | `giftQrMedia` / gift-qr | User | 0–1 | Square, `contain`, never crop | Empty QR panel |
| Footer | `footerMedia` / footer | User | 0–1 | Portrait/landscape, `cover` | Text-only closure |

Renderer-owned artwork is separate from these fields: opening gate, seal, frame/mask, divider, corner branch, ambient sprite and paper texture. It is never selectable as user content.

Canonical correction for the journey row above: use section key `timeline` and media key `timeline.items[].image` everywhere. The earlier `loveJourney[].image` label is deprecated and must not be implemented.

### Crop, loading and failure rules

- Portrait media defaults to `object-fit: cover` and `object-position: 50% 35%` unless a field defines another focal point.
- QR uses `contain`; no transform/filter/crop may affect scanability.
- Opening/hero media are eager or high-priority; other content media are lazy-loaded.
- Meaningful content media receive contextual alt text; decorative artwork uses empty alt.
- Broken, missing or low-quality media falls back without hiding text or CTA.
- User media cannot change the size of `.rg-invitation` or create horizontal overflow.

Alt/loading mapping: opening back/front and hero media are eager/high-priority with contextual alt text; invitation, event, timeline and gallery content media are lazy with section-specific alt text; QR uses an explicit banking/payment alt label and remains `contain`; renderer-owned decor always uses empty alt or `aria-hidden="true"`.

### Responsive and reduced-motion rules

- At or below 480px, the invitation is full width and desktop gutter atmosphere is hidden.
- Above 480px, extra space contains only low-contrast background, glow and small light particles.
- No renderer-owned artwork is positioned in the desktop gutter.
- Gallery uses vertical stack or native horizontal snap on mobile, never scroll hijacking.
- Reduced motion stops particles, petal drift, parallax and auto-pan while keeping artwork/content visible.

### Editor media schema

Every editable image field maps to `template-config.ts` with `type`, `contentKey`, `label`, `mediaRole` and `mediaValue`:

```ts
{
  type: 'image',
  contentKey: 'heroMedia',
  label: 'Ảnh bìa',
  mediaRole: 'hero',
  mediaValue: 'object',
}
```

Fixed memory slots are three independent image fields. Gallery is the only repeatable image field and declares `maxItems: 12`. Venue uses a map URL only; external albums are not supported in this phase. Music is a shared capability and is not part of the visual media bundle.

### Phase 2 verification

- Upload small portrait, wide and missing/broken media cases.
- Remove every media field and verify fallback/empty behavior.
- Confirm QR remains square and scannable.
- Confirm no media expands the invitation beyond 480px.
- Confirm neutral replacement images preserve Rose Garden identity.
- Check 375px, 390px, 480px and wide desktop before Phase 2.5.

## Phase 2.5 handoff readiness

Before generating artwork, every renderer-owned asset must be recorded in an asset brief with: `assetKey`, role, owning section, visual metaphor, palette/material, transparent-background requirement, aspect ratio, pixel target, safe area, mobile behavior, desktop behavior, filename/path, prompt/provenance and approval criteria. The initial Rose Garden batch should cover at least: opening gate/envelope, rose seal, botanical frame or corner branch, pressed-flower divider, paper texture/light overlay, timeline marker and gift/gallery prop. User-upload media must not be generated in this phase.

## Non-goals

- Không xây desktop website dạng hai cột.
- Không biến thiệp thành long-form story website.
- Không thêm particle dày hoặc animation liên tục để thay thế composition.
- Không dùng layout card/grid giống nhau cho toàn bộ section.

## Phase 3 section architecture

Phase 3 is the first complete composition skeleton. The preview renderer is split into the
section keys below; each key is emitted as `[data-editor-section]` and can therefore be selected
and scrolled to from the live editor. `rose-garden/template-config.ts` is the editor contract and
`rose-garden/fixture.ts` is the isolated preview fixture.

| Section | Composition gesture | Content/media contract | Empty or disabled behavior |
| --- | --- | --- | --- |
| `opening` | Layered paper gate, 4 aligned 2:3 canvases | `openingMediaBack`, `openingMediaFront`, couple/date | Always visible; required and fixed first |
| `cover` | Vertical garden vignette + name lockup | `heroMedia`, `cover.*`, couple/date | Neutral artwork placeholder |
| `invitation` | Three independent memory slips | `invitationMemoryImage1/2/3`, `invitation.*` | Neutral empty memory frames; botanical art is a separate decorator |
| `families` | Split family letter with central ampersand | `families.brideSide`, `families.groomSide`, `families.*` | Required; no collapse |
| `eventDetails` | Date stamp and calendar action | `eventDetails.*`, `eventDetailsMedia` | Calendar link disappears when empty |
| `countdown` | Quiet date panel | Derived from `event.weddingDate` | Optional; disabled removes the section |
| `timeline` | One editorial vertical path | `timeline.items[]` | Optional; an empty list hides the section |
| `venue` | Address postcard, map link | `venue.*` | Map action disappears when URL is empty |
| `gallery` | Horizontal pressed-photo rail | `galleryImages`, `gallery.*` | Optional; empty state is separate from renderer-owned decor |
| `rsvp` | Reply card shell | `rsvp.*` | Optional; API/form wiring is a later integration phase |
| `guestbook` | Approved-wishes ledger shell | `guestbook.*` | Explains that approved wishes are loaded automatically |
| `gift` | Compact QR/gift moment | `giftQrMedia`, `gift.*` | QR placeholder remains square until media is supplied |
| `music` | Compact ambient player dock | `music.*` | Hidden without a track on public preview; editor keeps an empty shell |
| `footer` | Closing letter and signature | `footer.*`, couple/date | Required and fixed last |

The default order is `opening → cover → invitation → families → eventDetails → countdown →
timeline → venue → gallery → rsvp → guestbook → gift → music → footer`. Optional sections honor
the stored `enabled/order` values; missing order entries are appended in canonical order. No visual
composition is repeated more than three times, and the page remains a single mobile column capped
at 480px. On wider screens only `.rg-backdrop` occupies the gutter; all invitation-owned artwork
stays clipped by `.rg-invitation`.

The opening stage deliberately keeps all four approved layers on one shared canvas so the triangle
flap and the front V-window can be registered precisely. Phase 3 only exposes a static opened state
for composition testing. The detailed fold, slide-up, easing, reduced-motion choreography and
performance pause rules belong to Phase 4. Media finalization, live guestbook/RSVP/music data and
ambient asset integration belong to Phase 5.

### Phase 3 layout and transition map

Each section has one dominant composition gesture and one quiet seam into the next section. This
keeps the mobile invitation expressive without turning every section into the same card pattern.

| Section | Dominant layout | Transition into the next section |
| --- | --- | --- |
| `opening` | Full-viewport layered paper gate | Folded paper stage resolves into the cover |
| `cover` | Tall portrait vignette and name lockup | Soft rose-paper wash into the invitation letter |
| `invitation` | Three offset memory slips | Botanical overlap settles into the family letter |
| `families` | Two-column family letter with a centered ampersand | Blush paper fades to the date stamp |
| `eventDetails` | Calendar stamp, date line and right-aligned calendar CTA | Pressed divider leads into the dark countdown band |
| `countdown` | Centered quiet date panel | Dark rose band opens into a blush timeline path |
| `timeline` | Single vertical path with numbered nodes | Last node releases into the venue postcard |
| `venue` | Address block with circular map marker | Curved background line carries into the gallery rail |
| `gallery` | Native horizontal photo rail or designed empty state | Rail ends at the centered RSVP reply card |
| `rsvp` | Reply card shell | Response area moves into the approved-wishes ledger |
| `guestbook` | Ledger-like approved-wishes shell | Thin paper rule leads to the gift reveal |
| `gift` | Square QR moment with optional thank-you text | Compact utility moment leads to the music dock |
| `music` | Thin ambient player dock | Rule and spacing create a quiet footer pause |
| `footer` | Closing letter and couple signature | Deep rose closure ends the invitation |

### Phase 3 responsive and motion map

- `320–360px`: reduce horizontal padding and keep every composition inside the invitation width.
- `361–480px`: use the base mobile composition, with native vertical page scrolling after opening.
- `481px+`: preserve the invitation at `max-width: 480px`; the gutter contains only background glow
  and small light particles. No section artwork is positioned in or allowed to overflow into it.
- Closed state: lock the invitation to the viewport and hide all post-opening sections until the
  opening trigger is activated, so there is no blank scroll area behind the closed card.
- Reduced motion: keep the opening and content visible without movement; disable glint animation,
  drift and transform-based reveals while preserving the same section order and hierarchy.

### Phase 3 completion checklist

- [x] Isolated Rose Garden fixture and editor contract with canonical content keys.
- [x] All 14 section keys render through one section map with `data-editor-section` hooks.
- [x] Required/optional enable state and stored section order are honored.
- [x] User-upload slots are empty by default; renderer-owned artwork is rendered only as a separate
  decorator or fixed opening layer.
- [x] Opening has four aligned layers and a tested static open/closed state.
- [x] Gallery, timeline, QR, footer, event media and memory slots have explicit empty behavior.
- [x] Public mobile composition is capped at 480px with desktop gutter atmosphere isolated outside it.
- [x] Responsive and reduced-motion behavior is documented and represented in the renderer/CSS.
- [x] Component tests cover the section map, opening state, optional section toggle and media ownership.
