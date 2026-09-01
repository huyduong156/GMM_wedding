-- Store draft payloads independently for each product surface.
ALTER TYPE "WeddingSurface" ADD VALUE IF NOT EXISTS 'RECAP';

ALTER TABLE "WeddingContent"
  ADD COLUMN "surface" "WeddingSurface",
  ADD COLUMN "templateVersionId" UUID,
  ADD COLUMN "themeConfig" JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN "sectionConfig" JSONB NOT NULL DEFAULT '{}'::jsonb;

DROP INDEX "WeddingContent_weddingId_key";

-- Existing MVP rows represented the invitation/content surface. If a legacy
-- wedding only had a website selection, preserve that row as website content.
UPDATE "WeddingContent" AS content
SET
  "surface" = CASE
    WHEN invitation."weddingId" IS NOT NULL THEN 'ONLINE_INVITATION'::"WeddingSurface"
    WHEN website."weddingId" IS NOT NULL THEN 'WEDDING_WEBSITE'::"WeddingSurface"
    ELSE 'ONLINE_INVITATION'::"WeddingSurface"
  END,
  "templateVersionId" = COALESCE(invitation."templateVersionId", website."templateVersionId")
FROM "Wedding" AS wedding
LEFT JOIN "InvitationDesign" AS invitation ON invitation."weddingId" = wedding."id"
LEFT JOIN "WeddingWebsite" AS website ON website."weddingId" = wedding."id"
WHERE content."weddingId" = wedding."id";

-- A wedding may already have both surfaces. Create an independent website
-- draft when the existing row was assigned to invitation. Do not copy the
-- invitation payload: content is template-owned and schemas are
-- surface-specific. The website editor will hydrate defaults from its
-- selected template.
INSERT INTO "WeddingContent" (
  "id", "weddingId", "surface", "templateVersionId", "schemaVersion",
  "content", "revision", "createdAt", "updatedAt"
)
SELECT
  gen_random_uuid(), content."weddingId", 'WEDDING_WEBSITE'::"WeddingSurface",
  website."templateVersionId", 1, '{}'::jsonb,
  1, now(), now()
FROM "WeddingContent" AS content
JOIN "WeddingWebsite" AS website ON website."weddingId" = content."weddingId"
WHERE content."surface" = 'ONLINE_INVITATION'::"WeddingSurface"
  AND website."templateVersionId" IS NOT NULL;

ALTER TABLE "WeddingContent"
  ALTER COLUMN "surface" SET NOT NULL;

CREATE UNIQUE INDEX "WeddingContent_weddingId_surface_key"
  ON "WeddingContent"("weddingId", "surface");
CREATE INDEX "WeddingContent_templateVersionId_idx"
  ON "WeddingContent"("templateVersionId");

ALTER TABLE "WeddingContent"
  ADD CONSTRAINT "WeddingContent_templateVersionId_fkey"
  FOREIGN KEY ("templateVersionId") REFERENCES "TemplateVersion"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
