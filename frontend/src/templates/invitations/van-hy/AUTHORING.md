# Vạn Hỷ — Authoring log

Working template key: `van-hy`

## Phase tracker

| Phase | Status | Evidence |
| --- | --- | --- |
| 0 — preview shell / spatial contract | Complete | `VanHyInvitation.tsx`, `van-hy.css`, direct route smoke, responsive CSS audit and invitation interaction tests are complete. |
| 1 — product meaning / content system | Complete | Product meaning, journey, art direction, current section content matrix and editor plan are recorded below. |
| 2 — media contract | Complete | Media matrix, editability, crop/focal/loading/alt/fallback rules, external album decision and config mapping are recorded below. |
| 2.5 — decor pre-production | Complete / approved | Approved renderer-owned artwork batch, preview sheet and provenance manifest are recorded below. |
| 3 — section composition | Complete | current section skeleton renderer, config, fixture, composition map and tests are implemented below. |
| 4 — motion / interaction | Complete | Technique map, core motion system, targeted browser review, reduced-motion rule and template validation are complete. |
| 5 — integration / review / release | In progress | Artwork is integrated; release review and final catalog audit remain. |

## Phase 0 — preview shell and spatial contract

### Preview

- Route: `/templates/invitations/van-hy/preview`
- Renderer: `VanHyInvitation.tsx`
- Stylesheet namespace: `.hh-*` in `van-hy.css`
- The complete renderer, fixture and approved artwork are mounted; editor and public data are supported.

### Locked spatial decisions

- Public invitation canvas is one vertical mobile column capped at `480px`.
- At `<=480px`, the invitation is full-width and owns the viewport.
- At `>480px`, the invitation remains capped at `480px`; the outer gutter is non-essential background only.
- Page-level horizontal overflow is clipped. Opening flowers are allowed to visually enter the card boundary but remain clipped by the invitation shell.
- Opening is a fixed viewport-height overlay. The card is centered inside the full-screen Hỷ scene; after the opening transition the entire overlay is removed and the invitation content underneath is revealed.
- The final opening will use a red Hỷ card, two renderer-owned red flower clusters and bounded floating Hỷ fragments. Phase 0 uses CSS placeholder flowers and text-only Hỷ fragments to validate spatial behavior before artwork approval.
- The card supports click, Enter and Space. The open control is at least 44px high.
- The shell has a reduced-motion fallback: floating Hỷ fragments and card transitions stop while the same visual states remain available.

### Phase 0 acceptance gate

- [x] Direct preview route and App dispatch exist.
- [x] Shell has an isolated stylesheet namespace.
- [x] Invitation width is capped at 480px.
- [x] Opening card has a fixed full-viewport closed/open state; the opening overlay is removed after the transition and placeholder content is revealed underneath.
- [x] Decorative Hỷ fragments and flowers do not capture pointer events.
- [x] Reduced-motion fallback is declared.
- [x] Responsive CSS audit covers 375px, 390px, 480px, 768px and 1440px behavior: the invitation remains capped at 480px and gutter content is non-essential.
- [x] Direct Vite preview route smoke returns `200 OK`; page-level overflow is clipped by the shell contract.
- [x] Shell interaction test confirms keyboard open behavior and the 44px opening control.

Manual visual screenshot review remains a recommended follow-up during the first full preview render; it is not a Phase 0 blocker for starting the content-system artifact.

## Phase 1 — product meaning and content system

### Product meaning

Vạn Hỷ is an `ONLINE_INVITATION`: a Vietnamese wedding invitation that feels like opening a lively dark-burgundy Hỷ card on a phone. It is not a formal heritage stationery piece, a wedding website or a post-event recap. The guest should feel the excitement of a celebration, then quickly understand who is inviting them, the two families, the wedding details and the actions they can take.

Viewer job: open the Hỷ scene, scan the invitation and family information, confirm the date/time/venue, save the event, open the map, RSVP and optionally send a wish or gift.

Audience: invited Vietnamese wedding guests, primarily on 375–480px mobile screens. The public invitation remains one vertical column capped at 480px; wider screens only add non-essential outer atmosphere.

Non-goals:

- Không biến thiệp thành website kể chuyện dài nhiều chương.
- Không dùng phong cách cung đình, cổ điển, quá trang trọng hoặc đỏ-vàng nghi lễ.
- Không để ảnh upload của người dùng gánh nhận diện theme.
- Không để animation, chữ Hỷ hoặc decor che nội dung, family roles, CTA hay form.
- Không tạo desktop two-column layout hoặc scroll hijacking.

### Experience arc

`opening Hỷ Sự full-screen → bìa thiệp và tên đôi → lời mời → hai gia đình → ngày vui và lịch trình → địa điểm / hành động → album → RSVP / lời chúc / mừng cưới → lời cảm ơn`

The opening is the signature threshold: a full-screen red Hỷ scene with a centered card, floating Hỷ fragments and two red flower clusters. The exact card choreography may be refined later; the content system treats `opening` as a fixed, non-toggleable first section. After opening, the guest uses native vertical scrolling.

### Theme brief

| Dimension | Decision |
| --- | --- |
| Name | Vạn Hỷ |
| Visual metaphor | A digital burgundy wedding celebration card releasing Hỷ symbols into the invitation. |
| Mood | Hào hứng, phấn khởi, trẻ, playful, lucky, energetic and affectionate. |
| Palette | Deep burgundy `#35050E`; main oxblood `#5B0B18`; red-wine highlight `#6D1021` / `#781326`; muted coral `#A43A46`; warm cream `#F7E8D5`; muted gold `#C59645`. |
| Typography | `Phudu GMM` for display; `Be Vietnam Pro GMM` for body, utility and forms; `Tapestry GMM` only for short ornamental marks. |
| Material | Dark lacquer-red surface, soft grain, paper/card planes, sticker-like Hỷ marks and energetic poster bursts. |
| Renderer-owned identity | Full-screen Hỷ opening, red flower clusters, floating `囍` / `Hỷ` fragments, red section bridges and small burst/star shapes. |
| Motion language | One opening exit ritual, bounded Hỷ drift, one-time section reveals and touch-safe micro feedback. Motion pauses when invisible and has a reduced-motion static fallback. |
| Language | Vietnamese primary. Editor-facing labels are complete Vietnamese. No required English public copy; at most three short decorative English accents if later approved. |
| Spatial rule | Mobile-first one-column invitation, `max-width: 480px`, page-level horizontal clipping and no essential artwork in desktop gutters. |

Vạn Hỷ is intentionally different from Astral Vows even though it uses the same section count and config contract: Astral Vows is quiet celestial mystery; Vạn Hỷ is dark-red, social, celebratory and typographically playful. It remains an invitation rather than a wedding website because its primary job is to receive, scan and act on a wedding invitation.

### Section/content matrix

The template uses the current 11-section contract. Technical keys stay compatible with the established invitation system. Human-facing section labels, field labels, empty messages and helper text must be fully Vietnamese in `template-config.ts`.

| Key | Required / order | Content anchor and canonical keys | Editor/default plan | Empty, action and fallback |
| --- | --- | --- | --- | --- |
| `opening` | Required, fixed first | `opening.title`, `opening.message`, `couple.brideName`, `couple.groomName`, `event.weddingDate`, `event.venueName` | “Mở thiệp Hỷ Sự”; short title/message, couple/date from default data | Always present. Open action supports click, Enter and Space. Renderer-owned Hỷ/flower atmosphere remains if copy is empty. |
| `cover` | Required, fixed | `cover.eyebrow`, `cover.title`, `couple.*`, `event.weddingDate` | “Ngày vui của chúng mình”, couple names and date | Text-first red poster composition; no user photo required for identity. |
| `invitation` | Required, fixed | `invitation.message`, `invitationMemoryImage1..3` | Vietnamese invitation copy and three optional memory-image fields | Copy remains usable when images are absent; missing frames are removed or replaced by a neutral Hỷ frame. |
| `families` | Required, fixed | `families.title`, `families.subtitle`, `families.message`, `families.brideSide.*`, `families.groomSide.*` | Separate nhà gái/nhà trai labels, parent honorifics, names and addresses | Preserve family hierarchy. Hide only missing lines; never remove the two-family anchor. |
| `countdown` | Optional, reorderable | Derived from `event.weddingDate` and event time | Toggle only; date is sourced from shared event data | Invalid/missing date removes the section. Completed state uses Vietnamese copy and never becomes negative. |
| `venue` | Optional, reorderable | `venue.title`, `venue.name`, `venue.address`, `venue.message`, `venue.mapUrl` | Place name, address, note and map URL | Address remains visible as text. Map CTA disappears when URL is missing/invalid. |
| `timeline` | Optional, reorderable | `timeline.title`, `timeline.message`, `timeline.items[]` | 0–10 repeatable Vietnamese time/title/description rows | Empty list removes the section; text remains the source of truth. |
| `gallery` | Optional, reorderable | `gallery.title`, `gallery.message`, `galleryImages` | 0–12 user images and Vietnamese copy | Dedicated empty state. External album is not supported in this template phase. |
| `rsvp` | Optional, reorderable | `rsvp.title`, `rsvp.message`, `rsvp.successMessage` | Vietnamese copy; response controls follow shared invitation interaction contract | Idle, validation, submitting, success, error, rate-limit and offline/retry states remain understandable without motion. |
| `guestbook` | Optional, reorderable | `guestbook.title`, `guestbook.message`, `guestbook.successMessage` | Vietnamese copy; approved wishes are system-owned | Empty and success states are explicit; form remains usable without decor. |
| `gift` | Optional, reorderable | `gift.thankYouMessage`, `giftQrMedia` | Vietnamese thank-you copy and optional square QR media | Thank-you copy remains when QR is absent/broken; QR panel hides safely. |
| `music` | Optional, fixed near end | `music.backgroundMusicUrl`, `music.backgroundMusicName`, `music.backgroundMusicAutoplay` | Shared music catalog field with Vietnamese editor labels | Hidden publicly without a track. Autoplay never bypasses browser gesture policy. |
| `footer` | Required, fixed last | `footer.title`, `footer.message`, `footerMedia`, `couple.*`, `event.*` | Vietnamese closing title/message and optional closing media | Text-only dark-red closure when media is absent. |

Required and fixed: `opening`, `cover`, `invitation`, `families`, `footer`.

Optional and reorderable: `countdown`, `venue`, `timeline`, `gallery`, `rsvp`, `guestbook`, `gift`.

Optional and fixed near the end: `music`.

Canonical order:

`opening → cover → invitation → families → countdown → venue → timeline → gallery → rsvp → guestbook → gift → music → footer`

Malformed stored section state must be normalized like existing invitation templates: required sections are restored, duplicate/unknown optional keys are ignored and missing optional keys are appended in canonical order.

### Fixture and editor plan

Phase 3 will create an isolated Vạn Hỷ content type and fictional Vietnamese fixture. It will include accented couple names, both family sides, parent roles, date/time, ceremony/party details, venue/address, at least three timeline items, neutral replaceable images and empty QR/media variants. It must contain no real guest PII, account data, bank information or copyrighted external media.

`template-config.ts` must follow the exact established invitation config shape used by Astral Vows and other working templates:

- Keep `templateKey`, `displayName`, version fields, `previewPath`, `defaultData`, `palettes`, `capabilities`, `sections`, `theme` and `composition` in the standard shape.
- Each editable field declares the standard `type`, complete Vietnamese `label` and canonical `contentKey`.
- Image fields additionally declare `mediaRole` and `mediaValue`.
- Repeatable timeline fields declare recommended/minimum and maximum item counts.
- Technical `sectionKey`, `contentKey`, media roles and enum values remain stable machine-readable identifiers; they are not editor-facing labels.
- Renderer-owned Hỷ fragments, flowers, card surfaces and motion never appear as user media fields.
- No intended editable copy or media may be hard-coded in the renderer without a matching config/content field.
- Config parity with Astral Vows is a release blocker so the editor and backend can read the same content shape.

### Phase 1 acceptance checklist

- [x] Product type, meaning, viewer job, audience, non-goals and experience arc are documented.
- [x] Vạn Hỷ art direction is defined: dominant dark burgundy red, energetic Gen Z tone, floating Hỷ and red flower opening decor.
- [x] Mobile-only 480px constraint and full-screen opening role are documented.
- [x] Required/optional section list and canonical order match the 11-section current contract.
- [x] Each section has a content anchor, canonical keys, editor/default plan, empty behavior and action/fallback.
- [x] Fixture and editor mapping plans are isolated from existing templates.
- [x] Template config parity and fully Vietnamese editor labels are explicit release blockers.
- [x] Renderer, final artwork, media matrix and advanced motion are intentionally deferred to later phases.

### Anti-patterns

Do not turn Vạn Hỷ into a formal red-and-gold heritage invitation, generic neon party poster, long-form website or page where every section repeats the same red card. Do not let floating Hỷ fragments cross long text, family names, forms or controls. Do not use user photos, hard-coded sample content or unlicensed external artwork as theme identity. Do not create a custom `template-config.ts` shape, English editor labels or backend-incompatible content keys.

## Phase 2 — media contract and media independence

### Scope decision

Vạn Hỷ supports internal user-uploaded media only. External albums are **not supported** in this template phase. A map URL and calendar action are external actions, not visual media; readable address/date text remains visible even when those actions are unavailable.

User media communicates the couple and event. It must never carry the Vạn Hỷ identity. Dark burgundy surfaces, Phudu/Be Vietnam Pro typography, Hỷ fragments, red flower clusters, opening scene, card treatment and renderer-owned decorative artwork remain available when all user media is removed.

### User-media matrix

| Section / field | Media role and owner | Count / shape / crop | Loading and alt strategy | Empty, error and responsive behavior |
| --- | --- | --- | --- | --- |
| `heroMedia` | Optional cover image; user-owned | `0–1`; portrait 4:5 preferred; `cover`; default focal point `50% 35%` | High priority after opening; alt: “Ảnh bìa của {brideName} và {groomName}” | Red Hỷ poster frame remains without image; broken image removes only the media plane. Never place required names/date only on the image. |
| `invitationMemoryImage1..3` | Optional invitation memory images; user-owned | `0–3`; portrait 3:4 preferred; `cover`; focal point `50% 35%` | Lazy; alt: “Khoảnh khắc {n} của {brideName} và {groomName}” | Missing slot is removed or becomes a neutral Hỷ frame; text invitation remains primary. At 375–480px images stay inside the 16px content gutter. |
| `galleryImages` | Internal gallery album; user-owned | `0–12`; portrait/landscape accepted; designed frame 3:4; `cover` | First visible image eager, remaining images lazy; numbered contextual alt | Empty state keeps album heading and explains how to add photos; broken item is removed without collapsing the whole gallery. Native mobile horizontal snap is allowed; no scroll hijacking. |
| `giftQrMedia` | Mừng cưới/payment QR; user-owned | `0–1`; square only; `contain`; no crop or filters | Eager only after the gift panel is deliberately opened; alt: “Mã QR mừng cưới” | QR panel hides on missing/broken media while thank-you copy remains. Must remain scannable at 480px and never be covered by decor. |
| `footerMedia` | Optional closing image; user-owned | `0–1`; portrait/landscape; `cover`; focal point `50% 45%` | Lazy; alt: “Khoảnh khắc cuối thiệp của {brideName} và {groomName}” | Dark-red text-only closing remains when absent/broken. Media never determines footer height or CTA position. |

Opening flower clusters, floating Hỷ fragments, Hỷ pattern, card texture, section bridges and all decorative red artwork are renderer-owned and are deliberately absent from this user-media matrix.

### Non-image and external action media

| Field | Owner | Contract | Fallback |
| --- | --- | --- | --- |
| `venue.mapUrl` | User/content owner | URL action only; address is always rendered as text | Hide map CTA/embed when invalid; keep venue name/address and a text “Mở bản đồ” action only when valid. |
| Calendar action | Shared invitation capability | Derived from event date/time; not an uploaded image | Show readable date/time; hide calendar CTA when event data is incomplete. |
| `music.backgroundMusicUrl` | Shared music catalog/user selection | Audio field from the established music contract; no raw external embed in the template | Hide public player without a valid track; never force autoplay before a guest gesture. |
| External album URL | Not supported | No field, no redirect and no new tab behavior | Keep internal gallery empty state instead. |

### Upload and editability matrix

| Asset / field | Owner | Exposed in editor | Renderer responsibility | Editable behavior |
| --- | --- | --- | --- | --- |
| `heroMedia` | User | Yes, image field | Fit image inside the cover frame and preserve names/date outside image dependency | Replace/remove; explicit empty value stays empty. |
| `invitationMemoryImage1..3` | User | Yes, three independent image fields | Render only supplied slots; preserve invitation copy if all are absent | Replace/remove each slot independently. |
| `galleryImages` | User | Yes, repeatable images field, max 12 | Render internal gallery controls and empty/error state | Add, reorder and remove through standard gallery editor behavior. |
| `giftQrMedia` | User | Yes, image field | Preserve square scan area and hide safely when unavailable | Replace/remove; no crop or filter. |
| `footerMedia` | User | Yes, image field | Use as optional atmosphere only; never as required copy background | Replace/remove without changing text layout. |
| Opening flowers and Hỷ fragments | Renderer | No | Own theme identity, placement, density, motion and fallback | Never uploaded, selected or persisted as user content. |
| Map/calendar/music controls | Shared capability | Existing standard fields/actions | Respect shared URL/audio validation and states | Do not add template-specific persistence shape. |

### Crop, focal point and responsive rules

- Portrait photos use `object-fit: cover` with default focal point `50% 35%`; future focal-point editing is allowed only through the common media manager.
- Gallery frames keep their designed aspect ratio. Wide uploads crop into the frame rather than expanding section width.
- QR uses `object-fit: contain`, square dimensions, no filters, no border overlay over the code and no decorative mask in its scan area.
- At 320–360px, media scales down inside the content gutter and never controls typography size or section height.
- At 375px, 390px and 480px, no user media may create horizontal overflow; all media is clipped by its bounded frame.
- Above 480px, the invitation stays capped at 480px. User media never renders into the desktop gutter.
- Low-resolution images keep stable frames and may look soft; the renderer must not upscale-dependent text or move CTA placement.
- Loading uses stable aspect-ratio boxes to avoid CLS. Broken media removes only the affected plane and leaves the nearest heading, copy and action.

### Alt, privacy and safety rules

- Every user image has one contextual Vietnamese alt string. Decorative renderer-owned artwork uses `alt=""` and `aria-hidden="true"`.
- Do not expose raw object-storage URLs, file metadata, bank details or guest PII in alt text, logs or empty states.
- QR alt text identifies the function, not payment-account details.
- User media is content only; it must not be used as the theme background, opening identity or required information carrier.
- Media errors never render browser broken-image icons as the only fallback.

### Fallback, error and empty-state contract

- Missing optional image: keep the section’s heading, copy, CTA and renderer-owned Vạn Hỷ decor; remove only the empty media frame unless the section explicitly has a designed empty state.
- Broken image: remove or replace the single affected media plane, preserve the stable frame and show no raw URL.
- Empty gallery: keep the gallery anchor and show a Vietnamese invitation to add images; external album behavior remains not supported.
- Missing QR: retain the thank-you copy and hide the QR panel.
- Invalid map URL: retain readable venue information and hide the invalid map action/embed.
- Missing footer image: use the dark-red text closure and Hỷ decor.
- Reduced motion: keep all approved artwork visible as static layers; disable drift, parallax and auto-pan.

### Renderer-owned visual matrix (contract only)

| Role | Owning sections | Identity purpose | User editability / fallback |
| --- | --- | --- | --- |
| Full-screen Hỷ opening scene | `opening` | Establishes the invitation threshold and Vạn Hỷ identity | Never editable; CSS/static card scene fallback remains without raster artwork. |
| Red flower clusters | `opening` and selected section bridges | Frames the opening and repeats the red floral language | Never editable; CSS silhouette or hidden static fallback. |
| Floating Hỷ fragments and Hỷ pattern | `opening`, cover and selected ambient sections | Signature playful atmosphere | Never editable; bounded static arrangement under reduced motion. |
| Card frame / grain / red paper planes | `opening`, `cover`, `footer` | Maintains digital lacquer/card material | Never editable; CSS gradients and borders are the fallback. |
| Section divider / burst marks | Body seams | Creates continuity without introducing unrelated section backgrounds | Never editable; code-native CSS/SVG fallback. |

### Media-independence verification plan

Before Phase 3, the skeleton renderer must be checked with:

1. All photos replaced by neutral unrelated portrait and landscape images: Vạn Hỷ remains identifiable through palette, typography, Hỷ fragments, card language and renderer-owned decor.
2. Every user image removed: opening, couple names, family hierarchy, event details, map text, RSVP, wishes and footer remain usable.
3. Light/dark, portrait/landscape, small/low-quality and broken media: no clipped text, layout shift, horizontal overflow or lost CTA.
4. Empty QR and invalid map/calendar URLs: copy remains, unsafe/unavailable panels and actions disappear.
5. Long Vietnamese names, long addresses, guest personalization and missing media together at 375px, 390px and 480px.
6. User media never appears in the desktop gutter above 480px.

### Template-config media mapping

The eventual `van-hy/template-config.ts` must expose only the user-editable media fields using the established schema:

```ts
{
  type: 'image',
  label: 'Ảnh bìa',
  contentKey: 'heroMedia',
  mediaRole: 'hero',
  mediaValue: 'object',
}
```

```ts
{
  type: 'images',
  label: 'Ảnh trong album',
  contentKey: 'galleryImages',
  mediaRole: 'gallery',
  mediaValue: 'url',
  maxItems: 12,
}
```

The other supported image fields map as `invitationMemoryImage1..3` with `mediaRole: 'invitation-memory'`, `giftQrMedia` with `mediaRole: 'gift-qr'` and `footerMedia` with `mediaRole: 'footer'`. All labels remain complete Vietnamese. Renderer-owned flowers, Hỷ fragments, opening scene and texture are not declared as upload fields.

### Phase 2 acceptance checklist

- [x] User-media matrix records role, owner, count, shape, crop, loading, alt, empty, error and responsive behavior.
- [x] Upload/editability matrix separates user content from renderer-owned Vạn Hỷ identity.
- [x] Crop, focal-point, breakpoint, stable-frame and low-quality rules are explicit.
- [x] Fallback/error/empty behavior is defined for every supported media and external action.
- [x] External album behavior is explicitly `not supported`.
- [x] Media field schema and mapping into the standard `template-config.ts` shape are recorded.
- [x] Media-independence verification cases are defined before skeleton renderer work.
- [x] No artwork generation or final asset integration occurs before Phase 2.5 approval.

## Phase 2.5 — Artwork batch and provenance

Status: **Approved — v4 artwork candidates locked for later integration.**

### Asset brief

The first Vạn Hỷ artwork batch reinforces the dark burgundy Hỷ Sự direction with energetic, youthful floral framing. Artwork is renderer-owned only: it must never become an editor upload field, user content fallback, or backend-persisted media value.

- Opening: two asymmetric deep-red floral clusters frame the full-screen opening card, leaving the central card readable.
- Bridges: one horizontal celebration divider provides a reusable visual seam for selected sections.
- Hỷ fragments remain code-native text/CSS so the Vietnamese/Chinese characterforms stay exact and editable in future motion work.
- No people, couple likenesses, guest data, logos, watermarks or external/licensed source imagery.

### Asset matrix

| File | Role / owning sections | Planned dimensions / format | Alpha | Crop / placement | Status |
| --- | --- | --- | --- | --- | --- |
| `vh-opening-flower-left-v1.png` | Left opening floral cluster; `opening` | 1024×1536 PNG | Required | Free-positioned, contain; lower-left visual weight | Generated; review |
| `vh-opening-flower-right-v1.png` | Right opening floral cluster; `opening` | 1024×1536 PNG | Required | Free-positioned, contain; lower-right visual weight | Generated; review |
| `vh-celebration-divider-v1.png` | Section bridge / event burst; `cover`, `timeline`, `footer` candidates | 2048×1024 PNG | Required | Wide contain; never carries required text | Generated; review |
| `vh-lucky-envelope-v1.png` | Red lì xì accent; `cover`, `gift`, `footer` candidates | 1024×1536 PNG | Required | Contain; float at bounded corner, never covers copy | Generated; review |
| `vh-paper-fan-v1.png` | Red paper fan accent; `cover`, `timeline`, `footer` candidates | 1536×1024 PNG | Required | Wide contain; rotate only within bounded decor layer | Generated; review |
| `vh-double-happiness-v1.png` | `囍` cut-paper/embossed motif; `opening`, `cover`, `footer` candidates | 1296×1275 PNG | Required | Contain; decorative only, not a text carrier | Generated; review |
| `vh-paper-fan-v2.png` | Preferred flat Chinese paper fan; `cover`, `timeline`, `footer` candidates | 1536×1024 PNG | Required | Wide contain; flat graphic, no pleat animation | Generated; review |
| `vh-double-happiness-v2.png` | Preferred flat floral paper-cut `囍`; `opening`, `cover`, `footer` candidates | 1261×1263 PNG | Required | Contain; flat collage, decorative only | Generated; review |
| `vh-paper-fan-v3.png` | Preferred restrained luxury paper fan; `cover`, `timeline`, `footer` candidates | 1536×1024 PNG | Required | Wide contain; minimal floral accent, no pleat animation | Generated; review |
| `vh-double-happiness-v3.png` | Preferred minimal floral paper-cut `囍`; `opening`, `cover`, `footer` candidates | 1238×1262 PNG | Required | Contain; clean silhouette, decorative only | Generated; review |
| `vh-paper-fan-v4.png` | Preferred gold-line floral fan; `cover`, `timeline`, `footer` candidates | 1536×1024 PNG | Required | Wide contain; no surface ribs, gold line-art flowers only | Generated; review |
| `vh-double-happiness-v4.png` | Preferred torn-paper-edge `囍`; `opening`, `cover`, `footer` candidates | 1238×1262 PNG | Required | Contain; soft irregular paper edge, decorative only | Generated; review |

### Prompt record

The batch was produced with the built-in `image_gen` workflow. Prompts specified: deep burgundy `#5b0b18` / wine `#35050e` / red `#781326`, restrained coral `#a43a46`, antique gold `#c59645`, editorial botanical stationery illustration, tactile paper grain, safe padding, transparent background, no text, no people, no logo and no watermark. The two opening prompts explicitly requested asymmetric left/right compositions; the divider prompt requested a wide 3:1 celebratory ornament.

### Preview and approval

See [ARTWORK_PREVIEW.md](./ARTWORK_PREVIEW.md) for the visual preview sheet and reviewer checklist. The approved generated images are referenced by `VanHyInvitation.tsx` and `van-hy.css`; artwork approval covers edge quality, alpha cleanliness, mobile crop safety and visual fit against the current dark-red shell.

### Phase 2.5 acceptance checklist

- [x] Asset brief defines the visual role, renderer ownership and non-goals.
- [x] Asset matrix records filename, owning sections, dimensions, alpha, crop/placement and status.
- [x] Prompt record records palette, medium, transparency and negative constraints.
- [x] Generated candidates are persisted inside the workspace under the Vạn Hỷ asset folder.
- [x] Preview sheet and approval checklist are present.
- [x] No generated artwork is integrated into the renderer before approval.
- [x] Owner approves the artwork batch for Phase 3 integration.

## Phase 3 — Section architecture and visual composition

Status: **Complete — skeleton and composition contract implemented.**

### Section composition map

| Section | Layout | Content anchor / focal point | Transition and fallback |
| --- | --- | --- | --- |
| `opening` | Full-screen card reveal | CTA “Mở thiệp”, chữ 囍, Hỷ sự card | Full viewport overlay; keyboard/touch open; static card when motion is reduced |
| `cover` | Layered paper theatre | Tên cặp đôi và ngày cưới | Full-height burgundy chapter; no user media required |
| `invitation` | Seal-and-ribbon | Lời báo hỷ and invitation copy | Gold rule/seal bridge into families |
| `families` | Dual cards | Nhà gái / nhà trai | Two-column card becomes stacked mobile cards |
| `countdown` | Four-unit grid | Ngày–giờ–phút–giây | Stable numeric boxes; static values under reduced motion |
| `venue` | Venue detail card | Tên địa điểm, thời gian, địa chỉ, map CTA | Bounded card preserves text when map/media is missing |
| `timeline` | Vertical timeline | Mốc giờ and activity detail | Vertical connector; list remains readable without animation |
| `gallery` | Editorial grid | User gallery images | Empty state retains album purpose; bounded 3:4 frames |
| `rsvp` | Single card form | Attendance action | Inline status after action; two touch-sized choices |
| `guestbook` | Stacked notes | Lời chúc field and submit CTA | Textarea remains usable when no approved wishes exist |
| `gift` | Single QR card | Gift message and optional QR reveal | Optional panel collapses cleanly when QR is absent |
| `music` | Compact action chip | Music capability entry point | Non-blocking static button; no autoplay dependency in skeleton |
| `footer` | Closing letter | Thank-you copy and couple names | Dark-red closure with 囍 mark; no competing CTA |

The order is locked to `opening → cover → invitation → families → countdown → venue → timeline → gallery → rsvp → guestbook → gift → music → footer`. Required anchors cannot be toggled or reordered; optional sections use the common `enabled`/`order` contract.

### Layout and responsive map

- The renderer is a single mobile column capped at `480px`; the `cover` and `footer` are the only full-height chapters.
- At 320–480px, family cards, countdown units and actions remain bounded inside the content gutter. No section relies on hover or desktop-only controls.
- Above 480px, the invitation remains centered and the surrounding gutter is atmospheric only. No user content is rendered into the gutter.
- Missing user media never removes a content anchor: gallery keeps its Vietnamese empty state, QR remains a reveal placeholder and cover identity remains typography-led.
- Reduced motion disables opening/reveal transitions and keeps all content, CTA, hierarchy and renderer-owned code-native Hỷ marks visible.

### Phase 3 acceptance checklist

- [x] All 13 invitation sections are represented in the renderer and config with matching `sectionKey`/`data-editor-section` values.
- [x] Required and optional section behavior is declared in `template-config.ts`.
- [x] Every section has a distinct primary layout; no layout option is used more than three times.
- [x] Vietnamese content anchors, responsive composition, empty states and fallbacks are recorded.
- [x] Fixture data and renderer data shape are aligned with the config content keys.
- [x] Renderer stays media-independent; approved raster artwork remains documented for later integration.
- [x] The mobile canvas remains capped at 480px and does not create horizontal overflow by design.
- [x] Full visual review and advanced motion/asset integration are explicitly deferred to Phase 4/5.

## Phase 4 — Advanced visual experience, interaction and motion

Status: **Complete — motion, interaction and browser smoke validation completed.**

### Technique map

| Technique | Sections | UX purpose | Trigger / fallback | Budget |
| --- | --- | --- | --- | --- |
| Full-screen card exit choreography | `opening` | Makes opening feel like a real Hỷ card ritual | Tap/Enter/Space; 760ms; static open state for reduced motion | 4 decor nodes plus card transform |
| Viewport entrance reveal | All body sections | Establishes reading order without hiding content permanently | `motion/react` viewport state, one-time per section; content is visible instantly under reduced motion | Transform/opacity only; decorative layers retain their own CSS transforms |
| CSS 3D depth | `cover` | Gives the red poster a layered paper-plane depth | Static 2D fallback; no pointer lock or scroll hijack | No JS frame loop |
| Approved decor drift | Opening flower pair and cover fan | Keeps renderer-owned artwork alive while invitation is visible | CSS transform/opacity loop; pauses through reduced-motion rule | 3 artwork files, low opacity |
| CTA press/focus feedback | RSVP, guestbook, gift, map and music controls | Confirms touch/keyboard action | Native focus and `:active`; no hover dependency | Under 180ms |

### Motion choreography and accessibility

- Opening uses `ease-out` for the card exit and paired opacity/transform timing; it never blocks the invitation for more than 760ms.
- Body sections use one-time Motion viewport entrance with the local 1.92s ease-out token; timeline and wish cards use the shared 0.5s list stagger.
- The cover uses CSS perspective and `translateZ` for depth only; native scrolling remains untouched and mobile has a 2D fallback.
- Artwork movement uses transform/opacity only. No layout properties, persistent blur animation or uncontrolled requestAnimationFrame loop is used.
- `prefers-reduced-motion: reduce` removes opening, reveal, fan drift and depth transforms while preserving every heading, CTA, form and artwork identity.
- Touch controls remain at least 44px high; keyboard focus uses visible outlines and no interaction depends on hover.

### Phase 4 acceptance checklist

- [x] Technique map, motion choreography, interaction behavior and performance budget are recorded.
- [x] Opening, Motion viewport entrance, ambient decor drift, CTA feedback and CSS 3D depth are implemented.
- [x] Approved renderer-owned artwork is referenced only from renderer decor layers, never from editable media fields.
- [x] Native scroll, touch and keyboard fallbacks remain available.
- [x] Reduced-motion fallback disables spatial/ambient motion while preserving content and identity.
- [x] Template tests cover opening and section rendering; full typecheck was attempted and is blocked by four pre-existing errors outside `templates/invitations/van-hy`.
- [x] Browser smoke review completed at 375px and 768px; no horizontal overflow and no console errors beyond the standard React DevTools info message.
- [x] Full screenshot-by-screenshot viewport smoke review completed; no horizontal overflow, asset load errors or runtime errors observed.
- [x] Template registry/config audit confirms `van-hy` resolves through the invitation catalog path.
- [ ] Final owner screenshot approval and whole-frontend release gate remain.

## Preserved product decisions for Phase 1

- Product is an `ONLINE_INVITATION`, not a wedding website or recap.
- Visual direction is youthful, energetic Gen Z Hỷ Sự: dominant dark burgundy red, playful decoration and floating Hỷ fragments.
- The invitation uses 13 sections like Astral Vows: `opening`, `cover`, `invitation`, `families`, `countdown`, `venue`, `timeline`, `gallery`, `rsvp`, `guestbook`, `gift`, `music`, `footer`.
- Required sections are `opening`, `cover`, `invitation`, `families`, `footer`; optional sections follow the established invitation contract.
- `template-config.ts` must use the same structure and canonical content-key conventions as working templates so the editor and backend can read content.
- All human-facing section and field labels in the editor must be complete Vietnamese; technical keys may remain stable machine-readable identifiers.
- Phase 1 must produce the theme brief, product meaning, viewer journey, section/content matrix, fixture plan, editor field plan, acceptance checklist, non-goals and anti-patterns before Phase 2.
