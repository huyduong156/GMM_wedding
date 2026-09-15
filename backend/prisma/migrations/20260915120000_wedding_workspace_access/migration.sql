-- Workspace access grants are single-use links that become memberships after acceptance.
CREATE TYPE "WorkspaceAccessRole" AS ENUM ('EDITOR', 'VIEWER');
CREATE TYPE "WorkspaceAccessStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REVOKED', 'EXPIRED');

CREATE TYPE "WeddingMemberRole_new" AS ENUM ('OWNER', 'EDITOR', 'VIEWER');

ALTER TABLE "WeddingMember"
ALTER COLUMN "role" TYPE "WeddingMemberRole_new"
USING (
  CASE
    WHEN "role"::text = 'GUEST_MANAGER' THEN 'EDITOR'
    ELSE "role"::text
  END
)::"WeddingMemberRole_new";

DROP TYPE "WeddingMemberRole";
ALTER TYPE "WeddingMemberRole_new" RENAME TO "WeddingMemberRole";

CREATE TABLE "WeddingWorkspaceAccess" (
    "id" UUID NOT NULL,
    "weddingId" UUID NOT NULL,
    "createdByUserId" UUID NOT NULL,
    "acceptedByUserId" UUID,
    "email" VARCHAR(320),
    "role" "WorkspaceAccessRole" NOT NULL,
    "status" "WorkspaceAccessStatus" NOT NULL DEFAULT 'PENDING',
    "tokenHash" VARCHAR(128) NOT NULL,
    "expiresAt" TIMESTAMPTZ(3) NOT NULL,
    "acceptedAt" TIMESTAMPTZ(3),
    "revokedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "WeddingWorkspaceAccess_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "WeddingWorkspaceAccess_tokenHash_key" ON "WeddingWorkspaceAccess"("tokenHash");
CREATE INDEX "WeddingWorkspaceAccess_weddingId_status_createdAt_idx" ON "WeddingWorkspaceAccess"("weddingId", "status", "createdAt");
CREATE INDEX "WeddingWorkspaceAccess_email_weddingId_status_idx" ON "WeddingWorkspaceAccess"("email", "weddingId", "status");
CREATE INDEX "WeddingWorkspaceAccess_acceptedByUserId_idx" ON "WeddingWorkspaceAccess"("acceptedByUserId");

ALTER TABLE "WeddingWorkspaceAccess"
ADD CONSTRAINT "WeddingWorkspaceAccess_weddingId_fkey"
FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "WeddingWorkspaceAccess"
ADD CONSTRAINT "WeddingWorkspaceAccess_createdByUserId_fkey"
FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "WeddingWorkspaceAccess"
ADD CONSTRAINT "WeddingWorkspaceAccess_acceptedByUserId_fkey"
FOREIGN KEY ("acceptedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

COMMENT ON TABLE "WeddingWorkspaceAccess" IS 'Quyền truy cập workspace chờ hoặc đã được user claim.';
COMMENT ON COLUMN "WeddingWorkspaceAccess"."weddingId" IS 'Wedding mà link này cấp quyền truy cập.';
COMMENT ON COLUMN "WeddingWorkspaceAccess"."createdByUserId" IS 'User đã tạo link truy cập.';
COMMENT ON COLUMN "WeddingWorkspaceAccess"."email" IS 'Email giới hạn người được nhận quyền, nếu có.';
COMMENT ON COLUMN "WeddingWorkspaceAccess"."role" IS 'Role sẽ cấp khi user chấp nhận quyền truy cập.';
COMMENT ON COLUMN "WeddingWorkspaceAccess"."tokenHash" IS 'Hash của token link dùng một lần.';
COMMENT ON COLUMN "WeddingWorkspaceAccess"."acceptedByUserId" IS 'User đã claim link; ngăn người khác dùng lại.';
