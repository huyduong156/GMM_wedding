# Forever asset and effects manifest

All generated decor listed here is renderer owned, not user editable media. The source and approval record lives in [`PHASE-2.5.md`](../../../../../docs/frontend/wedding-websites/linh-huy-phase-2-5/PHASE-2.5.md); files are original assets approved on 2026-11-02. The runtime folder is `frontend/public/assets/images/templates/forever/decor/`.

| Section key | Asset / effect | Purpose and placement | Responsive and motion behavior |
|---|---|---|---|
| `announcement` | `detail-black-silk-ribbon-pen.webp` | Small lower-right stationery accent, outside the message block | Reduced opacity and edge offset on mobile; slow float while section is visible |
| `couple` | `detail-brushed-silver-bands.webp` | Small lower-right relationship keepsake, away from the portrait and copy | Reduced opacity and edge offset on mobile; slow float while section is visible |
| `story` | `detail-vows-booklet.webp` | Large, low-contrast vow-booklet watermark behind the sticky story heading | Cropped beyond the left edge, kept behind section content, and reduced further on mobile; slow float while section is visible |
| `countdown` | `background-two-curved-black-lines-v1.webp` | Low-opacity curved-line plate behind the live wedding countdown | Lower opacity on mobile; slow background drift while section is visible |
| `gallery` | CSS layout | Four-column continuous photo marquee that travels right to left; clicking a photo opens the album viewer | Responsive photo widths; pauses on hover/focus and remains static for reduced-motion preferences |
| `rsvp` | `background-two-black-curves.svg`, `background-two-black-curves-mobile.svg` | Responsive ink-line atmosphere behind RSVP | Mobile SVG below 760px; low opacity; slow drift while section is visible |
| Every visible section | CSS paper-dust field | Sparse renderer-owned background motion, clipped to the section and behind its content | Starts only when its section enters view, pauses offscreen and when the tab is hidden; removed under reduced motion |

The runtime bundle uses only the approved WebP/SVG candidates. No user-uploaded photo is used as a theme asset. All decor is `aria-hidden`, pointer inert, and layered away from text, addresses, photo subjects, and controls. `prefers-reduced-motion` disables all ambient drift, floating props, gallery depth, and reveal motion while preserving the static artwork and content.

The Forever gallery editor requires 4–10 images. Its demo fixture uses seven distinct photos from the Couple 1 image set. The desktop marquee shows four columns; a repeating 0/92/23/56px offset pattern pairs with image-height scales of 1/0.9/1.1/0.8.
