-- Finalize the surface-scoped content model. Existing draft data is intentionally
-- not backfilled; development databases are reset after this migration.
CREATE TYPE "ContentPublicationStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'SUSPENDED', 'ARCHIVED');

ALTER TABLE "WeddingContent"
  ALTER COLUMN "status" DROP DEFAULT,
  ALTER COLUMN "status" TYPE "ContentPublicationStatus"
    USING CASE
      WHEN "status"::text = 'PUBLISHED' THEN 'PUBLISHED'::"ContentPublicationStatus"
      WHEN "status"::text = 'ARCHIVED' THEN 'ARCHIVED'::"ContentPublicationStatus"
      ELSE 'DRAFT'::"ContentPublicationStatus"
    END,
  ALTER COLUMN "status" SET DEFAULT 'DRAFT'::"ContentPublicationStatus",
  ALTER COLUMN "status" SET NOT NULL;

ALTER TABLE "WeddingContent"
  DROP COLUMN "slug",
  DROP COLUMN "title",
  DROP COLUMN "thankYouMessage",
  DROP COLUMN "ogTitle",
  DROP COLUMN "ogDescription",
  DROP COLUMN "ogImageUrl";

DROP TABLE IF EXISTS "InvitationDesign";
DROP TABLE IF EXISTS "WeddingWebsite";
DROP TABLE IF EXISTS "WeddingTheme";

DROP TYPE "RecapStatus";
