CREATE TYPE "MusicTrackScope" AS ENUM ('SYSTEM', 'PERSONAL');
CREATE TYPE "MusicTrackStatus" AS ENUM ('DRAFT', 'PROCESSING', 'FAILED', 'READY', 'RETIRED');

CREATE TABLE "MusicTrack" (
    "id" UUID NOT NULL,
    "ownerUserId" UUID,
    "createdById" UUID NOT NULL,
    "scope" "MusicTrackScope" NOT NULL DEFAULT 'SYSTEM',
    "status" "MusicTrackStatus" NOT NULL DEFAULT 'DRAFT',
    "displayName" VARCHAR(160) NOT NULL,
    "artistName" VARCHAR(160),
    "durationSeconds" INTEGER,
    "mimeType" VARCHAR(128) NOT NULL,
    "sizeBytes" BIGINT NOT NULL,
    "storageKey" VARCHAR(512) NOT NULL,
    "licenseType" VARCHAR(80),
    "licenseReference" VARCHAR(500),
    "creditText" VARCHAR(500),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "revision" INTEGER NOT NULL DEFAULT 1,
    "retiredAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "MusicTrack_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MusicTrack_storageKey_key" ON "MusicTrack"("storageKey");
CREATE INDEX "MusicTrack_scope_status_sortOrder_idx" ON "MusicTrack"("scope", "status", "sortOrder");
CREATE INDEX "MusicTrack_ownerUserId_status_createdAt_idx" ON "MusicTrack"("ownerUserId", "status", "createdAt");

ALTER TABLE "MusicTrack" ADD CONSTRAINT "MusicTrack_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MusicTrack" ADD CONSTRAINT "MusicTrack_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;