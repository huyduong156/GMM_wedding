# Peony Veranda — Phase 2.5 Asset Manifest

Status: Phase 5 integrated and reviewed. Renderer-owned artwork is locked for this template.

## Asset list

| File | Role | Target sections | Layer | Dimensions | Alpha | Size |
|---|---|---|---|---:|---:|---:|
| peony-bud-v1.png | Standalone Element | date/footer accents | foreground | 1230×1278 | yes | 1160 KB |
| peony-corner-spray-v1.png | Corner Decoration | opening/banner/family edges | foreground | 1214×1295 | yes | 1735 KB |
| peony-divider-v1.png | Divider | announcement/family/date transitions | midground | 2172×724 | yes | 528 KB |
| peony-foliage-branch-v1.png | Organic Decorative Element | venue/footer/section edges | foreground | 1024×1536 | yes | 1944 KB |
| peony-hero-cluster-v1.png | Hero Decoration | opening/banner | foreground | 1024×1536 | yes | 2514 KB |
| peony-leaf-sprig-v1.png | Organic Decorative Element | date/family/venue accents | foreground | 1241×1267 | yes | 935 KB |
| peony-mini-petal-v1.png | Small standalone petal | couple/gallery ambient accents | foreground | generated mini asset | yes | 1.3 MB |
| peony-mini-leaf-v1.png | Small standalone leaf | couple/gallery ambient accents | foreground | generated mini asset | yes | 1.2 MB |
| peony-mini-bud-v1.png | Small standalone bud | couple/gallery ambient accents | foreground | generated mini asset | yes | 744 KB |
| peony-mini-blossom-v1.png | Small standalone blossom | couple/gallery ambient accents | foreground | generated mini asset | yes | 466 KB |
| peony-mini-leaf-petal-v1.png | Small standalone leaf-petal | couple/gallery ambient accents | foreground | generated mini asset | yes | 364 KB |
| peony-petal-leaf-sprite-v1.png | Ambient Sprite | opening/background | background | 1254×1254 | yes | 1570 KB |
| peony-single-bloom-v1.png | Standalone Element | invitation/date/family accents | foreground | 1285×1224 | yes | 2198 KB |
| peony-voile-overlay-v1.png | Overlay Decoration | opening/section transition | background/midground | 1536×1024 | yes | 1883 KB |

## Placement and fallback notes

- Pink peonies are the emotional focal point; sage foliage supplies structure and green breathing room.
- Standalone flowers, buds and leaf sprigs are for static accents; the sprite is used for bounded ambient motion.
- No asset may cover names, guestName, family roles, venue address, RSVP controls or CTA.
- Free-floating assets must keep transparent safe padding and must not depend on viewport edges.
- The voile overlay must remain subtle and never reduce text contrast.

## Provenance

- Tool: built-in image generation capability.
- Generation date: 2026-09-03.
- Source type: newly generated renderer-owned artwork; no external reference image, no external asset and no user/couple media.
- License/source note: generated in-project artwork; retain PROMPTS.md with the bundle.
- Review status: awaiting user approval.

## Approval gate

- [x] User approves overall art direction and palette.
- [x] User approves each asset role and visual quality.
- [ ] User requests revisions, if any, before Phase 3.
- [x] Approved filenames are locked before renderer implementation.
