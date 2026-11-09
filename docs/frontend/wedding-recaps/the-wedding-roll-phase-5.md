# The Wedding Roll — Phase 5: Asset Integration, Atmosphere and Review

Template key: `the-wedding-roll-recap`  
Ready revision: `1.0.0` (`templateConfigVersion: 1`, `contentSchemaVersion: 1`)
Preview: `/templates/recaps/the-wedding-roll/preview`  
Status: The template source is `ready` for catalog sync. Public recap, preview, and live editor use the published template key and recap-selected media. Final production verification still requires a live recap rehearsal for broken-media and publication states.

## Design read and preservation boundary

Mobile-first editorial photo journal for wedding guests. Phase 5 preserves the approved concept's order, section spacing and responsive composition while guest-facing copy follows the Phase 1 copy policy. It adds the two already-approved photo frames, one small renderer-owned sprocket mark, per-content entrance choreography and low-contrast ambient movement. The standalone HTML concept remains unchanged.

## Artwork and decor map

| Asset                         | Placement                                                                | Behavior and fallback                                                                |
| ----------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `film-frame.svg`              | Hero cover overlay; transparent center leaves the cover photo as content | Static, no crop-dependent marks; full frame retained at mobile widths                |
| `film-sprocket-mark.svg`      | Three fixed page-edge ornaments outside the reading column               | Slow float/rotation, low opacity, hidden from assistive technology and pointer input |
| Paper-light drift             | Existing shared paper canvas                                             | Very slow translated radial light; no color-band or section-background changes       |

The film frame is the external SVG photo frame; the sprocket artwork is a lightweight project-authored vector. The viewfinder frame is not used because Wedding Roll does not currently accept wedding video. All source/provenance and placements are recorded in `frontend/src/templates/recaps/the-wedding-roll/ASSET_MANIFEST.md` and `assets/ASSET_SOURCES.md`. The approved preview photos remain independent replaceable content.

## Motion and interaction map

| Target                                           | Trigger                       | Motion                                                   | Fallback                                                     |
| ------------------------------------------------ | ----------------------------- | -------------------------------------------------------- | ------------------------------------------------------------ |
| Hero issue, headline, tagline, actions and cover | Enter viewport/load           | Fade-rise, 620ms, 80ms reading-order offsets             | Visible immediately with reduced motion                      |
| Story text and photo                             | Section enters at 12%         | Shared section fade-rise plus photo follow-through       | Static full content                                          |
| Chapter rows and moment cards                    | Enter viewport once           | Fade-rise, 620ms, 70ms sequential item delay             | No delay; all text/media remain visible                      |
| Contact strip frames and optional teaser cards   | Enter viewport once           | Fade-rise with short stagger                             | Static layout                                                |
| Album panel and CTA                              | Enter viewport once           | Panel, copy and CTA reveal in order                      | Native links and visible focus outline                       |
| Wishes, capsule and closing                    | Enter viewport once           | Content-level fade-rise with short stagger               | Static full content                                          |
| Guest wishes                                    | Continuous leftward marquee   | Duration scales with selected wish count at 5.88s per item (29.4s for five); pauses on hover, focus or press | Static horizontally scrollable track for reduced motion |
| Background and page-edge artwork                 | Continuous while page visible | 28s light drift; 13s sprocket float using transform only | Paused while tab is hidden; fully stopped for reduced motion |
| Links and buttons                                | Keyboard focus / press        | Rust focus outline; small pressed offset                 | Native keyboard and touch activation                         |

Motion values use opacity/transform only. `visibilitychange` pauses ambient CSS animation while the tab is hidden; `prefers-reduced-motion` pauses ambient artwork, removes reveal initial states and disables smooth scrolling. The fixed mobile album CTA remains above page content and inside the safe-area rule from the concept CSS.

## Visual review report

Rendered the React preview in Chromium at 375px and 390px mobile, 768px tablet and 1440px desktop; full-page screenshots were inspected at 390px, 768px and 1440px. Reduced-motion screenshots were inspected at 390px and 1440px. A same-origin browser viewport harness measured 375, 390, 480, 768, 1024, 1280 and 1440 widths: each rendered 12 anchors, document width matched the viewport, no heading/copy/link overflow was found, all demo images loaded, and all three ambient marks were present. The mobile order remains scan-first, with the album portal prominent and the persistent CTA separated from text. The film frame reads around the replaceable cover, the viewfinder remains on its separate image, and the background marks stay low-contrast at the page edges. The continuous paper surface and existing dark album portal remain intact. No copy, section order, or content media URL was changed.

The two frame overlays and three edge ornaments are non-interactive and outside the text column. Browser console showed only the expected Vite/React development notices and Motion's reduced-motion notice; no template runtime error was observed in the screenshots. The viewport/overflow and image-load matrix passed at all seven widths. Empty, reordered, broken-media and production authorization states remain release gates because this preview fixture does not exercise the production editor or album contract.

## Validation and release checklist

- Validation result: `npm run typecheck`, `npm run lint`, `npm run build` and the focused renderer suite (7/7) pass. The full suite passes 232/235; three unrelated invitation-editor/Astral Vow tests hit the 5s timeout when Vitest ran them concurrently. Each of those three tests passes when rerun alone. Production build completes with the repository's existing large-chunk warning.
- [x] Two Phase 2.5 approved SVG frames integrated separately; transparent photo apertures remain independent of uploaded media.
- [x] A third, source-recorded supporting artwork is added without a raster dependency.
- [x] All required and enabled optional sections retain section reveal and their individual content targets receive reveal choreography.
- [x] At least three decorative artwork instances are present around the page; all are pointer-inert and screen-reader-hidden.
- [x] Background has a slow motion effect; a page-edge motion remains visible when guests pause at any scroll position.
- [x] Ambient motion pauses on hidden tab and stops under reduced motion; section content remains visible.
- [x] Local Be Vietnam Pro and Playfair Display fonts are used; mono labels use a platform-local monospace fallback.
- [x] Mobile and desktop full-page screenshot review completed for 390px and 1440px, plus mobile reduced motion.
- [x] Verify responsive screenshots and the automated overflow/image-load matrix across 375px through 1440px, including tablet and reduced-motion views.
- [x] Typecheck, lint, focused renderer tests and production build pass.
- [x] Independently rerun all three full-suite timeout tests; each passes alone.
- [ ] Inspect production editor optional/reorder/empty/loading/error and broken-media variants against a live recap payload.
- [x] Preview photos are local generated demo media; owner media remains replaceable.
- [x] Public recap renderer selects The Wedding Roll from the published snapshot and uses only snapshot-selected media for the internal album action.
- [x] Preview renderer receives live editor updates through the existing same-origin bridge.
- [x] Shared soundtrack player requires an explicit user action and appears only when its source is configured; wedding-video upload/playback is not part of the current template.
- [x] Connect published recap content and explicitly selected internal album media through the production recap snapshot; validate and open external HTTPS album links safely.
- [x] Config-driven live editor authoring is wired for The Wedding Roll fields, optional sections, repeatable chapters/moments/people groups, media selection, and internal/external album sources.
- [x] `template-config.ts` paths, media roles, section keys, preview route, and editor field types are aligned with the renderer and recap payload.

The template is ready for catalog sync and selection. Keep the remaining live-data verification gate visible before publishing a wedding recap broadly.
