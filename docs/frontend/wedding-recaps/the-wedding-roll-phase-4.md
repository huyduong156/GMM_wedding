# The Wedding Roll — Phase 4: Interaction and Motion Baseline

Template key: `the-wedding-roll-recap`  
Renderer: `frontend/src/templates/recaps/the-wedding-roll/TheWeddingRollRecap.tsx`  
Status: available-media interactions and motion review are implemented. The public recap renderer consumes only explicitly published recap media for internal album downloads; editor authoring and catalog release gates remain tracked in Phase 5.

## Conversion constraint

This pass ports the approved standalone concept's order, imagery, mobile layout and affordances into the React recap renderer. Guest-facing copy follows the Phase 1 copy policy: it focuses on the wedding day and memories without naming the film-roll art direction. The standalone file at `/templates/recaps/the-wedding-roll/preview.html` remains unchanged.

## Technique map

| Section / element                                                  | Existing behavior carried into React                                              | Trigger and timing                                                           | Mobile, input and reduced-motion behavior                                                    |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `hero`                                                             | Static cover, stamp and frame labels                                              | No entrance animation                                                        | Same compact cover and both album anchors; keyboard uses native links                        |
| Ticker                                                             | Static repeated line with separators                                              | No auto-scroll or marquee                                                    | Crops within its existing horizontal viewport; no interaction required                       |
| `ourStory`, `chapters`, `moments`, `photoDelivery`                 | Fade and rise section reveal via `motion/react`                                   | Once at 12% in view; 800ms; ease `[0.22, 1, 0.36, 1]`; translate Y 18px to 0 | Native page scroll; section content is visible immediately when reduced motion is preferred  |
| `moments` carousel                                                 | 3D themed-card carousel with previous/next buttons and horizontal swipe            | User activation or horizontal swipe; 650ms eased transform                   | Native vertical page scroll, keyboard arrows and controls; reduced motion removes transitions |
| `photoDelivery` CTA                                                | Background rust change and 2px lift                                               | Pointer hover; 250ms, existing CSS ease                                      | Native link activation and focus ring; no hover state required for touch or keyboard         |
| `peopleBehindTheDay`, `soundtrack`, `behindTheScenes` teaser cards | One shared section reveal as in the concept; no card-specific choreography        | Same one-time section reveal timing                                          | Two-column teaser grid collapses to two columns on mobile as in source; native focus and tap |
| `weddingFilm` poster/play treatment                                | Poster opens native video controls after an explicit click when `videoSrc` exists | Section reveal; playback begins only after the user presses play             | Poster and copy remain; the play control is hidden when no source is configured              |
| `soundtrack` teaser                                                | Native audio controls render only when `audioSrc` exists                          | Explicit user activation; `preload="none"`, no autoplay                      | Teaser copy stays compact when no source is configured                                       |
| `guestbook`                                                        | Section reveal; quote cards remain static                                         | Same one-time section reveal timing                                          | Single-column compact wishes on mobile; text is visible without hover                        |
| `memoryCapsule`, `thankYou`                                        | Section reveal and static closing composition                                     | Same one-time section reveal timing                                          | Native vertical scroll and compact footer; static content for reduced motion                 |
| Persistent album action                                            | Fixed mobile CTA links to the album section or configured HTTPS album             | User activation only                                                         | Safe-area offset preserved; native link keyboard/touch behavior                              |

## Motion ownership and fallback

- `motion/react` owns the one-time section fade/rise; the old imperative `IntersectionObserver` snippet remains only in the independent HTML concept.
- CSS owns carousel depth/rotation and the existing hover color/image scale. Those effects animate transforms and opacity without changing layout dimensions.
- `useReducedMotion` disables the reveal's hidden initial state; the CSS reduced-motion rule disables smooth scrolling and shortens transitions.
- The background stays static and continuous. The film ticker remains static rather than introducing a continuous marquee.
- The approved SVG photo frames are integrated in the renderer and reviewed in the Phase 5 visual gate.

## Remaining release work

- Internal album actions use only the media items included in the recap's published snapshot; links download those selected items and never enumerate the wedding media library.
- The live recap editor still needs template-specific authoring controls for The Wedding Roll content before the template can be released in the catalog.
- The media-independence replacement audit and empty/broken-media review remain Phase 5 release checks.
- Do not add motion or new content during these remaining steps if it changes the approved concept's visual design without a separate design approval.
