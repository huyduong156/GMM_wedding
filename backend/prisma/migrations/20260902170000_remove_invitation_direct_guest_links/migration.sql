-- DropForeignKey
ALTER TABLE "Invitation" DROP CONSTRAINT "Invitation_guestId_fkey";
ALTER TABLE "Invitation" DROP CONSTRAINT "Invitation_weddingId_fkey";
ALTER TABLE "RsvpResponse" DROP CONSTRAINT "RsvpResponse_invitationId_fkey";
ALTER TABLE "Wish" DROP CONSTRAINT "Wish_invitationId_fkey";
DROP INDEX "RsvpResponse_invitationId_key";
ALTER TABLE "Guest" ADD COLUMN "slug" VARCHAR(80) NOT NULL;
ALTER TABLE "RsvpResponse" DROP COLUMN "invitationId", ADD COLUMN "guestId" UUID;
ALTER TABLE "Wish" DROP COLUMN "invitationId";
DROP TABLE "Invitation";
DROP TYPE "InvitationStatus";
CREATE UNIQUE INDEX "Guest_weddingId_slug_key" ON "Guest"("weddingId", "slug");
CREATE UNIQUE INDEX "RsvpResponse_weddingId_guestId_key" ON "RsvpResponse"("weddingId", "guestId");
ALTER TABLE "RsvpResponse" ADD CONSTRAINT "RsvpResponse_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE SET NULL ON UPDATE CASCADE;