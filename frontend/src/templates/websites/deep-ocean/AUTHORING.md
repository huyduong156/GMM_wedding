# Deep Ocean - Authoring guide

## Phase 0 - direct website shell

Status: complete for the initial scaffold.

Acceptance points:

- The preview route mounts the complete Deep Ocean page directly.
- No opening overlay, open button or delayed content reveal is allowed.
- The renderer keeps all section composition in one template implementation; there is no staged six-section-only milestone.
- The public page remains usable when optional media, film URL, wishes or music are empty.
- `prefers-reduced-motion` keeps content and controls visible while removing non-essential movement.

## Phase 1 - product meaning and content system

Status: complete for the first content and art-direction pass.

### Product meaning

Deep Ocean is a calm, light wedding website for a couple who wants to invite guests into a feeling of quiet closeness: sunlit water, pearls, soft blue horizons and small coastal details. It is a living wedding website, not an online invitation with an opening ritual and not a post-event recap.

Viewer job: understand the couple's story, see the wedding-day details, browse meaningful photographs, meet the people around them, leave a wish and return to the page later as a keepsake.

Primary audience: invited guests browsing on a phone, with desktop visitors receiving a wider editorial composition without losing the mobile reading order.

Non-goals:

- Do not add an opening gate, cover lock or required click before the website content appears.
- Do not make every section look like a blue card or repeat the same wave decoration.
- Do not let imagery carry the only copy for names, dates, venue details or actions.
- Do not turn the page into a loud beach-party theme, a dark underwater interface or a travel landing page.
- Do not make music, film or animation prerequisites for understanding the wedding details.

### Experience arc

`sunlit first impression -> the couple's story -> milestones -> wedding-day details -> gallery and memories -> people who surround them -> film and wishes -> memory capsule -> quiet thank-you`

The page is immediately readable from the hero. The navigation is a small orientation device, not a blocking menu. The wedding-day section is the practical anchor. The later sections slow the pace and turn the website into a keepsake.

### Design brief

| Dimension | Decision |
| --- | --- |
| Theme | Deep Ocean |
| Visual metaphor | A pearl drifting through clear, sunlit water: calm depth with a small luminous centre. |
| Mood | Light, intimate, graceful, fresh and quietly romantic. |
| Palette | Ocean light `#B9E7F2`, pearl `#FFFDF7`, sea-glass `#D9F1EA`, sand `#EBD8BE`, deep tide `#164B62`, coral shell `#E9A58D`. |
| Display type | `Cormorant Garamond GMM` for names, large titles and the pearl-like editorial voice. |
| Body type | `Be Vietnam Pro GMM` for practical details, forms and long Vietnamese copy. |
| Utility type | `DM Mono` or the existing compact utility face for dates, labels and navigation metadata. |
| Materials | Frosted glass, pearl sheen, fine waterline rules, translucent blue planes and soft paper-like grain. |
| Signature | A single floating pearl motif that moves through selected section transitions and becomes the visual thread of the whole page. |
| Motion | Slow, low-amplitude drift and one-time reveals only; no scroll hijacking, autoplay video or perpetual busy animation. |
| Language | Vietnamese-first content with short English labels only when they serve the editorial tone. |

The deliberate risk is the pearl thread: it is not a generic wave background. It gives the page a recognisable object and a reason for the repeated circular details, while the surrounding layout stays restrained.

### Layout concept

The page alternates between open pearl-white reading fields and blue water chapters. Practical information is held in a stable translucent panel; memory sections use asymmetrical image placement so the website feels composed rather than like a sequence of cards.

```text
┌──────────────────────────────────────┐
│ small DO mark      story links       │ navigation
├──────────────────────────────────────┤
│                                      │
│  names + date                         │ hero / sunlit image
│  one-line promise       floating pearl│
├──────────────────────────────────────┤
│ story copy              portrait      │ story
├──────────────────────────────────────┤
│       vertical tide timeline          │ milestones
├──────────────────────────────────────┤
│  date / time / venue over blue plane  │ wedding day
├──────────────────────────────────────┤
│ offset editorial image grid           │ gallery
├──────────────────────────────────────┤
│ memories copy + two image frames      │ memories
├──────────────────────────────────────┤
│ people / film / wishes / capsule      │ keepsake chapters
├──────────────────────────────────────┤
│          signature and thank-you      │ footer
└──────────────────────────────────────┘
```

### Section and content matrix

| Key | Role | Canonical content anchors | Empty and fallback behavior |
| --- | --- | --- | --- |
| `navigation` | Orient the guest without blocking the page. | `navigation` links and the global `music.*` capability. | Links remain compact; music control is hidden when no track exists. |
| `hero` | Establish the couple, date and emotional thesis immediately. | `hero.brideName`, `hero.groomName`, `hero.eyebrow`, `hero.date`, `hero.tagline`, `hero.background`. | Names/date/tagline stay readable if the background is missing or broken. |
| `story` | Give the relationship a warm narrative entry point. | `story.eyebrow`, `story.title`, `story.body`, `story.image`. | Copy remains primary; image plane can collapse to a pearl surface. |
| `timeline` | Make the shared history scannable. | `timeline[].date`, `timeline[].title`, `timeline[].body`. | An empty list removes the timeline chapter without breaking the page. |
| `weddingDay` | Provide the practical wedding-day anchor. | `weddingDay.eyebrow`, `title`, `date`, `time`, `venue`, `address`, `background`. | All details remain text; the background is optional atmosphere only. |
| `gallery` | Let guests browse the couple's visual memories. | `gallery[]` media `src`, `alt`, `position`. | Empty gallery keeps its heading and shows a clear add-photos state in the editor/public fallback. |
| `memories` | Slow the page and connect small details to the larger day. | `memories.eyebrow`, `title`, `body`, `images[]`. | Text remains usable when one or both images are unavailable. |
| `people` | Acknowledge family and close friends. | `people[].name`, `role`, `image`. | Missing image removes only the frame; names and roles remain. |
| `film` | Offer a visual keepsake without making it required. | `film.title`, `film.message`, `film.poster`, `film.videoUrl`. | Empty URL shows a quiet “coming soon” state and no broken CTA. |
| `wishes` | Surface messages guests can carry with the couple. | `wishes[].author`, `wishes[].message`. | Empty state explains that wishes will appear here; no empty decorative grid. |
| `capsule` | Close the story with a future-facing message. | `capsule.eyebrow`, `title`, `message`. | Text-only pearl capsule remains complete. |
| `footer` | End with gratitude and the couple's signature. | `footer.message`, `footer.signature`, `footer.background`. | Signature and thank-you stay visible without the image. |

Canonical order:

`navigation -> hero -> story -> timeline -> weddingDay -> gallery -> memories -> people -> film -> wishes -> capsule -> footer`

All sections are designed in this phase. Optional status controls whether a section is shown; it does not defer that section to a later implementation phase.

### Fixture and editor plan

The fixture uses fictional Vietnamese names, a fictional venue and replaceable local media only. It must never contain real guest data, account data, bank details or externally licensed media.

The editor should expose the content in the same semantic grouping as the renderer. Image fields need alt text and focal position support. Repeatable fields are bounded: timeline up to 10 items, gallery up to 12 items, people up to 8 items and wishes up to 30 items. The music picker remains a global capability under `music.*`; it is not rendered as a content section.

Every public-facing value added to the renderer must have one of these owners:

1. editable template content from `DeepOceanData`;
2. a shared system capability such as `MusicPlayer`; or
3. renderer-owned atmosphere such as the pearl motif and waterline texture.

Renderer-owned atmosphere must not be exposed as user-upload fields. Required information must not be hidden inside a background image.

### Phase 1 acceptance checklist

- [x] Product type, audience, viewer job, non-goals and experience arc are documented.
- [x] Deep Ocean palette, typography, materials, motion language and pearl signature are defined.
- [x] Layout concept and mobile-first reading order are documented.
- [x] Every implemented section has a content anchor and empty/fallback behavior.
- [x] Canonical section keys and order match `content.ts`, `fixture.ts` and `template-config.ts`.
- [x] Direct-load behavior and the absence of an opening gate are explicit.
- [x] Background music is defined as a global capability using the shared component, without a visible soundtrack section.
- [x] Fixture privacy, media independence and editor ownership rules are explicit.

## Phase 2 - media contract and media independence

Status: complete for the media contract; final artwork selection is intentionally deferred.

### Scope decision

Deep Ocean supports user-owned wedding media and renderer-owned atmospheric details as separate systems. User media may personalise the page, but the theme must remain recognisable when every uploaded image, video and music track is removed.

External image URLs are not required for the template contract. The fixture uses existing local placeholder assets only for preview; production content should use approved uploads or repository assets with a known license. No remote stock image, scraped image or unverified music URL may become part of the template identity.

### User-media matrix

| Field / section | Owner and role | Count / preferred shape | Crop, focal point and loading | Alt, empty and error behavior |
| --- | --- | --- | --- | --- |
| `hero.background` | User-owned hero atmosphere | 0-1; landscape or portrait accepted; wide image preferred | `cover`; default focal point `50% 35%`; eager/high priority because it is above the fold | Alt is stored for the editor/media record; the renderer treats the plane as decorative because names/date/tagline are real text. Broken or missing media leaves the hero copy and pearl motif intact. |
| `story.image` | User-owned story portrait/detail | 0-1; portrait 4:5 preferred | `cover`; default `50% 40%`; eager after hero | Meaningful alt such as “Khoảnh khắc của Mai Anh và Hải Đăng”. Missing media collapses only the frame, never the story copy. |
| `weddingDay.background` | User-owned venue atmosphere | 0-1; landscape 3:2 preferred | `cover`; default `50% 55%`; lazy until near the section | Decorative background; venue, date, time and address remain text. Broken image falls back to the blue water plane. |
| `gallery[]` | User-owned album | 0-12; mixed orientation accepted; portrait 3:4 preferred | Each frame uses `cover`; focal point is per item; first two eager, remaining items lazy | Each item requires contextual alt. Empty gallery keeps its heading and shows an intentional empty state; one broken item is removed without collapsing the whole grid. |
| `memories.images[]` | User-owned memory details | 0-4; portrait or square preferred | `cover`; lazy; preserve item order | Alt describes the moment, not the visual style. Missing items are omitted while the memory copy stays complete. |
| `people[].image` | User-owned people portrait | 0-8; portrait 4:5 preferred | `cover`; lazy; focal point defaults to `50% 35%` | Names and roles remain visible without an image. Broken media becomes a neutral pearl frame, never a broken-image icon. |
| `film.poster` | User-owned video poster | 0-1; landscape 16:9 preferred | `cover`; lazy; focal point `50% 45%` | Poster is optional. `film.message` remains visible and an absent `videoUrl` becomes a quiet “coming soon” state with no dead CTA. |
| `footer.background` | User-owned closing atmosphere | 0-1; wide landscape preferred | `cover`; lazy; default `50% 62%` | Decorative only. Thank-you and signature remain readable over the fallback pearl/ocean surface. |
| `music.backgroundMusicUrl` | Shared music catalog / user selection | 0-1 audio track | Preload metadata; no forced autoplay; control is rendered only when a valid track is present | Missing track hides the global control. Playback failure leaves the rest of the website usable and does not block navigation. |

### Renderer-owned identity

The following are not upload fields and must not be replaced by user media:

- the pearl thread and its restrained motion;
- light ocean, pearl-white and sea-glass surfaces;
- waterline rules, subtle grain and translucent panel treatment;
- typography, spacing, section rhythm and navigation behavior;
- the global `MusicPlayer` control shape;
- reduced-motion, focus and fallback behavior.

Renderer-owned elements are atmosphere, not content carriers. They must never obscure names, dates, venue details, wishes or controls.

### Crop and responsive rules

- At 320-480px, all media remains inside the page gutter and can crop without removing the subject's primary focal point.
- At 768px and above, the layout may become more editorial, but no user image is required to occupy the desktop gutter.
- Focal positions are stored with the media object as `position`; defaults must be safe when the field is absent.
- No image may be the only source of a required name, date, location or action label.
- Prefer stable aspect-ratio frames to avoid layout shift. `object-fit: cover` is allowed only inside a bounded frame with a declared fallback.
- Decorative background planes are `aria-hidden`; meaningful inline images carry contextual alt text. Decorative pearl marks use empty alt or `aria-hidden`.

### Loading, performance and failure policy

- Hero imagery is the only eager visual priority. Gallery, memory, people and film media are lazy-loaded as they approach the viewport.
- Use transform/opacity for media reveals; do not animate width, height, crop geometry or persistent heavy blur.
- A broken media item must not produce a console-breaking exception or remove its surrounding content.
- Empty media must render a designed surface or empty state, not a blank broken-image box.
- Music never blocks first paint and autoplay remains subject to browser policy. Editor mode must not unexpectedly start playback.
- Alt text is authored with the media record and should identify the moment or subject in plain Vietnamese; it must not describe CSS or the template theme.

### Media-independence verification

Before artwork integration, verify all of the following:

1. Remove every image URL: names, story copy, wedding-day details, people labels, film message, capsule and footer still form a complete page.
2. Replace every image with a broken URL: the page keeps its layout, no broken-image icon is exposed as the primary experience, and no runtime error occurs.
3. Remove `music.backgroundMusicUrl`: there is no disabled empty music button and no content movement caused by the missing control.
4. Use long Vietnamese names, long venue addresses and narrow 320-390px widths: text remains readable and does not overflow the media frames.
5. Test mixed portrait/landscape gallery items: frame heights remain stable and focal positions remain usable.
6. Enable reduced motion: media remains visible and readable while non-essential reveal/drift motion is removed.

### Phase 2 acceptance checklist

- [x] User-media matrix records owner, count, preferred shape, crop, focal point, loading, alt, empty and error behavior.
- [x] Renderer-owned Deep Ocean identity is separated from editable media.
- [x] Responsive crop, stable-frame and desktop-gutter rules are explicit.
- [x] Music behavior is documented as a non-blocking global capability.
- [x] Media loading, performance, accessibility and failure rules are documented.
- [x] Media-independence verification cases are defined before final artwork integration.
- [x] No generated artwork, stock download or unverified external asset was added in Phase 2.

## Phase 2.5 - decor asset pre-production

Status: approved; generated asset set is complete and is ready for renderer integration.

Artifacts:

- [Asset manifest v2](./ASSET_MANIFEST_V2.md)
- [Prompt/provenance record v2](./PHASE-2.5-PROMPTS-V2.md)
- [Preview sheet and approval checklist v2](./ASSET_PREVIEW_SHEET_V2.md)

The candidate set now contains eight renderer-owned roles: a richer shell-pearl identity motif, sea-glass corner ornament, stationery/shell/coral props, one small ripple detail, two individual water bubbles, one soap bubble and one pale coral-red starfish. The previous full caustic veil, sprite sheet, large divider/ripple and artificial-looking bow/spark candidates were rejected in favor of smaller natural cutouts. The current artifacts are the v2 manifest, prompt record and preview sheet.

## Phase 3 - section architecture and visual composition

Status: complete for the section skeleton, composition map, transition map and responsive fallbacks.

The renderer keeps twelve Deep Ocean section keys mapped one-to-one with the editor markers. Required sections remain stable, optional sections are removed from the DOM when disabled, and navigation derives its anchors from the enabled section set. Each chapter uses a distinct reading mode: horizon, split portrait, timeline, utility card, contact sheet, memory diptych, portrait credits, poster feature, quote wall, letter panel and farewell.

The full composition and acceptance artifact is [Phase 3 section architecture](./PHASE-3-SECTION-ARCHITECTURE.md). Phase 4 owns motion choreography; Phase 5 owns artwork placement, atmosphere, visual review and release validation.

## Phase 4 - advanced visual experience, interaction and motion

Status: complete for the tide reveal system, desktop-only hero depth, repeated-item stagger and reduced-motion/mobile fallbacks.

Deep Ocean uses one motion language across the page: restrained tide reveals and a shallow hero parallax on desktop fine-pointer devices. It keeps one continuous pearl canvas across all sections; section rhythm comes from spacing, seams, image planes and typography rather than independent background color bands. The technique map and acceptance checklist are documented in [Phase 4 motion techniques](./PHASE-4-MOTION-TECHNIQUES.md).

## Phase 5 - asset integration, atmosphere, review and release

Status: code-complete; browser screenshot review remains the final release gate.

Approved renderer-owned artwork is integrated as bounded, low-opacity decor in the hero, story, timeline, wedding-day, memories, capsule and footer chapters. A five-bubble hero atmosphere pauses outside the viewport and while the tab is hidden, with a static reduced-motion fallback. The page keeps one continuous pearl canvas and remains mobile-first. See [Phase 5 release review](./PHASE-5-RELEASE-REVIEW.md) for the decor map and release checklist.

## Content and editor contract

The canonical section keys are:

`navigation`, `hero`, `story`, `timeline`, `weddingDay`, `gallery`, `memories`, `people`, `film`, `wishes`, `capsule`, `footer`.

Do not rename these keys or the corresponding `data-editor-section` attributes without updating the website editor contract and tests. The order is user-configurable only through the standard `enabled` and `order` arrays.

Background music is a global capability, not a page section. Keep its fields under the `music.*` content path and render the shared `MusicPlayer` outside the section-order loop. Do not add a visible soundtrack section or an opening gate to make music start.

## Visual guardrails

- Keep the palette light and coastal: bright ocean blue, pearl, soft sand and sea-glass accents.
- Use the existing background-image helper for full-bleed visual planes; required names, dates and actions must remain real text outside the image.
- Keep user media replaceable. The theme identity must still work with fixture images removed or broken.
- Preserve readable contrast, visible keyboard focus and touch-sized controls.
- Keep the page scroll-native; do not add scroll hijacking or a desktop-only interaction.

## Media and music behavior

- Hero, wedding-day and footer backgrounds use `DeepOceanMedia` with an explicit alt label and optional focal position.
- Gallery and memory images are lazy-loaded where appropriate and retain meaningful alt text.
- `MusicPlayer` is mounted only when `music.backgroundMusicUrl` is present. Autoplay remains subject to browser policy and is disabled in editor mode.
- The music control is decorative to the page flow: it must never cover headings, forms or primary actions.

## Release checklist

- [ ] Replace fixture media with approved, licensed or user-provided media.
- [ ] Verify the page at narrow mobile and wide desktop widths with no horizontal overflow.
- [ ] Verify missing media, empty music, reduced motion and keyboard focus states.
- [ ] Run the focused Deep Ocean test and the frontend typecheck.
- [ ] Confirm editor updates preserve `music.*` paths and section order normalization.
