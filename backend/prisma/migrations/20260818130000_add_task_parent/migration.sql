ALTER TABLE "WeddingTask" ADD COLUMN "parentTaskId" UUID;

CREATE INDEX "WeddingTask_weddingId_parentTaskId_status_idx" ON "WeddingTask"("weddingId", "parentTaskId", "status");

ALTER TABLE "WeddingTask" ADD CONSTRAINT "WeddingTask_parentTaskId_fkey" FOREIGN KEY ("parentTaskId") REFERENCES "WeddingTask"("id") ON DELETE SET NULL ON UPDATE CASCADE;
