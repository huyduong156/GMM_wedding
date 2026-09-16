-- Giữ quyền workspace chờ user mới xác thực email; link chỉ dùng khi claim được chấp nhận.
CREATE TYPE "WorkspaceAccessClaimStatus" AS ENUM ('PENDING', 'ACCEPTED', 'INVALID');

CREATE TABLE "WeddingWorkspaceAccessClaim" (
    "id" UUID NOT NULL,
    "workspaceAccessId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "status" "WorkspaceAccessClaimStatus" NOT NULL DEFAULT 'PENDING',
    "acceptedAt" TIMESTAMPTZ(3),
    "invalidatedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "WeddingWorkspaceAccessClaim_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "WeddingWorkspaceAccessClaim_workspaceAccessId_userId_key"
ON "WeddingWorkspaceAccessClaim"("workspaceAccessId", "userId");
CREATE INDEX "WeddingWorkspaceAccessClaim_userId_status_idx"
ON "WeddingWorkspaceAccessClaim"("userId", "status");
CREATE INDEX "WeddingWorkspaceAccessClaim_workspaceAccessId_status_idx"
ON "WeddingWorkspaceAccessClaim"("workspaceAccessId", "status");

ALTER TABLE "WeddingWorkspaceAccessClaim"
ADD CONSTRAINT "WeddingWorkspaceAccessClaim_workspaceAccessId_fkey"
FOREIGN KEY ("workspaceAccessId") REFERENCES "WeddingWorkspaceAccess"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "WeddingWorkspaceAccessClaim"
ADD CONSTRAINT "WeddingWorkspaceAccessClaim_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

COMMENT ON TABLE "WeddingWorkspaceAccessClaim" IS 'Claim quyền workspace chờ user xác thực email.';
COMMENT ON COLUMN "WeddingWorkspaceAccessClaim"."workspaceAccessId" IS 'Link quyền mà user đã dùng khi đăng ký.';
COMMENT ON COLUMN "WeddingWorkspaceAccessClaim"."userId" IS 'Tài khoản chờ xác thực để nhận quyền.';
