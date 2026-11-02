# Forever asset and effects manifest

All generated decor listed here is renderer owned, not user editable media. The source and approval record lives in [`PHASE-2.5.md`](../../../../../docs/frontend/wedding-websites/linh-huy-phase-2-5/PHASE-2.5.md); files are original assets approved on 2026-11-02. The runtime folder is `frontend/public/assets/images/templates/forever/decor/`.

| Section key | Asset / effect | Purpose and placement | Responsive and motion behavior |
|---|---|---|---|
| `announcement` | `detail-black-silk-ribbon-pen.webp` | Small lower-right stationery accent, outside the message block | Reduced opacity and edge offset on mobile; slow float while section is visible |
| `couple` | `detail-brushed-silver-bands.webp` | Small lower-right relationship keepsake, away from the portrait and copy | Reduced opacity and edge offset on mobile; slow float while section is visible |
| `story` | `detail-vows-booklet.webp` | Small lower-left editorial prop beside the story timeline | Reduced opacity and edge offset on mobile; slow float while section is visible |
| `events` | `joined-path-accent.svg` | Single ink divider at the lower edge of event details | Scales with viewport; slow float while section is visible |
| `countdown` | `background-two-curved-black-lines-v1.webp` | Low-opacity contained background plate behind the date chapter | Lower opacity on mobile; slow background drift while section is visible |
| `gallery` | `photo-frame-open-corners.svg` | Edge-dependent frame on the first gallery image; CSS perspective gives the gallery a restrained 3D plane | Smaller frame inset and static 2D composition on touch/mobile; hover depth only on fine pointers |
| `rsvp` | `background-two-black-curves.svg`, `background-two-black-curves-mobile.svg` | Responsive ink-line atmosphere behind RSVP | Mobile SVG below 760px; low opacity; slow drift while section is visible |
| Every visible section | CSS paper-dust field | Sparse renderer-owned background motion, clipped to the section and behind its content | Starts only when its section enters view, pauses offscreen and when the tab is hidden; removed under reduced motion |

The runtime bundle uses only the approved WebP/SVG candidates. No user-uploaded photo is used as a theme asset. All decor is `aria-hidden`, pointer inert, and layered away from text, addresses, photo subjects, and controls. `prefers-reduced-motion` disables all ambient drift, floating props, gallery depth, and reveal motion while preserving the static artwork and content.
