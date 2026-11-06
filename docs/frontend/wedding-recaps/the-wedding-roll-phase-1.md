# The Wedding Roll — Phase 1 Product and Content Brief

Template key: `the-wedding-roll-recap`
Product type: `WEDDING_RECAP`
Preview: [`/templates/recaps/the-wedding-roll/preview`](http://localhost/templates/recaps/the-wedding-roll/preview)
Phase status: Phase 0 shell and Phase 1 brief complete. The Phase 2 media contract/config mapping is complete; its media-independence audit remains a release gate.

## Theme brief

**The Wedding Roll** is a compact editorial photo journal that treats a wedding day as a developed 35mm roll. A shared warm-ivory paper canvas runs through the whole page. Restrained rust-orange marks, film-frame numbers, perforation details, grain, and varied photo crops provide identity without assigning a separate background band to every section.

The mobile experience is the primary composition. Guests should understand the page quickly and reach **open/download photos** without scrolling through a long story. The hero CTA, header action, and fixed mobile action all lead directly to photo delivery. Story and optional memories stay concise; repeated wishes and memory cards use compact treatments.

Copy policy: film-roll language is visual art direction and the template name only. Guest-facing copy describes the couple, wedding day, memories and people; it does not use film, camera, frame-count or photo-development metaphors.

Visual metaphor: a developed film roll / contact sheet. Emotion: intimate, tactile, candid, grateful. Typography: editorial serif display with a highly readable Vietnamese sans-serif and small mono film labels. Motion stays restrained: short viewport reveals and small image-frame movement only; mobile keeps native vertical scroll, and reduced motion renders the same content statically.

## Product meaning

Wedding Recap is the couple's post-wedding digital album: guests revisit the day, open or download their selected photos, and finish with a thank-you. It is not an invitation or a pre-wedding information site.

## Viewer job and audience

Primary audience is a wedding guest opening a shared link on a phone. Their first job is to recognize the couple and find the photo album. Secondary jobs are to revisit a few concise memories, read selected wishes, and see the couple's closing thanks. The couple owns the content and chooses which optional memories are public.

## Viewer journey

`hero → brief story → chronological chapters → themed moments → photo delivery → optional memory inserts → thank-you`

The header and hero also provide direct links to photo delivery so the primary job never depends on reading the full recap first. Optional sections are independent; disabled sections leave no gap or orphan divider.

## Required and optional sections

Required: `hero`, `ourStory`, `chapters`, `moments`, `photoDelivery`, `thankYou`.

Optional: `guestbook`, `peopleBehindTheDay`, `soundtrack`, `behindTheScenes`, `memoryCapsule`.

## Section/content matrix

| Key                  | Status / story role                                          | Anchor and content keys                                                                                    | Default fixture                                        | Editor controls                                                              | Empty behavior                                                      | CTA / action                                               | Toggle, repeat, reorder                                                  |
| -------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------ |
| `hero`               | Required cover; identify the recap immediately               | Couple names, date, optional place, short tagline, replaceable cover media and alt text                    | Neutral couple/date copy; media optional               | Edit names, date, place, tagline, media and alt text                         | Paper/film frame remains; names/date and album action stay readable | **Mở & tải ảnh** opens `photoDelivery`                     | Required; no toggle/repeat; fixed first                                  |
| `ourStory`           | Required short emotional lead-in                             | Eyebrow, title, brief body, optional quote and supporting media                                            | One short Vietnamese paragraph and optional quote      | Edit heading/body/quote/media                                                | Text-first layout                                                   | Optional jump to chapters; no competing primary CTA        | Required; no toggle/repeat; follows hero                                 |
| `chapters`           | Required chronological account of the day                    | Repeatable items: time/date label, title, short description, optional cover, optional album reference      | Three generic chapters: preparation, vows, celebration | Add/edit/remove/reorder items within configured limits                       | Preserve time/title/copy; use neutral film-frame placeholder        | Optional “Xem ảnh chương này”                              | Required; section stays in main flow; items repeat and reorder           |
| `moments`            | Required thematic groupings, distinct from timeline          | Repeatable items: title, short description, optional cover and album reference                             | Family, friends, celebration                           | Add/edit/remove/reorder items within configured limits                       | Compact text-first frame                                            | Optional “Xem album”                                       | Required; section stays in main flow; items repeat and reorder           |
| `photoDelivery`      | Required primary function: let guests view/download highlighted photos or open the full album | Eyebrow, heading, short access copy, up to 50 highlighted photos and optional HTTPS album URL | Sample featured photos; no real external URL            | Select/upload up to 50 photos and/or provide a validated external album URL; both actions can be enabled together | Keep source setup distinct and explain when each guest action appears | **Xem ảnh nổi bật** and **Xem toàn bộ ảnh ngày hôm ấy**     | Required; no toggle; keep prominent after moments; each action is independently source-gated |
| `thankYou`           | Required album close                                         | Heading, brief thank-you, couple signature, date, optional finale media and alt text                       | Short Vietnamese thanks and sample initials            | Edit copy, signature, date and media                                         | Text-first back-cover composition                                   | No competing primary action                                | Required; no toggle/repeat; final required section                       |
| `guestbook`          | Optional curated response                                    | Heading, one-line intro, selected approved wishes with author label, optional media                        | Up to three short wishes                               | Toggle; edit title/intro; select and order approved wishes                   | Compact text list/cards without media                               | None required                                              | Independent toggle; compact; inserts before closing flow                 |
| `peopleBehindTheDay` | Optional photo story for the people who helped the day come together | Personal reflection and repeatable groups, each with a title, short note and 1–10 photos | Family, backstage, friends and crew                    | Toggle; edit reflection; add/edit/remove/reorder up to 10 groups and choose 1–10 photos per group | Keep title and note visible while the owner edits a group             | “Xem ảnh” opens that group's lightbox                      | Independent toggle; carousel shows three cards per desktop screen        |
| `soundtrack`         | Optional music tied to the day                               | Heading, short intro and audio source                                                                      | Text-only fixture with no autoplay                      | Toggle; edit copy and source                                                  | The shared floating MusicPlayer appears only when a source is set   | Explicit play/pause through the shared player             | Independent toggle; separate from the guestbook and photo story           |
| `behindTheScenes`    | Optional “Hậu trường” group inside the people photo story     | Group title, note and up to 10 photos                                                                     | One backstage group among family/friends/crew           | Toggle the group; edit its text and photos from the people-group list        | Keep the note visible if photos are empty                            | “Xem ảnh” opens the group lightbox                         | Independent group toggle; shares the people carousel                  |
| `memoryCapsule`      | Optional short note for a future anniversary                 | Heading, brief message, date/label and optional media/alt                                                  | One concise future-facing note                         | Toggle; edit message/date/media                                              | Letter remains readable without media                               | None required                                              | Independent toggle; one short insert near thank-you                      |

## Content fixture plan

- Use fictional Vietnamese couple names, a sample date, and no real guest names or private information.
- Include at least three chapters and three thematic moments so timeline and category groupings are visibly different.
- Keep the hero and photo-delivery CTAs functional as in-page links; use no real album URL.
- Include short examples for all six optional sections in the showcase fixture, while published content may disable each independently.
- Use neutral/media-replaceable placeholders. Sample imagery is never the source of the film-journal identity.
- Keep story copy, chapter descriptions, moment captions, wishes, and memory-capsule copy compact for mobile scanning.

## Editor field plan

- Global recap metadata: public title, description, share image and publication state remain recap-level fields.
- Hero: couple names, date, optional place, tagline, cover media and alt text.
- Story: eyebrow, title, brief body, optional quote and repeatable support media within a small limit.
- Chapters: repeatable dated/time-labelled items with title, short description, cover and optional album reference.
- Moments: repeatable themed items with title, short description, cover and optional album reference.
- Photo delivery: title/body/CTA label plus internal album selection or validated external URL and source label.
- Thank-you: title/body/signature/date and optional finale media.
- Optional sections: independent enable/disable state and only the section-specific fields listed in the matrix; all guest wishes must already be approved and owner-selected.
- Layout choice: expose only layouts authored and tested for this template; do not expose fixed labels or placeholder copy as editable fields.

## Non-goals and anti-patterns

- No RSVP, countdown, dress code, gift registry, contact form, or mandatory venue details.
- No autoplay video or audio, unmoderated wishes, guest IDs, contact details, or private media.
- Do not make guests read the full story before reaching photo delivery.
- Do not treat `chapters` and `moments` as interchangeable lists.
- Do not put each section on a different color panel or leave gaps when optional sections are disabled.
- Do not rely on fixed sample couple photography for identity; do not hotlink or ship unlicensed imagery in the final theme.
- Avoid long wish cards, long-form story copy, oversized optional-section stacks, scroll hijacking, and decorative motion that competes with the album action.

## Acceptance checklist

- [x] Product meaning, viewer job, audience, journey, and non-goals are defined.
- [x] Art direction, mobile-first pacing, typography, material, motion, and signature film-roll motif are defined.
- [x] The recap is distinct from invitation and wedding website flows.
- [x] All six required and six optional semantic sections have a role and matrix row.
- [x] Every matrix row includes content anchor/keys, default data, editor control, empty behavior, CTA/action, and toggle/reorder/repeat rule.
- [x] Photo delivery is the primary action and can use internal or external albums.
- [x] Copy is Vietnamese-first and short; any English tagline/quote usage stays within the common limit of three lines.
- [x] Fixture, editor field plan, empty states, non-goals, and anti-patterns are recorded.
- [x] Phase 0 preview shell and direct route exist; phase 1 does not add template renderer/config/API/final artwork.

Phase 1 is complete. Continue with Phase 2 media contract and media-independence before authoring the template renderer or assets.
