-- Move recap's template-specific payload into the same surface-scoped content
-- store used by invitations and wedding websites. Keep WeddingRecap as the
-- recap lifecycle/selection aggregate.
ALTER TABLE "WeddingRecap"
  ADD COLUMN "contentId" UUID;

INSERT INTO "WeddingContent" (
  "id", "weddingId", "surface", "templateVersionId", "schemaVersion",
  "content", "themeConfig", "sectionConfig", "revision", "createdAt", "updatedAt"
)
SELECT
  gen_random_uuid(),
  recap."weddingId",
  'RECAP'::"WeddingSurface",
  recap."templateVersionId",
  template."contentSchemaVersion",
  recap."content", recap."themeConfig", recap."sectionConfig",
  recap."revision",
  recap."createdAt",
  recap."updatedAt"
FROM "WeddingRecap" AS recap
JOIN "TemplateVersion" AS template ON template."id" = recap."templateVersionId";

UPDATE "WeddingRecap" AS recap
SET "contentId" = content."id"
FROM "WeddingContent" AS content
WHERE content."weddingId" = recap."weddingId"
  AND content."surface" = 'RECAP'::"WeddingSurface";

ALTER TABLE "WeddingRecap"
  ALTER COLUMN "contentId" SET NOT NULL;

ALTER TABLE "WeddingRecap"
  DROP CONSTRAINT "WeddingRecap_templateVersionId_fkey",
  DROP COLUMN "templateVersionId",
  DROP COLUMN "content",
  DROP COLUMN "themeConfig",
  DROP COLUMN "sectionConfig";

ALTER TABLE "WeddingRecap"
  ADD CONSTRAINT "WeddingRecap_contentId_fkey"
  FOREIGN KEY ("contentId") REFERENCES "WeddingContent"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
