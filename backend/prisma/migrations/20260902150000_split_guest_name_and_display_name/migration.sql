ALTER TABLE "Guest" RENAME COLUMN "displayName" TO "name";
ALTER TABLE "Guest" ADD COLUMN "displayName" VARCHAR(160);
DROP INDEX IF EXISTS "Guest_weddingId_displayName_idx";
CREATE INDEX "Guest_weddingId_name_idx" ON "Guest"("weddingId", "name");
