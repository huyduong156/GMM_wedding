-- CreateEnum
CREATE TYPE "SystemRole" AS ENUM ('ADMIN', 'SUPPORT', 'MODERATOR');

-- CreateEnum
CREATE TYPE "VerificationPurpose" AS ENUM ('EMAIL_VERIFICATION', 'PASSWORD_RESET');

-- Convert the existing text purpose without discarding active tokens.
ALTER TABLE "VerificationToken" ADD COLUMN "purposeNext" "VerificationPurpose";
UPDATE "VerificationToken"
SET "purposeNext" = CASE "purpose"
  WHEN 'emailVerification' THEN 'EMAIL_VERIFICATION'::"VerificationPurpose"
  WHEN 'EMAIL_VERIFICATION' THEN 'EMAIL_VERIFICATION'::"VerificationPurpose"
  WHEN 'passwordReset' THEN 'PASSWORD_RESET'::"VerificationPurpose"
  WHEN 'PASSWORD_RESET' THEN 'PASSWORD_RESET'::"VerificationPurpose"
  ELSE NULL
END;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM "VerificationToken" WHERE "purposeNext" IS NULL) THEN
    RAISE EXCEPTION 'Unknown VerificationToken purpose; migrate values before deploy';
  END IF;
END $$;

ALTER TABLE "VerificationToken" DROP COLUMN "purpose";
ALTER TABLE "VerificationToken" RENAME COLUMN "purposeNext" TO "purpose";
ALTER TABLE "VerificationToken" ALTER COLUMN "purpose" SET NOT NULL;

-- CreateTable
CREATE TABLE "UserRole" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "role" "SystemRole" NOT NULL,
    "grantedById" UUID,
    "grantedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMPTZ(3),
    "revokedAt" TIMESTAMPTZ(3),
    "reason" VARCHAR(500),

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserRole_userId_role_revokedAt_idx" ON "UserRole"("userId", "role", "revokedAt");

-- CreateIndex
CREATE INDEX "UserRole_role_expiresAt_revokedAt_idx" ON "UserRole"("role", "expiresAt", "revokedAt");

-- CreateIndex
CREATE INDEX "UserRole_grantedById_idx" ON "UserRole"("grantedById");

-- A user can have only one active assignment for a system role.
CREATE UNIQUE INDEX "UserRole_active_role_key"
ON "UserRole"("userId", "role")
WHERE "revokedAt" IS NULL;

ALTER TABLE "UserRole"
  ADD CONSTRAINT "UserRole_expiry_check" CHECK ("expiresAt" IS NULL OR "expiresAt" > "grantedAt"),
  ADD CONSTRAINT "UserRole_revocation_check" CHECK ("revokedAt" IS NULL OR "revokedAt" >= "grantedAt");

-- Expand-contract bridge from the foundation scalar role.
INSERT INTO "UserRole" ("id", "userId", "role", "grantedAt", "reason")
SELECT gen_random_uuid(), "id", 'ADMIN'::"SystemRole", CURRENT_TIMESTAMP, 'Backfilled from User.platformRole'
FROM "User"
WHERE "platformRole" = 'ADMIN';

-- CreateIndex
CREATE INDEX "VerificationToken_identifier_purpose_expiresAt_idx" ON "VerificationToken"("identifier", "purpose", "expiresAt");

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_grantedById_fkey" FOREIGN KEY ("grantedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
