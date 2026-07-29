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
│ Editor       │                                                      │
│ Guests       │                                                      │
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

### Template gallery

- Filter/search bên trái hoặc filter bar; grid 3-4 cột desktop, 2 tablet, 1 mobile.
- Card có thumbnail tỷ lệ cố định, tên/style/tags/premium; preview và `Dùng mẫu này` rõ ràng.
- Trước đổi template phải báo phần nào tương thích/không tương thích và cho preview trước khi commit.

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
- Platform admin có route namespace `/admin/*`, guard phía server và frontend; menu sinh theo permission nhưng backend vẫn là nguồn phân quyền cuối.

## 6. Route map đề xuất

```text
/app                                  wedding list / account overview
/app/weddings/:weddingId/overview
/app/weddings/:weddingId/editor
/app/weddings/:weddingId/templates
/app/weddings/:weddingId/guests
/app/weddings/:weddingId/rsvps
/app/weddings/:weddingId/wishes
/app/weddings/:weddingId/analytics
/app/weddings/:weddingId/settings/*
/admin
/admin/users
/admin/weddings
/admin/templates/*
/admin/moderation
/admin/plans
/admin/operations/*
/admin/audit-logs
```

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
