# Deep Ocean - Phase 3 Section Architecture

Phase status: `complete` for section composition, responsive layout mapping and section-config rendering. Motion, renderer-owned artwork integration and ambient effects remain Phase 4/5 work.

## Composition intent

Deep Ocean is a light coastal wedding website that moves from horizon to tide, then back to a quiet pearl closing. The page is intentionally not a repeated card stack: each chapter changes reading mode while keeping one continuous pearl/ocean material language.

Journey:

`hero horizon -> story portrait -> tide timeline -> wedding-day utility -> gallery contact sheet -> memory diptych -> people credits -> film feature -> wishes wall -> capsule letter -> closing shore`

## Section composition map

| Section | Required | Layout | Content anchor | Empty/content fallback |
| --- | --- | --- | --- | --- |
| `navigation` | Yes | Compact overlay index | Page identity and enabled anchors | Mark remains; anchor list only includes enabled sections |
| `hero` | Yes | Full-bleed editorial horizon | Couple names, date and invitation to continue | Pearl/ocean wash keeps copy readable without media |
| `story` | Yes | Split portrait editorial | Short love-story introduction | Copy remains first; image frame can collapse |
| `timeline` | Yes | Vertical tide timeline | Repeatable milestones and dates | Timeline metadata remains readable with any item media absent |
| `weddingDay` | Yes | Image-backed utility card | Date, time, venue and address | Text card remains over the ocean fallback plane |
| `gallery` | Yes | Asymmetric editorial contact sheet | Album moments and sequence | Empty gallery keeps title and can collapse only its grid |
| `memories` | Yes | Text-led memory diptych | Small details and two supporting images | Body copy remains complete; images stack below |
| `people` | No | Two-column credit portraits | People who carried the couple | Role/name remain visible in neutral frames |
| `film` | No | Poster feature split | Film title, message and optional CTA | No video URL becomes a quiet coming-soon state |
| `wishes` | No | Quote wall | Approved wishes and authors | Heading remains; empty list leaves a text-first surface |
| `capsule` | No | Centered letter panel | Future-facing memory message | Message remains in the pearl panel without decoration |
| `footer` | Yes | Full-bleed farewell | Thank-you, signature and date context | Closing copy remains over the pearl/ocean fallback |

No layout is used as the dominant pattern more than twice. The timeline, contact sheet, diptych, portrait credits, poster feature and letter panel each have a distinct visual job.

## Layout and transition map

| Boundary | Transition | Responsive behavior |
| --- | --- | --- |
| `navigation -> hero` | Transparent pearl navigation settles into the horizon wash | Navigation keeps the mark and hides secondary links below 700px |
| `hero -> story` | Dark blue hero resolves into the continuous pearl canvas | Native vertical scroll; copy stacks above portrait |
| `story -> timeline` | Portrait edge hands off to the sea-glass timeline band | Timeline remains a readable vertical rail on mobile |
| `timeline -> weddingDay` | Sea-glass field shifts into an image-backed utility chapter | Card stays text-first and never depends on crop for event data |
| `weddingDay -> gallery` | Dark venue overlay opens into a pale contact-sheet surface | Gallery becomes a two-column grid, then full-width first/last frames |
| `gallery -> memories` | Contact-sheet rhythm returns to the pearl canvas | Memory images stack below copy with stable aspect ratios |
| `memories -> people -> film` | Pale canvas moves through a quiet green credit field into sand-toned film | People and film collapse to one column without horizontal scrolling |
| `film -> wishes -> capsule` | Sand poster field returns to pearl, then soft aqua capsule paper | Quote cards stack; capsule remains centered and readable |
| `capsule -> footer` | Aqua letter panel resolves into the final shore image | Farewell remains a bounded text block over the fallback wash |

## Responsive and accessibility contract

- Desktop (>= 1024px) preserves asymmetric grids, utility card overlays and the two-column film/people compositions.
- Tablet (701-1023px) reduces gutters and image dominance while retaining each section's distinct reading mode.
- Mobile (<= 700px) uses native vertical flow, stable media ratios and no horizontal overflow; the gallery is the only section that keeps a compact two-column rhythm.
- Reduced motion preserves the same section order, anchors and content hierarchy; future scroll-linked effects must be removable without changing layout.
- Disabled sections leave the DOM entirely. Navigation anchors are derived from the enabled section set and never point to a disabled target.
- Background media is decorative; names, dates, venue, wishes and actions remain real text.

## Phase 3 acceptance checklist

- [x] All required and supported optional sections have a documented composition role.
- [x] Section keys, `data-editor-section` markers, fixture data and config entries agree.
- [x] Required anchors remain stable; disabled sections are removed without empty seams.
- [x] Navigation exposes only enabled, addressable sections.
- [x] Layouts vary by section purpose instead of repeating one card/grid pattern.
- [x] Desktop, tablet, mobile and reduced-motion composition rules are documented.
- [x] Adjacent-section transitions and media-independent fallback states are documented.
- [x] Focused tests cover full rendering, section order/visibility and navigation anchor filtering.

Phase 4 will add motion choreography and approved decor placement. Phase 5 will add atmosphere, final visual review and release validation.
