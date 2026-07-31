# Asset sources

## Mây Hồng Có Đôi chibi invitation

- `frontend/public/assets/images/templates/chibi-daydream/chibi-couple-hero.png`, `album-wedding-car.png`, `album-cake-evening.png`: generated specifically for GMM Wedding with OpenAI image generation on 2026-07-31; original compositions, no external template assets.
- Remaining `chibi_*.png` files in that folder are project-owned copies from `assets/icons/chibi/v2/items/`, generated previously for GMM Wedding and reused under the same internal asset provenance.

## Self-hosted wedding fonts

- Families: Cormorant Garamond, Dancing Script, Be Vietnam Pro, Playfair Display, Lora, Fraunces, Phudu, Montserrat, Nunito Sans, Patrick Hand and Tapestry.
- Source: Official Google Fonts repository: https://github.com/google/fonts/tree/main/ofl
- License: SIL Open Font License 1.1; a family-specific `OFL.txt` is stored beside every downloaded font.
- Vietnamese coverage: each official Google Fonts `METADATA.pb` declares the `vietnamese` subset.
- Usage: Cormorant Garamond for wedding display text, Dancing Script for short romantic accents, Be Vietnam Pro for readable Vietnamese body and controls.
- Downloaded: 2026-07-31. See `docs/12-wedding-fonts.md` for exact roles and source folders.

## Login

### `frontend/public/assets/images/login-wedding-luxury.jpg`

- Title: Elegant Wedding Invitation Flat Lay on White Fabric
- Author: Larysa Stratiichuk
- Source: https://www.pexels.com/photo/elegant-wedding-invitation-flat-lay-on-white-fabric-29821867/
- License: https://www.pexels.com/license/
- Usage: Decorative background for the owner login hero.
- Treatment: Cropped, softly blurred, desaturated and covered with a dark directional overlay. This keeps overlaid text readable and prevents printed stationery details from being legible.

### `frontend/public/assets/images/ambient/*.png`

- Assets: `luxury-envelope.png`, `champagne-floral-ribbon.png`
- Source: Generated for GMM Wedding with OpenAI image generation on 2026-07-30.
- Usage: Low-contrast floating decoration in the reusable wedding ambient layer.
- Treatment: Generated on a solid chroma background, converted to transparent PNG, and rendered as non-interactive decorative content.

## Home landing decoration

### `frontend/public/assets/images/home-decor/*.png`

- Source: Reused from the internal generated `assets/icons/elegant/items/` collection.
- Assets: intertwined rings, wax envelope, champagne coupes, satin bow, calla lily and candle pair.
- Usage: Opening banner and low-opacity floating decoration on the public Home page.
- Treatment: Transparent PNG, decorative empty alt text, transform/opacity animation only and static fallback under `prefers-reduced-motion`.

## Verdant Promise invitation template

### `frontend/public/assets/images/templates/verdant-promise/*.png`

- Assets: `botanical-frame.png`, `greenhouse-background.png`.
- Source: Generated for GMM Wedding with the built-in OpenAI image generation tool on 2026-07-31.
- Prompt direction: Original photorealistic eucalyptus, fern and white-jasmine botanical frame; original misty glasshouse wedding garden background with ivory drapery and morning light. No people, text, logo or watermark.
- Usage: Opening cover, hero, footer and ambient botanical art for the Verdant Promise invitation.
- Rights note: Original generated assets; no imagery or code was copied from the Chung Đôi reference.

## Modern Luxe invitation template

### `couple-portrait.jpg`

- Title: Elegant Wedding Couple Portrait Indoors
- Author: Jhon Macias
- Source: https://www.pexels.com/photo/elegant-wedding-couple-portrait-indoors-34895002/
- License: https://www.pexels.com/license/
- Usage: Editorial couple image in the Modern Luxe invitation preview.
- Treatment: Locally hosted, cropped responsively, lightly desaturated. The people are illustrative models and are not presented as the default names in the fixture.

### `wedding-detail.jpg`

- Title: Elegant Bridal Bouquet with White Flowers
- Author: Taha Samet Arslan
- Source: https://www.pexels.com/photo/elegant-bridal-bouquet-with-white-flowers-34341283/
- License: https://www.pexels.com/license/
- Usage: Wedding detail image beside venue information in the Modern Luxe invitation preview.
- Treatment: Locally hosted, cropped responsively and lightly desaturated; no readable text or guest PII.

### `frontend/public/assets/images/ambient/*.png`

- Assets: `luxury-envelope.png`, `champagne-floral-ribbon.png`
- Source: Generated for GMM Wedding with OpenAI image generation on 2026-07-30.
- Usage: Low-contrast floating decoration in the reusable wedding ambient layer.
- Treatment: Generated on a solid chroma background, converted to transparent PNG, and rendered as non-interactive decorative content.
