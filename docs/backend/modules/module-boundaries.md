# Backend module boundaries

## Quy tắc ownership

Mỗi module sở hữu business rules, application use cases và quyền ghi vào bảng của mình. Module khác không query/mutate bảng nội bộ trực tiếp; dùng public application API, read model được công bố hoặc event.

## Module catalog

| Module | Trách nhiệm | Dữ liệu sở hữu chính | Phụ thuộc được phép |
|---|---|---|---|
| `identity` | User, account, session, verification | User/Account/Session | platform email/audit |
| `weddings` | Wedding lifecycle, membership, event, canonical content | Wedding/Member/Event/Content/Theme | identity, audit |
| `templates` | Template registry, immutable versions, compatibility | Template/TemplateVersion | media, weddings contract |
| `publications` | Publish/unpublish, snapshot, public lookup | PublishedWeddingSnapshot | weddings, templates, media |
| `guests` | Guest/category/group/import/export | Guest/Category/Group | weddings |
| `invitations` | Invite identity/token/recipient scope | Invitation | guests, weddings |
| `rsvps` | Attendance response và event selection | RsvpResponse/Selection/Companion | invitations, wedding events |
| `wishes` | Submission, moderation, public selection | Wish | weddings/invitations |
| `media` | Upload lifecycle, variants, readiness | MediaAsset/Variant | weddings ownership policy |
| `tasks` | Wedding planning task/checklist | WeddingTask/ChecklistTemplate | weddings membership |
| `gift-ledger` | Private owner-only gift record | GiftLedgerEntry | weddings, optional guest reference |
| `recaps` | Recap draft/selection/publish lifecycle | WeddingRecap/selection/snapshot | weddings, media, wishes, templates |
| `notifications` | Preference và delivery intent | Notification/Preference | domain events, platform email |
| `audit` | Security/business audit trail | AuditLog | actor/resource references |
| `platform-admin` | Platform moderation/operations policy | admin-specific state | explicit module APIs only |

## Dependency constraints

- `weddings` là tenant aggregate root nhưng không được trở thành god module.
- `gift-ledger` không export read model cho analytics, search, notification hoặc platform admin.
- `publications` đọc canonical content qua contract và sinh DTO public; không expose draft ORM object.
- `recaps` tham chiếu media/wish hợp lệ nhưng sở hữu lifecycle publish riêng.
- `notifications` nhận event sau commit; failure không rollback transaction nghiệp vụ.
- Circular dependency phải được giải bằng event, shared value contract hoặc điều chỉnh ownership—không dùng dynamic import để che cycle.

## Public module API

Mỗi module chỉ export:

- Command/use case cần module khác gọi.
- Query/read model ổn định.
- Event type version hóa.
- Policy/type thật sự dùng chung.

Không export Prisma client/model, repository concrete, internal helper hoặc toàn bộ folder qua wildcard.

## Cross-module event naming

Dùng past tense và business meaning, ví dụ `WeddingPublishedV1`, `RsvpSubmittedV1`, `MediaReadyV1`. Event payload tối thiểu, không chứa secret/PII ngoài nhu cầu consumer đã review. Breaking payload tạo event version mới.

