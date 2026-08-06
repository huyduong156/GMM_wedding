-- Wedding events are independently editable and need optimistic concurrency.
-- Adding a non-null column with a constant default is compatible with existing rows.
ALTER TABLE "WeddingEvent"
ADD COLUMN "revision" INTEGER NOT NULL DEFAULT 1;
