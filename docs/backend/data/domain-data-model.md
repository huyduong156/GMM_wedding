# Domain data model

Tài liệu này mô tả entity và invariant nghiệp vụ. Quy tắc vật lý PostgreSQL, index review, expand-contract migration, seed và recovery xem [database and migrations](./database-and-migrations.md).

Danh sách trường, kiểu dữ liệu và quan hệ đã triển khai xem [database schema reference](./database-schema-reference.md).

## Nguyên tắc

- PostgreSQL; UUID/ULID không tuần tự cho ID public.
- Lưu UTC, có `createdAt`, `updatedAt`; entity quan trọng xóa mềm bằng `deletedAt`.
- JSONB chỉ cho content/theme/template config linh hoạt; identity, quyền, guest và RSVP được chuẩn hóa.
- Unique/check/foreign key và transaction đặt ở database, không chỉ UI.

## Entity chính

- `User`, `Account`, `Session`, `VerificationToken`.
- `Wedding`, `WeddingMember(role)`, `WeddingEvent`, `WeddingContent`.
- `Template`, immutable `TemplateVersion`, `PublishedWeddingSnapshot`.
- `MediaAsset`, `MediaVariant`.
- `MusicTrack` catalog dùng chung, tham chiếu audio asset và metadata quyền sử dụng.
- `GuestCategory`, `GuestGroup`, `Guest`, `Invitation`, `RsvpResponse`, `RsvpEventSelection`, `RsvpCompanion`.
- `Wish`, `Notification`, `NotificationPreference`, `AuditLog`.
- `WeddingTask`, `TaskChecklistTemplate`, `TaskChecklistItem`.
- `GiftLedgerEntry`, `RecapWishSelection`, `RecapMediaItem`, `PublishedRecapSnapshot`.
- Post-MVP: `Plan`, `Subscription`, `Entitlement`, `Payment`, `WebhookEvent`, `Coupon`.

```text
User --< WeddingMember >-- Wedding --< WeddingEvent
                               |-- Content/Theme
                               |--< PublishedSnapshot >-- TemplateVersion
                               |--< MediaAsset
                               |--< GuestCategory --< Guest
                               |--< GuestCategory --< Guest
                               |--< GuestCategory --< Guest
                               |--< GuestGroup --< Guest --< Invitation -- RsvpResponse
                               |--< WeddingTask
                               |--< GiftLedgerEntry >-- Guest?
                               |-- WeddingContent(RECAP) --< PublishedRecapSnapshot
                               `--< Wish --< RecapWishSelection
```

## Index/ràng buộc quan trọng

- Unique lowercase `User.email` và lowercase active `Wedding.slug`; slug này là URL duy nhất của mọi surface.
- Unique `(weddingId, userId)` cho member.
- `Invitation.tokenHash` unique; tuyệt đối không lưu token raw.
- Index guest theo `(weddingId, groupId)`; RSVP theo `(weddingId, attendance, submittedAt)`; wish theo moderation status.
- `GuestCategory` self-reference qua `parentId`, thuộc đúng một wedding và có `depth` từ 1 đến 3. Parent phải cùng wedding, depth của child bằng parent + 1; không cho tạo chu kỳ hoặc cấp 4. Guest có thể gắn một category chính trong MVP.
- Unique `(weddingId, version)` cho published snapshot.
- Slug 3-64 ký tự, lowercase chữ/số/gạch nối, chặn reserved words.
- `partySize >= 0` và không vượt `maxPartySize` trừ owner override.
- Publish chỉ khi slug/template/schema/media đều hợp lệ.
- Unique `(templateId, version)` cho `TemplateVersion`; version đã phát hành không được ghi đè. Lưu `configHash`, `templateConfigVersion`, `contentSchemaVersion`, `rendererApiVersion` và code revision để sync/audit.
- `WeddingContent` lưu template-owned content, theme/section config, template selection và publication lifecycle theo surface. Các surface không dùng chung payload.
- Cấu hình nhạc theo surface lưu `musicTrackId | null`, `enabled`, `autoplayRequested`; `MusicTrack` phải `ACTIVE` và audio asset `READY` tại lần publish. Bytes/URL ký không nằm trong JSON canonical.
- Revoke/rotate invitation làm token cũ vô hiệu ngay.
- Xóa wedding thu hồi public access ngay; hard delete theo retention job.

### Task

- `WeddingTask`: `weddingId`, `eventId?`, `parentTaskId?`, `title`, `description?`, `dueAt?`, `priority(low|medium|high|urgent)`, `status(todo|inProgress|done|cancelled)`, `assigneeMemberId?`, `sortOrder`, `completedAt?`, `completedBy?`, `revision`.
- `eventId` tham chiếu `WeddingEvent` cùng wedding và có thể null cho task chung. `parentTaskId` chỉ cho phép một cấp task con; task con không thể làm parent tiếp. Assignee/member giữ trong schema để mở rộng sau nhưng chưa expose ở MVP. Index `(weddingId, status, dueAt)`, `(weddingId, eventId, status)` và `(weddingId, parentTaskId, status)`.
- `TaskChecklistTemplate` có version/status và item có relative due-day offset. Áp dụng template sẽ tạo task trong một transaction; source template/version chỉ dùng audit.

### Gift ledger

- `GiftLedgerEntry`: `weddingId`, `guestId?`, `guestDisplayNameSnapshot`, `giftType(money|gold|physicalGift)`, `amountMinor?`, `currency?`, `goldWeight?`, `goldUnit?`, `goldType?`, `giftDescription?`, `receiveMethod(cash|bankTransfer|physicalGift|other)`, `receivedAt`, `note?`, `reciprocityStatus(pending|returned|notApplicable)`, `returnedAt?`, `revision`, timestamps và soft-delete. Có thể nhập bằng tên trước rồi promote/link/unlink Guest sau; Guest không sở hữu vòng đời ledger.
- Money cần `amountMinor >= 0` và ISO currency; gold cần trọng lượng dương + unit/type; physical gift cần description. Không dùng floating point cho tiền, còn trọng lượng vàng dùng decimal có precision cố định.
- Index `(weddingId, guestId)` và `(weddingId, reciprocityStatus, receivedAt)`. Guest soft-delete/anonymize không cascade xóa ledger.

### Surface-scoped template content

- `WeddingContent` is one draft payload per `(weddingId, surface)`, not one universal content schema per wedding.
- Supported surfaces are `ONLINE_INVITATION`, `WEDDING_WEBSITE` and `RECAP`.
- Each row stores the selected `templateVersionId`, `schemaVersion`, template-owned `content` JSON and its own optimistic-concurrency `revision`.
- `WeddingContent` stores presentation and section configuration in the same surface row.
- The `RECAP` `WeddingContent` row is the recap lifecycle/selection aggregate; it stores template content, metadata and publication state.

The older description of `WeddingContent` as a single canonical wedding payload is superseded by this surface-scoped model. There is no separate `WeddingRecap`, `InvitationDesign`, `WeddingWebsite` or `WeddingTheme` source-of-truth table.

### Recap

The recap aggregate is represented by `WeddingContent` with `surface = RECAP`.
Recap media, wishes and snapshots reference the RECAP content row directly.

- `WeddingContent(surface=RECAP)` stores the recap template payload and lifecycle status; template-specific fields such as thank-you and SEO values live inside `content` JSON, not dedicated columns.
- `RecapMediaItem` references `WeddingContent.id` and `MediaAsset ready`; `RecapWishSelection` references `WeddingContent.id` and only selects approved wishes.
- `PublishedRecapSnapshot` references the RECAP content row and stores immutable payload/hash/template version without guest/contact metadata.
