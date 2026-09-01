# 0012 - Surface-scoped template content
Status: Accepted
Date: 2026-09-01

## Context

Invitation, wedding website and Wedding Recap are all template-driven editors.
Their sections and field contracts are intentionally different. A single
`WeddingContent` row per wedding allowed an invitation payload to be returned
to the website editor, causing cross-surface data collisions.

## Decision

`WeddingContent` stores one draft payload per wedding and surface. The
supported surfaces are `ONLINE_INVITATION`, `WEDDING_WEBSITE` and `RECAP`.
Each row has its own `templateVersionId`, `schemaVersion`, `content` and
`themeConfig`, `sectionConfig`, publication `status`, `publishedAt` and
revision, with a unique constraint on `(weddingId, surface)`. The status uses
`DRAFT`, `PUBLISHED`, `SUSPENDED` and `ARCHIVED`; `Wedding.slug` is the single
public URL source and is not duplicated on content.

The payload is owned by the selected template. It is not a universal
canonical field map. A template may define one text field or several nested
fields without being forced into another template's schema.

Template-specific values such as section titles, thank-you messages and SEO
metadata live inside `content` JSON. They must not become dedicated columns in
the shared table.

The `RECAP` `WeddingContent` row is also the recap lifecycle aggregate. It
stores status and publication state alongside the template-owned payload.
Template-specific SEO values live inside `content` JSON. `Wedding.slug` is the
single URL source, so content does not duplicate a slug. Recap media, wishes
and immutable snapshots reference this content row directly; there is no
separate `WeddingRecap` table.

## Consequences

- Saving one surface cannot overwrite another surface's draft payload.
- Switching template versions requires defaults or an explicit migration for
  the new template schema.
- Surface-specific public snapshots and lifecycle records remain independent.
- New template-driven surfaces can be added by extending `WeddingSurface` and
  the surface policy, without creating another content table.
