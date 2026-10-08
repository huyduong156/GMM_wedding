CREATE TYPE "GuestFamilySide" AS ENUM ('BRIDE', 'GROOM');

ALTER TABLE "Guest"
ADD COLUMN "familySide" "GuestFamilySide";

CREATE INDEX "Guest_weddingId_familySide_idx"
ON "Guest"("weddingId", "familySide");
