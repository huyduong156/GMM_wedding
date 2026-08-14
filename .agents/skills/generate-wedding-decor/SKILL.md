---
name: generate-wedding-decor
description: Define, generate, review, and hand off cohesive wedding-theme decorative image assets for invitation, wedding website, recap, section, body, edge, divider, and ambient use. Use whenever Codex creates a strong-subject theme such as Winter, Sakura or Cherry Blossom, Forest, Hydrangea, celestial, underwater, or another environmental world, and whenever original flowers, foliage, petals, ribbons, stationery, rings, candles, table objects, ornaments, or renderer-owned decor must work as independent web-ready cutouts rather than precomposed page layouts, scenes, cards, frames, backgrounds, or user-content photography.
---

# Generate Wedding Decor

Create original decor objects that the frontend can compose. Do not generate a finished website screenshot and then crop pieces from it.

## Enforce strong-subject themes

Treat decor generation as mandatory when the theme name or thesis promises a recognizable environmental/seasonal subject such as Winter, Sakura/Cherry Blossom, Forest, Hydrangea Garden, celestial or underwater. Do not allow palette, gradients, user-uploaded photography or two repeated ornaments to carry that identity.

Before composition is locked, return a complete renderer-owned decor family, asset usage map, contact sheet and provenance plan. For a long theme, produce at least six accepted artworks across four spatial roles. Stop the theme workflow when required roles or family consistency checks are incomplete.

Read the current theme docs compliance manifest and relevant surface docs before writing prompts. Recheck them after the assets are integrated; do not reuse assumptions from a previous theme.

## Establish the asset brief

Read the relevant theme and template documents first. Record:

- theme name, mood, palette, material and realism level;
- asset role: `corner`, `edge-cluster`, `floating-cluster`, `divider`, `wreath`, `garland`, `prop`, `particle-source`, or `background`;
- intended placement, maximum rendered size, light direction and motion treatment;
- required family members and how their silhouettes differ;
- mobile, reduced-motion and missing-asset fallback.

Default to independent decor cutouts. Treat a full background or scene as a separate, explicitly requested deliverable.

## Build a small coherent family

Write an `asset family bible` before the first prompt. Lock the medium and realism level, palette and saturation range, contrast, light direction and softness, camera/perspective, shadow treatment, edge/alpha finish, anatomy rules and detail density. Use the same bible for generated and downloaded decor; provenance does not excuse a visual mismatch.

Generate the fewest assets that give the page visual rhythm. For a botanical theme, prefer:

1. one primary flower cluster with a complete silhouette;
2. one secondary cluster with a clearly different density or direction;
3. one small accent such as petals, buds or leaves;
4. one theme-compatible prop only when it adds a distinct section role.

Do not repeat one image across every section. Do not force every theme to contain a branch, arch, border, wreath or full-width arrangement.

## Write prompts for composable cutouts

Describe one physical object or cluster per output. Require:

- isolated subject, fully visible silhouette and intentional natural asymmetry;
- photorealistic or refined botanical realism unless the theme explicitly selects another medium;
- crisp petal/leaf edges, believable depth, restrained highlights and consistent light direction;
- harmonious color separation that survives ivory, dark and tinted web backgrounds;
- generous clear space around the subject and no edge clipping;
- transparent background when the generator supports reliable alpha, otherwise a flat high-contrast removable chroma background;
- no people, text, logo, watermark, frame, card, room, landscape, table setting or webpage composition unless explicitly requested.

For any asset intended to float in the center of a viewport or section, forbid a visible border, picture frame, paper edge, rectangular crop, edge vignette, background patch or artificial outline. Preserve only the natural contour of the subject and a clean alpha transition. A frame is valid only when the declared asset role is explicitly `frame`, `corner` or `edge`.

State negative constraints directly. Avoid vague prompts such as “beautiful wedding decoration” or “luxury floral website”.

Use the prompt patterns and measurable handoff contract in [references/asset-spec.md](references/asset-spec.md).

## Generate and inspect

Use the available image-generation tool. Generate one role at a time so the output is easy to reject or regenerate. Inspect the actual output before accepting it.

Reject an asset when any of these are true:

- it depends on a baked-in branch, border, wall, card, arch, room or section layout;
- the subject is clipped, too centered/symmetrical, visibly tiled or padded with unusable scenery;
- petals, leaves, stems or object edges melt together, look plastic, painterly by accident or contain generation artifacts;
- lighting, palette, realism or material conflicts with the rest of the family;
- the transparent edge has halos, opaque residue or a false checkerboard;
- it contains readable text, a logo, watermark, person or identifiable private information.
- a center/floating asset has any visible rectangular boundary, framing device, paper edge, matte, vignette or background-colored box;

Do not approve an asset merely because its theme is correct. It must also be technically composable.

Do not approve assets one at a time in isolation. Build a contact sheet with every candidate at comparable scale over the same light, dark and theme-tinted backgrounds. Reject any outlier in medium, palette, lighting, perspective, shadow, anatomy, sharpness or finish, even when that asset looks attractive by itself.

## Prepare the web handoff

Keep the lossless source. Export a transparent PNG or WebP derivative appropriate to the browser target. Preserve enough resolution for the maximum rendered size and high-density displays without shipping the unbounded generator output.

Return:

- file name and semantic role;
- source dimensions, intended CSS size range and safe crop/anchor notes;
- suggested desktop/mobile placement and transform origin;
- whether subtle transform/opacity animation is safe;
- prompt, generator, generation date and provenance;
- accessibility mode: decorative assets use empty alt text and must not receive pointer events;
- rejection notes or unresolved alpha/edge risks.

Record accepted assets in `assets/ASSET_SOURCES.md`. Never hotlink a reference or commit an external asset without verified usage rights.

## Validate in composition

Test every accepted cutout on light, dark and theme-tinted backgrounds. Test it at its smallest mobile size and largest desktop size. Check that it can be moved, overlapped and partially cropped without revealing a baked-in layout. Mirror only when botanically and directionally plausible.

Keep text readable, prevent horizontal overflow and cumulative layout shift, set decoration to `pointer-events: none`, and provide a static reduced-motion state. Reject the family if the page only works when every asset occupies one exact coordinate.

Create an asset usage map before handoff. For a long public theme, provide at least six distinct decorative artworks across at least four spatial roles unless the theme specification justifies a smaller system. Do not place the same prominent file in adjacent sections or use it prominently more than twice on the page. Scaling, mirroring, tinting or cropping one file does not create a new artwork.

Test the accepted family together in at least three sections with different backgrounds and depth roles. Confirm the family still looks authored as one system after section reorder; do not rely on one neighboring section to hide a mismatched asset.

## Reference images

Use approved external examples only to identify qualities such as an isolated flower cluster, realistic sharp edges, transparent separation and flexible silhouette. Do not copy their exact composition or pixels. Verify license separately before reuse; when license is uncertain, generate an original asset from the abstract visual criteria.
