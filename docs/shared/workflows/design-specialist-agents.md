# Design specialist agents

## Mục tiêu

Chia tác vụ thiết kế cho sub-agent theo lĩnh vực để agent chính không nạp đồng thời toàn bộ hướng dẫn UI, React, motion, 3D, mobile và SEO. Agent chính giữ brief sản phẩm, tích hợp kết quả và chạy validation cuối.

Mọi skill trong workflow này nằm tại `.agents/skills/`; không cài hoặc sửa `$CODEX_HOME/skills` và không ảnh hưởng repository khác.

## Domain theme agents (mandatory)

Theme authoring is routed through exactly one domain agent before any renderer/config/asset work starts:

| Product type | Agent instruction | Section rules |
|---|---|---|
| Online Invitation | `.agents/agents/invitation-theme-agent/AGENT.md` | `docs/frontend/online-invitations/` |
| Wedding Website | `.agents/agents/wedding-website-theme-agent/AGENT.md` | `docs/frontend/wedding-websites/` |
| Wedding Recap | `.agents/agents/wedding-recap-theme-agent/AGENT.md` | `docs/frontend/wedding-recaps/` |

All three agents must read `docs/frontend/theme-authoring/README.md` first. The common document owns asset generation, media-independence, motion, auto-animation, responsive/reduced-motion behavior, file structure, `template-config.ts` and release quality gates. The domain document owns only the product-specific content, semantic sections and purpose.

The main agent must not substitute one domain agent for another, and must not start theme implementation if the selected agent has not produced its pre-code brief and acceptance map.

The three surfaces must remain intentionally different:

- Invitation: receive/open an invitation and quickly act on wedding details.
- Wedding Website: explore a public wedding story and find event/venue/RSVP information.
- Wedding Recap: revisit a completed wedding, explore memories, receive photos and end with gratitude.

If the proposed hero, navigation, copy, section order or interaction could be moved to another product without meaningful changes, the domain agent must stop and revise the brief before implementation.

## Specialist roster

| Agent | Khi gọi | Skill repo-local phải đọc | Kết quả trả về |
|---|---|---|---|
| `visual_direction_agent` | Theme public, landing, thiệp, website cưới, recap | `frontend-design`, `design`, `ui-ux-pro-max`; có thể thêm `design-taste-frontend` như góc audit | Art direction, composition map, token/pattern, anti-pattern và mobile fallback |
| `react_quality_agent` | Sau khi có UI React hoặc trước production | `react-best-practices`, `web-design-guidelines` | Lỗi theo mức độ và patch hẹp về render, performance, accessibility, responsive |
| `motion_agent` | Scroll storytelling, ambient motion, transitions, particle, CSS/GSAP motion | `web-animation-design`, `animation-systems`, `ambient-section-particles`, `cinematic-gsap-lenis-motion-system`, `scroll-world-storytelling` | Motion map, timing/easing, performance budget và reduced-motion fallback |
| `spatial_3d_agent` | Skill cards 3D, category spheres/orbs, procedural motion, WebGL/Three.js UI | `threejs`, `webgl-3d-object`, `thinking-orbs`; thêm `remotion-best-practices` khi output là video | Scene graph, camera/input model, 2D fallback, DPR/asset budget |
| `mobile_design_agent` | Mobile-first app hoặc interaction touch riêng | `design-mobile-apps`, `web-design-guidelines` | Mobile composition, touch behavior, safe areas và density/performance constraints |
| `seo_agent` | Public surface trước release | `seo-audit` | Metadata, crawl/indexability, semantic content, structured data và fixes ưu tiên |
| `design_review_agent` | Gate cuối sau tích hợp | `web-design-guidelines`, `ui-ux-pro-max`; thêm `react-best-practices` cho React | Review độc lập, regression và release blockers |

## Quy trình gọi

1. Agent chính đọc context/docs bắt buộc và viết brief hẹp: surface, audience, art direction, media contract, breakpoint, performance và acceptance criteria.
2. Chỉ spawn specialist liên quan; không spawn cả roster mặc định.
3. Specialist chỉ đọc `SKILL.md` trong hàng của mình và tài liệu repo được chỉ định; không tải toàn bộ catalog.
4. Specialist trả brief dưới khoảng 1.200 từ hoặc patch hẹp. Raw research/thử nghiệm không đưa vào context chính.
5. Agent chính tích hợp, bảo vệ contract/editor behavior và chạy typecheck/test/build.
6. Bắt buộc gọi `design_review_agent` hoặc skill review UI tương đương để đọc/render lại toàn bộ screen trước khi hoàn tất; review phải bao phủ required/optional sections, responsive, reduced motion, asset independence và lỗi visual/runtime.
7. Kiểm tra `template-config.ts` lần cuối sau review screen, bảo đảm config khớp renderer/editor/catalog trước khi admin publish/sync.

## Nguyên tắc surface

- Thiệp online, website cưới và recap được phối hợp nhiều specialist để tạo art direction riêng. `design-taste-frontend` là nguồn đánh giá, không phải luật ép các theme giống nhau.
- Admin và owner management UI ưu tiên consistency hệ thống; phải giữ design system hiện có và đọc tài liệu admin/editor bắt buộc.
- Media upload là content, không gánh theme identity. Specialist kiểm tra theme bằng ảnh trung tính/khác art direction.
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
