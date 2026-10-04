# Sunlit Silk - Phase 3 section architecture

Status: **Complete; ready for Phase 4 motion/interaction**

Phase 3 locks the reading skeleton before motion or raster integration. The invitation remains a vertical paper/linen card inside the 480px stage. Required information stays text-first; approved artwork is decorative and never owns content.

## Composition map

| Order | Section key | Catalog layout | Visual anchor | Approved decor | Transition / fallback |
| ---: | --- | --- | --- | --- | --- |
| 1 | `opening` | `envelope-reveal` | Diagonal ribbon and clasp ritual | ribbon-clasp, floral cluster | static opened card when motion is reduced or artwork fails |
| 2 | `cover` | `layered-paper-theatre` | Couple names/date on cotton-paper plane | floral sculpture, linen fold | typography/monogram-only fallback |
| 3 | `invitation` | `seal-and-ribbon` | Guest-name line and embossed rule | ribbon tail, orchid petals | plain paper sheet |
| 4 | `families` | `dual-cards` | Two family columns with center seam | floral cluster at low density | stacked mobile cards |
| 5 | `eventDetails` | `date-diptych` | Ceremony/reception time blocks | brass clasp detail from key art only | text rows, no media dependency |
| 6 | `countdown` | `floating-counters` | Four-unit countdown on linen rail | orchid petals at 8% opacity | static numerals, 2x2 mobile grid |
| 7 | `calendar` | `linen-month-grid` | Selected date shape + text | linen fold edge bleed | native month grid |
| 8 | `timeline` | `vertical-timeline` | Stitched vertical route | orchid petals, CSS stitch | plain list when empty |
| 9 | `venue` | `venue-card-over-map` | Address card above map/action | linen envelope at low opacity | address/link if map fails |
| 10 | `activities` | `stitched-list` | Optional activity rows | no required artwork | text-only item fallback |
| 11 | `gallery` | `linen-stack` | Controlled paper stack/gallery | floral sculpture and linen fold | manual 1–2 image stack |
| 12 | `rsvp` | `reply-card` | Reply card with clear form states | ribbon tail corner | accessible single-card form |
| 13 | `guestbook` | `stacked-notes` | Approved wishes as paper notes | cotton paper stack | form remains when list empty |
| 14 | `gift` | `single-qr-card` | Quiet optional giving card | brass/linen CSS accents only | text/account fallback |
| 15 | `music` | `music-dock` | Small post-open player control | none | disabled control when unavailable |
| 16 | `footer` | `closing-letter` | Thank-you letter and closing knot | ribbon-clasp/linen fold | static paper footer |

## Layout rules

- No layout pattern is used more than twice in succession; image-rich sections alternate with text/card sections.
- `opening`, `cover`, `invitation`, `families`, `eventDetails` and `footer` are core and cannot be toggled.
- `countdown`, `calendar`, `timeline`, `venue`, `gallery`, `rsvp` and `guestbook` are supported default-on toggles. `activities`, `gift` and `music` are supported default-off toggles.
- Optional sections leave the DOM when disabled; no spacer remains.
- All copy, dates, addresses, family roles, RSVP and guestbook states remain readable without artwork.
- Renderer-owned decor is `aria-hidden`, `pointer-events: none`, clipped inside `.ss-stage`, and mapped by section rather than globally repeated.

## Responsive and state map

- 375/390px: one-column composition, 16-24px inner gutters, no horizontal scroll; family/timeline/cards stack vertically.
- 480px: maximum invitation stage; artwork is clipped only inside the stage safe zone.
- Tablet/desktop: stage remains capped at 480px and is centered with outside breathing room; no desktop-only alternate content.
- Long names/addresses wrap naturally; no text is placed on a decorative bitmap.
- Missing/broken artwork removes only the decorative layer and leaves the same-size paper/CSS fallback.
- Reduced motion disables opening travel, ambient drift, parallax and carousel autoplay; all semantic content is immediately visible.

## Phase 3 acceptance gate

- [x] Required and supported optional section keys mapped.
- [x] Each section has a distinct layout/anchor and mobile fallback.
- [x] Approved artwork roles have section ownership and safe-zone rules.
- [x] Empty, missing-media and reduced-motion behavior is defined.
- [x] Skeleton config mirrors the shared invitation config shape.
- [x] Skeleton renderer is expanded from shell into section components.
- [x] Phase 3 visual review at 375px, 390px, 480px, tablet and desktop (shell constraints and type/layout audit).

Phase 4 may now start: the shell, section order, layout anchors and fallback boundaries are locked.
