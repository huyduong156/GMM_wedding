# GMM Wedding - Persistent Project Context

Đây là bối cảnh lâu dài cho agent. Khi quyết định quan trọng đổi, cập nhật tài liệu trong `docs/` và tệp này nếu phiên sau cần biết.

## Product

- SaaS tạo thiệp/web cưới online; user chọn template, nhập nội dung, publish slug, quản lý khách, RSVP và lời chúc.
- Khách không cần login; invite cá nhân dùng opaque token.
- Thị trường đầu tiên: Việt Nam/tiếng Việt, mobile-first.

## Layout và kiến trúc

- `frontend/`: React + Vite + TypeScript.
- `backend/`: Next.js + TypeScript API.
- `docs/`: source of truth; `assets/`: tài nguyên rõ nguồn/bản quyền.
- Modular monolith, hai app deploy độc lập; PostgreSQL + Prisma đề xuất.
- Hai app bắt buộc có Docker image độc lập và portable; root Compose dùng cho local/integration.
- Root `compose.yaml` hiện hỗ trợ build/chạy frontend tại cổng host 8080 (có thể đổi qua `FRONTEND_PORT`); các service integration khác sẽ được bổ sung khi backend được scaffold.
- Dockerfile multi-stage, runtime non-root/stateless; backend dùng Next.js standalone, frontend dùng static server image.
- Migration chạy one-off job; secret được inject lúc deploy, không bake vào image.
- Template là reviewed code/version bất biến; canonical content/theme; publish tạo immutable snapshot.
- Code template thiệp bắt đầu tại `frontend/src/templates/invitations/`; key kỹ thuật `modern-luxe` nay hiển thị là `Élan d’Amour` v1.1.0. Đây là thiệp mời tương tác mobile-first: bìa thiệp 5:7 chạm để mở, sau đó nội dung cô đọng gồm lời mời, thời gian, địa điểm và RSVP; không phải website cưới kể chuyện dài. Renderer có fixture nội bộ, partial data override và ba palette cố định. Public preview giữ route tương thích `/templates/invitations/modern-luxe/preview`.
- Template config là contract chung cho editor/validator/migration/renderer; `Template` tách immutable `TemplateVersion`, sync theo config hash không ghi đè version. Thiệp online và website cưới có template lifecycle riêng; xem ADR 0004.
- Format chuẩn cho mọi thiệp online nằm tại `docs/11-online-invitation-template-format.md`: popup mở đầu và banner sau mở phải có art direction riêng của template; nội dung theo thiệp giấy Việt Nam gồm câu báo hỷ, hai gia đình, vai vế cô dâu/chú rể, nghi lễ, tiệc và lời kính mời cá nhân hóa. Mọi template phải có khả năng hiển thị album, calendar, RSVP, Maps, lịch trình, sổ lưu bút, QR quà mừng và lời cảm ơn; user có thể bật/tắt các section được phép mà không phá bố cục. Motion/background/decoration có contract về concept, accessibility, reduced motion, performance và fallback. API tương tác vẫn chưa kết nối.
- `Verdant Promise` v1.0 là template thiệp thứ hai tại `frontend/src/templates/invitations/verdant-promise/`, route `/templates/invitations/verdant-promise/preview`. Art direction vườn kính dùng asset AI nguyên bản trong `public/assets/images/templates/verdant-promise/`, có card mở, lá rơi, frame thở, full section contract và reduced-motion fallback.
- `Mây Hồng Có Đôi` v1.0 là template chibi storybook tại `frontend/src/templates/invitations/chibi-daydream/`, route `/templates/invitations/chibi-daydream/preview`. Mẫu dùng ảnh cặp đôi/album AI nguyên bản và vật phẩm tái sử dụng từ `assets/icons/chibi`, có popup phong bì 3D, calendar, timeline, album, RSVP, map, guestbook, QR minh họa và reduced-motion fallback.
- Snapshot public không chứa PII khách. Auth dùng secure cookie; backend authorize theo wedding/resource.
- Invite token entropy cao/lưu hash; public RSVP/wish có chống spam/rate limit.
- Admin/editor dùng light-first modern compact UI; source of truth ở `design-system/MASTER.md` và `docs/09-admin-ui-ux.md`.
- Frontend có ba bề mặt riêng: `/login`, owner workspace `/studio/*` và platform admin `/gmm_admin/*`; URL admin ít phổ biến không thay thế server-side guards.
- Trang marketing công khai tại `/` dùng palette trắng/nâu đồng bộ logo; hero có ảnh nổi lệch pha và marquee nâu phấn. `HomeAmbient` chỉ dùng PNG vật phẩm cưới chân thật, không dùng icon thư viện; carousel 6 mẫu cover-flow 3D thay gallery template cũ, tự chuyển, pause khi tương tác. Guest experience có ảnh trang trí và mọi chuyển động có reduced-motion fallback.
- Platform admin có prototype đăng nhập riêng tại `/gmm_admin/login`, nằm ngoài admin shell; xác thực server, MFA, rate limit và route guard chưa kết nối. Kho thiệp và kho website admin đã chuyển sang catalog card có preview, version, trạng thái, usage, search/filter phía client.
- Dùng Inter cho operational UI và Phosphor icons; copper-amber accent tiết chế. Font cưới chỉ dùng preview/brand, không dùng bảng/form.
- Thư viện 11 font cưới self-host nằm tại `frontend/public/assets/fonts/`, khai báo trong `app/styles/fonts.css` và registry tại `shared/config/wedding-fonts.ts`. Mỗi template chọn 1 display + 1 body + tối đa 1 accent; Verdant Promise dùng Fraunces/Nunito Sans/Dancing Script còn Élan d’Amour dùng Cormorant Garamond/Be Vietnam Pro/Dancing Script. Tất cả có Vietnamese subset và SIL OFL; xem `docs/12-wedding-fonts.md`.
- Login desktop dùng ảnh thiệp cưới Pexels đã ghi nguồn tại `assets/ASSET_SOURCES.md`, crop và phủ overlay tối để bảo đảm chữ trắng dễ đọc và nội dung in trên thiệp không rõ.
- `WeddingAmbient` là lớp trang trí dùng chung cho owner workspace và login; login dùng biến thể contained với PNG AI trong suốt, hoa/cánh thiệp chuyển động nhẹ và luôn tắt theo `prefers-reduced-motion`.
- Platform admin sidebar chia nhóm và tối đa hai cấp: quản lý nền tảng (user, wedding, subscription), kho giao diện tách thiệp/website, danh mục phong cách tách thiệp/website, kiểm duyệt và vận hành.
- `/gmm_admin/users` có prototype mock responsive với search/filter, selection, bảng desktop và card mobile; API, guard, audit và mutation thật chưa kết nối.
- Todo là module cộng tác theo wedding; sổ tiền mừng là owner-only privacy boundary; Wedding Recap có draft/slug/immutable snapshot riêng và tái sử dụng media/wish/template registry. Xem ADR 0005.

## Working agreements

- Đọc `docs/README.md` và tài liệu liên quan trước thay đổi lớn.
- Mọi Google/web search dùng repo skill `.agents/skills/web-research-agent`: giao cho sub-agent chuyên research và chỉ đưa brief có nguồn về context chính; xem `docs/10-web-research-workflow.md`.
- Khi build admin page, đọc `design-system/MASTER.md` rồi kiểm tra override trong `design-system/pages/`.
- Owner Workspace foundation đã triển khai trong `frontend/`: React 18, Vite 6, app shell, dashboard mock, trang quản lý khách mời responsive và các module placeholder còn lại.
- Frontend source tuân theo Feature-Sliced Design (`app → pages/widgets → features → entities → shared`); xem ADR 0002.
- Admin visual direction là daylight wedding workspace: off-white canvas, translucent white surfaces 72-78%, graphite text và copper-amber accent hợp mệnh Kim/Thổ; ambient layer dùng phong thư, lông vũ, bồ công anh, bong bóng và cánh hoa chuyển động thưa, độ tương phản thấp trong gutter, kèm reduced-motion fallback.
- Frontend yêu cầu Node >=20; Docker pin Node 20 và dùng Nginx unprivileged runtime.
- Navigation dùng internal History API adapter theo `docs/adr/0001-frontend-navigation-history-api.md`; không thêm React Router lại nếu chưa rà security advisory.
- Route constants tập trung tại `frontend/src/shared/config/routes.ts`. Owner URL không chứa wedding ID; workspace switcher giữ wedding hiện hành, còn API vẫn authorize resource theo ID. URL `/app/weddings/:weddingId/*` cũ được chuyển hướng tương thích.
- Production `npm audit --omit=dev` hiện sạch. Dev audit còn advisory DoS transitive trong ESLint/minimatch; không dùng `npm audit fix --force` vì đề xuất downgrade sai.
- Dashboard, Guests, Guest Categories, RSVP, Wishes và Templates dùng mock data. Guests đã có search theo tên, lọc xác nhận tham dự/nhóm, selection/bulk actions phía client, bảng compact 50 dòng/trang trên desktop và card list trên mobile; contact/email không hiển thị trong primary directory. RSVP đã có summary, search, lọc trạng thái/sự kiện, table desktop và card mobile. Wishes đã có tabs/count, tìm kiếm, duyệt, ẩn, ghim, khôi phục và feedback. Templates có gallery 6 theme, lọc, preview và chọn theme; API, import wizard, detail sheet, server pagination và editor chi tiết chưa kết nối; editor/analytics/settings vẫn là route placeholder.
- Owner navigation phân biệt `Thiệp online` (nhiều lời mời/slug cá nhân hóa) và `Website cưới` (một website chung cho mỗi wedding).
- Owner navigation có Todolist `/studio/todos` và Sổ tiền mừng `/studio/gift-ledger`, cả hai đã có prototype responsive phía client. Wedding Recap nằm trong `Hiện diện online`, gồm `/studio/recap/themes` và `/studio/recap`; recap còn placeholder và chưa có API.
- `Danh mục khách mời` là child-nav của `Khách mời`, route `/studio/guests/categories`; prototype dùng cây self-reference tối đa 3 cấp và mock data. Domain bổ sung `GuestCategory`, tách khỏi group/tag hiện có.
- Giữ FE/BE tách riêng nếu chưa có quyết định mới.
- API/data/architecture change cập nhật docs/ADR cùng thay đổi.
- Không commit secret, `.env`, PII, DB dump hoặc asset không rõ quyền.
- Không tự mở rộng MVP sang drag-drop, billing/custom domain/marketplace.
- Khi scaffold source: `.env.example`, strict TypeScript, lint/typecheck/test/build, multi-stage Dockerfile, `.dockerignore`, Compose và CI image smoke test từ đầu.
