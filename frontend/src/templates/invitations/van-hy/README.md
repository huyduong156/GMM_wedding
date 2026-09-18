# Vạn Hỷ

Gen Z Vietnamese wedding invitation with a dark burgundy-red Hỷ Sự direction, playful floating Hỷ fragments and a red opening card framed by two red flower clusters.

## Preview

`/templates/invitations/van-hy/preview`

## Template identity

| Field | Value |
| --- | --- |
| Template key | `van-hy` |
| Product type | `ONLINE_INVITATION` |
| Display name | `Vạn Hỷ` |
| Canvas | Mobile-first, single column, capped at `480px` |
| Primary palette | Deep burgundy red / oxblood / wine |
| Display font | Phudu GMM |
| Body font | Be Vietnam Pro GMM |
| Accent font | Tapestry GMM, short decorative use only |
| Section contract | 13 sections, matching Astral Vows |
| Current phase | Phase 4 — core motion and interaction system implemented; visual review pending |

## Visual direction

Vạn Hỷ treats the invitation as a lively digital red wedding card: celebratory, youthful and energetic, with a modern Gen Z tone rather than a formal heritage or classical wedding style.

The opening signature is a full-screen red opening scene with a centered Hỷ card. It contains:

- A deep burgundy-red card surface.
- Two renderer-owned red flower clusters placed on the left and right edges.
- Floating `囍` / `Hỷ` fragments as bounded decorative atmosphere.
- A click, Enter or Space interaction to open the card.
- A static reduced-motion fallback.

## Phase 0 scope

The current preview contains only the spatial shell and opening-card prototype. It intentionally does not include the final 13 invitation sections, user media, backend content, final artwork or `template-config.ts`.

Phase 0 must be reviewed at 375px, 390px, 480px, 768px and 1440px before Phase 1 begins. The invitation must not create horizontal overflow; at widths above 480px, the extra gutter is non-essential atmosphere only.

## Section contract

The final template will use the same 13-section structure as Astral Vows:

`opening → cover → invitation → families → countdown → venue → timeline → gallery → rsvp → guestbook → gift → music → footer`

Required sections: `opening`, `cover`, `invitation`, `families`, `footer`.

Optional sections: `countdown`, `venue`, `timeline`, `gallery`, `rsvp`, `guestbook`, `gift`, `music`.

## Config and editor constraints

- `template-config.ts` must follow the established invitation config shape used by working templates.
- Canonical machine-readable section/content keys must remain compatible with the editor and backend.
- All section labels, field labels, empty messages and editor-facing text must be complete Vietnamese.
- Renderer-owned Hỷ fragments, flowers, card surfaces and motion are not editable media fields.

## Authoring record

See [AUTHORING.md](./AUTHORING.md) for the phased authoring log and acceptance gates.

Phase 2.5 artwork review: [ARTWORK_PREVIEW.md](./ARTWORK_PREVIEW.md) · [ASSET_MANIFEST.md](./ASSET_MANIFEST.md)
