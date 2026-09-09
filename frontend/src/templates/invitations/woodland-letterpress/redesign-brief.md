# Woodland Letterpress — redesign, September 2026

## Phase 1: invitation and content

A physical woodland wedding invitation for Vietnamese guests, on the existing 450px mobile canvas. The opening seal invites a deliberate tap; the opened letter quickly answers who, their families, when, where and how to reply. No website chapters or dependence on sample photography.

Palette: walnut `#4B3025`, dark wood `#2B1914`, birch `#F3EADB`, cedar `#704A36`, moss `#74745A`, bronze `#B1774F`. Brown wood is dominant; moss stays secondary in botanical details. Lora carries names/headings, Be Vietnam Pro carries practical copy, Dancing Script is limited to the ampersand. The signature is engraved botanical stationery and a physical folio opening.

All existing 13 section keys remain. Cover/banner/letter/event/footer remain anchors; optional sections retain independent toggles and reordering. Family titles, names, roles and addresses remain separate editable fields. Vietnamese headings identify every section.

## Phase 2: media contract

User photographs remain optional content: activity images use a stable landscape crop; gallery images occupy a stable portrait print and receive alt text. Missing/broken images keep paper frames, text and controls usable. Gift QR uses contain without crop and disappears on error. No upload carries the theme identity. Existing no-photo fixture is the primary media-independence baseline; additional gallery tests use neutral images.

## Phase 2.5: existing approved artwork

Reuse the previously approved artwork set documented in `phase-3-composition.md`; no new assets or provenance claims. Folio cover/open are the opening object; seal is the action; wreath surrounds the banner; left/right ceremonial clusters stay at safe edges; divider joins stationery; marker belongs to calendar; signpost belongs to venue; flower/berry/pinecone/grass mark notes, replies and atmosphere. Artwork is decorative with empty alt and no pointer capture. Scale/crop of decorative wrappers never changes content width.

## Phase 3: composition acceptance map

| Section           | Composition / acceptance                                                                     |
| ----------------- | -------------------------------------------------------------------------------------------- |
| cover             | Visible folio, names/date, seal and clear open action; keyboard activation                   |
| banner            | Self-contained couple-name box with engraved arch, botanical crown, date and wrapped names   |
| invitation-letter | Separate family-information box, followed by a lighter personalized invitation note          |
| event-countdown   | Dark ceremony plaque with exact time and four countdown units                                |
| calendar          | Real month grid with selected date and calendar action                                       |
| venue             | Dark walnut signboard, circular signpost emblem, address rule and high-contrast map action  |
| timeline          | Vertical trail; ordered times remain visible without motion                                  |
| activities        | Offset field notes, optional user image, alternate botanical markers                         |
| gallery           | Perspective photo prints with previous/next; 2D reduced-motion fallback                      |
| rsvp              | Folded response stationery with explicit submission feedback                                 |
| guestbook         | Ruled message paper and visible label                                                        |
| gift              | Small opt-in gift note and contained QR                                                      |
| footer            | Botanical closing, names/date and thanks                                                     |

Adjacent sections share paper texture and generous internal spacing. Dark panels are inset objects, not full-width color cliffs. Artwork belongs to its section and follows reorder/toggle.

## Phase 4: motion plan

| Technique       | Purpose / trigger                                              | Budget / fallback                                              |
| --------------- | -------------------------------------------------------------- | -------------------------------------------------------------- |
| Folio opening   | One 760ms seal/cover transition after click                    | Transform/opacity; immediate reduced-motion opening            |
| Viewport reveal | Reading-order entrance of headings, family details and actions | One observer; 600ms ease-out; visible without observer         |
| Botanical sway  | Slow ambient life at visible edges                             | Three small ornaments maximum; pause offscreen/hidden tab      |
| Paper dust      | Subtle moving background                                       | Sparse CSS particles within canvas, no canvas runtime          |
| Gallery depth   | Active photograph reads as a physical print                    | CSS perspective; manual controls; flat under reduced motion    |
| Scroll          | Smooth desktop wheel only                                      | Existing Lenis dynamic import; native touch and reduced motion |

## Phase 5: release gates

Parent browser review covers opening/opened full page at mobile, tablet and desktop, long text, missing media, toggles/reorder, keyboard and reduced motion. Typecheck, lint, tests and build are required. Final config audit must match real fields, layout capabilities, sections and preview route. No release/publish occurs in this task.
