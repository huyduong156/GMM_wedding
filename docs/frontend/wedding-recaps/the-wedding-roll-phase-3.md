# The Wedding Roll — Phase 3: Section Architecture

Template key: `the-wedding-roll-recap`  
Renderer: `frontend/src/templates/recaps/the-wedding-roll/TheWeddingRollRecap.tsx`  
Config: `frontend/src/templates/recaps/the-wedding-roll/template-config.ts`  
Status: section architecture and concept-matched React renderer implemented. Phase 4 interactions and Phase 5 artwork/visual review are complete; the production release gates are tracked in Phase 5.

## Design read

Mobile-first wedding photo journal for guests, using a continuous ivory paper canvas, restrained 35mm indexing and short editorial copy. Photo delivery stays easy to reach; section layouts vary without introducing unrelated page backgrounds or repeated generic cards.

## Composition map

| Section              | Layout and focal point                                                                                          | Mobile behavior                                                                   | Empty/content fallback                                                                                   |
| -------------------- | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `hero`               | Two-column film cover with expressive three-line headline, portrait, frame note, ID and circular 36-frame stamp | Headline and CTA lead; portrait remains narrow enough to keep the opening compact | Couple/copy and album links remain visible if media is later removed                                     |
| `ourStory`           | Large pull quote and short narrative paired with one offset portrait                                            | Quote/copy first, image becomes a compact crop                                    | Text still carries the section without the image                                                         |
| `chapters`           | Ruled chronological list with time, title, short description and thumbnail                                      | Three-column compact rows; no horizontal scroll                                   | Each row retains its copy if its thumbnail is unavailable                                                |
| `moments`            | Three-dimensional carousel of themed photo groups followed by a seven-frame film strip                         | Swipeable carousel with compact cards and visible previous/next controls          | Active title/caption remain readable; neighboring cards preview the next moments                          |
| `photoDelivery`      | Dark album panel inset in the continuous paper canvas, with a single high-contrast CTA                          | Panel copy stacks above a full-width action; persistent bottom action remains     | The original concept copy and anchor remain; a real album URL can replace the placeholder when connected |
| `peopleBehindTheDay` | First compact card in the optional-pages index                                                                  | Shares the two-column optional card grid                                          | Card remains text-first without a portrait                                                               |
| `soundtrack`         | Second compact card in the optional-pages index                                                                 | Same compact index footprint                                                      | Card remains informative without audio playback                                                          |
| `behindTheScenes`    | Third compact card in the optional-pages index                                                                  | Same compact index footprint                                                      | Copy remains without additional media                                                                    |
| `weddingFilm`        | Wide poster with centered play treatment and adjacent editorial copy                                            | Poster stacks above copy and link                                                 | Poster/copy remain; the existing play treatment is a static placeholder until a video source exists      |
| `guestbook`          | Three short quote cards beneath a split section heading                                                         | Single-column, compact wish list                                                  | Intro remains when the curated wish list is empty                                                        |
| `memoryCapsule`      | Short centered future-facing letter inside a bordered paper insert                                              | Narrow text measure and compact padding                                           | The note is complete without supporting media                                                            |
| `thankYou`           | Quiet album close with large copy, signature seal and three-part footer                                         | Centered close and stacked footer                                                 | Closing copy remains complete without finale media                                                       |

The page keeps one continuous paper canvas with a single inset dark album panel, light rules, numbering and film-index details. The approved SVG photo frames are recorded in the asset manifest but remain outside this reproduced concept composition.

## Layout, order and transitions

Required order: `hero → ourStory → chapters → moments → photoDelivery → thankYou`. The six optional inserts appear in fixture order after `photoDelivery` and before `thankYou`; disabled options are omitted from the DOM so no blank gaps remain. The photo-delivery portal is an intentional pause after the moments index, and the optional material stays visually subordinate to that primary task.

| Viewport          | Composition rule                                                                                                               |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Desktop ≥ 1024px  | Reading measure up to 1120px; editorial split for cover/story/film, ruled rows for chapters/credits, 3D carousel for moments |
| Tablet 601–1023px | Reduce columns and image slots; preserve section anchors and copy order                                                        |
| Mobile ≤ 600px    | Native vertical scroll, 20px side gutters, swipeable 3D moments carousel, no scroll hijacking; album action uses full width  |
| Reduced motion    | Hide no content; disable scripted reveal and smooth scrolling, keeping the full static composition available                   |

## Renderer and content ownership

- `content.ts` defines typed semantic recap content and optional-section payloads.
- `fixture.ts` maps the approved standalone concept's imagery and section structure into all twelve sections, with guest-facing copy written around the wedding day and memories rather than the film-roll art direction.
- `TheWeddingRollRecap.tsx` maps each configured section key to one `data-editor-section` anchor and renders optional content only when enabled. The standalone HTML concept remains unchanged.
- `the-wedding-roll.css` is scoped to the renderer and reproduces the concept's layout and responsive states. The preview route renders React; the independent `.html` concept remains available at its own public URL.
- Album actions use validated fixture source data when available; internal album permissions, real downloads and external URL validation remain platform responsibilities.

## Acceptance checklist

- [x] Distinct composition and content anchor defined for all six required and six optional sections.
- [x] Mobile, tablet, desktop, empty-media and reduced-motion behavior specified.
- [x] Order, optional insertion and adjacent-section transitions documented.
- [x] Typed renderer and concept-matched fixture cover all twelve sections.
- [x] Renderer and config keys match one-to-one; disabled optional sections leave no DOM gaps.
- [x] Photo delivery is reachable from the cover and persistent mobile action.
- [x] Focused renderer tests cover all anchors, optional toggles, media-free fallbacks and album CTA source behavior.
- [x] Phase 2.5 frame integration; visual screenshot review is recorded in the Phase 5 gate.
- [x] Existing section reveal, poster treatment, hover and mobile CTA behavior are carried into the React preview without adding new visual treatments.
- [x] Phase 5 responsive screenshot review and Phase 4 media-control interactions are recorded in their phase gates.

Phase 3 renderer and visual gates are complete. Catalog release stays gated by editor authoring, media independence and config/catalog audit in Phase 5.
