# Giao diện quản trị và editor

## 1. Phạm vi và phân biệt vai trò

Frontend quản trị có hai lớp trải nghiệm trong cùng React app:

1. **Owner workspace:** dành cho cặp đôi/cộng tác viên quản lý wedding, nội dung, khách, RSVP, lời chúc và chia sẻ.
2. **Platform admin:** dành cho đội vận hành GMM Wedding quản lý toàn hệ thống, template, user, report và cấu hình.

Hai lớp dùng chung design system nhưng menu/quyền tách biệt. Không hiển thị platform admin navigation cho user thường.

## 2. Art direction

- Light-first, hiện đại, gọn, giảm mỏi mắt và ưu tiên dữ liệu/thao tác.
- Nền canvas trắng ngà, surface trắng phân tầng bằng border và shadow ấm rất nhẹ; copper-amber là accent chủ đạo. Bảng màu phối hợp mệnh Kim (trắng, ivory) và mệnh Thổ (copper, warm stone).
- Canvas được phép có ambient motion wedding opacity thấp trong gutter: quầng nắng, dải lụa, cánh hoa, hạt sáng và sao băng thưa. Layer luôn nằm sau surface, không bắt pointer event và tắt khi `prefers-reduced-motion`.
- UI dùng Inter; font cưới chỉ xuất hiện trong preview/template, không dùng cho bảng/form.
- Mật độ desktop cao nhưng control touch trên mobile vẫn tối thiểu 44px.
- Glass/blur chỉ ở modal/sheet; không phủ glassmorphism toàn dashboard.
- Xem token và component contract tại [`../design-system/MASTER.md`](../design-system/MASTER.md).

## 3. App shell

```text
┌──────────────┬──────────────────────────────────────────────────────┐
│ Brand        │ Top bar: wedding context | search | alerts | user   │
│ Wedding      ├──────────────────────────────────────────────────────┤
│ switcher     │ Breadcrumb + page title              Primary action │
│              │                                                      │
│ Overview     │ Page content                                         │
│ Online invites│                                                     │
│   Gallery     │                                                      │
│   Your invites│                                                     │
│ Wedding site │                                                      │
│   Gallery     │                                                      │
│   Your website│                                                     │
│ Guests       │                                                      │
│   Categories │                                                      │
│ RSVP         │                                                      │
│ Wishes       │                                                      │
│ Analytics    │                                                      │
│ Settings     │                                                      │
└──────────────┴──────────────────────────────────────────────────────┘
```

- Sidebar 248px expanded, 72px collapsed; collapse preference persisted.
- Top bar 56px sticky. Sidebar sticky independently nhưng tránh nested content scrolling.
- Wedding switcher nằm đầu sidebar; trạng thái `Draft/Published` hiển thị kèm text, không chỉ màu.
- Global command menu `Ctrl/Cmd + K`: chuyển wedding, tìm khách, mở page/action.
- Breadcrumb dùng khi sâu từ ba cấp; mọi trang có URL/deep link và giữ filter khi back.
- Dưới 1024px sidebar thành drawer; mobile dùng top bar + contextual navigation, không nhồi bottom nav cho toàn bộ admin.

## 4. Information architecture của owner workspace

### Tổng quan

- Onboarding checklist nếu wedding chưa publish.
- KPI: tổng khách, đã phản hồi, tham dự, chưa phản hồi.
- RSVP trend line khi đủ dữ liệu; bar theo sự kiện/nhóm; luôn có số và table fallback.
- Recent activity, RSVP/lời chúc mới và các việc cần xử lý.
- CTA thay đổi theo trạng thái: hoàn thiện -> preview -> publish -> share.

### Thiết kế thiệp

- Navigation tách hai khái niệm: **Thiệp online** quản lý nhiều lời mời/slug cá nhân hóa; **Website cưới** là một website chung cho mỗi wedding để kể chuyện, album, lịch trình và thông tin công khai.
- Thiệp online có thể tạo nhiều biến thể theo khách/nhóm khách nhưng dùng chung nội dung và nhận diện cốt lõi; dữ liệu khách không được đưa vào published snapshot công khai.
- Website cưới có tối đa một cấu hình đang hoạt động cho mỗi wedding trong MVP; slug công khai và trạng thái publish được quản lý độc lập với invite token.
- Cả `Thiệp online` và `Website cưới` là navigation heading, mỗi heading có hai child-nav: `Kho giao diện` và tài sản của user (`Thiệp của bạn` hoặc `Website của bạn`). Hai gallery dùng route riêng để sau này có thể tách loại template và entitlement.

- Ba vùng desktop: section navigator 240px, canvas preview co giãn, property panel 320-360px.
- Toolbar: device preview, undo/redo, save state, preview, publish.
- Section editor theo schema/form; drag reorder có nút move keyboard-accessible thay thế.
- Autosave debounce, trạng thái `Đang lưu/Đã lưu/Mất kết nối/Xung đột`; không dùng toast cho mỗi autosave.
- Unsaved/conflict flow có recover/compare/reload rõ ràng.
- Tablet/mobile chuyển property panel thành sheet; editor không cố nhồi cả ba cột.

### Khách mời

- Data table: checkbox, tên/tag, nhóm, số người, invite và xác nhận tham dự. Contact/email, bàn và updated không nằm ở primary table.
- Toolbar: search deferred; lọc theo xác nhận tham dự, nhóm và tag; saved view, column visibility, import/export và `Thêm khách`. Tag dùng cho phân nhóm chi tiết như công ty hiện tại/cũ, họ nội/ngoại hoặc nhóm bạn.
- Bulk action bar chỉ hiện khi selection: gán nhóm, tạo link, export, xóa/lưu trữ.
- Row click mở detail side sheet; action phụ vào overflow menu nhưng vẫn keyboard-accessible.
- Import CSV là wizard: upload -> map cột -> validate/preview lỗi -> commit -> report.
- Mobile dùng prioritized columns/card rows, không co bảng desktop đến mức không đọc được.
- `Danh mục khách mời` là child-nav của `Khách mời`, có route riêng và dùng cây tối đa 3 cấp. Mỗi row hiển thị tên, cấp, tổng khách và thao tác thêm cấp con; cấp 3 hiển thị rõ là cấp cuối.

Trạng thái triển khai frontend (2026-07): route `/app/weddings/:weddingId/guests` đã có prototype responsive theo `design-system/pages/admin-guests.md`. Search deferred theo tên, lọc xác nhận tham dự/nhóm, selection và bulk action chạy phía client; desktop dùng semantic table compact với sticky header và mặc định 50 dòng/trang, dưới 768px chuyển sang card. Import wizard, detail side sheet, saved views và kết nối API/pagination thật chưa nằm trong prototype này.

### RSVP

- Summary + filter theo trạng thái/sự kiện/nhóm/ngày phản hồi.
- Table hiển thị party size, event selections, note/request và source.
- Owner có thể sửa thay nhưng phải hiển thị audit label `Đã chỉnh bởi...`.
- Export giữ đúng filter hiện tại; cập nhật optimistic chỉ khi rollback an toàn.

### Lời chúc

- Tabs/count: Chờ duyệt, Đã duyệt, Spam/Đã ẩn.
- List/card compact với full text expansion; approve/reject/pin và bulk moderation.
- Focus vào item kế tiếp sau thao tác keyboard; hỗ trợ undo cho hide/reject.

Trạng thái triển khai frontend (2026-07): route `/app/weddings/:weddingId/wishes` đã có prototype responsive với tabs/count, tìm kiếm, duyệt, ẩn, ghim, khôi phục và live feedback. Dữ liệu vẫn là mock; bulk moderation, undo thật và kết nối API chưa được triển khai.

### Chuẩn bị và sau ngày cưới

- `Todolist`: list/board theo status; deadline, priority và assignee luôn có text. Checklist mẫu là action khởi tạo, không làm thay đổi task user đã sửa.
- `Sổ tiền mừng`: surface riêng có privacy notice; chỉ owner thấy menu/route nhưng backend owner-only guard mới là lớp bảo vệ chính.
- `Wedding Recap`: editor tập trung album, lời chúc được chọn và lời cảm ơn; toolbar tách preview/publish/share, hiển thị rõ draft khác bản public.
- `/studio/todos` và `/studio/gift-ledger` đã có prototype responsive phía client. Sổ tiền mừng mặc định che tổng tiền, có privacy notice, search/filter, bảng/card và form thêm nhanh. Recap editor/gallery vẫn là placeholder; chưa kết nối API.

### Template gallery

- Filter/search bên trái hoặc filter bar; grid 3-4 cột desktop, 2 tablet, 1 mobile.
- Card có thumbnail tỷ lệ cố định, tên/style/tags/premium; preview và `Dùng mẫu này` rõ ràng.
- Trước đổi template phải báo phần nào tương thích/không tương thích và cho preview trước khi commit.

Trạng thái triển khai frontend (2026-07): route `/app/weddings/:weddingId/templates` đã có gallery responsive với 6 theme mock, tìm kiếm, lọc phong cách, preview lớn, chọn theme và đánh dấu theme đang dùng. Renderer/editor chi tiết, kiểm tra schema compatibility và kết nối API chưa được triển khai.

### Settings

- Nhóm: General, URL & privacy, Members & roles, Notifications, Data export/delete.
- Dangerous zone tách cuối trang; slug change/privacy/delete có impact copy và xác nhận phù hợp.
- Billing/custom domain chỉ xuất hiện khi feature được bật/entitlement cho phép.

## 5. Platform admin IA

- **System overview:** active users/weddings, publish/RSVP/error trends, queue/provider health.
- **Users:** search/filter/status, detail drawer, suspend/restore, audit. Impersonation nếu có phải có lý do, banner và log.
- **Weddings:** status/privacy/template/owner, report flags; không lộ PII rộng mặc định.
- **Templates:** draft/review/published/deprecated, version history, schema compatibility, preview/publish/rollback.
- **Moderation:** reports/wishes/media queue, evidence, decision/reason and audit trail.
- **Plans & entitlements:** feature/quota matrix; payment/webhook khi module billing tồn tại.
- **Operations:** jobs/webhooks/provider status/feature flags/audit logs; secret value không hiển thị.
- Platform admin có route namespace `/gmm_admin/*`, guard phía server và frontend; menu sinh theo permission nhưng backend vẫn là nguồn phân quyền cuối. Tên route không phải một lớp bảo mật.

Trạng thái triển khai frontend (2026-07): `/gmm_admin/users` có prototype mock responsive với summary, tìm theo tên/email, lọc trạng thái, selection/bulk-state, bảng desktop và card mobile. Detail drawer, mutation suspend/restore, permission guard, audit trail và server pagination chưa kết nối backend.

`/gmm_admin/login` là bề mặt đăng nhập quản trị tách khỏi admin shell, có form và thông báo phạm vi truy cập nội bộ. Đây mới là prototype điều hướng; session cookie, rate limit, MFA, server-side guard và audit đăng nhập phải được backend triển khai trước production. Hai kho `/gmm_admin/library/invites` và `/gmm_admin/library/websites` dùng catalog card có visual preview, trạng thái, version, lượt sử dụng, tìm kiếm và bộ lọc client-side; thao tác tạo/xem trước/quản lý chưa kết nối API.

Template thiệp code đầu tiên có key kỹ thuật `modern-luxe`, tên hiển thị `Élan d’Amour` và public preview tại `/templates/invitations/modern-luxe/preview`. Renderer dùng fixture mặc định khi thiếu dữ liệu; prop data được merge đè lên fixture khi render nội dung đã lưu. Template giới hạn ba palette đã duyệt (`champagne`, `midnight`, `sage`). Modal catalog phải hiển thị đúng tấm thiệp tỷ lệ 5:7, toàn bộ thiệp là vùng bấm mở preview; Escape/backdrop đóng modal và scroll nền bị khóa.

`Élan d’Amour` định nghĩa đúng bề mặt thiệp online: trạng thái bìa thiệp/chạm mở là nghi thức nhận lời mời, sau đó là một canvas thiệp dọc cô đọng gồm lời mời, thời gian, địa điểm và RSVP. Thiệp online không dùng cấu trúc landing dài gồm câu chuyện, gallery và nhiều section như website cưới. Thanh palette thuộc preview shell và nằm ngoài canvas thiệp.

`/gmm_admin/login` là bề mặt đăng nhập quản trị tách khỏi admin shell, có form và thông báo phạm vi truy cập nội bộ. Đây mới là prototype điều hướng; session cookie, rate limit, MFA, server-side guard và audit đăng nhập phải được backend triển khai trước production. Hai kho `/gmm_admin/library/invites` và `/gmm_admin/library/websites` dùng catalog card có visual preview, trạng thái, version, lượt sử dụng, tìm kiếm và bộ lọc client-side; thao tác tạo/xem trước/quản lý chưa kết nối API.

## 6. Route map đề xuất

```text
/login                                đăng nhập owner/editor
/gmm_admin/login                      đăng nhập platform admin
/gmm_admin/login                      đăng nhập platform admin
/studio                               tổng quan wedding đang chọn
/studio/invites                       thiệp của bạn
/studio/invites/themes                kho giao diện thiệp
/studio/site                          website của bạn
/studio/site/themes                   kho giao diện website
/studio/guests
/studio/guests/categories
/studio/rsvps
/studio/wishes
/studio/todos
/studio/gift-ledger
/studio/recap
/studio/recap/themes
/studio/analytics
/studio/settings
/gmm_admin
/gmm_admin/users
/gmm_admin/weddings
/gmm_admin/subscriptions
/gmm_admin/library/invites
/gmm_admin/library/websites
/gmm_admin/styles/invites
/gmm_admin/styles/websites
/gmm_admin/moderation
/gmm_admin/operations
```

Owner URL không chứa wedding ID vì wedding hiện hành được chọn trong workspace switcher và lưu trong session/context. API vẫn phải nhận/authorize wedding ID rõ ràng; URL cũ `/app/weddings/:weddingId/*` được frontend chuyển hướng tương thích sang `/studio/*` trong giai đoạn chuyển đổi.

## 7. Interaction standards

- Chỉ một primary CTA/screen. Destructive action tách khỏi normal action.
- Validate form on blur; lỗi gần field, error summary/focus first invalid khi có nhiều lỗi.
- Button async disabled + progress; thao tác thành công có feedback 3-5 giây, toast dùng `aria-live="polite"`.
- Delete/irreversible có confirm; bulk/delete có undo nếu backend còn giữ soft-delete.
- Loading trên 300ms dùng skeleton giữ đúng kích thước; empty/error/no-result đều có action phục hồi.
- Search/filter dùng debounce/`useDeferredValue`; danh sách lớn có server pagination/virtualization khi cần.
- Hover không phải cách duy nhất để khám phá action; focus visible trên toàn bộ UI.

## 8. Data visualization

- Line: xu hướng RSVP/views theo thời gian, chỉ khi >=4 điểm và tối đa khoảng 6 series.
- Horizontal/grouped bar: so sánh event/group/template; sort và show value label.
- Bullet/progress: KPI so với mục tiêu rõ ràng; không dùng gauge khi có nhiều KPI.
- Donut chỉ cho 2-5 phần và luôn kèm legend + values; không dùng làm biểu diễn RSVP duy nhất.
- Charts dùng accessible palette, pattern/line style và text summary; keyboard tooltip, data table/CSV fallback.

## 9. Responsive breakpoints

- 375-767: single column, drawer navigation, filter/action sheet, card/prioritized table.
- 768-1023: compact sidebar drawer, two-column content khi phù hợp.
- 1024-1439: sidebar/canvas/property layout chuẩn.
- >=1440: content max-width theo screen; data table/editor tận dụng rộng có kiểm soát.

Kiểm tra tối thiểu 375, 768, 1024 và 1440px; landscape và browser zoom 200% không làm mất chức năng.

## 10. Implementation mapping

- Source frontend tuân theo Feature-Sliced Design theo thứ tự phụ thuộc `app → pages/widgets/features/entities/shared`; layer thấp không import layer cao hơn.
- Mỗi slice chia theo segment cần thiết như `ui`, `model`, `api`, `lib`; không tạo segment rỗng chỉ để đủ cấu trúc.
- Typed navigation adapter/route composition cho owner workspace; mọi navigation đi qua abstraction để có thể thay router mà không sửa component UI.
- TanStack Query cho server tables/cache/invalidation; URL là nguồn filter/sort/pagination.
- React Hook Form + Zod cho form; Zustand chỉ cho transient editor state.
- TanStack Table cho data tables; Recharts/Chart.js chỉ khi chart thực sự cần.
- Tailwind + Radix/shadcn-style accessible primitives; Phosphor Icons thống nhất.
- Route-level code splitting; profile trước khi memoize; virtualize table/list lớn.

## 11. Acceptance checklist

- User thường không thể thấy/truy cập platform admin route và API.
- Mọi nav/action có label hoặc accessible name; keyboard hoàn thành được core workflows.
- Light-theme contrast đạt AA; selected/error/success không phụ thuộc màu đơn thuần.
- Loading/empty/error/offline/permission states có thiết kế.
- Bulk action, import CSV, editor autosave/conflict và destructive confirmation có prototype/test.
- Mobile không có horizontal page scroll; bảng có chiến lược riêng.
- Reduced motion, focus restore, modal/sheet escape và back-state preservation hoạt động.
