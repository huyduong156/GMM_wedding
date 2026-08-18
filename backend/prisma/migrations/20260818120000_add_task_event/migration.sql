ALTER TABLE "WeddingTask" ADD COLUMN "eventId" UUID;

CREATE INDEX "WeddingTask_weddingId_eventId_status_idx" ON "WeddingTask"("weddingId", "eventId", "status");

ALTER TABLE "WeddingTask" ADD CONSTRAINT "WeddingTask_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "WeddingEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
