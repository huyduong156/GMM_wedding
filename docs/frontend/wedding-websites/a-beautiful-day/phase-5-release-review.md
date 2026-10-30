# A Beautiful Day — Phase 5 Release Review

> **Visual revision 2026-10-30:** the previous Phase 5 artwork QA proves source fidelity but did not prove composition quality. A full-page desktop/mobile review found the stage curtain dominant, the photoreal decor mismatched with editorial typography, and repeated props competing with information. The design correction and its updated screenshot review are recorded below; the separate media-projection/version-release blockers are unchanged.

Status: Phase 5 frontend implementation and artwork QA completed 2026-10-23. `template-config.ts` remains `draft` / `0.1.0` until the public media projection and release workflow can supply approved image URLs with accessible alt text and pin a released template version.

## Implemented

- The former curtain/lantern ambient layer has been retired. Semantic entrance, bounded hero-photo depth, desktop story progress and gallery hover remain; reduced motion, editor mode, touch/mobile, hidden tabs and an open gallery preserve the static layout.
- RSVP and guestbook forms use the shared public interaction hooks. They pass the personal guest name when a guest link is used, distinguish pending/error/success, and stay disabled in draft/editor preview. Approved wishes from the snapshot remain visible while the live wish request loads.
- The optional music control resolves the selected ready track through the existing public catalog and starts only after a user presses play. Playback stops when the tab is hidden or the component unmounts. Missing, unready, or failed tracks leave no broken control.
- Public SEO metadata uses the configured `seo.title`, `seo.description`, and an actual URL from `seo.ogImageId`, with the shared website fallback when no image URL is present. Canonical URL remains the public wedding route.
- Each public event has a downloadable RFC 5545 `.ics` calendar action with UTC event time and escaped summary/location. Invalid or non-public events do not receive the action.
- The A Beautiful Day template is registered for editor catalog/config resolution. Its direct preview route uses the live-editor message bridge and canonical content adapter; the public website dispatcher passes the immutable snapshot through the same renderer and existing guest, RSVP, wish, and music APIs.
- Fourteen approved PNG sources were resized where appropriate and encoded as lossless WebP. The decoded visible RGB and every alpha value match the resized source. A 28-cell contact sheet reviewed each optimized transparent edge on ivory and dark backgrounds. The public bundle is 7,200,926 bytes versus 28,177,172 bytes for the original set (74.4% smaller). Originals remain under `assets/templates/a-beautiful-day/originals/`.

## Release gates

| Gate | Result | Evidence / remaining work |
| --- | --- | --- |
| Artwork approval, dimensions, alpha fidelity, light/dark edge review, budgets | Pass | [`asset-manifest.md`](./asset-manifest.md), local ignored `tmp/abd-p5-asset-report.json`, `tmp/abd-p5-alpha-contact.png` |
| Source-to-public image paths | Pass | Renderer and artwork docs reference the WebP bundle; source template directory contains no artwork folders |
| Preview, editor bridge, registry mapping | Implemented; saved editor round trip pending | Preview consumes live editor state and shared bridge events; verify after the template version is available through catalog/content APIs |
| RSVP and guestbook API adapters | Implemented; backend smoke pending | Existing shared public hooks are used; backend is outside this frontend-only phase |
| Music playback and event calendar | Implemented; runtime smoke pending | Public READY track lookup, click-to-play, visibility cleanup, and `.ics` generation are wired |
| SEO title, description, canonical and Open Graph image | Implemented; crawler snapshot smoke pending | Shared metadata helper reads nested template SEO and safely ignores media IDs without a URL |
| User-media READY projection with accessible alt text | **Blocked** | Current immutable publication payload has no normalized READY media projection. Do not infer image readiness or alt text from an ID. Complete the media contract in a separate cross-system change, then validate missing, PROCESSING, FAILED, and READY assets. |
| Template release/publish | **Blocked** | Draft `0.1.0` is not present as a released catalog version. Keep the status unchanged until the normal validation and version-release workflow has run. |

## Review boundaries

This phase changes frontend template source, frontend preview/public routing, frontend metadata handling, approved public artwork formats, and frontend theme documentation. It does not change backend contracts or database schemas. It does not claim a public release, successful API transaction, or social-crawler verification without the corresponding environment checks.

## Validation

- Visual alpha inspection: 28 optimized-artwork/background combinations reviewed from `tmp/abd-p5-alpha-contact.png`.
- Pixel check: all 14 outputs report `alphaDifferences: 0` and `visibleRgbDifferences: 0` against their resized source.
- Frontend typecheck, lint, and production build passed after integration. The build generated its release bundle with 14 existing released templates; A Beautiful Day remains excluded while draft. The 2026-10-30 production build passes and reports large chunks (1,387.60 kB main JS; 1,017.23 kB image editor).
- Browser/API smoke for saved-editor publication, public interaction endpoints, and crawler metadata remains pending until the media projection and template release gates are resolved; see the template [`README.md`](../../../../frontend/src/templates/websites/a-beautiful-day/README.md) for the full validation commands.

## Visual review and correction — 2026-10-30

- Desktop and mobile screenshots were reviewed against the Phase 1 art direction, the Phase 3 section map and the media-independence requirement.
- Retired the full-bleed curtain stage and removed all 14 raster decorations from the renderer. `ABeautifulDayBotanical.tsx` provides the new lightweight, theme-colored SVG signature.
- Rebalanced the hero around names/event facts and a single couple photo; mobile stacks it in reading order. The no-photo fallback is a quiet garden color field with initials.
- Increased usable contrast with berry actions/headings, apricot markers and garden-green surfaces. Repeated chapter props were removed; information chapters now keep a clear, quiet background.
- The 2026-10-23 screenshots are historical evidence only; the revised desktop/mobile screenshots are recorded below. Media projection, release and live API smoke remain blockers to public release.


### Visual browser review — 2026-10-30

The revised renderer was opened with all required and optional sections enabled at 1440px desktop and 390px mobile in reduced-motion/static presentation. Final frontend typecheck and lint pass; production build passes with the existing large-chunk warning (1,387.44 kB main JS, 1,017.23 kB image editor). Review screenshots are `tmp/abd-visual-revision/all-1440.png` and `tmp/abd-visual-revision/all-390.png` (temporary, ignored artifacts).

- All 16 visual sections rendered at both widths, including party, dress code, travel, FAQ, gift and forms.
- No horizontal overflow; no broken `<img>` elements. The hero photograph and all photo roles remain content media; the portrait frame uses a slim double line and two approved floristry clusters.
- No curtain element remains in the DOM and no request to the retired `a-beautiful-day/decor/` WebP set was made.
- Chapter backgrounds and image frames remain continuous across the default order. The only strong color fields are announcement, countdown/garden panels and footer; RSVP and address copy remain readable and easy to scan.
- Media-independence still depends on the existing READY + alt-text public projection. The fallback was visually checked as a typographic garden field, not as a release substitute for the missing public projection.

## Follow-up visual reset — 2026-10-30

The berry/apricot/garden-green iteration and SVG ornament were too busy for the requested gentle white/beige direction. Treat the screenshots above as evidence for that superseded iteration only. The current renderer uses a near-white/pale-beige palette, warm dark text, local Vietnamese font aliases, neutral section surfaces and no header or floating motion toggle. The illustrative fake map was removed so venue addresses and real directions carry the section. One previously approved Phase 2.5 floristry asset (`abd-floral-bamboo-cluster-v05.webp`) is restored to the public bundle and used once at low visual weight in the footer; no new artwork was generated. Curtains and lanterns remain archived.

The demo fixture's dress-code palette was reduced to ivory and beige. Announcement, countdown, forms and footer now use the same low-contrast warm-paper system, with taupe reserved for actions and metadata. The publication content/API contract and release gates remain unchanged.

The follow-up browser review rendered all 16 sections at 1440px and 390px. Both widths have no header, the local `Be Vietnam Pro GMM` and `Lora GMM` faces resolve, the approved footer floristry element is present, and no image element is broken. Mobile scroll width is 390px at a 390px viewport; desktop content remains within the viewport. Screenshots are `tmp/abd-visual-revision/all-1440.png` and `tmp/abd-visual-revision/all-390.png` (temporary, ignored review artifacts).

## Visual refinement follow-up — 2026-10-30

The next review request identified missing floral detail, heavy heading typography, hard-edged form controls, weak contrast in some surfaces, and an unbalanced album grid. The renderer now uses approved Phase 2.5 floral variants from the preserved archive: story cascade, gallery spray, crescent chapter accents and a single blossom shared across quieter chapters; the approved v05 footer arrangement remains. Curtains remain out of the composition. No new artwork was generated.

Display text uses the local Cormorant Garamond face at regular weight and body/control text uses local Nunito Sans. Section flowers get one short reveal as each chapter first enters view, with a static reduced-motion/editor fallback. Album images use a dense editorial grid with aligned outer edges, responsive tablet/mobile variants, retained captions and existing lightbox behavior. Forms use rounded warm-paper fields, legible placeholders and a strong focus ring. Dark lightbox controls retain light foreground text while the rest of the chapters use dark text on pale surfaces.

The latest palette refinement uses one continuous ivory-beige page canvas with a faint pale butter-yellow wash. Hero, announcement, story, countdown, party, gallery and footer sections stay transparent so there are no separate background bands. Thin warm-gold borders and the approved floral artwork distinguish chapter transitions; text remains warm dark brown for contrast.

The lantern direction now adds five placements of the three previously approved Phase 2.5 lantern artworks as a larger fixed top-edge canopy with visible fine suspension cords. The round and oval foreground forms stay crisp with higher opacity; three smaller placements recede with lower opacity and more blur. A short settling entrance runs once; reduced motion keeps the canopy still. The entire page palette follows the lantern paper's ivory, honey-gold and warm brown tones, and the continuous shared background remains intact. The hero contains only the couple's names and portrait. Its current composition uses a clean double-line paper frame, overlays both names on the lower image over a dark fade, and adds the approved v04 crescent and v06 cascading flower clusters at opposite corners.

### Hero frame and floristry review — 2026-10-30

The former arch frame is replaced by a straight-sided ivory mat with an inset gold hairline and a subtle offset backing. Names sit over a lower-image fade. The approved v04 crescent sits on the left edge and the v06 cascade on the right; mobile sizing moves both clusters outward to protect the couple in the photo. Review at 1440px and 390px found all 16 sections, no broken images and no horizontal overflow (390px mobile scroll width).
