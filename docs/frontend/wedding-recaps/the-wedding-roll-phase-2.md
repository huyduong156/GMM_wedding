# The Wedding Roll — Phase 2 Media Contract

Template key: `the-wedding-roll-recap`
Product type: `WEDDING_RECAP`
Preview: [`/templates/recaps/the-wedding-roll/preview`](http://localhost/templates/recaps/the-wedding-roll/preview)
Source contract: [`media-contract.ts`](../../../frontend/src/templates/recaps/the-wedding-roll/media-contract.ts)
Template mapping: [`template-config.ts`](../../../frontend/src/templates/recaps/the-wedding-roll/template-config.ts)
Phase status: media contract and config mapping complete. The React renderer and concept-matched fixture now exist; a renderer-level image replacement screenshot audit remains pending.

## Ownership and identity

All couple, family, guest, ceremony, reception, video-poster, and album imagery is replaceable user content or an authorized platform album reference. No sample image is allowed to carry the visual identity.

Renderer-owned identity is CSS and typography: the continuous ivory paper surface and light grain, rust-orange index marks, film frames/perforations, chapter numbers, quiet dividers, and editorial type hierarchy. These decorative elements do not need editor image fields and must not depict a sample couple. No final artwork asset is introduced in this phase.

## Shared media processing

- User image uploads use the existing Wedding media pipeline: 10 MB maximum, maximum 2400 px dimension, WebP storage at quality 90.
- Valid in-limit WebP assets should retain their original bytes per the shared media behavior; no template-specific recompression is added.
- Warn the owner when a source image has a long edge below 1200 px for large cover use. The renderer must avoid extra zoom and must keep text/frame hierarchy independent of image resolution.
- Reserve frame dimensions before loading. Use responsive `srcset`/`sizes` where derivatives are available, asynchronous decode, eager/high priority for the hero image only, lazy loading below the fold, and load gallery images on explicit open.
- Informative uploaded images require descriptive alt text. Decorative paper/frame details use CSS and are hidden from assistive technology. Do not repeat adjacent visible couple names in image alt text.
- Failed/slow image loads retain the title, copy, labels, CTA, and paper composition. Use the same neutral frame as the empty state; do not collapse the semantic row or expose a broken-image icon.

## Per-section media matrix

| Section / field | Role and owner | Required / limit | Ratio, crop, focal point, fit | Loading and alt | Empty, error, low-resolution and mobile behavior | Editing |
|---|---|---|---|---|---|---|
| `hero.media` | Cover photo, user upload | Optional, 0–1 | 3:2 desktop / 4:5 mobile; cover; owner focal point; `cover` | Eager/high priority; alt required | Neutral film frame retains names/date/action; same frame on error; warn below 1200 px, no extra zoom; taller mobile crop preserves focal point | Replace, alt and focal point |
| `ourStory.media[]` | Story photos, user upload | Optional, 0–3 | 3:4 or 4:5; cover; owner focal point; `cover` | Lazy; alt required | Text-first if absent/error; no extra enlargement; mobile shows at most one compact image before copy | Add/remove/reorder; replace, alt and focal point |
| `chapters[].cover` | Chapter cover, user upload | Optional per chapter, 0–1 | 4:5 or 16:10; cover; owner focal point; `cover` | Lazy; alt required | Neutral frame preserves time/title/copy; low-res cover never determines row height; mobile thumbnail stays small and fixed | Replace, alt and focal point; item CRUD is separate |
| `chapters[].gallery[]` | Chapter gallery, user upload | Optional, 0–12 per chapter | Natural ratio; natural; center; `contain` in viewer | Load on explicit open; alt required | Hide failed items and retain remaining sequence; no forced upscale; mobile viewer has close/previous/next and swipe without blocking vertical page scroll | Add/remove/reorder; edit alt |
| `moments[].cover` | Themed moment cover, user upload | Optional per moment, 0–1 | 1:1, 4:5 or 3:2; cover; owner focal point; `cover` | Lazy; alt required | Text-first frame retains theme label/action; low-res media is not zoomed aggressively; mobile title/action precede the compact image | Replace, alt and focal point; item CRUD is separate |
| `moments[].gallery[]` | Moment gallery, user upload | Optional, 0–24 per moment | Natural ratio; natural; center; `contain` in viewer | Load on explicit open; alt required | Skip failed images; keep moment title and copy; do not stretch; mobile opens only after a clear action and keeps native vertical scroll | Add/remove/reorder; edit alt |
| `photoDelivery.albums[]` | Internal album references, platform-owned | Optional, 0–12 | N/A; gallery uses natural aspect ratio | CTA eager; authorized thumbnails lazy; alt required per photo | Empty/unavailable state explains why no album is available; never expose private/unpublished media; full-width mobile primary action does not depend on a thumbnail | Select/remove internal albums and edit labels; album media permissions stay with platform |
| `photoDelivery.externalAlbumUrl` | External album link, owner-supplied HTTPS URL | Optional, 0–1 | N/A | CTA eager; no remote thumbnail scraping | Validate HTTPS and reject credentials; open in a new tab with `noopener noreferrer` and an explicit “mở tab mới” label; invalid/unavailable URL preserves the explanation and says album unavailable | Edit URL and visible album label |
| `thankYou.media` | Closing photo, user upload | Optional, 0–1 | 16:9 or 4:5; cover; owner focal point; `cover` | Lazy; alt required | Text-first thank-you on empty/error; do not zoom low-resolution image; mobile stacks copy before media or omits the media in compact mode | Replace, alt and focal point |
| `guestbook.media` | Supporting wish photo, user upload | Optional, 0–1 | 1:1 or 4:5; cover; center; `cover` | Lazy; alt required | Hide media on empty/error; wishes stay readable; on mobile omit the image before making the compact wish list taller | Replace and alt |
| `peopleBehindTheDay[].portrait` | Person portrait, user upload | Optional, 0–1 per person; up to 24 people | 1:1 or 4:5; cover; owner focal point; `cover` | Lazy; alt required with person/role context | Text-first name/role/note on empty/error; avoid upscaling; mobile compact snap rail or ordered list with names always visible | Replace, alt and focal point; person item CRUD/reorder |
| `peopleBehindTheDay[].gallery[]` | Person/group moments, user upload | Optional, 0–12 per person | Natural ratio; natural; center; `contain` in viewer | Load on explicit open; alt required | No gallery action if no publishable items remain; skip failed images; mobile lightbox has visible close controls and swipe | Add/remove/reorder; edit alt |
| `weddingFilm.poster` | Video poster, user upload | Optional, 0–1 | 16:9; cover; owner focal point; `cover` | Poster lazy; alt required; video source preload `none` | Static poster/title if video absent or fails; low-res poster is not zoomed; mobile uses native video controls after explicit play; never autoplay | Replace poster, alt, focal point and video source |
| `soundtrack.cover` | Track cover, user upload | Optional, 0–1 | 1:1; cover; center; `cover` | Lazy; alt required; audio preload `none` | Track/artist and explicit play control work without cover or when it fails; no autoplay | Replace cover/alt and edit track/source metadata |
| `behindTheScenes[].cover` | Preparation/candid cover, user upload | Optional, 0–1 per item; up to 24 items | 3:2, 4:5 or 9:16; cover; owner focal point; `cover` | Lazy; alt required | Caption/title remain in ordered text-first contact sheet on empty/error; no aggressive crop of low-res image; mobile snap rail with vertical ordered fallback | Replace, alt and focal point; item CRUD/reorder |
| `behindTheScenes[].gallery[]` | Item gallery, user upload | Optional, 0–12 per item | Natural ratio; natural; center; `contain` in viewer | Load on explicit open; alt required | Hide failed items and preserve captions/order; no stretched thumbnails; mobile gallery opens by explicit action and supports swipe/close | Add/remove/reorder; edit alt |
| `memoryCapsule.media` | Letter support photo, user upload | Optional, 0–1 | 4:5 or 3:2; cover; center; `cover` | Lazy; alt required | Message and date remain first on empty/error; low-res image stays secondary; mobile stacks message before photo or omits it in compact mode | Replace, alt and focal point |

## Album source behavior

`photoDelivery.albums[]` supports `INTERNAL_ALBUM` references to albums and media that are authorized for public publication. The internal viewer owns thumbnail loading, previous/next, mobile swipe and download. It must never infer that every Wedding upload is public.

`EXTERNAL_ALBUM_LINK` requires a visible label and a valid HTTPS URL. Open it in a new tab using `target="_blank"` and `rel="noopener noreferrer"`; label the action as an external album that opens a new tab. Do not embed or scrape remote contents. If a URL is invalid, absent, or unavailable, show a clear unavailable state and retain the surrounding album explanation. Do not represent an external link as a platform-managed download.

On mobile, the album action remains full-width with a minimum 44 px hit area. The hero/header action and persistent mobile album action jump to `photoDelivery`; this behavior remains useful even when the album has no cover image. No image may gate access to the CTA.

## Media and editor field map

| Editor field group | Media/control ownership |
|---|---|
| Hero | Owner can replace one cover image, provide required alt text, and set a focal point |
| Story | Owner can add up to three support photos; each has alt and focal point |
| Chapters | Chapter text/item controls are separate from an optional cover and gallery; each image has alt/focal point |
| Moments | Themed item controls are separate from an optional cover/gallery; each image has alt/focal point |
| Photo delivery | Owner selects authorized internal albums or enters an HTTPS external album URL plus visible label; no photo upload field duplicates the album manager |
| Thank-you | Optional closing image with alt/focal point |
| Guestbook | Optional supporting photo; wishes are selected approved records, not arbitrary public uploads |
| People behind the day | Repeatable credit cards with optional portrait and gallery; names/roles remain editable without media |
| Wedding film | Optional user poster and video source; poster alt/focal point; playback is explicit |
| Soundtrack | Optional user cover plus track metadata/source; playback is explicit |
| Behind the scenes | Repeatable cover/gallery items with alt/focal point and caption |
| Memory capsule | Optional support photo; message remains primary |
| Theme identity | Renderer-owned CSS paper, grain, frame, perforations, rust index and divider; no editor image fields |

## Media-independence audit plan

| Replacement scenario | Expected result |
|---|---|
| Replace every wedding photo with unrelated neutral portraits/landscapes | Ivory/rust film-journal identity remains clear from type, frame, grain and index marks |
| Use both bright outdoor and dark reception images | Text, dates, controls and captions remain readable; no section assumes a particular image tone |
| Mix portrait, landscape and square sources | Saved focal point and declared ratio keep images intentional; no horizontal overflow or collapsed section |
| Substitute low-resolution photos | Owner-facing warning is available; rendered content remains stable without aggressive zoom or blur effects |
| Remove all photos and posters | Titles, story, chapter/moment content, wishes, album CTA, video fallback and thank-you remain complete |
| Remove all optional media and disable optional sections | No empty gaps, orphan frames or broken transitions; required photo-delivery path is unchanged |
| Empty or invalidate album sources | The album portal explains its state, does not expose unauthorized files, and does not falsely promise downloads |

The source/config has explicit role and fallback mapping for every slot. The visual media-independence screenshot review can now use the React renderer and concept-matched fixture; it remains a Phase 4/5 review gate and is not marked passed here.

## Phase 2 acceptance

- [x] Media role, owner, requirement and item limits are specified for all six required and six optional sections.
- [x] Ratios, crop, focal point, object-fit, alt, loading, error, low-resolution and mobile behaviors are specified per media slot.
- [x] Internal and external album behavior, URL validation, new-tab behavior, empty/unavailable states and public authorization boundaries are defined.
- [x] Renderer-owned identity is separated from user content and has no image input.
- [x] Shared upload constraints are reused; no theme-specific upload processing is introduced.
- [x] `media-contract.ts` and the corresponding `template-config.ts` mapping exist with development status.
- [x] Media-independence scenarios are recorded; browser screenshot audit remains explicitly pending until renderer/fixture phases.

Phase 2 contract is complete. Continue with Phase 2.5 decor pre-production only after this contract is accepted; do not begin the React renderer before its asset/section phases are ready.
