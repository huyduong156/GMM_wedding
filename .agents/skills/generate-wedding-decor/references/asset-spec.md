# Wedding decor asset specification

## Deliverable classes

| Role | Composition | Typical motion | Reject when |
|---|---|---|---|
| `floating-cluster` | Complete organic silhouette, no support object | Drift, rotate or parallax by a few pixels | It needs a corner, vase, branch or frame to make sense |
| `edge-cluster` | Visual weight on one side, natural exit direction | Subtle edge parallax | It contains a baked-in page border or hard rectangular crop |
| `corner` | L-shaped tendency without a literal card corner | Static or small depth offset | It fixes the final card size or contains typography space |
| `divider` | Shallow horizontal rhythm with transparent ends | Reveal by transform/opacity | It is a full section banner or repeats visibly |
| `wreath` / `garland` | Closed or directional structure for a specific role | Usually static | It becomes the only artwork repeated throughout the page |
| `prop` | One isolated wedding object or small still-life cluster | Small float or tilt | It includes readable stationery, people or a complete room scene |
| `particle-source` | One to three clean petals/leaves with distinct silhouettes | Particle system | It contains shadows/background pixels that expose each sprite |
| `background` | Intentional full scene, requested separately | Pan/parallax only with fallback | It is presented as a reusable cutout |

## Center-placement rule

For `floating-cluster`, `prop` or any decor placed near the center of the viewport, reject visible borders, frames, mats, paper edges, rectangular crops, edge vignettes, background patches and artificial outlines. The subject may have its own natural edge and physically plausible internal shadow, but it must dissolve cleanly into transparent alpha and remain natural when placed over a gradient.

## Prompt skeleton

```text
Create one original [SUBJECT] decorative cutout for a [THEME] wedding website.
Role: [ROLE] placed near [PLACEMENT], rendered approximately [CSS SIZE].
Appearance: [REALISM/MEDIUM], [PALETTE], natural asymmetry, believable depth,
crisp individual edges, restrained highlights, consistent light from [DIRECTION].
Composition: one self-contained cluster, complete silhouette, generous clear space,
easy to place independently over web content.
Background: true transparent alpha; if unavailable, uniform [CHROMA COLOR] with no
cast shadow or color spill.
Exclude: webpage, mockup, card, frame, border, room, landscape, table, vase, branch
unless named as the subject, people, hands, text, logo, watermark, checkerboard,
clipped petals/leaves, duplicate anatomy, plastic texture and blurred edges.
```

## Botanical example

```text
Create one original cluster of pale blush cherry blossoms as an independent wedding
website ornament. Use several flowers at different natural angles with a few buds and
short connecting stems contained inside the cluster. Photorealistic botanical detail,
fine translucent petals, crisp stamens and edges, soft daylight from upper left, gentle
ivory-to-blush palette, natural asymmetry and a complete unclipped silhouette. Leave
generous clear space around the cluster. True transparent background. No long tree
branch, vase, border, wreath, room, landscape, card, text, logo, watermark, hard cast
shadow, plastic petals, painted blur or repeated flowers.
```

## Technical acceptance

- Keep a lossless source and an alpha-capable web derivative.
- Size the derivative for roughly 1.5–2x the largest intended CSS dimension; choose the exact cap from the asset detail and page budget.
- Verify edges at 100% and 200% zoom on light, dark and saturated test backgrounds.
- Remove chroma spill and opaque fringe; do not soften the whole subject to hide a bad mask.
- Preserve a tight but safe transparent bounding box; avoid large invisible padding.
- Record width, height, format, file size, role, intended CSS range and anchor.
- Test 375px, 768px and 1280px compositions without horizontal overflow.
- Test center assets over a continuous gradient and reject any boundary that reveals the source canvas.

## Family consistency check

Define one family bible before generation: medium/realism, palette and saturation range, contrast, light direction/softness, camera/perspective, shadow treatment, alpha/edge finish, anatomy and detail density. Put these values into every prompt and stock-asset review.

- Keep one light direction and compatible contrast across the family.
- Vary silhouettes, scale and density; do not create near-duplicates.
- Keep each file useful by itself.
- Ensure the family includes at least two spatial roles before adding more variants.
- Prefer a strong three-asset family over many weak ornaments.
- For a long public theme, expand the accepted family to at least six distinct artworks across four roles before integration; do not count scale, mirror, tint or crop variants as new artworks.
- Do not assign the same prominent artwork to adjacent sections or more than two prominent placements across the page.
- Review all candidates on one contact sheet at comparable scale over common test backgrounds; reject visual outliers instead of correcting them with CSS tint/filter.
- Compose the accepted family in at least three sections and after one reorder permutation to verify it remains coherent outside the original placement.

## Provenance record

Add one entry per accepted group to `assets/ASSET_SOURCES.md` with file paths, source or generator, generation date, prompt direction, intended usage, treatment and rights note. A reference URL is inspiration metadata, not permission to copy or redistribute.
