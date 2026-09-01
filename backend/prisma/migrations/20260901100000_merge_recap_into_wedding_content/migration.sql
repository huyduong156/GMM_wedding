-- Make the RECAP WeddingContent row the single recap aggregate.
ALTER TABLE "WeddingContent"
  ADD COLUMN "slug" VARCHAR(64),
  ADD COLUMN "status" "RecapStatus",
  ADD COLUMN "title" VARCHAR(200),
  ADD COLUMN "thankYouMessage" TEXT,
  ADD COLUMN "ogTitle" VARCHAR(200),
  ADD COLUMN "ogDescription" VARCHAR(500),
  ADD COLUMN "ogImageUrl" VARCHAR(2048),
  ADD COLUMN "publishedAt" TIMESTAMPTZ(3);

UPDATE "WeddingContent" AS content
SET "slug" = recap."slug", "status" = recap."status", "title" = recap."title",
    "thankYouMessage" = recap."thankYouMessage", "ogTitle" = recap."ogTitle",
    "ogDescription" = recap."ogDescription", "ogImageUrl" = recap."ogImageUrl",
    "publishedAt" = recap."publishedAt"
FROM "WeddingRecap" AS recap
WHERE content."id" = recap."contentId" AND content."surface" = 'RECAP'::"WeddingSurface";

ALTER TABLE "RecapMediaItem" ADD COLUMN "contentId" UUID;
UPDATE "RecapMediaItem" AS item SET "contentId" = recap."contentId"
FROM "WeddingRecap" AS recap WHERE item."recapId" = recap."id";
ALTER TABLE "RecapMediaItem" ALTER COLUMN "contentId" SET NOT NULL;
ALTER TABLE "RecapMediaItem" DROP CONSTRAINT "RecapMediaItem_recapId_fkey";
DROP INDEX "RecapMediaItem_recapId_mediaAssetId_key";
DROP INDEX "RecapMediaItem_recapId_sortOrder_idx";
ALTER TABLE "RecapMediaItem" DROP COLUMN "recapId";
ALTER TABLE "RecapMediaItem" ADD CONSTRAINT "RecapMediaItem_contentId_fkey"
  FOREIGN KEY ("contentId") REFERENCES "WeddingContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
CREATE UNIQUE INDEX "RecapMediaItem_contentId_mediaAssetId_key"
  ON "RecapMediaItem"("contentId", "mediaAssetId");
CREATE INDEX "RecapMediaItem_contentId_sortOrder_idx"
  ON "RecapMediaItem"("contentId", "sortOrder");

ALTER TABLE "RecapWishSelection" ADD COLUMN "contentId" UUID;
UPDATE "RecapWishSelection" AS item SET "contentId" = recap."contentId"
FROM "WeddingRecap" AS recap WHERE item."recapId" = recap."id";
ALTER TABLE "RecapWishSelection" ALTER COLUMN "contentId" SET NOT NULL;
ALTER TABLE "RecapWishSelection" DROP CONSTRAINT "RecapWishSelection_recapId_fkey";
DROP INDEX "RecapWishSelection_recapId_wishId_key";
DROP INDEX "RecapWishSelection_recapId_sortOrder_idx";
ALTER TABLE "RecapWishSelection" DROP COLUMN "recapId";
ALTER TABLE "RecapWishSelection" ADD CONSTRAINT "RecapWishSelection_contentId_fkey"
  FOREIGN KEY ("contentId") REFERENCES "WeddingContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
CREATE UNIQUE INDEX "RecapWishSelection_contentId_wishId_key"
  ON "RecapWishSelection"("contentId", "wishId");
CREATE INDEX "RecapWishSelection_contentId_sortOrder_idx"
  ON "RecapWishSelection"("contentId", "sortOrder");

ALTER TABLE "PublishedRecapSnapshot" ADD COLUMN "contentId" UUID;
UPDATE "PublishedRecapSnapshot" AS snapshot SET "contentId" = recap."contentId"
FROM "WeddingRecap" AS recap WHERE snapshot."recapId" = recap."id";
ALTER TABLE "PublishedRecapSnapshot" ALTER COLUMN "contentId" SET NOT NULL;
ALTER TABLE "PublishedRecapSnapshot" DROP CONSTRAINT "PublishedRecapSnapshot_recapId_fkey";
DROP INDEX "PublishedRecapSnapshot_recapId_version_key";
ALTER TABLE "PublishedRecapSnapshot" DROP COLUMN "recapId";
ALTER TABLE "PublishedRecapSnapshot" ADD CONSTRAINT "PublishedRecapSnapshot_contentId_fkey"
  FOREIGN KEY ("contentId") REFERENCES "WeddingContent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE UNIQUE INDEX "PublishedRecapSnapshot_contentId_version_key"
  ON "PublishedRecapSnapshot"("contentId", "version");

ALTER TABLE "WeddingRecap" DROP CONSTRAINT "WeddingRecap_contentId_fkey";
ALTER TABLE "WeddingRecap" DROP CONSTRAINT "WeddingRecap_weddingId_fkey";
DROP INDEX "WeddingRecap_weddingId_key";
DROP TABLE "WeddingRecap";
