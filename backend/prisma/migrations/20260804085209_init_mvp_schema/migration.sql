-- CreateEnum
CREATE TYPE "PlatformRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING_VERIFICATION', 'ACTIVE', 'SUSPENDED', 'DELETED');

-- CreateEnum
CREATE TYPE "WeddingStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "WeddingVisibility" AS ENUM ('PUBLIC', 'PASSWORD_PROTECTED', 'INVITE_ONLY');

-- CreateEnum
CREATE TYPE "WeddingMemberRole" AS ENUM ('OWNER', 'EDITOR', 'GUEST_MANAGER', 'VIEWER');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('INVITED', 'ACTIVE', 'REVOKED');

-- CreateEnum
CREATE TYPE "WeddingSurface" AS ENUM ('ONLINE_INVITATION', 'WEDDING_WEBSITE');

-- CreateEnum
CREATE TYPE "TemplateProductType" AS ENUM ('ONLINE_INVITATION', 'WEDDING_WEBSITE', 'RECAP');

-- CreateEnum
CREATE TYPE "TemplateStatus" AS ENUM ('DRAFT', 'ACTIVE', 'DEPRECATED', 'RETIRED');

-- CreateEnum
CREATE TYPE "MediaStatus" AS ENUM ('PENDING_UPLOAD', 'PROCESSING', 'READY', 'REJECTED', 'FAILED');

-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('ACTIVE', 'REVOKED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('ATTENDING', 'DECLINED', 'MAYBE');

-- CreateEnum
CREATE TYPE "WishStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SPAM', 'HIDDEN');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ChecklistStatus" AS ENUM ('DRAFT', 'ACTIVE', 'RETIRED');

-- CreateEnum
CREATE TYPE "GiftType" AS ENUM ('MONEY', 'GOLD', 'PHYSICAL_GIFT');

-- CreateEnum
CREATE TYPE "GiftReceiveMethod" AS ENUM ('CASH', 'BANK_TRANSFER', 'PHYSICAL_GIFT', 'OTHER');

-- CreateEnum
CREATE TYPE "ReciprocityStatus" AS ENUM ('PENDING', 'RETURNED', 'NOT_APPLICABLE');

-- CreateEnum
CREATE TYPE "RecapStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('IN_APP', 'EMAIL');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'READ');

-- CreateEnum
CREATE TYPE "OutboxStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "IdempotencyStatus" AS ENUM ('PROCESSING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "emailVerifiedAt" TIMESTAMPTZ(3),
    "passwordHash" VARCHAR(255),
    "displayName" VARCHAR(120),
    "avatarUrl" VARCHAR(2048),
    "locale" VARCHAR(16) NOT NULL DEFAULT 'vi-VN',
    "timezone" VARCHAR(64) NOT NULL DEFAULT 'Asia/Ho_Chi_Minh',
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "platformRole" "PlatformRole" NOT NULL DEFAULT 'USER',
    "lastLoginAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "deletedAt" TIMESTAMPTZ(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "provider" VARCHAR(64) NOT NULL,
    "providerAccountId" VARCHAR(255) NOT NULL,
    "type" VARCHAR(32) NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "expiresAt" INTEGER,
    "tokenType" VARCHAR(32),
    "scope" TEXT,
    "idToken" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "sessionHash" VARCHAR(255) NOT NULL,
    "expiresAt" TIMESTAMPTZ(3) NOT NULL,
    "lastSeenAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipHash" VARCHAR(128),
    "userAgent" VARCHAR(512),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMPTZ(3),

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "id" UUID NOT NULL,
    "identifier" VARCHAR(320) NOT NULL,
    "purpose" VARCHAR(32) NOT NULL,
    "tokenHash" VARCHAR(255) NOT NULL,
    "expiresAt" TIMESTAMPTZ(3) NOT NULL,
    "usedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wedding" (
    "id" UUID NOT NULL,
    "createdById" UUID NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "slug" VARCHAR(64),
    "status" "WeddingStatus" NOT NULL DEFAULT 'DRAFT',
    "visibility" "WeddingVisibility" NOT NULL DEFAULT 'PUBLIC',
    "accessPasswordHash" VARCHAR(255),
    "timezone" VARCHAR(64) NOT NULL DEFAULT 'Asia/Ho_Chi_Minh',
    "locale" VARCHAR(16) NOT NULL DEFAULT 'vi-VN',
    "primaryDate" TIMESTAMPTZ(3),
    "revision" INTEGER NOT NULL DEFAULT 1,
    "publishedAt" TIMESTAMPTZ(3),
    "archivedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "deletedAt" TIMESTAMPTZ(3),

    CONSTRAINT "Wedding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeddingMember" (
    "id" UUID NOT NULL,
    "weddingId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "role" "WeddingMemberRole" NOT NULL,
    "status" "MembershipStatus" NOT NULL DEFAULT 'ACTIVE',
    "invitedAt" TIMESTAMPTZ(3),
    "joinedAt" TIMESTAMPTZ(3),
    "revokedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "WeddingMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeddingEvent" (
    "id" UUID NOT NULL,
    "weddingId" UUID NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "eventType" VARCHAR(48) NOT NULL,
    "startsAt" TIMESTAMPTZ(3) NOT NULL,
    "endsAt" TIMESTAMPTZ(3),
    "timezone" VARCHAR(64) NOT NULL,
    "venueName" VARCHAR(200),
    "addressLine" VARCHAR(500),
    "mapUrl" VARCHAR(2048),
    "latitude" DECIMAL(9,6),
    "longitude" DECIMAL(9,6),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "deletedAt" TIMESTAMPTZ(3),

    CONSTRAINT "WeddingEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeddingContent" (
    "id" UUID NOT NULL,
    "weddingId" UUID NOT NULL,
    "schemaVersion" INTEGER NOT NULL DEFAULT 1,
    "content" JSONB NOT NULL,
    "revision" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "WeddingContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeddingTheme" (
    "id" UUID NOT NULL,
    "weddingId" UUID NOT NULL,
    "surface" "WeddingSurface" NOT NULL,
    "configVersion" INTEGER NOT NULL DEFAULT 1,
    "themeConfig" JSONB NOT NULL,
    "sectionConfig" JSONB NOT NULL,
    "revision" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "WeddingTheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeddingWebsite" (
    "id" UUID NOT NULL,
    "weddingId" UUID NOT NULL,
    "templateVersionId" UUID,
    "slug" VARCHAR(64),
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "revision" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "WeddingWebsite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvitationDesign" (
    "id" UUID NOT NULL,
    "weddingId" UUID NOT NULL,
    "templateVersionId" UUID,
    "revision" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "InvitationDesign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Template" (
    "id" UUID NOT NULL,
    "key" VARCHAR(80) NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "productType" "TemplateProductType" NOT NULL,
    "status" "TemplateStatus" NOT NULL DEFAULT 'DRAFT',
    "description" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemplateVersion" (
    "id" UUID NOT NULL,
    "templateId" UUID NOT NULL,
    "version" VARCHAR(32) NOT NULL,
    "configHash" VARCHAR(128) NOT NULL,
    "templateConfigVersion" INTEGER NOT NULL,
    "contentSchemaVersion" INTEGER NOT NULL,
    "rendererApiVersion" INTEGER NOT NULL,
    "codeRevision" VARCHAR(128) NOT NULL,
    "config" JSONB NOT NULL,
    "releasedAt" TIMESTAMPTZ(3),
    "deprecatedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TemplateVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublishedWeddingSnapshot" (
    "id" UUID NOT NULL,
    "weddingId" UUID NOT NULL,
    "templateVersionId" UUID NOT NULL,
    "version" INTEGER NOT NULL,
    "surface" "WeddingSurface" NOT NULL,
    "slug" VARCHAR(64) NOT NULL,
    "payload" JSONB NOT NULL,
    "payloadHash" VARCHAR(128) NOT NULL,
    "contentSchemaVersion" INTEGER NOT NULL,
    "rendererApiVersion" INTEGER NOT NULL,
    "publishedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unpublishedAt" TIMESTAMPTZ(3),

    CONSTRAINT "PublishedWeddingSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" UUID NOT NULL,
    "weddingId" UUID NOT NULL,
    "uploadedById" UUID,
    "storageKey" VARCHAR(512) NOT NULL,
    "originalName" VARCHAR(255),
    "mimeType" VARCHAR(128) NOT NULL,
    "sizeBytes" BIGINT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "status" "MediaStatus" NOT NULL DEFAULT 'PENDING_UPLOAD',
    "checksum" VARCHAR(128),
    "altText" VARCHAR(500),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "deletedAt" TIMESTAMPTZ(3),

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaVariant" (
    "id" UUID NOT NULL,
    "mediaAssetId" UUID NOT NULL,
    "variantKey" VARCHAR(48) NOT NULL,
    "storageKey" VARCHAR(512) NOT NULL,
    "mimeType" VARCHAR(128) NOT NULL,
    "sizeBytes" BIGINT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuestCategory" (
    "id" UUID NOT NULL,
    "weddingId" UUID NOT NULL,
    "parentId" UUID,
    "name" VARCHAR(120) NOT NULL,
    "depth" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "deletedAt" TIMESTAMPTZ(3),

    CONSTRAINT "GuestCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuestGroup" (
    "id" UUID NOT NULL,
    "weddingId" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "deletedAt" TIMESTAMPTZ(3),

    CONSTRAINT "GuestGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guest" (
    "id" UUID NOT NULL,
    "weddingId" UUID NOT NULL,
    "categoryId" UUID,
    "groupId" UUID,
    "displayName" VARCHAR(160) NOT NULL,
    "phone" VARCHAR(32),
    "email" VARCHAR(320),
    "note" TEXT,
    "tableName" VARCHAR(120),
    "maxPartySize" INTEGER NOT NULL DEFAULT 1,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "deletedAt" TIMESTAMPTZ(3),

    CONSTRAINT "Guest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invitation" (
    "id" UUID NOT NULL,
    "weddingId" UUID NOT NULL,
    "guestId" UUID,
    "label" VARCHAR(160),
    "tokenHash" VARCHAR(255) NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'ACTIVE',
    "maxPartySize" INTEGER NOT NULL DEFAULT 1,
    "expiresAt" TIMESTAMPTZ(3),
    "revokedAt" TIMESTAMPTZ(3),
    "lastViewedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RsvpResponse" (
    "id" UUID NOT NULL,
    "weddingId" UUID NOT NULL,
    "invitationId" UUID NOT NULL,
    "attendance" "AttendanceStatus" NOT NULL,
    "partySize" INTEGER NOT NULL,
    "mealPreference" VARCHAR(160),
    "specialRequest" TEXT,
    "message" TEXT,
    "submittedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "revision" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "RsvpResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RsvpEventSelection" (
    "id" UUID NOT NULL,
    "rsvpResponseId" UUID NOT NULL,
    "weddingEventId" UUID NOT NULL,
    "attending" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "RsvpEventSelection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RsvpCompanion" (
    "id" UUID NOT NULL,
    "rsvpResponseId" UUID NOT NULL,
    "displayName" VARCHAR(160) NOT NULL,
    "mealPreference" VARCHAR(160),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "RsvpCompanion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wish" (
    "id" UUID NOT NULL,
    "weddingId" UUID NOT NULL,
    "invitationId" UUID,
    "guestId" UUID,
    "authorName" VARCHAR(160) NOT NULL,
    "content" TEXT NOT NULL,
    "status" "WishStatus" NOT NULL DEFAULT 'PENDING',
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "submittedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "moderatedAt" TIMESTAMPTZ(3),
    "deletedAt" TIMESTAMPTZ(3),

    CONSTRAINT "Wish_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskChecklistTemplate" (
    "id" UUID NOT NULL,
    "key" VARCHAR(80) NOT NULL,
    "version" INTEGER NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "status" "ChecklistStatus" NOT NULL DEFAULT 'DRAFT',
    "locale" VARCHAR(16) NOT NULL DEFAULT 'vi-VN',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskChecklistTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskChecklistItem" (
    "id" UUID NOT NULL,
    "checklistTemplateId" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "category" VARCHAR(80),
    "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
    "relativeDueDayOffset" INTEGER,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TaskChecklistItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeddingTask" (
    "id" UUID NOT NULL,
    "weddingId" UUID NOT NULL,
    "assigneeMemberId" UUID,
    "completedById" UUID,
    "sourceTemplateKey" VARCHAR(80),
    "sourceTemplateVersion" INTEGER,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "dueAt" TIMESTAMPTZ(3),
    "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "TaskStatus" NOT NULL DEFAULT 'TODO',
    "category" VARCHAR(80),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMPTZ(3),
    "revision" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "deletedAt" TIMESTAMPTZ(3),

    CONSTRAINT "WeddingTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GiftLedgerEntry" (
    "id" UUID NOT NULL,
    "weddingId" UUID NOT NULL,
    "guestId" UUID,
    "guestDisplayNameSnapshot" VARCHAR(160) NOT NULL,
    "giftType" "GiftType" NOT NULL,
    "amountMinor" BIGINT,
    "currency" CHAR(3),
    "goldWeight" DECIMAL(12,4),
    "goldUnit" VARCHAR(32),
    "goldType" VARCHAR(64),
    "giftDescription" TEXT,
    "receiveMethod" "GiftReceiveMethod" NOT NULL,
    "receivedAt" TIMESTAMPTZ(3) NOT NULL,
    "note" TEXT,
    "reciprocityStatus" "ReciprocityStatus" NOT NULL DEFAULT 'PENDING',
    "returnedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "deletedAt" TIMESTAMPTZ(3),

    CONSTRAINT "GiftLedgerEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeddingRecap" (
    "id" UUID NOT NULL,
    "weddingId" UUID NOT NULL,
    "templateVersionId" UUID NOT NULL,
    "slug" VARCHAR(64),
    "status" "RecapStatus" NOT NULL DEFAULT 'DRAFT',
    "title" VARCHAR(200) NOT NULL,
    "thankYouMessage" TEXT,
    "ogTitle" VARCHAR(200),
    "ogDescription" VARCHAR(500),
    "ogImageUrl" VARCHAR(2048),
    "revision" INTEGER NOT NULL DEFAULT 1,
    "publishedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "WeddingRecap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecapMediaItem" (
    "id" UUID NOT NULL,
    "recapId" UUID NOT NULL,
    "mediaAssetId" UUID NOT NULL,
    "caption" VARCHAR(500),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "RecapMediaItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecapWishSelection" (
    "id" UUID NOT NULL,
    "recapId" UUID NOT NULL,
    "wishId" UUID NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "RecapWishSelection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublishedRecapSnapshot" (
    "id" UUID NOT NULL,
    "recapId" UUID NOT NULL,
    "templateVersionId" UUID NOT NULL,
    "version" INTEGER NOT NULL,
    "slug" VARCHAR(64) NOT NULL,
    "payload" JSONB NOT NULL,
    "payloadHash" VARCHAR(128) NOT NULL,
    "publishedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unpublishedAt" TIMESTAMPTZ(3),

    CONSTRAINT "PublishedRecapSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationPreference" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "eventKey" VARCHAR(100) NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "NotificationPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "eventKey" VARCHAR(100) NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "payload" JSONB NOT NULL,
    "sentAt" TIMESTAMPTZ(3),
    "readAt" TIMESTAMPTZ(3),
    "failedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" UUID NOT NULL,
    "actorUserId" UUID,
    "weddingId" UUID,
    "action" VARCHAR(100) NOT NULL,
    "resourceType" VARCHAR(80) NOT NULL,
    "resourceId" VARCHAR(128),
    "requestId" VARCHAR(128),
    "reason" VARCHAR(500),
    "metadata" JSONB,
    "occurredAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutboxEvent" (
    "id" UUID NOT NULL,
    "aggregateType" VARCHAR(80) NOT NULL,
    "aggregateId" VARCHAR(128) NOT NULL,
    "eventType" VARCHAR(120) NOT NULL,
    "eventVersion" INTEGER NOT NULL DEFAULT 1,
    "payload" JSONB NOT NULL,
    "status" "OutboxStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "availableAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lockedAt" TIMESTAMPTZ(3),
    "lockedBy" VARCHAR(128),
    "processedAt" TIMESTAMPTZ(3),
    "lastError" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OutboxEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IdempotencyRecord" (
    "id" UUID NOT NULL,
    "scope" VARCHAR(160) NOT NULL,
    "keyHash" VARCHAR(128) NOT NULL,
    "requestHash" VARCHAR(128) NOT NULL,
    "status" "IdempotencyStatus" NOT NULL DEFAULT 'PROCESSING',
    "responseStatus" INTEGER,
    "responseBody" JSONB,
    "resourceType" VARCHAR(80),
    "resourceId" VARCHAR(128),
    "expiresAt" TIMESTAMPTZ(3) NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "IdempotencyRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_status_createdAt_idx" ON "User"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionHash_key" ON "Session"("sessionHash");

-- CreateIndex
CREATE INDEX "Session_userId_expiresAt_idx" ON "Session"("userId", "expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_tokenHash_key" ON "VerificationToken"("tokenHash");

-- CreateIndex
CREATE INDEX "VerificationToken_identifier_purpose_expiresAt_idx" ON "VerificationToken"("identifier", "purpose", "expiresAt");

-- CreateIndex
CREATE INDEX "Wedding_createdById_status_idx" ON "Wedding"("createdById", "status");

-- CreateIndex
CREATE INDEX "Wedding_status_primaryDate_idx" ON "Wedding"("status", "primaryDate");

-- CreateIndex
CREATE INDEX "WeddingMember_userId_status_idx" ON "WeddingMember"("userId", "status");

-- CreateIndex
CREATE INDEX "WeddingMember_weddingId_role_status_idx" ON "WeddingMember"("weddingId", "role", "status");

-- CreateIndex
CREATE UNIQUE INDEX "WeddingMember_weddingId_userId_key" ON "WeddingMember"("weddingId", "userId");

-- CreateIndex
CREATE INDEX "WeddingEvent_weddingId_startsAt_idx" ON "WeddingEvent"("weddingId", "startsAt");

-- CreateIndex
CREATE UNIQUE INDEX "WeddingContent_weddingId_key" ON "WeddingContent"("weddingId");

-- CreateIndex
CREATE UNIQUE INDEX "WeddingTheme_weddingId_surface_key" ON "WeddingTheme"("weddingId", "surface");

-- CreateIndex
CREATE UNIQUE INDEX "WeddingWebsite_weddingId_key" ON "WeddingWebsite"("weddingId");

-- CreateIndex
CREATE UNIQUE INDEX "InvitationDesign_weddingId_key" ON "InvitationDesign"("weddingId");

-- CreateIndex
CREATE UNIQUE INDEX "Template_key_key" ON "Template"("key");

-- CreateIndex
CREATE UNIQUE INDEX "TemplateVersion_templateId_version_key" ON "TemplateVersion"("templateId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "TemplateVersion_templateId_configHash_key" ON "TemplateVersion"("templateId", "configHash");

-- CreateIndex
CREATE INDEX "PublishedWeddingSnapshot_slug_surface_unpublishedAt_idx" ON "PublishedWeddingSnapshot"("slug", "surface", "unpublishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PublishedWeddingSnapshot_weddingId_surface_version_key" ON "PublishedWeddingSnapshot"("weddingId", "surface", "version");

-- CreateIndex
CREATE UNIQUE INDEX "MediaAsset_storageKey_key" ON "MediaAsset"("storageKey");

-- CreateIndex
CREATE INDEX "MediaAsset_weddingId_status_createdAt_idx" ON "MediaAsset"("weddingId", "status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "MediaVariant_storageKey_key" ON "MediaVariant"("storageKey");

-- CreateIndex
CREATE UNIQUE INDEX "MediaVariant_mediaAssetId_variantKey_key" ON "MediaVariant"("mediaAssetId", "variantKey");

-- CreateIndex
CREATE INDEX "GuestCategory_weddingId_parentId_sortOrder_idx" ON "GuestCategory"("weddingId", "parentId", "sortOrder");

-- CreateIndex
CREATE INDEX "GuestGroup_weddingId_name_idx" ON "GuestGroup"("weddingId", "name");

-- CreateIndex
CREATE INDEX "Guest_weddingId_groupId_idx" ON "Guest"("weddingId", "groupId");

-- CreateIndex
CREATE INDEX "Guest_weddingId_categoryId_idx" ON "Guest"("weddingId", "categoryId");

-- CreateIndex
CREATE INDEX "Guest_weddingId_displayName_idx" ON "Guest"("weddingId", "displayName");

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_tokenHash_key" ON "Invitation"("tokenHash");

-- CreateIndex
CREATE INDEX "Invitation_weddingId_status_idx" ON "Invitation"("weddingId", "status");

-- CreateIndex
CREATE INDEX "Invitation_guestId_idx" ON "Invitation"("guestId");

-- CreateIndex
CREATE UNIQUE INDEX "RsvpResponse_invitationId_key" ON "RsvpResponse"("invitationId");

-- CreateIndex
CREATE INDEX "RsvpResponse_weddingId_attendance_submittedAt_idx" ON "RsvpResponse"("weddingId", "attendance", "submittedAt");

-- CreateIndex
CREATE INDEX "RsvpEventSelection_weddingEventId_idx" ON "RsvpEventSelection"("weddingEventId");

-- CreateIndex
CREATE UNIQUE INDEX "RsvpEventSelection_rsvpResponseId_weddingEventId_key" ON "RsvpEventSelection"("rsvpResponseId", "weddingEventId");

-- CreateIndex
CREATE INDEX "RsvpCompanion_rsvpResponseId_sortOrder_idx" ON "RsvpCompanion"("rsvpResponseId", "sortOrder");

-- CreateIndex
CREATE INDEX "Wish_weddingId_status_submittedAt_idx" ON "Wish"("weddingId", "status", "submittedAt");

-- CreateIndex
CREATE UNIQUE INDEX "TaskChecklistTemplate_key_version_key" ON "TaskChecklistTemplate"("key", "version");

-- CreateIndex
CREATE INDEX "TaskChecklistItem_checklistTemplateId_sortOrder_idx" ON "TaskChecklistItem"("checklistTemplateId", "sortOrder");

-- CreateIndex
CREATE INDEX "WeddingTask_weddingId_status_dueAt_idx" ON "WeddingTask"("weddingId", "status", "dueAt");

-- CreateIndex
CREATE INDEX "WeddingTask_weddingId_assigneeMemberId_status_idx" ON "WeddingTask"("weddingId", "assigneeMemberId", "status");

-- CreateIndex
CREATE INDEX "GiftLedgerEntry_weddingId_guestId_idx" ON "GiftLedgerEntry"("weddingId", "guestId");

-- CreateIndex
CREATE INDEX "GiftLedgerEntry_weddingId_reciprocityStatus_receivedAt_idx" ON "GiftLedgerEntry"("weddingId", "reciprocityStatus", "receivedAt");

-- CreateIndex
CREATE UNIQUE INDEX "WeddingRecap_weddingId_key" ON "WeddingRecap"("weddingId");

-- CreateIndex
CREATE INDEX "RecapMediaItem_recapId_sortOrder_idx" ON "RecapMediaItem"("recapId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "RecapMediaItem_recapId_mediaAssetId_key" ON "RecapMediaItem"("recapId", "mediaAssetId");

-- CreateIndex
CREATE INDEX "RecapWishSelection_recapId_sortOrder_idx" ON "RecapWishSelection"("recapId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "RecapWishSelection_recapId_wishId_key" ON "RecapWishSelection"("recapId", "wishId");

-- CreateIndex
CREATE INDEX "PublishedRecapSnapshot_slug_unpublishedAt_idx" ON "PublishedRecapSnapshot"("slug", "unpublishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PublishedRecapSnapshot_recapId_version_key" ON "PublishedRecapSnapshot"("recapId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationPreference_userId_eventKey_channel_key" ON "NotificationPreference"("userId", "eventKey", "channel");

-- CreateIndex
CREATE INDEX "Notification_userId_status_createdAt_idx" ON "Notification"("userId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_weddingId_occurredAt_idx" ON "AuditLog"("weddingId", "occurredAt");

-- CreateIndex
CREATE INDEX "AuditLog_actorUserId_occurredAt_idx" ON "AuditLog"("actorUserId", "occurredAt");

-- CreateIndex
CREATE INDEX "AuditLog_resourceType_resourceId_occurredAt_idx" ON "AuditLog"("resourceType", "resourceId", "occurredAt");

-- CreateIndex
CREATE INDEX "OutboxEvent_status_availableAt_idx" ON "OutboxEvent"("status", "availableAt");

-- CreateIndex
CREATE INDEX "OutboxEvent_aggregateType_aggregateId_createdAt_idx" ON "OutboxEvent"("aggregateType", "aggregateId", "createdAt");

-- CreateIndex
CREATE INDEX "IdempotencyRecord_expiresAt_idx" ON "IdempotencyRecord"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "IdempotencyRecord_scope_keyHash_key" ON "IdempotencyRecord"("scope", "keyHash");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wedding" ADD CONSTRAINT "Wedding_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeddingMember" ADD CONSTRAINT "WeddingMember_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeddingMember" ADD CONSTRAINT "WeddingMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeddingEvent" ADD CONSTRAINT "WeddingEvent_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeddingContent" ADD CONSTRAINT "WeddingContent_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeddingTheme" ADD CONSTRAINT "WeddingTheme_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeddingWebsite" ADD CONSTRAINT "WeddingWebsite_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeddingWebsite" ADD CONSTRAINT "WeddingWebsite_templateVersionId_fkey" FOREIGN KEY ("templateVersionId") REFERENCES "TemplateVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvitationDesign" ADD CONSTRAINT "InvitationDesign_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvitationDesign" ADD CONSTRAINT "InvitationDesign_templateVersionId_fkey" FOREIGN KEY ("templateVersionId") REFERENCES "TemplateVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateVersion" ADD CONSTRAINT "TemplateVersion_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedWeddingSnapshot" ADD CONSTRAINT "PublishedWeddingSnapshot_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedWeddingSnapshot" ADD CONSTRAINT "PublishedWeddingSnapshot_templateVersionId_fkey" FOREIGN KEY ("templateVersionId") REFERENCES "TemplateVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaAsset" ADD CONSTRAINT "MediaAsset_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaVariant" ADD CONSTRAINT "MediaVariant_mediaAssetId_fkey" FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuestCategory" ADD CONSTRAINT "GuestCategory_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuestCategory" ADD CONSTRAINT "GuestCategory_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "GuestCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuestGroup" ADD CONSTRAINT "GuestGroup_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guest" ADD CONSTRAINT "Guest_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guest" ADD CONSTRAINT "Guest_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "GuestCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guest" ADD CONSTRAINT "Guest_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "GuestGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RsvpResponse" ADD CONSTRAINT "RsvpResponse_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RsvpResponse" ADD CONSTRAINT "RsvpResponse_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RsvpEventSelection" ADD CONSTRAINT "RsvpEventSelection_rsvpResponseId_fkey" FOREIGN KEY ("rsvpResponseId") REFERENCES "RsvpResponse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RsvpEventSelection" ADD CONSTRAINT "RsvpEventSelection_weddingEventId_fkey" FOREIGN KEY ("weddingEventId") REFERENCES "WeddingEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RsvpCompanion" ADD CONSTRAINT "RsvpCompanion_rsvpResponseId_fkey" FOREIGN KEY ("rsvpResponseId") REFERENCES "RsvpResponse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wish" ADD CONSTRAINT "Wish_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wish" ADD CONSTRAINT "Wish_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "Invitation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wish" ADD CONSTRAINT "Wish_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskChecklistItem" ADD CONSTRAINT "TaskChecklistItem_checklistTemplateId_fkey" FOREIGN KEY ("checklistTemplateId") REFERENCES "TaskChecklistTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeddingTask" ADD CONSTRAINT "WeddingTask_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeddingTask" ADD CONSTRAINT "WeddingTask_assigneeMemberId_fkey" FOREIGN KEY ("assigneeMemberId") REFERENCES "WeddingMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeddingTask" ADD CONSTRAINT "WeddingTask_completedById_fkey" FOREIGN KEY ("completedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiftLedgerEntry" ADD CONSTRAINT "GiftLedgerEntry_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiftLedgerEntry" ADD CONSTRAINT "GiftLedgerEntry_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeddingRecap" ADD CONSTRAINT "WeddingRecap_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeddingRecap" ADD CONSTRAINT "WeddingRecap_templateVersionId_fkey" FOREIGN KEY ("templateVersionId") REFERENCES "TemplateVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecapMediaItem" ADD CONSTRAINT "RecapMediaItem_recapId_fkey" FOREIGN KEY ("recapId") REFERENCES "WeddingRecap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecapMediaItem" ADD CONSTRAINT "RecapMediaItem_mediaAssetId_fkey" FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecapWishSelection" ADD CONSTRAINT "RecapWishSelection_recapId_fkey" FOREIGN KEY ("recapId") REFERENCES "WeddingRecap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecapWishSelection" ADD CONSTRAINT "RecapWishSelection_wishId_fkey" FOREIGN KEY ("wishId") REFERENCES "Wish"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedRecapSnapshot" ADD CONSTRAINT "PublishedRecapSnapshot_recapId_fkey" FOREIGN KEY ("recapId") REFERENCES "WeddingRecap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedRecapSnapshot" ADD CONSTRAINT "PublishedRecapSnapshot_templateVersionId_fkey" FOREIGN KEY ("templateVersionId") REFERENCES "TemplateVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationPreference" ADD CONSTRAINT "NotificationPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Domain checks not expressible in Prisma schema.
ALTER TABLE "User"
  ADD CONSTRAINT "User_email_lowercase_check" CHECK ("email" = lower("email"));

ALTER TABLE "Wedding"
  ADD CONSTRAINT "Wedding_slug_format_check" CHECK ("slug" IS NULL OR "slug" ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  ADD CONSTRAINT "Wedding_slug_length_check" CHECK ("slug" IS NULL OR char_length("slug") BETWEEN 3 AND 64),
  ADD CONSTRAINT "Wedding_revision_positive_check" CHECK ("revision" > 0);

CREATE UNIQUE INDEX "Wedding_active_slug_key"
  ON "Wedding" (lower("slug"))
  WHERE "slug" IS NOT NULL AND "deletedAt" IS NULL;

ALTER TABLE "WeddingEvent"
  ADD CONSTRAINT "WeddingEvent_time_range_check" CHECK ("endsAt" IS NULL OR "endsAt" >= "startsAt"),
  ADD CONSTRAINT "WeddingEvent_latitude_check" CHECK ("latitude" IS NULL OR "latitude" BETWEEN -90 AND 90),
  ADD CONSTRAINT "WeddingEvent_longitude_check" CHECK ("longitude" IS NULL OR "longitude" BETWEEN -180 AND 180);

ALTER TABLE "WeddingContent"
  ADD CONSTRAINT "WeddingContent_versions_positive_check" CHECK ("schemaVersion" > 0 AND "revision" > 0);

ALTER TABLE "WeddingTheme"
  ADD CONSTRAINT "WeddingTheme_versions_positive_check" CHECK ("configVersion" > 0 AND "revision" > 0);

ALTER TABLE "WeddingWebsite"
  ADD CONSTRAINT "WeddingWebsite_slug_format_check" CHECK ("slug" IS NULL OR (char_length("slug") BETWEEN 3 AND 64 AND "slug" ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')),
  ADD CONSTRAINT "WeddingWebsite_revision_positive_check" CHECK ("revision" > 0);

CREATE UNIQUE INDEX "WeddingWebsite_slug_key"
  ON "WeddingWebsite" (lower("slug"))
  WHERE "slug" IS NOT NULL;

ALTER TABLE "InvitationDesign"
  ADD CONSTRAINT "InvitationDesign_revision_positive_check" CHECK ("revision" > 0);

ALTER TABLE "TemplateVersion"
  ADD CONSTRAINT "TemplateVersion_contract_versions_positive_check"
    CHECK ("templateConfigVersion" > 0 AND "contentSchemaVersion" > 0 AND "rendererApiVersion" > 0);

ALTER TABLE "PublishedWeddingSnapshot"
  ADD CONSTRAINT "PublishedWeddingSnapshot_version_positive_check" CHECK ("version" > 0),
  ADD CONSTRAINT "PublishedWeddingSnapshot_slug_format_check" CHECK (char_length("slug") BETWEEN 3 AND 64 AND "slug" ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$');

CREATE UNIQUE INDEX "PublishedWeddingSnapshot_live_slug_key"
  ON "PublishedWeddingSnapshot" (lower("slug"), "surface")
  WHERE "unpublishedAt" IS NULL;

ALTER TABLE "MediaAsset"
  ADD CONSTRAINT "MediaAsset_size_check" CHECK ("sizeBytes" >= 0),
  ADD CONSTRAINT "MediaAsset_dimensions_check" CHECK (("width" IS NULL OR "width" > 0) AND ("height" IS NULL OR "height" > 0));

ALTER TABLE "MediaVariant"
  ADD CONSTRAINT "MediaVariant_size_check" CHECK ("sizeBytes" >= 0),
  ADD CONSTRAINT "MediaVariant_dimensions_check" CHECK (("width" IS NULL OR "width" > 0) AND ("height" IS NULL OR "height" > 0));

ALTER TABLE "GuestCategory"
  ADD CONSTRAINT "GuestCategory_depth_check" CHECK ("depth" BETWEEN 1 AND 3),
  ADD CONSTRAINT "GuestCategory_root_depth_check" CHECK (("parentId" IS NULL AND "depth" = 1) OR ("parentId" IS NOT NULL AND "depth" > 1));

ALTER TABLE "Guest"
  ADD CONSTRAINT "Guest_max_party_size_check" CHECK ("maxPartySize" >= 1);

ALTER TABLE "Invitation"
  ADD CONSTRAINT "Invitation_max_party_size_check" CHECK ("maxPartySize" >= 1),
  ADD CONSTRAINT "Invitation_revocation_check" CHECK ("status" <> 'REVOKED' OR "revokedAt" IS NOT NULL);

ALTER TABLE "RsvpResponse"
  ADD CONSTRAINT "RsvpResponse_party_size_check" CHECK ("partySize" >= 0),
  ADD CONSTRAINT "RsvpResponse_revision_positive_check" CHECK ("revision" > 0);

ALTER TABLE "WeddingTask"
  ADD CONSTRAINT "WeddingTask_revision_positive_check" CHECK ("revision" > 0),
  ADD CONSTRAINT "WeddingTask_completion_check" CHECK (("status" = 'DONE' AND "completedAt" IS NOT NULL) OR "status" <> 'DONE');

ALTER TABLE "GiftLedgerEntry"
  ADD CONSTRAINT "GiftLedgerEntry_money_check" CHECK (
    "giftType" <> 'MONEY' OR ("amountMinor" IS NOT NULL AND "amountMinor" >= 0 AND "currency" ~ '^[A-Z]{3}$')
  ),
  ADD CONSTRAINT "GiftLedgerEntry_gold_check" CHECK (
    "giftType" <> 'GOLD' OR ("goldWeight" IS NOT NULL AND "goldWeight" > 0 AND nullif(btrim("goldUnit"), '') IS NOT NULL AND nullif(btrim("goldType"), '') IS NOT NULL)
  ),
  ADD CONSTRAINT "GiftLedgerEntry_physical_gift_check" CHECK (
    "giftType" <> 'PHYSICAL_GIFT' OR nullif(btrim("giftDescription"), '') IS NOT NULL
  ),
  ADD CONSTRAINT "GiftLedgerEntry_returned_at_check" CHECK (
    "reciprocityStatus" <> 'RETURNED' OR "returnedAt" IS NOT NULL
  );

ALTER TABLE "WeddingRecap"
  ADD CONSTRAINT "WeddingRecap_slug_format_check" CHECK ("slug" IS NULL OR (char_length("slug") BETWEEN 3 AND 64 AND "slug" ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')),
  ADD CONSTRAINT "WeddingRecap_revision_positive_check" CHECK ("revision" > 0);

CREATE UNIQUE INDEX "WeddingRecap_active_slug_key"
  ON "WeddingRecap" (lower("slug"))
  WHERE "slug" IS NOT NULL AND "status" <> 'ARCHIVED';

ALTER TABLE "PublishedRecapSnapshot"
  ADD CONSTRAINT "PublishedRecapSnapshot_version_positive_check" CHECK ("version" > 0),
  ADD CONSTRAINT "PublishedRecapSnapshot_slug_format_check" CHECK (char_length("slug") BETWEEN 3 AND 64 AND "slug" ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$');

CREATE UNIQUE INDEX "PublishedRecapSnapshot_live_slug_key"
  ON "PublishedRecapSnapshot" (lower("slug"))
  WHERE "unpublishedAt" IS NULL;

ALTER TABLE "OutboxEvent"
  ADD CONSTRAINT "OutboxEvent_attempts_nonnegative_check" CHECK ("attempts" >= 0),
  ADD CONSTRAINT "OutboxEvent_version_positive_check" CHECK ("eventVersion" > 0);

ALTER TABLE "IdempotencyRecord"
  ADD CONSTRAINT "IdempotencyRecord_expiry_check" CHECK ("expiresAt" > "createdAt");
