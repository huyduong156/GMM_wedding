# Sunlit Silk - Phase 2.5 asset pre-production

Status: **Approved; ready for Phase 3 section architecture**
Product: `ONLINE_INVITATION`
Opening: `Thao dai lua bang khoa dong`

The artwork system treats the invitation as raw silk and cotton paper. The only metallic note is antique brass. Assets are renderer-owned, contain no couple/model/text dependency, and have CSS fallbacks.

| Asset | Role | Visual metaphor | Palette/material | Format & source size | Safe zone / breakpoint | Section ownership |
| --- | --- | --- | --- | --- | --- | --- |
| `ss-ribbon-clasp-v2-optimized.png` | key opening artwork | Raw-silk band with antique clasp | Ivory linen, mineral beige and patinated brass | PNG alpha, `1280x547` | Wide opening overlay; clasp centered | opening only |
| `ss-modern-floral-cluster-v1-optimized.png` | corner decoration | Sculptural ivory anthurium, orchid and calla cluster | Ivory, stone beige, restrained green and brass | PNG alpha, `768x1152` | Tall edge; max 45% stage width | opening and section bridges |
| `ss-modern-floral-sculpture-v1-optimized.png` | floral accent | Two calla lilies with one phalaenopsis bloom; clean stems, no artificial branch network | Ivory, mineral beige and restrained green | PNG alpha, `853x1280` | Tall edge; max 32% stage width | event/footer bridges |
| `ss-modern-orchid-petals-v1-optimized.png` | ambient cluster | Sparse ivory orchid/calla petals | Ivory, stone beige and quiet green | PNG alpha, `1280x547` | Max 18% opacity; away from copy | opening atmosphere |
| `ss-linen-envelope-v1-optimized.png` | opening prop | Open cotton-linen envelope with ribbon and brass clasp | Warm ivory, linen beige and antique brass | PNG alpha, `1280x1170` | Lower corner; max 48% stage width | opening and RSVP |
| `ss-cotton-paper-stack-v1-optimized.png` | stationery layer | Deckled cotton cards with blank embossed seal and ribbon | Cotton ivory, sand beige and champagne | PNG alpha, `1280x1170` | Side offset; max 44% stage width | details and gallery |
| `ss-linen-fold-v1-optimized.png` | ambient material | Folded translucent linen/voile corner | Ivory voile, warm beige and sunlight | PNG alpha, `1280x853` | Edge bleed; max 22% opacity | transitions and footer |
| `ss-linen-ribbon-tail-v2-optimized.png` | free-floating ribbon accent | One loose frayed raw-linen ribbon tail, not a bow | Ivory linen and champagne beige | PNG alpha, `1280x547` | Full object with padding; max 42% stage width | opening transition and RSVP |

Open `opening-preview.html` and `preview-sheet.svg` to review the composition. These are review artifacts only; the renderer does not import them yet.

The opening uses the ribbon/clasp artwork; modern flowers are sculptural and editorial, without rustic dried-bouquet language. Linen, cotton paper and brass details provide non-floral decor roles. Ambient assets must be paused or omitted under reduced motion.

The earlier SVG placeholder set, rustic floral PNG set and rejected 3D-like decor batch were removed. Revision 5 candidates were generated with the built-in image generation tool using `ss-ribbon-clasp-v2-optimized.png` as the style reference; they contain no people, readable text, logo or watermark. See `ASSET-MANIFEST.md`.

## Approval checklist

- [x] Every asset has a distinct role and section owner.
- [x] Palette, material, lighting and visual metaphor match Sunlit Silk.
- [x] Responsive safe zones and reduced-motion behavior are specified.
- [x] Assets are transparent and locally bundled.
- [x] Preview sheet and manifest/provenance are present.
- [x] CSS fallback exists for identity-critical roles.
- [x] Product owner approves this set for Phase 3 composition.

Phase 3 must not import these files until the final approval checkbox is accepted.
