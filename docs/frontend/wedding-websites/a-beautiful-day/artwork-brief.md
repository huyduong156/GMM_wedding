# A Beautiful Day — Phase 2.5 Artwork Pre-production

Status: The user approved the full current artwork set. Four curtain options, one single blossom, three separate lantern shapes, and six floral/bamboo clusters are served as lossless WebP in `frontend/public/assets/images/templates/a-beautiful-day/decor/`; PNG sources are retained in `assets/templates/a-beautiful-day/originals/`. Visible RGB and alpha match the resized source exactly, transparent edges were inspected over ivory and dark backgrounds, and all outputs meet their budgets. Historical MinIO reference screenshots were removed after design analysis and are documented in `phase-1-theme-brief.md`.

## Art direction locked for this batch

Warm reception atmosphere with contemporary East Asian material cues: ivory gathered fabric, restrained bamboo rhythm, asymmetric masses of peach/blush/milk-white flowers, trailing muted foliage, and soft amber lantern light. Keep the center and text-safe areas quiet. The result should feel like considered editorial set design, not a copied wedding stage or a generic floral template.

No people, faces, names, dates, Chinese characters, text, venue furniture, social UI, logos, watermarks, or screenshots. Do not copy the specific arrangement, camera view, or identifiable details from the reference photos. User wedding photographs remain separate content media.

## Asset matrix

Generated assets remain separate from renderer imports until used by a section. User-approved production artwork lives in `frontend/public/assets/images/templates/a-beautiful-day/decor/`; two unused generated drafts are retained under `assets/templates/a-beautiful-day/archive/`. The template source folder contains runtime code, tests and its README only.

| Candidate filename | Role / target | Composition and responsive use | Budget / approval test |
|---|---|---|---|
| `frontend/public/assets/images/templates/a-beautiful-day/decor/abd-curtain-frame-v01.webp` | Hero frame/key artwork, mood reference | Transparent open drapery frame with a generous clear center. Use as visual baseline while comparing more photoreal variants. | Optimized lossless WebP 1536 × 1024, 684 KB; approved and alpha-edge reviewed. |
| `frontend/public/assets/images/templates/a-beautiful-day/decor/abd-curtain-frame-v02.webp` | Hero frame variation A | More natural gathered ivory organza with an asymmetric soft canopy and separate side falls; full silhouette, center clear. | Optimized lossless WebP; measured lossless WebP under the 1.5 MB budget; see the asset manifest. Photographic fabric weave/folds, natural gravity, no CGI sheen. |
| `frontend/public/assets/images/templates/a-beautiful-day/decor/abd-curtain-frame-v03.webp` | Hero frame variation B | A distinct draping pattern with a higher, lighter canopy and relaxed side tiebacks; maintain wide text-safe center. | Optimized lossless WebP; measured lossless WebP under the 1.5 MB budget; see the asset manifest. Photographic fabric weave/folds, natural gravity, no CGI sheen. |
| `frontend/public/assets/images/templates/a-beautiful-day/decor/abd-curtain-frame-v04.webp` | Hero frame variation C | A distinct, layered curtain arrangement with a shallow curved opening and longer loose folds; no copied reference layout. | Optimized lossless WebP; measured lossless WebP under the 1.5 MB budget; see the asset manifest. Photographic fabric weave/folds, natural gravity, no CGI sheen. |
| `frontend/public/assets/images/templates/a-beautiful-day/decor/abd-single-blossom-v02.webp` | Single floral ornament | One isolated peach/blush/cream bloom with a few leaves; freely positionable, not a garland or divider. | Optimized lossless WebP; measured lossless WebP under the 500 KB budget; see the asset manifest. One flower reads clearly at small scale. |
| `frontend/public/assets/images/templates/a-beautiful-day/decor/abd-lantern-round-v02.webp` | Round lantern prop | One realistic spherical ivory paper lantern, softly ribbed, subtle warm inner light. | Optimized lossless WebP; measured lossless WebP under the 500 KB budget; see the asset manifest. Full object and hanger visible. |
| `frontend/public/assets/images/templates/a-beautiful-day/decor/abd-lantern-oval-v02.webp` | Oval lantern prop | One realistic oval/teardrop ivory paper lantern, distinct from the round sample. | Optimized lossless WebP; measured lossless WebP under the 500 KB budget; see the asset manifest. Full object and hanger visible. |
| `frontend/public/assets/images/templates/a-beautiful-day/decor/abd-lantern-column-v02.webp` | Tall lantern prop | One realistic elongated cylindrical ivory paper lantern with a different profile and restrained glow. | Optimized lossless WebP; measured lossless WebP under the 500 KB budget; see the asset manifest. Full object and hanger visible. |
| `frontend/public/assets/images/templates/a-beautiful-day/decor/abd-floral-bamboo-cluster-v02.webp` | Low horizontal floral/bamboo spray | Broad low arrangement for a section edge or horizontal transition. | Optimized lossless WebP; lossless alpha verified and reviewed on ivory/dark backgrounds. Target ≤1.5 MB optimized. |
| `frontend/public/assets/images/templates/a-beautiful-day/decor/abd-floral-bamboo-cluster-v03.webp` | Diagonal floral/bamboo cascade | Compact diagonal silhouette for corner placement. | Optimized lossless WebP; lossless alpha verified and reviewed on ivory/dark backgrounds. Target ≤1.5 MB optimized. |
| `frontend/public/assets/images/templates/a-beautiful-day/decor/abd-floral-bamboo-cluster-v04.webp` | Crescent floral/bamboo arrangement | Airy crescent with open center for framing a chapter edge. | Optimized lossless WebP; lossless alpha verified and reviewed on ivory/dark backgrounds. Target ≤1.5 MB optimized. |
| `frontend/public/assets/images/templates/a-beautiful-day/decor/abd-floral-bamboo-cluster-v05.webp` | Modern horizontal floristry revision | Calla lilies, orchids and pale apricot roses with only a few slim bamboo canes. | Optimized lossless WebP; lossless alpha verified and reviewed on ivory/dark backgrounds. Target ≤1.5 MB optimized. |
| `frontend/public/assets/images/templates/a-beautiful-day/decor/abd-floral-bamboo-cluster-v06.webp` | Modern diagonal cascade revision | Sculptural anthuriums, ranunculus and orchids; sparse bamboo behind the flowers. | Optimized lossless WebP; lossless alpha verified and reviewed on ivory/dark backgrounds. Target ≤1.5 MB optimized. |
| `frontend/public/assets/images/templates/a-beautiful-day/decor/abd-floral-bamboo-cluster-v07.webp` | Modern crescent revision | Calla lilies and orchids with an open center and restrained bamboo accents. | Optimized lossless WebP; lossless alpha verified and reviewed on ivory/dark backgrounds. Target ≤1.5 MB optimized. |

`abd-floral-cluster-v02.png` and `abd-lantern-pair-v01.png` are rejected and were removed. `abd-blossom-divider-v01.png` remains an archived draft only. `abd-floral-bamboo-cluster-v01.png` is an archived style reference; approved cluster variants v02–v07 are renderer assets in the optimized public bundle.

The generated artwork supplies material and motif cues while the renderer owns palette, placement, typography, and section transitions. Do not stretch one asset across unrelated sections. Do not use the assets as substitutes for wedding photos.

## Prompt set and provenance

Generation mode: built-in image generation. Prompts use the three MinIO images only as mood/material references (warm ivory reception fabric, asymmetric pastel flowers, bamboo linework, trailing foliage, and soft paper lantern light). They are not edit targets. Generated candidates must contain no copied personal details or social-media marks.

### 1. Curtain frame

Use case: stylized-concept. Asset type: transparent renderer-owned hero frame for the A Beautiful Day wedding website. Create a photorealistic editorial set-design artwork of softly gathered ivory reception drapery forming an open, elegant frame with two vertical side falls and a restrained shallow canopy. Inspired by the reference photos' warm fabric and intimate stage atmosphere, but do not recreate their stage or camera composition. Keep a very large clean transparent opening in the center for real HTML names, date, and controls. Isolated on a genuinely transparent background, entire frame visible, safe padding, high-quality woven fabric folds, warm diffused light, subtle cream and paper tones. No flowers in this asset. No people, text, names, date, symbol, furniture, bamboo, logo, watermark, or backdrop. Avoid heavy theatrical velvet, glitter, plastic sheen, clipped edges, and baked typography.

### 2. Floral and bamboo cluster

Use case: stylized-concept. Asset type: transparent free-positioned wedding website ornament. Create one self-contained asymmetrical arrangement of airy peach, blush, muted rose, and milk-white wedding flowers among fine warm bamboo stems and curved muted-green trailing foliage. Use the reference photos only for palette, organic layering, bamboo rhythm, and gentle reception lighting; invent a distinct arrangement. Full silhouette visible with generous transparent safe padding; can float at a hero or chapter edge without touching the canvas edge. Soft realistic botanical/set-design rendering, nuanced petals, natural stems, no vase or venue. No lanterns, people, text, Chinese character, logo, watermark, frame, screenshot, or cropped branch. Avoid dense floral wall, mirrored symmetry, and plastic-looking petals.

### 3. Lantern pair

Use case: stylized-concept. Asset type: transparent standalone reception prop. Create a complete pair of softly glowing ivory paper lanterns: one round and one gently elongated, different sizes, suspended naturally at slightly different heights with very fine discreet cords. Warm amber light is subtle and stays within the paper; fine ribbing, matte handmade paper, clean editorial realism. Entire pair visible, transparent background, safe padding, readable as a small website accent on both cream and darker photo surfaces. No flowers, bamboo screen, people, text, characters, logo, watermark, furniture, or venue. Avoid blown highlights, hard neon glow, plastic material, clipped cords, and a scene backdrop.

### 4. Blossom divider

Use case: stylized-concept. Asset type: transparent edge-dependent website section divider. Create a shallow horizontal botanical sweep with a gently curved fine bamboo line, a few delicate peach/blush/cream blossoms and restrained trailing muted-green leaves. Keep the middle mostly open and the ornament light; composed specifically as a full visible divider, with both ends clearly finished and no branch cut off. Warm natural reception light, editorial botanical set-design realism, transparent background with alpha. No text, people, lanterns, logo, watermark, frame, screenshot, or heavy flower mass. Avoid a dense garland, hard straight border, clipped ends, mirrored symmetry, or dark opaque shadow.

### 5. Single blossom revision

Use case: stylized-concept. Asset type: single free-floating floral ornament. Use the current divider image only as a palette reference and the demo photos only for natural wedding-flower styling. Create one exceptionally realistic fully open peach garden rose with a few pale blush outer petals and two small muted-green leaves. A single bloom only: no garland, no branch, no second flower, no composition spanning the canvas. Isolated on a genuinely transparent background, full flower visible with safe padding, natural petal translucency and fine real botanical detail. No vase, environment, backdrop, glow, text, people, names, dates, symbols, logos, or watermark.

### 6–8. Curtain frame variations

Use the generated `abd-curtain-frame-v01.webp` only as the approved mood/palette reference and the three MinIO photographs only as material references. Generate three separate alternatives, each with a noticeably different real reception draping pattern while preserving ivory fabric, warm diffused light, asymmetry, and a broad clear center for HTML copy. Every version must look like high-end editorial event photography of real fabric physically hanging under gravity: visible fine weave, stitch/fold detail, natural shadows and bounced light; no illustration, no 3D-render sheen, no plastic, no fantasy glow. Isolated on genuine transparency with clean edges and generous safe padding; full canopy and both side falls visible. No people, flowers, bamboo, lanterns, stage furniture, venue background, names, date, text, symbol, logo, or watermark. Variation A uses a loose organza canopy with soft side falls; Variation B uses a lighter high canopy with relaxed tiebacks; Variation C uses layered long folds around a shallow curved opening. Do not copy the reference camera view or exact arrangement.

### 9–11. Three separate lantern types

Use the original MinIO references and removed `abd-lantern-pair-v01.png` only for mood/material reference. Generate three separate files, never a group: (1) a round ivory paper lantern; (2) an oval/teardrop lantern; (3) a tall cylindrical paper lantern. Each is one complete physical object with subtle ribbing, fine paper texture, tiny natural construction details, a discreet hanger, and a restrained warm amber source inside. Maximum photorealistic event-product photography, physically believable light and shadow, matte handmade paper, no CGI gloss. Genuine transparent background, full silhouette and hanger visible with safe padding. Keep the three silhouettes clearly distinct. No paired or clustered lanterns, no flowers, bamboo screen, room, stage, furniture, people, text, name, date, symbols, logo, watermark, or neon halo.

### 12–14. Floral/bamboo cluster variations

Use `abd-floral-bamboo-cluster-v01.png` only as a style reference. Generate three separate complete compositions: (A) low horizontal spray, (B) compact diagonal cascade, and (C) airy crescent. Keep peach, blush, ivory and muted sage flowers/foliage with fine warm bamboo, but change silhouette and balance in each image. Photoreal botanical/event editorial style, realistic petal and bamboo texture, warm restrained light. Isolated on true transparency with full branches visible and generous padding; no backdrop, venue, shadow plate, halo, vase, lantern, text, person, logo, or watermark.

### 15–17. Modern floristry revisions

Use `abd-floral-bamboo-cluster-v01.png` only for palette and material mood. Keep bamboo very restrained: two or three narrow canes behind the flowers, never a screen or dominant vertical mass. Replace the old-fashioned dense mix with contemporary sculptural floristry: ivory calla lilies, pale peach ranunculus, white/pale blush orchids and restrained anthuriums, with muted sage foliage and generous negative space. Create three distinct silhouettes (low horizontal spray, diagonal cascade, airy crescent), realistic editorial botanical photography and true transparent backgrounds. Avoid heavy bamboo, crowded blossom clusters, backdrop/halo/shadow plate, vase, text, people, logos, and watermarks.

## Placement map

| Asset | Intended use | Layer / density | Mobile behavior |
|---|---|---|---|
| Curtain frame | Hero only | Behind HTML content, low density; leave the full central opening clear. | Scale proportionally; if the center or names become cramped, suppress the frame and retain CSS curtain color/linework. |
| Floral ornament | Hero edge or one chapter transition | Foreground edge ornament, one placement at a time; never overlay controls or faces. | Reduce size and move outside the text measure; hide if it competes with the hero or causes horizontal overflow. |
| Single blossom | One story or closing accent | Small floating prop; no motion requirement; do not repeat as a pattern or cover copy. | Reduce or hide if it competes with reading width. |
| Lantern variants | Venue/story accent | Select at most one shape per composition; do not combine all three into a baked cluster. | Hide on narrow screens when it reduces readable space. |

No continuous animation is baked into these images. The P1 hero curtain-scroll signature is implemented later with bounded transforms and a static reduced-motion composition.

## Approved artwork review sheet

| Preview | Filename | Review status |
|---|---|---|
| [Hero curtain frame](../../../../frontend/public/assets/images/templates/a-beautiful-day/decor/abd-curtain-frame-v01.webp) | `abd-curtain-frame-v01.webp` | User-approved; optimized and alpha-edge reviewed |
| Single blossom | `abd-single-blossom-v02.webp` | User-approved; optimized and alpha-edge reviewed |
| Lantern round | `abd-lantern-round-v02.webp` | User-approved; lossless WebP optimized and alpha-edge reviewed |
| Lantern oval | `abd-lantern-oval-v02.webp` | User-approved; lossless WebP optimized and alpha-edge reviewed |
| Lantern column | `abd-lantern-column-v02.webp` | User-approved; lossless WebP optimized and alpha-edge reviewed |
| Curtain variations | `abd-curtain-frame-v02.webp` / `v03.webp` / `v04.webp` | User-approved; optimized and alpha-edge reviewed |
| Floral/bamboo clusters | `abd-floral-bamboo-cluster-v02.webp` / `v03.webp` / `v04.webp` | User-approved; lossless WebP optimized and alpha-edge reviewed |
| Modern floristry revisions | `abd-floral-bamboo-cluster-v05.webp` / `v06.webp` / `v07.webp` | User-approved; lossless WebP optimized and alpha-edge reviewed |

Inline contact sheet: [Approved artwork preview](./artwork-preview.md). All active artwork is approved, optimized, and edge-reviewed on ivory and dark backgrounds.

## Approval checklist

- [x] Four curtain options and six floral/bamboo clusters are visually approved by the user.
- [x] The single flower is one isolated bloom; the lanterns are three separate, visibly different objects.
- [x] No identifiable text, PII, faces, social UI, logos, watermark, or copied stage photograph.
- [x] Transparent files contain real alpha, complete silhouettes, and safe padding; lossless outputs preserve every alpha value.
- [x] Curtain frame preserves a large readable center; florals/props stay away from essential content.
- [x] Artwork retains palette/material cues on ivory, neutral, and dark image surfaces.
- [x] Desktop and 320px/mobile previews remain usable; no stretched or edge-clipped art.
- [x] Asset sizes meet the stated optimization targets after final export.
- [x] Final filenames, dimensions, formats, byte sizes, generator, prompts, and reference provenance are recorded in `asset-manifest.md`.

## Asset manifest

See [`asset-manifest.md`](./asset-manifest.md) for per-file dimensions, size, generation record, and current review status.
