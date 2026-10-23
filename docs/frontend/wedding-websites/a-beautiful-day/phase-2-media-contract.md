# A Beautiful Day — Phase 2 Media Contract

Status: Phase 2 media roles, ownership, crop rules, editor mapping, fallback behavior, and media-independence checks are specified. Phase 2.5 artwork candidates have been generated and await visual approval/optimization. No renderer or media-field implementation is claimed by this artifact.

Related brief: [Phase 1 Theme Brief](./phase-1-theme-brief.md).

## Contract boundaries

- Canonical wedding content stores references to wedding-owned `MediaAsset` IDs. The renderer receives authorized public media projections from the publication snapshot; it does not fetch arbitrary media by ID.
- Every selected user image must belong to the same wedding and have `READY` status before publication. Existing wedding media conversion is capped at 2400px; preserve source aspect ratio and never upscale.
- User media is content. The theme identity stays renderer-owned through the ivory/paper canvas, Lora and Be Vietnam Pro typography, curtain framing, bamboo-inspired linework, floral artwork, dividers, and restrained warm light.
- Renderer-owned decorations, section backgrounds, textures, map imagery, and atmospheric artwork are not user media fields. They use empty alt text when decorative and have no editor upload control.
- No user video or external photo-album service is supported in v1. There is no external album URL field, CTA, redirect, or new-tab behavior. The internal gallery is the only album.
- The three MinIO screenshots remain temporary analysis references. They are never fixture, user-content, renderer artwork, or release media.

## Media matrix

All user media is optional: minimum 0. Required sections remain complete without photographs. Ratios below are preferred source/composition ratios, not upload rejection rules. Preserve the source and use a role-specific frame; never stretch an image.

| Canonical path / role | Owner; quantity | Preferred ratios and crop | Placement, loading, and fallback |
|---|---|---|---|
| `hero.heroMediaId` / `hero` | Couple upload; 0–1 | 16:9 preferred; 4:5 accepted. `cover`, default focal `50% 40%`; keep faces away from the text-safe center. | Wide editorial frame on desktop. On mobile use a portrait crop only if faces remain clear; otherwise remove the image layer. Eager load, async decode, high fetch priority. Missing, broken, or too-small media resolves to the complete typography-led hero and renderer-owned curtain frame. |
| `couple.bride.portraitMediaId`, `couple.groom.portraitMediaId` / `couple-portrait` | Couple upload; 0–1 each | 4:5 preferred; 3:4 or 1:1 accepted. `cover`, default `50% 35%`; subject centered with headroom. | Equal portrait frames, stacked on mobile. Load when near viewport. Each missing/broken image becomes a named typographic profile; do not collapse the profile or show a broken-image icon. |
| `story.milestones[].mediaId` / `story-moment` | Couple upload; 0–1 per milestone, at most 12 total | 4:5 or 3:2. `cover`, default center. | Frame follows the milestone text and keeps date/title/body in normal flow. Lazy load. Missing/broken media removes only its frame; milestone content and timeline remain. |
| `gallery.mediaIds[]` / `gallery` | Couple upload; 0–40 (canonical maximum) | Mixed 1:1, 4:5, and 3:2 sources. Fixed editorial frames use `cover`, center focal; full lightbox uses `contain` and the source ratio. | Reserve frame dimensions before load; lazy-load grid items and load/decode the selected lightbox image on demand. Reorder in editor; preserve authored order. No valid selected images means omit the optional section and nav link. Failed items are omitted without leaving holes. |
| `weddingParty.groups[].members[].mediaId` / `party-member` | Couple upload; 0–1 per member, at most 8 groups × 20 members | 4:5 preferred; 1:1 accepted. `cover`, default `50% 35%`. | Equal portrait frame; stack role groups on mobile. Lazy load. Missing/broken media becomes initials or a renderer-owned monogram; name and role remain visible. Never resolve from guest records. |
| `gift.accounts[].qrMediaId` / `gift-qr` | Couple upload; 0–1 per account, at most 8 accounts | Square 1:1. `contain`; never crop or apply a focal point. | Load only when gift is explicitly enabled and the account is valid. If no QR, keep opted-in account text when valid; do not show an empty image frame. A QR that is blurry, clipped, or not reliably scannable must be replaced before publish. Do not put real bank/account data in fixtures. |
| `seo.ogImageId` / `seo-og` | Couple upload; 0–1 | 1.91:1 preferred (1200 × 630 source is the target); `cover`, default center with names kept inside a central safe area. | Metadata only; never render in the page body. Platform OG fallback is used when absent, broken, or invalid. No public page request should wait on this media. |

No other canonical field accepts user imagery. In particular, events/venues use text and validated map links, schedule is text, dress-code colors are values, and music uses the audio catalog rather than an uploaded image.

## Upload and editability matrix

| Role | Editor field / control | Replacement, removal, and validation |
|---|---|---|
| Hero | `hero.heroMediaId`; Vietnamese label “Ảnh mở đầu”; one-image wedding media picker. | Replace/remove independently. Optional; warn when the source cannot support the wide composition. Preserve the text-first hero. |
| Couple portraits | `couple.bride.portraitMediaId` / “Ảnh cô dâu” and `couple.groom.portraitMediaId` / “Ảnh chú rể”; separate one-image pickers. | Replace/remove independently. Optional; show the portrait crop preview before choosing. Names and profiles remain required separately. |
| Story moments | `story.milestones[].mediaId`; item-level “Ảnh cột mốc” picker. | Attach/replace/remove per milestone. No photo is required to add a milestone. Keep item ordering and text if removed. |
| Gallery | `gallery.mediaIds[]`; multi-image picker with visible order and reorder control. | Add/remove/reorder up to 40. Save an empty array as empty; never reseed fixture media after removal. Section is omitted when no READY image remains. |
| Wedding-party portraits | `weddingParty.groups[].members[].mediaId`; item-level “Ảnh thành viên” picker. | Replace/remove independently; optional. Group/member text remains. Must not expose guest search or guest-derived media. |
| Gift QR | `gift.accounts[].qrMediaId`; item-level “Mã QR” picker. | Optional. Show a contained preview; require an explicit confirmation/preview check for readability before publish. The gift section remains opt-in and account details must not be seeded. |
| SEO image | Global SEO editor “Ảnh chia sẻ”; one-image picker, separate from visual sections. | Replace/remove; removal restores platform OG fallback. Never adds a visible section or navigation anchor. |

For implementation, these become `sections[].fields` (or `itemFields` for repeatable items) with `type: 'image'` / `'images'`, canonical `contentKey`, explicit Vietnamese `label`, and the role names above as `mediaRole`. Repeatable media remains attached to its canonical item (`milestones[].mediaId`, `members[].mediaId`, or `accounts[].qrMediaId`); it must not be flattened into a section-level gallery. SEO is a global editor field, not a visual section. Field definitions must preserve the canonical ID-reference contract: no `data:` URL, arbitrary remote URL, or persisted `publicUrl` in content. If the editor's media-value adapter needs a wrapper, it must normalize back to the `MediaAsset` ID at the content/snapshot boundary.

## Crop, focal point, and content protection

- v1 uses fixed role-level default focal positions listed in the matrix. There is no per-placement focal-point field in canonical content v1, so the editor must not imply that an independently persisted focal coordinate exists.
- Owners can replace/crop a source through the shared media editor, which creates a new `MediaAsset`; show role-specific crop previews before selecting it. The renderer then applies the documented default position.
- If that default crop cuts off a face, text, QR modules, or another essential subject, do not force `cover`: use `contain` for the affected placement or remove the image layer and retain the text composition. QR is always `contain`.
- Keep names, date, venue, section headings, controls, captions, and essential instructions as HTML outside the image. Do not bake copy into a photo or use a photo as the only source of information.
- If a future phase needs persistent per-placement focal coordinates, it must first extend the shared content/editor contract and version/migrate it; do not add undocumented template-only paths to canonical v1.

## Alt text and accessibility

- Meaningful content photos require Vietnamese alt text. Decorative artwork uses `alt=""`; a redundant photo must also use empty alt only when the adjacent text already conveys the same information and the image adds no distinct meaning.
- Store alt text on the wedding-owned `MediaAsset.altText` metadata, not in a duplicate template-specific path. The backend contract already defines that metadata; the frontend editor/API and published media projection must expose it before this template implements photo fields. Treat this as a Phase 3 integration dependency, not as an implemented feature.
- The editor prompts for concise descriptions when selecting/uploading meaningful photos and allows correction in the shared media library. A name-only auto-generated description is not sufficient for story/gallery content. For couple portraits, contextual fallback alt may identify whose portrait it is only if media metadata is empty and the adjacent accessible name is present; for un-described story/gallery images, block publish or require the owner to mark the image decorative with a clear reason.
- QR and OG images are not rendered as content photos. The gift account text must provide the information represented by a QR; the QR control needs an accessible label identifying its recipient. Social metadata uses the OG image URL without page alt text.
- Lightbox controls need an accessible name, focus management, Escape close, and a meaningful image description. Keyboard focus and text contrast must remain visible over all image brightness levels.

## Loading, dimensions, and failure states

- Resolve only authorized, `READY` media from the wedding publication projection. Missing projection, removed media, or load failure must never expose an arbitrary storage key or stale private URL.
- Reserve each image frame with a fixed aspect ratio and explicit dimensions (or equivalent layout reservation) before loading. Use `decoding="async"`; native lazy loading below the fold. Only the hero may use eager loading and high fetch priority.
- Provide a quiet neutral frame while loading. On error, converge to the same fallback as missing media; do not leave a spinner indefinitely or broken-image glyph. A failed gallery item is removed from the grid/lightbox index.
- At or above the role's preferred display needs, retain normal quality. For undersized sources, do not upscale beyond intrinsic dimensions: show a discreet editor warning, and in preview use a neutral frame if visible pixelation would distract. Publish may retain a low-resolution photo only when it remains legible and is not essential information; gift QR must always pass readability review.
- Long names and copy must not overlap image frames. At narrow widths, reduce/omit optional photo layers before shrinking text or essential controls.

## Responsive behavior

- Desktop uses the preferred landscape hero and paired couple profiles with generous whitespace. Tablet reduces frame width and decoration density before cropping more tightly.
- Mobile uses native vertical flow: hero uses a safe portrait crop or no photo; couple portraits stack; story and party images remain adjacent to their own text; gallery becomes a one-column or short two-column grid; lightbox remains touch and keyboard operable; QR stays square and fully visible.
- No horizontal-only album, image-dependent navigation, hover-only crop control, or fixed-height text panel. For source ratios outside a role's accepted range, preserve the source via the documented `contain`/fallback path rather than overflow or clipping.
- Reduced motion does not alter media order or hide media/content. Image loading and lightbox state remain usable with motion disabled.

## Empty, invalid, and external-album behavior

- Optional image absent: use the role's intentional text/monogram/neutral treatment. Required semantic content remains visible.
- Image broken/not `READY`/not authorized: do not publish that reference; in preview use the same empty fallback. Do not show an unrelated stock photo as if it belongs to the couple.
- Gallery with zero valid images: hide gallery section and anchor. Gallery with some valid images: keep their authored order and omit invalid items.
- Gift section disabled or not populated: render nothing and expose no gift CTA. Invalid QR does not block text-only account presentation if the opted-in account otherwise validates.
- External album: **not supported in v1**. No URL field exists. Do not add redirect/new-tab behavior or silently turn an arbitrary URL into an album.
- Music/media: no autoplay before a clear user action; a missing track means no control. It is outside this image matrix.

## Media field schema mapping

```ts
// Illustrative Phase 2 metadata; do not treat this snippet as an implemented config.
hero: {
  heroMedia: {
    type: 'image', contentKey: 'hero.heroMediaId', label: 'Ảnh mở đầu',
    mediaRole: 'hero', required: false,
  },
}
couple: {
  bridePortrait: {
    type: 'image', contentKey: 'couple.bride.portraitMediaId', label: 'Ảnh cô dâu',
    mediaRole: 'couple-portrait', required: false,
  },
  groomPortrait: {
    type: 'image', contentKey: 'couple.groom.portraitMediaId', label: 'Ảnh chú rể',
    mediaRole: 'couple-portrait', required: false,
  },
}
gallery: {
  media: {
    type: 'images', contentKey: 'gallery.mediaIds', label: 'Ảnh trong album',
    mediaRole: 'gallery', maxItems: 40, required: false,
  },
}
```

Equivalent item-level definitions are required for `story.milestones[].mediaId`, `weddingParty.groups[].members[].mediaId`, and `gift.accounts[].qrMediaId`; the SEO field maps to `seo.ogImageId` in the global editor. All definitions use the canonical v1 paths, the role names in the matrix, and Vietnamese labels. These mappings are acceptance guidance for later config implementation, not a new content schema.

## Media-independence checklist

- [ ] Render all user media fields empty; retain the signature, hierarchy, semantic copy, event details, and usable CTA.
- [ ] Replace every reference with unrelated neutral couple imagery; none of the theme's recognition depends on the reference wedding, bamboo, flowers, lanterns, faces, or venue.
- [ ] Repeat with bright, dark, landscape, portrait, square, and low-resolution images. Text contrast and cropping remain intentional.
- [ ] Remove and break each media role independently; verify the same meaningful fallback and no layout shift or blank section.
- [ ] Check desktop, tablet, 375px/390px mobile, touch, keyboard, and reduced motion. No horizontal overflow or photo-only action.
- [ ] Verify all selected assets are wedding-owned and READY; all meaningful photos have useful alt metadata; decorative artwork has empty alt.
- [ ] Confirm MinIO reference screenshots and real wedding names/date are absent from fixture and release bundle.

## Phase 2 acceptance map

| Decision | Acceptance |
|---|---|
| Media inventory | Every canonical user image path and global OG field has an owner, role, optionality, count, preferred ratio, crop, loading, and fallback. |
| Editor mapping | Each field has a Vietnamese picker label, canonical `contentKey`, `mediaRole`, replace/remove behavior, and list/item attachment behavior. |
| Main content protection | Essential text and actions remain outside images; missing, broken, low-quality, and awkward-ratio media have explicit outcomes. |
| Accessibility | Alt text has a defined source and an explicit frontend/projection dependency; lightbox and QR affordances are specified. |
| Album scope | Internal gallery is defined; external album is explicitly unsupported. |
| Independence | Empty, neutral, mixed-ratio, bright/dark, and low-resolution media checks are listed without relying on MinIO references. |
| Phase boundary | No media config, renderer, generated artwork, or Phase 2.5 asset has been implemented by this document. |

## Phase 2.5 handoff

The media boundary has been handed to Phase 2.5. The [artwork brief and prompts](./artwork-brief.md), [approved preview](./artwork-preview.md), and [asset manifest](./asset-manifest.md) live beside these phase documents. Approved renderer artwork is served from the public decor folder; two unused generated drafts are retained under `assets/templates/a-beautiful-day/archive/`. Temporary MinIO analysis screenshots were removed after design analysis.
