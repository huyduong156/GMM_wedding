ALTER TABLE "GuestCategory"
ADD COLUMN "familySide" "GuestFamilySide";

CREATE INDEX "GuestCategory_weddingId_familySide_idx"
ON "GuestCategory"("weddingId", "familySide");
