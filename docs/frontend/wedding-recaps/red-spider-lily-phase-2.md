# Red Spider Lily Recap - Phase 2 Media Contract

Last updated: 2026-08-26

Template key: `red-spider-lily-recap`
Renderer path: `frontend/src/templates/recaps/red-spider-lily/`
Media contract: `frontend/src/templates/recaps/red-spider-lily/media-contract.ts`
Fixture: `frontend/src/templates/recaps/red-spider-lily/fixture.ts`

Phase status: Phase 2 complete for the current required sections and media states. Phase 3, 4 and 5 remain open.

## Media ownership

User media is content only. Theme identity must remain visible through the vermilion/ink-ivory palette, typography, editorial composition, botanical frame, paper texture, chapter divider and renderer-owned red spider lily ornament.

Renderer-owned assets currently declared by the contract:

- `botanical-frame`
- `red-spider-lily-ornament`
- `paper-grain`
- `chapter-divider`
- `light-leak`
- `ambient-petal-or-dust`

These assets must never contain a sample couple, sample guest, real wedding data or a photo-specific crop.

## Media matrix

| Section / field | Owner | Required | Min / max | Ratio and crop | Focal point | Fallback | Mobile behavior |
|---|---|---:|---:|---|---|---|---|
| `hero.media` | User upload | No | 0 / 1 | 16:9 or 4:5, cover | User-defined | Neutral placeholder | Preserve focal point in taller 4:5 crop |
| `ourStory.media` | User upload | No | 0 / 3 | 3:4 or 4:5, cover | User-defined | Text first | Collapse to one readable image before copy |
| `chapters[].cover` | User upload | Yes per item | 1 / 1 | 4:5 or 16:10, cover | User-defined | Neutral placeholder | Title/date remain readable if image is missing |
| `moments[].cover` | User upload | Yes per item | 1 / 1 | 1:1, 4:5 or 3:2, cover | User-defined | Neutral placeholder | One-column cards do not depend on image height |
| `photoDelivery.albums` | Album reference | No | 0 / 12 | Natural | Center | Text first | Full-width readable album CTA |
| `thankYou.media` | User upload | No | 0 / 1 | 16:9 or 4:5, cover | User-defined | Text first | Closing message remains readable |
| Optional media fields | User upload | No | Declared per field | Declared per field | Declared per field | Section-specific | Remove media layer, retain semantic content |

All user image fields require alt text except album references. A failed image must converge to the same neutral or text-first state as an empty image.

## Upload and editability matrix

| Field group | Editable | Repeatable | Toggle / reorder | Guard |
|---|---:|---:|---:|---|
| Global metadata | Yes | No | No | Draft/publication permissions |
| `hero.media` | Yes | No | No | Optional, focal point preserved |
| `ourStory.media` | Yes | Yes | No | 0-3 items |
| `chapters` and covers | Yes | Yes | Reorder items | Item count and readable text guard |
| `moments` and covers | Yes | Yes | Reorder items | Item count and one-column fallback |
| `photoDelivery.albums` | Yes | Yes | Reorder albums | 0-12; source-specific validation |
| `thankYou.media` | Yes | No | No | Optional, text-first fallback |
| Optional sections | Yes | Section toggle and item edits | Reorder enabled sections | Full preview render; no orphan gap when disabled in published content |
| Theme controls | Only declared values | No | No | Palette, motion and gallery values from config |

The editor must consume `template-config.ts` section metadata and must not invent a separate recap section list.

Repeatable gallery rules for `peopleBehindTheDay` and `behindTheScenes`:

- The owner can add, remove and reorder up to 24 items.
- Each item has one cover media field plus an optional `gallery[]` with up to 12 images.
- The preview uses a horizontal snap rail so additional items remain discoverable without forcing every item into the first viewport.
- Each item exposes a `Xem khoanh khac` action. The action opens that item's gallery in a keyboard-operable lightbox.
- Empty galleries still show the cover upload slot and preserve the item title/role/caption.

## Crop, focal-point and content rules

- `cover` media uses `object-fit: cover` only after the owner chooses a focal point.
- Portrait and landscape uploads preserve the focal point and never move the heading, CTA or album controls outside the readable area.
- `natural` is reserved for album references; album thumbnails belong to the album/gallery renderer, not this theme shell.
- Long titles and descriptions wrap without changing fixed media dimensions or causing horizontal overflow.
- Missing, low-quality or failed images do not remove section headings, metadata, CTAs or album references.
- Renderer-owned decor is positioned independently from user media and is not cropped into a couple-specific frame.

## Empty, loading and error states

| State | Required result |
|---|---|
| No optional media | Keep content and show the declared neutral/text-first composition |
| Missing required item cover | Show neutral placeholder; preserve date, title and description |
| Image loading | Reserve the declared media box; do not shift text or CTA |
| Image load error | Replace the broken image with the same neutral placeholder used for empty media |
| Empty internal album | Keep photo-delivery copy visible and show unavailable/empty album message |
| Invalid external album | Do not navigate; keep photo-delivery content visible and show unavailable-album state |
| Optional section disabled | Remove it from the DOM and reconnect adjacent sections without an orphan divider |

## Album behavior

`photoDelivery`, chapter album references and moment album references support:

- `INTERNAL_ALBUM`: requires `albumId`; the gallery owns download, previous/next and mobile swipe behavior.
- `EXTERNAL_ALBUM_LINK`: requires an HTTPS `href` and a non-empty `label`; opens in a new tab with `rel="noreferrer"`.

Invalid or empty album sources fail closed to the photo-delivery section. They must not create a broken navigation target or hide the section's explanatory copy.

## Media field schema

The source schema is declared in `content.ts` and media constraints are declared in `media-contract.ts`:

- `RedSpiderLilyMedia`: `src`, `alt` and semantic `role`.
- `RedSpiderLilyAlbumSource`: `INTERNAL_ALBUM { albumId }` or `EXTERNAL_ALBUM_LINK { href, label }`.
- `hero.media`, `ourStory.media[]`, `chapters[].cover`, `moments[].cover`, `photoDelivery.albums[]` and `thankYou.media` map directly to the six required sections.
- Optional media slots are declared for all six optional sections; the preview fixture renders the sections with empty media so their fallback composition is visible.

`template-config.ts` maps the contract through `mediaContract` and records `mediaIndependent: true`, `requiredSections`, `optionalSections`, primary language and the Phase 1/Phase 2 artifact links.

## Media-independence verification

The fixture starts with `empty-user-media` and the following replacement set is required for visual review:

- neutral portrait
- landscape family scene
- dark reception scene
- bright outdoor scene
- no media

For every replacement, verify that palette, typography, layout, frame, texture, divider, renderer-owned botanical decor, section headings, CTA hierarchy and album delivery behavior remain recognizable and usable.

Forbidden dependencies are explicitly recorded in the contract:

- sample couple as theme background
- sample-photo-specific crop
- photo color as the only accent
- hard-coded gallery count

## Phase 2 checklist

- [x] Media matrix covers required sections and declared optional media slots.
- [x] Upload/editability, repeat, toggle and reorder behavior is documented.
- [x] Ratio, crop, focal point, mobile behavior, alt text and fallback rules are documented.
- [x] Empty, loading and error states are documented.
- [x] Internal and external album behavior, HTTPS validation and new-tab behavior are documented.
- [x] Media field schema is mapped to `content.ts` and `media-contract.ts`.
- [x] Media-independence replacement set and forbidden dependencies are recorded.
- [x] Repeatable people/behind-the-scenes items support a cover plus per-item gallery media.
- [x] Per-item gallery media has a horizontal rail and lightbox fallback documented.
- [x] `template-config.ts` references this Phase 2 artifact and the media contract.
- [x] Fixture starts without user media so the no-media path is reviewable.

Phase 2 is complete when this artifact, `media-contract.ts`, `content.ts`, `fixture.ts`, `template-config.ts` and the renderer agree. This does not mark later composition, motion, artwork or release-review phases complete.
