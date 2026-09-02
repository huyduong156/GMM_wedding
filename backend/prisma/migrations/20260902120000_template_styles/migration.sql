CREATE TYPE "TemplateStyleStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

CREATE TABLE "TemplateStyle" (
  "id" UUID NOT NULL,
  "key" VARCHAR(80) NOT NULL,
  "name" VARCHAR(120) NOT NULL,
  "description" TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "status" "TemplateStyleStatus" NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "TemplateStyle_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TemplateStyleAssignment" (
  "templateId" UUID NOT NULL,
  "styleId" UUID NOT NULL,
  CONSTRAINT "TemplateStyleAssignment_pkey" PRIMARY KEY ("templateId", "styleId"),
  CONSTRAINT "TemplateStyleAssignment_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "TemplateStyleAssignment_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "TemplateStyle"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "TemplateStyle_key_key" ON "TemplateStyle"("key");
CREATE INDEX "TemplateStyleAssignment_styleId_idx" ON "TemplateStyleAssignment"("styleId");
