# Deep Ocean - Phase 2.5 Asset Manifest v2

Status: `in-review`

This replaces the first candidate set. The full caustic veil, sprite sheet, simple pearl-thread candidate, sea-glass bow, large ripple, spark star and waterline divider were removed because they looked artificial or were difficult to place responsively. These are renderer-owned decor only, never couple, gallery, story, venue, film or people media.

| ID | File | Role | Section usage | Format / alpha | Responsive rule | Status |
| --- | --- | --- | --- | --- | --- | --- |
| DO-01 | `do-pearl-bloom-v2.png` | Key shell-pearl identity | `hero`, `story`, `capsule` | 1536x1024 PNG RGBA, 2.15 MB | Desktop 160-300px; mobile 120-210px; never cover copy | Pending review |
| DO-02 | `do-water-ripple-detail-v1.png` | Small water ripple accent | `story` -> `timeline`, `gallery` -> `memories` | 1536x1024 PNG RGBA, 1.38 MB | One-off seam detail; never full-page background | Pending review |
| DO-03 | `do-seaglass-corner-v1.png` | Corner ornament | `hero`, `weddingDay`, `footer` | 1312x1199 PNG RGBA, 1.46 MB | Reduce opacity and scale on mobile | Pending review |
| DO-04 | `do-pearl-stationery-v1.png` | Standalone prop | `story`, `memories`, `wishes` | 1536x1024 PNG RGBA, 2.03 MB | Float beside copy; collapse below copy on mobile | Pending review |
| DO-05 | `do-shell-pair-v1.png` | Supporting shell-pearl prop | `weddingDay`, `people`, `capsule` | 1536x1024 PNG RGBA, 1.85 MB | Small accent; never repeated as wallpaper | Pending review |
| DO-06 | `do-water-bubble-a-v1.png` | Single water bubble | `hero`, `capsule` | 1024x1024 PNG RGBA, 0.75 MB | Render small; independent placement | Pending review |
| DO-07 | `do-water-bubble-b-v1.png` | Second single water bubble | `hero`, `capsule` | 1024x1024 PNG RGBA, 0.43 MB | Render at a different scale; independent placement | Pending review |
| DO-08 | `do-oyster-pearl-v1.png` | Compact shell-pearl prop | `story`, `wishes`, `people` | 1536x1024 PNG RGBA, 1.92 MB | Desktop 150-260px; mobile 100-170px | Pending review |
| DO-09 | `do-coral-pearl-sprig-v1.png` | Organic diagonal ornament | `timeline`, `weddingDay`, `footer` | 1536x1024 PNG RGBA, 1.83 MB | Rotate only on desktop; static on mobile | Pending review |
| DO-10 | `do-soap-bubble-v2.png` | Single see-through soap-film bubble | `hero`, `memories` | 1024x1024 PNG RGBA | Render small; thin iridescent membrane with transparent center; no cluster or full overlay | Pending review |
| DO-11 | `do-soft-red-starfish-v1.png` | Pale coral-red organic prop | `weddingDay`, `memories`, `footer` | 1536x1024 PNG RGBA, 1.34 MB | Small accent; static orientation on mobile | Pending review |

All assets were generated for GMM Wedding with the built-in OpenAI image generation tool on 2026-10-12. The shell-pair direction was used as a material/lighting reference only. Prompts are recorded in `PHASE-2.5-PROMPTS-V2.md`.
