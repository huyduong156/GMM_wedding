ALTER TABLE "RsvpResponse"
ADD COLUMN "anonymousGuestName" VARCHAR(160);

COMMENT ON COLUMN "RsvpResponse"."anonymousGuestName" IS 'Tên khách tự nhập khi RSVP qua link chung.';
