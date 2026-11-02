# Linh & Huy — Phase 1–2 brief

**Status:** Phase 1–2 planning brief; its implementation is now Phase 3 template `Forever`. Preview route: `/templates/websites/forever/preview`. Linh & Huy remain fictional fixture content; they are not the template name.

## Phase 1 — Product meaning and content system

### Brief

- **Product:** `WEDDING_WEBSITE`, the public shared website for one wedding.
- **Purpose:** give guests a calm place to learn about the couple, find the date/events/venues and travel details, RSVP, and leave a wish.
- **Audience:** invited guests, primarily on mobile; family and friends also browse on desktop.
- **Journey:** hero and welcome → couple/story → date, events, venues → gallery/schedule → dress code, travel, FAQ → RSVP, guestbook, optional gift → closing. Forever deliberately has no navigation bar.
- **Art direction:** modern minimal editorial, warm off-white surfaces, charcoal type, muted stone accents, generous whitespace, fine rules, and large calm photo compositions. Use Playfair Display GMM for titles and Old Standard TT for supporting text.
- **Tone:** warm, composed, personal, and easy to scan. Vietnamese is primary. Keep English labels brief and use no more than three short English quotes/taglines.
- **Signature interaction candidate:** accessible gallery lightbox. It supports a useful guest task while native vertical scrolling and wedding logistics remain primary. Final interaction details stay open for renderer design.
- **Difference from other products:** no guest-personalized invitation/opening flow; no post-event recap or photo delivery.

### Section/content/editor matrix

Forever omits the navigation visual section by design. Its visual order starts at hero and announcement; the shared website contract still governs all other section keys, anchors, content paths, and editor labels. Optional empty sections leave the DOM without reserving blank space.

| Section / rule | Content anchor and canonical keys | Editor, default, and empty behavior | Action |
|---|---|---|---|
| `hero` required, fixed first | `hero.eyebrow`, `brideName`, `groomName`, `headline`, `primaryEventId`, `heroMediaId` | Editable names, optional eyebrow/headline, public primary event, optional image; missing image uses type-led composition | Scroll to event details and optional RSVP |
| `announcement` required, fixed second | `announcement.title`, `message` | Editable title/message; no guest-name interpolation; missing required message is a validation error | Optional details link |
| `couple` required, reorderable | `couple.bride.{displayName,biography,portraitMediaId,socialLinks}`, same for groom | Editable profiles; optional portraits/social links; missing portraits use initials/type; absent social links disappear | Validated HTTPS social links |
| `story` optional, reorderable | `story.title`, `introduction`, `milestones[]` | Repeatable date/title/body/image, max 12; empty list removes section and never reseeds fixture | Optional link to next chapter |
| `events` required, reorderable | `events.title`, `eventIds[]`, `introduction` | Select same-wedding `isPublic=true` events; empty event list fails validation | Event calendar/map actions from public projection |
| `countdown` optional, reorderable | `countdown.eventId` | Select public event; no editable timer copy; hide for invalid/past event | Timestamp/timezone-based; never negative |
| `venues` required, reorderable | `venues.title`, `eventIds[]`, `travelNote` | Select public venues/events; address remains if map URL is missing/invalid | Validated HTTPS map link when supplied |
| `gallery` optional, reorderable | `gallery.title`, `introduction`, `mediaIds[]` | READY media picker/order, max 40; empty hides section | Keyboard/touch accessible lightbox |
| `schedule` optional, reorderable | `schedule.title`, `items[]` | Repeatable event/time/title/detail, max 30; empty hides | Link back to event details |
| `weddingParty` optional, reorderable | `weddingParty.title`, `groups[]` | Repeatable groups/members, max 8 × 20; optional portraits/bios; empty hides | Never use guest list as source |
| `dressCode` optional, reorderable | `dressCode.title`, `message`, `colors[]` | Editable note and optional labeled HEX swatches; empty note/swatches hides | No required action |
| `travel` optional, reorderable | `travel.title`, `items[]` | Repeatable hotel/transport/parking/other, max 20; optional validated HTTPS URL; empty hides | Link only when configured |
| `faq` optional, reorderable | `faq.title`, `items[]` | Repeatable Q/A, max 20; no hardcoded prototype questions; empty hides | Keyboard accessible disclosure or visible list |
| `rsvp` optional, reorderable; capability must work | `rsvp.title`, `message`, `deadline`, `eventIds[]` | Editable introduction/deadline/event selection; empty event list invalid; form system labels stay renderer-owned | Common RSVP adapter: idle, submitting, success, validation/server/rate-limit/offline error, closed |
| `guestbook` optional, reorderable; capability must work | `guestbook.title`, `message` | Editable introduction; approved messages are runtime data; empty approved list still permits submission | Common guestbook adapter; never expose unapproved entries |
| `gift` optional, reorderable, opt-in | `gift.title`, `message`, `accounts[]` | Off by default; no accounts/message means absent; no real bank details in fixture/logs | Reveal configured account/QR only after owner opt-in |
| `footer` required, fixed last | `footer.message`, `signature` | Editable thank-you; signature may derive names; missing required message fails validation | Optional return-to-top |
| `music` optional global, not reorderable | `music.musicTrackId`, `autoplay` | No track/autoplay false by default; catalog picker | Visible play/pause; user gesture if autoplay is blocked |

### Fixture, editor, and acceptance

- Use clearly fictional content and approved demo media. Plan two public events, one or more venues, three story beats, 4–8 mixed-ratio gallery images, schedule, FAQ, and optional travel/dress-code/wedding-party data. Include empty/off variants, long names/copy, missing and non-READY media, and a passed event. Exclude guest lists, invite tokens, real account/contact details, and real PII.
- Types and paths mirror `WeddingWebsiteContentV1`. Each editable field gets a Vietnamese label, type, `contentKey`, constraints, default/options, `itemFields`, and `mediaRole` as applicable. Use shared editor schema; no template-key branches.
- Fixed CTA/form/system copy stays in the renderer. Empty arrays stay empty; no fixture reseeding. Required content validates; optional enabled-but-empty content is normalized off or raises a clear validation error. Toggling removes both DOM and nav anchor.
- Acceptance: recognizable layout after all photos are replaced or removed; config/section/order agreement; SEO title/description/canonical/OG, exactly one `h1`, focus/keyboard/contrast, adapter states, and responsive review at 375/390/480/768/1280px plus reduced motion.

**Non-goals:** personalized invitation/opening; public guest list; recap/photo delivery; event management; RSVP via email; external album embed; using prototype photos/copy as theme identity.

**Anti-patterns:** renderer-hardcoded demo names/date/venue or FAQ; photos as sole identity; fake mailto RSVP/guestbook; generic map search instead of event venue link; stale countdown; missing alt/focal strategy; blank gaps from disabled sections; scroll hijacking or inaccessible gesture-only controls.

## Phase 2 — Media contract

All user media is replaceable content. Renderer-owned identity comes from type, spacing, warm paper/ink palette, rules, and restrained photo framing. External albums are **not supported in v1** because canonical `gallery` only contains `mediaIds`.

| Media key | Owner / count | Crop, focal point, alt, loading | Missing/error/quality and responsive fallback |
|---|---|---|---|
| `hero.heroMediaId` | User upload, nullable, one | Wide 16:9 or 3:2, `cover`, owner focal point; descriptive alt from media metadata or couple/event context; eager-load lead image | Typographic/paper hero keeps names/date/place; mobile focal shift must not cover text |
| `couple.*.portraitMediaId` | User upload, nullable, one/person | 4:5 portrait, per-photo focal point, alt identifies person, lazy-load | Initials/type fallback; keep biography in place; do not stretch low-resolution files |
| `story.milestones[].mediaId` | User upload, nullable/item, max 12 items | Portrait or landscape editorial crop, focal point/item, alt from media/context, lazy-load | Keep story text/timeline; omit failed image without empty frame; vertical order on mobile |
| `gallery.mediaIds[]` | READY wedding media, 0–40, user-sorted | Mixed ratios, `cover`, focal point when supported; meaningful alt from metadata/editor, reserve dimensions, lazy-load below first row | Empty hides gallery; omit failed individual item and collapse layout; lightbox retains keyboard/touch controls |
| `weddingParty.groups[].members[].mediaId` | User upload, nullable/member, contract max 160 | Portrait crop/focal; alt uses member name/role; lazy-load | Keep name/role, use initials fallback; never source from guest list |
| `seo.ogImageId` | Optional READY user media, one | Landscape social crop with focal point | Renderer-owned title card with names/date when missing or failed |
| `gift.accounts[].qrMediaId` | Owner-provided, opt-in, nullable/account | Preserve full QR with no crop or quality-damaging encode; alt states account owner/purpose; load only when shown | Show configured text details without QR or omit empty account; never log QR/account data |
| Events, venues, travel | No image required | HTTPS map URLs are links, not embedded media; address text is primary | Missing/broken map leaves address visible; no map iframe in v1 |
| Music | No image required | Catalog track; explicit play/pause control | No track hides control; blocked autoplay falls back to visible play action |

### Media editability and independence

- All user photos are replaceable through the existing wedding media picker. Do not expose inputs for renderer-owned paper, background, frames, or dividers.
- Reuse existing media projection for READY state, wedding ownership, alt, and focal point where available. Do not store data URLs or invent URL-backed fields. Verify existing focal/alt support end-to-end before adding controls; if unsupported, record the smallest shared-contract change first.
- Reserve image dimensions; lazy-load below-fold assets; keep headings, venue information, and RSVP actions stable during loading/error. Test neutral replacement images, bright/dark images, mixed portrait/landscape, low-resolution, and no-image cases.
- `gallery` is internal wedding media only. Do not add external URL/embed/redirect editor controls in v1; revisit only through a documented contract change.

### Reference-page items not carried into the real template

The reference uses sample couple data/photos and fixed copy/dates. Phase 3 now moves those values into the renderer fixture and routes preview through the template registry while preserving the existing CSS and composition. RSVP and guestbook links are visual placeholders until the shared adapters are wired; public event/media projections are also release work. Never treat fixture text, links, or photos as configured wedding content.

## Phase 4 — Motion

- The hero photo makes a one-time, 1.4-second scale settle; hero copy enters in a short stagger.
- Sections and each meaningful content element within them reveal once with opacity and a restrained upward rise: headings, copy blocks, image frames, links/actions, event/date details, and repeatable cards/rows each have their own observed target. Sibling elements enter in order at 180ms intervals with a 1.05-second transition so each step is easy to follow.
- Gallery images use a small hover scale only on hover-capable pointers. FAQ disclosure and music controls use short state transitions.
- Mobile reduces the reveal offset to 10px. `prefers-reduced-motion` keeps all content visible and disables the entrance, stagger, hover, and state transitions. No looped ambient animation or scroll-linked motion is used.
