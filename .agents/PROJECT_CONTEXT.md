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
- Backend Compose có Adminer dev-only trong profile `tools`, bind localhost port 8081; không deploy database admin UI lên production.
- Backend đã có Prisma MVP schema và migration `20260804085209_init_mvp_schema` cho identity, wedding/template/publication, media, guest/invite/RSVP/wish, task, gift ledger, recap, notification/audit/outbox/idempotency; data dictionary ở `docs/backend/data/database-schema-reference.md` và seed local idempotent ở `backend/prisma/seed.mjs`.
- Backend base foundation có actor context, opaque token primitive và session cookie/TTL policy tại `backend/src/platform/auth/`; auth workflow/runbook ở `docs/backend/contracts/authentication-workflows.md`. Auth routes/password-email-CSRF adapters vẫn intentionally planned và là vertical slice kế tiếp.
- Template là reviewed code/version bất biến; canonical content/theme; publish tạo immutable snapshot.
- Code template thiệp bắt đầu tại `frontend/src/templates/invitations/`; key kỹ thuật `modern-luxe` nay hiển thị là `Élan d’Amour` v2.3.0. Art direction “couture champagne salon” dùng 2.5D ở opening/hero, invitation card mobile với tên được tiết chế, artwork couture tạo riêng, floating-memory polaroids, date diptych, love-journey marquee và floating photo deck. `ml-families` nay là focal section bắt buộc; calendar couture tháng 12 đi cùng countdown realtime đủ ngày–giờ–phút–giây. Reduced motion giữ ảnh trang trí tĩnh, dừng marquee và dùng horizontal scroll-snap; timer vẫn chạy chính xác. Public preview giữ route tương thích `/templates/invitations/modern-luxe/preview`.
- Template config là contract chung cho editor/validator/migration/renderer; `Template` tách immutable `TemplateVersion`, sync theo config hash không ghi đè version. Thiệp online và website cưới có template lifecycle riêng; xem ADR 0004.
- `docs/` chia theo ownership: `docs/frontend/` cho React/Vite, UI/template/motion; `docs/backend/` cho API/data/security/operations; `docs/shared/` cho product, end-to-end flow, system architecture, engineering rules và ADR mà cả hai app cùng dùng. Nếu một thay đổi buộc FE và BE cùng hiểu contract thì source of truth đặt ở `shared/`, không nhân bản nội dung.
- Giữ nhánh FE-only và BE-only cô lập để giảm merge conflict: FE-only không sửa `backend/` hoặc `docs/backend/`; BE-only không sửa `frontend/`, `docs/frontend/` hoặc `design-system/`. Cả hai chỉ sửa `docs/shared/` khi contract FE–BE, end-to-end flow hoặc quyết định kiến trúc thực sự thay đổi, với diff nhỏ và rõ phạm vi.
- Blueprint chuẩn cho mọi thiệp online nằm tại `docs/frontend/online-invitations/section-layout-catalog.md`: mỗi template mới phải đi qua toàn bộ section, chọn một layout option phù hợp cho từng section và ghi mobile/reduced-motion fallback. Popup mở đầu và banner sau mở phải có art direction riêng; nội dung theo thiệp giấy Việt Nam gồm câu báo hỷ, hai gia đình, vai vế cô dâu/chú rể, nghi lễ, tiệc và lời kính mời cá nhân hóa. Các section được phép phải bật/tắt mà không phá bố cục. API tương tác vẫn chưa kết nối.
- Tài liệu template thiệp được gom tại `docs/frontend/online-invitations/`; visual style catalog ở `visual-styles/`, motion catalog ở `motion/`, typography ở `typography-and-fonts.md`. 2.5D là lựa chọn theo art direction với mức none/light/medium/high, không bắt buộc cho mọi theme. Mỗi viewport chỉ có một depth focal point và mọi composition phải có mobile/reduced-motion fallback tĩnh hoàn chỉnh.
- Thư viện tham khảo hiệu ứng xuyên suốt thiệp online, website cưới và Wedding Recap nằm tại `docs/frontend/experience-effects-reference.md`. Art direction mặc định là ảnh editorial + typography tiết chế + một signature moment; mọi pattern phải có UX purpose, mobile/reduced-motion fallback và performance budget, không sao chép asset/source/visual identity từ website showcase.
- Studio shell lấy wedding đang chọn từ `frontend/src/entities/wedding/model/active-wedding.ts`; top bar hiển thị số ngày còn lại đến lễ cưới dưới tên owner và pill rút gọn trên mobile. Khi `weddingDate` chưa tồn tại, cả hai vị trí dùng fallback “Vui lòng nhập ngày cưới của bạn”. Dữ liệu hiện vẫn là fixture; API wedding context sẽ thay fixture mà không đổi contract hiển thị.
- `Verdant Promise` v1.3 là template thiệp thứ hai tại `frontend/src/templates/invitations/verdant-promise/`, route `/templates/invitations/verdant-promise/preview`. Art direction “khu vườn thức giấc” giữ Motion, Lenis desktop-only, tsParticles 30 FPS, botanical edge rail và reduced-motion fallback. `vp-families` nay là focal section bắt buộc dạng hai botanical family card, đủ cha mẹ, vai vế, cô dâu/chú rể, tư gia và quê quán. Date card được giữ và countdown chạy realtime đủ ngày–giờ–phút–giây.
- `Mây Hồng Có Đôi` v1.1 là template chibi storybook tại `frontend/src/templates/invitations/chibi-daydream/`, route `/templates/invitations/chibi-daydream/preview`. Family announcement là section bắt buộc với hai card, dấu trái tim kết duyên, vai vế và tư gia rõ ràng. Calendar giấy được giữ và có countdown realtime đủ ngày–giờ–phút–giây; popup, timeline, album, RSVP, map, guestbook, QR minh họa và reduced-motion fallback vẫn được hỗ trợ.
- Snapshot public không chứa PII khách. Auth dùng secure cookie; backend authorize theo wedding/resource.
- Invite token entropy cao/lưu hash; public RSVP/wish có chống spam/rate limit.
- Admin/editor dùng light-first modern compact UI; source of truth ở `design-system/MASTER.md` và `docs/frontend/admin-editor-ui-ux.md`.
- Frontend có ba bề mặt riêng: `/login`, owner workspace `/studio/*` và platform admin `/gmm_admin/*`; URL admin ít phổ biến không thay thế server-side guards.
- Nhánh FE auth đã nối opaque cookie session của backend: `/login` gọi `/api/auth/login`, `/gmm_admin/login` gọi `/api/auth/admin/login`, route `/studio/*` bootstrap qua `/api/me`, admin bootstrap qua `/api/admin/me`; thiếu/sai session redirect về đúng login surface và logout revoke session thật. `VITE_API_BASE_URL` local Docker mặc định `http://localhost:3000/api`; backend `APP_ORIGIN` phải khớp origin frontend.
- Trang marketing công khai tại `/` dùng palette trắng/nâu đồng bộ logo; hero có ảnh nổi lệch pha và marquee nâu phấn. `HomeAmbient` chỉ dùng PNG vật phẩm cưới chân thật, không dùng icon thư viện; carousel 6 mẫu cover-flow 3D thay gallery template cũ, tự chuyển, pause khi tương tác. Guest experience có ảnh trang trí và mọi chuyển động có reduced-motion fallback.
- Platform admin có prototype đăng nhập riêng tại `/gmm_admin/login`, nằm ngoài admin shell; xác thực server, MFA, rate limit và route guard chưa kết nối. Kho thiệp và kho website admin đã chuyển sang catalog card có preview, version, trạng thái, usage, search/filter phía client.
- Dùng Inter cho operational UI và Phosphor icons; copper-amber accent tiết chế. Font cưới chỉ dùng preview/brand, không dùng bảng/form.
- Thư viện 11 font cưới self-host nằm tại `frontend/public/assets/fonts/`, khai báo trong `app/styles/fonts.css` và registry tại `shared/config/wedding-fonts.ts`. Mỗi template chọn 1 display + 1 body + tối đa 1 accent; Verdant Promise dùng Fraunces/Nunito Sans/Dancing Script còn Élan d’Amour dùng Cormorant Garamond/Be Vietnam Pro/Dancing Script. Tất cả có Vietnamese subset và SIL OFL; xem `docs/frontend/online-invitations/typography-and-fonts.md`.
- Login desktop dùng ảnh thiệp cưới Pexels đã ghi nguồn tại `assets/ASSET_SOURCES.md`, crop và phủ overlay tối để bảo đảm chữ trắng dễ đọc và nội dung in trên thiệp không rõ.
- `WeddingAmbient` là lớp trang trí dùng chung cho owner workspace và login; login dùng biến thể contained với PNG AI trong suốt, hoa/cánh thiệp chuyển động nhẹ và luôn tắt theo `prefers-reduced-motion`.
- Platform admin sidebar chia nhóm và tối đa hai cấp: quản lý nền tảng (user, wedding, subscription), kho giao diện tách thiệp/website, danh mục phong cách tách thiệp/website, kiểm duyệt và vận hành.
- `/gmm_admin/users` có prototype mock responsive với search/filter, selection, bảng desktop và card mobile; API, guard, audit và mutation thật chưa kết nối.
- Todo là module cộng tác theo wedding; sổ tiền mừng là owner-only privacy boundary; Wedding Recap có draft/slug/immutable snapshot riêng và tái sử dụng media/wish/template registry. Xem ADR 0005.

## Working agreements

- Đọc `docs/README.md` và tài liệu liên quan trước thay đổi lớn.
- Mọi Google/web search dùng repo skill `.agents/skills/web-research-agent`: giao cho sub-agent chuyên research và chỉ đưa brief có nguồn về context chính; xem `docs/shared/workflows/web-research-workflow.md`.
- Khi build admin page, đọc `design-system/MASTER.md` rồi kiểm tra override trong `design-system/pages/`.
- Owner Workspace foundation đã triển khai trong `frontend/`: React 18, Vite 6, app shell, dashboard mock, trang quản lý khách mời responsive và các module placeholder còn lại.
- Frontend source tuân theo Feature-Sliced Design (`app → pages/widgets → features → entities → shared`); xem ADR 0002.
- Admin visual direction là daylight wedding workspace: off-white canvas, translucent white surfaces 72-78%, graphite text và copper-amber accent hợp mệnh Kim/Thổ; ambient layer dùng phong thư, lông vũ, bồ công anh, bong bóng và cánh hoa chuyển động thưa, độ tương phản thấp trong gutter, kèm reduced-motion fallback.
- Frontend yêu cầu Node >=20; Docker pin Node 20 và dùng Nginx unprivileged runtime.
- Navigation dùng internal History API adapter theo `docs/shared/architecture/adr/0001-frontend-navigation-history-api.md`; không thêm React Router lại nếu chưa rà security advisory.
- Route constants tập trung tại `frontend/src/shared/config/routes.ts`. Owner URL không chứa wedding ID; workspace switcher giữ wedding hiện hành, còn API vẫn authorize resource theo ID. URL `/app/weddings/:weddingId/*` cũ được chuyển hướng tương thích.
- Production `npm audit --omit=dev` hiện sạch. Dev audit còn advisory DoS transitive trong ESLint/minimatch; không dùng `npm audit fix --force` vì đề xuất downgrade sai.
- Dashboard, Guests, Guest Categories, RSVP, Wishes và Templates dùng mock data. Guests đã có search theo tên, lọc xác nhận tham dự/nhóm, selection/bulk actions phía client, bảng compact 50 dòng/trang trên desktop và card list trên mobile; contact/email không hiển thị trong primary directory. RSVP đã có summary, search, lọc trạng thái/sự kiện, table desktop và card mobile. Wishes đã có tabs/count, tìm kiếm, duyệt, ẩn, ghim, khôi phục và feedback. Templates có gallery 6 theme, lọc, preview và chọn theme; API, import wizard, detail sheet, server pagination và editor chi tiết chưa kết nối; editor/analytics/settings vẫn là route placeholder.
- Owner navigation phân biệt `Thiệp online` (nhiều lời mời/slug cá nhân hóa) và `Website cưới` (một website chung cho mỗi wedding).
- Owner navigation có Todolist `/studio/todos` và Sổ tiền mừng `/studio/gift-ledger`, cả hai đã có prototype responsive phía client. Wedding Recap nằm trong `Hiện diện online`, gồm `/studio/recap/themes` và `/studio/recap`; recap còn placeholder và chưa có API.
- `Danh mục khách mời` là child-nav của `Khách mời`, route `/studio/guests/categories`; prototype dùng cây self-reference tối đa 3 cấp và mock data. Domain bổ sung `GuestCategory`, tách khỏi group/tag hiện có.
- Giữ FE/BE tách riêng nếu chưa có quyết định mới.
- API/data/architecture change cập nhật tài liệu trong `docs/backend/` và ADR tại `docs/shared/architecture/adr/` khi quyết định ảnh hưởng dài hạn hoặc xuyên app.
- Không commit secret, `.env`, PII, DB dump hoặc asset không rõ quyền.
- Không tự mở rộng MVP sang drag-drop, billing/custom domain/marketplace.
- Khi scaffold source: `.env.example`, strict TypeScript, lint/typecheck/test/build, multi-stage Dockerfile, `.dockerignore`, Compose và CI image smoke test từ đầu.
