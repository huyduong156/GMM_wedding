# Rose Garden artwork manifest

Status: approved by the product owner on 2026-09-12 for renderer-owned use in Rose Garden.

Bundle root: `/assets/images/templates/rose-garden/artwork-drafts/`

Preview sheet: [ARTWORK_PREVIEW.md](./ARTWORK_PREVIEW.md)

## Locked art direction and source record

The batch was generated specifically for GMM Wedding with OpenAI image generation during
Phase 2.5. It does not incorporate a third-party stock library or external copyrighted asset.
No separate third-party license is attached; use remains subject to the project's applicable
OpenAI output terms. The raw tool invocation transcript was not retained, so the prompt records
below are normalized from the approved brief and outputs rather than represented as verbatim
generation prompts. No guest data, couple likeness, names or embedded copy were requested.

Shared direction: dusty-rose botanical couture, pressed and handmade paper, muted blush,
ivory, burgundy and sage, soft diffused studio light, tactile watercolor/gouache detail,
transparent isolated PNG, no people, no text, no logos and no photographic background.

Shared responsive rule: decor may scale down proportionally but must never stretch, cover
semantic content or become user media. At mobile widths the complete silhouette remains
visible unless the row explicitly permits ornamental edge crop. Desktop is still constrained
to the invitation's 480px canvas; there is no larger desktop variant.

## Asset brief and matrix

| Asset key | Role / owner / status | Metaphor, palette and material | File target / alpha / safe area | Mobile and desktop behavior | Prompt record / provenance | Approval criteria |
| --- | --- | --- | --- | --- | --- | --- |
| `rg-opening-closed-card.png` | Closed invitation gate; `opening`; active | A sealed couture invitation as the threshold into the rose garden; ivory handmade paper, dusty rose and burgundy botanical trim | 1024×1536 PNG, RGBA, 2:3; preserve the full canvas and card perimeter | Proportional layer in the 328px opening stage; identical composition at all widths | `P-OPEN-1`: closed vertical handmade invitation card, botanical rose border, isolated transparent layered UI artwork. Project-generated with OpenAI image generation, 2026-09-12 | Clean card silhouette; no copy/person; aligns with all opening layers; legible at 280–328px |
| `rg-opening-inner-card.png` | Inner paper layer; `opening`; active | The private inner letter revealed after opening; warm ivory pressed paper with restrained rose detail | 1024×1536 PNG, RGBA, 2:3; preserve full canvas; center kept quiet for HTML copy | Scales with the opening stage; central copy-safe region remains unobstructed | `P-OPEN-2`: matching inner invitation paper, quiet central writing field, pressed rose detail, transparent layered UI artwork. Same generation provenance | Matches closed-card geometry; central safe area is quiet; no embedded copy |
| `rg-opening-triangle-flap.png` | Envelope flap; `opening`; active | Folded paper flap completing the reveal gesture; ivory/blush paper with subtle tactile shading | 1024×1536 PNG, RGBA, 2:3; full-canvas registration layer; do not crop independently | Uses the same proportional transform origin on mobile and desktop | `P-OPEN-3`: matching triangular envelope flap, tactile folded ivory paper, transparent registration layer. Same generation provenance | Registers with opening card; edge is clean; rotation/reveal does not expose a background box |
| `rg-opening-front-frame.png` | Botanical foreground frame; `opening`; active | Garden branches framing the invitation threshold; dusty rose, burgundy and sage watercolor foliage | 1024×1536 PNG, RGBA, 2:3; ornamental edges may clip only with the complete opening stack | Scales as the top registration layer; must not intercept tap or obscure title/button | `P-OPEN-4`: transparent botanical foreground frame matching vertical invitation, rose and sage watercolor foliage. Same generation provenance | Clear interaction center; transparent corners; visually coherent with other opening layers |
| `rg-garden-envelope-vignette-v1.png` | Botanical envelope prop; `cover`; active | A keepsake envelope resting in the garden; blush paper, burgundy roses and sage leaves | 1312×1199 PNG, RGBA, near 1.09:1; keep main envelope inside central 84%, edge foliage may crop | Decorative crop on cover; reduce size/offset on narrow mobile, never cover couple names | `P-PROP-1`: isolated couture garden envelope vignette, blush handmade paper and pressed rose foliage, transparent background. Same generation provenance | Reads as envelope at small size; no text/person; clean alpha; names remain clear |
| `rg-botanical-cluster-v1.png` | Corner cluster; `invitation`; active | A collected rose-garden specimen anchoring the letter; burgundy/dusty rose petals and sage leaves | 1230×1278 PNG, RGBA, near square; main bloom inside central 84%, outer leaves may softly crop | Corner accent scaled down on mobile; desktop remains within 480px canvas | `P-BOT-1`: isolated asymmetrical botanical corner cluster, dusty rose and burgundy watercolor flowers, sage foliage. Same generation provenance | Recognizable silhouette; no hard rectangular edge; does not compete with invitation copy |
| `rg-pressed-flower-divider.png` | Section divider; `eventDetails`; active | Pressed garden specimens marking a ceremonial pause; muted rose/sage on transparent paperless ground | 2172×724 PNG, RGBA, 3:1; preserve central stem rhythm, ends may fade/crop | Width follows content column; height scales automatically; never forces horizontal scroll | `P-DIV-1`: wide horizontal pressed-flower divider, sparse dusty rose petals and sage stems, transparent background. Same generation provenance | Reads at narrow width; clean alpha; no text; section transition remains light |
| `rg-gift-botanical-charm.png` | Small floral charm; `gallery`, `gift`; active | A tied botanical keepsake; blush/burgundy flower charm with handmade-paper softness | 1225×1284 PNG, RGBA, near square; full charm inside central 84% | Small contained prop; scale down on mobile and never overlap gallery/QR content | `P-PROP-2`: isolated petite botanical gift charm, dusty rose bloom, sage leaves, tactile paper detail. Same generation provenance | Full silhouette; QR and interactive content remain unobstructed; no identity/copy |
| `rg-botanical-cluster.png` | Alternate cluster; reserved; not rendered | Fuller alternate garden specimen in the shared rose/sage watercolor material | 1312×1199 PNG, RGBA, near 1.09:1; main mass inside central 84% | Reserved; if activated, use only as a scaled corner accent within 480px | `P-BOT-2`: isolated full botanical rose cluster, dusty rose, burgundy and sage, transparent background. Same generation provenance | Distinct from `v1`; clean alpha; activation requires composition review, not regeneration |
| `rg-botanical-sprig.png` | Botanical sprig; reserved; not rendered | A light single branch for low-density seams; sage stem with dusty-rose accents | 1145×1374 PNG, RGBA, portrait; full stem inside central 84% | Reserved; if activated, keep full silhouette and reduce density on mobile | `P-BOT-3`: isolated delicate vertical botanical sprig, sage and dusty rose watercolor, transparent background. Same generation provenance | Thin details survive small scale; no hard edge; must not become repeated wallpaper |
| `rg-botanical-wreath.png` | Botanical wreath; reserved; not rendered | A garden wreath suggesting union; burgundy roses, pale blush petals and sage foliage | 1024×1536 PNG, RGBA, 2:3; quiet central safe area for optional HTML content | Reserved; scale proportionally, with larger quiet center on mobile | `P-BOT-4`: airy botanical wedding wreath, quiet central opening, dusty rose and sage, transparent background. Same generation provenance | Center stays usable; no embedded monogram/text; full silhouette remains readable |
| `rg-center-floral-cluster.png` | Center cluster; reserved; not rendered | A horizontal floral arrangement for a ceremonial focal point; layered rose and sage watercolor | 1536×1024 PNG, RGBA, 3:2; main blooms inside central 84% | Reserved; scale to content width and avoid covering headings on mobile | `P-BOT-5`: centered horizontal floral cluster, layered dusty rose blooms and sage leaves, transparent background. Same generation provenance | Balanced center weight; transparent edge; no text/person |
| `rg-center-rose-petal-cluster.png` | Petal cluster; `cover` atmosphere; integrated in Phase 5 | Loose rose petals implying the garden's ambient trail; dusty rose/burgundy watercolor | 1254×1254 PNG, RGBA, 1:1; full cluster inside central 84% | Phase 5 may use fewer/smaller instances on mobile; reduced-motion keeps it static or hidden | `P-ATM-1`: isolated loose rose-petal cluster, dusty rose and burgundy watercolor, transparent background. Same generation provenance | Individual petals read cleanly; no rectangular haze; use remains decorative and restrained |
| `rg-timeline-bloom.png` | Timeline bloom marker; `timeline`; integrated Phase 4 | A bloom marking each shared moment; blush and burgundy flower with sage detail | 1536×1024 PNG, RGBA, 3:2; bloom inside central 84% | Phase 4 marker scales down beside timeline copy; never reduces tap/readable area | `P-TIME-1`: isolated small timeline bloom marker, couture dusty rose flower and sage leaf, transparent background. Same generation provenance | Recognizable at marker scale; no text; animation must preserve reduced-motion fallback |

All files above were inspected as valid RGBA PNGs at the recorded dimensions. Current files are
large authoring masters; file-size optimization and promotion out of `artwork-drafts` remain the
Phase 5 release task.

## Approval checklist

- [x] Product owner approved the complete preview batch on 2026-09-12.
- [x] Art direction matches Rose Garden: dusty-rose botanical couture and handmade paper.
- [x] Every asset is renderer-owned decor, contains no guest PII and does not replace user media.
- [x] Every file has a stable key, section/usage assignment, prompt and provenance record.
- [x] Pixel dimensions, alpha requirement, safe area and responsive behavior are recorded.
- [x] Opening layers share the same 2:3 registration canvas and keep the interaction center clear.
- [x] No asset contains people, names, logos or embedded invitation copy.
- [x] Rejected/unapproved assets are not present in the locked batch.
- [x] Large visual changes or regenerated variants return to Phase 2.5 for approval.
- [ ] Phase 5 release follow-up: optimize file sizes, promote final bundle paths and recheck the release manifest.
