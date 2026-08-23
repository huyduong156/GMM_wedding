-- AlterTable
ALTER TABLE "WeddingRecap"
  ADD COLUMN "content" JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN "themeConfig" JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN "sectionConfig" JSONB NOT NULL DEFAULT '{"enabled":[],"order":[]}'::jsonb;