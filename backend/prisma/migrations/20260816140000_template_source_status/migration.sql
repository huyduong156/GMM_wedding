-- Add source lifecycle separate from admin publication lifecycle.
CREATE TYPE "TemplateSourceStatus" AS ENUM ('DEVELOPMENT', 'REVIEW', 'READY', 'DEPRECATED');
ALTER TABLE "TemplateVersion" ADD COLUMN "sourceStatus" "TemplateSourceStatus" NOT NULL DEFAULT 'REVIEW';