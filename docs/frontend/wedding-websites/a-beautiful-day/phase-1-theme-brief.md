# A Beautiful Day — Phase 1 Theme Brief

> **Visual revision 2026-10-30:** the “reception stage” direction below is historical and is superseded by the [sunlit botanical editorial revision](./phase-1-theme-brief.md#visual-revision-2026-10-30). Keep the product meaning, audience, content contract, and viewer job; retire curtain, bamboo-screen and lantern identity.

Status: Phase 0 shell and Phase 1/2 contracts are complete. The former Phase 2.5 raster artwork set was approved by the user on 2026-10-22, later retired from renderer use and moved to `assets/templates/a-beautiful-day/archive/retired-webp/`; its alpha-edge QA and optimization are provenance only; Phase 5 release evidence is recorded in the release review. Phase 3 architecture, template config, content fixture and static renderer are implemented; the responsive/empty/reordered/broken-media browser review passed on 2026-10-23. Phase 4 motion, accessible gallery interaction and isolated live countdown are implemented and validated; see [Phase 4 Motion Experience](./phase-4-motion-experience.md). Phase 5 implementation is complete; the template remains draft because the public snapshot/editor media contract does not yet expose a READY media projection with alt text and the saved-editor/publication smoke path needs a released template version. See [Phase 5 Release Review](./phase-5-release-review.md), [Phase 2.5 Artwork Brief](../../../../docs/frontend/wedding-websites/a-beautiful-day/artwork-brief.md) and [Phase 3 Section Architecture](./phase-3-section-architecture.md).

## Phase 0 preview and spatial contract

Phase 4 continuation: [Motion Experience](./phase-4-motion-experience.md) records the material stage, viewport choreography, desktop story depth, accessible album interaction and reactive reduced-motion/native-scroll fallbacks. Code, automated checks and the seventeen-scenario browser review are complete; evidence is tracked there. The draft status and outstanding public integration/release gates remain unchanged.

- Preview: [`/templates/websites/a-beautiful-day/preview`](http://localhost:5173/templates/websites/a-beautiful-day/preview)
- Renderer shell: `frontend/src/templates/websites/a-beautiful-day/ABeautifulDayWebsite.tsx`
- The page canvas is full viewport width; the centered content boundary is capped at `80rem` (1280px).
- Inline gutters use `clamp(1rem, 4vw, 3.5rem)`: 16px minimum on small screens, fluid through tablet widths, and 56px maximum on desktop.
- The outer canvas has a `100dvh` minimum height with `100svh` and `100vh` fallbacks. The inner boundary scales with viewport height and caps at 46rem on larger screens.
- Horizontal overflow is clipped at the template root. Child sizing uses border-box; the shell introduces no fixed-width content.
- Mobile behavior: at widths up to 40rem, gutters reduce to 16px and the inner boundary uses a 72svh minimum capped at 42rem.
- The shell has no animation or atmosphere, so it needs no motion fallback in this phase. Reduced-motion preference does not change the static layout.
- Phase 0 is a neutral spatial shell only. Do not treat its temporary title/status content or dashed boundary as final art direction or a website section.

## Concept summary

`A Beautiful Day` is a shared wedding website that helps guests feel the warmth of the celebration and quickly find its story, schedule, venues, gallery, and RSVP. It presents the wedding as an intimate, carefully composed reception with a contemporary East Asian influence.

### Visual revision — sunlit botanical editorial

- **Design read:** public wedding publication for mobile-first guests; warm garden-journal editorial with bright, confident accents and calm information hierarchy.
- **Meaning:** a sunlit wedding journal that moves from the couple’s portrait to their story, practical plans, shared photographs and a closing note.
- **Palette:** warm ivory `#FCF8F0`, pale garden `#E7EADB`, deep berry `#773448`, apricot `#E56D4F`, botanical green `#4D6043`, ink `#2D2927`. Berry is reserved for strong actions and chapter emphasis; apricot marks small interaction and timeline details.
- **Visual language:** editorial photography in simple arch/rectangular mats, fine botanical line art in SVG, paper-like surfaces and crisp dividers. User photographs provide the photographic richness.
- **Anti-patterns retired:** full-stage curtain photo, photographic lantern props, repeated floral cutouts, bamboo-screen framing, low-contrast beige-on-beige sections, and decorative props beside RSVP/event details.
- **Signature moment:** a balanced two-column hero with the couple’s names and event facts on one side and one clear portrait on the other; mobile stacks copy before portrait.
- **Density:** airy but not empty. Practical details use compact rows/cards; visual emphasis belongs to couple portraits, timeline and gallery.
- **Section art rule:** renderer-owned botanical line art appears only at the hero and closing footer. Keep all practical chapters free of floating artwork.

## Reference set

The three temporary MinIO analysis screenshots were removed on 2026-10-23 after their design-reference role was complete. The table below records their original roles; they are not production artwork or default template content.

| File | What the photograph shows | Useful reference |
|---|---|---|
| `01-stage-wide-reference.jpg` | Wide view of a reception stage with ivory draping, central dark curtain, asymmetric pastel flower clusters, lanterns, seating, and floor | Overall stage framing, balance, and focal hierarchy |
| `02-floral-detail-reference.jpg` | Close view of flowers layered over bamboo screens, with trailing greenery and warm lanterns | Floral cluster shape, materials, vertical rhythm, and warm light |
| `03-couple-backdrop-reference.jpg` | Front view of a bright central name backdrop framed by bamboo, flowers, and lanterns | Personalization hierarchy, central negative space, and asymmetric framing |

The photographs are screenshots and retain social-media interface marks. The third contains wedding-specific names and date. Do not render these marks or personal details as template content, and do not ship these photographs as production assets.

## Art direction

- **Mood:** warm, composed, celebratory, intimate; contemporary with restrained East Asian reception cues.
- **Palette:** ivory and soft cream as the continuous canvas; peach, blush, muted rose, and milk-white for flowers; bamboo brown and restrained deep green for structure; warm amber for light accents.
- **Typography:** Lora for warm, literary display headings and Be Vietnam Pro for Vietnamese body copy, metadata, and controls. Both are already available locally with SIL Open Font License records. Use no script face by default; the couple names remain readable and editorial rather than ornamental.
- **Starting palette direction:** warm ivory `#F7F4EE`, paper cream `#EEE8DE`, muted peach `#D8A398`, dusty rose `#A96F70`, bamboo brown `#8C755B`, foliage `#586453`, and dark ink `#292725`. These are art direction starting points, not final contrast-tested tokens.
- **Materials:** layered drapery, fine bamboo rhythm, soft paper-like surfaces, sculptural flower masses, curved trailing foliage, and diffused lantern light.
- **Composition:** preserve a clear center for names and essential information; use asymmetric floral framing rather than mirrored corner decorations; keep dense decoration away from forms and long text.
- **Renderer-owned identity:** palette, type hierarchy, stage-like framing, bamboo-inspired linework, floral ornaments, dividers, and gentle light treatment must carry the theme even when all user photographs are replaced or absent.

## Component breakdown from the photographs

### Shared visual system

1. **Stage frame:** a horizontal cornice and gathered drapery establish a ceremonial frame.
2. **Central field:** a quiet, bright or darkened curtain plane gives names, dates, and calls to action room to read.
3. **Floral masses:** large, irregular clusters in peach, blush, dusty rose, and cream create the main visual weight.
4. **Bamboo screens:** repeated vertical lines add structure behind the organic flowers.
5. **Lanterns:** spherical and elongated cream forms provide a repeated silhouette and warm light points.
6. **Trailing foliage:** curved green strands break the vertical bamboo rhythm and connect upper and lower decoration.
7. **Grounding details:** wood floor, low tables, and chairs make the photographs feel like a real venue; these are contextual content, not required template ornaments.

### Photograph-specific reading

- **Wide stage:** the curtains form a large frame; flower clusters sit at both sides but differ in shape and height; the center remains the stage focal area. Use this as a composition reference for an opening or venue feature, not as a literal scene to reproduce.
- **Floral close-up:** bamboo is the stable background grid; flowers occupy several depth layers; lanterns punctuate the arrangement; greenery creates a diagonal sweep. This is the strongest reference for separate floral and foliage artwork roles.
- **Name backdrop:** a clear central panel carries the couple's names and date, with the Chinese double-happiness symbol above. The surrounding floral structures are asymmetric. Treat names/date as editable content and the symbol as optional artwork, not fixed text.

## Product meaning, audience, and viewer job

- **Product type:** `WEDDING_WEBSITE`, the couple's shared public wedding website before and during the celebration.
- **Meaning:** a welcoming place where the couple tells their story and guests prepare for the day. The stage-like visual language gives the celebration warmth; event details remain quick to find and use.
- **Primary audience:** invited guests visiting on a phone, including family members who need practical details.
- **Secondary audience:** friends and relatives who want to understand the couple's story, browse shared photographs, or send a message.
- **Authors:** the couple edits shared wedding content in the website editor. The website does not identify or personalize content for a particular guest.

Guests should be able to:

1. Identify the couple, wedding date, and primary venue immediately.
2. Understand the couple's story at a comfortable reading pace.
3. Find event times, venue addresses, schedule, travel guidance, and answers to practical questions.
4. Confirm attendance and send a message through the supported public flows.
5. Explore photographs and optional information the couple has chosen to publish.

This is not the per-guest invitation surface and does not use guest-specific opening rituals. It is not a post-event recap or a private guest directory. Its center is the shared story plus actionable plans for attending.

## Viewer journey

`navigation → hero and announcement → couple and story → events, countdown, venues, and schedule → gallery → travel, FAQ, and optional details → RSVP and guestbook → closing footer`

The navigation and hero expose practical destinations early. Storytelling supports the visit but never hides event, venue, or RSVP information behind a pinned or horizontal-only interaction. The default order follows the canonical website section order below.

## Canonical section/content/editor matrix

The matrix uses the canonical v1 content paths in `content-and-template-config-contract.md`. User-entered copy is Vietnamese. There are no English quotes or taglines. The English template name is product branding, not editorial copy.

| Section / default | Content anchor and starter copy | Canonical content paths and editor controls | Action and empty behavior |
|---|---|---|---|
| `navigation` / required, on | Compact monogram and links to active sections | No separate content; derive monogram from couple names and labels from canonical section metadata | RSVP link points to `#rsvp` only when enabled. Keep first; cannot toggle or reorder. Links for disabled sections are omitted. |
| `hero` / required, on | “Ngày vui của chúng mình”; couple names, primary date and venue summary | `hero.eyebrow` (string), `hero.brideName` and `hero.groomName` (required strings), `hero.headline` (string), `hero.primaryEventId` (event selector), `hero.heroMediaId` (optional image) | “Xem thông tin ngày cưới” points to events/venues; RSVP CTA appears only when enabled. Keep second; cannot toggle or reorder. Date/venue come from the selected public event projection. Missing hero media keeps a complete typography-led composition. |
| `announcement` / required, on | “Gửi những người thương”; “Chúng mình rất mong được cùng bạn đón ngày vui này.” | `announcement.title` (string), `announcement.message` (required text) | No CTA. Keep third in the fixed opening group. Missing message blocks publish and shows an editor error. |
| `couple` / required, on | “Về chúng mình”; short introductions to each partner | `couple.bride.displayName` and `couple.groom.displayName` (required strings), each `biography` (text), `portraitMediaId` (optional image), `socialLinks[]` (opt-in HTTPS links) | Optional social links open their own destination. Required and reorderable. Missing portrait uses a named typographic profile treatment, never an empty hole. |
| `story` / optional, on | “Chuyện chúng mình”; dated milestones from meeting to wedding | `story.title`, `story.introduction`, `story.milestones[]` with `id`, `date`, `title`, `body`, and `mediaId` | No forced CTA. Toggle and reorder; maximum 12 milestones. Empty list hides the section and nav link; publish validation asks the couple to add a milestone or turn the section off. |
| `events` / required, on | “Lịch trình ngày vui”; public ceremonies and reception events | `events.title`, `events.eventIds[]`, `events.introduction`; event references are selected from public events in this wedding | “Thêm vào lịch” uses the selected event. Required and reorderable; at least one valid public event is needed. Past events retain readable date/status information. |
| `countdown` / optional, on | “Còn lại đến ngày vui”; time remaining to the primary event | `countdown.eventId` (event selector) | No CTA. Toggle and reorder. Use the primary event by default; suppress negative counts and show a calm completed state after the event. Reduced motion keeps the numeric countdown accurate without flipping animation. |
| `venues` / required, on | “Hẹn gặp bạn tại đây”; addresses and directions for selected events | `venues.title`, `venues.eventIds[]` (event selectors), `venues.travelNote` | “Mở bản đồ” opens a valid map URL; address remains visible if the map link fails. Required and reorderable; at least one public event with address is required. |
| `gallery` / optional, on | “Những khoảnh khắc thân quen”; couple-selected photographs | `gallery.title`, `gallery.introduction`, `gallery.mediaIds[]` (multi-image picker) | Open images in an accessible lightbox. Toggle and reorder; max 40 media. No selected images means no section, no blank frame, and no nav link. |
| `schedule` / optional, on | “Từng khoảnh khắc trong ngày”; time-ordered event moments | `schedule.title`, `schedule.items[]` with `id`, `eventId`, `time`, `title`, `detail` | No CTA. Toggle and reorder; max 30 items. Empty list hides section; order items chronologically for display without changing saved content. |
| `weddingParty` / optional, off | “Những người đồng hành”; groups and roles chosen by the couple | `weddingParty.title`, `weddingParty.groups[]` (`id`, `title`), each with `members[]` (`id`, `name`, `role`, `biography`, `mediaId`) | No CTA. Toggle and reorder; max 8 groups × 20 members. Never source members from guest records. Empty groups hide section and trigger publish guidance. |
| `dressCode` / optional, off | “Một chút sắc màu cho ngày vui”; clothing note and optional palette | `dressCode.title`, `dressCode.message`, `dressCode.colors[]` (`id`, `label`, `hex`) | No CTA. Toggle and reorder. No message and no colors means empty; do not show a decorative empty swatch row. |
| `travel` / optional, off | “Gợi ý cho chuyến đi”; hotel, transport, and parking information | `travel.title`, `travel.items[]` (`id`, `type`, `title`, `detail`, optional HTTPS `url`) | External links open the supplied HTTPS destination. Toggle and reorder; max 20 items. Empty list hides section and link. |
| `faq` / optional, off | “Bạn có thể đang thắc mắc”; practical wedding-day questions | `faq.title`, `faq.items[]` (`id`, `question`, `answer`) | Questions expand as accessible disclosures. Toggle and reorder; max 20 items. Empty list hides section and link. |
| `rsvp` / optional, on | “Bạn sẽ đến chứ?”; attendance response for selected events | `rsvp.title`, `rsvp.message`, `rsvp.deadline`, `rsvp.eventIds[]` | Submit through the established RSVP API flow with pending, success, deadline-closed, validation, rate-limit, and retry states. Toggle and reorder. Hide all RSVP CTAs if disabled. Respect runtime `guestName`; ask for a name only when absent. |
| `guestbook` / optional, on | “Gửi chúng mình một lời chúc”; public-approved messages and a message form | `guestbook.title`, `guestbook.message`; approved wishes arrive from the public projection, not editable wedding content | Submit through the established guestbook API flow. Empty approved-message list still keeps the form. Toggle/reorder. Respect runtime `guestName`; ask for a name only when absent. |
| `gift` / optional, off | “Mừng vui ngày cưới”; only details the couple explicitly chooses to share | `gift.title`, `gift.message`, `gift.accounts[]` (`id`, `ownerLabel`, optional `bankName`/`accountNumber`, `qrMediaId`) | Reveal public gift details only when enabled and populated; no seed account details. Toggle and reorder. Empty accounts hide the section; publish requires explicit opt-in and valid data. |
| `footer` / required, on | “Cảm ơn bạn đã cùng chúng mình tạo nên ngày vui”; closing signature and date | `footer.message` (required text), `footer.signature` (optional string); couple/date references derive from shared content | No CTA required. Always last; cannot toggle or reorder. Missing message blocks publish and displays an editor error. |
| `music` / optional, off | Compact, persistent playback control | `music.musicTrackId` (catalog selection), `music.autoplay` (boolean) | Global editor card; not in `sectionConfig.order` and not a visual anchor. Off by default; do not autoplay before clear user interaction. No track means no control. |

### Global SEO metadata

SEO is a global editor group, not a visual section: `seo.title` (required string, max 70 characters), `seo.description` (required text, max 180), and `seo.ogImageId` (optional image). The title/description are initially suggested from the couple and primary event, then remain editable. A missing OG image uses the platform fallback. The hero owns the page's single `h1`; section headings follow a logical hierarchy. Decorative artwork uses empty alt text; content photographs need meaningful alt text.

### Section order and layout choices

Default visual order is `navigation → hero → announcement → couple → story → events → countdown → venues → gallery → schedule → weddingParty → dressCode → travel → faq → rsvp → guestbook → gift → footer`. All sections default on except `weddingParty`, `dressCode`, `travel`, `faq`, `gift`, and global `music`. `navigation`, `hero`, and `announcement` stay in the opening anchor group; `footer` stays last. `couple`, `events`, and `venues` are required but may reorder within the middle content. All other optional visual sections can toggle and reorder. `music` never enters the visual order.

| Section | Chosen layout and reason | Mobile and reduced-motion fallback |
|---|---|---|
| `navigation` | `compact-sticky`, keeping guest actions reachable | Compact menu; no animated scroll lock; active section is conveyed with more than color. |
| `hero` | `full-bleed-editorial`, with a clear title field framed by stage-inspired composition | Natural vertical layout with static frame; reduced motion presents the completed hero immediately. |
| `announcement` | `framed-note`, echoing a welcome note without becoming a second hero | Full-width note with readable measure; static. |
| `couple` | `dual-portraits`, making the two profiles equally legible | Stack profiles vertically; static portraits and typography. |
| `story` | `alternating-timeline`, linking milestones with a fine structural line | One vertical timeline; no sticky pinning or horizontal-only content. |
| `events` | `editorial-program`, emphasizing event time and venue over card chrome | Vertical event list with direct add-to-calendar action; static. |
| `countdown` | `inline-editorial`, subordinate to actual date and schedule information | Single-line or compact numeric units; accurate static numbers without animation. |
| `venues` | `map-split`, pairing location context with address and directions | Stack location and address; link works without a map; static. |
| `gallery` | `editorial-grid`, giving photographs varied but controlled scale | One-column/short staggered grid; lightbox remains keyboard/touch operable and static. |
| `schedule` | `vertical-timeline`, matching the chronological task | Single vertical list; static time markers. |
| `weddingParty` | `role-groups`, grouping people by role rather than guest list | Stacked role groups; static portraits. |
| `dressCode` | `fabric-swatches`, showing optional palette with readable labels | Horizontally wrapping swatches; no animated color movement. |
| `travel` | `editorial-directory`, prioritizing actionable transport details | Single column; direct links and text remain visible. |
| `faq` | `accordion`, reducing page length while preserving keyboard access | Full-width disclosures; no animated height requirement under reduced motion. |
| `rsvp` | `single-card-form`, creating a focused response area | Full-width form with touch-sized controls; all submission states remain static and clear. |
| `guestbook` | `stacked-notes`, presenting approved wishes as readable notes | Single-column messages; no auto-advancing carousel. |
| `gift` | `qr-cards`, grouping details only after explicit opt-in | Stack accounts; QR and account text remain selectable; static. |
| `footer` | `closing-letter`, ending the shared story with a short thank-you | Centered, compact closing; no exit animation. |

### Content and editor rules

- Every owner-editable value maps to a canonical content path and future `sections[].fields` metadata with an explicit Vietnamese label, field type, and limits. Do not put fixed button labels, helper text, or generic prompts into editable content fields.
- `navigation` labels, enabled anchors, and monogram are derived; they do not get a duplicate content shape.
- `events`, `venues`, `countdown`, `schedule`, and `rsvp` use public event references from the same wedding. Do not copy event addresses or dates into disconnected template text fields.
- Optional list sections with no valid items are omitted from DOM, order, and navigation. The editor shows guidance to either add valid content or turn the section off; publish cannot pin an enabled-but-empty optional section. Deleting all items stays deleted and never reseeds fixture data.
- Required content remains visible and invalid data blocks publish with field-specific feedback. Required sections cannot be disabled.
- Form state and request behavior remain the shared RSVP/guestbook flows. The theme owns presentation only; it must preserve loading, success, failure, validation, deadline, rate-limit, offline/retry, and `guestName` behavior.
- External user URLs must be HTTPS. Gift details remain unpublished unless the couple explicitly enables and populates `gift`.

## Fictional content fixture plan

- Create one entirely fictional couple and wedding with Vietnamese names, a long-name variant, two public events, distinct venues, a primary event, varied times, and plausible but invented location text.
- Include Vietnamese announcement, biographies, milestones, FAQ, dress code, travel, RSVP, guestbook, and footer copy; do not add English quotes/taglines.
- Exercise 3–12 story milestones, multiple gallery images, schedule items, optional wedding-party groups, and more than one gift account only in explicit opt-in variants.
- Keep a complete default fixture plus variants with long names, a missing hero/couple/gallery image, empty optional lists, optional sections disabled, RSVP deadline passed, and no approved guestbook messages.
- Use neutral, appropriately licensed media in later phases. Never use the MinIO screenshots or real wedding names/date as fixture content.

## Motion direction

- **Single signature:** a short hero drapery split linked to the visitor's first scroll through the hero, signaling the transition from the welcome to the couple's story. The text stays readable and in normal flow; no pinned scroll lock.
- **Desktop behavior:** on fine pointers, map the first 45vh of hero scroll to the two curtain panels moving outward by at most 2rem each. The effect releases naturally with the hero; it does not pin the page or block access to content.
- **Motion token:** `duration: 0.62s`, `stagger: 0.1s`, `listStagger: 0.06s`, `ease: [0.22, 1, 0.36, 1]`. Entrance targets use explicit semantic elements. Reduced-motion paths set delay and duration to zero.
- **Performance budget:** the signature has at most two decorative `transform` layers. No video, canvas/WebGL, continuous animation loop, particle field, or animated blur. Text and controls stay stationary.
- **Fallback:** if scroll progress cannot be observed, render the completed curtain composition statically. Mobile/touch shows that same composition in native vertical scroll without a scrubbed split.
- **Supporting motion:** section content reveals use explicit semantic targets and do not share ownership with decorative layers. Ambient light/foliage may be static in the first version; it is not a second signature effect.
- **Reduced motion:** render the completed composition at rest; do not hide content or delay its visibility.

## Content and media principles

- All wedding-specific names, dates, messages, venue information, and photographs are editable content.
- User photos enrich the story but never carry the theme identity.
- The reference photos are not fixture media. Use fictional fixture content and appropriately licensed neutral photography for preview and implementation.
- Keep essential information readable without images; provide intentional missing-media and failed-image compositions.
- Exact media roles, ratios, crop/focal rules, loading, alt text, empty/error fallbacks, and editor mapping are specified in the Phase 2 media contract. Frontend alt-text editing and published projection support remain implementation dependencies.

## Phase 1 acceptance map

| Phase 1 decision | Acceptance |
|---|---|
| Product meaning and audience | Shared `WEDDING_WEBSITE` before/during the event; guest and family viewer jobs and couple authorship are explicit. |
| Product boundary | Distinct from per-guest invitation and post-event recap; no guest-specific content or guest directory. |
| Experience arc | Starts with shared identity and direct navigation, tells the couple's story, prioritizes event logistics, then supports RSVP/messages and optional exploration. |
| Art direction | Mood, starting palette, typography, materials, composition, renderer-owned identity, and reference-specific component analysis are documented. |
| Canonical section contract | All 18 visual sections plus global music and SEO are mapped to canonical v1 paths, required/default/toggle/reorder status, CTA/action, and empty/fallback behavior. |
| Layout choices | Each visual section selects one catalog layout and records mobile and reduced-motion behavior. |
| Content and language | Starter headings/messages are Vietnamese; no English quote/tagline is planned; fixed labels stay out of editable fields. |
| Fixture plan | Fictional data, long names, multiple events, missing media, empty/disabled options, RSVP deadline, and no approved wishes are covered without real PII. |
| Motion direction | One hero signature has a purpose, trigger, transform-only budget, mobile fallback, and reduced-motion composition. |
| Phase boundary | P0 remains a shell. Phase 2 specifies media roles/crop/fallbacks; Phase 2.5 artwork candidates await review; later phases own section composition, renderer, and release. |

### Downstream review gates

These are acceptance targets for later phases, not claims that implementation has already passed:

- Guests can reach events, venues, and RSVP from the opening navigation without completing the story scroll.
- Required sections always render and cannot be disabled; optional sections can be toggled/reordered and leave no blank space or dead navigation link.
- Long Vietnamese names, empty optional arrays, missing images, passed events, closed RSVP, API failures, and no approved guestbook messages have intentional outcomes.
- Every user photo can be replaced or removed without losing the theme's visual identity or the content hierarchy.
- The full site has no horizontal overflow at 375px, 390px, 768px, 1280px, and wide desktop; reduced motion keeps all content visible and complete.
- Forms remain keyboard/touch accessible, expose clear pending/success/error/closed states, and preserve `guestName` behavior.
- SEO has one `h1`, a usable title/description/canonical/OG fallback, and meaningful alt text for content media.
- Adjacent sections maintain continuity in canvas, light, crop, texture, and decoration after section reorder or toggle.

## Non-goals and anti-patterns

- Do not recreate the photographed stage as one flattened background image.
- Do not use the screenshot watermarks, app controls, or wedding-specific names/date.
- Do not make the whole site a floral collage or put text over dense flowers.
- Do not make the theme depend on bamboo, lantern, or wedding photographs uploaded by the couple.
- Do not add an envelope-opening ritual; this is a shared wedding website, not an invitation.

## Phase 2.5 handoff

Phase 2 media boundaries are documented in [Phase 2 Media Contract](./phase-2-media-contract.md). Phase 2.5 candidate prompts and review files are in the template bundle. The temporary MinIO screenshots are reference-only and must not enter fixtures or the release bundle.


### Phase 0 spatial re-audit — 2026-10-30

The preview shell remains full-viewport and centered, with a maximum content boundary of `88rem` (1408px), fluid outer gutters and no fixed-width children. The hero now uses a desktop two-column balance and natural mobile stacking; the photo mat reserves a 4:5 ratio and becomes 4:4.3 on narrow screens. The palette/artwork revision does not create a new overflow boundary. Acceptance still includes direct preview route, 320–1440px viewport checks and no horizontal overflow.

### Latest visual direction — 2026-10-30

The active visual brief is now calm and content-led: warm white and pale beige surfaces, dark warm-brown text, local Lora/Be Vietnam Pro fonts, open spacing and no website header. Avoid berry/coral/green color blocks, decorative fake map imagery and repeated props. Use the approved Phase 2.5 modern-floristry artwork v05 once at the footer; do not generate replacement artwork without approval. The source reference photos are no longer in the repository, so treat their written composition notes as provenance only and do not recreate identifying venue details.
