ALTER TABLE "InvitationDesign"
  ADD COLUMN "slug" VARCHAR(64),
  ADD COLUMN "isPublished" BOOLEAN NOT NULL DEFAULT false;

CREATE UNIQUE INDEX "InvitationDesign_slug_key" ON "InvitationDesign"("slug");

-- Preserve live pointers if this migration is applied after the first
-- publication scaffold has already created snapshots.
UPDATE "InvitationDesign" AS design
SET "slug" = live."slug", "isPublished" = true
FROM (
  SELECT DISTINCT ON ("weddingId") "weddingId", "slug"
  FROM "PublishedWeddingSnapshot"
  WHERE "surface" = 'ONLINE_INVITATION' AND "unpublishedAt" IS NULL
  ORDER BY "weddingId", "version" DESC
) AS live
WHERE design."weddingId" = live."weddingId";

UPDATE "WeddingWebsite" AS website
SET "slug" = live."slug", "isPublished" = true
FROM (
  SELECT DISTINCT ON ("weddingId") "weddingId", "slug"
  FROM "PublishedWeddingSnapshot"
  WHERE "surface" = 'WEDDING_WEBSITE' AND "unpublishedAt" IS NULL
  ORDER BY "weddingId", "version" DESC
) AS live
WHERE website."weddingId" = live."weddingId";
