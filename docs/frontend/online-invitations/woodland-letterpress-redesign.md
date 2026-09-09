# Woodland Letterpress preview redesign

Preview: `/templates/invitations/woodland-letterpress/preview`.

The invitation retains its single mobile composition, capped at 450px and centered on larger screens. The redesign uses walnut-brown wood as its dominant color, birch paper, restrained moss botanical accents, engraved framing and the existing Lora / Be Vietnam Pro / Dancing Script pairing. The opening folio now exposes the couple and date; the seal opens the invitation and transfers keyboard focus to the main heading.

The couple names and date now sit in their own bordered letterpress box; a second box below contains the two family announcements, followed by a lighter personalized invitation note. The venue is a dark walnut arched signboard with a contained signpost emblem, readable address rule and high-contrast map action. The ceremony plaque, real month calendar, timeline, activity notes, perspective photo album, reply card, ruled guestbook, gift note and botanical closing share the same material system. The calendar offers a Google Calendar link with the Vietnam timezone. The preview toolbar occupies normal document flow and is absent in editor mode.

Theme-owned ornaments remain separate from editable photographs. Existing bundled sample wedding photos illustrate the gallery; source records and the phased acceptance map live in the template directory. No asset generation or backend change is included.

## Validation

- Browser review of all sections, opening and opened state.
- Widths 375, 390, 430, 768 and 1440px: no horizontal page overflow; canvas never exceeds 450px.
- Reduced motion at 375px: zero running animations; full content remains available.
- Live editor update: long Vietnamese names, missing photos/family members, optional sections disabled and venue/calendar reordered render correctly.
- Preview-only RSVP/wish feedback and previous/next gallery controls verified without external submission.
- Opening seal hitbox measured before and after pointer hover: `0px` movement on both axes; only the seal artwork animates.
- TypeScript and production build pass. Build reports large application chunks and existing high-resolution PNG artwork; asset delivery optimization remains a release consideration.
- Repository-wide lint is blocked by pre-existing issues outside this redesign; scoped Woodland validation is recorded in the template redesign brief.

This task changes the preview implementation. It does not publish or release the template.
