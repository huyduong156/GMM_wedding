# Red Spider Lily Recap - Phase 3 Section Composition

Last updated: 2026-08-26

Template key: `red-spider-lily-recap`
Renderer: `frontend/src/templates/recaps/red-spider-lily/RedSpiderLilyRecap.tsx`
Config: `frontend/src/templates/recaps/red-spider-lily/template-config.ts`

Phase status: Phase 3 complete for the current twelve-section preview renderer and optional-section insertion model. Phase 4 and Phase 5 remain open.

## Composition principles

`Red Spider Lily` is an editorial album, so each section has a distinct reading mode. The composition must preserve the recap arc:

`hero -> ourStory -> chapters -> moments -> photoDelivery -> optional inserts -> thankYou`

Required sections cannot be removed. The theme preview renders all six optional sections as a complete showcase. Published recap content can disable optional sections after theme selection; disabled sections disappear from the DOM. Optional sections are inserted between `photoDelivery` and `thankYou` without replacing either required section.

## Section composition map

| Section | Layout | Content anchor | Transition into section | Empty/content fallback |
|---|---|---|---|---|
| `hero` | Full-viewport cover with layered botanical thread | Couple, date/place, tagline, open-album CTA | Ink cover opens into ivory story field | Neutral media placeholder; text and CTA remain |
| `ourStory` | Three-column editorial text/media composition, collapsing to stacked mobile flow | Eyebrow, emotional title, body, optional quote | Paper/ivory handoff from cover | Text-first story with one neutral media frame |
| `chapters` | Vertical editorial timeline with numbered rows and asymmetric cover | Date label, chapter title, description, optional album CTA | Thin paper divider continues the botanical thread | Placeholder cover while metadata remains visible |
| `moments` | Dark-background asymmetric feature grid | Group title, description, album affordance | Deep vermilion/ink color band creates a deliberate tonal shift | One-column cards at mobile; text remains readable |
| `photoDelivery` | Functional album portal row with seal, copy and primary CTA | Album purpose, access copy, CTA | Returns from dark moment field to ivory delivery surface | Empty/unavailable album copy keeps the CTA area present |
| `guestbook` | Curated wish wall with quote cards and supporting media slot | Approved wishes, author and intro | Ivory cards on muted paper; no divider when disabled in published content | Text-first wishes plus neutral media slot |
| `peopleBehindTheDay` | Horizontal portrait-credit rail; each item owns a cover and gallery | Person name, role, cover, gallery and `Xem khoanh khac` action | Ivory editorial field with snap rail and item lightbox | Rail becomes one-column snap list on mobile |
| `weddingFilm` | Cinematic poster feature with play affordance and duration | Poster, title, body, duration and CTA | Ink field separates moving-image memory from still album | Poster and copy remain usable without autoplay |
| `soundtrack` | Vinyl record and compact player metadata | Cover, track, artist and duration | Muted paper field with explicit play control | Record stacks above player copy |
| `behindTheScenes` | Horizontal staggered contact rail; each item owns a cover and gallery | Caption, title, cover, gallery and lightbox action | Paper field with alternating image rhythm and snap rail | One-column ordered snap gallery |
| `memoryCapsule` | Letter-style closing insert with future-date marker | Message, date and optional media | Deep vermilion field leads into final thank-you | Image stacks above readable letter |
| `thankYou` | Two-panel album back cover with finale media and closing copy | Thank-you title, body, signature and date | Closing dark field completes the album arc | Text-first closing with neutral finale frame |

## Layout and responsive map

| Viewport | Composition rule |
|---|---|
| Desktop >= 1024px | Preserve asymmetric editorial grids, sticky moments heading, timeline columns and two-panel closing cover |
| Tablet 601-1023px | Collapse story media below copy, reduce timeline columns and keep moments heading in normal flow |
| Mobile <= 600px | Native vertical scroll, one-column moments, stacked delivery CTA, single-column thank-you; no horizontal overflow or scroll hijacking |
| Reduced motion | Keep the same layout and semantic order; remove any future scroll-linked movement and use static dividers/opacity only |

Fixed-format media boxes keep stable dimensions while text wraps. Content never relies on a specific photo height to preserve the section grid.

## Transition map

- `hero -> ourStory`: dark ink cover hands off to ivory paper; the renderer-owned stem remains the visual thread.
- `ourStory -> chapters`: supporting media resolves into the paper timeline surface.
- `chapters -> moments`: chapter divider and palette shift establish the deliberate dark memory field.
- `moments -> photoDelivery`: dark field resolves into a clear ivory utility surface; the CTA is not hidden inside the gallery.
- `photoDelivery -> optional`: optional content uses a muted editorial band and remains visually subordinate to delivery.
- `optional -> thankYou`: optional sections end before the final dark back cover; disabled sections leave no empty seam.

## Section ownership and implementation mapping

The renderer owns only presentation and maps semantic data from `content.ts`:

- Required section keys map one-to-one to `data-editor-section` attributes.
- `chapters` and `moments` are repeatable data collections, not hard-coded visual copies of one another.
- Optional content is rendered through a toggle-aware `OptionalSection` boundary.
- `template-config.ts` is the source for section required/toggle/reorder metadata and the composition map.
- The fixture renders all required sections with empty user media, so layout can be reviewed independently from asset content.

## Phase 3 checklist

- [x] All six required sections have a distinct composition role.
- [x] All six optional sections have config entries, toggle behavior, distinct composition and a valid standalone fallback.
- [x] Repeatable card sections declare item limits, per-item gallery limits, horizontal rail behavior and lightbox interaction.
- [x] Layout does not collapse every section into the same card/grid pattern.
- [x] Required/optional order and insertion behavior are documented.
- [x] Desktop, tablet, mobile and reduced-motion composition behavior is documented.
- [x] Section transitions and adjacent-section seams are documented.
- [x] Renderer section keys and config section keys agree.
- [x] Empty media does not remove headings, metadata or CTAs.
- [x] A focused renderer test verifies twelve preview sections and the optional-section toggle path.

Phase 3 is complete for composition/config mapping. Motion techniques, generated artwork, ambient effects, visual review and release quality gates belong to Phase 4 and Phase 5.
