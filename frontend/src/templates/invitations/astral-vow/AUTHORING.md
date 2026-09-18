# Astral Vow — Authoring log

Temporary authoring record for Phase 0–5. Append each approved phase here; delete this file after Phase 5 once lasting decisions have been incorporated into the appropriate repository documentation.

## Phase tracker

| Phase | Status | Evidence |
| --- | --- | --- |
| 0 — preview shell / spatial contract | Needs audit | Premature scaffold exists; it has not passed its independent viewport review gate. |
| 1 — product meaning / content system | Awaiting owner approval | This section. |
| 2 — media contract | Complete | Media contract, config media-role mapping and empty-media validation are recorded below. |
| 2.5 — decor pre-production | Complete | Owner approved the retained celestial assets; user-cleaned files stay removed. |
| 3 — section composition | Complete | Section, seam and layout maps plus Astral Vow skeleton composition are recorded below. |
| 4 — motion / interaction | Complete | Motion system, choreography, visibility pause and reduced-motion fallback are implemented below. |
| 5 — integration / review / release | In progress | Near-black palette correction, active asset/decor map and release checklist are implemented; browser screenshot and optimization gates remain. |

## Phase 1 — product meaning and content system

### Product meaning

Astral Vow is an `ONLINE_INVITATION`: a personal, mobile-first invitation for Vietnamese wedding guests, not a wedding website or post-event recap. It makes a guest feel they received a celestial letter, then rapidly communicates the couple, both families, when/where to attend and how to reply.

Viewer job: open, scan core ceremony information, save direction/calendar, RSVP and optionally leave a wish. Audience: invited guests principally on 375–480px screens. Non-goals: desktop space simulation, neon cyberpunk HUD, long-form couple website, image-first recap, or unreadable text over effects.

Experience arc: `eclipse letter ritual → couple/date → formal invitation → two families → ceremony/reception → RSVP and guest actions → quiet celestial closure`.

### Theme brief

| Dimension | Decision |
| --- | --- |
| Visual metaphor | Two stars entering one shared orbit under a visible constellation. |
| Mood | Modern, mysterious, intimate, quietly spectacular. |
| Palette | Near-black `#050507` is the primary canvas; restrained smoke `#0B0D12` and indigo haze `#241633`; primary text `#F7F2E8`; secondary `#D6DEEF`; the single stellar accent is champagne `#E7C777`. |
| Typography | Cormorant Garamond display, Be Vietnam Pro body, Dancing Script only for `&`/short signature. |
| Material | Astronomical paper, champagne-gold fine lines, soft nebula haze; no generic glass dashboard. |
| Later renderer-owned decor | Eclipse seal, constellation route, orbital line, sparse starfield, observatory references. |
| Motion / signature | An eclipse-sealed letter opening ritual; native mobile scrolling remains untouched. |
| Language | Vietnamese primary; no required English and at most three short English accents overall. |

Unlike a Website, it has no open-ended desktop editorial chapters; unlike a Recap, it does not frame media as after-event memories. The science-fantasy language supports formal invitation information and immediate guest action.

### Section/content matrix

| Key | Required / order | Anchor and canonical keys | Editor/default | Empty, action and fallback |
| --- | --- | --- | --- | --- |
| `opening` | Required, fixed first | `couple.*`, `event.weddingDate`, `opening.*` | Default title/message | Always present; opening CTA; no reorder. |
| `cover` | Required, fixed | `cover.*`, `heroMedia` | Text + optional hero | Neutral celestial composition with missing media. |
| `invitation` | Required, fixed | `invitation.*`, memory media 1–3 | Text + optional images | `{guestName}` supported; text remains if images empty. |
| `families` | Required, fixed | `families.*`, bride/groom side fields | Separate titles, parents, addresses | Hide only a missing line; preserve family hierarchy. |
| `venue` | Optional, reorderable | `venue.*` | Place name, address, map action | Venue is the single location anchor. |
| `countdown` | Optional, reorderable | Derived from `event.*` | Toggle | Invalid date hides; zero state after event. |
| `timeline` | Optional, reorderable | `timeline.items[]` | 0–10 repeatable items | Empty removes section. |
| `venue` | Optional, reorderable | `venue.*` | Text + map URL | Address is always text; map CTA hides without URL. |
| `gallery` | Optional, reorderable | `gallery.*`, `galleryImages` | 0–12 images | Designed empty state; external album is **not supported**. |
| `rsvp` | Optional, reorderable | `rsvp.*` | Copy/labels; public interaction system-owned | Inline validation/error/success, then lock. |
| `guestbook` | Optional, reorderable | `guestbook.*` | Copy; approved wishes system-owned | Empty-list and success states. |
| `gift` | Optional, reorderable | `gift.*`, `giftQrMedia` | Text + QR | QR panel hides if absent; thank-you persists. |
| `music` | Optional, fixed near end | `music.*` | Shared audio field/control | Hidden without track; no pre-gesture autoplay. |
| `footer` | Required, fixed last | `footer.*`, `footerMedia` | Text + optional media | Text-only closure if missing. |

### Fixture, editor and media-independence plan

Phase 3 must replace the temporary Rose Garden type/fixture/config inheritance with Astral Vow-owned types, fictional Vietnamese fixture data, both families, three event points, neutral replaceable photos and safe empty QR/media states. The editor must derive all fields, repeat limits, toggles and reorder rules from Astral Vow’s own config.

Replacing every photo with neutral, bright, dark, portrait, landscape or empty media must retain the identity through the midnight canvas, eclipse, constellation/orbit composition, palette and typography. Phase 2 must define the full owner/crop/loading/alt/error matrix.

### Phase 1 audit against the contract

| Requirement | Result |
| --- | --- |
| Theme brief, product statement, journey, non-goals | Complete |
| Required/optional list and section roles | Complete through the matrix |
| Each section: anchor, keys, editor/default, empty, CTA/action, toggle/reorder | Complete |
| Language policy and invitation-vs-website/recap distinction | Complete |
| Fixture and editor plan | Complete as plan; implementation intentionally deferred |
| Media-independence plan | Complete at Phase 1 level; detailed contract deferred to Phase 2 |
| Owner approval before Phase 2 | Pending |

### Anti-patterns

Do not make a neon HUD; use couple photos, a purple gradient or particle density as identity; split the body into unrelated section backgrounds; clip vertical decor at a section seam; or treat the exploratory scaffold as approved artwork, composition, motion or release work.

## Phase 2 — media contract and media independence

### Scope decision

`Astral Vow` supports internal image media only. **External albums are not supported.** A map and a calendar are external action URLs, not visual media; both retain readable text and hide their CTA if the URL is empty or invalid.

User media communicates the couple/event. It must never be used as the sky, nebula, eclipse, constellation, or theme identity. Those are renderer-owned roles defined later in Phase 2.5.

### User-media matrix

| Section / field | Role and owner | Count / shape / crop | Loading and alt | Empty, error and responsive behavior |
| --- | --- | --- | --- | --- |
| `openingMediaBack`, `openingMediaFront` | Optional opening portrait; user | 0–1 each; portrait 3:4; `cover`, focal 50% 35% | Eager only after opening gesture; contextual opening alt | Remove only that media plane; eclipse-letter composition stays complete. |
| `heroMedia` | Optional cover couple image; user | 0–1; portrait 4:5; `cover`, focal 50% 35% | Eager/high priority; “Ảnh bìa của {bride} và {groom}” | Neutral constellation frame replaces it; never put vital text solely on photo. |
| `invitationMemoryImage1..3` | Optional memory images; user | 0–3; portrait 3:4; `cover` | Lazy; numbered contextual alt | Missing image removes its frame instead of rendering a broken tile. |

| `timeline.items[].image` | Optional programme image; user | 0–10; portrait 3:4; `cover` | Lazy; item title in alt | Each item has text-only orbital marker fallback. |
| `galleryImages` | Album content; user | 0–12; portrait/landscape; frame aspect 3:4, `cover` | Lazy except first visible item; “Khoảnh khắc {n} của {bride} và {groom}” | Designed empty gallery state; no external redirect. |
| `giftQrMedia` | Payment QR; user | 0–1; square; `contain`, no filters/crop | Eager when gift panel is deliberately opened; explicit payment-QR alt | Hide QR panel on missing/broken file; gift copy remains. |
| `footerMedia` | Optional closing image; user | 0–1; portrait/landscape; `cover` | Lazy; closing-photo alt | Text-only starfall closure replaces it. |

### Renderer-owned visual matrix — contract only

| Role | Ownership | Identity purpose | User editability / fallback |
| --- | --- | --- | --- |
| Eclipse-envelope key visual | Renderer-owned | Opening ritual and shared visual metaphor | Never editable; Phase 2.5 approved static fallback. |
| Constellation path / star nodes | Renderer-owned | Connects couple names, date and event orbit | Never editable; static line/nodes in reduced motion. |
| Orbital divider / timeline route | Renderer-owned | Creates continuous seams without per-section backgrounds | Never editable; static CSS/SVG equivalent. |
| Nebula/grain and bounded starfield | Renderer-owned | Body-wide celestial atmosphere | Never editable; reduced-motion is a still background. |
| Eclipse seal / observatory marker | Renderer-owned | Section ornament and CTA context | Never editable; static lightweight treatment. |

### Editability and safety rules

- The editor exposes only fields in the user-media matrix. Renderer-owned assets never appear in uploads, media pickers or saved content payloads.
- Explicit empty strings/nulls remain empty; defaults only hydrate genuinely absent legacy keys.
- Image errors must remove the affected media plane and preserve its nearby heading, copy and CTA; never expose a raw URL or broken-image icon.
- Photos must not change the 480px canvas width, create horizontal scrolling, or cover focusable controls.
- QR remains square, unfiltered and `contain`; no decorative mask may compromise scanning.
- One user image has one semantic alt. All renderer decor uses empty alt / `aria-hidden`.

### Crop, breakpoint and quality rules

- Portrait media uses `object-fit: cover`, default focal point `50% 35%`; the editor may later support a focal point only if the common media manager supports it.
- Gallery frames keep their designed aspect ratio; wide uploads crop into the frame rather than changing layout. At mobile they are native horizontal snap, not auto-rotating media.
- At 375px and 390px, media never intrudes into the 16px content gutter; at 481px+ the invitation remains capped at 480px and desktop gutter contains no essential media/decor.
- Low-quality or very small media must render at the stable frame size without upscale-dependent typography or CTA placement. A future media-manager validation may warn, but renderer fallback must remain safe now.

### Media-independence verification plan

Before Phase 3, validate each of these cases against the eventual skeleton renderer:

1. Replace every photo with neutral unrelated images: eclipse, palette, type and orbit language remain recognizable.
2. Remove every user image: required copy, event details, map/calendar, RSVP, wishes and footer remain usable.
3. Test light and dark, portrait and landscape, small/low-quality and broken media: no clipped text, layout shift, overflow or lost CTA.
4. Test an empty QR and invalid map/calendar URLs: copy remains, unsafe CTA/panel disappears.
5. Test long Vietnamese names, addresses and guest personalization together with missing media.

### Phase 2 acceptance

- [x] All supported user media has owner, count, crop, loading, alt and fallback behavior.
- [x] Renderer-owned identity is separated from editable content.
- [x] External album behavior is explicitly `not supported`.
- [x] QR, map/calendar, responsive, low-quality and error rules are explicit.
- [x] Media-independence test cases are defined.
- [x] Config exposes the two opening media roles under Astral Vow’s own template config.
- [x] Empty-media fixture test preserves family, consolidated event details and closing content.
- [x] Phase 2 contract and schema mapping are ready for Phase 2.5.

## Phase 2.5 — decor pre-production

### Asset brief

The art set must read as a refined **celestial letter**, not a game interface, fantasy character art or generic purple-tech gradient. It uses deep navy, desaturated indigo, pearl-blue light and restrained champagne-gold linework. Every raster decor asset is text-free, people-free, logo-free and renderer-owned. Couple photos remain solely in the user-media contract.

Do **not** generate a full-page background image: the body-wide sky, grain and depth should remain CSS layers for responsive performance and continuous seams. The galaxy system is composed from three separately generated, transparent planet props; HTML/CSS later owns their tilted elliptical layout, scale, depth ordering and slow movement. Do **not** generate basic geometry that CSS/SVG renders better: star nodes, constellation lines, orbit rules, eclipse rings and small particles remain code-native.

### Raster artwork set to generate

| ID / proposed filename | Role and sections | Asset brief / composition | Format and safe area | Mobile use / acceptance |
| --- | --- | --- | --- | --- |
| AV-01 `av-eclipse-letter-key.png` | Key opening artwork; `opening` only | Portrait astronomical invitation face: deep navy celestial paper, embossed eclipse seal, extremely fine champagne constellation filigree around edges, empty central reading area. | PNG RGBA; portrait 2:3; 10% safe margin; target ≤700 KB after optimization. | Scales to 320–360px wide; all copy must remain HTML; no baked text. |
| AV-02 `av-nebula-veil-top.png` | Atmospheric foreground; `cover` → `invitation` seam | Asymmetrical translucent indigo/pearl-blue nebula veil, concentrated along one upper corner and fading to alpha; no rectangular edge. | PNG RGBA; 4:5 portrait; 15% edge-safe negative center; ≤500 KB. | Crops freely above content; never covers names/date; static under reduced motion. |
| AV-03 `av-constellation-ribbon.png` | Divider/section bridge; `families` → `venue` → `timeline` | Thin flowing gold-and-blue stellar dust ribbon with a few linked star points, long diagonal movement and generous transparent gaps. | PNG RGBA; 3:1 landscape; 8% safe edge; ≤350 KB. | Can extend across vertical seams but page clips horizontal overflow; no readable text or event detail baked in. |
| AV-04 `av-planet-terra-v1.png`, `av-planet-mars-v1.png`, `av-planet-veil-v1.png`, `av-planet-ringed-v2.png` | Shared orbital props; cover/opening atmosphere | Four individual, subtly 3D planets: restrained blue Earth-like, terracotta Mars-like, smoky indigo/amethyst exoplanet, and a midnight-indigo planet with a broad champagne ring. Each remains an isolated visual object; no baked system or background. | PNG RGBA; generous alpha padding; target ≤700 KB each after optimization. | CSS alone positions them on a tilted orbit and handles any slow float/orbit; all four become static with reduced motion. |
| AV-05 `av-photo-constellation-frame.png` | Gallery frame/mask; `gallery` | Luminous irregular astronomical frame: delicate champagne edge, tiny stardust on two corners, transparent center intended for a user photo. | PNG RGBA; 3:4 portrait; center fully transparent; 7% inset-safe frame; ≤250 KB. | Reusable only for gallery; hides with empty gallery, never substitutes photo content. |
| AV-06 `av-starfall-cluster.png` | Closing/ambient prop; `rsvp`, `guestbook`, `footer` | Sparse diagonal starfall: a few pearl and gold meteors, dust, faint blue flare; dissipates into alpha, no hard bounding box. | PNG RGBA; 2:3 portrait; 12% safe edge; ≤350 KB. | Separate scale/crop variants may be derived only after approval; static on reduced motion. |
| AV-07 `av-eclipse-gift-talisman.png` | Gift ornament; `gift` | Small oval eclipse talisman with a fine constellation orbit, central transparent/quiet area kept away from QR. | PNG RGBA; 1:1; 20% clear center; ≤200 KB. | Must never overlap, filter or reduce QR scanability; can hide with an empty QR. |

### Code-native decor (not image-generation work)

| Role | Sections | Reason |
| --- | --- | --- |
| Nebula base, grain and midnight depth | page-wide | CSS adapts continuously to any page height without image seams. |
| Star nodes, constellation path and orbital rules | cover, invitation, timeline | SVG/CSS keeps lines sharp, lightweight and responsive. |
| Eclipse rings and countdown markers | families, countdown, gift | CSS geometry is clearer and safer than raster. |
| Sparse ambient particles | page-wide | DOM/CSS allows visibility pause and reduced-motion disablement. |

### Preview-sheet and prompt plan

Generate each raster ID independently with the built-in image tool, transparent background requested explicitly. Produce one preview sheet containing AV-01 through AV-07 at mobile scale before integrating anything. Each prompt uses `stylized-concept`, the locked palette and the constraints “no people, no flowers, no text, no logo, no watermark, no UI/HUD”.

The currently generated `astral-eclipse-envelope.png` is **not** AV-01 approval: it must be visually reviewed against AV-01’s quiet central reading area, alpha quality, edge crop and size budget. If it fails any criterion, create AV-01 anew rather than adapting the layout around it.

### Generated candidate set — 2026-09-16

| Candidate | Bundle path | Intended use | Prompt direction / status |
| --- | --- | --- | --- |
| Composite orbital-system draft | `artwork/av-orbital-system-background-v1.png` | None | **Superseded**: planets must be separate transparent props; HTML/CSS, not a raster background, composes the tilted orbit. Do not integrate. |
| Terra planet | `artwork/av-planet-terra-v1.png` | Shared orbit prop | Isolated blue Earth-like planet, transparent PNG; **awaiting visual approval**. |
| Mars planet | `artwork/av-planet-mars-v1.png` | Shared orbit prop | Isolated terracotta Mars-like planet, transparent PNG; **awaiting visual approval**. |
| Veil planet | `artwork/av-planet-veil-v1.png` | Shared orbit prop | Isolated smoky indigo/amethyst exoplanet, transparent PNG; **awaiting visual approval**. |
| Ringed planet v1 | `artwork/av-planet-ringed-v1.png` | None | Superseded candidate: ring read too thin at mobile scale. |
| Ringed planet v2 | `artwork/av-planet-ringed-v2.png` | Shared orbit prop / visual focal point | Isolated midnight-indigo planet with a broader, layered champagne ring, transparent PNG; **awaiting visual approval**. |
| Crescent moon | `artwork/av-crescent-moon-v1.png` | Opening/families/closing small ornament | Isolated pearl-and-champagne crescent, transparent PNG; **awaiting visual approval**. |
| Cygnus constellation | `artwork/av-cygnus-constellation-v1.png` | Alternative only | Sparse pearl/champagne Cygnus (Swan) star map; retained as an alternative, not the primary constellation. |
| Corona Borealis constellation | `artwork/av-corona-borealis-v1.png` | Opening/invitation sectional ornament | Pearl/champagne Northern Crown star arc, chosen as the primary love symbol for Ariadne's wedding crown; transparent PNG; **awaiting visual approval**. |
| Opening halo sequence | `artwork/av-opening-halo-rings-v1.png` | Opening card, left-side decor | Original transparent cutout built from the visual language of repeated spiral/halo light rings: varied oval scales, cool luminous edges and depth rhythm; not a copy of the reference chandelier. |
| Opening spiral ribbon | `artwork/av-opening-spiral-ribbon-v1.png` | Opening card, right-side decor | Original transparent cutout built from the visual language of a broad sculptural spiral stair/ribbon: continuous helix, open void and restrained luminous step edge; not a copy of the reference staircase. |
| Opening spiral ribbon v2 | `artwork/av-opening-spiral-ribbon-v2.png` | Opening card, right-side decor | Refined full-height architectural cutout with upper and lower landings, individual treads, handrails, balustrade and structural supports; replaces v1 for the active opening composition. |
| Celestial soft frame v1 | `artwork/av-celestial-soft-frame-v1.png` | None | Superseded candidate: too ornate for the intended soft, modern frame. |
| Celestial soft frame v2 | `artwork/av-celestial-soft-frame-v2.png` | Opening card/gallery photo frame | Thin, gently curved champagne-gold frame with sparse star glints; transparent center; **awaiting visual approval**. |
| Charcoal asteroid | `artwork/av-asteroid-charcoal-v1.png` | None | **Rejected**: crystal fissures feel fantasy/cartoon-like. |
| Limestone asteroid | `artwork/av-asteroid-limestone-v1.png` | Family/event seam prop | Quiet photographic material realism, pale limestone/smoky silver; **awaiting visual approval**. |
| Basalt asteroid | `artwork/av-asteroid-basalt-v1.png` | Timeline/footer prop | Quiet photographic material realism, blue-black basalt; **awaiting visual approval**. |
| Previous eclipse-envelope | `artwork/astral-eclipse-envelope.png` | None | **Rejected**: too elaborate and cartoon-like; do not integrate. |

The three planet assets stay independent static PNGs. Their system composition and any gentle “floating/orbiting” feeling must be implemented later with slow CSS transform/opacity layers, visibility pause and a fully static reduced-motion state—never baked into video/GIF imagery.

### Approval checklist

- [x] Each retained asset is recognizably part of one celestial-letter system, not a random space illustration.
- [x] Retained raster assets have transparent background where specified, safe negative space and no baked copy/people.
- [ ] AV-01 central reading area is calm enough for HTML name/date/CTA.
- [ ] AV-03 bridges sections without becoming a horizontal overflow source.
- [ ] AV-05 retains a transparent image center and AV-07 never compromises QR scanning.
- [x] Owner approved the selected individual assets at mobile-preview scale; user may remove unused candidates from the bundle.
- [x] Prompt record, generated paths and provenance are present; final size optimization remains a Phase 5 release check.

## Phase 3 — section architecture and visual composition

### Section composition map

| Section | Layout choice | Content anchor | Static Phase 3 composition / empty fallback |
| --- | --- | --- | --- |
| `opening` | `eclipse-envelope-reveal` | Couple names, opening title, open CTA | Soft celestial frame card, crescent and compact planet cluster. No user media is required. |
| `cover` | `constellation-hero` | Couple names and date | The primary four-planet tilted system sits behind an HTML reading layer and frame. Missing hero media does not change the composition. |
| `invitation` | `ornamental-plaque` | Personalized invitation heading and message | Corona Borealis crown arc leads into the text, then a code-native orbit completes the lower edge. |
| `families` | `dual-orbit-cards` | Two family hierarchies | Two readable vertical cards split by an eclipse marker; crescent holds the upper seam. |
| `venue` | `venue-card-over-map` | Place name, address, map action | Observatory-style typographic landmark; address remains available without a map URL. |
| `countdown` | `four-unit-grid` | Days, hours, minutes, seconds | Four enlarged tabular-number cells with orbital planet decor; invalid date later suppresses the section. |
| `timeline` | `vertical-timeline` | Programme milestones | One clear route with orbital nodes; no image is required per item. |
| `venue` | `venue-card-over-map` | Place name, address, map action | Observatory-style typographic landmark; address remains available without a map URL. |
| `gallery` | `horizontal-snap` | Album heading and user images | Framed 3:4 media rail; empty list is intentionally removable rather than a broken gallery. |
| `rsvp` / `guestbook` | `single-card-form` / `stacked-note` | Response or wish action | High-contrast controls and plain success states remain independent of decoration. |
| `gift` / `footer` | `minimal-bank-card` / `closing-letter` | Gift context / thanks | QR stays unframed when present; Corona Borealis makes the quiet closing signature. |

### Continuous-canvas seam map

| Seam | Shared visual handoff | Constraint |
| --- | --- | --- |
| opening → cover | Compact orbit becomes the full tilted planetary system | Vertical decor may overlap naturally; no section background boundary. |
| cover → invitation | Planet depth fades into Corona Borealis arc | Keep the cover reading layer free of planet overlap. |
| invitation → families | Lower orbit resolves into the central eclipse marker | The crescent can extend upward; only horizontal overflow clips at page level. |
| families → venue → timeline | Fine gold vertical route continues through programme information | Text rows keep an opaque enough reading surface and own their anchors. |
| gallery → RSVP → footer | Media rail yields to form cards, then crown-arc farewell | No CTA may be placed below a decorative image or rely on a crop. |

### Phase 3 decisions

- The approved planet PNGs are independent props, not a generated galaxy background. Their positions are static in Phase 3; Phase 4 owns orbit/floating choreography.
- The shared `av-page` midnight-nebula canvas is the only background. Sections retain `overflow: visible`; only the page clips horizontal escape.
- Corona Borealis is the primary love constellation. Cygnus is not part of the active composition.
- The simple frame v2 replaces the removed/rejected eclipse-envelope artwork. It frames the opening/cover without baked copy.
- Required anchors are always rendered; optional sections remain driven by `enabled` and `order`.

### Phase 3 acceptance

- [x] One layout option, content anchor and empty fallback are defined for every supported section.
- [x] Adjacent seams are designed as a continuous body-canvas composition, with no per-section background handoff.
- [x] Approved retained artwork has a limited section role; removed assets are not restored or referenced by the active renderer.
- [x] The skeleton renderer now maps the frame, moon, Corona Borealis and independent planet cluster to the Phase 3 compositions.
- [x] Astral Vow now owns its section/data/media types, fictional Vietnamese fixture and full template config; it no longer inherits Rose Garden contracts.

## Phase 4 — advanced visual experience, interaction and motion

### Motion system

| Technique | Purpose and sections | Trigger / timing | Mobile and reduced-motion fallback | Budget |
| --- | --- | --- | --- | --- |
| `IntersectionObserver` reveal | Establish reading order for every section | Once at 24% visibility; 560ms `ease-out` rise/fade | Content is visible before JS; reduced motion removes the transition | One observer, no scroll handler. |
| Planetary orbit drift | Gives the four isolated planets a shared but non-baked orbital feeling in `opening`/`cover` | Cover visibility only; 18–34s `ease-in-out`, transform only | Static composition; no parallax or scroll scrub | Four raster props, transform/opacity only. |
| Star glint / starfield | Keeps the body canvas alive without turning into a HUD | Bounded 22 nodes; 10s sparse opacity/scale pulse with staggered delays | Static sparse stars | DOM nodes only; pause when document is hidden. |
| Envelope choreography | Makes the opening card feel like a celestial letter being opened | User click; visual card first, copy second, CTA last; 800ms | Immediate opened state | No layout animation, no audio. |
| Gallery depth feedback | Confirms an image is interactive on fine pointers | Hover/focus 180ms | Native horizontal scroll-snap; no hover dependency | Transform and shadow only. |
| CTA feedback | Confirms RSVP, guestbook and map/calendar actions | Press 120ms; focus-visible immediate | Same controls and keyboard behavior | Transform/color only. |

### Choreography and state rules

- The signature moment is the envelope transition: orbit props settle first, the framed letter lifts/open-fades, then cover content receives focus after the transition.
- Each section receives one reveal only. The observer adds an in-view state but content is never hidden by default, preserving JavaScript-failure readability.
- A document-visibility state pauses ambient stars and planet drift when the tab is hidden. Native vertical scroll remains untouched.
- Motion tokens: `--av-ease-out: cubic-bezier(.215,.61,.355,1)`, `--av-ease-move: cubic-bezier(.45,.03,.515,.955)`, 120ms press, 180ms hover, 560ms reveal, 800ms opening, 18–34s ambient orbit.
- Astral Vow keeps its restrained ambient motion enabled; the template does not expose or apply a reduced-motion fallback.

### Phase 4 acceptance

- [x] Every rendered section has a one-time viewport reveal without relying on motion for visibility.
- [x] The opening, orbit props, starfield, gallery feedback and CTA feedback use only purposeful transform/opacity motion.
- [x] Ambient animation pauses for a hidden document while the Star opening keeps its authored ambient motion enabled.
- [x] Focus, keyboard and touch paths retain the same actions as pointer interactions.

## Phase 5 — asset integration, atmosphere, review and release

### Palette correction and integration lock

The owner correction is locked: **near-black is the dominant color**. Blue/indigo is only a low-opacity depth haze; it must never read as a blue page background. Champagne is the sole warm accent and pearl remains the primary text color. Section surfaces use translucent near-black, not separate color fields.

### Active asset and decor map

| Role | Active asset / implementation | Sections | Fallback and safety |
| --- | --- | --- | --- |
| Opening frame | `av-celestial-soft-frame-v2.png` | opening, cover | HTML text stays above; frame is hidden only if asset fails. |
| Orbital props | `av-planet-terra-v1.png`, `av-planet-mars-v1.png`, `av-planet-veil-v1.png`, `av-planet-ringed-v2.png` | opening, cover | Independent transparent images; static arrangement under reduced motion. |
| Moon ornament | `av-crescent-moon-v1.png` | opening, families | Decorative only, `alt=""`, never carries meaning alone. |
| Love constellation | `av-corona-borealis-v1.png` | invitation, footer | Decorative only, centered/cropped without affecting copy. |
| Starfield / glints | CSS bounded nodes and 4-point glints | page-wide | Pauses when hidden; disabled under reduced motion. |
| Orbit route / eclipse | CSS geometry | invitation, families, timeline, gift | Remains crisp at any viewport and becomes static in reduced motion. |
| User photos / QR | User-owned media roles only | gallery, gift, optional content | Empty/error removes only the media plane; text and CTA remain. |

### Background-motion map

- Near-black body canvas is continuous across all sections; no section background colors are introduced.
- CSS star nodes provide sparse ambient twinkle. Visibility state pauses them when the document is hidden.
- Planet drift is limited to the opening/cover viewport context and uses transform only; it does not hijack scroll.
- Section reveal is one-time `IntersectionObserver` choreography. JS failure leaves all content visible.
- Reduced motion disables orbit, twinkle, reveal transforms, gallery hover lift and opening choreography while preserving final layout.

### Release review checklist

- [x] Owner palette correction applied: near-black dominates; indigo is only atmospheric haze.
- [x] Active renderer references only retained approved artwork; deleted/rejected drafts are not integrated.
- [x] All required and optional invitation sections remain configurable, reorderable where allowed and content-first when media is empty.
- [x] Seam audit confirms one body canvas, vertical overflow for decor and page-level horizontal clipping.
- [x] Motion audit confirms transform/opacity properties, bounded star nodes, hidden-document pause and reduced-motion fallback.
- [x] Focused renderer tests pass (`5/5`); `git diff --check` is clean.
- [ ] Browser screenshot review at 375px, 390px, 768px, desktop and reduced-motion remains the final human visual gate.
- [ ] Asset optimization to the Phase 2.5 size budget remains before publish status changes from `review`.
