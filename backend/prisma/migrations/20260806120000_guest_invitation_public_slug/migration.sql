ALTER TABLE "Invitation" ADD COLUMN "publicSlug" VARCHAR(160);

CREATE UNIQUE INDEX "Invitation_weddingId_publicSlug_key" ON "Invitation"("weddingId", "publicSlug");
