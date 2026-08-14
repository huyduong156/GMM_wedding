# Design specialist agents

## Mục tiêu

Chia tác vụ thiết kế cho sub-agent theo lĩnh vực để agent chính không nạp đồng thời toàn bộ hướng dẫn UI, React, motion, 3D, mobile và SEO. Agent chính giữ brief sản phẩm, tích hợp kết quả và chạy validation cuối.

Mọi skill trong workflow này nằm tại `.agents/skills/`; không cài hoặc sửa `$CODEX_HOME/skills` và không ảnh hưởng repository khác.

## Specialist roster

| Agent | Khi gọi | Skill repo-local phải đọc | Kết quả trả về |
|---|---|---|---|
| `visual_direction_agent` | Theme public, landing, thiệp, website cưới, recap | `frontend-design`, `design`, `ui-ux-pro-max`; có thể thêm `design-taste-frontend` như góc audit | Art direction, composition map, token/pattern, anti-pattern và mobile fallback |
| `decor_image_agent` | Tạo hoa, lá, cánh hoa, ribbon, stationery, vật phẩm và ornament thuộc renderer cho section/body web | `generate-wedding-decor`; chỉ thêm `imagegen` khi bắt đầu tạo hoặc sửa bitmap | Asset brief theo vai trò, prompt, cutout độc lập, QA nền trong suốt, placement notes và provenance manifest |
| `react_quality_agent` | Sau khi có UI React hoặc trước production | `react-best-practices`, `web-design-guidelines` | Lỗi theo mức độ và patch hẹp về render, performance, accessibility, responsive |
| `motion_agent` | Scroll storytelling, ambient motion, transitions, particle, CSS/GSAP motion | `web-animation-design`, `animation-systems`, `ambient-section-particles`, `cinematic-gsap-lenis-motion-system`, `scroll-world-storytelling` | Motion map, timing/easing, performance budget và reduced-motion fallback |
| `spatial_3d_agent` | Skill cards 3D, category spheres/orbs, procedural motion, WebGL/Three.js UI | `threejs`, `webgl-3d-object`, `thinking-orbs`; thêm `remotion-best-practices` khi output là video | Scene graph, camera/input model, 2D fallback, DPR/asset budget |
| `mobile_design_agent` | Mobile-first app hoặc interaction touch riêng | `design-mobile-apps`, `web-design-guidelines` | Mobile composition, touch behavior, safe areas và density/performance constraints |
| `seo_agent` | Public surface trước release | `seo-audit` | Metadata, crawl/indexability, semantic content, structured data và fixes ưu tiên |
| `design_review_agent` | Gate cuối sau tích hợp | `web-design-guidelines`, `ui-ux-pro-max`; thêm `react-best-practices` cho React | Review độc lập, regression và release blockers |

## Quy trình gọi

1. Agent chính hoàn thành preflight `Docs compliance manifest` theo `docs/frontend/theme-authoring-compliance.md`, đọc đầy đủ context và toàn bộ docs liên quan được route từ README surface; sau đó viết brief hẹp: surface, audience, art direction, media contract, breakpoint, performance và acceptance criteria.
2. Chỉ spawn specialist liên quan; không spawn cả roster mặc định.
3. Specialist chỉ đọc `SKILL.md` trong hàng của mình và tài liệu repo được chỉ định; không tải toàn bộ catalog.
4. Specialist trả brief dưới khoảng 1.200 từ hoặc patch hẹp. Raw research/thử nghiệm không đưa vào context chính.
5. Agent chính tích hợp, bảo vệ contract/editor behavior và chạy typecheck/test/build.
6. Với thay đổi rủi ro cao, gọi `design_review_agent` sau cùng trên diff đã tích hợp.
7. Trước release, agent chính đọc lại cùng bộ docs ở postflight, điền evidence cho từng rule và reject theme nếu manifest/artifact thiếu hoặc implementation lệch spec.

### Luồng tạo ảnh decor

1. `visual_direction_agent` chỉ chốt art direction, palette, vật liệu, nhịp section và các vai trò asset cần có; không mô tả một ảnh decor như screenshot/layout hoàn chỉnh.
2. Gọi `decor_image_agent` cho từng family asset. Mặc định đầu ra là vật thể hoặc cụm vật thể độc lập, silhouette hoàn chỉnh và nền trong suốt; background/scene là deliverable riêng khi brief yêu cầu rõ.
3. Không bắt buộc cành cây, khung, vòm, card, căn phòng hoặc một bố cục nền để asset “đứng được”. Các thành phần đó chỉ xuất hiện khi chính chúng là subject đã được chốt.
4. Agent chính chỉ tích hợp asset vượt qua kiểm tra cạnh alpha, độ sắc nét, ánh sáng/palette nhất quán, crop linh hoạt, mobile size và nền sáng/tối. Ghi provenance vào `assets/ASSET_SOURCES.md` trước release.
5. Link tham khảo chỉ dùng để mô tả phẩm chất thị giác đã duyệt. Không hotlink, sao chép pixel/composition hoặc coi trang tổng hợp PNG là bằng chứng license.
6. Với asset dùng giữa viewport/section, `decor_image_agent` phải reject mọi border, frame, mép giấy, rectangle crop, vignette biên hoặc background patch; chỉ chấp nhận biên tự nhiên của chủ thể với alpha sạch.
7. `visual_direction_agent` lập asset usage map trước khi gen. Theme dài mặc định cần tối thiểu 6 artwork khác nhau ở ít nhất 4 vai trò; không lặp một artwork nổi bật ở section kề nhau hoặc quá 2 lần toàn trang.
8. Trước khi gen/tải, `visual_direction_agent` khóa `decor family bible`: medium/realism, palette/saturation, light direction/softness, perspective/camera, shadow, alpha/edge finish, anatomy và detail density. `decor_image_agent` dùng cùng bible cho mọi prompt và trả contact sheet để review cả family; reject asset lạc medium, ánh sáng, perspective hoặc finish dù đứng riêng vẫn đẹp.
9. Strong-subject theme như Winter, Sakura/Cherry Blossom, Forest, Hydrangea hoặc một environmental world cụ thể bắt buộc gọi `decor_image_agent` và tạo decor family renderer-owned trước khi khóa composition. Không được thay bước này bằng gradient, ảnh user upload hoặc vài asset lặp lại.

### Luồng motion và section continuity

1. `visual_direction_agent` lập section seam map và motion map cùng lúc với composition, không để motion là lớp bổ sung sau khi layout đã khóa.
2. `motion_agent` thiết kế một signature interaction và 2–4 lớp hỗ trợ; theme dài phải đánh giá ít nhất một pattern 3D/spatial hoặc scroll-driven. Fade-in đồng loạt không đủ để qua review.
3. Với 3D slide/carousel hoặc pinned/horizontal story, phối hợp `spatial_3d_agent` khi có scene/camera/depth thật; luôn có control, keyboard, mobile 2D và reduced-motion static fallback.
4. Smooth scroll chỉ là progressive enhancement trên desktop/fine-pointer; giữ native scroll trên touch/reduced motion và không phá anchor, focus, keyboard hoặc history.
5. Mọi cặp section có thể kề nhau do bật/tắt/reorder phải nối màu, texture, foreground và motion tự nhiên. Gradient kết ở màu nào thì section kế tiếp mở bằng màu đó hoặc có bridge/mask/overlap che seam; test tại đúng đường nối, không chỉ screenshot giữa section.
5a. Không thiết kế seam theo index cố định. Mỗi section cung cấp entry/exit visual state và transition capability; agent chính lập allowed-adjacency matrix, resolve bridge theo cặp section thực tế và test ít nhất ba permutation cùng từng optional section bị tắt.
6. `motion_agent` lập thêm living-state map cho thời gian user dừng đọc: chọn 2–3 motif ambient đúng chủ đề, phân bố theo chapter, ghi quiet zone, density, số layer đồng thời, điều kiện start/pause và reduced-motion fallback.
7. Một viewport chỉ chạy tối đa 2 ambient system cùng lúc và chỉ một system có vật thể di chuyển rõ. Entrance reveal không được replay do scroll nhỏ; ambient loop phải pause ngoài viewport, khi tab ẩn, modal/critical task mở và cleanup khi unmount.
8. Review theme bằng cách dừng 8–12 giây ở từng chapter chính. Nếu toàn bộ composition đứng yên sau reveal, hoặc ngược lại chuyển động cạnh tranh với nội dung, theme chưa qua motion gate.

### Luồng theme story và layered spatial design

1. `visual_direction_agent` phải trả `theme thesis`, story spine từ opening tới closing và `section-theme matrix`. Mỗi section ghi chapter role, transition in/out và ít nhất ba dấu hiệu renderer-owned để vẫn đúng theme khi user media bị thay bằng placeholder.
2. `design_review_agent` reject section generic chỉ đổi palette/ảnh, section không phát triển câu chuyện hoặc theme chỉ nhận diện được ở hero. Review media-independence riêng từng section, không chỉ toàn trang.
3. Theme có art direction 3D mạnh phải có ít nhất hai spatial focal section khác vai trò. `spatial_3d_agent` lập scene graph gồm far background, background depth, content, occluder, foreground, atmosphere và interaction plane; tối thiểu bốn mặt phẳng nhìn thấy rõ. Theme khác không bị ép 3D.
4. Dùng occlusion có kiểm soát để tạo cảm giác nhìn xuyên qua foreground tới content và thế giới phía sau. Mobile giảm layer nhưng giữ background–content–foreground; reduced motion giữ composition tĩnh có depth.
5. Ưu tiên DOM/CSS perspective + Motion/GSAP cho ảnh/SVG plane và paper theatre. Chỉ gọi Three.js khi cần camera, mesh, material/light, shader hoặc occlusion 3D thật; không dùng WebGL chỉ để parallax vài PNG.
6. Agent chính test story và scene khi user media neutral, optional section off/reorder, JavaScript motion off và reduced motion. Nếu theme mất nhận diện, story đứt hoặc scene trở thành background phẳng có chữ đè lên, không release.
7. Mọi theme dài phải có ít nhất ba loại trải nghiệm khác vai trò. Với theme không thiên 3D, dùng scroll choreography, gallery interaction, ambient living-state, material/light transition, typography motion hoặc microinteraction để tạo đa dạng mà không làm sai art direction.
8. `visual_direction_agent` lập section composition map và reject `background + text` như layout mặc định. Mỗi section cần một primary composition cùng một supporting layer; không quá một phần ba section tối giản và không có hai section tối giản liền nhau, kể cả sau reorder.
9. Theme dài cần ít nhất một split/sticky hoặc scroll-synced composition và một media interaction như controlled carousel/collage/gallery, hoặc pattern khác được review là phong phú tương đương. Fallback mobile/missing-media/reduced-motion không được biến chúng thành vùng text trống.

## Nguyên tắc surface

- Thiệp online, website cưới và recap được phối hợp nhiều specialist để tạo art direction riêng. `design-taste-frontend` là nguồn đánh giá, không phải luật ép các theme giống nhau.
- Admin và owner management UI ưu tiên consistency hệ thống; phải giữ design system hiện có và đọc tài liệu admin/editor bắt buộc.
- Media upload là content, không gánh theme identity. Specialist kiểm tra theme bằng ảnh trung tính/khác art direction.
- Decor thuộc renderer phải ưu tiên cutout độc lập, sắc nét, chân thật hoặc đúng medium đã chốt và dễ phối trên nhiều section. Tránh ảnh gen sẵn cả layout, background, cành/khung bắt buộc hoặc khoảng trống typography giả khiến FE chỉ dùng được tại một tọa độ.
- Audit điểm giao section như một composition chung: background, ánh sáng, texture, decor và chuyển động phải nối tự nhiên.

## Mapping 3D và motion

- “Skill Cards in 3D Space”: `threejs` + `webgl-3d-object`.
- “Category Spheres/Orbs”: `thinking-orbs` + `threejs`.
- “Procedural Motion”: `animation-systems`; thêm `ambient-section-particles` hoặc `cinematic-gsap-lenis-motion-system` theo surface.
- “3d-ui”: gọi `spatial_3d_agent`; chưa coi là package riêng khi chưa có repository URL chính xác.
- Remotion chưa có top-level skill `3d` được xác minh; hướng dẫn 3D nằm trong `remotion-best-practices`. Chỉ dùng Remotion khi deliverable là video/composition.
- `css-animation-creator`, “Agent Skills Library” và “Aura Skills” chưa có nguồn duy nhất. Không tự cài bằng tên; cần URL repo cụ thể và xác minh trước.

## Cài đặt repo-local

Skill mới phải dùng Codex installer với `--dest .agents/skills`:

```powershell
python "$env:USERPROFILE\.codex\skills\.system\skill-installer\scripts\install-skill-from-github.py" `
  --repo owner/repository `
  --path path/to/skill `
  --dest .agents/skills
```

Không dùng destination mặc định vì sẽ ghi vào phạm vi người dùng và ảnh hưởng repository khác.
