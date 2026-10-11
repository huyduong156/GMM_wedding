# Deep Ocean

Deep Ocean is a light, gentle wedding website inspired by sunlit water, pearls and starfish. It is a `WEDDING_WEBSITE` template, not an invitation opening flow and not a recap page.

## Preview

`/templates/websites/deep-ocean/preview`

## Template identity

| Field | Value |
| --- | --- |
| Template key | `deep-ocean` |
| Product type | `WEDDING_WEBSITE` |
| Display name | `Deep Ocean Wedding` |
| Primary palette | Light ocean blue, pearl white, soft sand and sea-glass green |
| Visual language | Sunlit water, translucent layers, pearls and quiet coastal details |
| Motion | Subtle reveal and gentle ambient depth; native scrolling remains intact |

## Product decisions

- The website renders directly. There is no opening gate or intermediate cover interaction.
- All planned sections are composed in one renderer pass; optional sections are controlled by the shared website section contract.
- There is no visible `Our Soundtrack` content section.
- Background music uses the shared `MusicPlayer` component as a non-blocking floating control. When no track is configured, the control is not rendered.
- The music fields are available to the editor through the template configuration and are stored at `music.backgroundMusicUrl`, `music.backgroundMusicName` and `music.backgroundMusicAutoplay`.

## Section order

`navigation -> hero -> story -> timeline -> weddingDay -> gallery -> memories -> people -> film -> wishes -> capsule -> footer`

The `DeepOceanWebsite` renderer reads `enabled` and `order` from `deepOceanSections`; the section keys must stay aligned with `data-editor-section` markers and the editor contract.

## Files

- `DeepOceanWebsite.tsx` - direct-load renderer and shared music integration.
- `content.ts` - isolated data and section types.
- `fixture.ts` - fictional preview data and default section order.
- `template-config.ts` - catalog/editor metadata and music fields.
- `deep-ocean.css` - namespaced visual system.
- `README.md` - product and implementation contract.
- `AUTHORING.md` - phase checklist and authoring guardrails.

## Validation

```text
npm test -- --run src/templates/websites/deep-ocean/DeepOceanWebsite.test.tsx
npm run typecheck
```

The fixture must remain fictional and must not contain real guest PII, account data, bank details or unlicensed media.
