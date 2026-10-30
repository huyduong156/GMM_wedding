# A Beautiful Day — Phase 3 Section Architecture

> **Visual revision 2026-10-30:** the section/content architecture and data contract remain. The latest hero contains only the couple's names and portrait; five fixed placements of approved Phase 2.5 lanterns hang above it in distinct depth layers. One shared ivory/honey canvas runs behind transparent chapters. Static compositions below are historical where they describe stage curtains, separate color bands, unused navigation or outdated hero copy.

Status: Phase 3 composition and renderer implemented from the Phase 1/2 contracts. Approved floral variants and three approved lantern artworks are selectively active in the public bundle; unused curtain options remain archived under `assets/templates/a-beautiful-day/archive/retired-webp/`. The former Phase 0 preview route is unchanged.

## 1. Composition thesis

Treat the site as one continuous warm-ivory wedding journal with an editorial garden character. This is a content-only publication surface: begin directly with the hero and do not render website chrome such as a header, navigation bar, or top menu. Keep the guest's practical route visible through the hero's event facts and CTA, followed by direct event/venue information before long-form story or gallery content.

- **Canvas:** full-width website canvas; centered content boundary up to 80rem and Phase 0 gutters. A paper-ivory base remains continuous; use subtle shifts in paper tone, light, and texture instead of hard full-width color bands.
- **Hierarchy:** Lora display headings; Be Vietnam Pro for Vietnamese body, labels, controls, and metadata. One `h1` in hero; section headings are semantic anchors.
- **Signature composition:** a sunlit botanical journal led by couple photography, clear event facts, editorial typography, and a small code-native botanical mark. Avoid literal venue/stage scenery and keep practical information free of decorative props.
- **Density:** mobile-first scanability. Use asymmetry and generous whitespace on wide screens, then collapse to native vertical flow without hiding content.
- **Decor ownership:** renderer owns the canvas, paper treatment, typography, rules, and all artwork placement. Uploaded wedding images remain content and cannot be required for theme recognition.

## 2. Section support and order

The architecture covers every website-contract section. Required sections are fixed anchors; optional sections are supported and follow enabled/order state. Canonical opening and closing anchors remain fixed. The default sequence is the Phase 1 order:

`navigation → hero → announcement → couple → story → events → countdown → venues → gallery → schedule → weddingParty → dressCode → travel → faq → rsvp → guestbook → gift → footer`

`navigation`, `hero`, and `announcement` stay at the beginning; `footer` stays last. `couple`, `events`, and `venues` are required and may reorder within the middle content under the shared contract. Enabled optional sections may reorder there as well. Navigation is derived only from enabled, non-empty sections. `music` is a global control, not a visual section or order entry.

| Section | Required / default | Composition and content anchor | Content-density and empty behavior |
|---|---|---|---|
| `navigation` | Required / on | Compact sticky editorial index; monogram at left, active section links, RSVP action at right. | Links only to currently enabled and non-empty anchors. Compact menu on mobile; no separate content fields. |
| `hero` | Required / on | Centered couple portrait with both names together as an overlapping editorial caption beneath it. | Only names and the photo appear as hero content. Missing/broken hero photo leaves a warm paper portrait fallback. Long names wrap without colliding. |
| `announcement` | Required / on | Framed welcome note, narrower text measure and centered editorial heading; visually distinct from the hero by removing photo dominance. | Required message; missing message is a publish validation error, not an empty decorative panel. |
| `couple` | Required / on | Balanced dual portraits with separate biographies; portraits are equal but not forced into duplicate card chrome. | Each missing portrait becomes a named typographic profile. Preserve each biography and name independently. |
| `story` | Optional / on | Alternating milestone timeline with date and text on one side, optional image on the other; a quiet editorial rule links milestones. | Empty list omits section and navigation entry. A milestone without media keeps its text and timeline marker. |
| `events` | Required / on | Editorial program: date/time is the strongest scan target, followed by event title, address summary, and add-to-calendar action. Multiple events use a ruled list, not repeated generic cards. | Requires at least one valid public event. Past events remain readable with clear status. |
| `countdown` | Optional / on | Narrow inline countdown interlude tied to the primary event; visually subordinate to event details. | Invalid/missing date has a quiet date-led fallback; completed event shows a completed state without negative values. |
| `venues` | Required / on | Map split: map/location visual on one side, address, directions, and travel note on the other. Multiple venues become individually titled location blocks. | Address and map link remain useful without an embedded map. Invalid or unavailable map falls back to address and plain directions. |
| `gallery` | Optional / on | Editorial image field: varied but bounded image sizes in a deliberate grid, captions/alt kept with their images, accessible lightbox. | Zero valid images omits section and nav link. Failed items disappear without holes; never insert stock replacements. |
| `schedule` | Optional / on | Vertical chronological timeline with explicit time labels and short details; distinct from `events` by showing sequence inside a day rather than event overview. | Empty list omits section. Sort for display by time while preserving authored content order in storage. |
| `weddingParty` | Optional / off | Role-grouped roster with editorial portrait/name hierarchy; each group has its own label and quiet separator. | Empty groups omit section. Missing portraits use initials/monograms. Never populate from guest records. |
| `dressCode` | Optional / off | Fabric-swatch editorial note: text first, labeled color swatches as a supporting rail. | No message and no swatches means omit, with no empty swatch row. Labels remain readable and are not communicated by color alone. |
| `travel` | Optional / off | Editorial directory of hotel, transport, and parking entries; actionable links are visually distinct and paired with text. | Empty entries omit section. Invalid URLs are not rendered as links; text details remain. |
| `faq` | Optional / off | Accessible accordion, grouped as a clear list rather than cards. | Empty list omits section. Keyboard disclosure controls and answer content remain usable without animated height. |
| `rsvp` | Optional / on | Single focused form composition with short invitation copy, clear deadline/status and touch-sized controls. | Disabled section removes all RSVP shortcuts. Preserve pending, success, closed, validation, rate-limit, and retry states from the common flow. Respect runtime `guestName`; request a name only if absent. |
| `guestbook` | Optional / on | Stacked note composition: approved wishes are readable notes above/beside a distinct message form. | Empty approved-wish list does not remove the form. Hidden section removes the navigation entry. Respect runtime `guestName`; request a name only if absent. |
| `gift` | Optional / off | Opt-in QR/account group, with account details as selectable text and QR fully contained. | Disabled or unpopulated section produces no DOM/CTA. No seeded account details; text can remain when a valid QR is absent. |
| `footer` | Required / on | Closing letter with short thank-you, couple signature, date, and one small botanical SVG mark. | Always present and last. Required message missing is a publish error. |
| `music` | Global / off | Small persistent playback control owned by the global shell, outside visual section order. | No track means no control. Playback starts only after explicit user action; no autoplay dependency. |

## 3. Layout diversity and repeatable content

No single layout family should dominate more than three sections. This map deliberately gives section groups different silhouettes: photo-led hero, note, profiles, timeline, program, map, gallery, accordion, form, and closing letter.

- Repeatable story milestones, events, schedule items, party groups/members, travel items, FAQs, gallery images, and gift accounts use layout patterns that preserve their item hierarchy and authored order where the contract requires it.
- Events and venues should not collapse into identical cards: events prioritize time and action; venues prioritize address and route.
- Story and schedule remain distinct: story is a relationship narrative with optional media; schedule is a practical chronological itinerary.
- RSVP and guestbook remain separate destinations: RSVP is a response transaction; guestbook is a public message flow.
- Do not use horizontal-only storytelling, pinned content, or slideshow as the sole access path for any required information.

## 4. Archived artwork provenance

The first renderer used the raster artwork listed below. After the 2026-10-30 composition review, all fourteen WebP files were removed from public renderer use and moved to `assets/templates/a-beautiful-day/archive/retired-webp/`; they are preserved for provenance only. These are not public URLs, approved active artwork, selectable `heroStyle` values, or valid decoration placement instructions. Do not restore references to them in the renderer.

The archived set contains four curtain frames, seven floral/bamboo/blossom assets, and three lanterns. The active visual signature is a small inline SVG botanical mark in `ABeautifulDayBotanical.tsx`; it is intentionally still and limited to the hero/footer. User photographs are content media, never renderer-owned decoration.

## 5. Chapter transitions and seams

The warm paper canvas continues through most sections. Transitions use spacing, thin rules and a few intentional color fields; the berry announcement and garden panels are reserved chapter moments. Do not add floating props or repeat ornamental artwork at section boundaries.

| Adjacent chapters in default order | Seam composition |
|---|---|
| Navigation → Hero | Navigation rests above the hero on the same canvas; transparent overlay only while contrast remains reliable. On scroll, compact sticky state uses a solid translucent paper surface. |
| Hero → Announcement | Hero resolves into the shared ivory field; the berry announcement begins as a clear chapter. Keep the headline free of decoration. |
| Announcement → Couple | A thin botanical rule creates a quiet pause; the note's narrow measure opens into two balanced profile columns. |
| Couple → Story | Portraits resolve before the first optional story image; a simple rule introduces the timeline. |
| Story → Events | Narrative rule changes into clear time markers; keep event details on a quiet background. |
| Events → Countdown | Program list closes with spacing; countdown appears as a small typographic interlude, not another card stack. |
| Countdown → Venues | Date/count digits resolve into a location heading and map/address split; keep address and directions visually primary. |
| Venues → Gallery | Map panel fades back into the same paper canvas; gallery starts with a caption/heading and first image frame, with no seam overlay on images. |
| Gallery → Schedule | Gallery lightbox/grid ends before a clear chronological rule starts; preserve caption and time legibility. |
| Schedule → WeddingParty | Timeline marker resolves into a role-group separator; if party is off, no reserved gap or decorative stub remains. |
| WeddingParty → DressCode | Role groups close with whitespace; optional swatches enter as labeled color samples on the same background. |
| DressCode → Travel | Swatch rail settles into the directory's text-first layout; optional section removal closes the seam naturally. |
| Travel → FAQ | Action links end before the first disclosure control; shared paper background and heading rhythm preserve continuity. |
| FAQ → RSVP | Accordion list closes into a focused form area; clear change in hierarchy and whitespace, not a hard color block. |
| RSVP → Guestbook | Form completion/CTA remains distinct; guestbook notes enter as a calm continuation, without celebratory auto-motion on form submission. |
| Guestbook → Gift | Message list resolves before the opt-in gift details; if gift is disabled/empty, it is removed with no gap. |
| Gift → Footer | Gift panel ends with generous space; footer closing letter and its small SVG signature close the page. |

Because middle sections can reorder, the implementation must also support neutral adjacency seams: continuous paper canvas, section-local spacing, and optional low-weight rules. Chapter backgrounds must not depend on a particular neighboring section.

## 6. Responsive and content fallbacks

- **Wide desktop:** use broad negative space, asymmetric image/text proportions, and the full-size hero frame. Cap content to the Phase 0 boundary; decor may extend within the viewport but cannot introduce horizontal overflow.
- **Tablet:** reduce decorative scale and overlap before tightening the text measure or cropping a user photo. Convert split layouts to narrower side-by-side only while both columns remain readable.
- **Mobile (including 320–390px):** native vertical order; compact navigation menu; stack couple profiles, event/venue details, and all forms. Keep the hero portrait bounded and its text readable; names, date, venue, and CTA remain when media is missing.
- **Long content:** allow natural section height. Never clip names, biography, event address, FAQ answer, guestbook text, or form status to preserve a visual frame.
- **Missing/broken media:** follow Phase 2 role fallback (typographic hero, named profiles, text-only milestones, omitted invalid gallery items, monogram party members, text-first gift). No unrelated stock image is substituted.
- **Empty optional section:** omit the section, anchor, navigation link, and seam spacing; do not render empty cards or placeholder artwork.
- **Disabled optional section:** remove it from the DOM and computed navigation. Required sections cannot be disabled.
- **Invalid/missing map or external links:** retain human-readable address/detail; render only validated URLs as links.
- **Reduced motion:** complete static compositions remain visible; remove parallax, scrub, auto-pan, and reveal dependency. Keep countdown values accurate and all user content in normal flow.
- **Low bandwidth/image error:** reserve dimensions, use a quiet neutral loading surface, and converge to the role fallback without a persistent spinner or broken-image icon.

## 7. Phase 3 acceptance checklist

- [x] Architecture maps all required, optional, and global website sections.
- [x] Every section has a distinct composition, anchor, density rule, and empty behavior aligned to Phase 1/2.
- [x] Repeatable sections have a scan-friendly composition and do not depend on one card layout.
- [x] Approved current artwork is assigned to renderer-owned section/layer placement; rejected and archived assets are explicitly excluded.
- [x] Mobile, reorder, empty, missing/broken media, and reduced-motion fallbacks are defined.
- [x] Every seam in the default sequence has an explicit transition; generic seams cover reordered sections.
- [x] User photos remain content; theme identity survives with all photos absent or replaced.
- [ ] Alpha-edge inspection on light/dark surfaces and asset optimization are complete before production artwork integration.
- [x] Phase 3 implementation maps this architecture to `template-config.ts`, content schema, fixture, and static renderer; every supported section key has a renderer composition.
- [x] Browser review of all supported visual sections, reorder cases, mobile widths, and image-empty states passed on 2026-10-23; Phase 4 effects are not part of this gate.

## 8. P3 non-goals

- No registry, route, backend, or publication flow changes are part of this Phase 3 implementation. Scoped renderer/config regression tests validate the P3 behaviors below.
- No new artwork was generated, retouched, moved, or optimized as part of Phase 3.
- No Phase 4 motion choreography, parallax system, particle atmosphere, 3D interaction, or animation tuning is specified beyond static seam/fallback behavior.
- No backend/API/media-projection changes; Phase 2's alt-text exposure dependency remains a separate implementation prerequisite for meaningful uploaded photos.
- No publication, admin sync/release, SEO metadata implementation, external album support, or event-data changes.

## 9. Handoff and unresolved implementation dependency

The user-approved set is mapped to public URLs and used by the static renderer. Before meaningful user-photo fields reach production, the Phase 2 dependency remains: frontend editor/API and published media projection must expose wedding-owned `MediaAsset.altText`. Alpha-edge QA and optimization are asset release checks, not a reason to reopen visual approval unless those checks reveal a defect that requires replacing an image.

## 10. Phase 3 continuation audit — 2026-10-23

The continuation preserves the approved Phase 1 palette/type and Phase 2 media roles. The acceptance map is: all nineteen canonical section keys have a composition/control; opening/closing anchors stay fixed; optional destinations depend on enabled state and usable content; missing/failed media preserves semantic content; editor field paths match the fixture; responsive text, media and decor remain inside the canvas. No Phase 4 animation or publication release is included.

Concrete fixes:

- Failed content photos converge to their missing-image composition. The last failed gallery image removes the section and its navigation destination. Decorative image failures suppress the artwork.
- Only READY images from the supplied public projection resolve. An editor media object's stale `src` cannot restore a missing or processing asset. Hero/story/gallery still require meaningful projection alt metadata.
- No-photo story milestones are text-only rather than carrying a sample monogram. Couple social links and wedding-party biographies now render the fields exposed by config; empty party groups disappear.
- Schema-driven event list controls use `{ eventId }` item objects in the authoring fixture; the renderer also accepts canonical ID strings. These are draft/editor reference representations; publication normalization remains a separate integration requirement. Event controls still expose reference IDs until the shared website editor supports an event picker.
- Schedule display sorts a copied list by each event's local date and item time, preserving authored storage order. Map/travel/social links require a valid HTTPS URL.
- Gift content needs a recipient plus account text or a resolved QR; it stays opt-in and the default fixture has no account data. Empty dress-code swatches leave no empty list. Both draft forms derive the known guest name without asking for it again.
- Desktop navigation uses a bounded scrollable rail. Navigation links, CTA and radio labels have at least 44px touch height; responsive anchor offsets clear the sticky navigation.
- Gallery desktop row heights are bounded. Long unbroken text wraps, including within the travel grid. Hero artwork stays at the outer edge; footer artwork has reserved desktop space and is omitted on narrow screens to protect the closing copy/date.

Validation on 2026-10-23: all twelve scoped tests pass, along with frontend typecheck, lint and production build. The build retains the existing large-chunk warning. Tests cover chapter order, fixed anchors/reordering, editor media, private event exclusion, failed/unresolved media, all supported optional visual sections, empty/disabled destinations, text-only story and safe links, schedule ordering, canonical event IDs, guest names and config/fixture fields. All twelve browser scenarios pass: every optional visual section at 320/375/390/480/768/1280/1440px, no media at 390px, reversed section order at 1440px, long text and broken media at 390px, and reduced motion at 768px. Checks found no global/content overflow, invalid section anchors, broken image elements, obscured events/RSVP anchor targets, undersized navigation targets or runtime exceptions; Enter opens the native FAQ disclosure. Screenshot review prompted the hero/footer decor clearance and bounded-gallery fixes above. Browser artifacts are temporary and ignored under `tmp/abd-p3-review/`.

Final config audit after browser review: `draft` status, `0.1.0` version, WEDDING_WEBSITE product type, preview route, nineteen section keys, seven required sections, fixed opening/footer anchors, global music placement, field/content paths, item limits, media ownership and implemented hero/story/gallery style values match the renderer/fixture. No publication-ready registry state was added.

## 11. Visual composition revision — 2026-10-30

The section keys, content anchors, editor controls, required/optional rules, API behavior and empty states are retained. Composition is updated to remove the stage metaphor and give photography, story and practical wedding information a consistent hierarchy.

| Section | Active composition | Color/art rule |
| --- | --- | --- |
| Navigation | No visual header or navigation bar is rendered; the config key remains for schema compatibility | Page starts directly with content |
| Hero | Portrait in a clean double-line paper frame; names overlay the lower image on a dark fade. One approved crescent and one cascading flower cluster frame opposite corners. | Shared ivory canvas, warm serif names, slim warm-gold frame and peach/cream floristry |
| Announcement | Centered short message in a light-beige inset | Dark warm text; no full-bleed color panel |
| Couple | Paired portrait mats with staggered offset on desktop; compact two-column cards on mobile | White and pale-beige surfaces, consistent portrait treatment |
| Story | Alternating photo/text chapter with quiet timeline rule | Shared canvas; no chapter wash or artwork at seams |
| Events/countdown | Scan-first event rows and compact countdown panel | Taupe metadata and a pale-beige countdown surface |
| Venues/travel/FAQ | Practical address directory and native disclosures; no fake map illustration | Warm white surfaces; addresses and links stay visually primary |
| Gallery | User photos form the visual chapter; geometric editorial grid and accessible lightbox | White canvas; no generated flowers around gallery edges |
| Party/dress | Clear repeatable people/color list layouts | Shared canvas with neutral image mats |
| RSVP/guestbook | Focused readable forms and approved wishes | Light-beige form surface with one taupe action |
| Gift | Opt-in account detail; QR fully visible | Neutral surface; no decoration over account data |
| Footer | Closing letter with one approved Phase 2.5 floristry asset at low visual weight | Pale beige surface and warm dark text |

All sections retain a common warm-white canvas with small inset-beige panels for meaningful chapter changes. Section reorder operations do not depend on decorative adjacency.

The template remains `draft` at `0.1.0`. At the P3 handoff, countdown and gallery were static and RSVP/guestbook/music were preview scaffolds. [Phase 4](./phase-4-motion-experience.md) added isolated live countdown, accessible gallery interaction, hero-photo depth and section motion. [Phase 5](./phase-5-release-review.md) then connected the established public RSVP/guestbook hooks, catalog music playback, SEO metadata, ICS event actions, editor preview bridge and optimized raster artwork (now archived after the visual revision). Capabilities in config describe the supported surface; they do not promote this draft. The remaining release gate is a public READY media projection with alt text plus a saved-editor/publication smoke test after the template version is released.
